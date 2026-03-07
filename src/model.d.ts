export interface IForm {
	pointSource: keyof IBaseTime;
	course: keyof ICourse;
	stroke: string;
	year: string;
	age: string;
	gender: keyof IGender;
	isPoints: boolean;
	inputTime: string;
	inputPoint: number;
	error?: string;
	result?: string | number;
}

export interface IBaseTime {
	wa: Record<string, ICourse>;
	master: Record<string, ICourse>;
}

export interface ICourse {
	scm: Record<string, Record<string, IGender>>;
	lcm: Record<string, Record<string, IGender>>;
}

export interface IGender {
	m?: number;
	f?: number;
}

export interface IStroke {
	value: string;
	length: number;
	count?: number;
	scm: boolean;
	lcm: boolean;
	master: boolean;
	stroke: string;
}
