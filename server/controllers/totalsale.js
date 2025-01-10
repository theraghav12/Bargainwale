import TotalSale from "../models/totalsale.js";
import Sale from "../models/sale.js";

const totalSaleController = {
  // Create a new TotalSale or update an existing one by adding sales
  createOrUpdateTotalSale: async (req, res) => {
    try {
      const { saleIds, organization,totalAmount,invoiceDate,invoiceNumber,transporterId } = req.body;

      // Validate the sales exist
      const sales = await Sale.find({ _id: { $in: saleIds } });
      if (sales.length !== saleIds.length) {
        return res.status(400).json({
          success: false,
          message: "Some sales do not exist",
        });
      }

      // Check if a TotalSale exists for this organization
      let totalSale = await TotalSale.findOne({ organization });

      if (!totalSale) {
        // If no total sale exists, create a new one
        totalSale = new TotalSale({
          sales: saleIds,
          organization,
          totalAmount,
          invoiceDate,invoiceNumber,
          transporterId
        });
      } else {
        // If a total sale exists, add new sales to the array
        totalSale.sales.push(...saleIds);
      }

      await totalSale.save();

      res.status(201).json({
        success: true,
        message: "Total sale created/updated successfully",
        data: totalSale,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create/update total sale",
        error: error.message,
      });
    }
  },

  getAllTotalSales: async (req, res) => {
    try {
      const totalSales = await TotalSale.find({ organization: req.params.orgId })
        .populate({
          path: "sales",
          populate: [
            {
              path: "warehouseId",
              populate: {
                path: "warehouseManager", 
              },
            },
            {
              path: "bookingId",
              populate: [
                {
                  path: "items.item", 
                },
                {
                  path: "buyer", 
                },
              ],
            },
            {
              path: "items.itemId", 
              select: "name material flavor weights",
            }
          ],
        })
        .populate("transporterId");
  
      res.status(200).json({
        success: true,
        data: totalSales,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve total sales",
        error: error.message,
      });
    }
  },
  

  getTotalSaleById: async (req, res) => {
    try {
      const totalSale = await TotalSale.findById(req.params.id)
        .populate({
          path: "sales",
          populate: [
            {
              path: "warehouseId",
              populate: {
                path: "warehouseManager", 
              },
            },
            {
              path: "bookingId",
              populate: [
                {
                  path: "items.item",
                },
                {
                  path: "buyer",
                },
              ],
            },
            {
              path: "items.itemId",
              select: "name material flavor weights",
            }
           
          ],
        })
        .populate("transporterId");
        
  
      if (!totalSale) {
        return res.status(404).json({
          success: false,
          message: "Total sale not found",
        });
      }
  
      res.status(200).json({
        success: true,
        data: totalSale,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve total sale",
        error: error.message,
      });
    }
  },
  

  deleteTotalSale: async (req, res) => {
    try {
      const totalSale = await TotalSale.findById(req.params.id);
      if (!totalSale) {
        return res.status(404).json({
          success: false,
          message: "Total sale not found",
        });
      }

      await totalSale.remove();

      res.status(200).json({
        success: true,
        message: "Total sale deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete total sale",
        error: error.message,
      });
    }
  },
};

export default totalSaleController;
