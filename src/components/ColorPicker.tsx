import { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface ColorRowProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorRow({ label, value, onChange }: ColorRowProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex items-center justify-between" ref={ref}>
      <Label className="text-xs text-muted-foreground">{label}</Label>

      <div className="relative ">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-12 h-9 rounded-md border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          style={{ backgroundColor: value }}
          aria-label={`Pick ${label}`}
        />

        {open && (
          <div className="absolute right-12 top-10 z-50 rounded-lg border bg-popover p-3 shadow-xl">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-20 h-20 cursor-pointer rounded border-0 bg-transparent p-0"
              style={{ WebkitAppearance: "none" } as React.CSSProperties}
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">{value.toUpperCase()}</span>
              {/* <input
                type="text"
                value={value}
                onChange={(e) => {
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                    onChange(e.target.value);
                  }
                }}
                className="flex-1 rounded border border-input bg-background px-2 py-1 text-xs font-mono"
                maxLength={7}
              /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
