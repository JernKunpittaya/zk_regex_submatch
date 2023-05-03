// given we already have input as the final graph from frontend.
const fs = require("fs");

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

let prereq_track = {};
let visitted = {};
for (let i = 0; i < rev_tran.length; i++) {
  prereq_track[i] = rev_tran[i].length;
  visitted[i] = false;
}
console.log(prereq_track);
console.log(visitted);

function createSet(n) {
  const set = new Set();
  for (let i = 0; i <= n; i++) {
    set.add(i.toString());
  }
  return set;
}

let eq_i = 0;
let lt_i = 0;
let and_i = 0;
let multi_or_i = 0;

let lines = [];
lines.push("for (var i = 0; i < num_bytes; i++) {");

// currently in the i --> i+1 loop
// We have every states[i][next] available

// init i = 0;
// states[0][1], states[0][2]..., states[0][N-1] = 0
// states[0][0], states [1][0], ... states[Numbytes -1 ][0]=1
// stateSum
for (let currNode = 0; currNode < N; currNode++) {
  // calculate its states[i][currNode] by multiple OR from rev_graph
  let currNodeNotTo = createSet(N);
  let dictNextCurr = {};
  // now calculate next node
  for (let edge in forward_tran[currNode]) {
    let nextNode = forward_tran[currNode][edge];
    currNodeNotTo.delete(nextNode);
    if (
      new Set([...uppercase].filter((x) => vals.has(x))).size === uppercase.size
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
      new Set([...lowercase].filter((x) => vals.has(x))).size === lowercase.size
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
    if (new Set([...digits].filter((x) => vals.has(x))).size === digits.size) {
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
    lines.push(`\tand[${and_i}][i].a <== states[i][${currNode}];`);

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
    // dictNextCurr[JSON.stringify([nextNode, currNode])] = and_i;
    lines.push(
      `\tstates_tran[i+1][${nextNode}][${currNode}] <== and[${and_i}][i].out;`
    );
    and_i += 1;
  }
  for (const leftover of currNodeNotTo) {
    // dictNextCurr[JSON.stringify([leftover, currNode])] = and_i;
    lines.push(`\tstates_tran[i+1][${leftover}][${currNode}] <== 0;`);
    // and_i += 1;
    // state[i+1][leftover][currNode] <== 0
  }
  for (let nowNode = 1; nowNode < N; nowNode++) {
    if (rev_tran[nowNode].length == 1) {
      for (let edge in rev_tran[nowNode])
        lines.push(
          `\tstates[i+1][${nowNode}] <== states_tran[i+1][${nowNode}][${rev_tran[nowNode][edge]}];`
        );
    } else {
      lines.push(
        `\tmulti_or[${multi_or_i}][i] = MultiOR(${rev_tran[nowNode].length});`
      );
      let edge_i = 0;
      for (let edge in rev_tran[nowNode]) {
        // push stuffs = state[i+1][nowNode][rev_tran[nowNode][edge]]
        lines.push(
          `\tmulti_or[${multi_or_i}][i].in[${edge_i}] <== states_tran[i+1][${nowNode}][${rev_tran[nowNode][edge]}];`
        );
        lines.push(
          `\tstates[i+1][${nowNode}] <== multi_or[${multi_or_i}][i].out;`
        );
        edge_i += 1;
      }

      multi_or_i += 1;
    }
  }
}

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
declarations.push(`signal states_tran[num_bytes+1][${N}][${N}];`);
declarations.push("");

let init_code = [];

init_code.push("for (var i = 0; i < num_bytes; i++) {");
init_code.push("\tstates[i][0] <== 1;");
init_code.push("}");

init_code.push(`for (var i = 1; i < ${N}; i++) {`);
init_code.push("\tstates[0][i] <== 0;");
init_code.push("}");

init_code.push("");
