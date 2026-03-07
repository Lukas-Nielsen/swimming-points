// convert-easywk-to-json.go
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// parseTime converts a time string like "1:23.45" into a float rounded to 2 decimals.
func parseTime(i string) float64 {
	// split on . , :
	split := strings.FieldsFunc(i, func(r rune) bool {
		return r == '.' || r == ',' || r == ':'
	})
	// reverse slice
	for l, r := 0, len(split)-1; l < r; l, r = l+1, r-1 {
		split[l], split[r] = split[r], split[l]
	}

	var callback float64

	if len(split) > 0 && split[0] != "" {
		if v, err := strconv.Atoi(split[0]); err == nil {
			callback += float64(v) / 100
		}
	}
	if len(split) > 1 && split[1] != "" {
		if v, err := strconv.Atoi(split[1]); err == nil {
			callback += float64(v)
		}
	}
	if len(split) > 2 && split[2] != "" {
		if v, err := strconv.Atoi(split[2]); err == nil {
			callback += float64(v) * 60
		}
	}
	// round to 2 decimals
	return float64(int(callback*100+0.5)) / 100
}

// ensureMap creates a nested map if it does not exist and returns it.
func ensureMap(m map[string]any, key string) map[string]any {
	if v, ok := m[key]; ok {
		if vm, ok2 := v.(map[string]any); ok2 {
			return vm
		}
	}
	newMap := make(map[string]any)
	m[key] = newMap
	return newMap
}

func main() {
	if len(os.Args) < 3 {
		fmt.Println("Usage: go run convert-easywk-to-json.go {wa|master} {input filename}")
		os.Exit(1)
	}

	mode := os.Args[1]
	file := os.Args[2]

	if _, err := os.Stat(file); os.IsNotExist(err) {
		fmt.Println("the given file does not exist")
		os.Exit(1)
	}

	// read input file
	data, err := os.ReadFile(file)
	if err != nil {
		fmt.Printf("error reading file: %v\n", err)
		os.Exit(1)
	}
	lines := strings.Split(string(data), "\n")

	// load existing baseTimes if present
	baseTimes := make(map[string]any)
	basePath := filepath.Join(".", "src", "baseTimes.json")
	if _, err := os.Stat(basePath); err == nil {
		if b, err := os.ReadFile(basePath); err == nil {
			_ = json.Unmarshal(b, &baseTimes) // ignore error, start empty on failure
		}
	}

	for _, line := range lines {
		if line == "" {
			continue
		}
		cols := strings.Split(line, ";")
		switch mode {
		case "wa":
			if len(cols) >= 8 {
				stroke := cols[4]
				if cols[3] == "4" {
					stroke = "4x " + stroke
				}
				switch cols[5] {
				case "FREE":
					stroke += "F"
				case "FLY":
					stroke += "S"
				case "BREAST":
					stroke += "B"
				case "BACK":
					stroke += "R"
				case "MEDLEY":
					stroke += "L"
				}
				year := cols[0]
				course := strings.ToLower(cols[1])
				age := "all"
				gender := strings.ToLower(cols[2])

				// navigate/create nested maps
				mMode := ensureMap(baseTimes, mode)
				mYear := ensureMap(mMode, year)
				mCourse := ensureMap(mYear, course)
				mStroke := ensureMap(mCourse, stroke)
				mAge := ensureMap(mStroke, age)
				mAge[gender] = parseTime(cols[6])
			}
		case "master":
			if len(cols) >= 6 {
				year := cols[4]
				course := strings.ToLower(cols[5])
				age := cols[1]
				stroke := cols[0]

				mMode := ensureMap(baseTimes, mode)
				mYear := ensureMap(mMode, year)
				mCourse := ensureMap(mYear, course)
				mStroke := ensureMap(mCourse, stroke)
				mAge := ensureMap(mStroke, age)

				mAge["m"] = parseTime(cols[2])
				mAge["f"] = parseTime(cols[3])
			}
		}
	}

	// write JSON
	out, err := json.MarshalIndent(baseTimes, "", "\t")
	if err != nil {
		fmt.Printf("error marshaling JSON: %v\n", err)
		os.Exit(1)
	}
	if err := os.WriteFile(basePath, out, 0644); err != nil {
		fmt.Printf("error writing JSON file: %v\n", err)
		os.Exit(1)
	}
}
