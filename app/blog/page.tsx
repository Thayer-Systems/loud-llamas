import Script from "next/script";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Blog | Loud Llamas",
  description: "Marketing setup guides, channel breakdowns, and honest advice for small business owners.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white text-[#1F2937]" style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      <Nav />

      {/* HEADER */}
      <section className="bg-[#000000] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">The Llama Blog</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Marketing setup guides, channel breakdowns, and honest advice. No fluff. No gatekeeping.
            Just the stuff that actually works for small businesses.
          </p>
        </div>
      </section>

      {/* SORO BLOG EMBED */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div id="soro-blog" />
        </div>
      </section>
      <Script
        src="https://app.trysoro.com/api/embed/8b274232-385a-43a8-8c7a-3acbd92539ab"
        strategy="afterInteractive"
      />

      {/* NEWSLETTER CTA */}
      <section className="bg-[#000000] py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">Get the good stuff in your inbox</h2>
          <p className="text-gray-400 mb-8">
            Marketing setup guides, channel tips, and the occasional llama update. No spam.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB]"
            />
            <button
              type="submit"
              className="bg-[#2563EB] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
