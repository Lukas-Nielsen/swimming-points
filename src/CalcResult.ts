import { t } from "i18next";
import { useEffect } from "react";

import { IBaseTime } from "./model";
import { useFormContext } from "./useMainForm";

interface CalcResultProps {
	baseTimes: IBaseTime;
}

export const CalcResult = ({ baseTimes }: CalcResultProps) => {
	const form = useFormContext();

	useEffect(() => {
		const { pointSource, course, stroke, year, age, gender, isPoints, inputTime, inputPoint } = form.getValues();

		// Guard – same checks as before
		if ((!isPoints && inputPoint === 0) || (isPoints && inputTime.includes("_"))) return;

		// Reset error and result
		form.setFieldValue("error", undefined);
		form.setFieldValue("result", undefined);

		let tempAge = "all";
		if (pointSource === "master") {
			tempAge = age;
		}

		if (!baseTimes[pointSource][year]) {
			form.setFieldValue("error", t("selectOther"));
		} else if (!baseTimes[pointSource][year][course]) {
			form.setFieldValue("error", t("selectOtherCourse"));
		} else if (!baseTimes[pointSource][year][course][stroke]) {
			form.setFieldValue("error", t("selectOtherStroke"));
		} else if (!baseTimes[pointSource][year][course][stroke][tempAge]) {
			form.setFieldValue("error", t("noDataMaster"));
		} else if (!baseTimes[pointSource][year][course][stroke][tempAge][gender]) {
			form.setFieldValue("error", t("selectOtherGender"));
		} else {
			if (isPoints) {
				const tempTimeArray = inputTime.split(/[:,]/).map((entry) => {
					return parseInt(entry);
				});

				const tempTime = tempTimeArray[0] * 60 + tempTimeArray[1] + tempTimeArray[2] / 100;

				const tempResult = Math.floor(1000 * ((baseTimes[pointSource][year][course][stroke][tempAge][gender] || 0) / tempTime) ** 3);

				if (Number.isNaN(tempResult)) {
					form.setFieldValue("result", t("noData"));
				} else if (pointSource === "master" && tempResult > 1250) {
					form.setFieldValue("result", "1250");
				} else {
					form.setFieldValue("result", tempResult.toString());
				}
			} else {
				const tempPoint = inputPoint;
				const tempTime = (baseTimes[pointSource][year][course][stroke][tempAge][gender] || 0) / (tempPoint / 1000) ** (1 / 3);
				if (tempTime === Infinity) {
					form.setFieldValue("result", t("noData"));
				} else {
					const tempResult =
						Math.floor(tempTime / 60)
							.toString()
							.padStart(2, "0") +
						":" +
						(tempTime % 60).toFixed(2).replace(".", ",").padStart(5, "0");
					form.setFieldValue("result", tempResult.toString());
				}
			}
		}
	}, [
		form.getValues().pointSource,
		form.getValues().course,
		form.getValues().stroke,
		form.getValues().age,
		form.getValues().inputTime,
		form.getValues().inputPoint,
		form.getValues().year,
		form.getValues().isPoints,
		form.getValues().gender,
		baseTimes,
	]);

	return null;
};
