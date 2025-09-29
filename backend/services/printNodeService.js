const axios = require("axios");

class PrintNodeService {
  constructor() {
    this.apiKey = process.env.PRINTNODE_API_KEY;
    this.baseURL = "https://api.printnode.com";
    this.headers = {
      Authorization: `Basic ${Buffer.from(this.apiKey + ":").toString(
        "base64"
      )}`,
      "Content-Type": "application/json",
    };
  }

  // Get available printers
  async getPrinters() {
    try {
      const response = await axios.get(`${this.baseURL}/printers`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching printers:", error.message);
      throw error;
    }
  }

  // Print PDF using PrintNode
  async printPDF(pdfBuffer, printerId, jobName = "Work Order") {
    try {
      const printJob = {
        printer: printerId,
        content: pdfBuffer.toString("base64"),
        contentType: "pdf_base64",
        title: jobName,
        source: "Print System",
      };

      const response = await axios.post(`${this.baseURL}/printjobs`, printJob, {
        headers: this.headers,
      });

      return response.data;
    } catch (error) {
      console.error("Error printing PDF:", error.message);
      throw error;
    }
  }

  // Get print job status
  async getPrintJobStatus(jobId) {
    try {
      const response = await axios.get(`${this.baseURL}/printjobs/${jobId}`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching print job status:", error.message);
      throw error;
    }
  }
}

module.exports = PrintNodeService;
