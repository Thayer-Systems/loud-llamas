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
  const taken = Math.min(Math.max(count, 0), total);
  const pct = Math.min((taken / total) * 100, 100);
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
  const subTextColor = isDark ? "text-gray-300" : "text-[#6B7280]";
  const dimTextColor = isDark ? "text-gray-400" : "text-[#6B7280]";

  return (
    <div className={`rounded-2xl ${containerColor} ${sizing.pad}`}>
      <div className="flex items-baseline justify-between mb-2">
        <p className={`font-bold uppercase tracking-widest text-[#2563EB] ${sizing.label}`}>
          Founder spots
        </p>
        <p className={`${sizing.label} font-semibold ${dimTextColor}`}>
          Filling fast
        </p>
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <p className={`font-black text-[#2563EB] ${sizing.num}`}>
          {taken}
        </p>
        <p className={`text-sm font-semibold ${subTextColor}`}>
          / {total} spots taken
        </p>
      </div>
      <div className={`w-full rounded-full overflow-hidden ${trackColor} ${sizing.track}`}>
        <div
          className="bg-[#2563EB] h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
