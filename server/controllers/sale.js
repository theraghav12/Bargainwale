import Sale from "../models/sale.js"; // Assuming you have a Sale model
import Warehouse from "../models/warehouse.js";
import Booking from "../models/booking.js";
import Transport from "../models/transport.js";

const saleController = {
  createSale: async (req, res) => {
    try {
      const { warehouseId, bookingId, transporterId, items } = req.body;

      // Fetch the warehouse and booking documents
      const warehouseDocument = await Warehouse.findById(warehouseId);
      if (!warehouseDocument) {
        return res.status(404).json({ message: "Warehouse not found" });
      }

      const bookingDocument = await Booking.findById(bookingId).populate(
        "items.item"
      );
      if (!bookingDocument) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (bookingDocument.status === "fully sold") {
        return res.status(400).json({
          success: false,
          message: "Sale cannot be created for a fully sold booking",
        });
      }

      // Retrieve all previous sales for this booking
      const previousSales = await Sale.find({ bookingId });
      const previousSaleQuantities = {};

      for (const sale of previousSales) {
        for (const item of sale.items) {
          if (!previousSaleQuantities[item.itemId]) {
            previousSaleQuantities[item.itemId] = 0;
          }
          previousSaleQuantities[item.itemId] += item.quantity;
        }
      }

      let isPartiallySold = false;
      let isFullySold = true;

      // Process each item in the sale
      for (const item of items) {
        let { itemId, quantity } = item;
        quantity=Numer(quantity);
        // Find the booking item
        const bookingItem = bookingDocument.items.find(
          (i) => i.item._id.toString() === itemId.toString()
        );

        if (!bookingItem) {
          return res.status(400).json({
            success: false,
            message: `Item not found in booking`,
          });
        }

        // Calculate the total quantity sold so far for this item
        const totalSoldQuantity =
          (previousSaleQuantities[itemId] || 0) + quantity;

        // Check if the sale quantity exceeds the booking quantity
        if (totalSoldQuantity > bookingItem.quantity) {
          return res.status(400).json({
            success: false,
            message: `Item ${itemId} is being sold more than what was booked`,
          });
        }

        // Get the sold inventory for this item
        const soldInventoryItem = warehouseDocument.soldInventory.find(
          (i) => i.item.toString() === itemId.toString()
        );

        if (!soldInventoryItem) {
          return res.status(400).json({
            success: false,
            message: `Item ${itemId} not found in sold inventory`,
          });
        }

        const totalAvailableQuantity =
          soldInventoryItem.virtualQuantity + soldInventoryItem.billedQuantity;

        // If the total available quantity is less than the sale quantity, return an error
        if (totalAvailableQuantity < quantity) {
          return res.status(400).json({
            success: false,
            message: `Selling more than what was booked`,
          });
        }

        // If billedQuantity alone is not enough, adjust from main inventory
        if (soldInventoryItem.billedQuantity < quantity) {
          const remainingQuantity = quantity - soldInventoryItem.billedQuantity;

          // Update soldInventory's billedQuantity to 0 (used up)
          soldInventoryItem.billedQuantity = 0;

          // Update the main warehouse's inventory
          const mainInventoryItem = warehouseDocument.billedInventory.find(
            (i) => i.item.toString() === itemId.toString()
          );

          if (!mainInventoryItem || mainInventoryItem.quantity < remainingQuantity) {
            return res.status(400).json({
              success: false,
              message: `Not enough items in main billed inventory`,
            });
          }

          // Reduce main billed inventory by the remainingQuantity
          mainInventoryItem.quantity -= remainingQuantity;

          // Transfer from virtual to billed in sold inventory
          soldInventoryItem.virtualQuantity -= remainingQuantity;
          warehouseDocument.virtualInventory.find(
            (i) => i.item.toString() === itemId.toString()
          ).quantity += remainingQuantity;
        } else {
          // If billedQuantity is sufficient, simply reduce it
          soldInventoryItem.billedQuantity -= quantity;
        }

        // Determine the status of the booking based on sales
        if (totalSoldQuantity < bookingItem.quantity) {
          isPartiallySold = true;
          isFullySold = false;
        }
      }

      // Update the booking status based on sales
      if (isFullySold && !isPartiallySold) {
        bookingDocument.status = "fully sold";
      } else if (isPartiallySold) {
        bookingDocument.status = "partially sold";
      }
      await bookingDocument.save();
      await warehouseDocument.save();

      // Create and save the new sale
      const newSale = new Sale({
        warehouseId,
        transporterId,
        bookingId,
        items,
      });

      await newSale.save();

      res.status(201).json({
        success: true,
        message: "Sale created successfully",
        data: newSale,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create sale",
        error: error.message,
      });
    }
  },

  getAllSales: async (req, res) => {
    try {
      const sales = await Sale.find()
        .populate("warehouseId") // Populates the warehouse details
        .populate("transporterId") // Populates the transporter details
        .populate("bookingId") // Populates the booking details
        .populate("items.itemId");// Populates the item details in the items array

      res.status(200).json({
        success: true,
        data: sales,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve sales",
        error: error.message,
      });
    }
  },

  getSaleById: async (req, res) => {
    try {
      const sale = await Sale.findById(req.params.id)
        .populate("warehouseId") // Populates the warehouse details
        .populate("transporterId") // Populates the transporter details
        .populate("bookingId") // Populates the booking details
        .populate("items.itemId"); // Populates the item details in the items array

      if (!sale) {
        return res.status(404).json({
          success: false,
          message: "Sale not found",
        });
      }

      res.status(200).json({
        success: true,
        data: sale,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve sale",
        error: error.message,
      });
    }
  },

  deleteSale: async (req, res) => {
    try {
      const sale = await Sale.findById(req.params.id);
      if (!sale) {
        return res.status(404).json({
          success: false,
          message: "Sale not found",
        });
      }

      const warehouse = await Warehouse.findById(sale.warehouseId);
      if (!warehouse) {
        return res.status(404).json({
          success: false,
          message: "Warehouse not found",
        });
      }

      for (const item of sale.items) {
        const { itemId, quantity } = item;

        const soldInventoryItem = warehouse.soldInventory.find(
          (i) => i.item.toString() === itemId.toString()
        );

        if (soldInventoryItem) {
          soldInventoryItem.virtualQuantity += quantity;
          if (soldInventoryItem.virtualQuantity === 0) {
            warehouse.soldInventory = warehouse.soldInventory.filter(
              (i) => i.item.toString() !== itemId.toString()
            );
          }
        }
      }

      const booking = await Booking.findById(sale.bookingId);
      if (booking) {
        const remainingSales = await Sale.find({ bookingId: sale.bookingId });

        let isPartiallySold = false;
        let isFullySold = true;

        for (const sale of remainingSales) {
          for (const item of sale.items) {
            const bookingItem = booking.items.find(
              (i) => i.item._id.toString() === item.itemId.toString()
            );
            if (bookingItem) {
              const totalSoldQuantity =
                (previousSaleQuantities[item.itemId] || 0) + item.quantity;
              if (totalSoldQuantity < bookingItem.quantity) {
                isPartiallySold = true;
                isFullySold = false;
              }
            }
          }
        }

        if (isFullySold && !isPartiallySold) {
          booking.status = "fully sold";
        } else if (isPartiallySold) {
          booking.status = "partially sold";
        } else {
          booking.status = "created";
        }
        await booking.save();
      }

      await Sale.findByIdAndDelete(req.params.id);
      await warehouse.save();

      res.status(200).json({
        success: true,
        message: "Sale deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete sale",
        error: error.message,
      });
    }
  },
};

export default saleController;
