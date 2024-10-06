<?php

function parseTime(string $i): float
{
	$callback = 0.0;

	$i = array_reverse(preg_split("/[\.,:]/", $i));

	if (isset($i[0])) {
		$callback += (int) $i[0] / 100;
	}

	if (isset($i[1])) {
		$callback += (int) $i[1];
	}

	if (isset($i[2])) {
		$callback += (int) $i[2] * 60;
	}

	return round($callback, 2);
}


if (sizeof($argv) < 3) {
	echo "Usage ..php {wa|master} {input filename}\n";
	exit(1);
}

$MODE = $argv[1];
$FILE = $argv[2];

if (!file_exists($FILE)) {
	echo "the given file does not exists\n";
	exit(1);
}

$inputData = file_get_contents($FILE);

$inputData = explode("\n", $inputData);

$baseTimes = [];

if (file_exists("./src/baseTimes.json")) {
	$baseTimes = json_decode(file_get_contents("./src/baseTimes.json"), true);
}

foreach ($inputData as $line) {
	$line = explode(";", $line);
	switch ($MODE) {
		case "wa":
			if (sizeof($line) >= 8) {

				$stroke = $line[4];

				if ($line[3] === "4") {
					$stroke = "4x $stroke";
				}

				$stroke .= match ($line[5]) {
					"FREE" => "F",
					"FLY" => "S",
					"BREAST" => "B",
					"BACK" => "R",
					"MEDLEY" => "L",
				};

				$year = $line[0];
				$course = strtolower($line[1]);
				$age = "all";
				$gender = strtolower($line[2]);

				$baseTimes[$MODE][$year][$course][$stroke][$age][$gender] = parseTime($line[6]);
			}
			break;
		case "master":
			if (sizeof($line) >= 6) {

				$year = $line[4];
				$course = strtolower($line[5]);
				$age = $line[1];
				$stroke = $line[0];

				$baseTimes[$MODE][$year][$course][$stroke][$age]["m"] = parseTime($line[2]);
				$baseTimes[$MODE][$year][$course][$stroke][$age]["f"] = parseTime($line[3]);
			}
			break;
	}
}

if (isset($baseTimes["wa"])) {
	ksort($baseTimes["wa"]);
}
if (isset($baseTimes["master"])) {
	ksort($baseTimes["master"]);
}


file_put_contents("./src/baseTimes.json", json_encode($baseTimes, JSON_PRETTY_PRINT));