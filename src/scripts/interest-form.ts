import { inquiryAdapter, validateInterestForm } from "../utils/inquiry-adapter";
import type {
  InterestFormErrors,
  InterestFormField,
  InterestFormStatus,
  InterestFormValues,
} from "../types/inquiry";

const fieldNames: InterestFormField[] = [
  "name",
  "email",
  "phone",
  "workId",
  "consent",
];

function getFormControl(
  form: HTMLFormElement,
  name: InterestFormField | "comment",
): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  const control = form.elements.namedItem(name);

  if (
    !(
      control instanceof HTMLInputElement ||
      control instanceof HTMLSelectElement ||
      control instanceof HTMLTextAreaElement
    )
  ) {
    throw new Error(`Interest form control "${name}" is missing.`);
  }

  return control;
}

function readFormValues(form: HTMLFormElement): InterestFormValues {
  const name = getFormControl(form, "name") as HTMLInputElement;
  const email = getFormControl(form, "email") as HTMLInputElement;
  const phone = getFormControl(form, "phone") as HTMLInputElement;
  const work = getFormControl(form, "workId") as HTMLSelectElement;
  const comment = getFormControl(form, "comment") as HTMLTextAreaElement;
  const consent = getFormControl(form, "consent") as HTMLInputElement;
  const selectedWork = work.selectedOptions[0];

  return {
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    workId: work.value,
    workTitle: selectedWork?.dataset.workTitle ?? selectedWork?.text ?? "",
    comment: comment.value.trim(),
    consent: consent.checked,
  };
}

function clearFieldErrors(form: HTMLFormElement): void {
  fieldNames.forEach((fieldName) => {
    const control = getFormControl(form, fieldName);
    const error = form.querySelector<HTMLElement>(
      `[data-field-error="${fieldName}"]`,
    );

    control.removeAttribute("aria-invalid");

    if (error) {
      error.textContent = "";
      error.hidden = true;
    }
  });
}

function showFieldErrors(
  form: HTMLFormElement,
  errors: InterestFormErrors,
): void {
  clearFieldErrors(form);

  Object.entries(errors).forEach(([fieldName, message]) => {
    const control = getFormControl(form, fieldName as InterestFormField);
    const error = form.querySelector<HTMLElement>(
      `[data-field-error="${fieldName}"]`,
    );

    control.setAttribute("aria-invalid", "true");

    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
  });
}

function setFormStatus(
  form: HTMLFormElement,
  status: InterestFormStatus,
  message = "",
): void {
  const messageElement = form.querySelector<HTMLElement>("[data-form-message]");

  form.dataset.formStatus = status;

  if (!messageElement) {
    return;
  }

  messageElement.dataset.messageTone =
    status === "validation-error"
      ? "error"
      : status === "prepared"
        ? "prepared"
        : "idle";
  messageElement.textContent = message;
  messageElement.hidden = status === "idle";
}

function applyWorkFromUrl(form: HTMLFormElement): void {
  const workId = new URL(window.location.href).searchParams.get("work");

  if (!workId) {
    return;
  }

  const work = getFormControl(form, "workId") as HTMLSelectElement;
  const matchingOption = Array.from(work.options).find(
    (option) => option.value === workId,
  );

  if (!matchingOption) {
    return;
  }

  work.value = workId;

  if (matchingOption.dataset.availability === "sold") {
    const comment = getFormControl(form, "comment") as HTMLTextAreaElement;

    if (!comment.value.trim()) {
      comment.value = "Интересуют похожие работы или произведения этой серии.";
    }
  }
}

function focusFirstInvalidField(
  form: HTMLFormElement,
  errors: InterestFormErrors,
): void {
  const firstField = fieldNames.find((fieldName) => errors[fieldName]);

  if (firstField) {
    getFormControl(form, firstField).focus({ preventScroll: true });
  }
}

function initInterestForm(form: HTMLFormElement): () => void {
  const abortController = new AbortController();
  const { signal } = abortController;

  applyWorkFromUrl(form);
  setFormStatus(form, "idle");

  form.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const values = readFormValues(form);
      const validation = validateInterestForm(values);

      if (!validation.isValid) {
        showFieldErrors(form, validation.errors);
        setFormStatus(
          form,
          "validation-error",
          "Проверьте отмеченные поля. Данные не отправлены.",
        );
        focusFirstInvalidField(form, validation.errors);
        return;
      }

      clearFieldErrors(form);
      const result = await inquiryAdapter.prepare(values);
      setFormStatus(form, result.status, result.message);
    },
    { signal },
  );

  form.addEventListener(
    "input",
    () => {
      if (form.dataset.formStatus !== "idle") {
        clearFieldErrors(form);
        setFormStatus(form, "idle");
      }
    },
    { signal },
  );

  form.addEventListener(
    "reset",
    () => {
      window.requestAnimationFrame(() => {
        clearFieldErrors(form);
        setFormStatus(form, "idle");
      });
    },
    { signal },
  );

  return () => abortController.abort();
}

export function initInterestForms(): () => void {
  const cleanups = Array.from(
    document.querySelectorAll<HTMLFormElement>("[data-interest-form]"),
  ).map(initInterestForm);

  return () => cleanups.forEach((cleanup) => cleanup());
}
