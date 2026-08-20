"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
import InvoicePrintModal from "./invoices/InvoicePrintModal";

export default function DashboardRecentInvoices({ invoices = [] }) {
  const [printingInvoice, setPrintingInvoice] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const handlePrintClick = (invoice) => {
    setPrintingInvoice(invoice);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 font-body">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Icon icon="lucide:receipt" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0D231E] font-inter">
              Recent Invoices & Money Receipts
            </h3>
            <p className="text-xs text-gray-500 font-inter">
              Latest issued billing documents and payment statuses
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/invoices"
          className="text-xs font-bold text-secondary hover:text-secondary/80 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All Invoices</span>
          <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-xs font-inter">
          No invoices created yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 px-2">Invoice ID</th>
                <th className="pb-3 px-2">Client Name</th>
                <th className="pb-3 px-2">Total Amount</th>
                <th className="pb-3 px-2">Paid</th>
                <th className="pb-3 px-2">Balance Due</th>
                <th className="pb-3 px-2">Terms</th>
                <th className="pb-3 px-2 text-right">Receipt Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {invoices.slice(0, 5).map((inv) => {
                const total = Number(inv.totalAmount) || 0;
                const paid = Number(inv.amountPaid) || 0;
                const due = Number(inv.balanceDue) || 0;

                return (
                  <tr key={inv.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-[#0D231E]">
                      #{inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-2 space-y-0.5">
                      <p className="font-semibold text-gray-900">{inv.clientName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{inv.clientPhone}</p>
                    </td>
                    <td className="py-3 px-2 font-mono font-bold text-gray-900">
                      ৳{total.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 font-mono font-semibold text-emerald-600">
                      ৳{paid.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 font-mono font-semibold">
                      {due > 0 ? (
                        <span className="text-rose-600">৳{due.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-400">৳0</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded-md bg-sand/60 text-[#0D231E] text-[10px] font-semibold">
                        {inv.paymentTerms || "Advanced"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handlePrintClick(inv)}
                        className="px-3 py-1.5 rounded-lg bg-secondary/10 hover:bg-secondary text-secondary hover:text-white text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Icon icon="lucide:printer" className="w-3.5 h-3.5" />
                        <span>Print Receipt</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Print Preview Modal */}
      {isPrintModalOpen && printingInvoice && (
        <InvoicePrintModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          invoice={printingInvoice}
        />
      )}
    </div>
  );
}
