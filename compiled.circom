pragma circom 2.0.3;

include "helpers/regex_helpers.circom";

template Regex (msg_bytes, reveal_bytes) {
    signal input msg[msg_bytes];
    signal input match_idx;
    signal output start_idx;
    signal output group_match_count;
    signal output entire_count;

    signal reveal_shifted_intermediate[reveal_bytes][msg_bytes];
    signal output reveal_shifted[reveal_bytes];

    var num_bytes = msg_bytes;
    signal in[num_bytes];
    for (var i = 0; i < msg_bytes; i++) {
        in[i] <== msg[i];
    }

    component eq[22][num_bytes];
    component and[14][num_bytes];
    component multi_or[6][num_bytes];
    signal states[num_bytes+1][13];
    
    for (var i = 0; i < num_bytes; i++) {
        states[i][0] <== 1;
    }
    for (var i = 1; i < 13; i++) {
        states[0][i] <== 0;
    }
    
    for (var i = 0; i < num_bytes; i++) {
        //1
        eq[0][i] = IsEqual();
        eq[0][i].in[0] <== in[i];
        eq[0][i].in[1] <== 49;
        //2
        eq[1][i] = IsEqual();
        eq[1][i].in[0] <== in[i];
        eq[1][i].in[1] <== 50;
        ///
        eq[2][i] = IsEqual();
        eq[2][i].in[0] <== in[i];
        eq[2][i].in[1] <== 47;
        and[0][i] = AND();
        and[0][i].a <== states[i][1];
        multi_or[0][i] = MultiOR(3);
        multi_or[0][i].in[0] <== eq[0][i].out;
        multi_or[0][i].in[1] <== eq[1][i].out;
        multi_or[0][i].in[2] <== eq[2][i].out;
        and[0][i].b <== multi_or[0][i].out;
        //1
        eq[3][i] = IsEqual();
        eq[3][i].in[0] <== in[i];
        eq[3][i].in[1] <== 49;
        //2
        eq[4][i] = IsEqual();
        eq[4][i].in[0] <== in[i];
        eq[4][i].in[1] <== 50;
        ///
        eq[5][i] = IsEqual();
        eq[5][i].in[0] <== in[i];
        eq[5][i].in[1] <== 47;
        and[1][i] = AND();
        and[1][i].a <== states[i][10];
        multi_or[1][i] = MultiOR(3);
        multi_or[1][i].in[0] <== eq[3][i].out;
        multi_or[1][i].in[1] <== eq[4][i].out;
        multi_or[1][i].in[2] <== eq[5][i].out;
        and[1][i].b <== multi_or[1][i].out;
        multi_or[2][i] = MultiOR(2);
        multi_or[2][i].in[0] <== and[0][i].out;
        multi_or[2][i].in[1] <== and[1][i].out;
        states[i+1][1] <== multi_or[2][i].out;
        //;
        eq[6][i] = IsEqual();
        eq[6][i].in[0] <== in[i];
        eq[6][i].in[1] <== 59;
        and[2][i] = AND();
        and[2][i].a <== states[i][1];
        and[2][i].b <== eq[6][i].out;
        states[i+1][2] <== and[2][i].out;
        // 
        eq[7][i] = IsEqual();
        eq[7][i].in[0] <== in[i];
        eq[7][i].in[1] <== 32;
        and[3][i] = AND();
        and[3][i].a <== states[i][2];
        and[3][i].b <== eq[7][i].out;
        states[i+1][3] <== and[3][i].out;
        //D
        eq[8][i] = IsEqual();
        eq[8][i].in[0] <== in[i];
        eq[8][i].in[1] <== 68;
        and[4][i] = AND();
        and[4][i].a <== states[i][0];
        and[4][i].b <== eq[8][i].out;
        states[i+1][4] <== and[4][i].out;
        //K
        eq[9][i] = IsEqual();
        eq[9][i].in[0] <== in[i];
        eq[9][i].in[1] <== 75;
        and[5][i] = AND();
        and[5][i].a <== states[i][4];
        and[5][i].b <== eq[9][i].out;
        states[i+1][5] <== and[5][i].out;
        //I
        eq[10][i] = IsEqual();
        eq[10][i].in[0] <== in[i];
        eq[10][i].in[1] <== 73;
        and[6][i] = AND();
        and[6][i].a <== states[i][5];
        and[6][i].b <== eq[10][i].out;
        states[i+1][6] <== and[6][i].out;
        //:
        eq[11][i] = IsEqual();
        eq[11][i].in[0] <== in[i];
        eq[11][i].in[1] <== 58;
        and[7][i] = AND();
        and[7][i].a <== states[i][6];
        and[7][i].b <== eq[11][i].out;
        states[i+1][7] <== and[7][i].out;
        // 
        eq[12][i] = IsEqual();
        eq[12][i].in[0] <== in[i];
        eq[12][i].in[1] <== 32;
        and[8][i] = AND();
        and[8][i].a <== states[i][7];
        and[8][i].b <== eq[12][i].out;
        states[i+1][8] <== and[8][i].out;
        //a
        eq[13][i] = IsEqual();
        eq[13][i].in[0] <== in[i];
        eq[13][i].in[1] <== 97;
        //d
        eq[14][i] = IsEqual();
        eq[14][i].in[0] <== in[i];
        eq[14][i].in[1] <== 100;
        //v
        eq[15][i] = IsEqual();
        eq[15][i].in[0] <== in[i];
        eq[15][i].in[1] <== 118;
        and[9][i] = AND();
        and[9][i].a <== states[i][3];
        multi_or[3][i] = MultiOR(3);
        multi_or[3][i].in[0] <== eq[13][i].out;
        multi_or[3][i].in[1] <== eq[14][i].out;
        multi_or[3][i].in[2] <== eq[15][i].out;
        and[9][i].b <== multi_or[3][i].out;
        //a
        eq[16][i] = IsEqual();
        eq[16][i].in[0] <== in[i];
        eq[16][i].in[1] <== 97;
        //d
        eq[17][i] = IsEqual();
        eq[17][i].in[0] <== in[i];
        eq[17][i].in[1] <== 100;
        //v
        eq[18][i] = IsEqual();
        eq[18][i].in[0] <== in[i];
        eq[18][i].in[1] <== 118;
        and[10][i] = AND();
        and[10][i].a <== states[i][8];
        multi_or[4][i] = MultiOR(3);
        multi_or[4][i].in[0] <== eq[16][i].out;
        multi_or[4][i].in[1] <== eq[17][i].out;
        multi_or[4][i].in[2] <== eq[18][i].out;
        and[10][i].b <== multi_or[4][i].out;
        multi_or[5][i] = MultiOR(2);
        multi_or[5][i].in[0] <== and[9][i].out;
        multi_or[5][i].in[1] <== and[10][i].out;
        states[i+1][9] <== multi_or[5][i].out;
        //=
        eq[19][i] = IsEqual();
        eq[19][i].in[0] <== in[i];
        eq[19][i].in[1] <== 61;
        and[11][i] = AND();
        and[11][i].a <== states[i][9];
        and[11][i].b <== eq[19][i].out;
        states[i+1][10] <== and[11][i].out;
        //b
        eq[20][i] = IsEqual();
        eq[20][i].in[0] <== in[i];
        eq[20][i].in[1] <== 98;
        and[12][i] = AND();
        and[12][i].a <== states[i][3];
        and[12][i].b <== eq[20][i].out;
        states[i+1][11] <== and[12][i].out;
        //h
        eq[21][i] = IsEqual();
        eq[21][i].in[0] <== in[i];
        eq[21][i].in[1] <== 104;
        and[13][i] = AND();
        and[13][i].a <== states[i][11];
        and[13][i].b <== eq[21][i].out;
        states[i+1][12] <== and[13][i].out;
    }
    signal final_state_sum[num_bytes+1];
    final_state_sum[0] <== states[0][12];
    for (var i = 1; i <= num_bytes; i++) {
        final_state_sum[i] <== final_state_sum[i-1] + states[i][12];
    }
    entire_count <== final_state_sum[num_bytes];
    signal tracked[num_bytes];
    signal output reveal[num_bytes];
    signal and_track[2*num_bytes];
    signal or_track[num_bytes];
    for (var i = 0; i < num_bytes; i++) {
        or_track[i]= MultiOR(2);
        and_track[2*i+0] = AND();
        and_track[2*i+0].a <== states[i+1][1];
        and_track[2*i+0].b <== states[i][10];
        or_track[i].in[0] <== and_track[2*i+0].out;
        and_track[2*i+1] = AND();
        and_track[2*i+1].a <== states[i+1][1];
        and_track[2*i+1].b <== states[i][1];
        or_track[i].in[1] <== and_track[2*i+1].out;
        reveal[i] <== in[i] * or_track[i].out;
    }
    

    // a flag to indicate the start position of the match
    var start_index = 0;
    // for counting the number of matches
    var count = 0;

    // lengths to be consistent with states signal
    component check_start[num_bytes + 1];
    component check_match[num_bytes + 1];
    component check_matched_start[num_bytes + 1];
    component matched_idx_eq[msg_bytes];

    for (var i = 0; i < num_bytes; i++) {
        if (i == 0) {
            count += or_track[0].out;
        }
        else {
            check_start[i] = AND();
            check_start[i].a <== or_track[i].out;
            check_start[i].b <== 1 - or_track[i-1].out;

            count += check_start[i].out;

            check_match[i] = IsEqual();
            check_match[i].in[0] <== count;
            check_match[i].in[1] <== match_idx + 1;

            check_matched_start[i] = AND();
            check_matched_start[i].a <== check_match[i].out;
            check_matched_start[i].b <== check_start[i].out;
            start_index += check_matched_start[i].out * i;
        }

        matched_idx_eq[i] = IsEqual();
        matched_idx_eq[i].in[0] <== or_track[i].out * count;
        matched_idx_eq[i].in[1] <== match_idx + 1;
    }

    component match_start_idx[msg_bytes];
    for (var i = 0; i < msg_bytes; i++) {
        match_start_idx[i] = IsEqual();
        match_start_idx[i].in[0] <== i;
        match_start_idx[i].in[1] <== start_index;
    }

    signal reveal_match[msg_bytes];
    for (var i = 0; i < msg_bytes; i++) {
        reveal_match[i] <== matched_idx_eq[i].out * reveal[i];
    }

    for (var j = 0; j < reveal_bytes; j++) {
        reveal_shifted_intermediate[j][j] <== 0;
        for (var i = j + 1; i < msg_bytes; i++) {
            // This shifts matched string back to the beginning. 
            reveal_shifted_intermediate[j][i] <== reveal_shifted_intermediate[j][i - 1] + match_start_idx[i-j].out * reveal_match[i];
        }
        reveal_shifted[j] <== reveal_shifted_intermediate[j][msg_bytes - 1];
    }

    group_match_count <== count;
    start_idx <== start_index;
}