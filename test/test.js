const fs = require("fs");
const { expect } = require("chai");
const path = require("path");
const circom_tester = require("circom_tester");
const generator = require("../compiler/gen");
const wasm_tester = circom_tester.wasm;

describe("regex compiler tests", function () {
  [
    [
      ["regex dont care", 2],
      [
        [
          "1 entire match & extract number",
          convertMsg("asdfa DKI: v=12/; d=22; a=//121; d=1; bh=xUq"),
          0,
          (signals) => {
            expect(signals.main.entire_count).to.equal(1n);
            expect(signals.main.group_match_count).to.equal(1n);
            expect(signals.main.start_idx).to.equal(2n);
            const expected_reveal = encodeString("a");
            assert_reveal(signals, expected_reveal);
          },
        ],
      ],
    ],
  ].forEach((regexSuite) => {
    const regex = regexSuite[0][0];
    const group_idx = regexSuite[0][1];
    const tests = regexSuite[1];

    const testCircomFile = `test_regex_compiler_group_${group_idx}.circom`;
    let circuit;
    describe(`/${regex}/ > group idx: ${group_idx} > ${testCircomFile}`, () => {
      before(async function () {
        await generator.generateCircuit(regex, "../circuits");
        circuit = await wasm_tester(
          path.join(__dirname, "circuits", testCircomFile),
          {
            recompile: process.env.NO_COMPILE ? false : true,
            output: `${__dirname}/../build/`,
            O: 0,
          }
        );
      });
      tests.forEach((test) => {
        const name = test[0];
        const content = test[1];
        const match_idx = test[2];
        const checkSignals = test[3];

        describe(name, () => {
          it("checks witness", async function () {
            let witness = await circuit.calculateWitness({
              msg: content,
              match_idx,
            });
            const signals = await circuit.getJSONOutput("main", witness);
            checkSignals(signals);
            await circuit.checkConstraints(witness);
          });
        });
      });
    });
  });

  describe("exceptions", () => {
    it("character class not supported", async () => {
      try {
        await generator.generateCircuit("[a-z]", "../circuits");
      } catch (e) {
        expect(e.message).to.equal("CharacterClass not supported");
        return;
      }

      expect.fail("should have thrown");
    });
  });
});

function encodeString(str) {
  return str.split("").map((x) => BigInt(x.charCodeAt(0)));
}

function convertMsg(msg, maxLen = 1536) {
  let msgEncoded = msg.split("").map((x) => x.charCodeAt(0));
  while (msgEncoded.length < maxLen) {
    msgEncoded.push(0);
  }
  msgEncoded = msgEncoded.map((x) => `${x}`);
  return msgEncoded;
}

function assert_reveal(signals, expected_reveal) {
  for (let m in signals.main.reveal_shifted) {
    const value = signals.main.reveal_shifted[m];
    if (expected_reveal[m]) {
      expect(value).to.equal(expected_reveal[m]);
    }
  }
}
