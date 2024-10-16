import Sale from "../models/sale.js";
import Warehouse from "../models/warehouse.js";
import Booking from "../models/booking.js";
import Buyer from "../models/buyer.js";
import Transport from "../models/transport.js";

const saleController = {
  createSale: async (req, res) => {
    try {
      const { warehouseId, transporterId, itemQuantities, organization } = req.body;
  
      if (!Array.isArray(itemQuantities) || itemQuantities.length === 0) {
        return res.status(400).json({ message: "Invalid or empty booking items array" });
      }
  
      // Fetch the warehouse
      const warehouse = await Warehouse.findById(warehouseId);
      if (!warehouse) {
        return res.status(404).json({ message: "Warehouse not found" });
      }
  
      // Iterate through each booking and its items
      for (const bookingItem of itemQuantities) {
        const { bookingId, items } = bookingItem;
  
        const booking = await Booking.findById(bookingId);
        if (!booking) {
          return res.status(404).json({ message: `Booking not found: ${bookingId}` });
        }
  
        // Map booking items by item ID for easier lookup
        const bookingItemsMap = booking.items.reduce((acc, item) => {
          acc[item.item] = {
            virtualQuantity: item.virtualInventoryQuantities,
            billedQuantity: item.billedInventoryQuantities,
          };
          return acc;
        }, {});
  
        // Process each item in the sale request
        for (const { itemId, quantity } of items) {
          const bookedItem = bookingItemsMap[itemId];
          if (!bookedItem) {
            return res.status(400).json({ message: `Item not found in booking: ${itemId}` });
          }
  
          // Check if there is enough billed quantity in the booking to fulfill the sale
          if (quantity > bookedItem.billedQuantity) {
            return res.status(400).json({ message: `Not enough billed inventory for item: ${itemId}` });
          }
  
          // Update warehouse's virtual inventory
          const virtualInventoryItem = warehouse.virtualInventory.find(i => i.item.toString() === itemId.toString());
          if (virtualInventoryItem) {
            virtualInventoryItem.quantity += quantity; // Add to virtual inventory
          } else {
            warehouse.virtualInventory.push({ item: itemId, quantity });
          }
  
          // Update warehouse's billed inventory
          const billedInventoryItem = warehouse.billedInventory.find(i => i.item.toString() === itemId.toString());
          if (billedInventoryItem) {
            billedInventoryItem.quantity -= quantity; // Subtract from billed inventory
          } else {
            return res.status(400).json({ message: `No billed inventory found for item: ${itemId}` });
          }
  
          // Update warehouse's sold inventory
          const soldInventoryItem = warehouse.soldInventory.find(i => i.item.toString() === itemId.toString());
          if (soldInventoryItem) {
            soldInventoryItem.virtualQuantity -= quantity; // Subtract from sold inventory
          } else {
            return res.status(400).json({ message: `No sold inventory found for item: ${itemId}` });
          }
  
          // Update the booking quantities
          bookedItem.billedQuantity -= quantity;
          if (bookedItem.billedQuantity === 0) {
            booking.status = "fully sold";
          } else {
            booking.status = "partially sold";
          }
        }
  
        await booking.save(); // Save updated booking
      }
  
      // Save the updated warehouse
      await warehouse.save();
  
      // Create the sale document
      const sale = new Sale({
        warehouseId,
        transporterId,
        bookingId: itemQuantities.map(b => b.bookingId),
        items: itemQuantities.flatMap(b => b.items.map(i => ({ itemId: i.itemId, quantity: i.quantity }))),
        organization,
      });
  
      await sale.save();
      res.status(201).json({ message: "Sale created successfully", sale });
    } catch (error) {
      console.error("Error creating sale:", error);
      res.status(500).json({ message: "Error creating sale", error: error.message });
    }
  },
  
  getAllSales : async (req, res) => {
    try {
      const sales = await Sale.find()
        .populate("warehouseId", "name location") // Adjust fields to populate as needed
        .populate("transporterId", "name contact") // Adjust fields to populate as needed
        .populate("organization", "name address") // Adjust fields to populate as needed
        .populate("items.itemId", "name price") // Adjust fields to populate as needed
        .sort({ invoiceDate: -1 }); // Optional: Sort by invoice date descending
  
      if (!sales || sales.length === 0) {
        return res.status(404).json({ message: "No sales found." });
      }
  
      return res.status(200).json(sales);
    } catch (error) {
      console.error("Error fetching sales:", error);
      return res.status(500).json({ message: "Server error." });
    }},
  getSaleById: async (req, res) => {
    try {
      const { id, orgId } = req.params;
      const sale = await Sale.findOne({ _id: id, organization: orgId })
        .populate("buyerId")
        .populate("transporterId")
        .populate({
          path: "bookingIds",
          populate: { path: "items.itemId" }
        })
        .populate("items.itemId");

      if (!sale) {
        return res.status(404).json({
          success: false,
          message: "Sale not found for the provided ID",
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

      for (const item of sale.items) {
        const { itemId, quantity } = item;

        // Retrieve the corresponding booking and warehouse
        const booking = await Booking.findById(sale.bookingIds);
        if (!booking) {
          return res.status(404).json({
            success: false,
            message: "Booking not found",
          });
        }

        const warehouseId = booking.items.find(
          (i) => i.item.toString() === itemId.toString()
        ).item.warehouse;

        const warehouse = await Warehouse.findById(warehouseId);
        if (!warehouse) {
          return res.status(404).json({
            success: false,
            message: `Warehouse not found for item ${itemId}`,
          });
        }

        const soldInventoryItem = warehouse.soldInventory.find(
          (i) => i.item.toString() === itemId.toString()
        );

        if (soldInventoryItem) {
          soldInventoryItem.virtualQuantity += quantity;
          soldInventoryItem.billedQuantity -= quantity;

          const billedInventoryItem = warehouse.billedInventory.find(
            (i) => i.item.toString() === itemId.toString()
          );

          if (billedInventoryItem) {
            billedInventoryItem.quantity += quantity;
          }

          await warehouse.save();
        }
      }

      // Delete the sale after inventory adjustments
      await sale.remove();
      res.status(200).json({ success: true, message: "Sale deleted successfully" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting sale",
        error: error.message,
      });
    }
  },
};

export default saleController;
