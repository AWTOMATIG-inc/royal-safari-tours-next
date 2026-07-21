"use client";

import Button from "@/components/Button";
import { Icon } from "@iconify/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter your email address.");
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return toast.error("Please enter a valid email address.");
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/subscriber", {
        method: "POST",
        body: JSON.stringify({ name: "Newsletter Subscriber", email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 409) {
        setSubmitting(false);
        setEmail("");
        return toast.error("You are already subscribed to our journal!");
      }

      if (res.ok) {
        setSubmitting(false);
        setEmail("");
        return toast.success("Welcome to The Royal Circle!");
      } else {
        setSubmitting(false);
        return toast.error("Subscription failed. Please try again.");
      }
    } catch (error) {
      setSubmitting(false);
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="py-16 sm:py-24 md:py-28 text-[#0D231E] border-t border-gray-100 bg-white">
      <div className="container max-w-4xl">
        <div className="relative rounded-3xl p-8 sm:p-12 md:p-14 bg-[#f4f1e8] border border-[#e2ddd0] text-center space-y-6 shadow-sm">
          
          <div className="space-y-3">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#DE8D3D] block">
              Private Dispatch
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-tight text-[#0D231E]">
              Join The Royal Circle
            </h2>
            <p className="text-sm sm:text-base text-[#0D231E]/75 font-light font-inter max-w-lg mx-auto leading-relaxed">
              Receive private expedition releases, seasonal travel stories, and rare wilderness insights directly in your inbox.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border border-[#dcd6c5] rounded-xl px-4 py-3.5 text-sm text-[#0D231E] placeholder:text-[#0D231E]/50 font-inter focus:outline-none focus:border-[#2cb775] transition-colors shadow-sm"
            />
            <Button
              type="submit"
              loading={submitting}
              loadingText="Joining..."
              className="whitespace-nowrap"
              icon={<Icon icon="lucide:arrow-right" className="w-4 h-4" />}
            >
              Subscribe
            </Button>
          </form>

          <p className="text-[10px] text-[#0D231E]/50 font-inter tracking-wide uppercase">
            We respect your privacy. Unsubscribe at any time.
          </p>

        </div>
      </div>
    </section>
  );
}
