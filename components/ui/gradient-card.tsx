import { cn } from "@/lib/utils";

export function GradientCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-6 border border-purple-700/60 shadow-glow",
        "bg-gradient-to-br from-slate-900/80 via-slate-900/30 to-slate-900/60",
        className
      )}
    >
      {children}
    </div>
  );
}
