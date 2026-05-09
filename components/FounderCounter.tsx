type FounderCounterProps = {
  count?: number;
  total?: number;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
};

export default function FounderCounter({
  count = 0,
  total = 100,
  variant = "dark",
  size = "md",
}: FounderCounterProps) {
  const remaining = Math.max(total - count, 0);
  const pct = Math.min((count / total) * 100, 100);
  const isDark = variant === "dark";

  const sizing = {
    sm: { num: "text-2xl", label: "text-[10px]", track: "h-1.5", pad: "p-4" },
    md: { num: "text-3xl", label: "text-xs", track: "h-2", pad: "p-5" },
    lg: { num: "text-5xl", label: "text-xs", track: "h-2.5", pad: "p-6" },
  }[size];

  const containerColor = isDark
    ? "bg-black border border-[#1F2937] text-white"
    : "bg-white border-2 border-[#2563EB] text-[#000000]";
  const trackColor = isDark ? "bg-[#1F2937]" : "bg-[#E5E7EB]";

  return (
    <div className={`rounded-2xl ${containerColor} ${sizing.pad}`}>
      <div className="flex items-baseline justify-between mb-2">
        <p className={`font-bold uppercase tracking-widest ${sizing.label} ${isDark ? "text-[#2563EB]" : "text-[#2563EB]"}`}>
          Founder spots
        </p>
        <p className={`${sizing.label} font-semibold ${isDark ? "text-gray-400" : "text-[#6B7280]"}`}>
          Locked forever
        </p>
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <p className={`font-black ${sizing.num} text-[#2563EB]`}>
          {remaining}
        </p>
        <p className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-[#6B7280]"}`}>
          / {total} left at $17.99/mo
        </p>
      </div>
      <div className={`w-full rounded-full ${trackColor} ${sizing.track} overflow-hidden`}>
        <div
          className="bg-[#2563EB] h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
