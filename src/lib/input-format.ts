export { formatCpf, isValidCpf } from "./cpf";

export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function formatCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, "$1-$2");
}

export function formatBirthDate(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
}

export function birthDateToIso(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return value.trim();
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

export function birthDateFromIso(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  return formatBirthDate(value);
}

export function formatPlaca(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 7).toUpperCase();
}
