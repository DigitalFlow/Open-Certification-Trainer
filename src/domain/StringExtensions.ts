export const escapeSpecialCharacters = (text: string) => {
  if (!text) {
    return "";
  }

  return text.replace(/'/g, "''");
};
