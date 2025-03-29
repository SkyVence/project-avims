import { toast } from "../components/ui/use-toast"
import { type ToastProps } from "../components/ui/toast"

interface ErrorOptions extends Partial<ToastProps> {
  defaultMessage?: string;
}

/**
 * Handles errors by displaying them in a toast notification using shadcn/ui toast
 * 
 * @param error - The error object to handle
 * @param options - Configuration options for the error toast
 * 
 * @example
 * ```ts
 * try {
 *   await someOperation();
 * } catch (error) {
 *   handleError(error, { title: "Operation Failed" });
 * }
 * ```
 */
export function handleError(error: unknown, options: ErrorOptions = {}) {
  const {
    title = "Error",
    defaultMessage = "An unexpected error occurred",
    variant = "destructive",
    ...restOptions
  } = options;

  let description = defaultMessage;

  // Handle different error types
  if (error instanceof Error) {
    description = error.message;
  } else if (typeof error === "string") {
    description = error;
  } else if (error && typeof error === "object" && "message" in error) {
    description = String((error as { message: unknown }).message);
  }

  // Show toast notification
  toast({
    title,
    description,
    variant,
    ...restOptions,
  });

  // Log error for debugging
  console.error("Error handled:", error);
}

/**
 * Wraps an async function with error handling
 * 
 * @param fn - The async function to wrap
 * @param options - Configuration options for the error toast
 * @returns A wrapped function that handles errors automatically
 * 
 * @example
 * ```ts
 * const safeOperation = withErrorHandler(
 *   async () => await someOperation(),
 *   { title: "Operation Failed" }
 * );
 * 
 * await safeOperation();
 * ```
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: ErrorOptions = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, options);
      throw error; // Re-throw to allow caller to handle if needed
    }
  };
} 