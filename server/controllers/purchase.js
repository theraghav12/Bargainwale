import Purchase from "../models/purchase.js";
import Warehouse from "../models/warehouse.js";
import Order from "../models/orders.js";
import Transport from "../models/transport.js";

const purchaseController = {
  createPurchase: async (req, res) => {
    try {
      const { warehouseId, transporterId, orderId, items, invoiceDate } =
        req.body;

      // Fetch the warehouse for the current purchase
      const currentWarehouse = await Warehouse.findById(warehouseId);
      if (!currentWarehouse) {
        return res.status(404).json({ message: "Current Warehouse not found" });
      }

      // Fetch the order document
      const orderDocument = await Order.findById(orderId).populate(
        "items.item"
      );
      if (!orderDocument) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Fetch the warehouse from the order
      const orderWarehouse = await Warehouse.findById(
        orderDocument.warehouseId
      );
      if (!orderWarehouse) {
        return res.status(404).json({ message: "Order's Warehouse not found" });
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

        // Adjust virtual inventory in order's warehouse and billed inventory in current warehouse
        const virtualInventoryItem = orderWarehouse.virtualInventory.find(
          (i) => i.item.toString() === itemId.toString()
        );

        let billedInventoryItem = currentWarehouse.billedInventory.find(
          (i) => i.item.toString() === itemId.toString()
        );

        // Handle the inventory transfer
        if (virtualInventoryItem) {
          if (virtualInventoryItem.quantity >= quantity) {
            virtualInventoryItem.quantity -= quantity; // Reduce virtual quantity in the order's warehouse

            // Increase billed quantity in the current warehouse
            if (billedInventoryItem) {
              billedInventoryItem.quantity += quantity;
            } else {
              currentWarehouse.billedInventory.push({
                item: itemId,
                quantity,
              });
            }
          } else {
            return res.status(400).json({
              success: false,
              message: `Insufficient virtual inventory in order's warehouse for item ${itemId}`,
            });
          }
        } else {
          return res.status(400).json({
            success: false,
            message: `Item ${itemId} not found in virtual inventory of order's warehouse`,
          });
        }
      }

      // Update the order status based on payment
      if (isFullyPaid && !isPartiallyPaid) {
        orderDocument.status = "billed";
      } else if (isPartiallyPaid) {
        orderDocument.status = "partially paid";
      }
      await orderDocument.save();
      await orderWarehouse.save(); // Save updates to order's warehouse
      await currentWarehouse.save(); // Save updates to the current warehouse

      // Create and save the new purchase
      const newPurchase = new Purchase({
        warehouseId,
        transporterId,
        orderId,
        items,
        invoiceDate,
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
        .populate("warehouseId")
        .populate("transporterId")
        .populate("orderId")
        .populate("items.itemId");

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

      // Fetch the warehouse where the items were billed
      const billedWarehouse = await Warehouse.findById(purchase.warehouseId);
      if (!billedWarehouse) {
        return res.status(404).json({
          success: false,
          message: "Billed warehouse not found",
        });
      }

      // Fetch the warehouse from the associated order where virtual inventory was reduced
      const order = await Order.findById(purchase.orderId).populate(
        "warehouseId"
      );
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      const orderWarehouse = order.warehouseId;

      // Loop through each item in the purchase and adjust inventory accordingly
      for (const item of purchase.items) {
        const { itemId, quantity } = item;

        // Adjust the billed warehouse inventory
        const billedInventoryItem = billedWarehouse.billedInventory.find(
          (i) => i.item.toString() === itemId.toString()
        );

        if (billedInventoryItem) {
          billedInventoryItem.quantity -= quantity;
          if (billedInventoryItem.quantity <= 0) {
            billedWarehouse.billedInventory =
              billedWarehouse.billedInventory.filter(
                (i) => i.item.toString() !== itemId.toString()
              );
          }
        }

        // Adjust the order's warehouse virtual inventory
        const orderVirtualInventoryItem = orderWarehouse.virtualInventory.find(
          (i) => i.item.toString() === itemId.toString()
        );

        if (orderVirtualInventoryItem) {
          orderVirtualInventoryItem.quantity += quantity;
        } else {
          // If the item doesn't exist in virtualInventory, add it back
          orderWarehouse.virtualInventory.push({
            item: itemId,
            quantity,
          });
        }
      }

      // Check the remaining purchases for the order to update its status
      const remainingPurchases = await Purchase.find({
        orderId: purchase.orderId,
      });

      let isPartiallyPaid = false;
      let isFullyPaid = true;

      const previousPurchaseQuantities = {};

      for (const remainingPurchase of remainingPurchases) {
        for (const remainingItem of remainingPurchase.items) {
          if (!previousPurchaseQuantities[remainingItem.itemId]) {
            previousPurchaseQuantities[remainingItem.itemId] = 0;
          }
          previousPurchaseQuantities[remainingItem.itemId] +=
            remainingItem.quantity;
        }
      }

      for (const orderItem of order.items) {
        const totalPurchasedQuantity =
          previousPurchaseQuantities[orderItem.item._id.toString()] || 0;

        if (totalPurchasedQuantity < orderItem.quantity) {
          isPartiallyPaid = true;
          isFullyPaid = false;
        }
      }

      if (isFullyPaid && !isPartiallyPaid) {
        order.status = "billed";
      } else if (isPartiallyPaid) {
        order.status = "partially paid";
      } else {
        order.status = "created";
      }
      await order.save();

      // Save changes to both warehouses
      await orderWarehouse.save();
      await billedWarehouse.save();

      // Finally, delete the purchase
      await Purchase.findByIdAndDelete(req.params.id);

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
