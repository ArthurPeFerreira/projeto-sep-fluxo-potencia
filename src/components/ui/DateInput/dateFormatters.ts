export function formatDateToBrazilian(dateString: string): string {
  if (!dateString) return "";

  const parts = dateString.split("-");
  if (parts.length !== 3) return "";

  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  return `${day}/${month}/${year}`;
}

export function formatDateToISO(dateString: string): string {
  if (!dateString) return "";

  const cleanDate = dateString.replace(/\D/g, "");

  if (cleanDate.length !== 8) return "";

  const day = cleanDate.substring(0, 2);
  const month = cleanDate.substring(2, 4);
  const year = cleanDate.substring(4, 8);

  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  if (
    dayNum < 1 ||
    dayNum > 31 ||
    monthNum < 1 ||
    monthNum > 12 ||
    yearNum < 1900
  ) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

export function formatDateInput(value: string): string {
  const numbers = value.replace(/\D/g, "");

  const limitedNumbers = numbers.slice(0, 8);

  if (limitedNumbers.length >= 5) {
    return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(
      2,
      4
    )}/${limitedNumbers.slice(4)}`;
  } else if (limitedNumbers.length >= 3) {
    return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(2)}`;
  } else if (limitedNumbers.length >= 1) {
    return limitedNumbers;
  }

  return "";
}

export function validateDateInput(value: string): {
  isValid: boolean;
  error?: string;
} {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length === 0) {
    return { isValid: true };
  }

  if (numbers.length >= 2) {
    const day = parseInt(numbers.slice(0, 2));
    if (day < 1 || day > 31) {
      return { isValid: false, error: "Dia inválido." };
    }
  }

  if (numbers.length >= 4) {
    const month = parseInt(numbers.slice(2, 4));
    if (month < 1 || month > 12) {
      return { isValid: false, error: "Mês inválido." };
    }
  }

  if (numbers.length >= 8) {
    const year = parseInt(numbers.slice(4, 8));
    if (year < 1900 || year > 2100) {
      return { isValid: false, error: "Ano inválido." };
    }

    const day = parseInt(numbers.slice(0, 2));
    const month = parseInt(numbers.slice(2, 4));
    const date = new Date(year, month - 1, day);

    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year
    ) {
      return { isValid: false, error: "Data inválida." };
    }
  }

  return { isValid: true };
}

export function createDateFromISO(isoString: string): Date {
  if (!isoString) return new Date();

  const parts = isoString.split("-");
  if (parts.length !== 3) return new Date();

  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const day = parseInt(parts[2]);

  return new Date(year, month, day);
}
