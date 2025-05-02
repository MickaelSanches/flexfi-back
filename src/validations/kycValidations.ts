import { body } from 'express-validator';

export const kycWebhookValidation = [
  body('reference')
    .notEmpty().withMessage('Provider reference is required')
    .isString().withMessage('Provider reference must be a string'),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isString().withMessage('Status must be a string')
    .isIn(['approved', 'rejected']).withMessage('Status must be either approved or rejected'),
  
  body('verification_data')
    .optional()
    .isObject().withMessage('Verification data must be an object')
];

export const submitKYCValidation = [
  body('firstName')
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string'),
  
  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string'),
  
  body('dateOfBirth')
    .notEmpty().withMessage('Date of birth is required')
    .isString().withMessage('Date of birth must be a string'),
  
  body('address')
    .notEmpty().withMessage('Address is required')
    .isObject().withMessage('Address must be an object'),
  
  body('documentType')
    .notEmpty().withMessage('Document type is required')
    .isString().withMessage('Document type must be a string'),
  
  body('documentImage')
    .notEmpty().withMessage('Document image is required')
    .isString().withMessage('Document image must be a string')
]; 