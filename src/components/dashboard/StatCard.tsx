// src/components/dashboard/StatCard.tsx
interface StatCardProps {
  label: string;
  value: string;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-slate opacity-70 mb-1">
        {label}
      </div>
      <div className="text-lg font-bold text-foreground">{value}</div>
    </div>
  );
}
