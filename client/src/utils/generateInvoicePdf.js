import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateInvoicePDF = async (purchase) => {
    const doc = new jsPDF("portrait", "pt", "A4");

    // Company Header
    doc.setFontSize(16);
    doc.text("PATANJALI FOODS LIMITED", 40, 40);
    doc.setFontSize(12);
    doc.text("CIN L15140MH1986PLC038536   GSTIN:09AAACR2892L1ZW  PANNO : AAACR2892L", 40, 60);
    doc.text("Address : Plot No. 64, 65, 66, Transport Nagar, ALLAHABAD, UTTAR PRADESH, Pin- 211003", 40, 80);
    doc.text("Phone(F):05322-684723   Web : www.patanjalifoods.com  Email : wecare@patanjalifoods.co.in", 40, 100);

    // Invoice Details
    doc.setFontSize(14);
    doc.text("Tax Invoice", 40, 130);

    doc.setFontSize(12);
    doc.text(`Invoice No.: ${purchase.invoiceNumber}`, 40, 150);
    doc.text(`Date & Time of issue: ${new Date(purchase.invoiceDate).toLocaleDateString()}`, 40, 170);
    doc.text(`Vehicle No.: ${purchase.vehicleNo || 'UP70LT2432'}`, 40, 190);
    doc.text(`E-Waybill No.: ${purchase.ewaybill || '401421053525'}`, 40, 210);
    doc.text(`Place of Supply: ${purchase.placeOfSupply || 'PRAYAGRAJ'}`, 40, 230);

    // Itemized Table (example items)
    const items = purchase.items.map((item, index) => [
        index + 1,
        item.materialDescription || "Material Description",
        `${item.quantity} ${item.unit}`,
        item.rate,
        item.discount || "0%",
        item.taxableValue,
        item.sgst,
        item.cgst,
        item.igst || "0%"
    ]);

    doc.autoTable({
        head: [
            ["Sr.", "Material Description", "Quantity/UOM", "Rate / Unit", "Discount", "Taxable Value", "SGST", "CGST", "IGST"]
        ],
        body: items,
        startY: 260,
        theme: "grid",
        styles: {
            fontSize: 10,
            textColor: [0, 0, 0],
        },
    });

    // Footer (Totals)
    doc.text(`Total: ${purchase.totalTaxableValue}`, 400, doc.autoTable.previous.finalY + 30);
    doc.text(`Total SGST: ${purchase.totalSGST}`, 400, doc.autoTable.previous.finalY + 50);
    doc.text(`Total CGST: ${purchase.totalCGST}`, 400, doc.autoTable.previous.finalY + 70);
    doc.text(`Grand Total: ${purchase.grandTotal}`, 400, doc.autoTable.previous.finalY + 90);
    doc.text(`Amount in Words: ${purchase.amountInWords || "RUPEES SIXTY THOUSAND FOUR HUNDRED SEVENTY THREE ONLY"}`, 40, doc.autoTable.previous.finalY + 120);

    // Footer Details (prepared, checked by)
    doc.text("Prepared By         Checked By         Received By         Authorised Signatory", 40, doc.autoTable.previous.finalY + 160);

    // Save the PDF
    doc.save(`invoice_${purchase.invoiceNumber}.pdf`);
};
