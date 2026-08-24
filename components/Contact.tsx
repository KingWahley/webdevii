"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { submitContactMessage } from "@/app/actions/messages";

export default function Contact() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    if (modal.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modal.isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("subject", formData.subject || "New Project Discussion");
    data.append("message", formData.message);

    try {
      const res = await submitContactMessage(data);
      if (res?.error) {
        setModal({
          isOpen: true,
          type: "error",
          title: "Submission Error",
          message: res.error,
        });
      } else {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setModal({
          isOpen: true,
          type: "success",
          title: "Message Sent Successfully!",
          message:
            "Thank you for reaching out. Your inquiry has been delivered and I will get back to you shortly.",
        });
      }
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Connection Error",
        message:
          err?.message || "Could not send message at this time. Please try again.",
      });
    }

    setSubmitting(false);
  };

  return (
    <section id="contact" className="space-y-12">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase font-display leading-[0.95] sm:leading-[0.85] mb-12 sm:mb-16">
        Let&apos;s Work
        <br />
        <span className="text-[#2C2C2C]">Together</span>
      </h2>

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
            <option value="New Project Discussion">New Project Discussion</option>
            <option value="Freelance Contract">Freelance Contract</option>
            <option value="Consulting & Architecture">Consulting & Architecture</option>
            <option value="Other Inquiry">Other Inquiry</option>
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

      {/* Confirmation Feedback Modal rendered via React Portal directly to document.body */}
      {mounted &&
        modal.isOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setModal({ ...modal, isOpen: false })}
          >
            <div
              className="bg-[#161616] border border-[#262626] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl border border-[#262626] bg-neutral-900 shadow-inner">
                {modal.type === "success" ? (
                  <span className="text-emerald-400">✓</span>
                ) : (
                  <span className="text-red-400">⚠️</span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white font-display">
                  {modal.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {modal.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModal({ ...modal, isOpen: false })}
                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg ${
                  modal.type === "success"
                    ? "bg-[#FF6B35] text-neutral-950 hover:bg-[#e05a2b] shadow-[#FF6B35]/20"
                    : "bg-neutral-800 text-white hover:bg-neutral-700"
                }`}
              >
                Got it
              </button>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
