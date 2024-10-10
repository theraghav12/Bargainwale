import Price from "../models/itemprice.js";
import Item from "../models/items.js";
import Warehouse from "../models/warehouse.js";

const priceController = {

  addPrice: async (req, res) => {
    try {
      const { warehouseId, prices, pricesUpdated } = req.body;

      const warehouse = await Warehouse.findById(warehouseId);
      if (!warehouse) {
        return res.status(404).json({ message: "Warehouse not found" });
      }
      const savedPrices = [];
      for (const price of prices) {
        const { itemId, companyPrice, rackPrice, plantPrice, depoPrice } = price;
        const item = await Item.findById(itemId);
        if (!item) {
          return res.status(404).json({ message: `Item not found: ${itemId}` });
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        
        const existingPrice = await Price.findOne({
          warehouse: warehouseId,
          item: itemId,
          date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) 
          }
        });

        if (existingPrice) {
          return res.status(400).json({ message: `Price already set for item ${itemId} on this day` });
        }

        const newPrice = new Price({
          warehouse: warehouseId,
          item: itemId,
          companyPrice,
          rackPrice,
          plantPrice,
          depoPrice,
          pricesUpdated
        });
        await newPrice.save();
        savedPrices.push(newPrice);
      }

      res.status(201).json({ message: "Prices added successfully", prices: savedPrices });
    } catch (error) {
      console.error("Error adding prices:", error);
      res.status(500).json({ message: "Error adding prices", error });
    }
  },


  getPricesByWarehouse: async (req, res) => {
    try {
      const { warehouseId } = req.params;
      const { date } = req.query;
  
      // Parse the date, default to today if not provided
      const queryDate = date ? new Date(date) : new Date();
      const startOfDay = new Date(queryDate.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(queryDate.setUTCHours(23, 59, 59, 999));
  
      // Fetch all items from the selected warehouse
      const items = await Item.find({ warehouse: warehouseId });
  
      if (!items.length) {
        return res.status(404).json({ message: "No items found for the selected warehouse" });
      }
  
      const result = [];
  
      // Loop through each item and find the price for the selected day
      for (const item of items) {
        const price = await Price.findOne({
          warehouse: warehouseId,
          item: item._id,
          date: { $gte: startOfDay, $lt: endOfDay }
        });
  
        if (price) {
          result.push({
            item: item,
            companyPrice: price.companyPrice,
            rackPrice: price.rackPrice,
            plantPrice: price.plantPrice,
            depoPrice: price.depoPrice,
            pricesUpdated: price.pricesUpdated,
            date: price.date,
            message: "Price updated"
          });
        } else {
          result.push({
            item: item,
            message: "Price not updated"
          });
        }
      }
  
      if (!result.length) {
        return res.status(404).json({ message: "No prices found for the selected warehouse and date" });
      }
  
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching prices:", error);
      res.status(500).json({ message: "Error fetching prices", error });
    }
  },  
  getAllPrices: async (req, res) => {
    try {
      const prices = await Price.find({})
        .populate('item')  
        .populate('warehouse')  
        .sort({ date: -1 });  

      if (!prices.length) {
        return res.status(404).json({ message: "No prices found" });
      }

      res.status(200).json(prices);
    } catch (error) {
      console.error("Error fetching all prices:", error);
      res.status(500).json({ message: "Error fetching all prices", error });
    }
  },
  getItemPriceByWarehouse: async (req, res) => {
    try {
      const { warehouseId, itemId } = req.params;
      const { date } = req.query;
  
      // Parse the date, default to today if not provided
      const queryDate = date ? new Date(date) : new Date();
  
      // Set the start and end of the day (for the entire day range)
      const startOfDay = new Date(queryDate.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(queryDate.setUTCHours(23, 59, 59, 999));
  
      // Query for the price of the item in the warehouse for the specific day
      const price = await Price.findOne({
        warehouse: warehouseId,
        item: itemId,
        date: { $gte: startOfDay, $lt: endOfDay }
      }).populate("item").populate("warehouse");
  
      if (!price) {
        return res.status(404).json({ message: `No price found for item ${itemId} in warehouse ${warehouseId} on the selected day` });
      }
  
      res.status(200).json(price);
    } catch (error) {
      console.error("Error fetching item price by warehouse:", error);
      res.status(500).json({ message: "Error fetching item price", error });
    }
  }
};

export default priceController;