import type {
  InquiryAdapter,
  InterestFormValidationResult,
  InterestFormValues,
} from "../types/inquiry";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInterestForm(
  values: InterestFormValues,
): InterestFormValidationResult {
  const errors: InterestFormValidationResult["errors"] = {};

  if (!values.name) {
    errors.name = "Укажите имя.";
  }

  if (!values.email && !values.phone) {
    const contactError = "Укажите email или телефон для связи.";
    errors.email = contactError;
    errors.phone = contactError;
  } else if (values.email && !emailPattern.test(values.email)) {
    errors.email = "Проверьте формат email.";
  }

  if (!values.workId) {
    errors.workId = "Выберите работу для заявки.";
  }

  if (!values.consent) {
    errors.consent = "Подтвердите согласие на обработку персональных данных.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export const frontendOnlyInquiryAdapter: InquiryAdapter = {
  async prepare(values) {
    return {
      status: "prepared",
      message: [
        `Заявка по работе «${values.workTitle}» подготовлена для проверки.`,
        "Данные не отправлены: в технической версии нет backend-подключения.",
      ].join(" "),
      values,
    };
  },
};

export const inquiryAdapter: InquiryAdapter = frontendOnlyInquiryAdapter;
