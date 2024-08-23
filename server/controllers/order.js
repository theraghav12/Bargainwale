import Order from "../models/orders.js";
import Warehouse from "../models/warehouse.js";

const orderController = {
  createOrder: async (req, res) => {
    try {
      const {
        companyBargainDate,
        items,
        companyBargainNo,
        sellerName,
        sellerLocation,
        sellerContact,
        billType,
        status,
        description,
        organization,
        warehouse,
        transportLocation,
        transportType,
        paymentDays = 21,
        reminderDays = [7, 3, 1],
      } = req.body;

      const order = new Order({
        companyBargainDate: new Date(companyBargainDate),
        items,
        companyBargainNo,
        sellerName,
        sellerLocation,
        sellerContact,
        billType,
        status,
        description,
        organization,
        warehouse,
        transportLocation,
        transportType,
        paymentDays,
        reminderDays,
      });

      await order.save();
      console.log("Warehouse ID:", warehouse); // Log the warehouse ID being searched

      let warehouseDocument = await Warehouse.findById(warehouse);
      if (!warehouseDocument) {
        return res.status(404).json({ message: "Warehouse not found" });
      }

      const processItem = (inventoryArray, itemName) => {
        return inventoryArray.find((i) => i.itemName === itemName);
      };

      for (const item of items) {
        const { name, weight, quantity } = item;

        if (billType === "Virtual Billed") {
          let existingVirtualInventoryItem = processItem(
            warehouseDocument.virtualInventory,
            name
          );
          if (!existingVirtualInventoryItem) {
            warehouseDocument.virtualInventory.push({
              itemName: name,
              weight,
              quantity,
            });
            warehouseDocument.billedInventory.push({
              itemName: name,
              weight,
              quantity: 0,
            });
          } else {
            existingVirtualInventoryItem.quantity += quantity;
          }
        } else {
          let existingVirtualInventoryItem = processItem(
            warehouseDocument.virtualInventory,
            name
          );
          let existingBilledInventoryItem = processItem(
            warehouseDocument.billedInventory,
            name
          );

          if (!existingBilledInventoryItem) {
            return res.status(400).json({
              message: "Billing for inventory item that is not virtual",
            });
          } else {
            if (quantity > existingVirtualInventoryItem.quantity) {
              return res.status(400).json({
                message:
                  "Billing more than what is available in virtual inventory",
              });
            }
            existingVirtualInventoryItem.quantity -= quantity;
            existingBilledInventoryItem.quantity += quantity;
          }
        }
      }

      await warehouseDocument.save();

      res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
      res.status(400).json({ message: "Error creating order", error });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const { warehouseId } = req.params;
      const warehouse = await Warehouse.findById(warehouseId);

      if (!warehouse) {
        return res.status(404).json({ message: "Warehouse not found" });
      }

      for (const item of order.items) {
        const { name, quantity, billType } = item;

        const processItem = (inventoryArray) => {
          return inventoryArray.find((i) => i.itemName === name);
        };

        if (billType === "Virtual") {
          const existingVirtualInventoryItem = processItem(
            warehouse.virtualInventory
          );
          if (!existingVirtualInventoryItem) {
            return res
              .status(400)
              .json({ message: "Item not found in virtual inventory" });
          }
          if (existingVirtualInventoryItem.quantity < quantity) {
            return res.status(400).json({
              message: "Cannot reduce quantity below zero in virtual inventory",
            });
          }
          existingVirtualInventoryItem.quantity -= quantity;
        } else if (billType === "Billed") {
          const existingBilledInventoryItem = processItem(
            warehouse.billedInventory
          );
          if (!existingBilledInventoryItem) {
            return res
              .status(400)
              .json({ message: "Item not found in billed inventory" });
          }
          if (existingBilledInventoryItem.quantity < quantity) {
            return res.status(400).json({
              message: "Cannot reduce quantity below zero in billed inventory",
            });
          }
          existingBilledInventoryItem.quantity -= quantity;
        } else {
          return res.status(400).json({ message: "Invalid billType provided" });
        }
      }

      await warehouse.save();

      res.status(200).json({
        message: "Order deleted successfully",
        warehouse,
      });
    } catch (error) {
      res.status(500).json({ message: "Error deleting order", error });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving orders", error });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const order = await Order.find({ organization: req.params.id });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving order", error });
    }
  },

  updateOrder: async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({ message: "Order updated successfully", order });
    } catch (error) {
      res.status(400).json({ message: "Error updating order", error });
    }
  },

  updateBillTypePartWise: async (req, res) => {
    try {
      const { id } = req.params;
      const { items } = req.body;

      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      let warehouseDocument = await Warehouse.findById(order.warehouse);

      if (!warehouseDocument) {
        return res.status(404).json({ message: "Warehouse not found" });
      }

      for (const updatedItem of items) {
        const { name, quantity, billType } = updatedItem;

        const existingOrderItem = order.items.find(
          (item) => item.name === name
        );
        if (!existingOrderItem) {
          return res
            .status(400)
            .json({ message: `Item ${name} not found in order` });
        }

        const existingVirtualInventoryItem =
          warehouseDocument.virtualInventory.find((i) => i.itemName === name);
        const existingBilledInventoryItem =
          warehouseDocument.billedInventory.find((i) => i.itemName === name);

        if (billType === "Virtual Billed") {
          if (!existingVirtualInventoryItem) {
            return res
              .status(400)
              .json({ message: `Item ${name} not found in virtual inventory` });
          }
          if (quantity > existingVirtualInventoryItem.quantity) {
            return res.status(400).json({
              message: `Not enough quantity in virtual inventory for ${name}`,
            });
          }

          existingVirtualInventoryItem.quantity -= quantity;
          if (existingBilledInventoryItem) {
            existingBilledInventoryItem.quantity += quantity;
          } else {
            warehouseDocument.billedInventory.push({
              itemName: name,
              weight: existingVirtualInventoryItem.weight,
              quantity: quantity,
            });
          }

          existingOrderItem.quantity -= quantity;
          existingOrderItem.billedQuantity =
            (existingOrderItem.billedQuantity || 0) + quantity;

          if (existingOrderItem.quantity < 0) {
            existingOrderItem.quantity = 0;
          }
        } else {
          return res
            .status(400)
            .json({ message: `Invalid bill type for item ${name}` });
        }
      }

      await order.save();
      await warehouseDocument.save();

      res.status(200).json({ message: "Order updated successfully", order });
    } catch (error) {
      res.status(400).json({ message: "Error updating order", error });
    }
  },

  fetchPendingRemindersToday: async () => {
    try {
      const today = new Date();
      const orders = await Order.find({ status: "payment pending" });

      const pendingReminders = [];

      orders.forEach((order) => {
        const bargainDate = new Date(order.companyBargainDate);
        const dueDate = new Date(bargainDate);
        dueDate.setDate(dueDate.getDate() + order.paymentDays);

        const daysUntilDue = Math.floor(
          (dueDate - today) / (1000 * 60 * 60 * 24)
        );
        console.log(daysUntilDue);
        if (order.reminderDays.includes(daysUntilDue)) {
          pendingReminders.push(order.sellerContact);
        }
      });

      return pendingReminders;
    } catch (error) {
      console.error("Error fetching pending reminders:", error);
      return [];
    }
  },
};

export default orderController;
