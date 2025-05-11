export const formatDateTime = (dateTime: string | null): string => {

  if (!dateTime) {
    return '';
  }

  const date = new Date(dateTime);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const day = date.getDate().toString();
  const monthIndex = date.getMonth();
  const month = monthNames[monthIndex];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0'); // 24 hrs format
  const minutes = date.getMinutes().toString().padStart(2, '0'); // pad with zero

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};
