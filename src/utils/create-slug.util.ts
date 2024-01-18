export const createSlug = (title: string): string => {
  return title
    .trim()
    .toLowerCase()
    .normalize()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};
