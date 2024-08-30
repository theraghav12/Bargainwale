import Purchase from "../models/purchase.js";
import Warehouse from "../models/warehouse.js";

const purchaseController = {
  createPurchase: async (req, res) => {
    try {
      const { warehouseId, transporterId, orderId, items } = req.body;

      const newPurchase = new Purchase({
        warehouseId,
        transporterId,
        orderId,
        items,
      });

      await newPurchase.save();

      const warehouseDocument = await Warehouse.findById(warehouseId);
      if (!warehouseDocument) {
        return res.status(404).json({ message: "Warehouse not found" });
      }

      for (const item of items) {
        const { name, quantity } = item;

        const existingVirtualInventoryItem =
          warehouseDocument.virtualInventory.find((i) => i.itemName === name);

        const existingBilledInventoryItem =
          warehouseDocument.billedInventory.find((i) => i.itemName === name);

        if (existingVirtualInventoryItem) {
            if (existingVirtualInventoryItem.quantity>=quantity) {
                existingVirtualInventoryItem.quantity -= quantity;
                existingBilledInventoryItem.quantity += quantity;
            } else{
                res.status(400).json({
                    success: false,
                    message: 'Buying more than what is there in virtual inventory'
                });
            }
        } else {
          return res.status(400).json({
            success: false,
            message: `Purchasing item '${name}' that is not in virtual inventory`,
          });
        }
      }

      await warehouseDocument.save();

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
      const purchases = await Purchase.find();

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
      const purchase = await Purchase.findById(req.params.id);

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
        const { name, quantity } = item;

        const virtualInventoryItem = warehouse.virtualInventory.find(
          (i) => i.itemName === name
        );
        const billedInventoryItem = warehouse.billedInventory.find(
          (i) => i.itemName === name
        );

        if (virtualInventoryItem) {
          virtualInventoryItem.quantity += quantity;
          billedInventoryItem.quantity -= quantity;
        } else {
          return res.status(400).json({
            success: false,
            message: `Item '${name}' is not in virtual inventory`,
          });
        }
      }
      await warehouse.save();

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
