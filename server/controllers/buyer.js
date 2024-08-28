import Buyer from "../models/buyer.js"; // Assuming the model is saved as buyer.js

const buyerController = {
  // Create a new buyer
  createBuyer: async (req, res) => {
    try {
      const { 
        buyer, 
        buyerCompany, 
        buyerdeliveryAddress, 
        buyerContact, 
        buyerEmail, 
        buyerGstno, 
        buyerGooglemaps 
      } = req.body;
      
      const newBuyer = new Buyer({
        buyer,
        buyerCompany,
        buyerdeliveryAddress,
        buyerContact,
        buyerEmail,
        buyerGstno,
        buyerGooglemaps
      });

      await newBuyer.save();

      res.status(201).json({ message: "Buyer created successfully", buyer: newBuyer });
    } catch (error) {
      res.status(400).json({ message: "Error creating buyer", error });
    }
  },

  // Get all buyers
  getAllBuyers: async (req, res) => {
    try {
      const buyers = await Buyer.find();
      res.status(200).json(buyers);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving buyers", error });
    }
  },

  // Get a buyer by ID
  getBuyerById: async (req, res) => {
    try {
      const buyer = await Buyer.findById(req.params.id);
      if (!buyer) {
        return res.status(404).json({ message: "Buyer not found" });
      }
      res.status(200).json(buyer);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving buyer", error });
    }
  },

  // Update a buyer by ID
  updateBuyer: async (req, res) => {
    try {
      const { 
        buyer, 
        buyerCompany, 
        buyerdeliveryAddress, 
        buyerContact, 
        buyerEmail, 
        buyerGstno, 
        buyerGooglemaps 
      } = req.body;

      const updatedBuyer = await Buyer.findByIdAndUpdate(
        req.params.id,
        {
          buyer,
          buyerCompany,
          buyerdeliveryAddress,
          buyerContact,
          buyerEmail,
          buyerGstno,
          buyerGooglemaps
        },
        { new: true } // This returns the updated document
      );

      if (!updatedBuyer) {
        return res.status(404).json({ message: "Buyer not found" });
      }

      res.status(200).json({ message: "Buyer updated successfully", buyer: updatedBuyer });
    } catch (error) {
      res.status(400).json({ message: "Error updating buyer", error });
    }
  },

  // Delete a buyer by ID
  deleteBuyer: async (req, res) => {
    try {
      const deletedBuyer = await Buyer.findByIdAndDelete(req.params.id);

      if (!deletedBuyer) {
        return res.status(404).json({ message: "Buyer not found" });
      }

      res.status(200).json({ message: "Buyer deleted successfully", buyer: deletedBuyer });
    } catch (error) {
      res.status(500).json({ message: "Error deleting buyer", error });
    }
  }
};

export default buyerController;
