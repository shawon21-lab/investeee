const formatNumber = (number: number): string => {
  return number.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
};

export default formatNumber;
