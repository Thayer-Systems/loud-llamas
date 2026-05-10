import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { posts, getPost } from "@/content/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Loud Llamas Blog`,
    description: post.description,
  };
}

function renderBody(body: string) {
  const lines = body.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-extrabold mt-10 mb-4 text-[#1F2937]">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="font-bold text-[#1F2937] mt-4 mb-1">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    } else if (line.startsWith("- ")) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        listItems.push(lines[i].replace("- ", ""));
        i++;
      }
      elements.push(
        <ul key={`list-${i}`} className="list-none flex flex-col gap-1.5 my-4">
          {listItems.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-[#6B7280]">
              <span className="text-[#2563EB] mt-0.5 flex-shrink-0">✓</span>
              <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (line === "---") {
      elements.push(<hr key={i} className="my-10 border-[#E5E7EB]" />);
    } else if (line.trim() === "") {
      // skip blank lines
    } else {
      // parse inline bold and links
      const html = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#2563EB] font-semibold hover:underline">$1</a>');
      elements.push(
        <p key={i} className="text-[#1F2937] leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: html }} />
      );
    }
    i++;
  }

  return elements;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const otherPosts = posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-[#1F2937]" style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      <Nav />

      {/* ARTICLE HEADER */}
      <section className="bg-[#1F2937] text-white py-14">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-5">
            <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">← Blog</Link>
            <span className="text-gray-600">·</span>
            <span className="text-xs font-bold uppercase tracking-widest bg-blue-900 text-[#93c5fd] px-2 py-1 rounded-full">
              {post.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">{post.title}</h1>
          <p className="text-gray-300 text-lg mb-6">{post.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* ARTICLE BODY */}
      <article className="max-w-3xl mx-auto px-6 py-14">
        {renderBody(post.body)}
      </article>

      {/* MORE POSTS */}
      {otherPosts.length > 0 && (
        <section className="bg-[#F3F4F6] py-14">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-extrabold mb-8">More from the blog</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {otherPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:border-[#2563EB] hover:shadow-md transition-all"
                >
                  <span className="text-xs font-bold uppercase tracking-widest bg-[#F3F4F6] text-[#6B7280] px-2 py-1 rounded-full">
                    {p.category}
                  </span>
                  <h3 className="font-bold mt-3 mb-2 group-hover:text-[#2563EB] transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#6B7280]">{p.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
