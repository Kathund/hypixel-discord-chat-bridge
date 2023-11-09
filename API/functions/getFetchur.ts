import { fetcherItems } from '../constants/fetchur_items';

export const getFetchur = () => {
  const today = new Date();
  today.setHours(today.getHours() - 6);
  const day = today.getDate();
  let item;
  if (day <= 12) {
    item = (fetcherItems as any)[day];
  }
  item = (fetcherItems as any)[day % 12];

  return item;
};
