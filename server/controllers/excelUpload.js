import fs from "fs-extra";
import * as XLSX from "xlsx";
import Warehouse from "../models/warehouse.js";

const warehouseColumns = ['Name', 'State', 'City', 'ManagerName', 'ManagerEmail'];
const itemColumns = ['Flavor', 'HSNCode', 'Material', 'MaterialDescription', 'NetWeight', 'GrossWeight', 'GST', 'Packaging', 'PackSize', 'StaticPrice'];

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
                        staticPrice: row.StaticPrice,
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
};

export default excelUploadController;