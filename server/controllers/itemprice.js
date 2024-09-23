import Price from "../models/itemprice.js";
import Item from "../models/items.js";
import Warehouse from "../models/warehouse.js";

const priceController = {

    addPrice: async (req,res)=>{
        try{
            const{warehouseId, prices} = req.body;

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
                const newPrice = new Price({
                        warehouse: warehouseId,
                        item: itemId,
                        companyPrice,
                        rackPrice,
                        plantPrice,
                        depoPrice,
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
        
              const queryDate = date ? new Date(date) : new Date();
        
              const prices = await Price.find({
                warehouse: warehouseId,
                date: { $gte: queryDate.setUTCHours(0, 0, 0, 0), $lt: queryDate.setUTCHours(23, 59, 59, 999) }
              }).populate("item");
        
              if (!prices.length) {
                return res.status(404).json({ message: "No prices found for the selected warehouse and date" });
              }
        
              res.status(200).json(prices);
            } catch (error) {
              console.error("Error fetching prices:", error);
              res.status(500).json({ message: "Error fetching prices", error });
            }
          }
        };
        
        export default priceController;