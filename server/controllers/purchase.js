import Purchase from "../models/purchase.js";
import Warehouse from "../models/warehouse.js";
import Order from "../models/orders.js";
import Transport from "../models/transport.js";

const purchaseController = {
  createPurchase: async (req, res) => {
    try {
      const { warehouseId, transporterId, orderId, items } = req.body;

      // Fetch the warehouse and order documents
      const warehouseDocument = await Warehouse.findById(warehouseId);
      if (!warehouseDocument) {
        return res.status(404).json({ message: "Warehouse not found" });
      }

      const orderDocument = await Order.findById(orderId).populate(
        "items.item"
      );
      if (!orderDocument) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (orderDocument.status === "billed") {
        return res.status(400).json({
          success: false,
          message: "Purchase cannot be created for a fully billed order",
        });
      }

      // Retrieve all previous purchases for this order
      const previousPurchases = await Purchase.find({ orderId });
      const previousPurchaseQuantities = {};

      for (const purchase of previousPurchases) {
        for (const item of purchase.items) {
          if (!previousPurchaseQuantities[item.itemId]) {
            previousPurchaseQuantities[item.itemId] = 0;
          }
          previousPurchaseQuantities[item.itemId] += item.quantity;
        }
      }

      let isPartiallyPaid = false;
      let isFullyPaid = true;

      // Process each item in the purchase
      for (const item of items) {
        const { itemId, quantity } = item;

        // Find the order item
        const orderItem = orderDocument.items.find(
          (i) => i.item._id.toString() === itemId.toString()
        );

        if (!orderItem) {
          return res.status(400).json({
            success: false,
            message: `Item not found in order`,
          });
        }

        // Calculate the total quantity purchased so far for this item
        const totalPurchasedQuantity =
          (previousPurchaseQuantities[itemId] || 0) + quantity;

        // Check if the purchase quantity exceeds the order quantity
        if (totalPurchasedQuantity > orderItem.quantity) {
          return res.status(400).json({
            success: false,
            message: `Item ${itemId} is being purchased more than what was ordered`,
          });
        }

        // Determine the status of the order based on purchases
        if (totalPurchasedQuantity < orderItem.quantity) {
          isPartiallyPaid = true;
          isFullyPaid = false;
        }

        // Adjust virtual and billed inventory
        const virtualInventoryItem = warehouseDocument.virtualInventory.find(
          (i) => i.item.toString() === itemId.toString()
        );

        const soldInventoryItem = warehouseDocument.soldInventory.find(
          (i) => i.item.toString() === itemId.toString()
        );

        let billedInventoryItem = warehouseDocument.billedInventory.find(
          (i) => i.item.toString() === itemId.toString()
        );

        if (soldInventoryItem) {
          if (soldInventoryItem.virtualQuantity >= quantity) {
            soldInventoryItem.virtualQuantity -= quantity;

            if (billedInventoryItem) {
              billedInventoryItem.quantity += quantity;
            } else {
              warehouseDocument.billedInventory.push({
                item: itemId,
                quantity,
              });
            }
          } else {
            const remainingQuantity =
              quantity - soldInventoryItem.virtualQuantity;
            soldInventoryItem.virtualQuantity = 0;

            if (billedInventoryItem) {
              billedInventoryItem.quantity += remainingQuantity;
            } else {
              warehouseDocument.billedInventory.push({
                item: itemId,
                quantity: remainingQuantity,
              });
            }

            if (virtualInventoryItem) {
              if (virtualInventoryItem.quantity >= remainingQuantity) {
                virtualInventoryItem.quantity -= remainingQuantity;
              } else {
                return res.status(400).json({
                  success: false,
                  message:
                    "Buying more than what is available in virtual inventory",
                });
              }
            } else {
              return res.status(400).json({
                success: false,
                message: `Purchasing item that is not in virtual inventory`,
              });
            }
          }
        } else {
          if (virtualInventoryItem) {
            if (virtualInventoryItem.quantity >= quantity) {
              virtualInventoryItem.quantity -= quantity;

              if (billedInventoryItem) {
                billedInventoryItem.quantity += quantity;
              } else {
                warehouseDocument.billedInventory.push({
                  item: itemId,
                  quantity,
                });
              }
            } else {
              return res.status(400).json({
                success: false,
                message:
                  "Buying more than what is available in virtual inventory",
              });
            }
          } else {
            return res.status(400).json({
              success: false,
              message: `Purchasing item that is not in virtual inventory`,
            });
          }
        }
      }

      // Update the order status based on payment
      if (isFullyPaid && !isPartiallyPaid) {
        orderDocument.status = "billed";
      } else if (isPartiallyPaid) {
        orderDocument.status = "partially paid";
      }
      await orderDocument.save();
      await warehouseDocument.save();

      // Create and save the new purchase
      const newPurchase = new Purchase({
        warehouseId,
        transporterId,
        orderId,
        items,
      });

      await newPurchase.save();

      res.status(201).json({
        success: true,
        message: "Purchase created successfully",
        data: newPurchase,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create purchase",
        error: error.message,
      });
    }
  },
  getAllPurchases: async (req, res) => {
    try {
      const purchases = await Purchase.find()
        .populate("warehouseId") // Populates the warehouse details
        .populate("transporterId") // Populates the transporter details
        .populate("orderId") // Populates the order details
        .populate("items.item"); // Populates the item details in the items array

      res.status(200).json({
        success: true,
        data: purchases,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve purchases",
        error: error.message,
      });
    }
  },

  getPurchaseById: async (req, res) => {
    try {
      const purchase = await Purchase.findById(req.params.id)
        .populate("warehouseId") // Populates the warehouse details
        .populate("transporterId") // Populates the transporter details
        .populate("orderId") // Populates the order details
        .populate("items.item"); // Populates the item details in the items array

      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: "Purchase not found",
        });
      }

      res.status(200).json({
        success: true,
        data: purchase,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve purchase",
        error: error.message,
      });
    }
  },

  deletePurchase: async (req, res) => {
    try {
      const purchase = await Purchase.findById(req.params.id);
      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: "Purchase not found",
        });
      }

      const warehouse = await Warehouse.findById(purchase.warehouseId);
      if (!warehouse) {
        return res.status(404).json({
          success: false,
          message: "Warehouse not found",
        });
      }

      for (const item of purchase.items) {
        const { itemId, quantity } = item;

        const virtualInventoryItem = warehouse.virtualInventory.find(
          (i) => i.item.toString() === itemId.toString()
        );

        const billedInventoryItem = warehouse.billedInventory.find(
          (i) => i.item.toString() === itemId.toString()
        );

        if (billedInventoryItem) {
          billedInventoryItem.quantity -= quantity;
          if (billedInventoryItem.quantity === 0) {
            warehouse.billedInventory = warehouse.billedInventory.filter(
              (i) => i.item.toString() !== itemId.toString()
            );
          }
          if (virtualInventoryItem) {
            virtualInventoryItem.quantity += quantity;
          } else {
            warehouse.virtualInventory.push({
              item: itemId,
              quantity,
            });
          }
        } else {
          if (virtualInventoryItem) {
            virtualInventoryItem.quantity += quantity;
          } else {
            warehouse.virtualInventory.push({
              item: itemId,
              quantity,
            });
          }
        }
      }

      const order = await Order.findById(purchase.orderId);
      if (order) {
        const remainingPurchases = await Purchase.find({
          orderId: purchase.orderId,
        });

        let isPartiallyPaid = false;
        let isFullyPaid = true;

        for (const purchase of remainingPurchases) {
          for (const item of purchase.items) {
            const orderItem = order.items.find(
              (i) => i.item._id.toString() === item.itemId.toString()
            );
            if (orderItem) {
              const totalPurchasedQuantity =
                (previousPurchaseQuantities[item.itemId] || 0) + item.quantity;
              if (totalPurchasedQuantity < orderItem.quantity) {
                isPartiallyPaid = true;
                isFullyPaid = false;
              }
            }
          }
        }

        if (isFullyPaid && !isPartiallyPaid) {
          order.status = "billed";
        } else if (isPartiallyPaid) {
          order.status = "partially paid";
        } else {
          order.status = "not paid";
        }
        await order.save();
      }

      await Purchase.findByIdAndDelete(req.params.id);
      await warehouse.save();

      res.status(200).json({
        success: true,
        message: "Purchase deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete purchase",
        error: error.message,
      });
    }
  },
};

export default purchaseController;
