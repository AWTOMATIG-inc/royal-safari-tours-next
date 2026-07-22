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
    <section className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-8 py-10 sm:py-12 md:py-16">
      <div className="bg-sand rounded-[16px] sm:rounded-[24px] p-5 sm:p-8 md:p-12 lg:p-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1.05fr_0.95fr] gap-8 sm:gap-10 lg:gap-10 xl:gap-14 items-start">
          {/* Left Column: Form */}
          <div className="flex flex-col font-subheading">
            <SectionHeading
              subtitle="SEND US A MESSAGE"
              title="Tell us about your trip"
              description="Fill out the form below and our travel experts will get back to you shortly."
              className="mb-6 sm:mb-8"
              titleClassName="text-[26px] sm:text-[34px] md:text-[38px] font-normal leading-tight"
              descriptionClassName="text-[14px] sm:text-[15px] max-w-md font-light"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-subheading">
              {/* Full Name */}
              <InputBox
                placeholder="Full Name"
                icon={<Icon icon="lucide:user" width="17" height="17" />}
                error={errors.name}
                {...register("name")}
              />

              {/* Email Address */}
              <InputBox
                type="email"
                placeholder="Email Address"
                icon={<Icon icon="lucide:mail" width="17" height="17" />}
                error={errors.email}
                {...register("email")}
              />

              {/* Phone Number */}
              <InputBox
                placeholder="Phone Number"
                icon={<Icon icon="lucide:phone" width="17" height="17" />}
                error={errors.phone}
                {...register("phone")}
              />

              {/* Travel Destination */}
              <InputBox
                placeholder="Travel Destination"
                icon={<Icon icon="lucide:compass" width="17" height="17" />}
                error={errors.destination}
                {...register("destination")}
              />

              {/* Message */}
              <div className="flex flex-col sm:col-span-2 relative">
                <textarea
                  placeholder="Tell us about your trip..."
                  {...register("message")}
                  rows="5"
                  className={`w-full p-4 bg-white border ${errors.message ? "border-red-400" : "border-gray-200"} rounded-[10px] text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:border-primary/40 transition-all duration-300 font-body min-h-[120px] sm:min-h-[130px] resize-y`}
                />
                {errors.message && (
                  <span className="text-xs text-red-500 mt-1 font-body">{errors.message.message}</span>
                )}
              </div>

              {/* Travel Date */}
              <InputBox
                placeholder="Travel Date"
                icon={<Icon icon="lucide:calendar" width="17" height="17" />}
                error={errors.date}
                {...register("date")}
              />

              {/* Number of People */}
              <InputBox
                placeholder="Number of People"
                icon={<Icon icon="lucide:users" width="17" height="17" />}
                error={errors.people}
                {...register("people")}
              />

              {/* Submit Button */}
              <div className="sm:col-span-2 mt-1">
                <Button
                  type="submit"
                  loading={loading}
                  loadingText="Sending Inquiry..."
                  className="w-full"
                  icon={<Icon icon="lucide:arrow-right" width="16" height="16" />}
                >
                  Send Inquiry
                </Button>
                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-500 mt-3 sm:mt-4 font-body">
                  <Icon icon="lucide:lock" width="13" height="13" />
                  <span>We respect your privacy. Your information is safe with us.</span>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Image with embedded Backdrop Blur Glassmorphic Office Card */}
          <div className="w-full relative lg:mt-[10%] xl:mt-[12%]">
            <div className="relative w-full min-h-[380px] sm:min-h-[400px] lg:min-h-0 lg:aspect-[4/3] rounded-[14px] sm:rounded-[18px] overflow-hidden shadow-md">
              <Image
                src="/images/banners/contact_office.png"
                alt="Green valley stream cottage"
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/20 z-[1]" />

              <div className="absolute inset-0 z-10 flex items-center justify-center p-4 xs:p-6 sm:p-8">
                <div className="bg-primary/80 backdrop-blur-md border border-white/10 rounded-[14px] sm:rounded-[18px] p-5 sm:p-7 md:p-8 w-full max-w-[340px] sm:max-w-[360px] text-white text-left shadow-2xl">
                  <h3 className="text-lg sm:text-xl md:text-[22px] font-bold text-white font-heading mb-2 sm:mb-2.5">
                    {siteConfig.name}
                  </h3>
                  <p className="text-[12px] sm:text-[13px] text-white/70 leading-relaxed mb-4 sm:mb-5 font-body">
                    {siteConfig.contact.address.full}
                  </p>

                  <div className="flex flex-col gap-2.5 sm:gap-3 mb-5 sm:mb-6 text-[12px] sm:text-[13px]">
                    <a href={`tel:${siteConfig.contact.phone.primaryRaw}`} className="flex items-center gap-2.5 sm:gap-3 text-white/90 hover:text-accent transition-colors">
                      <Icon icon="lucide:phone" width="15" height="15" className="text-accent flex-shrink-0" />
                      <span>{siteConfig.contact.phone.primary}</span>
                    </a>
                    <a href={`mailto:${siteConfig.contact.email.info}`} className="flex items-center gap-2.5 sm:gap-3 text-white/90 hover:text-accent transition-colors">
                      <Icon icon="lucide:mail" width="15" height="15" className="text-accent flex-shrink-0" />
                      <span>{siteConfig.contact.email.info}</span>
                    </a>
                    <div className="flex items-start gap-2.5 sm:gap-3 text-white/90">
                      <Icon icon="lucide:clock" width="15" height="15" className="text-accent mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col leading-snug">
                        <span>{siteConfig.contact.hours.office}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href="#map-section"
                    className="w-full bg-accent hover:bg-accent/80 text-white text-[12px] sm:text-[13px] font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded-[10px] transition-colors duration-300 flex items-center justify-center gap-2 shadow-md hoverEffect cursor-pointer"
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
  );
}
