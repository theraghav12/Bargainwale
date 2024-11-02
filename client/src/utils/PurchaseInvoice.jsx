import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    // backgroundColor: '#E4E4E4',
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
// Font.register({family:'Times-Roman',src:""})

const PurchaseInvoice = ({ purchase, organization }) => {
  function formatDate(dateString) {
    return new Date(dateString)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  }

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
                  Aman Tiwar, B302 Ratan Orbit, Naramau, Kalyanpur, Kanpur
                  Nagar, Uttar Pradesh, 208016
                </Text>
              </View>
              <View style={{ padding: "5px" }}>
                <Text style={{ fontSize: "10px" }}>Ship To:</Text>
                <Text style={{ fontSize: "10px" }}>
                  Aman Tiwar, B302 Ratan Orbit, Naramau, Kalyanpur, Kanpur
                  Nagar, Uttar Pradesh, 208016
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
              <Text style={{ fontSize: "12px" }}>
                Invoice No: {purchase.invoiceNumber}
              </Text>
              <Text style={{ fontSize: "12px" }}>
                Date: {formatDate(purchase.invoiceDate)}
              </Text>
              <Text style={{ fontSize: "12px" }}>
                Transporter : {purchase.transporterId.transport}
              </Text>
              <Text style={{ fontSize: "12px" }}>
                Transaction No. : 890998778
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
            <View style={{ width: "100%", flexDirection: "row" }}>
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
                  1
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
                  Shower with steel handle
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
                  342536756
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
                  2
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
                  900
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
                  162.00 (9%+9%)
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
                  1800.00
                </Text>
              </View>
            </View>
            {/* sub-total line */}
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
              <View style={{ width: "15%", textAlign: "left" }}>
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "5px",
                    borderRight: "1px solid black",
                  }}
                >
                  324.00 (CGST + SGST){" "}
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
                  1800.00
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              borderBottom: "1px solid black",
              textAlign: "left",
              flexDirection: "row",
            }}
          >
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
                  Three Thousand Six Hundred Only
                </Text>
              </View>
            </View>
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
                    300.00
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
                    324.00
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
                    1824.00
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
                    1824.00
                  </Text>
                </View>
              </View>
            </View>
          </View>
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
