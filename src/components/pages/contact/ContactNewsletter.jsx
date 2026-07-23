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
    <section className="w-full bg-primary text-white font-body py-10 sm:py-12">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
          {/* Left side text and icon */}
          <div className="flex items-center gap-4 sm:gap-5 text-left w-full lg:w-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
              <Icon icon="lucide:mail" width="22" height="22" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-normal leading-snug text-white">
                Get Travel Inspiration &amp; Exclusive Offers
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-body mt-1 leading-relaxed">
                Subscribe to our newsletter and never miss an exclusive expedition deal.
              </p>
            </div>
          </div>

          {/* Right side form */}
          <div className="w-full lg:w-auto shrink-0">
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row w-full lg:w-auto items-stretch gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-white text-primary rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 placeholder:text-gray-400 focus:outline-none min-w-0 sm:min-w-[280px] md:min-w-[320px] text-sm font-body shadow-xs"
              />
              <Button
                type="submit"
                variant="accent"
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
