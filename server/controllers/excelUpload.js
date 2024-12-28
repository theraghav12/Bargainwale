import fs from "fs-extra";
import * as XLSX from "xlsx";
import Warehouse from "../models/warehouse.js";
import Item from "../models/items.js";
import Transport from "../models/transport.js";
import Buyer from "../models/buyer.js";
import Manufacturer from "../models/manufacturer.js";

const warehouseColumns = ['Name', 'State', 'City', 'ManagerName', 'ManagerEmail'];
const itemColumns = ['Flavor', 'HSNCode', 'Material', 'MaterialDescription', 'NetWeight', 'GrossWeight', 'GST', 'Packaging', 'PackSize'];
const transportColumns = ['Transport', 'TransportType', 'TransportContact', 'TransportAgency'];
const buyerColumns = [
    'Buyer',
    'BuyerCompany',
    'BuyerContact',
    'BuyerEmail',
    'BuyerGstno',
    'AddressLine1',
    'AddressLine2',
    'City',
    'State',
    'PinCode',
    'BuyerGooglemaps'
];
const manufacturerColumns = [
    'Manufacturer',
    'ManufacturerCompany',
    'ManufacturerContact',
    'ManufacturerEmail',
    'ManufacturerGstno',
    'AddressLine1',
    'AddressLine2',
    'City',
    'State',
    'PinCode',
    'ManufacturerGooglemaps'
];

const excelUploadController = {
    uploadWarehouse: async (req, res) => {
        try {
            const { organization } = req.body;
            const fileBuffer = fs.readFileSync(req.file.path);
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const firstRow = data[0];
            const columns = Object.keys(firstRow);
            const missingColumns = warehouseColumns.filter(column => !columns.includes(column));

            if (missingColumns.length > 0) {
                return res.status(400).json({ message: `Missing required columns: ${missingColumns.join(', ')}` });
            }

            const chunkSize = 100;

            for (let i = 0; i < data.length; i += chunkSize) {
                const chunk = data.slice(i, i + chunkSize);

                const warehouseData = chunk.map(row => ({
                    name: row.Name,
                    location: {
                        state: row.State,
                        city: row.City,
                    },
                    organization,
                    warehouseManager: {
                        name: row.ManagerName,
                        email: row.ManagerEmail,
                    },
                }));

                await Warehouse.insertMany(warehouseData);
            }
            res.status(200).json({ message: 'Data uploaded successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing file', error });
        }
    },
    uploadItems: async (req, res) => {
        try {
            const { organization } = req.body;
            const fileBuffer = fs.readFileSync(req.file.path);
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const firstRow = data[0];
            const columns = Object.keys(firstRow);
            const missingColumns = itemColumns.filter(column => !columns.includes(column));

            if (missingColumns.length > 0) {
                return res.status(400).json({ message: `Missing required columns: ${missingColumns.join(', ')}` });
            }

            const warehouses = await Warehouse.find({ organization: organization }, '_id');
            const warehouseIds = warehouses.map(warehouse => warehouse._id);

            const chunkSize = 100;

            for (let i = 0; i < data.length; i += chunkSize) {
                const chunk = data.slice(i, i + chunkSize);

                const itemData = await Promise.all(chunk.map(async (row) => {
                    return {
                        flavor: row.Flavor,
                        hsnCode: row.HSNCode,
                        material: row.Material,
                        materialdescription: row.MaterialDescription,
                        netweight: row.NetWeight,
                        grossweight: row.GrossWeight,
                        gst: row.GST,
                        packaging: row.Packaging || 'box',
                        packsize: row.PackSize,
                        warehouses: warehouseIds,
                        organization,
                    };
                }));

                await Item.insertMany(itemData);
            }

            res.status(200).json({ message: 'Items uploaded successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing file', error });
        }
    },
    uploadTransport: async (req, res) => {
        try {
            const { organization } = req.body;
            const fileBuffer = fs.readFileSync(req.file.path);
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const firstRow = data[0];
            const columns = Object.keys(firstRow);
            const missingColumns = transportColumns.filter(column => !columns.includes(column));

            if (missingColumns.length > 0) {
                return res.status(400).json({ message: `Missing required columns: ${missingColumns.join(', ')}` });
            }

            const chunkSize = 100;

            for (let i = 0; i < data.length; i += chunkSize) {
                const chunk = data.slice(i, i + chunkSize);

                const transportData = chunk.map(row => ({
                    transport: row.Transport,
                    transportType: row.TransportType,
                    transportContact: row.TransportContact,
                    transportAgency: row.TransportAgency,
                    organization,
                }));

                await Transport.insertMany(transportData);
            }

            res.status(200).json({ message: 'Transport data uploaded successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing file', error });
        }
    },
    uploadBuyer: async (req, res) => {
        try {
            const { organization } = req.body;
            const fileBuffer = fs.readFileSync(req.file.path);
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const firstRow = data[0];
            const columns = Object.keys(firstRow);
            const missingColumns = buyerColumns.filter(column => !columns.includes(column));

            if (missingColumns.length > 0) {
                return res.status(400).json({ message: `Missing required columns: ${missingColumns.join(', ')}` });
            }

            const chunkSize = 100;

            for (let i = 0; i < data.length; i += chunkSize) {
                const chunk = data.slice(i, i + chunkSize);

                const buyerData = chunk.map(row => ({
                    buyer: row.Buyer,
                    buyerCompany: row.BuyerCompany,
                    buyerdeliveryAddress: {
                        addressLine1: row.AddressLine1,
                        addressLine2: row.AddressLine2,
                        city: row.City,
                        state: row.State,
                        pinCode: row.PinCode,
                    },
                    buyerContact: row.BuyerContact,
                    buyerEmail: row.BuyerEmail,
                    buyerGstno: row.BuyerGstno,
                    buyerGooglemaps: row.BuyerGooglemaps || '',
                    organization,
                }));

                await Buyer.insertMany(buyerData);
            }

            res.status(200).json({ message: 'Buyer data uploaded successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing file', error });
        }
    },
    uploadManufacturer: async (req, res) => {
        try {
            const { organization } = req.body;
            const fileBuffer = fs.readFileSync(req.file.path);
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const firstRow = data[0];
            const columns = Object.keys(firstRow);
            const missingColumns = manufacturerColumns.filter(column => !columns.includes(column));

            if (missingColumns.length > 0) {
                return res.status(400).json({ message: `Missing required columns: ${missingColumns.join(', ')}` });
            }

            const chunkSize = 100;

            for (let i = 0; i < data.length; i += chunkSize) {
                const chunk = data.slice(i, i + chunkSize);

                const manufacturerData = chunk.map(row => ({
                    manufacturer: row.Manufacturer,
                    manufacturerCompany: row.ManufacturerCompany,
                    manufacturerdeliveryAddress: {
                        addressLine1: row.AddressLine1,
                        addressLine2: row.AddressLine2,
                        city: row.City,
                        state: row.State,
                        pinCode: row.PinCode,
                    },
                    manufacturerContact: row.ManufacturerContact,
                    manufacturerEmail: row.ManufacturerEmail,
                    manufacturerGstno: row.ManufacturerGstno,
                    manufacturerGooglemaps: row.ManufacturerGooglemaps || '',
                    organization,
                }));

                await Manufacturer.insertMany(manufacturerData);
            }

            res.status(200).json({ message: 'Manufacturer data uploaded successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing file', error });
        }
    },
};

export default excelUploadController;