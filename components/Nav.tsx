import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#F0F0F0]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-horizontal.png"
            alt="Loud Llamas"
            width={160}
            height={40}
            className="object-contain"
          />
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/packages" className="text-sm font-medium text-[#6B7280] hover:text-[#0D0D0D] transition-colors hidden md:block">
            Packages
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium text-[#6B7280] hover:text-[#0D0D0D] transition-colors hidden md:block">
            How It Works
          </Link>
          <Link href="/faq" className="text-sm font-medium text-[#6B7280] hover:text-[#0D0D0D] transition-colors hidden md:block">
            FAQ
          </Link>
          <Link href="/blog" className="text-sm font-medium text-[#6B7280] hover:text-[#0D0D0D] transition-colors hidden md:block">
            Blog
          </Link>
          <Link href="/packages" className="bg-[#0D0D0D] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#2563EB] transition-colors duration-300">
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
