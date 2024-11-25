import Item from "../models/items.js";
import Warehouse from "../models/warehouse.js";


  const itemController = {
    // Create a new item
    createItem: async (req, res) => {
      try {
        const { flavor, material, materialdescription, netweight, grossweight, gst, packaging, packsize, staticPrice, warehouses, organization } = req.body;

        const newItem = new Item({
          flavor,
          material,
          materialdescription,
          netweight,
          grossweight,
          gst,
          packaging,
          packsize,
          staticPrice,
          warehouses,
          organization
        });

        await newItem.save();
        res.status(201).json({ message: "Item created successfully", item: newItem });
      } catch (error) {
        console.error("Error creating item:", error);
        res.status(400).json({ message: "Error creating item", error });
      }
    },  getAllItems: async (req, res) => {
    try {
      const items = await Item.find({ organization: req.params.orgId });
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving items", error });
    }
  },

  getItemById: async (req, res) => {
    try {
      const { id, orgId } = req.params;
      const item = await Item.findOne({ _id: id, organization: orgId });
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving item", error });
    }
  },
  getItemByWarehouseId: async (req, res) => {
    try {
      const { warehouseId, orgId } = req.params;
      const items = await Item.find({ warehouses: warehouseId, organization: orgId }); // Assuming warehouse is stored as a reference or ID

      if (items.length === 0) {
        return res.status(404).json({ message: "No items found for the specified warehouse" });
      }

      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving items by warehouse", error });
    }
  },

  updateItem: async (req, res) => {
    try {
      const { flavor, material, materialdescription, netweight, grossweight, gst, packaging, packsize, staticPrice, warehouses } = req.body;

      const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        {
          flavor,
          material,
          materialdescription,
          netweight,
          grossweight,
          gst,
          packaging,
          packsize,
          staticPrice,
          warehouses,
        },
        { new: true }
      );

      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.status(200).json({ message: "Item updated successfully", item: updatedItem });
    } catch (error) {
      res.status(400).json({ message: "Error updating item", error });
    }
  },

  deleteItem: async (req, res) => {
    try {
      const deletedItem = await Item.findByIdAndDelete(req.params.id);

      if (!deletedItem) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.status(200).json({ message: "Item deleted successfully", item: deletedItem });
    } catch (error) {
      res.status(500).json({ message: "Error deleting item", error });
    }
  }
};
export default itemController;
