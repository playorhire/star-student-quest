import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Friendly inline error UI for failed data loads. Used as a fallback
 * in route components when a fetch fails.
 */
export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center ${className}`}
      role="alert"
    >
      <AlertCircle className="h-8 w-8 text-destructive" />
      <div>
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="rounded-full font-bold"
        >
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}

/** Empty state with optional CTA — distinct from errors. */
export function EmptyState({
  emoji = "📭",
  title,
  message,
}: {
  emoji?: string;
  title: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
      <div className="text-3xl">{emoji}</div>
      <h3 className="font-bold text-foreground">{title}</h3>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}