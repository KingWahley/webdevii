"use client";

import { useState } from "react";
import { submitContactMessage } from "@/app/actions/messages";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("subject", formData.subject || "Project Inquiry");
    data.append("message", formData.message);

    try {
      await submitContactMessage(data);
      setSent(true);
    } catch (err) {
      console.error("Message save error", err);
    }

    // Also trigger direct email client as fallback
    const mailto = `mailto:kingwahley@gmail.com?subject=${encodeURIComponent(
      formData.subject || "Project Inquiry"
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`;
    window.location.href = mailto;
    setSubmitting(false);
  };

  return (
    <section id="contact" className="space-y-12">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase font-display leading-[0.95] sm:leading-[0.85] mb-12 sm:mb-16">
        Let&apos;s Work
        <br />
        <span className="text-[#2C2C2C]">Together</span>
      </h2>

      {sent && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-800 rounded-2xl text-emerald-300 text-xs font-bold uppercase tracking-wider">
          ✓ Message saved to inbox and sent to Peter!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 contact-element">
          <input
            type="text"
            required
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="bg-[#161616] border border-[#262626] focus:border-[#FF6B35] focus:ring-0 text-white rounded-2xl p-5 w-full outline-none transition duration-300 font-medium placeholder-neutral-600"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="bg-[#161616] border border-[#262626] focus:border-[#FF6B35] focus:ring-0 text-white rounded-2xl p-5 w-full outline-none transition duration-300 font-medium placeholder-neutral-600"
          />
        </div>

        <div className="relative contact-element">
          <select
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="bg-[#161616] border border-[#262626] focus:border-[#FF6B35] focus:ring-0 text-neutral-400 focus:text-white rounded-2xl p-5 w-full outline-none transition duration-300 font-medium appearance-none cursor-pointer"
          >
            <option value="" disabled>
              Subject
            </option>
            <option value="project">New Project Discussion</option>
            <option value="freelance">Freelance Contract</option>
            <option value="consulting">Consulting & Architecture</option>
            <option value="other">Other Inquiry</option>
          </select>

          {/* Custom Chevron Arrow */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>

        <textarea
          required
          placeholder="Message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="bg-[#161616] border border-[#262626] focus:border-[#FF6B35] focus:ring-0 text-white rounded-2xl p-5 w-full outline-none h-44 transition duration-300 font-medium placeholder-neutral-600 resize-none contact-element"
        ></textarea>

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#FF6B35] text-neutral-950 font-black uppercase py-5 rounded-2xl w-full text-center hover:bg-[#e05a2b] active:scale-[0.99] transition duration-300 tracking-wider contact-element cursor-pointer disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}
