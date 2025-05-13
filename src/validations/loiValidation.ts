import { body } from "express-validator/lib/middlewares/validation-chain-builders";

export const loiValidation = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isString()
    .withMessage("Full name must be a string"),

  body("company")
    .notEmpty()
    .withMessage("Company name is required")
    .isString()
    .withMessage("Company name must be a string"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("country")
    .notEmpty()
    .withMessage("Country is required")
    .isString()
    .withMessage("Country must be a string"),

  body("sector")
    .notEmpty()
    .withMessage("Sector is required")
    .isString()
    .withMessage("Sector must be a string"),

  body("comments")
    .optional()
    .isString()
    .withMessage("Comments must be a string"),

  body("signature")
    .notEmpty()
    .withMessage("Signature is required")
    .isString()
    .withMessage("Signature must be a string")
    .custom((value) => {
      // Validate that it's a base64 image
      if (!value.startsWith("data:image/png;base64,")) {
        throw new Error("Signature must be a base64 encoded PNG image");
      }
      return true;
    }),
];
