// src/components/dashboard/ContinueCard.tsx
interface ContinueCardProps {
  lessonTitle: string;
  progressPercent: number;
}

export default function ContinueCard({
  lessonTitle,
  progressPercent,
}: ContinueCardProps) {
  return (
    <div className="rounded-2xl bg-ink text-paper p-6 md:p-8">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-action mb-2">
        Continue where you left off
      </div>
      <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-4">
        {lessonTitle}
      </h3>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-brand-action"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="text-xs mt-2 text-paper/60">
        {progressPercent}% complete
      </div>
    </div>
  );
}
