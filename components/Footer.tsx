import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-gray-500 py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Loud Llamas"
            width={32}
            height={32}
            className="rounded opacity-80"
          />
          <div>
            <p className="text-white font-bold text-sm">Loud Llamas</p>
            <p className="text-xs">A Thayer Systems Company</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/packages" className="hover:text-white transition-colors">Packages</Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
          <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
          <Link href="/support" className="hover:text-white transition-colors">Support</Link>
        </div>

        <p className="text-xs">Marketing Setup. Done Once. Done Right.</p>
      </div>
    </footer>
  );
}
