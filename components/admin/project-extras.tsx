"use client";

import {
  addProjectImage,
  saveProjectStep,
  updateProjectImage,
} from "@/app/admin/actions/projects";
import { SubmitButton } from "./buttons";
import { Bilingual } from "./fields";
import { fieldError, FormStatus } from "./form-status";
import { ImageUpload } from "./image-upload";
import { useAdminForm } from "./use-admin-form";

type Localized = { id: string; en: string };

const errorsOf = (state: ReturnType<typeof useAdminForm>["state"]) =>
  state.status === "error" ? (state.fieldErrors ?? {}) : {};

/** Menambah gambar galeri. Isian dikosongkan (key baru) setiap kali berhasil. */
export const AddImageForm = ({ projectId }: { projectId: string }) => {
  const { state, onSubmit, pending } = useAdminForm(addProjectImage);
  const reset = state.status === "success" ? state.nonce : "awal";

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <input type="hidden" name="project_id" value={projectId} />
      <div key={reset} className="flex flex-col gap-4">
        <ImageUpload
          projectId={projectId}
          name="path"
          label="Gambar baru"
          error={fieldError(state, "path")}
        />
        <Bilingual
          name="alt"
          idPrefix="baru-"
          label="Teks alternatif"
          value={{ id: "", en: "" }}
          errors={errorsOf(state)}
          maxLength={200}
          hint="Jelaskan isi gambar untuk pembaca layar."
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton pending={pending} variant="secondary">
          Tambah ke galeri
        </SubmitButton>
        <FormStatus state={state} className="flex-1" />
      </div>
    </form>
  );
};

export const ImageAltForm = ({ id, alt }: { id: string; alt: Localized }) => {
  const { state, onSubmit, pending } = useAdminForm(updateProjectImage);
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <Bilingual
        name="alt"
        idPrefix={`${id}-`}
        label="Teks alternatif"
        value={alt}
        errors={errorsOf(state)}
        maxLength={200}
      />
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton pending={pending} variant="secondary">
          Simpan teks
        </SubmitButton>
        <FormStatus state={state} className="flex-1" />
      </div>
    </form>
  );
};

/** Menambah langkah baru (tanpa step) atau mengubah langkah yang ada. */
export const StepForm = ({
  projectId,
  step,
}: {
  projectId: string;
  step?: { id: string; title: Localized; description: Localized };
}) => {
  const { state, onSubmit, pending } = useAdminForm(saveProjectStep);
  const prefix = step ? `${step.id}-` : "langkah-baru-";
  // Form langkah baru dikosongkan setiap kali berhasil.
  const reset = !step && state.status === "success" ? state.nonce : "awal";

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <input type="hidden" name="project_id" value={projectId} />
      {step ? <input type="hidden" name="id" value={step.id} /> : null}
      <div key={reset} className="flex flex-col gap-3">
        <Bilingual
          name="title"
          idPrefix={prefix}
          label="Judul langkah"
          value={step?.title ?? { id: "", en: "" }}
          errors={errorsOf(state)}
          maxLength={120}
        />
        <Bilingual
          name="description"
          idPrefix={prefix}
          label="Penjelasan"
          value={step?.description ?? { id: "", en: "" }}
          errors={errorsOf(state)}
          multiline
          rows={3}
          maxLength={1000}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton pending={pending} variant="secondary">
          {step ? "Simpan langkah" : "Tambah langkah"}
        </SubmitButton>
        <FormStatus state={state} className="flex-1" />
      </div>
    </form>
  );
};
