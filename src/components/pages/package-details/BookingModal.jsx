"use client";

import Button from "@/components/Button";
import InputBox from "@/components/InputBox";
import { siteConfig } from "@/config/siteConfig";
import { Icon } from "@iconify/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function BookingModal({ tourPackage, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    people: "2",
    notes: "",
  });

  if (!isOpen || !tourPackage) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      return toast.error("Please fill in your name and phone number");
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email || "inquiry@royalsafari.com");
      data.append("phone", formData.phone);
      data.append("destination", tourPackage.title);
      data.append("date", formData.date || "Flexible");
      data.append("people", formData.people);
      data.append("message", `Booking Inquiry for ${tourPackage.title}. Notes: ${formData.notes || "None"}`);

      const res = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        toast.success("Booking inquiry submitted successfully! Our team will contact you shortly.");
        onClose();
      } else {
        toast.error("Failed to submit inquiry. Please try WhatsApp chat.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Royal Safari Tours! I would like to book/inquire about the tour: "${tourPackage.title}" (Price: ৳${tourPackage.price}).`
  );

  return (
    <div className="fixed inset-0 z-[1010] flex items-center justify-center p-4 font-body">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-sand rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-gray-200 font-body max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
        >
          <Icon icon="lucide:x" className="w-5 h-5" />
        </button>

        <div className="space-y-2 mb-6 font-body">
          <span className="text-caption font-bold text-accent uppercase tracking-widest block font-accent">
            RESERVE YOUR EXPEDITION
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
            {tourPackage.title}
          </h3>
          <p className="text-xs text-gray-500 font-light font-body">
            Starting from <strong className="text-primary font-heading">৳{Number(tourPackage.price).toLocaleString()}</strong> per person.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-body">
          <InputBox
            label="Full Name *"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body">
            <InputBox
              label="Phone Number *"
              placeholder="+8801700-000000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <InputBox
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body">
            <InputBox
              label="Preferred Travel Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <InputBox
              label="Number of Guests"
              type="number"
              min="1"
              max="50"
              value={formData.people}
              onChange={(e) => setFormData({ ...formData, people: e.target.value })}
            />
          </div>

          <div className="flex flex-col font-body">
            <label className="font-semibold text-xs text-primary/70 uppercase tracking-wider mb-1.5 font-body">
              Special Requests / Notes
            </label>
            <textarea
              rows="3"
              placeholder="Dietary preferences, pickup requests..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-primary focus:outline-none focus:border-secondary font-body shadow-xs"
            />
          </div>

          <div className="pt-2 space-y-3 font-body">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              loadingText="Submitting Request..."
              className="w-full"
              icon={<Icon icon="lucide:check-circle" className="w-4 h-4" />}
            >
              Submit Booking Inquiry
            </Button>

            <a
              href={`https://api.whatsapp.com/send?phone=${siteConfig.contact.phone.whatsappRaw}&text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-whatsapp hover:bg-emerald-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer shadow-xs font-body"
            >
              <Icon icon="akar-icons:whatsapp-fill" className="w-5 h-5" />
              <span>Instant Booking on WhatsApp</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

