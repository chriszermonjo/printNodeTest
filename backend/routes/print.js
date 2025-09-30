const express = require("express");
const PDFGenerator = require("../services/pdfGenerator");
const PrintNodeService = require("../services/printNodeService");

const router = express.Router();
const pdfGenerator = new PDFGenerator();
const printNodeService = new PrintNodeService();

// Initialize PDF generator
pdfGenerator.init();

// POST /api/print/preview - Generate PDF preview (returns PDF as response)
router.post("/preview", async (req, res) => {
  try {
    const workOrderData = req.body;
    console.log(workOrderData);

    // Generate PDF buffer - handle both single work order and array
    const pdfBuffer = await pdfGenerator.generateWorkOrderPDF(workOrderData);

    // Set headers for PDF response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "inline; filename=work-order-preview.pdf"
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF preview:", error);
    res.status(500).json({
      error: "Failed to generate PDF preview",
      message: error.message,
    });
  }
});

// POST /api/print/print - Print PDF using PrintNode
router.post("/print", async (req, res) => {
  try {
    const { workOrderData, printerId } = req.body;

    if (!printerId) {
      return res.status(400).json({
        error: "Printer ID is required",
      });
    }

    // Generate PDF buffer - handle both single work order and array
    const pdfBuffer = await pdfGenerator.generateWorkOrderPDF(workOrderData);

    // Determine title based on whether it's single or multiple work orders
    const title = Array.isArray(workOrderData)
      ? `Work Orders - ${workOrderData.length} items`
      : `Work Order - ${workOrderData.orderNumber}`;

    // Print using PrintNode
    const printJob = await printNodeService.printPDF(
      pdfBuffer,
      printerId,
      title
    );

    res.json({
      message: "Print job submitted successfully",
      printJobId: printJob.id,
      status: printJob.state,
    });
  } catch (error) {
    console.error("Error printing PDF:", error);
    res.status(500).json({
      error: "Failed to print PDF",
      message: error.message,
    });
  }
});

// GET /api/print/printers - Get available printers
router.get("/printers", async (req, res) => {
  try {
    const printers = await printNodeService.getPrinters();
    res.json({
      message: "Printers retrieved successfully",
      data: printers,
    });
  } catch (error) {
    console.error("Error fetching printers:", error);
    res.status(500).json({
      error: "Failed to fetch printers",
      message: error.message,
    });
  }
});

// GET /api/print/status/:jobId - Get print job status
router.get("/status/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const status = await printNodeService.getPrintJobStatus(jobId);

    res.json({
      message: "Print job status retrieved",
      data: status,
    });
  } catch (error) {
    console.error("Error fetching print job status:", error);
    res.status(500).json({
      error: "Failed to fetch print job status",
      message: error.message,
    });
  }
});

// POST /api/print/batch - Print multiple work orders for a batch
router.post("/batch", async (req, res) => {
  try {
    const { workOrders, printerId } = req.body;

    if (!printerId || !workOrders || !Array.isArray(workOrders)) {
      return res.status(400).json({
        error: "Printer ID and work orders array are required",
      });
    }

    const printJobs = [];

    // Generate and print each work order
    for (const workOrderData of workOrders) {
      const pdfBuffer = await pdfGenerator.generateWorkOrderPDF(workOrderData);
      const printJob = await printNodeService.printPDF(
        pdfBuffer,
        printerId,
        `Work Order - ${workOrderData.orderNumber}`
      );
      printJobs.push({
        orderNumber: workOrderData.orderNumber,
        printJobId: printJob.id,
        status: printJob.state,
      });
    }

    res.json({
      message: "Batch print jobs submitted successfully",
      data: printJobs,
    });
  } catch (error) {
    console.error("Error printing batch:", error);
    res.status(500).json({
      error: "Failed to print batch",
      message: error.message,
    });
  }
});

module.exports = router;
