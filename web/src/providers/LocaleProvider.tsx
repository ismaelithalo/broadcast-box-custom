import React, { useEffect, useMemo, useState } from "react";
import { localeInterface } from "../locale/localeInterface";
import locale_en from "../locale/en";
import locale_da from "../locale/da";
import locale_pt_br from "../locale/pt-BR";
import { useTheme } from "./ThemeProvider";

interface LocaleProviderProps {
	children: React.ReactNode;
}

interface LocaleProviderContextProps {
	locale: localeInterface;
	localeCode: string;
	setLocale: (locale: LocaleType) => void;
}

export const LocaleContext = React.createContext<LocaleProviderContextProps>({
	locale: locale_pt_br,
	localeCode: "pt-BR",
	setLocale: () => { }
});

export function LocaleProvider(props: LocaleProviderProps) {
	const { theme } = useTheme();
	const defaultLanguage = theme.defaultLocale || "pt-BR";

	const [activeLocaleCode, setActiveLocaleCode] = useState<string>(() => {
		return localStorage.getItem("locale") || defaultLanguage;
	});

	// Quando o admin altera o idioma padrão do sistema, atualiza visitantes que não têm escolha salva
	useEffect(() => {
		const userCustomChoice = localStorage.getItem("locale");
		if (!userCustomChoice && theme.defaultLocale) {
			setActiveLocaleCode(theme.defaultLocale);
		}
	}, [theme.defaultLocale]);

	const currentLocale = useMemo(() => {
		return getLocaleInterfaceByLocale(activeLocaleCode);
	}, [activeLocaleCode]);

	const state = useMemo<LocaleProviderContextProps>(() => ({
		locale: currentLocale,
		localeCode: activeLocaleCode,
		setLocale: (selected: LocaleType) => {
			localStorage.setItem("locale", selected.locale);
			setActiveLocaleCode(selected.locale);
		}
	}), [currentLocale, activeLocaleCode]);

	return (
		<LocaleContext.Provider value={state}>
			{props.children}
		</LocaleContext.Provider>
	);
}

export type LocaleType = {
	locale: string,
	name: string
}

export const LocaleTypes: LocaleType[] = [
	{
		locale: "pt-BR",
		name: "Português (Brasil)"
	},
	{
		locale: "en",
		name: "English"
	},
	{
		locale: "dk",
		name: "Dansk"
	},
]

export const getLocaleInterfaceByLocale = (locale: string): localeInterface => {
	switch (locale) {
		case "pt-BR":
		case "pt":
		case "pt_BR":
			return locale_pt_br;

		case "en":
			return locale_en;

		case "dk":
		case "da":
			return locale_da;

		default:
			return locale_pt_br;
	}
}
