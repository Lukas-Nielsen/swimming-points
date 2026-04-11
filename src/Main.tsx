import { Center, Stack } from "@mantine/core";

import { ControlsSection } from "./ControlsSection";
import { HeaderSection } from "./HeaderSection";
import { FormProvider, useMainForm } from "./useMainForm";

export const Main = () => {
	const currentYear = new Date().getFullYear();
	const form = useMainForm(currentYear);

	return (
		<FormProvider form={form}>
			<Center>
				<Stack gap="xs">
					<HeaderSection />
					<ControlsSection />
				</Stack>
			</Center>
		</FormProvider>
	);
};
