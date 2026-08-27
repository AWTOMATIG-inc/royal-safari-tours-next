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
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Reveal } from "@/components/animations";

export default function ContactFormSection() {
  const [loading, setLoading] = useState(false);

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

              {/* Phone Number (Exactly 11 Digits - Numeric Only) */}
              {(() => {
                const phoneReg = register("phone");
                return (
                  <InputBox
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="Phone Number (11 digits)"
                    icon={<Icon icon="lucide:phone" className="w-4 h-4" />}
                    error={errors.phone}
                    {...phoneReg}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                      phoneReg.onChange(e);
                    }}
                  />
                );
              })()}

              {/* Travel Destination */}
              <InputBox
                type="text"
                placeholder="Travel Destination"
                icon={<Icon icon="lucide:compass" className="w-4 h-4" />}
                error={errors.destination}
                {...register("destination")}
              />

              {/* Travel Date (Calendar Picker) */}
              <InputBox
                type="date"
                placeholder="Select Travel Date"
                icon={<Icon icon="lucide:calendar" className="w-4 h-4" />}
                error={errors.date}
                {...register("date")}
              />

              {/* Number of People (Number Input) */}
              <InputBox
                type="number"
                min="1"
                placeholder="Number of People"
                icon={<Icon icon="lucide:users" className="w-4 h-4" />}
                error={errors.people}
                {...register("people")}
              />

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
                    <a href={`tel:${siteConfig.contact.phone.primaryRaw}`} className="flex items-center gap-2.5 sm:gap-3 text-white/90 hover:text-accent transition-colors font-body">
                      <Icon icon="lucide:phone" className="w-4 h-4 text-accent shrink-0" />
                      <span>{siteConfig.contact.phone.primary}</span>
                    </a>
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
    </section>
  );
}

