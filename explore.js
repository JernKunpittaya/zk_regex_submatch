// let tags = {
//   0: [
//     '["8","9"]',
//     '["3","9"]',
//     '["9","10"]',
//     '["10","1"]',
//     '["1","2"]',
//     '["2","3"]',
//     '["1","1"]',
//   ],
//   1: ['["8","9"]', '["3","9"]'],
//   2: ['["10","1"]', '["1","1"]'],
// };

// let matched_group_trans = [];
// for (let i in tags) {
//   let arr = tags[i].map((str) => JSON.parse(str));
//   matched_group_trans.push(arr);
// }
// console.log("tag new: ", matched_group_trans);
const gen = require("./gen");
const regex = "dummy";
gen.generateCircuit(regex);
