// currently in the i --> i+1 loop
// We have every stateSum[i][next] available

// init i = 0;
// stateSum[0][1], stateSum[0][2]..., stateSum[0][N-1] = 0
// stateSum[0][0], stateSum [1][0], ... stateSum[Numbytes -1 ][0]=1
// // stateSum
// for (let currNode = 0; currNode < N; currNode++) {
//   // calculate its stateSum[i][currNode] by multiple OR from rev_graph
//   let currNodeNotTo = createSet(N);
//   // now calculate next node
//   for (let edge in forward_tran[currNode]) {
//     let next = forward_tran[currNode][edge];
//     currNodeNotTo.delete(next);
//     // state[i+1][next][currNode] = these [i] transitions AND stateSum[i][currNode]
//   }
//   for (const leftover of currNodeNotTo) {
//     // state[i+1][leftover][currNode] <== 0
//   }
// }
// for (let nowNode = 1; nowNode < N; nowNode++) {
//   for (let edge in rev_tran[nowNode]) {
//     // push stuffs = state[i+1][nowNode][rev_tran[nowNode][edge]]
//   }
//   // state[i+1][nowNode] <== OR all these push stuffs
// }

// Remnants
// check if every node visitted.
function checkTrue(dictionary) {
  for (const key in dictionary) {
    if ((dictionary[key] = false)) {
      return key;
    }
  }
  return false;
}

function findZero(dictionary) {
  for (const key in dictionary) {
    if (dictionary[key] == 0) {
      return key;
    }
  }
  throw new Error("Run out of node that satisfies all of its pre-req");
}

// loop i =  1 to N-1

// while (checkTrue(visitted)) {
//   let currNode = findZero(prereq_track);
//   visitted[currNode] = true;
//   // calculate its stateSum[i][currNode] by multiple OR from rev_graph
//   for (let toEdge in rev_tran[currNode]) {
//     let from = rev_tran[currNode][toEdge];
//     // OR state[i][currNode][from]
//   }
//   // now calculate next node
//   for (let edge in forward_tran[currNode]) {
//     let next = forward_tran[currNode][edge];
//     // state[i+1][next][currNode] = these [i] transitions AND stateSum[i][currNode]
//     // if ()
//   }
// }
