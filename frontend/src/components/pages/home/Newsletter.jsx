"use client";

import SectionHeading from "@/components/SectionHeading";
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
    <section className="section-md text-primary border-t border-gray-100 bg-white font-body">
      <div className="container-narrow">
        <div className="relative rounded-3xl p-8 sm:p-12 md:p-14 bg-sand border border-primary/10 text-center space-y-6 shadow-xs">
          
          <SectionHeading
            subtitle="Private Dispatch"
            title="Join The Royal Circle"
            description="Receive private expedition releases, seasonal travel stories, and rare wilderness insights directly in your inbox."
            align="center"
          />

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2 font-body">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border border-primary/15 rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-primary/50 font-body focus:outline-none focus:border-secondary transition-colors shadow-xs"
            />
            <Button
              type="submit"
              variant="accent"
              loading={submitting}
              loadingText="Joining..."
              className="whitespace-nowrap"
              icon={<Icon icon="lucide:arrow-right" className="w-4 h-4" />}
            >
              Subscribe
            </Button>
          </form>

          <p className="text-caption text-primary/50 tracking-wider uppercase font-body">
            We respect your privacy. Unsubscribe at any time.
          </p>

        </div>
      </div>
    </section>
  );
}

