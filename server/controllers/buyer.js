import Buyer from "../models/buyer.js";

const buyerController = {
  createBuyer: async (req, res) => {
    try {
      const {
        buyer,
        buyerCompany,
        buyerdeliveryAddress,
        buyerContact,
        buyerEmail,
        buyerGstno,
        buyerGooglemaps,
        organization
      } = req.body;

      const newBuyer = new Buyer({
        buyer,
        buyerCompany,
        buyerdeliveryAddress,
        buyerContact,
        buyerEmail,
        buyerGstno,
        buyerGooglemaps,
        organization
      });

      await newBuyer.save();
      res.status(201).json({ message: "Buyer created successfully", newBuyer });
    } catch (error) {
      res.status(400).json({ message: "Error creating buyer", error });
    }
  },

  getAllBuyers: async (req, res) => {
    try {
      const buyers = await Buyer.find({ organization: req.params.orgId });
      res.status(200).json(buyers);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving buyers", error });
    }
  },

  getBuyerById: async (req, res) => {
    try {
      const { id, orgId } = req.params;
      const buyer = await Buyer.findOne({ _id: id, organization: orgId });
      if (!buyer) {
        return res.status(404).json({ message: "Buyer not found" });
      }
      res.status(200).json(buyer);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving buyer", error });
    }
  },

  updateBuyer: async (req, res) => {
    try {
      const {
        buyer,
        buyerCompany,
        buyerdeliveryAddress,
        buyerContact,
        buyerEmail,
        buyerGstno,
        buyerGooglemaps,
      } = req.body;

      const buyerToUpdate = await Buyer.findById(req.params.id);
      if (!buyerToUpdate) {
        return res.status(404).json({ message: "Buyer not found" });
      }

      // Update the buyer details
      if (buyer) buyerToUpdate.buyer = buyer;
      if (buyerCompany) buyerToUpdate.buyerCompany = buyerCompany;
      if (buyerdeliveryAddress) buyerToUpdate.buyerdeliveryAddress = buyerdeliveryAddress;
      if (buyerContact) buyerToUpdate.buyerContact = buyerContact;
      if (buyerEmail) buyerToUpdate.buyerEmail = buyerEmail;
      if (buyerGstno) buyerToUpdate.buyerGstno = buyerGstno;
      if (buyerGooglemaps) buyerToUpdate.buyerGooglemaps = buyerGooglemaps;

      await buyerToUpdate.save();
      res.status(200).json({ message: "Buyer updated successfully", buyerToUpdate });
    } catch (error) {
      res.status(400).json({ message: "Error updating buyer", error });
    }
  },

  deleteBuyer: async (req, res) => {
    try {
      const buyerToDelete = await Buyer.findById(req.params.id);
      if (!buyerToDelete) {
        return res.status(404).json({ message: "Buyer not found" });
      }

      await Buyer.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Buyer deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting buyer", error });
    }
  },
};

export default buyerController;
