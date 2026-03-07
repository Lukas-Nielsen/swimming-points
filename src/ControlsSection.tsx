import {
	Button,
	Group,
	Input,
	NumberInput,
	SegmentedControl,
	Select,
	Stack,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";
import baseTimesTemp from "./baseTimes.json";
import { CalcResult } from "./CalcResult";
import { AGES, STROKES } from "./const";
import { IBaseTime } from "./model";
import { useFormContext } from "./useMainForm";

const baseTimes = baseTimesTemp as unknown as IBaseTime;

export const ControlsSection = () => {
	const { t } = useTranslation();
	const form = useFormContext();
	const currentYear = new Date().getFullYear();

	return (
		<Stack>
			<CalcResult baseTimes={baseTimes} />
			{/* Point source */}
			<SegmentedControl
				color="indigo"
				data={[
					{ label: "World Aquatics", value: "wa" },
					{ label: "Master", value: "master" },
				]}
				key={form.key("pointSource")}
				{...form.getInputProps("pointSource")}
			/>

			{/* Course */}
			<SegmentedControl
				color="indigo"
				data={[
					{ label: "25 m", value: "scm" },
					{ label: "50 m", value: "lcm" },
				]}
				key={form.key("course")}
				{...form.getInputProps("course")}
			/>

			{/* Gender */}
			<SegmentedControl
				color="indigo"
				data={[
					{ label: t("male"), value: "m" },
					{ label: t("female"), value: "f" },
				]}
				key={form.key("gender")}
				{...form.getInputProps("gender")}
			/>

			{/* Stroke selector (unchanged logic, just pulling from form) */}
			<Select
				color="indigo"
				data={STROKES.map((e) => ({
					disabled:
						!(
							(form.getValues().course === "scm" && e.scm) ||
							(form.getValues().course === "lcm" && e.lcm)
						) ||
						!(
							(form.getValues().pointSource === "master" &&
								e.master) ||
							form.getValues().pointSource === "wa"
						),
					value: e.value,
					label: `${e.count ? `${e.count}x ` : ""}${e.length}m ${t(e.stroke)}`,
				}))}
				searchable
				checkIconPosition="right"
				key={form.key("stroke")}
				{...form.getInputProps("stroke")}
			/>

			{/* Toggle between time / points + input field */}
			<Group wrap="nowrap">
				<Button
					onClick={() =>
						form.setFieldValue(
							"isPoints",
							!form.getValues().isPoints,
						)
					}
					w={100}
					color="indigo"
				>
					{form.getValues().isPoints
						? `${t("time")}:`
						: `${t("points")}:`}
				</Button>

				{form.getValues().isPoints ? (
					<Input
						component={IMaskInput}
						mask="00:00,00"
						placeholder="00:22,48"
						key={form.key("inputTime")}
						{...form.getInputProps("inputTime")}
					/>
				) : (
					<NumberInput
						placeholder="786"
						allowDecimal={false}
						allowNegative={false}
						key={form.key("inputPoint")}
						{...form.getInputProps("inputPoint")}
					/>
				)}
			</Group>

			{/* Year selector */}
			<Select
				color="indigo"
				data={Array(currentYear - 2017 + 1)
					.fill(null)
					.map((_, i) => i + 2017)
					.reverse()
					.map((e) => {
						return {
							value: e.toString(),
							label: e.toString(),
							disabled:
								!baseTimes[form.getValues().pointSource][
									e.toString()
								],
						};
					})}
				checkIconPosition="right"
				key={form.key("year")}
				{...form.getInputProps("year")}
			/>

			{/* Age selector – disabled for WA */}
			<Select
				color="indigo"
				disabled={form.getValues().pointSource === "wa"}
				data={AGES.map((e) => ({
					label: `${t("ag")} ${e}`,
					value: e.toString(),
				}))}
				checkIconPosition="right"
				key={form.key("age")}
				{...form.getInputProps("age")}
			/>
		</Stack>
	);
};
