import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import { useDocumentTitle } from "@mantine/hooks";
import { createRoot } from "react-dom/client";
import { useTranslation } from "react-i18next";

import { Footer } from "./Footer";
import { Main } from "./Main";
import "./i18n";

const App = () => {
	const { t } = useTranslation();

	useDocumentTitle(t("title"));
	return (
		<MantineProvider defaultColorScheme="auto">
			<Main />
			<Footer />
		</MantineProvider>
	);
};

const element = document.querySelector("#root");
if (element) {
	const root = createRoot(element);
	root.render(<App />);
}
