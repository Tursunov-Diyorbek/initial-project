import i18n from "i18next";

export const t = (key: string): string => {
  if (!key) return "";
  const result = i18n.t(key);
  return typeof result === "string" ? result : "";
};