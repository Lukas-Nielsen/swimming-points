import { Center, Stack } from "@mantine/core";

import { ControlsSection } from "./ControlsSection";
import { HeaderSection } from "./HeaderSection";
import { FormProvider, useMainForm } from "./useMainForm";

const CURRENT_YEAR = new Date().getFullYear();

export const Main = () => {
	const form = useMainForm(CURRENT_YEAR);

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
