import Price from "../models/itemprice.js";
import Item from "../models/items.js";
import Warehouse from "../models/warehouse.js";

const priceController = {

  addPrice: async (req, res) => {
    try {
      const { warehouseId, prices, organization } = req.body;

      const warehouse = await Warehouse.findById(warehouseId);
      if (!warehouse) {
        return res.status(404).json({ message: "Warehouse not found" });
      }
      const savedPrices = [];
      for (const price of prices) {
        const { itemId, companyPrice, rackPrice, plantPrice, depoPrice, pricesUpdated } = price;
        const item = await Item.findById(itemId);
        if (!item) {
          return res.status(404).json({ message: `Item not found: ${itemId}` });
        }


        const newPrice = new Price({
          warehouse: warehouseId,
          item: itemId,
          companyPrice,
          rackPrice,
          plantPrice,
          depoPrice,
          pricesUpdated,
          organization
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


  getAllPrices: async (req, res) => {
    try {
      const prices = await Price.find()
        .populate("warehouse", "name")
        .populate("item", "name")
        .populate("organization", "name");
      res.status(200).json({ message: "Prices fetched successfully", prices });
    } catch (error) {
      console.error("Error fetching all prices:", error);
      res.status(500).json({ message: "Error fetching prices", error });
    }
  },

  // Fetch item price by warehouse
  getItemPriceByWarehouse: async (req, res) => {
    try {
      const { warehouseId, itemId } = req.params;

      const price = await Price.findOne({ warehouse: warehouseId, item: itemId })
        .populate("warehouse", "name")
        .populate("item", "name");

      if (!price) {
        return res.status(404).json({ message: "Price not found for the specified warehouse and item" });
      }

      res.status(200).json({ message: "Price fetched successfully", price });
    } catch (error) {
      console.error("Error fetching item price by warehouse:", error);
      res.status(500).json({ message: "Error fetching price", error });
    }
  },

 
  getPricesByWarehouse: async (req, res) => {
    try {
      const { warehouseId } = req.params;
      if (!warehouseId) {
        return res.status(400).json({ message: "Warehouse ID is required" });
      }
  
      // Fetch all prices for the given warehouse
      const prices = await Price.find({ warehouse: warehouseId })
        .populate("warehouse", "name") 
        .populate("item", "name")     
        
  
      if (prices.length === 0) {
        return res.status(404).json({ message: "No prices found for the specified warehouse" });
      }
  
      res.status(200).json({ message: "Prices fetched successfully", prices });
    } catch (error) {
      console.error("Error fetching prices for the warehouse:", error);
      res.status(500).json({ message: "Error fetching prices", error });
    }
  },
  



 // updateItemPriceByWarehouse: async (req, res) => {
    //try {
     // const { warehouseId, itemId } = req.params;
    //  const { companyPrice, rackPrice, plantPrice, depoPrice, pricesUpdated } = req.body;

    //  const updatedPrice = await Price.findOneAndUpdate(
    //    { warehouse: warehouseId, item: itemId },
    //    { companyPrice, rackPrice, plantPrice, depoPrice, pricesUpdated },
//{ new: true } 
     // );

     // if (!updatedPrice) {
     //   return res.status(404).json({ message: "Price not found for the specified warehouse and item" });
     // }

     // res.status(200).json({ message: "Price updated successfully", updatedPrice });
    //} catch (error) {
    //  console.error("Error updating item price by warehouse:", error);
    //  res.status(500).json({ message: "Error updating price", error });
    //}
  //},
};

export default priceController;
