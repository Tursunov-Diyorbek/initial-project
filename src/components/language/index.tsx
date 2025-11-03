import { Button, Dropdown, type MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import i18next from "@/locales/i18n";
import { useState } from "react";

export default function Language() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<string>(i18n.language || "uz");

  const changeLanguage = (lang: string) => {
    i18next.changeLanguage(lang);
    setCurrentLang(lang);
    localStorage.setItem("languageLang", lang);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div
          className={`languageSelects ${currentLang === "uz" ? "active" : ""}`}
          onClick={() => changeLanguage("uz")}>
          O’zbek
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          className={`languageSelects ${currentLang === "kr" ? "active" : ""}`}
          onClick={() => changeLanguage("kr")}>
          Узбек(кирил)
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div
          className={`languageSelects ${currentLang === "ru" ? "active" : ""}`}
          onClick={() => changeLanguage("ru")}>
          Русский
        </div>
      ),
    },
  ];

  const languageIcons: Record<string, React.ReactElement> = {
    uz: <div>O'zbek</div>,
    kr: <div>Узбек(кирил)</div>,
    ru: <div>Русский</div>,
  };

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <Button className="w-30">{languageIcons[i18n.language]}</Button>
    </Dropdown>
  );
}
