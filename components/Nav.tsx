import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Loud Llamas" width={40} height={40} className="rounded" />
          <span className="font-bold text-lg text-[#1F2937] hidden sm:block">Loud Llamas</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/packages" className="text-sm font-medium text-[#6B7280] hover:text-[#1F2937] transition-colors">
            Packages
          </Link>
          <Link href="/blog" className="text-sm font-medium text-[#6B7280] hover:text-[#1F2937] transition-colors hidden sm:block">
            Blog
          </Link>
          <Link href="/resources" className="text-sm font-medium text-[#6B7280] hover:text-[#1F2937] transition-colors hidden sm:block">
            Resources
          </Link>
          <Link href="/support" className="text-sm font-medium text-[#6B7280] hover:text-[#1F2937] transition-colors hidden md:block">
            Support
          </Link>
          <Link
            href="/packages"
            className="bg-[#2563EB] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
