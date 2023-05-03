# zk_regex_submatch

Working on explore.js file

Given DFA and state transition, reveal a corresponding state transitions that belong to each group

Previous regex reveals just characters that make it land in a certain state i, now we will reveal a character that makes state transition from state i to state j

Simple version first! assume text is already satisfied DFA

Todo:

- Then, just edit it to run check first and && them.
- Cli

Caution:

- Edge can go back to start node!
- N-1 is not necessarily accepted states
- Not cover the case where first integer matches
