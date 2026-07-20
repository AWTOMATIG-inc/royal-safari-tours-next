"use client";

import { trackContactFormSubmit } from "@/lib/gtm";
import { contactYupSchema } from "@/yup/contactYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contactYupSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("message", data.message);
    formData.append("destination", data.destination);
    formData.append("date", data.date);
    formData.append("people", data.people);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        reset();
        setLoading(false);
        toast.success("Inquiry sent successfully!");
        trackContactFormSubmit({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
        });
      } else {
        setLoading(false);
        const errorText = await response.text();
        toast.error(`Failed to send inquiry: ${errorText}`);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Something went wrong.");
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) {
      return toast.error("Please enter a valid email address");
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(newsletterEmail)) {
      return toast.error("Please enter a valid email address");
    }

    setSubmittingNewsletter(true);
    try {
      const res = await fetch("/api/subscriber", {
        method: "POST",
        body: JSON.stringify({ name: "Newsletter Subscriber", email: newsletterEmail }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 409) {
        setNewsletterEmail("");
        setSubmittingNewsletter(false);
        return toast.error("You have already subscribed!");
      }

      setNewsletterEmail("");
      setSubmittingNewsletter(false);
      return toast.success("Subscribed successfully!");
    } catch (error) {
      setSubmittingNewsletter(false);
      console.error(error);
      toast.error("Subscription failed.");
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#132E27] font-palanquin overflow-x-hidden">

      {/* 1. HERO SECTION - Full-width background image with content-driven padding for robust responsiveness */}
      <section className="relative w-full pt-32 pb-64 sm:pt-36 sm:pb-72 md:pt-40 md:pb-80 lg:pt-48 lg:pb-44 mb-8">
        {/* Full-width background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/banners/contact_hero.jpg"
            alt="Misty Mountain River Landscape"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Gradient overlay - stronger on mobile for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcfaee]/95 via-[#fcfaee]/70 to-[#fcfaee]/30 sm:via-[#fcfaee]/60 sm:to-transparent" />
        </div>

        {/* Overlaid text content - positioned on the left */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 lg:px-8">
          <div className="flex flex-col items-start text-left max-w-xl">
            <span className="text-[12px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] text-[#DE8D3D] uppercase mb-4 sm:mb-5">
              GET IN TOUCH
            </span>
            <h1 className="text-[38px] sm:text-5xl md:text-6xl lg:text-7xl font-palanquin font-normal leading-[1.08] text-[#0D231E] mb-5 sm:mb-7">
              Let&rsquo;s Plan Your<br />Next Adventure
            </h1>
            <p className="text-[15px] sm:text-[17px] md:text-[18px] text-[#0D231E]/70 font-inter leading-relaxed max-w-xl mb-8 sm:mb-10">
              Have questions or need help planning your trip?<br className="hidden sm:block" /> Our team is here to create the perfect experience for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <a
                href="https://wa.me/8801731703541"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#0D231E] hover:bg-green text-white font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-[12px] shadow-sm hoverEffect transition-all duration-300 text-[14px] sm:text-[15px] tracking-wide"
              >
                <Icon icon="akar-icons:whatsapp-fill" width="20" height="20" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href="tel:+8801731703541"
                className="flex items-center justify-center gap-2.5 border border-[#0D231E]/20 hover:bg-[#0D231E]/5 text-[#0D231E] font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-[12px] hoverEffect transition-all duration-300 text-[14px] sm:text-[15px] tracking-wide bg-white/60 backdrop-blur-sm"
              >
                <Icon icon="lucide:phone" width="18" height="18" className="text-[#0D231E]" />
                <span>+880 1731 703 541</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2. FLOATING QUICK CONTACT CARD - overlapping bottom of hero */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 w-full max-w-6xl px-4 sm:px-6 md:px-10 lg:px-8">
          <div className="bg-white/95 backdrop-blur-md rounded-[16px] sm:rounded-[20px] shadow-xl border border-[#0D231E]/5 p-5 sm:p-8 md:p-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-6 lg:divide-x divide-gray-100">

              {/* WhatsApp */}
              <div className="flex flex-col items-center text-center p-2 sm:p-4 lg:p-2">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#e8f7f0] text-green-600 flex items-center justify-center mb-2 sm:mb-4">
                  <Icon icon="akar-icons:whatsapp-fill" width="22" height="22" />
                </div>
                <h3 className="text-[13px] sm:text-lg font-bold text-[#0D231E] font-inter mb-0.5 sm:mb-1">WhatsApp</h3>
                <p className="text-[11px] sm:text-sm text-gray-500 font-inter mb-2 sm:mb-4 hidden sm:block">Quick reply on WhatsApp</p>
                <a
                  href="https://wa.me/8801731703541"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] sm:text-sm font-semibold text-[#0D231E] hover:text-[#DE8D3D] transition-colors duration-300 flex items-center gap-1 group/link cursor-pointer"
                >
                  <span>Chat Now</span>
                  <Icon icon="lucide:arrow-right" width="12" height="12" className="sm:w-[14px] sm:h-[14px] group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Email */}
              <div className="flex flex-col items-center text-center p-2 sm:p-4 lg:pt-2 lg:pl-6">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#fdf3e7] text-orange flex items-center justify-center mb-2 sm:mb-4">
                  <Icon icon="lucide:mail" width="22" height="22" />
                </div>
                <h3 className="text-[13px] sm:text-lg font-bold text-[#0D231E] font-inter mb-0.5 sm:mb-1">Email</h3>
                <p className="text-[11px] sm:text-sm text-gray-500 font-inter mb-2 sm:mb-4 hidden sm:block">We reply within a few hours</p>
                <a
                  href="mailto:info@royalsafaritours.com"
                  className="text-[11px] sm:text-sm font-semibold text-[#0D231E] hover:text-[#DE8D3D] transition-colors duration-300 flex items-center gap-1 group/link cursor-pointer"
                >
                  <span>Send Email</span>
                  <Icon icon="lucide:arrow-right" width="12" height="12" className="sm:w-[14px] sm:h-[14px] group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Call Us */}
              <div className="flex flex-col items-center text-center p-2 sm:p-4 lg:pt-2 lg:pl-6">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#e6f0ff] text-[#0D231E] flex items-center justify-center mb-2 sm:mb-4">
                  <Icon icon="lucide:phone" width="20" height="20" />
                </div>
                <h3 className="text-[13px] sm:text-lg font-bold text-[#0D231E] font-inter mb-0.5 sm:mb-1">Call Us</h3>
                <p className="text-[11px] sm:text-sm text-gray-500 font-inter mb-2 sm:mb-4 hidden sm:block">Mon - Sun, 8AM - 10PM</p>
                <a
                  href="tel:+8801731703541"
                  className="text-[11px] sm:text-sm font-semibold text-[#0D231E] hover:text-[#DE8D3D] transition-colors duration-300 flex items-center gap-1 group/link cursor-pointer"
                >
                  <span>Call Now</span>
                  <Icon icon="lucide:arrow-right" width="12" height="12" className="sm:w-[14px] sm:h-[14px] group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Our Office */}
              <div className="flex flex-col items-center text-center p-2 sm:p-4 lg:pt-2 lg:pl-6">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#fce8e8] text-[#0D231E] flex items-center justify-center mb-2 sm:mb-4">
                  <Icon icon="lucide:map-pin" width="20" height="20" />
                </div>
                <h3 className="text-[13px] sm:text-lg font-bold text-[#0D231E] font-inter mb-0.5 sm:mb-1">Our Office</h3>
                <p className="text-[11px] sm:text-sm text-gray-500 font-inter mb-2 sm:mb-4 hidden sm:block">Dhaka, Bangladesh</p>
                <a
                  href="#map-section"
                  className="text-[11px] sm:text-sm font-semibold text-[#0D231E] hover:text-[#DE8D3D] transition-colors duration-300 flex items-center gap-1 group/link cursor-pointer"
                >
                  <span>View on Map</span>
                  <Icon icon="lucide:arrow-right" width="12" height="12" className="sm:w-[14px] sm:h-[14px] group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Spacer for the overlapping card - increased on mobile/tablet to clear the taller 2-row card height */}
      <div className="h-44 sm:h-48 md:h-52 lg:h-32" />

      {/* 3. CONTACT FORM & OFFICE INFO SECTION */}
      <section className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="bg-[#f5f3eb] rounded-[16px] sm:rounded-[24px] p-5 sm:p-8 md:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1.05fr_0.95fr] gap-8 sm:gap-10 lg:gap-10 xl:gap-14 items-start">

            {/* Left Column: Form */}
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-xs md:text-[13px] font-semibold tracking-[0.25em] text-[#DE8D3D] uppercase mb-2 sm:mb-3">
                SEND US A MESSAGE
              </span>
              <h2 className="text-[26px] sm:text-[34px] md:text-[38px] font-playfair font-normal text-[#0D231E] mb-2 sm:mb-3 leading-tight">
                Tell us about your trip
              </h2>
              <p className="text-[14px] sm:text-[15px] text-[#0D231E]/60 font-inter leading-relaxed mb-6 sm:mb-8 max-w-md">
                Fill out the form below and our travel experts will get back to you shortly.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                {/* Full Name */}
                <div className="flex flex-col relative">
                  <div className="relative">
                    <Icon icon="lucide:user" width="17" height="17" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      {...register("name")}
                      className={`w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border ${errors.name ? "border-red-400" : "border-gray-200"} rounded-[10px] text-sm text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#0D231E]/40 transition-all duration-300 font-inter`}
                    />
                  </div>
                  {errors.name && (
                    <span className="text-xs text-red-500 mt-1 font-inter">{errors.name.message}</span>
                  )}
                </div>

                {/* Email Address */}
                <div className="flex flex-col relative">
                  <div className="relative">
                    <Icon icon="lucide:mail" width="17" height="17" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      {...register("email")}
                      className={`w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border ${errors.email ? "border-red-400" : "border-gray-200"} rounded-[10px] text-sm text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#0D231E]/40 transition-all duration-300 font-inter`}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-xs text-red-500 mt-1 font-inter">{errors.email.message}</span>
                  )}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col relative">
                  <div className="relative">
                    <Icon icon="lucide:phone" width="17" height="17" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      {...register("phone")}
                      className={`w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border ${errors.phone ? "border-red-400" : "border-gray-200"} rounded-[10px] text-sm text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#0D231E]/40 transition-all duration-300 font-inter`}
                    />
                  </div>
                  {errors.phone && (
                    <span className="text-xs text-red-500 mt-1 font-inter">{errors.phone.message}</span>
                  )}
                </div>

                {/* Travel Destination */}
                <div className="flex flex-col relative">
                  <div className="relative">
                    <Icon icon="lucide:compass" width="17" height="17" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Travel Destination"
                      {...register("destination")}
                      className={`w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border ${errors.destination ? "border-red-400" : "border-gray-200"} rounded-[10px] text-sm text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#0D231E]/40 transition-all duration-300 font-inter`}
                    />
                  </div>
                  {errors.destination && (
                    <span className="text-xs text-red-500 mt-1 font-inter">{errors.destination.message}</span>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col sm:col-span-2 relative">
                  <textarea
                    placeholder="Tell us about your trip..."
                    {...register("message")}
                    rows="5"
                    className={`w-full p-4 bg-white border ${errors.message ? "border-red-400" : "border-gray-200"} rounded-[10px] text-sm text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#0D231E]/40 transition-all duration-300 font-inter min-h-[120px] sm:min-h-[130px] resize-y`}
                  />
                  {errors.message && (
                    <span className="text-xs text-red-500 mt-1 font-inter">{errors.message.message}</span>
                  )}
                </div>

                {/* Travel Date */}
                <div className="flex flex-col relative">
                  <div className="relative">
                    <Icon icon="lucide:calendar" width="17" height="17" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Travel Date"
                      {...register("date")}
                      className={`w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border ${errors.date ? "border-red-400" : "border-gray-200"} rounded-[10px] text-sm text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#0D231E]/40 transition-all duration-300 font-inter`}
                    />
                  </div>
                  {errors.date && (
                    <span className="text-xs text-red-500 mt-1 font-inter">{errors.date.message}</span>
                  )}
                </div>

                {/* Number of People */}
                <div className="flex flex-col relative">
                  <div className="relative">
                    <Icon icon="lucide:users" width="17" height="17" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Number of People"
                      {...register("people")}
                      className={`w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border ${errors.people ? "border-red-400" : "border-gray-200"} rounded-[10px] text-sm text-[#0D231E] placeholder:text-gray-400 focus:outline-none focus:border-[#0D231E]/40 transition-all duration-300 font-inter`}
                    />
                  </div>
                  {errors.people && (
                    <span className="text-xs text-red-500 mt-1 font-inter">{errors.people.message}</span>
                  )}
                </div>

                {/* Submit Button */}
                <div className="sm:col-span-2 mt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0D231E] hover:bg-green text-white font-semibold py-3.5 sm:py-4 px-6 rounded-[10px] transition-colors duration-300 flex items-center justify-center gap-2 group cursor-pointer text-sm"
                  >
                    <span>{loading ? "Sending Inquiry..." : "Send Inquiry"}</span>
                    <Icon icon="lucide:arrow-right" width="16" height="16" className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-500 mt-3 sm:mt-4 font-inter">
                    <Icon icon="lucide:lock" width="13" height="13" />
                    <span>We respect your privacy. Your information is safe with us.</span>
                  </div>
                </div>

              </form>
            </div>

            {/* Right Column: Image with embedded Backdrop Blur Glassmorphic Office Card */}
            <div className="w-full relative lg:mt-[10%] xl:mt-[12%]">
              {/* Top landscape image container - holds both image and absolute overlay. Uses min-height on mobile to prevent glass card contents from clipping, and standard aspect ratio on desktop. */}
              <div className="relative w-full min-h-[380px] sm:min-h-[400px] lg:min-h-0 lg:aspect-[4/3] rounded-[14px] sm:rounded-[18px] overflow-hidden shadow-md">
                <Image
                  src="/images/banners/contact_office.png"
                  alt="Green valley stream cottage"
                  fill
                  className="object-cover"
                />

                {/* Dark translucent backdrop overlay */}
                <div className="absolute inset-0 bg-black/20 z-[1]" />

                {/* Glassmorphic Details Card - centered directly on the image with premium backdrop blur */}
                <div className="absolute inset-0 z-10 flex items-center justify-center p-4 xs:p-6 sm:p-8">
                  <div className="bg-[#0D231E]/80 backdrop-blur-md border border-white/10 rounded-[14px] sm:rounded-[18px] p-5 sm:p-7 md:p-8 w-full max-w-[340px] sm:max-w-[360px] text-white text-left shadow-2xl">
                    <h3 className="text-lg sm:text-xl md:text-[22px] font-bold text-white font-playfair mb-2 sm:mb-2.5">Royal Safari Tours</h3>
                    <p className="text-[12px] sm:text-[13px] text-white/70 leading-relaxed mb-4 sm:mb-5 font-inter">
                      212, Taltola City Super Market<br /> Khilgaon, Dhaka 1219

                    </p>

                    <div className="flex flex-col gap-2.5 sm:gap-3 mb-5 sm:mb-6 text-[12px] sm:text-[13px]">
                      <a href="tel:+8801898334722" className="flex items-center gap-2.5 sm:gap-3 text-white/90 hover:text-[#C49A5C] transition-colors">
                        <Icon icon="lucide:phone" width="15" height="15" className="text-[#C49A5C] flex-shrink-0" />
                        <span>+880 1898 334722</span>
                      </a>
                      <a href="mailto:info.royalsafaritours@gmail.com" className="flex items-center gap-2.5 sm:gap-3 text-white/90 hover:text-[#C49A5C] transition-colors">
                        <Icon icon="lucide:mail" width="15" height="15" className="text-[#C49A5C] flex-shrink-0" />
                        <span>info.royalsafaritours@gmail.com</span>
                      </a>
                      <div className="flex items-start gap-2.5 sm:gap-3 text-white/90">
                        <Icon icon="lucide:clock" width="15" height="15" className="text-[#C49A5C] mt-0.5 flex-shrink-0" />
                        <div className="flex flex-col leading-snug">
                          <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
                          <span className="mt-0.5">Sat: 10:00 AM - 4:00 PM</span>
                          <span className="mt-0.5">Sun: Closed</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href="#map-section"
                      className="w-full bg-[#C49A5C] hover:bg-[#b38a4e] text-white text-[12px] sm:text-[13px] font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded-[10px] transition-colors duration-300 flex items-center justify-center gap-2 shadow-md hoverEffect cursor-pointer"
                    >
                      <span>Get Directions</span>
                      <Icon icon="lucide:navigation" width="14" height="14" />
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US SECTION */}
      <section className="border-t border-b border-[#57271D]/8 py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-8">
          <div className="max-w-5xl mx-auto bg-[#0D231E] text-white px-5 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 rounded-[14px] sm:rounded-xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">

              {/* Feature 1 */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
                <div className="text-white/90">
                  <Icon icon="lucide:zap" width="24" height="24" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-[13px] sm:text-[15px] text-white mb-0.5 sm:mb-1 font-inter">Fast Response</h4>
                  <p className="text-[11px] sm:text-[13px] text-gray-400 font-inter leading-relaxed">
                    We reply within a few hours
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
                <div className="text-white/90">
                  <Icon icon="lucide:users" width="24" height="24" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-[13px] sm:text-[15px] text-white mb-0.5 sm:mb-1 font-inter">Local Experts</h4>
                  <p className="text-[11px] sm:text-[13px] text-gray-400 font-inter leading-relaxed">
                    Our team knows the best places and experiences
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
                <div className="text-white/90">
                  <Icon icon="lucide:book-open" width="24" height="24" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-[13px] sm:text-[15px] text-white mb-0.5 sm:mb-1 font-inter">Custom Itineraries</h4>
                  <p className="text-[11px] sm:text-[13px] text-gray-400 font-inter leading-relaxed">
                    100% personalized trips just for you
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
                <div className="text-white/90">
                  <Icon icon="lucide:star" width="24" height="24" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-[13px] sm:text-[15px] text-white mb-0.5 sm:mb-1 font-inter">Trusted by Travelers</h4>
                  <p className="text-[11px] sm:text-[13px] text-gray-400 font-inter leading-relaxed">
                    Rated 4.9/5 by 1800+ happy travelers
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. MAP SECTION */}
      <section id="map-section" className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-8 py-8 sm:py-10 md:py-14">
        <div className="relative w-full h-[280px] sm:h-[350px] md:h-[420px] rounded-[14px] sm:rounded-[20px] overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9868735393165!2d90.37583641151624!3d23.74783307888796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33c892fb7%3A0x27747abef429a81a!2sDhanmondi%20Lake!5e0!3m2!1sen!2sbd!4v1716882112689!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          ></iframe>

          {/* Floating Map Info Card - bottom on mobile, right-center on desktop */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-auto sm:left-auto sm:right-6 md:right-10 sm:top-1/2 sm:-translate-y-1/2 bg-white rounded-[12px] sm:rounded-[16px] shadow-lg border border-gray-100 p-4 sm:p-6 md:p-7 sm:max-w-[280px] md:max-w-[320px] z-10 font-inter text-left">
            <h3 className="text-base sm:text-lg font-bold text-[#0D231E] font-playfair mb-1 sm:mb-2">Find Us Easily</h3>
            <p className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed mb-3 sm:mb-4 font-inter">
              We are located in the heart of Dhanmondi. Easy to reach and always happy to welcome you!
            </p>
            <a
              href="https://maps.app.goo.gl/yQszL8wQcR6Yc9M38"
              target="_blank"
              rel="noreferrer"
              className="text-[12px] sm:text-[13px] font-semibold text-[#0D231E] hover:text-[#DE8D3D] transition-colors duration-300 flex items-center gap-1.5 group/map cursor-pointer"
            >
              <span>Open in Google Maps</span>
              <Icon icon="lucide:arrow-right" width="14" height="14" className="group-hover/map:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER SECTION - Full width dark green bar */}
      <section className="w-full bg-[#0D231E]">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-8 py-8 sm:py-10 md:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">

            {/* Left side text and icon */}
            <div className="flex items-center gap-4 sm:gap-5 text-left w-full lg:w-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                <Icon icon="lucide:mail" width="22" height="22" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg sm:text-xl md:text-2xl font-playfair font-normal leading-snug text-white">
                  Get Travel Inspiration & Exclusive Offers
                </h2>
                <p className="text-[11px] sm:text-[13px] text-white/60 font-inter mt-1 leading-relaxed">
                  Subscribe to our newsletter and never miss a good deal.
                </p>
              </div>
            </div>

            {/* Right side form */}
            <div className="w-full lg:w-auto">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row w-full items-stretch gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white text-[#0D231E] rounded-[10px] px-4 sm:px-5 py-3 sm:py-3.5 placeholder:text-gray-400 focus:outline-none min-w-0 sm:min-w-[260px] md:min-w-[300px] text-sm font-inter"
                />
                <button
                  type="submit"
                  disabled={submittingNewsletter}
                  className="bg-[#C49A5C] hover:bg-[#b38a4e] text-white font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-[10px] transition-colors duration-300 text-sm whitespace-nowrap cursor-pointer hoverEffect"
                >
                  {submittingNewsletter ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
