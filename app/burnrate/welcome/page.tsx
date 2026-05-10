import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Welcome to Burnrate | Loud Llamas",
};

export default function BurnrateWelcomePage() {
  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <Nav />

      <section className="px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-6xl mb-6">🦙</p>
          <p className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-4">You&apos;re in</p>
          <h1 className="font-black mb-6 leading-[0.95]" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
            Welcome to Burnrate.
          </h1>
          <p className="text-[#6B7280] text-lg mb-10 max-w-xl mx-auto">
            Your subscription is live. Check your inbox. We&apos;ve sent a link to OAuth your Google Ads and Meta accounts. First fix list lands within 24 hours of connection.
          </p>

          <div className="bg-[#F8F8F8] rounded-2xl p-8 text-left mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-4">What&apos;s next</p>
            <ol className="space-y-4 text-[#000000]">
              <li className="flex gap-3"><span className="font-black text-[#2563EB]">1.</span><span>Open the email we just sent and click &quot;Connect Accounts.&quot;</span></li>
              <li className="flex gap-3"><span className="font-black text-[#2563EB]">2.</span><span>Authorize read-only access to Google Ads and Meta. Takes a minute.</span></li>
              <li className="flex gap-3"><span className="font-black text-[#2563EB]">3.</span><span>Wait 24 hours. Your first prioritized fix list arrives in your inbox.</span></li>
            </ol>
          </div>

          <p className="text-sm text-[#6B7280] mb-2">Didn&apos;t get the email? Check spam, then ping us.</p>
          <Link href="/support" className="text-[#2563EB] font-semibold hover:underline">Contact support →</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
