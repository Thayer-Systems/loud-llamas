import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PackagesContent from "./PackagesContent";

export const metadata = {
  title: "Packages | Loud Llamas",
  description: "Six marketing channels plus Burnrate. Three tiers each. One-time price. Full setup in 5 to 7 days.",
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
