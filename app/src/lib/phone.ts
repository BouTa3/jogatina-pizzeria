// Pure formatting helpers shared by the server functions and the site UI.
// Canonical storage form is the 10-digit local number (e.g. "0550760731");
// display and E.164 forms are derived from it so there is one source of truth.

export function formatAlgerianPhone(digits: string): string {
  return `${digits.slice(0, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
}

export function phoneDigitsToE164(digits: string): string {
  return `+213${digits.slice(1)}`;
}
