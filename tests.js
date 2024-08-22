import * as methods from "./score.js";
import { information } from "./index.js"

// testing runtime conversion method
function testingRuntimeConversion() {
    let result = true;
    const testCases = [
        {"Runtime": "1h20m5s", "expected": 80},
        {"Runtime": "1h30m5s", "expected": 90},
        {"Runtime": "2h10m1s", "expected": 130},
    ]

    for (const test of testCases) {
        let actual = methods.convertRuntimeToMinutes(test["Runtime"])
        let expected = test["expected"]
        if (actual !== expected) {
            console.log("error: incorrect runtime. actual: " + actual + " , expected: " + expected)
            result = false;
        }
    }

    return result;
}

// testing calculate movie score test
function testingCalculateMovieScore() {
    let result = true;
    const testCases = [
        {"Movie": information.movies[0], "Person": information.people[0][preferences], "expected": 51},
        // {"Movie": information.movies[1], "Person": information.people[1], "expected": 80},
        // {"Movie": information.movies[2], "Person": information.people[2], "expected": 80},
    ]

    for (const test of testCases) {
        let actual = methods.calculateMovieScore(test["Movie"], test["Person"])
        let expected = test["expected"]
        if (actual !== expected) {
            console.log("error: incorrect score. actual: " + actual + " , expected: " + expected)
            result = false;
        }
    }

    return result;
}

const results = testingRuntimeConversion() && testingCalculateMovieScore();

console.log("All tests are passing: " + results);