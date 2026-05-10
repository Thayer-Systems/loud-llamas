import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { posts } from "@/content/blog";

export const metadata = {
  title: "Blog | Loud Llamas",
  description: "Marketing setup guides, channel breakdowns, and honest advice for small business owners.",
};

const CATEGORIES = ["All", "Analytics", "Email", "SEO", "Website", "Social"];

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

      {/* CATEGORIES */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors cursor-default ${
                cat === "All"
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "border-[#E5E7EB] text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB]"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* FEATURED POST */}
      {posts[0] && (
        <section className="bg-[#F3F4F6] py-12">
          <div className="max-w-6xl mx-auto px-6">
            <Link href={`/blog/${posts[0].slug}`} className="group block bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:border-[#2563EB] hover:shadow-md transition-all">
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest bg-blue-50 text-[#2563EB] px-3 py-1 rounded-full">
                    {posts[0].category}
                  </span>
                  <span className="text-sm text-[#6B7280]">{posts[0].date}</span>
                  <span className="text-sm text-[#6B7280]">·</span>
                  <span className="text-sm text-[#6B7280]">{posts[0].readTime}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3 group-hover:text-[#2563EB] transition-colors">
                  {posts[0].title}
                </h2>
                <p className="text-[#6B7280] text-lg leading-relaxed mb-6 max-w-2xl">{posts[0].description}</p>
                <span className="text-[#2563EB] font-bold">Read the guide →</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* POST GRID */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:border-[#2563EB] hover:shadow-md transition-all flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest bg-[#F3F4F6] text-[#6B7280] px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-[#2563EB] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-4 flex-1">{post.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F3F4F6]">
                  <span className="text-xs text-[#6B7280]">{post.date}</span>
                  <span className="text-xs text-[#6B7280]">{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
