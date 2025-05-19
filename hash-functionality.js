function create_internal_state_hash( block_length, 
    a_rounds_length, b_rounds_length, h_size) {

    var internal_state = "00000000"// 8bit
    //console.log(internal_state)
    internal_state += int_to_bin(block_length) 
    //console.log(internal_state)
    internal_state += int_to_bin(a_rounds_length);
    //console.log(internal_state)
    internal_state += int_to_bin(a_rounds_length - b_rounds_length);
    //console.log(internal_state)
    internal_state += "0000000000000000"
    //console.log(internal_state)
    internal_state += int_to_bin(h_size,16);
    //console.log(internal_state)
    // 256 bit
    internal_state += "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    
    console.log(internal_state.length, internal_state)
    console.log(int_to_bin(h_size,16))
    return internal_state
}

function initialization_phase_hash(s_splited, a) {

    // Apply permutation function a times
    s_splited = apply_rounds(s_splited, a)

    return s_splited
}


function initialization_phase_hash(s_splited, a) {

    // Apply permutation function a times
    s_splited = apply_rounds(s_splited, a)

    return s_splited
}

function absorb_phase_hash(s_splited, data, r, b) {
    var parts = pad_and_split_data(data, r);console.log(parts)

    for (var e = 0; e < parts.length; e++) {
        var part = parts[e]
        s_splited[0] = xor_arrays(s_splited[0], part)

        if (e < parts.length - 1) {
            s_splited = apply_rounds(s_splited, b)
        }
    }

    return s_splited
}

function squeeze_phase_hash(s_splited, a, b, l, r, isxof) {
    s_splited = apply_rounds(s_splited,a)

    var hash = ''
    for (var i = 0 ; i < Math.ceil(l/r) ; i++){
        hash += s_splited[0]
        s_splited = apply_rounds(s_splited,b)
    }

    if (isxof == undefined || isxof == false) {
        if (current_status == 'hex') {
            let value = split_data(hash, 8)
            let output = ''
            for (let a = 0 ; a < value.length ; a++){
                output += parseInt(value[a],2).toString(16)
            }
            hash = output
        }
    } else {
        hash = hash.substring(0,l)
    }

    return hash;
}

function ascon_hash(ascii) {
    var h = 256;
    var a = 12;
    var b = 12;
    var r = 64;

    var s = create_internal_state_hash(r, a, b, h);
    var s_splited = split_internal_state(s)
    
    s_splited = initialization_phase_hash(s_splited, a)
    s_splited = absorb_phase_hash(s_splited, str_to_bin(ascii), r, b)

    var hash = squeeze_phase_hash(s_splited, a, b, h, r)

    return hash
}

function ascon_hasha(ascii) {
    var h = 256;
    var a = 12;
    var b = 8;
    var r = 64;

    var s = create_internal_state_hash(r, a, b, h);
    var s_splited = split_internal_state(s)
    
    s_splited = initialization_phase_hash(s_splited, a)
    s_splited = absorb_phase_hash(s_splited, str_to_bin(ascii), r, b)

    var hash = squeeze_phase_hash(s_splited, a, b, h, r)

    return hash
}

function ascon_xof(ascii,h) {
    //var h = 256;
    var a = 12;
    var b = 12;
    var r = 64;

    var s = create_internal_state_hash(r, a, b, 0);
    var s_splited = split_internal_state(s)
    
    s_splited = initialization_phase_hash(s_splited, a)
    s_splited = absorb_phase_hash(s_splited, str_to_bin(ascii), r, b)
    console.log("this",s_splited)

    var hash = squeeze_phase_hash(s_splited, a, b, h, r, true)

    return hash
}

function ascon_xofa(ascii,h) {
    //var h = 256;
    var a = 12;
    var b = 8;
    var r = 64;

    var s = create_internal_state_hash(r, a, b, 0);
    var s_splited = split_internal_state(s)
    
    s_splited = initialization_phase_hash(s_splited, a)
    s_splited = absorb_phase_hash(s_splited, str_to_bin(ascii), r, b)
    console.log("this",s_splited)

    var hash = squeeze_phase_hash(s_splited, a, b, h, r, true)

    return hash
}