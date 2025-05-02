export function isPasswordStrong(password: string): boolean {
  // Minimum 12 caractères, au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
  return regex.test(password);
}
