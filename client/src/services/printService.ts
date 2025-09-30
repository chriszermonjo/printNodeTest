const API_BASE_URL = "http://localhost:5000/api";

export interface WorkOrderData {
  orderNumber: string;
  name: string;
  productSku: string;
  sku: string;
  description?: string;
  warehouseLocation?: string;
  batchId?: string;
  designId?: string;
  imageUrl?: string;
  customInfo?: string;
  shipTo?: string;
}

export interface PrintJobResponse {
  message: string;
  printJobId: string;
  status: string;
}

export interface Printer {
  id: string;
  name: string;
  state: string;
}

class PrintService {
  // Get available printers
  async getPrinters(): Promise<Printer[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/print/printers`);
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching printers:", error);
      throw error;
    }
  }

  // Generate PDF preview
  async generatePreview(workOrderData: WorkOrderData): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/print/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workOrderData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate preview");
      }

      // Create blob URL for the PDF
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error generating preview:", error);
      throw error;
    }
  }

  // Print work order
  async printWorkOrder(
    workOrderData: WorkOrderData,
    printerId: string
  ): Promise<PrintJobResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/print/print`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workOrderData,
          printerId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to print work order");
      }

      return await response.json();
    } catch (error) {
      console.error("Error printing work order:", error);
      throw error;
    }
  }

  // Print batch of work orders
  async printBatch(
    workOrders: WorkOrderData[],
    printerId: string
  ): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/print/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workOrders,
          printerId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to print batch");
      }

      return await response.json();
    } catch (error) {
      console.error("Error printing batch:", error);
      throw error;
    }
  }

  // Get print job status
  async getPrintJobStatus(jobId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/print/status/${jobId}`);

      if (!response.ok) {
        throw new Error("Failed to get print job status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting print job status:", error);
      throw error;
    }
  }
}

export default new PrintService();
