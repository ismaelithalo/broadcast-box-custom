import React, { useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeProvider";

interface HeaderProviderContextProps {
	title: string;
	setTitle: (subTitle: string) => void;
}

export const HeaderContext = React.createContext<HeaderProviderContextProps>({
	title: "Broadcast Box",
	setTitle: () => { },
});

interface HeaderProviderProps {
	children: React.ReactNode;
}

export function HeaderProvider(props: HeaderProviderProps) {
	const { theme } = useContext(ThemeContext);
	const [subTitle, setSubTitle] = useState("");

	const siteName = theme.siteName || "Broadcast Box";

	const currentTitle = useMemo(() => {
		return subTitle !== "" ? `${siteName} - ${subTitle}` : siteName;
	}, [siteName, subTitle]);

	useEffect(() => {
		document.title = currentTitle;
	}, [currentTitle]);

	const state = useMemo<HeaderProviderContextProps>(() => ({
		title: currentTitle,
		setTitle: (value: string) => setSubTitle(value),
	}), [currentTitle]);

	return (
		<HeaderContext.Provider value={state}>
			{props.children}
		</HeaderContext.Provider>
	);
}
