import React from "react";
import { Download } from "lucide-react";
import Button from "../components/Button";

const DownloadReports = () => {
  const handleDownload = (format: string) => {
    const element = document.createElement("a");
    const file = new Blob([`Sample report in ${format.toUpperCase()} format.`], {
      type: format === "csv" ? "text/csv" : "application/pdf",
    });
    element.href = URL.createObjectURL(file);
    element.download = `report.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Download Reports</h1>
      <p className="text-gray-600 mb-8">Generate and download detailed election reports.</p>

      {/* Download Options */}
      <div className="space-y-4">
        <Button
          onClick={() => handleDownload("csv")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          <Download className="mr-2 inline-block" /> Download CSV
        </Button>
        <Button
          onClick={() => handleDownload("pdf")}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          <Download className="mr-2 inline-block" /> Download PDF
        </Button>
      </div>
    </div>
  );
};

export default DownloadReports;