import { body } from "express-validator/lib/middlewares/validation-chain-builders";

export const connectWalletValidation = [
  body("publicKey")
    .notEmpty()
    .withMessage("Public key is required")
    .isString()
    .withMessage("Public key must be a string"),
  body("signature")
    .notEmpty()
    .withMessage("Signature is required")
    .isString()
    .withMessage("Signature must be a string"),
  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isString()
    .withMessage("Message must be a string"),
];

export const delegationValidation = [
  body("publicKey")
    .notEmpty()
    .withMessage("Public key is required")
    .isString()
    .withMessage("Public key must be a string"),
  body("tokenAccount")
    .notEmpty()
    .withMessage("Token account is required")
    .isString()
    .withMessage("Token account must be a string"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value: number) => value > 0)
    .withMessage("Amount must be greater than 0"),
];
