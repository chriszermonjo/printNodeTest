import React, { useState } from "react";
import "./App.css";
import PrintPreviewModal from "./components/PrintPreviewModal";
import printService, { WorkOrderData } from "./services/printService";

function App(): JSX.Element {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState<string>("");

  // Sample work order data - replace with your actual data
  const sampleWorkOrder: WorkOrderData = {
    orderNumber: "ORD-001",
    name: "Personalized KJV Reference Bible Faux Leather Large Print Size | Custom with Name | Gift for Christian & Religious Celebrations | Pink",
    productSku: "SKU-ABC",
    sku: "SKU-ABC1",
    description: "Custom T-Shirt Design",
    warehouseLocation: "A1-B2",
    batchId: "batch-123",
    designId: "design-456",
    imageUrl: "https://via.placeholder.com/200x200?text=Product+Image",
    customInfo: "Special instructions for this order",
    shipTo: "Frances Romero\n4853 STANISLAUS\nADKINS, TX 78101-9667 US",
  };

  const handlePrintClick = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setIsPreviewOpen(true);

      // Generate preview
      const url = await printService.generatePreview(sampleWorkOrder);
      setPreviewUrl(url);
    } catch (error) {
      console.error("Error generating preview:", error);
      alert("Failed to generate preview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPrint = async (): Promise<void> => {
    try {
      if (!selectedPrinter) {
        alert("Please select a printer first");
        return;
      }

      setIsLoading(true);

      // Print the work order
      const result = await printService.printWorkOrder(
        sampleWorkOrder,
        selectedPrinter
      );

      alert(`Print job submitted successfully! Job ID: ${result.printJobId}`);

      // Close modal and cleanup
      handleCloseModal();
    } catch (error) {
      console.error("Error printing:", error);
      alert("Failed to print work order");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = (): void => {
    setIsPreviewOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="app">
      <div className="print-container">
        <h1>Print System</h1>

        <div className="printer-selection">
          <label htmlFor="printer-select">Select Printer:</label>
          <select
            id="printer-select"
            value={selectedPrinter}
            onChange={(e) => setSelectedPrinter(e.target.value)}
            className="printer-select"
          >
            <option value="">Choose a printer...</option>
            <option value="printer-1">Printer 1</option>
            <option value="printer-2">Printer 2</option>
          </select>
        </div>

        <button
          className="print-button"
          onClick={handlePrintClick}
          disabled={!selectedPrinter}
        >
          Print Work Order
        </button>
      </div>

      <PrintPreviewModal
        isOpen={isPreviewOpen}
        onClose={handleCloseModal}
        onConfirmPrint={handleConfirmPrint}
        previewUrl={previewUrl}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
