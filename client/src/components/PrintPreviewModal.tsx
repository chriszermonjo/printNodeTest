import React, { useState } from "react";
import "./PrintPreviewModal.css";

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPrint: () => void;
  previewUrl: string | null;
  isLoading: boolean;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  onConfirmPrint,
  previewUrl,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Print Preview</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Generating preview...</p>
            </div>
          ) : previewUrl ? (
            <iframe
              src={previewUrl}
              className="pdf-preview"
              title="Print Preview"
            />
          ) : (
            <div className="error-container">
              <p>Failed to generate preview</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="confirm-print-button"
            onClick={onConfirmPrint}
            disabled={!previewUrl || isLoading}
          >
            Confirm Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewModal;
