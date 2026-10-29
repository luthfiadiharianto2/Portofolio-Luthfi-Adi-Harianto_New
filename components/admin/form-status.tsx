import { CircleAlert, CircleCheck } from "lucide-react";
import type { AdminFormState } from "@/lib/admin/form-state";
import { cn } from "@/lib/utils";

/** Pesan hasil simpan, diumumkan ke pembaca layar lewat role status/alert. */
export const FormStatus = ({
  state,
  className,
}: {
  state: AdminFormState;
  className?: string;
}) => {
  if (state.status === "idle") return null;
  const success = state.status === "success";
  const Icon = success ? CircleCheck : CircleAlert;
  return (
    <p
      role={success ? "status" : "alert"}
      className={cn(
        "flex items-start gap-2 rounded-control px-4 py-3 text-sm",
        success
          ? "bg-accent-3/10 text-accent-3"
          : "bg-accent-2/10 text-accent-2",
        className,
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      {state.message}
    </p>
  );
};

export const fieldError = (state: AdminFormState, field: string) =>
  state.status === "error" ? state.fieldErrors?.[field] : undefined;
