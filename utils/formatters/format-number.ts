const formatter = new Intl.NumberFormat("ru-RU");

export const formatNumber = (value: number) => formatter.format(value);
