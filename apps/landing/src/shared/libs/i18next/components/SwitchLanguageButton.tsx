"use client";
import React from "react";
import { useTranslation } from "react-i18next";

const SwitchLanguageButton = () => {
	const { i18n } = useTranslation();

	function switchLanguage() {
		i18n.changeLanguage(i18n.language === "en" ? "ru" : "en");
	}

	return (
		<button
			className={`flex items-center transition-all duration-300 cursor-pointer border rounded-2xl w-15 p-[2px] ${i18n.language === "en" ? "justify-start rounded-2xl" : "justify-end"} transition-transform`}
			onClick={switchLanguage}
		>
			<div
				className={`${i18n.language === "en" ? "bg-indigo-200 text-black" : "bg-black text-indigo-200"} px-1 transition-all duration-300 rounded-full h-fit border`}
			>
				{i18n.language === "en" ? "en" : "ru"}
			</div>
		</button>
	);
};

export default SwitchLanguageButton;
