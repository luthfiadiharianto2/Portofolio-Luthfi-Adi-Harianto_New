"use client";

import { type FormEvent, startTransition, useActionState } from "react";
import { type AdminFormState, IDLE } from "@/lib/admin/form-state";

type Action = (
  previous: AdminFormState,
  formData: FormData,
) => Promise<AdminFormState>;

// Mengirim form lewat onSubmit, bukan prop action: React 19 mengosongkan form setelah
// setiap action selesai, termasuk saat validasi gagal, sehingga isian admin akan hilang.
export const useAdminForm = (action: Action) => {
  const [state, dispatch, pending] = useActionState(action, IDLE);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  };
  return { state, onSubmit, pending };
};
