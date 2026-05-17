export const ADMIN_EMAILS = [
  'computercorner@gmail.com',
  'sabujdas5757@gmail.com'
];

export function checkIfAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === email.toLowerCase());
}
