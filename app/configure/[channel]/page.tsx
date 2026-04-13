import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ConfigureForm from "./ConfigureForm";

const CHANNEL_NAMES: Record<string, string> = {
  "website-build": "Website Build",
  "email-lifecycle": "Email / Lifecycle",
  "organic-social": "Organic Social",
  "seo-aeo": "SEO / AEO Foundation",
  "paid-social": "Paid Social Playbook",
  "sem-google-ads": "SEM / Google Ads",
  "analytics-tracking": "Analytics & Tracking",
  "automation": "Automation",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ channel: string }>;
}) {
  const { channel } = await params;
  const name = CHANNEL_NAMES[channel] ?? "Configure";
  return {
    title: `${name} — Loud Llamas`,
    description: `Configure your ${name} setup. Pick your tier, answer a few questions, and we build it in 5–7 days.`,
  };
}

export default async function ConfigurePage({
  params,
}: {
  params: Promise<{ channel: string }>;
}) {
  const { channel } = await params;

  return (
    <div className="min-h-screen bg-white text-[#0D0D0D]">
      <Nav />
      <ConfigureForm channel={channel} />
      <Footer />
    </div>
  );
}
