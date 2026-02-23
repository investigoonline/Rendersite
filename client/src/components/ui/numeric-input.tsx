import * as React from "react"
import { cn } from "@/lib/utils"

interface NumericInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  allowDecimal?: boolean;
  maxDecimals?: number;
}

const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ className, value, onChange, onFocus, onKeyDown, onPaste, allowDecimal = true, maxDecimals = 2, ...props }, ref) => {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "Tab" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "Home" ||
        e.key === "End" ||
        (e.key === "a" && (e.ctrlKey || e.metaKey)) ||
        (e.key === "c" && (e.ctrlKey || e.metaKey)) ||
        (e.key === "v" && (e.ctrlKey || e.metaKey)) ||
        (e.key === "x" && (e.ctrlKey || e.metaKey))
      ) {
        onKeyDown?.(e);
        return;
      }

      if (e.key === "." && allowDecimal) {
        const currentValue = String(value ?? "");
        if (currentValue.includes(".")) {
          e.preventDefault();
          return;
        }
        onKeyDown?.(e);
        return;
      }

      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        return;
      }
      onKeyDown?.(e);
    };

    const sanitize = (raw: string): string => {
      let sanitized = raw.replace(/[^0-9.]/g, "");

      const parts = sanitized.split(".");
      if (!allowDecimal) {
        sanitized = parts[0];
      } else if (parts.length > 2) {
        sanitized = parts[0] + "." + parts.slice(1).join("");
      }

      if (allowDecimal && sanitized.includes(".")) {
        const [integer, decimal] = sanitized.split(".");
        sanitized = integer + "." + (decimal ? decimal.slice(0, maxDecimals) : "");
      }

      return sanitized;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const sanitized = sanitize(raw);

      Object.defineProperty(e, 'target', {
        writable: true,
        value: { ...e.target, value: sanitized },
      });

      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      const val = String(value ?? "");
      if (val === "0") {
        setTimeout(() => e.target.select(), 0);
      }
      onFocus?.(e);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pasted = e.clipboardData.getData("text");
      if (/[^0-9.]/.test(pasted) || (pasted.split(".").length > 2)) {
        e.preventDefault();
        const sanitized = sanitize(pasted);
        if (sanitized && e.currentTarget) {
          const input = e.currentTarget;
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
          )?.set;
          nativeInputValueSetter?.call(input, sanitized);
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        return;
      }
      onPaste?.(e);
    };

    return (
      <input
        {...props}
        inputMode="decimal"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onPaste={handlePaste}
      />
    )
  }
)
NumericInput.displayName = "NumericInput"

export { NumericInput }
