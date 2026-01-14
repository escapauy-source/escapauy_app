export function isInternationalCard(bin: string): boolean {
  const binPrefix = bin.substring(0, 6);
  const binNum = parseInt(binPrefix);

  const uruguayanRanges = [
    { start: 589657, end: 589657 },
    { start: 542991, end: 542991 },
    { start: 516400, end: 516499 },
    { start: 603522, end: 603522 }
  ];

  for (const range of uruguayanRanges) {
    if (binNum >= range.start && binNum <= range.end) {
      return false;
    }
  }

  return true;
}

export function calculateFiscalBenefit(
  amount: number,
  category: string,
  isForeigner: boolean
): { discountAmount: number; finalPrice: number; label: string } {
  if (!isForeigner) {
    return { discountAmount: 0, finalPrice: amount, label: '' };
  }

  let discountRate = 0;
  let label = '';

  switch (category) {
    case 'accommodation':
      discountRate = 0.22;
      label = 'IVA 0% Alojamiento';
      break;
    case 'gastronomy':
      discountRate = 0.22;
      label = 'IVA 0% Gastronomía';
      break;
    case 'outdoor':
      discountRate = 0.10;
      label = 'Beneficio Actividades';
      break;
    default:
      discountRate = 0;
  }

  const discountAmount = amount * discountRate;
  const finalPrice = amount - discountAmount;

  return { discountAmount, finalPrice, label };
}