import items from "../constants/fetchur_items.js";

export function getFetchur() {
  const today = new Date();
  today.setHours(today.getHours() - 6);
  const day = today.getDate();
  // @ts-ignore
  const item = day <= 12 ? items[day] : items[day % 12];
  return item;
}
