"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { getImageUrl } from "@/lib/imageUrl";
import { siteConfig } from "@/config/siteConfig";

export default function CheckoutClientPage({ tourPackage, initialGuests = 1, initialDate = "" }) {
  const [guestCount, setGuestCount] = useState(Math.max(1, Number(initialGuests) || 1));
  const [travelDate, setTravelDate] = useState(initialDate || "");
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickupLocation: "",
    notes: "",
  });

  const unitPrice = tourPackage?.discountPrice
    ? Number(tourPackage.discountPrice)
    : Number(tourPackage?.price) || 0;

  const totalAmount = unitPrice * guestCount;

  const handleGuestDecrement = () => setGuestCount((prev) => Math.max(1, prev - 1));
  const handleGuestIncrement = () => setGuestCount((prev) => Math.min(50, prev + 1));

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return toast.error("Please enter your full name");
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      return toast.error("Please enter a valid email address");
    }
    if (!formData.phone.trim()) {
      return toast.error("Please enter your phone number");
    }

    setLoading(true);

    const bookingPayload = {
      customerName: formData.name.trim(),
      customerEmail: formData.email.trim(),
      customerPhone: formData.phone.trim(),
      packageName: tourPackage?.title || "Tour Package",
      packageId: tourPackage?.id || null,
      travelDate: travelDate || "Flexible / To Be Finalized",
      guestCount: guestCount,
      pickupLocation: formData.pickupLocation ? formData.pickupLocation.trim() : null,
      specialNotes: formData.notes ? formData.notes.trim() : null,
      totalAmount: totalAmount > 0 ? totalAmount : null,
    };

    try {
      const res = await fetch("/api/booking-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Failed to submit booking request");
      }

      const resData = await res.json();

      setConfirmedData({
        ...bookingPayload,
        bookingId: resData?.bookingId || resData?.data?.bookingId || "RST-BK-CONFIRMED",
        packageTitle: tourPackage?.title || "Tour Package",
        totalAmount,
      });
      setBookingSuccess(true);
      toast.success("Reservation request submitted! Confirmation emails have been dispatched.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Booking submission error:", error);
      toast.error(error.message || "Something went wrong while securing your booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const imageSrc = tourPackage
    ? getImageUrl(tourPackage.featuredImage || tourPackage.image, "/images/banners/home_hero.webp")
    : "/images/banners/home_hero.webp";

  const locationDisplay = tourPackage?.locationName || tourPackage?.location?.country || tourPackage?.location?.name || "South Asia";

  const whatsappMessage = encodeURIComponent(
    `Hello Royal Safari Tours! I just submitted a booking request for "${tourPackage?.title}" (${guestCount} guests on ${travelDate || "upcoming dates"}). Could you please confirm availability?`
  );

  if (bookingSuccess) {
    return (
      <main className="min-h-screen bg-sand/30 pt-36 sm:pt-44 pb-20 px-4 font-inter">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-[0_10px_40px_rgba(13,35,30,0.06)] text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#2cb775]/10 text-[#2cb775] flex items-center justify-center mx-auto shadow-inner">
            <Icon icon="lucide:check-circle-2" className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#2cb775]/15 text-[#0D231E] text-xs font-bold tracking-widest uppercase">
              Reservation Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0D231E]">
              Thank You, {confirmedData?.customerName || confirmedData?.name}!
            </h1>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Your expedition request for <strong>{confirmedData?.packageTitle}</strong> has been received. A formal confirmation has been sent to <strong>{confirmedData?.customerEmail || confirmedData?.email}</strong>.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-200/70 space-y-3 text-xs sm:text-sm">
            {confirmedData?.bookingId && (
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-medium">Booking ID:</span>
                <span className="font-bold text-[#0D231E] font-mono px-2 py-0.5 bg-gray-200/60 rounded text-xs">{confirmedData.bookingId}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Expedition:</span>
              <span className="font-bold text-[#0D231E]">{confirmedData?.packageTitle}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Travel Date:</span>
              <span className="font-semibold text-[#0D231E]">{confirmedData?.travelDate}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Travelers:</span>
              <span className="font-semibold text-[#0D231E]">{confirmedData?.guestCount} Guest(s)</span>
            </div>
            <div className="flex justify-between pt-1 text-base">
              <span className="font-bold text-[#0D231E]">Estimated Total:</span>
              <span className="font-bold text-[#2cb775] font-mono">৳{confirmedData?.totalAmount ? confirmedData.totalAmount.toLocaleString() : "To be confirmed"}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={`https://api.whatsapp.com/send?phone=${siteConfig.contact.phone.whatsappRaw}&text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Icon icon="akar-icons:whatsapp-fill" className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>
            <Link
              href="/adventure"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs sm:text-sm font-bold transition-colors text-center shadow-sm"
            >
              Explore More Tours
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sand/20 pt-36 sm:pt-44 pb-20 px-4 font-inter">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#2cb775] transition-colors">Home</Link>
            <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5" />
            <Link href="/adventure" className="hover:text-[#2cb775] transition-colors">Expeditions</Link>
            {tourPackage && (
              <>
                <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5" />
                <Link href={`/packages/${tourPackage.slug || tourPackage.id}`} className="hover:text-[#2cb775] transition-colors truncate max-w-[200px]">
                  {tourPackage.title}
                </Link>
              </>
            )}
            <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5" />
            <span className="text-[#0D231E] font-semibold">Checkout Reservation</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0D231E]">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Traveler Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-[0_4px_25px_rgba(13,35,30,0.04)] space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-[#2cb775]/10 text-[#2cb775] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0D231E]">Traveler Information</h2>
                <p className="text-xs text-gray-500">Please provide contact details for booking confirmation and itinerary delivery.</p>
              </div>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahfuzur Rahman"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775] focus:bg-white transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. guest@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775] focus:bg-white transition-all duration-200"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Confirmation receipt will be emailed here.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +880 1844-690000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775] focus:bg-white transition-all duration-200"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">For instant tour updates & concierge chat.</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-xl bg-[#2cb775]/10 text-[#2cb775] flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#0D231E]">Schedule & Group Size</h2>
                    <p className="text-xs text-gray-500">Select your departure preference and number of travelers.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Preferred Travel Date
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#2cb775] focus:bg-white transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Number of Travelers
                    </label>
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-1.5 px-3">
                      <button
                        type="button"
                        onClick={handleGuestDecrement}
                        disabled={guestCount <= 1}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <Icon icon="lucide:minus" className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs sm:text-sm font-bold text-[#0D231E]">
                        {guestCount} {guestCount === 1 ? "Traveler" : "Travelers"}
                      </span>
                      <button
                        type="button"
                        onClick={handleGuestIncrement}
                        disabled={guestCount >= 50}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <Icon icon="lucide:plus" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-xl bg-[#2cb775]/10 text-[#2cb775] flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#0D231E]">Preferences & Custom Notes</h2>
                    <p className="text-xs text-gray-500">Optional pickup address, dietary requirements, or rooming preferences.</p>
                  </div>
                </div>

                <div className="space-y-3 mt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Pickup Location / Hotel (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hotel Westin Dhaka / Shahjalal Int Airport"
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775] focus:bg-white transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Special Requests / Dietary Needs
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Vegetarian meals, twin beds, senior traveler support..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2cb775] focus:bg-white transition-all duration-200 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0D231E] hover:bg-[#2cb775] text-white font-bold py-4 px-6 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin" />
                      <span>Booking......</span>
                    </>
                  ) : (
                    <>
                      <span>Book Now</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-gray-400">
                  By clicking Confirm, an email confirmation will be sent to you and our reservation specialists will coordinate your journey immediately.
                </p>
              </div>
            </form>
          </div>

          {/* Right: Expedition Summary Card (5 cols) */}
          <div className="lg:col-span-5 space-y-5 sticky top-24">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_4px_25px_rgba(13,35,30,0.04)] space-y-5">
              <h3 className="text-base font-bold text-[#0D231E] pb-3 border-b border-gray-100 flex items-center justify-between">
                <span>Expedition Summary</span>
                <span className="text-xs font-normal text-gray-400">Overview</span>
              </h3>

              {/* Tour Media & Info */}
              <div className="flex gap-4 items-center">
                <div className="relative w-24 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={imageSrc}
                    fill
                    sizes="100px"
                    alt={tourPackage?.title || "Tour"}
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-[#0D231E] line-clamp-2">
                    {tourPackage?.title || "Custom Expedition"}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1 text-[#2cb775] font-medium truncate">
                      <Icon icon="lucide:map-pin" className="w-3 h-3 shrink-0" />
                      <span className="truncate">{locationDisplay}</span>
                    </span>
                    {tourPackage?.duration && (
                      <span className="flex items-center gap-1 text-gray-400 shrink-0">
                        <Icon icon="lucide:clock" className="w-3 h-3" />
                        <span>{tourPackage.duration}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Rate per person</span>
                  <span className="font-semibold text-gray-900 font-mono">৳{unitPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Number of travelers</span>
                  <span className="font-semibold text-gray-900">{guestCount} Guests</span>
                </div>
                {travelDate && (
                  <div className="flex justify-between items-center">
                    <span>Selected Date</span>
                    <span className="font-semibold text-gray-900">{travelDate}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-sm">
                  <span className="font-bold text-[#0D231E]">Total Estimated</span>
                  <span className="font-bold text-[#0D231E] font-mono text-base">
                    ৳{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-2.5 pt-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:shield-check" className="w-4 h-4 text-[#2cb775] shrink-0" />
                  <span>100% Certified Local Naturalists & Safari Guides</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:mail-check" className="w-4 h-4 text-[#2cb775] shrink-0" />
                  <span>Instant Email Notification & Booking Receipt</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:headphones" className="w-4 h-4 text-[#2cb775] shrink-0" />
                  <span>24/7 VIP Concierge WhatsApp & Call Support</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Quick Help Box */}
            <div className="bg-[#0D231E] text-white rounded-3xl p-5 shadow-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2cb775]/20 text-[#2cb775] flex items-center justify-center shrink-0">
                  <Icon icon="akar-icons:whatsapp-fill" className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-white">Prefer to Book via WhatsApp?</h5>
                  <p className="text-[11px] text-gray-300">Chat with a destination consultant directly.</p>
                </div>
              </div>
              <a
                href={`https://api.whatsapp.com/send?phone=${siteConfig.contact.phone.whatsappRaw}&text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="block text-center w-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
              >
                Open WhatsApp Concierge
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
