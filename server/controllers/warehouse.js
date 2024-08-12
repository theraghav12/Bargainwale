import Warehouse from "../models/warehouse.js";

const warehouseController = {
  createWarehouse: async (req, res) => {
    try {
      const virtualInventory = [];
      const billedInventory = [];
      const { name, location, organization } = req.body;
      const warehouse = new Warehouse({
        name,
        location,
        organization,
        virtualInventory,
        billedInventory,
      });
      await warehouse.save();
      res.status(201).json({
        message: "Warehouse created successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Error creating warehouse item",
        error,
      });
    }
  },
  getAllWarehouses: async (req, res) => {
    try {
      const warehouse = await Warehouse.find();
      res.status(200).json(warehouse);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving warehouse items", error });
    }
  },
  getWarehouseById: async (req, res) => {
    try {
      const warehouse = await Warehouse.findById(req.params.id);
      if (!warehouse) {
        return res.status(404).json({ message: "Warehouse item not found" });
      }
      res.status(200).json(warehouse);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving warehouse item", error });
    }
  },
  updateWarehouse: async (req, res) => {
    try {
      let warehouse = await Warehouse.findById(req.params.id);

      if (!warehouse) {
        return res.status(404).json({ message: "Warehouse not found" });
      }

      const { name, weight, quantity, billType, state, city, itemName} = req.body;

      if (state) {
        warehouse.state = state;
      }
      if (city) {
        warehouse.city = city;
      }
      if (name) {
        warehouse.name = name;
      }

      if (billType && weight && quantity && itemName) {
        const processItem = (inventoryArray) => {
          return inventoryArray.find((i) => i.itemName === itemName);
        };

        if (billType === "Virtual Billed") {
          const existingVirtualInventoryItem = processItem(
            warehouse.virtualInventory
          );
          if (!existingVirtualInventoryItem) {
            warehouse.virtualInventory.push({
              itemName,
              weight,
              quantity,
            });
            warehouse.billedInventory.push({
              itemName,
              weight,
              quantity: 0,
            });
          } else {
            existingVirtualInventoryItem.quantity += quantity;
          }
        } else {
          const existingVirtualInventoryItem = processItem(
            warehouse.virtualInventory
          );
          const existingBilledInventoryItem = processItem(
            warehouse.billedInventory
          );

          if (!existingBilledInventoryItem) {
            return res.status(400).json({
              message: "Billing for inventory item that is not virtual",
            });
          } else {
            if (quantity > existingVirtualInventoryItem.quantity) {
              return res.status(400).json({
                message: "Billing more than what is there in virtual",
              });
            }
            existingVirtualInventoryItem.quantity -= quantity;
            existingBilledInventoryItem.quantity += quantity;
          }
        }
      }

      await warehouse.save();

      res.status(201).json({
        message: "Warehouse updated successfully",
        warehouse,
      });
    } catch (error) {
      res.status(400).json({ message: "Error updating warehouse", error });
    }
  },
  deleteWarehouse: async (req, res) => {
    try {
      const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
      if (!warehouse) {
        return res.status(404).json({ message: "Warehouse item not found" });
      }
      res.status(200).json({ message: "Warehouse item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting warehouse item", error });
    }
  },
};

export default warehouseController;