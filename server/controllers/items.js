import Item from "../models/items.js"; 

const itemController = {
  // Create a new item
  createItem: async (req, res) => {
    try {
      const { flavor, material, materialdescription, netweight, grossweight, gst, packaging, packsize, staticPrice } = req.body;

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
       
      });

      await newItem.save();
      res.status(201).json({ message: "Item created successfully", item: newItem });
    } catch (error) {
      console.error("Error creating item:", error);
      res.status(400).json({ message: "Error creating item", error });
    }
  },

  getAllItems: async (req, res) => {
    try {
      const items = await Item.find();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving items", error });
    }
  },

  getItemById: async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving item", error });
    }
  },

  updateItem: async (req, res) => {
    try {
      const { flavor, material, materialdescription, netweight, grossweight, gst, packaging, packsize, staticPrice } = req.body;

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
