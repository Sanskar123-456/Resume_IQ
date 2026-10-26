// Registration validators (kept in sync with client/src/utils/validators.js)

export const GMAIL_REGEX = /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@gmail\.com$/i;

export const isValidGmail = (email) =>
  typeof email === 'string' && GMAIL_REGEX.test(email.trim());

export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'upper', label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'One lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'One number (0-9)', test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'One special character (!@#$%^&*)', test: (p) => /[^A-Za-z0-9\s]/.test(p) },
  { id: 'space', label: 'No spaces', test: (p) => !/\s/.test(p) },
];

export const isStrongPassword = (password) =>
  typeof password === 'string' && PASSWORD_RULES.every((r) => r.test(password));
