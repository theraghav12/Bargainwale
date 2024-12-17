import React, { useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { getPricesByWarehouse } from "@/services/itemService";
import {
  formatDate,
  numberToWords,
  toTitleCase,
  roundOff,
} from "../../utils/helper.js";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 10,
  },
  main: {
    width: "100%",
    textAlign: "center",
    flexGrow: 1,
    border: "1px solid black",
  },
  section: {
    width: "100%",
    textAlign: "center",
    flexGrow: 0,
    backgroundColor: "lightgray",
    borderBottom: "1px solid black",
    fontSize: "16px",
    padding: "6px",
    fontWeight: "bold",
  },
});

const PurchaseInvoice = ({ purchase, organization }) => {
  let totalTax = 0;
  let grandTotal = 0;
  const [prices, setPrices] = useState(null);

  // Function to fetch prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await getPricesByWarehouse(purchase.warehouseId._id);
        setPrices(response);
      } catch (error) {
        console.error(
          "Failed to fetch item prices for the given warehouse",
          error
        );
      }
    };
    fetchPrices();
  }, [purchase, organization]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.main}>
          <View style={styles.section}>
            <Text style={{ fontFamily: "Times-Bold" }}>{organization}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              fontSize: "10px",
              fontWeight: "medium",
              padding: "5px",
              justifyContent: "space-between",
              borderBottom: "1px solid black",
            }}
          >
            <View style={{ width: "33.33%", textAlign: "left" }}>
              <Text>GST: SDOASOI798</Text>
            </View>
            <Text style={{ width: "33.33%" }}>TAX INVOICE</Text>
            <Text style={{ width: "33.33%", textAlign: "right" }}>
              Original
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              borderBottom: "1px solid black",
            }}
          >
            <View
              style={{
                width: "50%",
                minHeight: "100px",
                maxHeight: "180px",
                borderRight: "1px solid black",
                textAlign: "left",
              }}
            >
              <View
                style={{
                  borderBottom: "1px solid black",
                  height: "50%",
                  padding: "5px",
                }}
              >
                <Text style={{ fontSize: "10px" }}>Bill To:</Text>
                <Text style={{ fontSize: "10px" }}>
                  {`${purchase.orderId.manufacturer.manufacturer}, ${purchase.orderId.manufacturer.manufacturerdeliveryAddress.addressLine1}, ${purchase.orderId.manufacturer.manufacturerdeliveryAddress.addressLine2}, ${purchase.orderId.manufacturer.manufacturerdeliveryAddress.city}, ${purchase.orderId.manufacturer.manufacturerdeliveryAddress.state}, ${purchase.orderId.manufacturer.manufacturerdeliveryAddress.pinCode}`}
                </Text>
              </View>
              <View style={{ padding: "5px" }}>
                <Text style={{ fontSize: "10px" }}>Ship To:</Text>
                <Text style={{ fontSize: "10px" }}>
                  {`${purchase.orderId.manufacturer.manufacturer}, ${purchase.orderId.manufacturer.manufacturerdeliveryAddress.addressLine1}, ${purchase.orderId.manufacturer.manufacturerdeliveryAddress.addressLine2}, ${purchase.orderId.manufacturer.manufacturerdeliveryAddress.city}, ${purchase.orderId.manufacturer.manufacturerdeliveryAddress.state}, ${purchase.orderId.manufacturer.manufacturerdeliveryAddress.pinCode}`}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "50%",
                textAlign: "left",
                fontSize: "12px",
                flexDirection: "column",
                rowGap: "10px",
                padding: "10px",
              }}
            >
              <Text
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap", // Ensures text stays on one line
                  overflow: "hidden", // Hides overflowed content
                  textOverflow: "ellipsis", // Adds ellipsis for overflow
                }}
              >
                Invoice No: {purchase.invoiceNumber}
              </Text>
              <Text style={{ fontSize: "12px" }}>
                Date: {formatDate(purchase.invoiceDate)}
              </Text>
              <Text style={{ fontSize: "12px" }}>
                Transporter : {purchase.transporterId.transport}
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap", // Ensures text stays on one line
                  overflow: "hidden", // Hides overflowed content
                  textOverflow: "ellipsis", // Adds ellipsis for overflow
                }}
              >
                Invoice No: {purchase.invoiceNumber}
              </Text>
            </View>
          </View>
          <View style={{ width: "100%", borderBottom: "1px solid black" }}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                borderBottom: "1px solid black",
                backgroundColor: "lightgray",
              }}
            >
              <View
                style={{
                  width: "10%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                }}
              >
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "5px",
                  }}
                >
                  SrNO.
                </Text>
              </View>
              <View
                style={{
                  width: "20%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                }}
              >
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "5px",
                  }}
                >
                  Item Name
                </Text>
              </View>
              <View
                style={{
                  width: "15%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                }}
              >
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "5px",
                  }}
                >
                  HSN
                </Text>
              </View>
              <View
                style={{
                  width: "10%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                }}
              >
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "5px",
                  }}
                >
                  Qty
                </Text>
              </View>
              <View
                style={{
                  width: "10%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                }}
              >
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "5px",
                  }}
                >
                  Price
                </Text>
              </View>
              <View
                style={{
                  width: "15%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                }}
              >
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "5px",
                  }}
                >
                  Tax(per unit)
                </Text>
              </View>
              <View style={{ width: "20%", textAlign: "left" }}>
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "5px",
                  }}
                >
                  Amount
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "column" }}>
              {(() => {
                // Initialize accumulators
                let subtotal = 0;

                // Map through purchase items
                const items = purchase.items.map((item, index) => {
                  const pickup = item.pickup;
                  const quantity = item.quantity;
                  let itemPrice = 0;
                  let taxPerUnit = 0;
                  let totalAmount = 0;

                  if (prices) {
                    const priceObj = prices.items.find(
                      (price) => price.item._id === item.itemId._id
                    );
                    if (priceObj) {
                      // Determine item price based on pickup type
                      if (pickup === "rack") itemPrice = priceObj.rackPrice;
                      else if (pickup === "company")
                        itemPrice = priceObj.companyPrice;
                      else if (pickup === "plant")
                        itemPrice = priceObj.plantPrice;
                      else if (pickup === "depot")
                        itemPrice = priceObj.depoPrice;

                      taxPerUnit = (item.itemId.gst / 100) * itemPrice;
                      totalAmount = quantity * (itemPrice + taxPerUnit);

                      // Accumulate values
                      subtotal += quantity * itemPrice;
                      totalTax += quantity * taxPerUnit;
                      grandTotal += totalAmount;
                    }
                  }

                  // Render each item row
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottom: "1px solid black",
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          width: "10%",
                          textAlign: "left",
                          borderRight: "1px solid black",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            padding: "5px",
                          }}
                        >
                          {index + 1}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "20%",
                          textAlign: "left",
                          borderRight: "1px solid black",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            padding: "5px",
                          }}
                        >
                          {item.itemId.materialdescription || "N/A"}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "15%",
                          textAlign: "left",
                          borderRight: "1px solid black",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            padding: "5px",
                          }}
                        >
                          {item.hsn || "N/A"}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "10%",
                          textAlign: "left",
                          borderRight: "1px solid black",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            padding: "5px",
                          }}
                        >
                          {quantity || 0}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "10%",
                          textAlign: "left",
                          borderRight: "1px solid black",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            padding: "5px",
                          }}
                        >
                          {itemPrice.toFixed(2)}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "15%",
                          textAlign: "left",
                          borderRight: "1px solid black",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            padding: "5px",
                          }}
                        >
                          {taxPerUnit.toFixed(2)} ({item.itemId.gst}% GST)
                        </Text>
                      </View>
                      <View style={{ width: "20%", textAlign: "left" }}>
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            padding: "5px",
                          }}
                        >
                          {totalAmount.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  );
                });

                // Render rows and accumulated totals
                return (
                  <>
                    {items}
                    {/* Subtotal Row */}
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        borderTop: "1px solid black",
                      }}
                    >
                      <View
                        style={{
                          width: "65%",
                          textAlign: "right",
                          borderRight: "1px solid black",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            padding: "5px",
                          }}
                        >
                          Subtotal
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "15%",
                          textAlign: "left",
                          borderRight: "1px solid black",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            padding: "5px",
                          }}
                        >
                          {`${totalTax.toFixed(2)} (CGST + SGST)`}
                        </Text>
                      </View>
                      <View style={{ width: "20%", textAlign: "left" }}>
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            padding: "5px",
                          }}
                        >
                          {grandTotal.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </>
                );
              })()}
            </View>
            ;
          </View>
          <View
            style={{
              width: "100%",
              borderBottom: "1px solid black",
              textAlign: "left",
              flexDirection: "row",
            }}
          >
            {/* Left Column: Bill Amount in Words */}
            <View style={{ width: "50%", borderRight: "1px solid black" }}>
              <View>
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "5px",
                  }}
                >
                  Bill Amount in words :
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "black",
                    padding: "5px",
                  }}
                >
                  {"Rs. " +
                    toTitleCase(numberToWords(roundOff(grandTotal))) +
                    " Only"}
                </Text>
              </View>
            </View>

            {/* Right Column: Discount, GST, Round Off, and Grand Total */}
            <View style={{ width: "50%", flexDirection: "column" }}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  borderBottom: "1px solid black",
                }}
              >
                <View style={{ width: "60%" }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "5px",
                      borderRight: "1px solid black",
                    }}
                  >
                    Discount
                  </Text>
                </View>
                <View style={{ width: "40%" }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "black",
                      padding: "5px",
                    }}
                  >
                    {0}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  borderBottom: "1px solid black",
                }}
              >
                <View style={{ width: "60%" }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "5px",
                      borderRight: "1px solid black",
                    }}
                  >
                    GST (CGST + SGST)
                  </Text>
                </View>
                <View style={{ width: "40%" }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "black",
                      padding: "5px",
                    }}
                  >
                    {totalTax.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  borderBottom: "1px solid black",
                }}
              >
                <View style={{ width: "60%" }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "5px",
                      borderRight: "1px solid black",
                    }}
                  >
                    Grand Total
                  </Text>
                </View>
                <View style={{ width: "40%" }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "black",
                      padding: "5px",
                    }}
                  >
                    {grandTotal.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={{ width: "60%" }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "5px",
                      borderRight: "1px solid black",
                    }}
                  >
                    Round Off
                  </Text>
                </View>
                <View style={{ width: "40%" }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "black",
                      padding: "5px",
                    }}
                  >
                    {roundOff(grandTotal)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          ;
          <View
            style={{
              width: "100%",
              borderBottom: "1px solid black",
              textAlign: "left",
              backgroundColor: "lightgray",
            }}
          >
            <Text
              style={{ fontSize: "10px", fontWeight: "bold", padding: "5px" }}
            >
              Terms and Conditions:
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              borderBottom: "1px solid black",
              textAlign: "left",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "black",
                padding: "5px",
              }}
            >
              1. Goods once sold will not be taken back.
            </Text>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "black",
                padding: "5px",
              }}
            >
              2. Interest @24% will be charged if payment is not made within 7
              days.
            </Text>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "black",
                padding: "5px",
              }}
            >
              3. Subject to Delhi Jurisdiction.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default PurchaseInvoice;
