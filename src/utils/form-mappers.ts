export const mapToSelectOptions = <T>(
  items: T[],
  getLabel: (item: T) => string,
  getValue: (item: T) => string
) => {
  return items.map((item) => ({
    label: getLabel(item),
    value: getValue(item),
  }));
};
