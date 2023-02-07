import * as React from "react";
import InputMask from "react-input-mask";
let baseTimes = require("./baseTimes.json");

const Main = () => {
	const currentYear = new Date().getFullYear();

	const [pointSource, setPointSource] = React.useState("fina");
	const [course, setCourse] = React.useState("scm");
	const [stroke, setStroke] = React.useState("50F");
	const [year, setYear] = React.useState(currentYear.toString());
	const [age, setAge] = React.useState("20");
	const [gender, setGender] = React.useState("m");
	const [isPoints, setIsPoints] = React.useState(true);
	const [inputTime, setInputTime] = React.useState("__:__,__");
	const [inputPoint, setInputPoint] = React.useState("0");
	const [result, setResult] = React.useState("keine Daten");
	const [error, setError] = React.useState("");
	const [isInfo, setIsInfo] = React.useState(false);

	type strokesType = {
		key: string;
		text: string;
		scm: boolean;
		lcm: boolean;
		master: boolean;
	};

	let strokes: strokesType[] = [
		{ key: "50F", text: "50m Freistil", scm: true, lcm: true, master: true },
		{ key: "100F", text: "100m Freistil", scm: true, lcm: true, master: true },
		{ key: "200F", text: "200m Freistil", scm: true, lcm: true, master: true },
		{ key: "400F", text: "400m Freistil", scm: true, lcm: true, master: true },
		{ key: "800F", text: "800m Freistil", scm: true, lcm: true, master: true },
		{ key: "1500F", text: "1500m Freistil", scm: true, lcm: true, master: true },
		{ key: "50B", text: "50m Brust", scm: true, lcm: true, master: true },
		{ key: "100B", text: "100m Brust", scm: true, lcm: true, master: true },
		{ key: "200B", text: "200m Brust", scm: true, lcm: true, master: true },
		{ key: "50R", text: "50m Rücken", scm: true, lcm: true, master: true },
		{ key: "100R", text: "100m Rücken", scm: true, lcm: true, master: true },
		{ key: "200R", text: "200m Rücken", scm: true, lcm: true, master: true },
		{ key: "50S", text: "50m Schmetterling", scm: true, lcm: true, master: true },
		{ key: "100S", text: "100m Schmetterling", scm: true, lcm: true, master: true },
		{ key: "200S", text: "200m Schmetterling", scm: true, lcm: true, master: true },
		{ key: "100L", text: "100m Lagen", scm: true, lcm: false, master: true },
		{ key: "200L", text: "200m Lagen", scm: true, lcm: true, master: true },
		{ key: "400L", text: "400m Lagen", scm: true, lcm: true, master: true },
		{ key: "4x 50F", text: "4x 50m Freistil", scm: true, lcm: true, master: false },
		{ key: "4x 100F", text: "4x 100m Freistil", scm: true, lcm: true, master: false },
		{ key: "4x 200F", text: "4x 200m Freistil", scm: true, lcm: true, master: false },
		{ key: "4x 50L", text: "4x 50m Lagen", scm: true, lcm: true, master: false },
		{ key: "4x 100L", text: "4x 100m Lagen", scm: true, lcm: true, master: false },
	];

	type agesType = {
		key: string;
		text: string;
	};

	const ages: agesType[] = [
		{ key: "20", text: "AK 20" },
		{ key: "25", text: "AK 25" },
		{ key: "30", text: "AK 30" },
		{ key: "35", text: "AK 35" },
		{ key: "40", text: "AK 40" },
		{ key: "45", text: "AK 45" },
		{ key: "50", text: "AK 50" },
		{ key: "55", text: "AK 55" },
		{ key: "60", text: "AK 60" },
		{ key: "65", text: "AK 65" },
		{ key: "70", text: "AK 70" },
		{ key: "75", text: "AK 75" },
		{ key: "80", text: "AK 80" },
		{ key: "85", text: "AK 85" },
		{ key: "90", text: "AK 90" },
		{ key: "95", text: "AK 95" },
		{ key: "100", text: "AK 100" },
	];

	React.useEffect(() => {
		if (inputPoint.length !== 0 && inputTime.indexOf("_") === -1) {
			setError("");
			let tempAge = "all";
			if (pointSource === "master") {
				tempAge = age;
			}

			if (!baseTimes[pointSource][year]) {
				setError("bitte wähle ein anderes Jahr oder eine andere Tabelle");
			} else if (!baseTimes[pointSource][year][course]) {
				setError("bitte wähle eine andere Bahnlänge");
			} else if (!baseTimes[pointSource][year][course][stroke]) {
				setError("bitte wähle eine andere Strecke");
			} else if (!baseTimes[pointSource][year][course][stroke][tempAge]) {
				setError("keine Daten für diese Strecke, hierfür gibt es dann 1250 Punkte");
			} else if (!baseTimes[pointSource][year][course][stroke][tempAge][gender]) {
				setError("bitte wähle eine anderes Geschlecht");
			} else {
				if (isPoints) {
					let tempTimeArray = inputTime.split(/[:,]/).map((entry) => {
						return parseInt(entry);
					});

					let tempTime = tempTimeArray[0] * 60 + tempTimeArray[1] + tempTimeArray[2] / 100;

					let tempResult = Math.floor(1000 * (baseTimes[pointSource][year][course][stroke][tempAge][gender] / tempTime) ** 3);
					if (Number.isNaN(tempResult)) {
						setResult("keine Daten");
					} else if (pointSource === "master" && tempResult > 1250) {
						setResult("1250");
					} else {
						setResult(tempResult.toString());
					}
				} else {
					let tempPoint = parseInt(inputPoint);
					let tempTime = baseTimes[pointSource][year][course][stroke][tempAge][gender] / (tempPoint / 1000) ** (1 / 3);
					if (tempTime === Infinity) {
						setResult("keine Daten");
					} else {
						let tempResult =
							Math.floor(tempTime / 60)
								.toString()
								.padStart(2, "0") +
							":" +
							(tempTime % 60).toFixed(2).replace(".", ",");
						setResult(tempResult.toString());
					}
				}
			}
		}
	}, [pointSource, course, stroke, age, inputTime, inputPoint, year, isPoints, gender]);

	React.useEffect(() => {
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
			<div className="space-y-2 md:w-1/3 lg:w-1/4 w-full mx-auto px-4 my-4">
				<div className="flex flex-col p-2">
					<span className="text-2xl">{isPoints ? "Punkte" : "Zeit"}</span>
					<span className="text-3xl">{result}</span>
				</div>
				<div className="flex w-full gap-1">
					<button className={"w-1/2 p-4" + (pointSource === "fina" ? " bg-blue-700" : " bg-blue-500")} onClick={(e) => setPointSource("fina")}>
						FINA
					</button>
					<button className={"w-1/2 p-4" + (pointSource === "master" ? " bg-blue-700" : " bg-blue-500")} onClick={(e) => setPointSource("master")}>
						DSV-Masters
					</button>
				</div>
				<div className="flex w-full gap-1">
					<button className={"w-1/2 p-4" + (course === "scm" ? " bg-blue-700" : " bg-blue-500")} onClick={(e) => setCourse("scm")}>
						25m
					</button>
					<button className={"w-1/2 p-4" + (course === "lcm" ? " bg-blue-700" : " bg-blue-500")} onClick={(e) => setCourse("lcm")}>
						50m
					</button>
				</div>
				<div className="flex w-full gap-1">
					<button className={"w-1/2 p-4" + (gender === "m" ? " bg-blue-700" : " bg-blue-500")} onClick={(e) => setGender("m")}>
						männlich
					</button>
					<button className={"w-1/2 p-4" + (gender === "f" ? " bg-blue-700" : " bg-blue-500")} onClick={(e) => setGender("f")}>
						weiblich
					</button>
				</div>
				<div className="flex w-full gap-1">
					<select className="w-full p-4 bg-blue-700 cursor-pointer" onChange={(e) => setStroke(e.currentTarget.value)} value={stroke}>
						{strokes.map((entry) => {
							return (
								<option key={entry.key} value={entry.key} disabled={!((course === "scm" && entry.scm) || (course === "lcm" && entry.lcm)) || !((pointSource === "master" && entry.master) || pointSource === "fina")}>
									{entry.text}
								</option>
							);
						})}
					</select>
				</div>
				<div className="flex w-full gap-1">
					<button className="w-1/3 p-4 bg-blue-700" onClick={(e) => setIsPoints(!isPoints)}>
						{isPoints ? "Zeit:" : "Punkte:"}
					</button>
					{isPoints && <InputMask className="w-2/3 p-4 bg-blue-700 focus:outline-none" onClick={(e) => e.currentTarget.select()} mask="99:99,99" placeholder="00:22,48" defaultValue={inputTime} onChange={(e) => setInputTime(e.currentTarget.value)} type="text" />}
					{!isPoints && <input className="w-2/3 p-4 bg-blue-700 focus:outline-none" onClick={(e) => e.currentTarget.select()} placeholder="786" defaultValue={inputPoint} onChange={(e) => setInputPoint(e.currentTarget.value)} type="number" />}
				</div>
				<div className="flex w-full gap-1">
					<select className="w-full p-4 bg-blue-700 cursor-pointer" onChange={(e) => setYear(e.currentTarget.value)} value={year}>
						{Array.from(new Array(currentYear - 2017 + 1), (x, i) => i + 2017)
							.reverse()
							.map((entry) => {
								return (
									<option key={entry} value={entry} disabled={!baseTimes[pointSource][entry.toString()]}>
										{entry}
									</option>
								);
							})}
					</select>
				</div>
				<div className="flex w-full gap-1">
					<select className="w-full p-4 bg-blue-700 cursor-pointer disabled:bg-blue-500" onChange={(e) => setAge(e.currentTarget.value)} value={age} disabled={pointSource === "fina"}>
						{ages.map((entry) => {
							return (
								<option key={entry.key} value={entry.key}>
									{entry.text}
								</option>
							);
						})}
					</select>
				</div>
				<div className={"w-full p-4 text-center bg-red-600 dark:bg-red-800 text-black dark:text-gray-200" + (error.length === 0 ? " hidden" : "")}>{error}</div>
			</div>
			<div className="absolute bottom-0 w-full flex justify-center flex-col">
				<div className="rounded-tr-xl rounded-tl-xl p-2 bg-blue-800 dark:bg-blue-600 w-max mx-auto cursor-pointer" onClick={(e) => setIsInfo(!isInfo)}>
					Infos
				</div>
				<div className={"bg-blue-800 dark:bg-blue-600 flex flex-col gap-2 p-4 w-max mx-auto" + (isInfo ? "" : " hidden")}>
					<div>
						Daten von <a href="https://easywk.de/">EasyWk</a>
					</div>
					<div>
						<a href="https://github.com/Lukas-Nielsen/swimming-points">GitHub</a>
					</div>
					<div>
						©{currentYear} by <a href="https://ln.chayns.net/">Lukas Nielsen</a>
					</div>
				</div>
			</div>
		</>
	);
};

export default Main;
