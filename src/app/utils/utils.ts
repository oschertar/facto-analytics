export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-UK", {
    day: "numeric",
    month: "long",
  }).format(date);
};
