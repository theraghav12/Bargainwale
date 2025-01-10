import CreditNote from "../models/creditnote.js";
import TotalSale from "../models/totalsale.js";
import Warehouse from "../models/warehouse.js";
import Sale from "../models/sale.js";
import ItemHistory from "../models/itemHistory.js";

const creditNoteController = {
  
  createCreditNote: async (req, res) => {
    try {
      const { totalSaleId, items, organization, invoiceDate, transporterId } = req.body;
     
      const totalSale = await TotalSale.findById(totalSaleId).populate("sales");
      if (!totalSale) {
        return res.status(404).json({ message: "Total sale not found" });
      }

      const creditNoteNumber = `CN-${Date.now()}`;


      const creditItems = [];
      for (const item of items) {
        const { itemId, quantity, reason } = item;
        let totalQuantitySold = 0;

     
        totalSale.sales.forEach((sale) => {
          sale.items.forEach((saleItem) => {
            if (saleItem.itemId.toString() === itemId.toString()) {
              totalQuantitySold += saleItem.quantity;
            }
          });
        });


        const overbilledQuantity = totalQuantitySold - quantity;


        if (overbilledQuantity > 0) {
          creditItems.push({
            itemId,
            quantity: overbilledQuantity,
            reason: reason,
            status: "issued",
          });


          const warehouse = await Warehouse.findOne({ organization });
          const billedItem = warehouse.billedInventory.find(
            (i) => i.item.toString() === itemId.toString()
          );
          if (billedItem) {
            billedItem.quantity += overbilledQuantity;
          } else {
            warehouse.billedInventory.push({
              item: itemId,
              quantity: overbilledQuantity,
            });
          }
          await warehouse.save();
        }
      }


      const newCreditNote = new CreditNote({
        totalSaleId,
        items: creditItems,
        organization,
        creditNoteNumber,
        invoiceDate,
        transporterId,
      });

      await newCreditNote.save();


      creditItems.forEach(async (creditItem) => {
        await ItemHistory.create({
          item: creditItem.itemId,
          quantity: creditItem.quantity,
          sourceModel: "TotalSale",
          source: totalSaleId,
          destinationModel: "Buyer",
          destination: totalSale.sales[0].buyer._id,
          reason: creditItem.reason,
          inventoryType: "Billed",
          organization,
        });
      });

      res.status(201).json({
        success: true,
        message: "Credit note created successfully",
        data: newCreditNote,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create credit note",
        error: error.message,
      });
    }
  },


  updateCreditNoteStatus: async (req, res) => {
    try {
      const { creditNoteId } = req.params;
      const creditNote = await CreditNote.findById(creditNoteId).populate("items.itemId");
      if (!creditNote) {
        return res.status(404).json({ message: "Credit note not found" });
      }


      if (creditNote.status === "issued") {
        for (const creditItem of creditNote.items) {
          const warehouse = await Warehouse.findOne({ organization: creditNote.organization });
          const billedItem = warehouse.billedInventory.find(
            (i) => i.item.toString() === creditItem.itemId.toString()
          );
          if (billedItem) {
            billedItem.quantity -= creditItem.quantity;
          }


          const virtualInventoryItem = warehouse.virtualInventory.find(
            (i) => i.item.toString() === creditItem.itemId.toString()
          );
          if (virtualInventoryItem) {
            virtualInventoryItem.quantity += creditItem.quantity;
          } else {
            warehouse.virtualInventory.push({
              item: creditItem.itemId,
              quantity: creditItem.quantity,
            });
          }

          await warehouse.save();
        }

        creditNote.status = "settled";
        await creditNote.save();

        res.status(200).json({
          success: true,
          message: "Credit note status updated to settled",
          data: creditNote,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Credit note is already settled",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update credit note status",
        error: error.message,
      });
    }
  },
  getAllCreditNotesForOrganization: async (req, res) => {
    try {
      const creditNotes = await CreditNote.find({ organization: req.params.orgId })
        .populate("items.itemId") // Assuming you want to populate item details
        .populate("totalSaleId"); // Populate the total sale if needed

      res.status(200).json({
        success: true,
        data: creditNotes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve credit notes",
        error: error.message,
      });
    }
  },

  getCreditNoteById: async (req, res) => {
    try {
      const creditNote = await CreditNote.findById(req.params.creditNoteId)
        .populate("items.itemId") 
        .populate("totalSaleId"); 

      if (!creditNote) {
        return res.status(404).json({
          success: false,
          message: "Credit note not found",
        });
      }

      res.status(200).json({
        success: true,
        data: creditNote,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve credit note",
        error: error.message,
      });
    }
  },
};

export default creditNoteController;
