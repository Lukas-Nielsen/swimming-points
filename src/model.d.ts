export interface IBaseTime {
	wa: { [key: string]: ICourse };
	master: { [key: string]: ICourse };
}

export interface ICourse {
	scm: { [key: string]: { [key: string]: IGender } };
	lcm: { [key: string]: { [key: string]: IGender } };
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
