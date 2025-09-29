const puppeteer = require("puppeteer");
const QRCode = require("qrcode");
const JsBarcode = require("jsbarcode");
const { createCanvas } = require("canvas");

class PDFGenerator {
  constructor() {
    this.browser = null;
  }

  // Initialize browser (call this once at startup)
  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }
  }

  // Generate QR Code
  async generateQRCode(text) {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(text, {
        width: 80,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error("Error generating QR code:", error);
      return null;
    }
  }

  // Generate Barcode
  async generateBarcode(text) {
    try {
      const canvas = createCanvas(120, 60);
      JsBarcode(canvas, text, {
        format: "CODE128",
        width: 2,
        height: 45,
        displayValue: true,
        fontSize: 12,
        margin: 8,
      });
      return canvas.toDataURL();
    } catch (error) {
      console.error("Error generating barcode:", error);
      return null;
    }
  }

  // Generate work order PDF
  async generateWorkOrderPDF(workOrderData) {
    if (!this.browser) {
      await this.init();
    }

    const page = await this.browser.newPage();

    // Generate QR code and barcode
    const qrCodeDataURL = await this.generateQRCode(workOrderData.orderNumber);
    const barcodeDataURL = await this.generateBarcode(
      workOrderData.orderNumber
    );

    // Generate HTML content for the work order
    const htmlContent = this.generateWorkOrderHTML(
      workOrderData,
      qrCodeDataURL,
      barcodeDataURL
    );

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF buffer (in memory, not saved to disk)
    const pdfBuffer = await page.pdf({
      width: "4in",
      height: "6in",
      printBackground: true,
      margin: {
        top: "0.2in",
        right: "0.2in",
        bottom: "0.2in",
        left: "0.2in",
      },
    });

    await page.close();
    return pdfBuffer;
  }

  // Generate HTML content for work order
  generateWorkOrderHTML(data, qrCodeDataURL, barcodeDataURL) {
    const {
      orderNumber,
      productSku,
      sku,
      description,
      warehouseLocation,
      batchId,
      designId,
      imageUrl,
      customInfo,
      shipTo,
    } = data;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Work Order - ${orderNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 8px;
              background: white;
              font-size: 10px;
              line-height: 1.2;
            }
            .header {
              text-align: center;
              padding-bottom: 8px;
              margin-bottom: 8px;
            }
            .header h1 {
              color: #333;
              margin: 0;
              font-size: 16px;
              font-weight: bold;
            }
            .header p {
              margin: 2px 0 0 0;
              font-size: 12px;
              font-weight: bold;
            }
            .main-content {
              display: flex;
              gap: 6px;
              margin-bottom: 6px;
            }
            .left-column {
              flex: 1;
            }
            .right-column {
              flex: 1;
            }
            .info-section {
              background: #f8f9fa;
              padding: 6px;
              border-radius: 3px;
              margin-bottom: 4px;
            }
            .info-section h3 {
              margin: 0 0 4px 0;
              color: #333;
              font-size: 10px;
              font-weight: bold;
            }
            .info-item {
              margin: 2px 0;
              display: flex;
              justify-content: space-between;
              font-size: 9px;
            }
            .info-label {
              font-weight: bold;
              color: #666;
            }
            .info-value {
              color: #333;
              font-weight: bold;
            }
            .product-image {
              text-align: center;
              margin: 4px 0;
            }
            .product-image img {
              max-width: 80px;
              max-height: 80px;
              border: 1px solid #ddd;
              border-radius: 3px;
            }
            .footer {
              margin-top: 6px;
              text-align: center;
              border-top: 1px solid #ddd;
              padding-top: 4px;
              color: #666;
              font-size: 8px;
            }
            .batch-info {
              background: #e3f2fd;
              padding: 4px;
              border-radius: 3px;
              margin: 4px 0;
              font-size: 9px;
            }
            .custom-info {
              background: #fff3e0;
              padding: 4px;
              border-radius: 3px;
              margin: 4px 0;
              font-size: 9px;
            }
            .description {
              background: #f0f0f0;
              padding: 4px;
              border-radius: 3px;
              margin: 4px 0;
              font-size: 9px;
            }
            .qr-code {
              text-align: center;
              margin: 4px 0;
              font-size: 8px;
              color: #666;
            }
            .ship-to-section {
              margin: 8px 0;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .ship-to-left {
              flex: 1;
              text-align: left;
            }
            .ship-to-right {
              flex: 0 0 auto;
              margin-left: 10px;
            }
            .ship-to-label {
              font-weight: normal;
              font-size: 10px;
              color: #333;
              margin-bottom: 2px;
            }
            .ship-to-address {
              font-size: 9px;
              color: #333;
              line-height: 1.3;
              white-space: pre-line;
              font-weight: bold;
            }
            .full-width-divider {
              border-bottom: 1px solid #333;
              margin: 8px 0;
              width: 100%;
            }
            .barcode-container {
              text-align: center;
            }
            .barcode-image {
              max-width: 120px;
              max-height: 60px;
              display: block;
              margin: 0 auto;
            }
            .barcode-placeholder {
              width: 120px;
              height: 60px;
              background: #f0f0f0;
              border: 1px dashed #ccc;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #999;
              font-size: 10px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>WORK ORDER</h1>
          </div>
          
          <div class="ship-to-section">
            <div class="ship-to-left">
              <div class="ship-to-label">Ship To:</div>
              <div class="ship-to-address">${shipTo || ""}</div>
            </div>
            <div class="ship-to-right">
              <div class="barcode-container">
                ${
                  barcodeDataURL
                    ? `
                  <img src="${barcodeDataURL}" alt="Barcode" class="barcode-image" />
                `
                    : `
                  <div class="barcode-placeholder">Barcode</div>
                `
                }
              </div>
            </div>
          </div>
          
          <div class="full-width-divider"></div>
        </body>
      </html>
    `;
  }

  // Close browser when done
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

module.exports = PDFGenerator;
