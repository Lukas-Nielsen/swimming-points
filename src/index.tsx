import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import { createRoot } from "react-dom/client";
import { Footer } from "./Footer";
import { Main } from "./Main";

import { useDocumentTitle } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
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
