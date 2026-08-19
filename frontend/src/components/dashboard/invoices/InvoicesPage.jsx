"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { getInvoices, deleteInvoiceAction } from "@/actions/invoice";
import InvoiceModal from "./InvoiceModal";
import InvoicePrintModal from "./InvoicePrintModal";

export default function InvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printingInvoice, setPrintingInvoice] = useState(null);

  const isAdmin = ["ADMIN", "SUPER_ADMIN", "HR_MANAGER"].includes(user?.role);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    const res = await getInvoices({ search, startDate, endDate });
    setLoading(false);

    if (res.success) {
      setInvoices(res.data || []);
    } else {
      toast.error(res.message || "Failed to load invoices");
    }
  }, [search, startDate, endDate]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleOpenCreateModal = () => {
    setEditingInvoice(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (inv) => {
    setEditingInvoice(inv);
    setIsFormModalOpen(true);
  };

  const handleOpenPrintModal = (inv) => {
    setPrintingInvoice(inv);
    setIsPrintModalOpen(true);
  };

  const handleDeleteInvoice = async (id, invoiceNumber) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      return;
    }

    const res = await deleteInvoiceAction(id);
    if (res.success) {
      toast.success("Invoice deleted successfully");
      fetchInvoices();
    } else {
      toast.error(res.message || "Failed to delete invoice");
    }
  };

  const formatDateStr = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Metrics
  const totalBilled = invoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (Number(inv.amountPaid) || 0), 0);
  const totalDue = invoices.reduce((sum, inv) => sum + (Number(inv.balanceDue) || 0), 0);

  return (
    <div className="space-y-6 font-body">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">
              {isAdmin ? "Company Finance & Billing" : "My Created Invoices"}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-[#0D231E] mt-1">
            Invoices & Money Receipts
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {isAdmin
              ? "Manage all customer invoices, money receipts, line items, and print A4 PDF receipts."
              : "Create customer money receipts, record advance payments, and print A4 receipts."}
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-secondary hover:bg-secondary/90 text-white text-xs font-bold px-5 py-3 rounded-2xl transition-all shadow-md cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Icon icon="lucide:plus" className="w-4 h-4" />
          <span>Create New Money Receipt</span>
        </button>
      </div>

      {/* METRIC STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
            <Icon icon="lucide:receipt" className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Invoices
            </span>
            <p className="text-lg font-bold font-heading text-[#0D231E]">
              {invoices.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Icon icon="lucide:wallet" className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Billed
            </span>
            <p className="text-lg font-bold font-mono text-[#0D231E]">
              ৳{totalBilled.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Icon icon="lucide:check-circle" className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Paid
            </span>
            <p className="text-lg font-bold font-mono text-emerald-600">
              ৳{totalPaid.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Icon icon="lucide:alert-circle" className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Balance Due
            </span>
            <p className="text-lg font-bold font-mono text-rose-600">
              ৳{totalDue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Icon
            icon="lucide:search"
            className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Invoice #, Client Name, or Phone..."
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-secondary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-secondary"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-secondary"
            />
          </div>

          {(search || startDate || endDate) && (
            <button
              onClick={() => {
                setSearch("");
                setStartDate("");
                setEndDate("");
              }}
              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Icon icon="lucide:rotate-ccw" className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* INVOICES TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(13,35,30,0.03)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Icon icon="lucide:file-x" className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-sm font-bold text-gray-700">No Money Receipts Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No invoices match your current search or role permissions. Click below to generate a new money receipt.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 bg-secondary text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
            >
              <Icon icon="lucide:plus" className="w-4 h-4" />
              <span>Create First Receipt</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Invoice #</th>
                  <th className="py-3.5 px-6">Client Info</th>
                  <th className="py-3.5 px-4">Invoice Date</th>
                  <th className="py-3.5 px-4">Payment Terms</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4 text-right">Amount Paid</th>
                  <th className="py-3.5 px-4 text-right">Balance Due</th>
                  <th className="py-3.5 px-6">Prepared By</th>
                  <th className="py-3.5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {invoices.map((inv) => {
                  const bal = Number(inv.balanceDue) || 0;
                  const isPaidInFull = bal <= 0;
                  const isPartial = Number(inv.amountPaid) > 0 && bal > 0;

                  return (
                    <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Invoice # */}
                      <td className="py-4 px-6 font-mono font-bold text-secondary">
                        #{inv.invoiceNumber}
                      </td>

                      {/* Client Info */}
                      <td className="py-4 px-6 space-y-0.5">
                        <p className="font-bold text-[#0D231E]">{inv.clientName}</p>
                        <p className="text-[11px] text-gray-500 font-mono">{inv.clientPhone}</p>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 font-mono text-gray-600">
                        {formatDateStr(inv.invoiceDate)}
                      </td>

                      {/* Payment Terms */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">
                          {inv.paymentTerms || "Advanced"}
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 text-right font-mono font-bold text-[#0D231E]">
                        ৳{Number(inv.totalAmount).toLocaleString()}
                      </td>

                      {/* Amount Paid */}
                      <td className="py-4 px-4 text-right font-mono font-bold text-emerald-600">
                        ৳{Number(inv.amountPaid).toLocaleString()}
                      </td>

                      {/* Balance Due */}
                      <td className="py-4 px-4 text-right font-mono font-bold">
                        {isPaidInFull ? (
                          <span className="text-emerald-600">৳0 (Paid)</span>
                        ) : (
                          <span className="text-rose-600">৳{bal.toLocaleString()}</span>
                        )}
                      </td>

                      {/* Prepared By */}
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-800">
                          {inv.creatorName || inv.createdBy?.name || "Staff"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Print / View PDF */}
                          <button
                            onClick={() => handleOpenPrintModal(inv)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                            title="Print / View A4 Money Receipt PDF"
                          >
                            <Icon icon="lucide:printer" className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditModal(inv)}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer"
                            title="Edit Invoice"
                          >
                            <Icon icon="lucide:edit-3" className="w-4 h-4" />
                          </button>

                          {/* Delete (Admin Only) */}
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteInvoice(inv.id, inv.invoiceNumber)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="Delete Invoice"
                            >
                              <Icon icon="lucide:trash-2" className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT INVOICE MODAL */}
      <InvoiceModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        invoice={editingInvoice}
        onSuccess={fetchInvoices}
      />

      {/* PRINT / VIEW A4 RECEIPT PDF MODAL */}
      <InvoicePrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        invoice={printingInvoice}
      />
    </div>
  );
}
