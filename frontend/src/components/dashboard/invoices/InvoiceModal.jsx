"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createInvoiceAction, updateInvoiceAction } from "@/actions/invoice";

export default function InvoiceModal({ isOpen, onClose, invoice = null, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    clientAddress: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    paymentTerms: "Advanced",
    discount: 0,
    amountPaid: 0,
    notes: "Booking Money are not Re-fundable",
    items: [
      {
        itemDescription: "",
        subDescription: "",
        quantity: 1,
        rate: 0,
      },
    ],
  });

  useEffect(() => {
    if (invoice) {
      setForm({
        clientName: invoice.clientName || "",
        clientPhone: invoice.clientPhone || "",
        clientEmail: invoice.clientEmail || "",
        clientAddress: invoice.clientAddress || "",
        invoiceDate: invoice.invoiceDate
          ? new Date(invoice.invoiceDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        dueDate: invoice.dueDate
          ? new Date(invoice.dueDate).toISOString().split("T")[0]
          : "",
        paymentTerms: invoice.paymentTerms || "Advanced",
        discount: Number(invoice.discount) || 0,
        amountPaid: Number(invoice.amountPaid) || 0,
        notes: invoice.notes || "Booking Money are not Re-fundable",
        items: invoice.items?.length
          ? invoice.items.map((item) => ({
              itemDescription: item.itemDescription || "",
              subDescription: item.subDescription || "",
              quantity: Number(item.quantity) || 1,
              rate: Number(item.rate) || 0,
            }))
          : [
              {
                itemDescription: "",
                subDescription: "",
                quantity: 1,
                rate: 0,
              },
            ],
      });
    } else {
      setForm({
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        clientAddress: "",
        invoiceDate: new Date().toISOString().split("T")[0],
        dueDate: "",
        paymentTerms: "Advanced",
        discount: 0,
        amountPaid: 0,
        notes: "Booking Money are not Re-fundable",
        items: [
          {
            itemDescription: "",
            subDescription: "",
            quantity: 1,
            rate: 0,
          },
        ],
      });
    }
  }, [invoice, isOpen]);

  if (!isOpen) return null;

  // Add Item Line
  const handleAddItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemDescription: "",
          subDescription: "",
          quantity: 1,
          rate: 0,
        },
      ],
    }));
  };

  // Remove Item Line
  const handleRemoveItem = (index) => {
    if (form.items.length <= 1) {
      toast.error("An invoice must contain at least one item");
      return;
    }
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Update Item Field
  const handleItemChange = (index, field, value) => {
    setForm((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
      return { ...prev, items: updatedItems };
    });
  };

  // Live Calculations
  const subTotal = form.items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    return sum + qty * rate;
  }, 0);

  const discountVal = Number(form.discount) || 0;
  const totalAmount = Math.max(0, subTotal - discountVal);
  const amountPaidVal = Number(form.amountPaid) || 0;
  const balanceDue = Math.max(0, totalAmount - amountPaidVal);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.clientName.trim() || !form.clientPhone.trim()) {
      toast.error("Client Name and Client Phone are required");
      return;
    }

    const hasEmptyItem = form.items.some((item) => !item.itemDescription.trim());
    if (hasEmptyItem) {
      toast.error("Please fill in item descriptions for all line items");
      return;
    }

    setSubmitting(true);

    const payload = {
      clientName: form.clientName.trim(),
      clientPhone: form.clientPhone.trim(),
      clientEmail: form.clientEmail.trim() || undefined,
      clientAddress: form.clientAddress.trim() || undefined,
      invoiceDate: form.invoiceDate,
      dueDate: form.dueDate || undefined,
      paymentTerms: form.paymentTerms,
      discount: discountVal,
      amountPaid: amountPaidVal,
      notes: form.notes,
      items: form.items.map((item) => ({
        itemDescription: item.itemDescription.trim(),
        subDescription: item.subDescription.trim() || undefined,
        quantity: Number(item.quantity) || 1,
        rate: Number(item.rate) || 0,
      })),
    };

    let res;
    if (invoice) {
      res = await updateInvoiceAction(invoice.id, payload);
    } else {
      res = await createInvoiceAction(payload);
    }

    setSubmitting(false);

    if (res.success) {
      toast.success(invoice ? "Invoice updated successfully" : "Money Receipt / Invoice created!");
      onSuccess();
      onClose();
    } else {
      toast.error(res.message || "Failed to save invoice");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto font-body">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
              <Icon icon="lucide:receipt" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-[#0D231E]">
                {invoice ? `Edit Money Receipt (${invoice.invoiceNumber})` : "Create New Money Receipt / Invoice"}
              </h2>
              <p className="text-xs text-gray-500">
                Fill in client details, package line items, paid amounts, and terms.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CLIENT & DATE DETAILS GRID */}
          <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0D231E] flex items-center gap-2">
              <Icon icon="lucide:user" className="w-4 h-4 text-secondary" />
              Client & Receipt Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Client Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  placeholder="e.g. Shova"
                  className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-secondary bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Client Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.clientPhone}
                  onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                  placeholder="e.g. +880 1734-979066"
                  className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-secondary bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  value={form.clientEmail}
                  onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                  placeholder="client@example.com"
                  className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-secondary bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Payment Terms
                </label>
                <select
                  value={form.paymentTerms}
                  onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-secondary bg-white cursor-pointer"
                >
                  <option value="Advanced">Advanced</option>
                  <option value="Full Payment">Full Payment</option>
                  <option value="Partial">Partial</option>
                  <option value="Due">Due</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Invoice Date (Fixed)
                </label>
                <div className="w-full bg-gray-100 border border-gray-200 p-2.5 rounded-xl text-xs font-mono text-gray-600 font-semibold flex items-center gap-2">
                  <Icon icon="lucide:lock" className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{form.invoiceDate || new Date().toISOString().split("T")[0]}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-secondary bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Client Address
                </label>
                <input
                  type="text"
                  value={form.clientAddress}
                  onChange={(e) => setForm({ ...form, clientAddress: e.target.value })}
                  placeholder="e.g. House #12, Road #4, Dhanmondi, Dhaka"
                  className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-secondary bg-white"
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC LINE ITEMS TABLE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0D231E] flex items-center gap-2">
                <Icon icon="lucide:list" className="w-4 h-4 text-secondary" />
                Line Items / Package Details
              </h3>

              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary hover:bg-secondary hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Icon icon="lucide:plus" className="w-3.5 h-3.5" />
                Add Item Line
              </button>
            </div>

            <div className="space-y-3">
              {form.items.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-white border border-gray-200 rounded-2xl space-y-3 shadow-2xs relative"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-[11px] font-bold text-gray-400">
                      Item #{index + 1}
                    </span>
                    {form.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-rose-500 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                        Remove Line
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6 space-y-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Item Description / Tour Package Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={item.itemDescription}
                          onChange={(e) =>
                            handleItemChange(index, "itemDescription", e.target.value)
                          }
                          placeholder="e.g. Malaysia & Thailand Tour - 7Nights & 8Days - (16 August-2026 to 22 August-2026) 1 Adult Female"
                          className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-secondary"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Sub-description / Room Type Info
                        </label>
                        <input
                          type="text"
                          value={item.subDescription}
                          onChange={(e) =>
                            handleItemChange(index, "subDescription", e.target.value)
                          }
                          placeholder="e.g. Room - (Single Occupancy)"
                          className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-secondary"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-secondary font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Unit Rate (BDT)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(index, "rate", Math.max(0, parseFloat(e.target.value) || 0))
                        }
                        placeholder="119000"
                        className="w-full border border-gray-300 p-2.5 rounded-xl text-xs focus:outline-none focus:border-secondary font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Total BDT
                      </label>
                      <div className="p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold font-mono text-[#0D231E]">
                        ৳{(Number(item.quantity || 1) * Number(item.rate || 0)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FINANCIAL SUMMARY & NOTES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gray-50/70 p-5 rounded-2xl border border-gray-200/80">
            <div className="md:col-span-7 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700">
                  Notes & Terms (Printed on Money Receipt)
                </label>
                <span className="text-[11px] font-mono text-gray-400">
                  {(form.notes || "").length}/80
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={80}
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value.slice(0, 80) })
                }
                placeholder="e.g. Booking Money are not Re-fundable"
                className="w-full border border-gray-300 p-3 rounded-xl text-xs focus:outline-none focus:border-secondary bg-white"
              />
            </div>

            <div className="md:col-span-5 space-y-3 bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Subtotal:</span>
                <span className="font-bold font-mono text-gray-900">৳{subTotal.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Discount BDT:</span>
                <input
                  type="number"
                  min="0"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="w-28 border border-gray-300 p-1.5 rounded-lg text-xs text-right font-mono focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-[#0D231E] border-t border-gray-100 pt-2">
                <span>Total Amount:</span>
                <span className="font-mono text-sm text-secondary">৳{totalAmount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Amount Paid BDT:</span>
                <input
                  type="number"
                  min="0"
                  value={form.amountPaid}
                  onChange={(e) => setForm({ ...form, amountPaid: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="w-28 border border-gray-300 p-1.5 rounded-lg text-xs text-right font-mono focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold border-t border-gray-100 pt-2">
                <span className="text-rose-600">Balance Due BDT:</span>
                <span className="font-mono text-sm text-rose-600">৳{balanceDue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Icon icon="lucide:check" className="w-4 h-4" />
              <span>{submitting ? "Saving Invoice..." : invoice ? "Update Invoice" : "Save & Create Receipt"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
