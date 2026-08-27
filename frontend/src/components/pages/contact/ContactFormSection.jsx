"use client";

import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import InputBox from "@/components/InputBox";
import { siteConfig } from "@/config/siteConfig";
import { trackContactFormSubmit } from "@/lib/gtm";
import { contactYupSchema } from "@/yup/contactYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Reveal } from "@/components/animations";

const ALL_COUNTRIES = [
  { country: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { country: "Canada", code: "+1", flag: "🇨🇦" },
  { country: "United States", code: "+1", flag: "🇺🇸" },
  { country: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { country: "Australia", code: "+61", flag: "🇦🇺" },
  { country: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { country: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { country: "Qatar", code: "+974", flag: "🇶🇦" },
  { country: "India", code: "+91", flag: "🇮🇳" },
  { country: "Singapore", code: "+65", flag: "🇸🇬" },
  { country: "Malaysia", code: "+60", flag: "🇲🇾" },
  { country: "Germany", code: "+49", flag: "🇩🇪" },
  { country: "France", code: "+33", flag: "🇫🇷" },
  { country: "Italy", code: "+39", flag: "🇮🇹" },
  { country: "Spain", code: "+34", flag: "🇪🇸" },
  { country: "Japan", code: "+81", flag: "🇯🇵" },
  { country: "China", code: "+86", flag: "🇨🇳" },
  { country: "Nepal", code: "+977", flag: "🇳🇵" },
  { country: "Sri Lanka", code: "+94", flag: "🇱🇰" },
  { country: "Maldives", code: "+960", flag: "🇲🇻" },
  { country: "Turkey", code: "+90", flag: "🇹🇷" },
  { country: "Brazil", code: "+55", flag: "🇧🇷" },
  { country: "Egypt", code: "+20", flag: "🇪🇬" },
  { country: "South Africa", code: "+27", flag: "🇿🇦" },
];

export default function ContactFormSection() {
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(ALL_COUNTRIES[0]);
  const [phoneDigits, setPhoneDigits] = useState("");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const dropdownRef = useRef(null);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contactYupSchema),
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = ALL_COUNTRIES.filter((c) => {
    const q = countrySearch.toLowerCase().trim();
    if (!q) return true;
    return c.country.toLowerCase().includes(q) || c.code.includes(q);
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
        setSubmittedData({
          name: data.name,
          email: data.email,
          destination: data.destination,
          date: data.date,
          people: data.people,
        });
        reset();
        setPhoneDigits("");
        setSelectedCountry(ALL_COUNTRIES[0]);
        setLoading(false);
        setShowSuccessModal(true);
        toast.success("Inquiry submitted successfully!");
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

  return (
    <section className="container py-10 sm:py-12 md:py-16 font-body">
      <div className="bg-sand rounded-3xl p-5 sm:p-8 md:p-12 lg:p-14 font-body border border-primary/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1.05fr_0.95fr] gap-8 sm:gap-10 lg:gap-10 xl:gap-14 items-start font-body">
          {/* Left Column: Form */}
          <Reveal variant="fadeRight" className="flex flex-col font-body">
            <SectionHeading
              subtitle="SEND US A MESSAGE"
              title="Tell us about your trip"
              description="Fill out the form below and our travel experts will get back to you shortly."
              className="mb-6 sm:mb-8"
              descriptionClassName="text-body-md max-w-md font-light text-primary/75"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-body">
              {/* Full Name */}
              <InputBox
                type="text"
                placeholder="Full Name"
                icon={<Icon icon="lucide:user" className="w-4 h-4" />}
                error={errors.name}
                {...register("name")}
              />

              {/* Email Address */}
              <InputBox
                type="email"
                placeholder="Email Address"
                icon={<Icon icon="lucide:mail" className="w-4 h-4" />}
                error={errors.email}
                {...register("email")}
              />

              {/* Phone Number Field with Country Flag Dropdown Popover */}
              <div className="flex flex-col relative w-full font-body" ref={dropdownRef}>
                <div
                  className={`relative flex items-center bg-white border ${
                    errors.phone ? "border-rose-400 focus-within:border-rose-500" : "border-gray-200 focus-within:border-secondary"
                  } rounded-xl shadow-xs transition-all duration-300`}
                >
                  {/* Flag Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 px-3 py-3 hover:bg-gray-50 border-r border-gray-200 shrink-0 cursor-pointer rounded-l-xl transition-colors select-none font-body"
                  >
                    <span className="text-lg leading-none">{selectedCountry.flag}</span>
                    <Icon icon="lucide:chevron-down" className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {/* Dial Code Prefix */}
                  <span className="text-sm font-semibold text-gray-600 pl-3 select-none font-body">
                    {selectedCountry.code}
                  </span>

                  {/* Number Input */}
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phoneDigits}
                    placeholder="Phone Number"
                    onChange={(e) => {
                      let raw = e.target.value.replace(/\D/g, "");
                      if (selectedCountry.code === "+880" && raw.startsWith("0")) {
                        raw = raw.slice(1);
                      }
                      setPhoneDigits(raw);
                      const combined = selectedCountry.code + raw;
                      setValue("phone", combined, { shouldValidate: true });
                    }}
                    className="w-full bg-transparent text-sm font-body text-primary placeholder:text-gray-400 focus:outline-none pl-2 pr-4 py-3"
                  />
                  <input type="hidden" {...register("phone")} />
                </div>

                {/* Country Dropdown Popover */}
                {isCountryOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 max-h-64 overflow-y-auto bg-[#18181b] text-white border border-white/10 rounded-2xl shadow-2xl z-50 p-2 space-y-1 font-body animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-1 sticky top-0 bg-[#18181b] pb-2 z-10">
                      <input
                        type="text"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Search country or code..."
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-secondary font-body"
                      />
                    </div>
                    {filteredCountries.map((c) => (
                      <button
                        key={`${c.country}-${c.code}`}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(c);
                          setIsCountryOpen(false);
                          const combined = c.code + phoneDigits;
                          setValue("phone", combined, { shouldValidate: true });
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer font-body ${
                          selectedCountry.country === c.country ? "bg-secondary text-white font-semibold" : "hover:bg-white/10 text-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-base leading-none">{c.flag}</span>
                          <span className="truncate">{c.country}</span>
                        </div>
                        <span className="font-mono text-gray-400 shrink-0">({c.code})</span>
                      </button>
                    ))}
                  </div>
                )}

                {errors.phone && (
                  <span className="text-xs text-rose-500 mt-1 font-body">{errors.phone.message}</span>
                )}
              </div>

              {/* Travel Destination */}
              <InputBox
                type="text"
                placeholder="Travel Destination"
                icon={<Icon icon="lucide:compass" className="w-4 h-4" />}
                error={errors.destination}
                {...register("destination")}
              />

              {/* Travel Date (Calendar Picker with Today Min Limit) */}
              <InputBox
                type="date"
                min={new Date().toISOString().split("T")[0]}
                placeholder="Select Travel Date"
                icon={<Icon icon="lucide:calendar" className="w-4 h-4" />}
                error={errors.date}
                {...register("date")}
              />

              {/* Number of People (Number Input - Max 99 / 2-digit limit) */}
              {(() => {
                const peopleReg = register("people");
                return (
                  <InputBox
                    type="number"
                    min="1"
                    max="99"
                    placeholder="Number of People"
                    icon={<Icon icon="lucide:users" className="w-4 h-4" />}
                    error={errors.people}
                    {...peopleReg}
                    onInput={(e) => {
                      if (e.target.value.length > 2) {
                        e.target.value = e.target.value.slice(0, 2);
                      }
                      if (Number(e.target.value) > 99) {
                        e.target.value = "99";
                      }
                    }}
                    onKeyDown={(e) => {
                      if (["e", "E", "-", "+", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                );
              })()}

              {/* Message */}
              <div className="flex flex-col sm:col-span-2 relative font-body">
                <textarea
                  placeholder="Tell us about your trip..."
                  {...register("message")}
                  rows="5"
                  className={`w-full p-4 bg-white border ${errors.message ? "border-rose-400 focus:border-rose-500" : "border-gray-200 focus:border-secondary"} rounded-xl text-sm text-primary placeholder:text-gray-400 focus:outline-none transition-all duration-300 font-body min-h-[120px] sm:min-h-[130px] resize-y shadow-xs`}
                />
                {errors.message && (
                  <span className="text-xs text-rose-500 mt-1 font-body">{errors.message.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2 mt-1 font-body">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  loadingText="Sending Inquiry..."
                  className="w-full"
                  icon={<Icon icon="lucide:arrow-right" className="w-4 h-4" />}
                >
                  Send Inquiry
                </Button>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-3 sm:mt-4 font-body">
                  <Icon icon="lucide:lock" className="w-3.5 h-3.5" />
                  <span>We respect your privacy. Your information is safe with us.</span>
                </div>
              </div>
            </form>
          </Reveal>

          {/* Right Column: Office Card */}
          <Reveal variant="fadeLeft" className="w-full relative lg:mt-[10%] xl:mt-[12%] font-body">
            <div className="relative w-full min-h-[380px] sm:min-h-[400px] lg:min-h-0 lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-xs border border-gray-200/80">
              <Image
                src="/images/banners/contact_office.png"
                alt="Green valley stream cottage"
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/20 z-[1]" />

              <div className="absolute inset-0 z-10 flex items-center justify-center p-4 xs:p-6 sm:p-8 font-body">
                <div className="bg-primary/85 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-7 md:p-8 w-full max-w-[340px] sm:max-w-[360px] text-white text-left shadow-xl font-body">
                  <h3 className="text-lg sm:text-xl font-bold text-white font-heading mb-2 sm:mb-2.5">
                    {siteConfig.name}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed mb-4 sm:mb-5 font-body">
                    {siteConfig.contact.address.full}
                  </p>

                  <div className="flex flex-col gap-2.5 sm:gap-3 mb-5 sm:mb-6 text-xs font-body">
                    <div className="flex flex-col gap-1">
                      <a href={`tel:${siteConfig.contact.phone.primaryRaw}`} className="flex items-center gap-2.5 sm:gap-3 text-white/90 hover:text-accent transition-colors font-body">
                        <Icon icon="lucide:phone" className="w-4 h-4 text-accent shrink-0" />
                        <span>{siteConfig.contact.phone.primary}</span>
                      </a>
                      <a href={`tel:${siteConfig.contact.phone.secondaryRaw}`} className="flex items-center gap-2.5 sm:gap-3 text-white/90 hover:text-accent transition-colors font-body pl-6.5">
                        <span>{siteConfig.contact.phone.secondary}</span>
                      </a>
                    </div>
                    <a href={`mailto:${siteConfig.contact.email.info}`} className="flex items-center gap-2.5 sm:gap-3 text-white/90 hover:text-accent transition-colors font-body">
                      <Icon icon="lucide:mail" className="w-4 h-4 text-accent shrink-0" />
                      <span>{siteConfig.contact.email.info}</span>
                    </a>
                    <div className="flex items-start gap-2.5 sm:gap-3 text-white/90 font-body">
                      <Icon icon="lucide:clock" className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <div className="flex flex-col leading-snug font-body">
                        <span>{siteConfig.contact.hours.office}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href="#map-section"
                    className="w-full bg-accent hover:bg-accent/80 text-white text-xs font-semibold py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 shadow-xs cursor-pointer font-body"
                  >
                    <span>Get Directions</span>
                    <Icon icon="lucide:navigation" className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* High-Impact Success Popup Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-body">
          <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-md w-full text-center space-y-6 shadow-2xl border border-gray-100 font-body relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <Icon icon="lucide:x" className="w-5 h-5" />
            </button>

            {/* Checkmark Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2cb775]/10 text-[#2cb775] flex items-center justify-center mx-auto shadow-inner">
              <Icon icon="lucide:check-circle-2" className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            {/* Title & Description */}
            <div className="space-y-2 font-body">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0D231E] font-heading">
                Inquiry Received!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-body">
                Thank you, <strong className="text-[#0D231E]">{submittedData?.name}</strong>! Your expedition request has been logged and sent to our team.
              </p>
            </div>

            {/* Summary Details Card */}
            {submittedData && (
              <div className="bg-sand border border-primary/10 rounded-2xl p-4 text-left text-xs space-y-2 font-body">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Destination:</span>
                  <span className="font-bold text-[#2cb775]">{submittedData.destination}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Travel Date:</span>
                  <span className="font-mono font-semibold text-gray-800">{submittedData.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Travelers:</span>
                  <span className="font-semibold text-gray-800">{submittedData.people} Person(s)</span>
                </div>
                <div className="pt-2 border-t border-primary/10 text-[11px] text-gray-500 flex items-center gap-1.5">
                  <Icon icon="lucide:mail-check" className="w-3.5 h-3.5 text-[#2cb775] shrink-0" />
                  <span>Confirmation sent to <strong className="text-gray-700">{submittedData.email}</strong></span>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#0D231E] hover:bg-[#2cb775] text-white text-xs sm:text-sm font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md cursor-pointer font-body"
            >
              Great, Thank You!
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
