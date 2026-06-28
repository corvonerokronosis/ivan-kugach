export type InterestFormStatus = "idle" | "validation-error" | "prepared";

export interface InterestFormValues {
  name: string;
  email: string;
  phone: string;
  workId: string;
  workTitle: string;
  comment: string;
  consent: boolean;
}

export type InterestFormField =
  | "name"
  | "email"
  | "phone"
  | "workId"
  | "consent";

export type InterestFormErrors = Partial<Record<InterestFormField, string>>;

export interface InterestFormValidationResult {
  isValid: boolean;
  errors: InterestFormErrors;
}

export interface PreparedInquiry {
  status: "prepared";
  message: string;
  values: InterestFormValues;
}

export interface InquiryAdapter {
  prepare(values: InterestFormValues): Promise<PreparedInquiry>;
}
