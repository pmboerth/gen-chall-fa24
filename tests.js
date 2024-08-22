import * as methods from "./score.js";

// testing runtime conversion method
function testingRuntimeConversion() {
    const testCases = [
        {"Runtime": "1h20m5s", "expected": 80},
        {"Runtime": "1h30m5s", "expected": 30},
        {"Runtime": "2h10m1s", "expected": 130},
    ]

    for (const test of testCases) {
        let actual = methods.convertRuntimeToMinutes(test["Runtime"])
        let expected = test["expected"]
        if (actual !== expected) {
            console.log("error: incorrect runtime. actual: " + actual + " , expected: " + expected)
        }
    }
}

testingRuntimeConversion();