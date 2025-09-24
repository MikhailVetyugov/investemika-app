const formatter = new Intl.DateTimeFormat("ru-RU", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export const formatDate = (date: Date) => formatter.format(date);
