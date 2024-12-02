import { useEffect, useState } from "react";
import type { IBaseTime, ICourse, IGender } from "./model";
import { useDisclosure } from "@mantine/hooks";
import { AGES, STROKES } from "./const";
import baseTimesTemp from "./baseTimes.json";
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
import { IMaskInput } from "react-imask";

const baseTimes = baseTimesTemp as unknown as IBaseTime;

export const Main = () => {
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
	const [result, setResult] = useState("keine Daten");
	const [error, setError] = useState("");

	useEffect(() => {
		if (inputPoint.length !== 0 && inputTime.indexOf("_") === -1) {
			setError("");
			let tempAge = "all";
			if (pointSource === "master") {
				tempAge = age;
			}

			if (!baseTimes[pointSource][year]) {
				setError(
					"bitte wähle ein anderes Jahr oder eine andere Tabelle",
				);
			} else if (!baseTimes[pointSource][year][course]) {
				setError("bitte wähle eine andere Bahnlänge");
			} else if (!baseTimes[pointSource][year][course][stroke]) {
				setError("bitte wähle eine andere Strecke");
			} else if (!baseTimes[pointSource][year][course][stroke][tempAge]) {
				setError(
					"keine Daten für diese Strecke, hierfür gibt es dann 1250 Punkte",
				);
			} else if (
				!baseTimes[pointSource][year][course][stroke][tempAge][gender]
			) {
				setError("bitte wähle eine anderes Geschlecht");
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
						setResult("keine Daten");
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
						setResult("keine Daten");
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
					<Stack>
						<Title order={6}>{isPoints ? "Punkte" : "Zeit"}</Title>
						<Title order={1}>{result}</Title>
					</Stack>
					{error.length > 0 && (
						<Alert variant="light" color="indigo" title="Info">
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
								label: "männlich",
								value: "m",
							},
							{
								label: "weiblich",
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
								label: e.label,
							};
						})}
						searchable
						checkIconPosition="right"
					/>
					<Group wrap="nowrap">
						<Button onClick={toggleIsPoints} w={100} color="indigo">
							{isPoints ? "Zeit:" : "Punkte:"}
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
								label: e.label,
								value: e.value,
							};
						})}
						checkIconPosition="right"
					/>
				</Stack>
			</Center>
		</>
	);
};
