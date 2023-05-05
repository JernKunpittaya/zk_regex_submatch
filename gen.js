const fs = require("fs");
const path = require("path");
const regexpTree = require("regexp-tree");
const assert = require("assert");

async function generateCircuit(regex, circuitName) {
  let forward_tran = {
    0: { '["D"]': "4" },
    1: { '["1","2","/"]': "1", '[";"]': "2" },
    2: { '[" "]': "3" },
    3: { '["a","d","v"]': "9", '["b"]': "11" },
    4: { '["K"]': "5" },
    5: { '["I"]': "6" },
    6: { '[":"]': "7" },
    7: { '[" "]': "8" },
    8: { '["a","d","v"]': "9" },
    9: { '["="]': "10" },
    10: { '["1","2","/"]': "1" },
    11: { '["h"]': "12" },
    12: {},
  };
  let rev_tran = [
    [],
    [
      ['["1","2","/"]', "1"],
      ['["1","2","/"]', "10"],
    ],
    [['[";"]', "1"]],
    [['[" "]', "2"]],
    [['["D"]', "0"]],
    [['["K"]', "4"]],
    [['["I"]', "5"]],
    [['[":"]', "6"]],
    [['[" "]', "7"]],
    [
      ['["a","d","v"]', "3"],
      ['["a","d","v"]', "8"],
    ],
    [['["="]', "9"]],
    [['["b"]', "3"]],
    [['["h"]', "11"]],
  ];
  // Caution: change from set to array!
  let tags = {
    0: [
      '["8","9"]',
      '["3","9"]',
      '["9","10"]',
      '["10","1"]',
      '["1","2"]',
      '["2","3"]',
      '["1","1"]',
    ],
    1: ['["8","9"]', '["3","9"]'],
    2: ['["10","1"]', '["1","1"]'],
  };
  const N = 13;
  const accept_states = new Set();
  accept_states.add(12);

  let eq_i = 0;
  let lt_i = 0;
  let and_i = 0;
  let multi_or_i = 0;

  let lines = [];
  lines.push("for (var i = 0; i < num_bytes; i++) {");

  for (let i = 1; i < N; i++) {
    const outputs = [];
    for (let [k, prev_i] of rev_tran[i]) {
      let vals = new Set(JSON.parse(k));
      const eq_outputs = [];

      const uppercase = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
      const lowercase = new Set("abcdefghijklmnopqrstuvwxyz".split(""));
      const digits = new Set("0123456789".split(""));

      if (
        new Set([...uppercase].filter((x) => vals.has(x))).size ===
        uppercase.size
      ) {
        vals = new Set([...vals].filter((x) => !uppercase.has(x)));
        lines.push("\t//UPPERCASE");
        lines.push(`\tlt[${lt_i}][i] = LessThan(8);`);
        lines.push(`\tlt[${lt_i}][i].in[0] <== 64;`);
        lines.push(`\tlt[${lt_i}][i].in[1] <== in[i];`);

        lines.push(`\tlt[${lt_i + 1}][i] = LessThan(8);`);
        lines.push(`\tlt[${lt_i + 1}][i].in[0] <== in[i];`);
        lines.push(`\tlt[${lt_i + 1}][i].in[1] <== 91;`);

        lines.push(`\tand[${and_i}][i] = AND();`);
        lines.push(`\tand[${and_i}][i].a <== lt[${lt_i}][i].out;`);
        lines.push(`\tand[${and_i}][i].b <== lt[${lt_i + 1}][i].out;`);

        eq_outputs.push(["and", and_i]);
        lt_i += 2;
        and_i += 1;
      }
      if (
        new Set([...lowercase].filter((x) => vals.has(x))).size ===
        lowercase.size
      ) {
        vals = new Set([...vals].filter((x) => !lowercase.has(x)));
        lines.push("\t//lowercase");
        lines.push(`\tlt[${lt_i}][i] = LessThan(8);`);
        lines.push(`\tlt[${lt_i}][i].in[0] <== 96;`);
        lines.push(`\tlt[${lt_i}][i].in[1] <== in[i];`);

        lines.push(`\tlt[${lt_i + 1}][i] = LessThan(8);`);
        lines.push(`\tlt[${lt_i + 1}][i].in[0] <== in[i];`);
        lines.push(`\tlt[${lt_i + 1}][i].in[1] <== 123;`);

        lines.push(`\tand[${and_i}][i] = AND();`);
        lines.push(`\tand[${and_i}][i].a <== lt[${lt_i}][i].out;`);
        lines.push(`\tand[${and_i}][i].b <== lt[${lt_i + 1}][i].out;`);

        eq_outputs.push(["and", and_i]);
        lt_i += 2;
        and_i += 1;
      }
      if (
        new Set([...digits].filter((x) => vals.has(x))).size === digits.size
      ) {
        vals = new Set([...vals].filter((x) => !digits.has(x)));
        lines.push("\t//digits");
        lines.push(`\tlt[${lt_i}][i] = LessThan(8);`);
        lines.push(`\tlt[${lt_i}][i].in[0] <== 47;`);
        lines.push(`\tlt[${lt_i}][i].in[1] <== in[i];`);

        lines.push(`\tlt[${lt_i + 1}][i] = LessThan(8);`);
        lines.push(`\tlt[${lt_i + 1}][i].in[0] <== in[i];`);
        lines.push(`\tlt[${lt_i + 1}][i].in[1] <== 58;`);

        lines.push(`\tand[${and_i}][i] = AND();`);
        lines.push(`\tand[${and_i}][i].a <== lt[${lt_i}][i].out;`);
        lines.push(`\tand[${and_i}][i].b <== lt[${lt_i + 1}][i].out;`);

        eq_outputs.push(["and", and_i]);
        lt_i += 2;
        and_i += 1;
      }
      for (let c of vals) {
        assert.strictEqual(c.length, 1);
        lines.push(`\t//${c}`);
        lines.push(`\teq[${eq_i}][i] = IsEqual();`);
        lines.push(`\teq[${eq_i}][i].in[0] <== in[i];`);
        lines.push(`\teq[${eq_i}][i].in[1] <== ${c.charCodeAt(0)};`);
        eq_outputs.push(["eq", eq_i]);
        eq_i += 1;
      }

      lines.push(`\tand[${and_i}][i] = AND();`);
      lines.push(`\tand[${and_i}][i].a <== states[i][${prev_i}];`);

      if (eq_outputs.length === 1) {
        lines.push(
          `\tand[${and_i}][i].b <== ${eq_outputs[0][0]}[${eq_outputs[0][1]}][i].out;`
        );
      } else if (eq_outputs.length > 1) {
        lines.push(
          `\tmulti_or[${multi_or_i}][i] = MultiOR(${eq_outputs.length});`
        );
        for (let output_i = 0; output_i < eq_outputs.length; output_i++) {
          lines.push(
            `\tmulti_or[${multi_or_i}][i].in[${output_i}] <== ${eq_outputs[output_i][0]}[${eq_outputs[output_i][1]}][i].out;`
          );
        }
        lines.push(`\tand[${and_i}][i].b <== multi_or[${multi_or_i}][i].out;`);
        multi_or_i += 1;
      }
      outputs.push(and_i);
      and_i += 1;
    }

    if (outputs.length === 1) {
      lines.push(`\tstates[i+1][${i}] <== and[${outputs[0]}][i].out;`);
    } else if (outputs.length > 1) {
      lines.push(`\tmulti_or[${multi_or_i}][i] = MultiOR(${outputs.length});`);
      for (let output_i = 0; output_i < outputs.length; output_i++) {
        lines.push(
          `\tmulti_or[${multi_or_i}][i].in[${output_i}] <== and[${outputs[output_i]}][i].out;`
        );
      }
      lines.push(`\tstates[i+1][${i}] <== multi_or[${multi_or_i}][i].out;`);
      multi_or_i += 1;
    }
  }

  lines.push("}");

  lines.push("signal final_state_sum[num_bytes+1];");
  // accepted states
  lines.push(`final_state_sum[0] <== states[0][${N - 1}];`);
  lines.push("for (var i = 1; i <= num_bytes; i++) {");
  // accepted states
  lines.push(
    `\tfinal_state_sum[i] <== final_state_sum[i-1] + states[i][${N - 1}];`
  );
  lines.push("}");
  lines.push("entire_count <== final_state_sum[num_bytes];");

  let declarations = [];

  if (eq_i > 0) {
    declarations.push(`component eq[${eq_i}][num_bytes];`);
  }
  if (lt_i > 0) {
    declarations.push(`component lt[${lt_i}][num_bytes];`);
  }
  if (and_i > 0) {
    declarations.push(`component and[${and_i}][num_bytes];`);
  }
  if (multi_or_i > 0) {
    declarations.push(`component multi_or[${multi_or_i}][num_bytes];`);
  }
  declarations.push(`signal states[num_bytes+1][${N}];`);
  declarations.push("");

  let init_code = [];

  init_code.push("for (var i = 0; i < num_bytes; i++) {");
  init_code.push("\tstates[i][0] <== 1;");
  init_code.push("}");

  init_code.push(`for (var i = 1; i < ${N}; i++) {`);
  init_code.push("\tstates[0][i] <== 0;");
  init_code.push("}");

  init_code.push("");

  const reveal_code = [];
  // hard code case 2: num
  reveal_code.push("signal tracked[num_bytes];");
  //   let tmp_tracked = "";

  //   for (const trans of tags[2]) {
  //     tmp_tracked += `states[i+1][${JSON.parse(trans)[1]}]*states[i][${
  //       JSON.parse(trans)[0]
  //     }]+`;
  //   }
  //

  //   let or_track = 0;
  reveal_code.push("signal output reveal[num_bytes];");
  reveal_code.push("signal and_track[2*num_bytes];");
  reveal_code.push("signal or_track[num_bytes];");
  reveal_code.push("for (var i = 0; i < num_bytes; i++) {");
  reveal_code.push(`\tor_track[i]= MultiOR(${tags[2].length});`);
  let and_track = 0;
  for (let tranInd = 0; tranInd < tags[2].length; tranInd++) {
    reveal_code.push(`\tand_track[2*i+${and_track}] = AND();`);
    reveal_code.push(
      `\tand_track[2*i+${and_track}].a <== states[i+1][${
        JSON.parse(tags[2][tranInd])[1]
      }];`
    );
    reveal_code.push(
      `\tand_track[2*i+${and_track}].b <== states[i][${
        JSON.parse(tags[2][tranInd])[0]
      }];`
    );

    reveal_code.push(
      `\tor_track[i].in[${tranInd}] <== and_track[2*i+${and_track}].out;`
    );
    and_track += 1;
  }
  reveal_code.push("\treveal[i] <== in[i] * or_track[i].out;");
  reveal_code.push("}");
  reveal_code.push("");

  lines = [...declarations, ...init_code, ...lines, ...reveal_code];

  try {
    let tpl = await (
      await fs.promises.readFile(`${__dirname}/tpl.circom`)
    ).toString();
    tpl = tpl.replace("TEMPLATE_NAME_PLACEHOLDER", circuitName || "Regex");
    tpl = tpl.replace("COMPILED_CONTENT_PLACEHOLDER", lines.join("\n\t"));
    tpl = tpl.replace(/\t/g, " ".repeat(4));

    const outputPath = `${__dirname}/${circuitName || "compiled"}.circom`;
    await fs.promises.writeFile(outputPath, tpl);
    process.env.VERBOSE &&
      console.log(`Circuit compiled to ${path.normalize(outputPath)}`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  generateCircuit,
};
