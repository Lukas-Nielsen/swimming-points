import { Alert, Center, Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useFormContext } from "./useMainForm";

export const HeaderSection = () => {
	const { t } = useTranslation();
	const form = useFormContext();

	return (
		<Center>
			<Stack m={16}>
				<Stack
					style={{ position: "sticky", zIndex: 100 }}
					top="1rem"
					py="md"
					bg="var(--mantine-color-body)"
					w="100%"
				>
					<Title order={6}>
						{form.getValues().isPoints ? t("points") : t("time")}
					</Title>
					<Title order={1}>
						{form.getValues().result ?? t("noData")}
					</Title>
				</Stack>

				{form.getValues().error && (
					<Alert variant="light" color="indigo" title={t("info")}>
						{form.getValues().error}
					</Alert>
				)}
			</Stack>
		</Center>
	);
};
