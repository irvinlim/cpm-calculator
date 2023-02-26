// Parse numbers with thousands separator.
export const parseNumber = (value: string): number => {
  return parseInt(value.replaceAll(",", ""));
};

// Format to split thousands with comma.
export const formatNumber = (value: number): string => {
  return value.toLocaleString("en-US");
};

// Format to display a currency.
export const formatCurrency = (value: number): string => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
