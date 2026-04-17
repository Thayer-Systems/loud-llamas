"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function SupportPage() {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) { setError("Please fill out all required fields."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, orderId, message }),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
    } catch {
      setError("Something went wrong. Try emailing us directly at hello@loudllamas.org.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <Nav />

      <section className="bg-[#000000] px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">Get in touch</p>
          <h1 className="font-black text-white leading-tight" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
            We&apos;re real people.
          </h1>
          <p className="text-[#9CA3AF] text-xl mt-4 max-w-lg">
            No ticket queues, no chatbots. Send us a message and we&apos;ll reply within 1 business day.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">

          {/* FORM */}
          <div>
            {sent ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-6">🦙</p>
                <h2 className="font-black text-2xl mb-3">Got it. We&apos;ll be in touch.</h2>
                <p className="text-[#6B7280]">Expect a reply within 1 business day. Check your spam if you don&apos;t hear from us.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full name <span className="text-red-500">*</span></label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full border border-[#DEDEDE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email address <span className="text-red-500">*</span></label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full border border-[#DEDEDE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Order ID <span className="text-[#9CA3AF] font-normal">(optional)</span></label>
                  <input
                    type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. A1B2C3D4"
                    className="w-full border border-[#DEDEDE] rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Message <span className="text-red-500">*</span></label>
                  <textarea
                    value={message} onChange={(e) => setMessage(e.target.value)}
                    rows={5} placeholder="What's going on?"
                    className="w-full border border-[#DEDEDE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] transition-colors resize-none"
                  />
                </div>

                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-[#000000] text-white font-bold py-4 rounded-full hover:bg-[#2563EB] transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? "Sending…" : "Send message →"}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT INFO */}
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-3">Response time</p>
              <p className="font-bold text-xl">1 business day</p>
              <p className="text-[#6B7280] mt-1">Usually faster. We check messages daily.</p>
            </div>
            <div className="h-px bg-[#EBEBEB]" />
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-3">Email us directly</p>
              <a href="mailto:hello@loudllamas.org" className="font-bold text-xl hover:text-[#2563EB] transition-colors">
                hello@loudllamas.org
              </a>
            </div>
            <div className="h-px bg-[#EBEBEB]" />
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-3">Break-fix</p>
              <p className="text-[#6B7280] leading-relaxed">
                Something stopped working after handoff? It happens. Flat <span className="font-bold text-[#000000]">$79 fee</span> per incident.
                Describe the issue in the form above and we&apos;ll get back to you with next steps.
              </p>
            </div>
            <div className="h-px bg-[#EBEBEB]" />
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-3">A Thayer Systems company</p>
              <p className="text-[#6B7280] text-sm">Loud Llamas is built and operated by Thayer Systems.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
