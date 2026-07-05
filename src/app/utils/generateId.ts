export const generateId = (): number =>
  Date.now() + Math.floor(Math.random() * 1000);
