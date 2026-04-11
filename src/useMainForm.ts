import { createFormContext } from "@mantine/form";

import type { IForm } from "./model";

export const [FormProvider, useFormContext, useForm] = createFormContext<IForm>();

export const useMainForm = (currentYear: number) => {
	return useForm({
		mode: "controlled",
		initialValues: {
			pointSource: "wa",
			course: "scm",
			stroke: "50F",
			year: currentYear.toString(),
			age: "20",
			gender: "m",
			isPoints: false,
			inputTime: "",
			inputPoint: 0,
		},
	});
};
