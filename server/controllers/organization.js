import Organization from "../models/organization.js";
import Order from "../models/orders.js";

const orgController = {
    createOrganization: async (req, res) => {
        try {
            const organization = new Organization(req.body);
            await organization.save();
            res.status(201).json({ message: 'Organization created successfully', organization });
        } catch (error) {
            res.status(400).json({ message: 'Error creating organization', error });
        }
    },
    getAllOrganizations: async (req, res) => {
        try {
            const organizations = await Organization.find().populate('users').populate('inventory');
            res.status(200).json(organizations);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving organizations', error });
        }
    },
    getOrganizationById: async (req, res) => {
        try {
            const organization = await Organization.findById(req.params.id).populate('users').populate('inventory');
            if (!organization) {
                return res.status(404).json({ message: 'Organization not found' });
            }
            const orders = await Order.find({ organization: req.params.id });
            const organizationWithOrders = {
                ...organization.toObject(),
                orders,
            };
            res.status(200).json(organizationWithOrders);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving organization', error });
        }
    },
    updateOrganization: async (req, res) => {
        try {
            const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('users').populate('inventory');
            if (!organization) {
                return res.status(404).json({ message: 'Organization not found' });
            }
            res.status(200).json({ message: 'Organization updated successfully', organization });
        } catch (error) {
            res.status(400).json({ message: 'Error updating organization', error });
        }
    },
    deleteOrganization: async (req, res) => {
        try {
            const organization = await Organization.findByIdAndDelete(req.params.id);
            if (!organization) {
                return res.status(404).json({ message: 'Organization not found' });
            }
            res.status(200).json({ message: 'Organization deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting organization', error });
        }
    }
};

export default orgController;