"use client";

import Button from "@/components/Button";
import { Icon } from "@iconify/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactNewsletter() {
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      return toast.error("Please enter a valid email address");
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(newsletterEmail.trim())) {
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
    <section className="w-full bg-primary">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 font-subheading">
          {/* Left side text and icon */}
          <div className="flex items-center gap-4 sm:gap-5 text-left w-full lg:w-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 flex items-center justify-center text-white flex-shrink-0">
              <Icon icon="lucide:mail" width="22" height="22" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-normal leading-snug text-white">
                Get Travel Inspiration & Exclusive Offers
              </h2>
              <p className="text-[11px] sm:text-[13px] text-white/60 font-body mt-1 leading-relaxed">
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
                className="bg-white text-primary rounded-[10px] px-4 sm:px-5 py-3 sm:py-3.5 placeholder:text-gray-400 focus:outline-none min-w-0 sm:min-w-[260px] md:min-w-[300px] text-sm font-body"
              />
              <Button
                type="submit"
                variant="secondary"
                loading={submittingNewsletter}
                loadingText="Subscribing..."
                className="whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
