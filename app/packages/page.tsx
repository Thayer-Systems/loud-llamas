import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PackagesContent from "./PackagesContent";

export const metadata = {
  title: "Packages — Loud Llamas",
  description: "8 marketing channels. 3 tiers each. One-time price. Full setup in 5–7 days.",
};

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <Nav />
      <PackagesContent />
      <Footer />
    </div>
  );
}
