/** Amounts are integer paise. */
export function formatInr(paise: number) {
  const rupees = Math.trunc(paise / 100)
  return `₹${rupees.toLocaleString("en-IN")}`
}

export function takePercent(paise: number, percent: number) {
  return Math.trunc((paise * percent) / 100)
}

export function formatDate(iso: string) {
  const date = iso.slice(0, 10)
  const [year, month, day] = date.split("-")
  if (!year || !month || !day) return iso || "—"
  return `${day}/${month}/${year}`
}
