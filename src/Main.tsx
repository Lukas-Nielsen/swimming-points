import {
	Alert,
	Button,
	Center,
	Group,
	Input,
	SegmentedControl,
	Select,
	Stack,
	Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";
import baseTimesTemp from "./baseTimes.json";
import { AGES, STROKES } from "./const";
import type { IBaseTime, ICourse, IGender } from "./model";

const baseTimes = baseTimesTemp as unknown as IBaseTime;

export const Main = () => {
	const { t } = useTranslation();
	const currentYear = new Date().getFullYear();

	const [pointSource, setPointSource] = useState<keyof IBaseTime>("wa");
	const [course, setCourse] = useState<keyof ICourse>("scm");
	const [stroke, setStroke] = useState("50F");
	const [year, setYear] = useState(currentYear.toString());
	const [age, setAge] = useState("20");
	const [gender, setGender] = useState<keyof IGender>("m");
	const [isPoints, { toggle: toggleIsPoints }] = useDisclosure();
	const [inputTime, setInputTime] = useState("");
	const [inputPoint, setInputPoint] = useState("0");
	const [result, setResult] = useState(t("noData"));
	const [error, setError] = useState("");

	useEffect(() => {
		if (inputPoint.length !== 0 && inputTime.indexOf("_") === -1) {
			setError("");
			let tempAge = "all";
			if (pointSource === "master") {
				tempAge = age;
			}

			if (!baseTimes[pointSource][year]) {
				setError(t("selectOther"));
			} else if (!baseTimes[pointSource][year][course]) {
				setError(t("selectOtherCourse"));
			} else if (!baseTimes[pointSource][year][course][stroke]) {
				setError(t("selectOtherStroke"));
			} else if (!baseTimes[pointSource][year][course][stroke][tempAge]) {
				setError(t("noDataMaster"));
			} else if (
				!baseTimes[pointSource][year][course][stroke][tempAge][gender]
			) {
				setError(t("selectOtherGender"));
			} else {
				if (isPoints) {
					const tempTimeArray = inputTime
						.split(/[:,]/)
						.map((entry) => {
							return parseInt(entry);
						});

					const tempTime =
						tempTimeArray[0] * 60 +
						tempTimeArray[1] +
						tempTimeArray[2] / 100;

					const tempResult = Math.floor(
						1000 *
							((baseTimes[pointSource][year][course][stroke][
								tempAge
							][gender] || 0) /
								tempTime) **
								3,
					);

					if (Number.isNaN(tempResult)) {
						setResult(t("noData"));
					} else if (pointSource === "master" && tempResult > 1250) {
						setResult("1250");
					} else {
						setResult(tempResult.toString());
					}
				} else {
					const tempPoint = parseInt(inputPoint);
					const tempTime =
						(baseTimes[pointSource][year][course][stroke][tempAge][
							gender
						] || 0) /
						(tempPoint / 1000) ** (1 / 3);
					if (tempTime === Infinity) {
						setResult(t("noData"));
					} else {
						const tempResult =
							Math.floor(tempTime / 60)
								.toString()
								.padStart(2, "0") +
							":" +
							(tempTime % 60)
								.toFixed(2)
								.replace(".", ",")
								.padStart(5, "0");
						setResult(tempResult.toString());
					}
				}
			}
		}
	}, [
		pointSource,
		course,
		stroke,
		age,
		inputTime,
		inputPoint,
		year,
		isPoints,
		gender,
	]);

	useEffect(() => {
		if (!baseTimes[pointSource][year]) {
			for (let i = currentYear; i > 0; i--) {
				if (baseTimes[pointSource][i.toString()]) {
					setYear(i.toString());
					break;
				}
			}
		}
	}, [pointSource, year, currentYear]);

	return (
		<>
			<Center>
				<Stack m={16}>
					<Stack
						style={{ position: "sticky", zIndex: "100" }}
						top="1rem"
						py="md"
						bg="var(--mantine-color-body)"
						w="100%"
					>
						<Title order={6}>
							{isPoints ? t("points") : t("time")}
						</Title>
						<Title order={1}>{result}</Title>
					</Stack>
					{error.length > 0 && (
						<Alert variant="light" color="indigo" title={t("info")}>
							{error}
						</Alert>
					)}
					<SegmentedControl
						color="indigo"
						value={pointSource}
						onChange={(e) => setPointSource(e as keyof IBaseTime)}
						data={[
							{
								label: "World Aquatics",
								value: "wa",
							},
							{
								label: "Master",
								value: "master",
							},
						]}
					/>
					<SegmentedControl
						color="indigo"
						value={course}
						onChange={(e) => setCourse(e as keyof ICourse)}
						data={[
							{
								label: "25 m",
								value: "scm",
							},
							{
								label: "50 m",
								value: "lcm",
							},
						]}
					/>
					<SegmentedControl
						color="indigo"
						value={gender}
						onChange={(e) => setGender(e as keyof IGender)}
						data={[
							{
								label: t("male"),
								value: "m",
							},
							{
								label: t("female"),
								value: "f",
							},
						]}
					/>
					<Select
						color="indigo"
						onChange={(e) => setStroke(e || "50F")}
						value={stroke}
						data={STROKES.map((e) => {
							return {
								disabled:
									!(
										(course === "scm" && e.scm) ||
										(course === "lcm" && e.lcm)
									) ||
									!(
										(pointSource === "master" &&
											e.master) ||
										pointSource === "wa"
									),
								value: e.value,
								label: `${e.count ? `${e.count}x ` : ""}${e.length}m ${t(e.stroke)}`,
							};
						})}
						searchable
						checkIconPosition="right"
					/>
					<Group wrap="nowrap">
						<Button onClick={toggleIsPoints} w={100} color="indigo">
							{isPoints ? `${t("time")}:` : `${t("points")}:`}
						</Button>
						{isPoints && (
							<Input
								component={IMaskInput}
								mask="00:00,00"
								placeholder="00:22,48"
								value={inputTime}
								onComplete={setInputTime}
							/>
						)}
						{!isPoints && (
							<Input
								onClick={(e) => e.currentTarget.select()}
								placeholder="786"
								defaultValue={inputPoint}
								onChange={(e) =>
									setInputPoint(e.currentTarget.value)
								}
								type="number"
							/>
						)}
					</Group>
					<Select
						color="indigo"
						onChange={(e) => setYear(e || currentYear.toString())}
						value={year}
						data={Array(currentYear - 2017 + 1)
							.fill(null)
							.map((_, i) => i + 2017)
							.reverse()
							.map((e) => {
								return {
									value: e.toString(),
									label: e.toString(),
									disabled:
										!baseTimes[pointSource][e.toString()],
								};
							})}
						checkIconPosition="right"
					/>
					<Select
						color="indigo"
						onChange={(e) => setAge(e || "20")}
						value={age}
						disabled={pointSource === "wa"}
						data={AGES.map((e) => {
							return {
								label: `${t("ag")} ${e}`,
								value: e.toString(),
							};
						})}
						checkIconPosition="right"
					/>
				</Stack>
			</Center>
		</>
	);
};
