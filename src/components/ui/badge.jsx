import { cn } from "../../lib/utils";

function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        variant === "positive" && "bg-zinc-950 text-white",
        variant === "negative" && "bg-zinc-200 text-zinc-950",
        variant === "default" && "bg-zinc-100 text-zinc-700",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
