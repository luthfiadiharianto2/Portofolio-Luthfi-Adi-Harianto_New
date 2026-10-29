// Format tanggal untuk admin (zona waktu WIB).
const dateTime = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

export const formatDateTime = (value: string) =>
  dateTime.format(new Date(value));
