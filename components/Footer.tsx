import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1F2937] text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Loud Llamas" width={36} height={36} className="rounded" />
          <div>
            <p className="text-white font-bold">Loud Llamas</p>
            <p className="text-xs">A Thayer Systems Company</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/packages" className="hover:text-white transition-colors">Packages</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
          <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
          <Link href="/support" className="hover:text-white transition-colors">Support</Link>
        </div>
        <p className="text-xs">Marketing Setup. Done Once. Done Right.</p>
      </div>
    </footer>
  );
}
