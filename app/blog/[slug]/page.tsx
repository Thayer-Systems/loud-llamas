import Script from "next/script";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// We intentionally do not call notFound() on unknown slugs anymore — the page
// renders the Soro embed and lets Soro decide what to show based on the URL.
// This keeps legacy slugs and new Soro-published posts working through the
// same route.

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const titleish = slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
  return {
    title: `${titleish} | Loud Llamas Blog`,
    description: "Marketing setup guides, channel breakdowns, and honest advice for small business owners.",
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  await params; // not used directly — the Soro embed reads window.location

  return (
    <div className="min-h-screen bg-white text-[#1F2937]" style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      <Nav />

      {/* Back link */}
      <section className="bg-[#000000] text-white py-10">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Back to blog
          </Link>
        </div>
      </section>

      {/* SORO BLOG EMBED — single-post view picked up by the embed via URL */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div id="soro-blog" />
        </div>
      </section>
      <Script
        src="https://app.trysoro.com/api/embed/8b274232-385a-43a8-8c7a-3acbd92539ab"
        strategy="afterInteractive"
      />

      <Footer />
    </div>
  );
}
