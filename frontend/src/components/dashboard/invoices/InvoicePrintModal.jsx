"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import royal_logo from "@/assets/logo/royal-logo.png";

export default function InvoicePrintModal({ isOpen, onClose, invoice }) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    const printContent = document.getElementById("printable-receipt-content");
    if (!printContent) return;

    const originalTitle = document.title;
    const fileName = invoice.invoiceNumber || "Invoice";

    // Set main window title so browser defaults to Invoice Number filename (e.g. RST-1001.pdf)
    document.title = fileName;

    // Create an isolated hidden iframe for 100% clean A4 printing
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fileName}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            :root {
              --color-primary: #0D231E;
              --color-secondary: #0D231E;
            }
            body {
              font-family: 'Plus Jakarta Sans', sans-serif !important;
              background-color: white !important;
              color: #1a1a1a !important;
              margin: 0 !important;
              padding: 16px !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box !important;
            }
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
          </style>
        </head>
        <body>
          <div style="width: 100%;">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Trigger iframe print after resources load
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        document.title = originalTitle;
      }, 1000);
    }, 600);
  };

  const formatDateStr = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const subTotal = Number(invoice.subTotal) || 0;
  const discount = Number(invoice.discount) || 0;
  const totalAmount = Number(invoice.totalAmount) || subTotal - discount;
  const amountPaid = Number(invoice.amountPaid) || 0;
  const balanceDue =
    Number(invoice.balanceDue) || Math.max(0, totalAmount - amountPaid);

  return (
    <div
      id="printable-invoice-modal-root"
      className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto font-body"
    >
      <div
        id="printable-invoice-modal-container"
        className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[95vh] overflow-y-auto relative"
      >
        {/* TOP MODAL CONTROL BAR */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4 font-body">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold shrink-0">
              <Icon icon="lucide:printer" className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-[#0D231E] font-heading truncate">
              INVOICE{" "}
              <span className="text-gray-400 font-mono text-xs">
                #{invoice.invoiceNumber}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Icon icon="lucide:download" className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Close Preview"
            >
              <Icon icon="lucide:x" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT AREA */}
        <div
          id="printable-receipt-content"
          className="bg-white p-4 sm:p-8 font-body text-[#1a1a1a]"
        >
          {/* RECEIPT HEADER */}
          <div className="flex flex-row items-start justify-between gap-6 pb-6 border-b border-gray-200">
            {/* LOGO & COMPANY INFO (LEFT COLUMN) */}
            <div className="space-y-2 max-w-sm">
              <div className="relative w-48 h-14">
                <Image
                  src={royal_logo}
                  alt="Royal Safari Tours"
                  className="w-full h-full object-contain object-left"
                  priority
                />
              </div>
              <div className="space-y-1 pt-0.5">
                <p className="text-sm font-extrabold text-[#0D231E] leading-snug">
                  Royal Safari Tours
                </p>
                <p className="text-xs font-bold text-gray-700 font-mono">
                  +8801850-958525
                </p>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  212, Taltola City Super Market, Khilgaon, Dhaka 1219
                </p>
              </div>
            </div>

            {/* RECEIPT TITLE & NUMBERS (RIGHT COLUMN) */}
            <div className="flex flex-col justify-between items-end text-right space-y-2">
              <div>
                <h1 className="text-3xl font-extrabold font-heading text-[#0D231E] leading-none tracking-tight">
                  INVOICE
                </h1>
                <p className="text-sm font-bold text-gray-500 font-mono pt-1">
                  # {invoice.invoiceNumber}
                </p>
              </div>

              <div className="pt-1 text-xs">
                <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 items-center text-right">
                  <span className="text-gray-400 font-medium">Date:</span>
                  <span className="font-semibold text-gray-900 font-mono">
                    {formatDateStr(invoice.invoiceDate)}
                  </span>

                  {invoice.paymentTerms && (
                    <>
                      <span className="text-gray-400 font-medium">Payment Terms:</span>
                      <span className="font-semibold text-gray-900">
                        {invoice.paymentTerms}
                      </span>
                    </>
                  )}

                  {invoice.dueDate && (
                    <>
                      <span className="text-gray-400 font-medium">Due Date:</span>
                      <span className="font-semibold text-gray-900 font-mono">
                        {formatDateStr(invoice.dueDate)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* BILL TO CLIENT DETAILS */}
          <div className="py-6 border-b border-gray-100 space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Bill To:
            </span>
            <p className="text-base font-bold text-[#0D231E]">
              {invoice.clientName}
            </p>
            <p className="text-xs text-gray-700 font-mono">
              {invoice.clientPhone}
            </p>
            {invoice.clientEmail && (
              <p className="text-xs text-gray-600">{invoice.clientEmail}</p>
            )}
            {invoice.clientAddress && (
              <p className="text-xs text-gray-600">{invoice.clientAddress}</p>
            )}
          </div>

          {/* LINE ITEMS TABLE */}
          <div className="py-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0D231E] text-white text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-md">Item</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4 text-right">Rate</th>
                  <th className="py-3 px-4 text-right rounded-r-md">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {invoice.items?.map((item, idx) => (
                  <tr key={idx} className="align-top">
                    <td className="py-4 px-4 space-y-1 max-w-md">
                      <p className="font-bold text-[#0D231E] leading-relaxed">
                        {item.itemDescription}
                      </p>
                      {item.subDescription && (
                        <p className="text-[11px] text-gray-500 font-light italic">
                          {item.subDescription}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-semibold text-gray-800">
                      {item.quantity}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-semibold text-gray-800">
                      BDT{" "}
                      {Number(item.rate).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-[#0D231E]">
                      BDT{" "}
                      {Number(item.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS SUMMARY */}
          <div className="flex flex-col items-end gap-1.5 py-4 border-t border-gray-200 text-xs">
            <div className="flex justify-between w-full max-w-xs text-gray-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">
                BDT{" "}
                {subTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between w-full max-w-xs text-gray-600">
                <span>Discount:</span>
                <span className="font-mono text-rose-600">
                  - BDT{" "}
                  {discount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            <div className="flex justify-between w-full max-w-xs text-sm font-bold text-[#0D231E] pt-2 border-t border-gray-100">
              <span>Total:</span>
              <span className="font-mono">
                BDT{" "}
                {totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between w-full max-w-xs text-xs font-semibold text-gray-700 pt-1">
              <span>Amount Paid:</span>
              <span className="font-mono">
                BDT{" "}
                {amountPaid.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between w-full max-w-xs text-xs font-bold text-rose-600 pt-1">
              <span>Balance Due:</span>
              <span className="font-mono">
                BDT{" "}
                {balanceDue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* NOTES */}
          {invoice.notes && (
            <div className="pt-6 space-y-1 text-xs">
              <span className="font-bold text-gray-500">Notes:</span>
              <p className="text-gray-700 font-medium">{invoice.notes}</p>
            </div>
          )}

          {/* SIGNATURE & CREATOR FOOTER BLOCK */}
          <div className="pt-12 flex items-end justify-between text-xs font-body">
            <div className="space-y-1 pb-2">
              <p className="font-semibold text-gray-700">
                Prepared By:{" "}
                <span className="font-bold text-[#0D231E]">
                  {invoice.creatorName || invoice.createdBy?.name || "Staff"}
                </span>
              </p>
              {invoice.createdBy?.employee?.employeeId && (
                <p className="text-[11px] text-gray-400 font-mono">
                  Employee ID: {invoice.createdBy.employee.employeeId}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center text-center w-52 font-body space-y-2">
              {/* Stamp & Seal Combo (Positioned Above Signature Line) */}
              <div className="relative w-full h-16 flex items-center justify-center">
                {/* Signature Pen Image (Background) */}
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <img
                    src="/images/rst-signature.png"
                    alt="Royal Safari Tours Proprietor Stamp & Signature"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Purple Text Seal Layer (Foreground) */}
                <div className="relative z-10 space-y-0.5 pointer-events-none text-center">
                  <p className="font-bold text-[#595FAE] text-base leading-tight">
                    Royal Safari Tours
                  </p>
                  <br></br>
                  <p className="text-[11px] text-[#595FAE] font-semibold tracking-wide text-right">
                    Proprietor
                  </p>
                </div>
              </div>

              {/* Dashed Signature Line & Footer Label */}
              <div className="w-full border-t-2 border-dashed border-gray-400 pt-1.5 space-y-0.5">
                <p className="font-bold text-[#0D231E] text-xs">
                  Royal Safari Tours
                </p>
                <p className="text-[11px] text-gray-500">
                  Signature / Proprietor
                </p>
              </div>
            </div>
          </div>

          {/* POWERED BY FOOTER */}
          <div className="pt-6 mt-8 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-body">
            <p className="text-gray-400">
              Thank you for choosing Royal Safari Tours.
            </p>
            <div className="flex items-center gap-1 font-medium">
              <span className="text-gray-400">Powered by</span>
              <a
                href="https://awtomatig.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#02D5E7] hover:underline"
                style={{ color: "#02D5E7" }}
              >
                AWTOMATIG
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
