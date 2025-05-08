import env from "./env";

// ==========================================
// Configuration Brevo
// ==========================================
export const brevoConfig = {
  apiKey: env.BREVO_API_KEY,
  templateSignupId: env.BREVO_TEMPLATE_SIGNUP_ID,
  templateResetPasswordId: env.BREVO_TEMPLATE_RESET_PASSWORD_ID,
};
