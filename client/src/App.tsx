import React, { useState } from "react";
import "./App.css";
import PrintPreviewModal from "./components/PrintPreviewModal";
import printService, { WorkOrderData } from "./services/printService";

function App(): JSX.Element {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState<string>("");

  // Sample work orders array - replace with your actual data
  const sampleWorkOrders: WorkOrderData[] = [
    {
      orderNumber: "12543",
      name: 'Black Sandalwood Bible Bookmark | Cross Design with Golden Tassel | Handcrafted Wooden Scripture Marker | 6" - Brown',
      productSku: "BKM-SDW-PAI-6X5-BRN-004",
      sku: "BKM-SDW-PAI-6X5-BRN-004",
      description: "Custom T-Shirt Design",
      warehouseLocation: "A1-B2",
      batchId: "batch-123",
      designId: "design-456",
      imageUrl: "https://via.placeholder.com/200x200?text=Product+Image",
      customInfo: {
        customerNotes:
          "candyrack_token: hWN3StoOzwT4m3nZUe4ybk4w?key=11d77bec92651ca2018c0e33f9734e7c",
        customField1: "Free 2 Day Shipping",
        customField2: "",
        customField3: "",
      },
      shipTo: "Frances Romero\n4853 STANISLAUS\nADKINS, TX 78101-9667 US",
    },
    {
      orderNumber: "12544",
      name: "Personalized KJV Reference Bible Faux Leather Large Print Size | Custom with Name | Gift for Christian & Religious Celebrations | Pink",
      productSku: "BIB-KJV-PER-LP-PNK-001",
      sku: "BIB-KJV-PER-LP-PNK-001",
      description: "Custom Bible Design",
      warehouseLocation: "B2-C3",
      batchId: "batch-124",
      designId: "design-457",
      imageUrl: "https://via.placeholder.com/200x200?text=Bible+Image",
      customInfo: {
        customerNotes: "Gift wrapping requested",
        customField1: "Express Shipping",
        customField2: "Personalized with name: John Smith",
        customField3: "Gift message: Happy Birthday!",
      },
      shipTo: "John Smith\n123 Main Street\nNew York, NY 10001 US",
    },
  ];

  const handlePrintClick = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setIsPreviewOpen(true);

      // Generate preview
      const url = await printService.generatePreview(sampleWorkOrders);
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

      // Print the work orders
      const result = await printService.printWorkOrder(
        sampleWorkOrders,
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
