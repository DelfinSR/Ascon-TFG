var constants_12 = [
    '0000000000000000000000000000000000000000000000000000000011110000',
    '0000000000000000000000000000000000000000000000000000000011100001',
    '0000000000000000000000000000000000000000000000000000000011010010',
    '0000000000000000000000000000000000000000000000000000000011000011',
    '0000000000000000000000000000000000000000000000000000000010110100',
    '0000000000000000000000000000000000000000000000000000000010100101',
    '0000000000000000000000000000000000000000000000000000000010010110',
    '0000000000000000000000000000000000000000000000000000000010000111',
    '0000000000000000000000000000000000000000000000000000000001111000',
    '0000000000000000000000000000000000000000000000000000000001101001',
    '0000000000000000000000000000000000000000000000000000000001011010',
    '0000000000000000000000000000000000000000000000000000000001001011',
]

var past_constants = [
    '0000000000000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000',
]

var constants_8 = [
    '0000000000000000000000000000000000000000000000000000000010110100',
    '0000000000000000000000000000000000000000000000000000000010100101',
    '0000000000000000000000000000000000000000000000000000000010010110',
    '0000000000000000000000000000000000000000000000000000000010000111',
    '0000000000000000000000000000000000000000000000000000000001111000',
    '0000000000000000000000000000000000000000000000000000000001101001',
    '0000000000000000000000000000000000000000000000000000000001011010',
    '0000000000000000000000000000000000000000000000000000000001001011',
]

var constants_6 = [
    '0000000000000000000000000000000000000000000000000000000010010110',
    '0000000000000000000000000000000000000000000000000000000010000111',
    '0000000000000000000000000000000000000000000000000000000001111000',
    '0000000000000000000000000000000000000000000000000000000001101001',
    '0000000000000000000000000000000000000000000000000000000001011010',
    '0000000000000000000000000000000000000000000000000000000001001011',
]

var past_lin_layer = [[0,0],[0,0],[0,0],[0,0],[0,0]]

function apply_constants(internal_state, number_of_rounds, current_round) {
    switch (number_of_rounds) {
        case 6:
            internal_state[2] = xor_arrays(internal_state[2], constants_6[current_round])
            break;
        case 8:
            internal_state[2] = xor_arrays(internal_state[2], constants_8[current_round])
            break;
        case 12:
            internal_state[2] = xor_arrays(internal_state[2], constants_12[current_round])
            break;
        default:
            break;
    }
    return internal_state;
}

function apply_rounds(intern_state, number_of_rounds) {
    for (var p=0; p<number_of_rounds; p++) {
        intern_state = apply_constants(intern_state, number_of_rounds, p)
        intern_state = apply_sbox(intern_state)
        intern_state = linear_layer(intern_state)
    }

    return intern_state
}

function split_data(data_to_split, r) {
    var parts = []
    for (var i = 0 ; i < data_to_split.length/r ; i++) {
        var part = ''
        for (var a = 0 ; a < r ; a++) {
            part += data_to_split[r*i + a]
        }
        parts.push(part)
    }
    return parts
}

function pad_and_split_data(data_to_split, r) {
    if (data_to_split.length % r != 0) {
        data_to_split += '1'
        while ( data_to_split.length % r != 0) {
            data_to_split += '0'
        }
    }
    parts = split_data(data_to_split, r)

    return parts
}

var sbox = {'00000': '00100', '00001': '01011', '00010': '11111', '00011': '10100', '00100': '11010', '00101': '10101', '00110': '01001', '00111': '00010', '01000': '11011', '01001': '00101', '01010': '01000', '01011': '10010', '01100': '11101', '01101': '00011', '01110': '00110', '01111': '11100', '10000': '11110', '10001': '10011', '10010': '00111', '10011': '01110', '10100': '00000', '10101': '01101', '10110': '10001', '10111': '11000', '11000': '10000', '11001': '01100', '11010': '00001', '11011': '11001', '11100': '10110', '11101': '01010', '11110': '01111', '11111': '10111'}
var past_sbox = {'00000': '00000', '00001': '00001', '00010': '00010', '00011': '00011', '00100': '00100', '00101': '00101', '00110': '00110', '00111': '00111', '01000': '01000', '01001': '01001', '01010': '01010', '01011': '01011', '01100': '01100', '01101': '01101', '01110': '01110', '01111': '01111', '10000': '10000', '10001': '10001', '10010': '10010', '10011': '10011', '10100': '10100', '10101': '10101', '10110': '10110', '10111': '10111', '11000': '11000', '11001': '11001', '11010': '11010', '11011': '11011', '11100': '11100', '11101': '11101', '11110': '11110', '11111': '11111'}


function int_to_bin(int_value, output_length) {
    if (output_length == undefined) {
        output_length = 8
    }
    var bin_value = int_value.toString(2);
    while (bin_value.length % output_length != 0) {
        bin_value = "0"+bin_value
    }
    return bin_value
}

function str_to_bin(str) {
    var result = '';

    for (var i=0; i<str.length; i++) {
        result += int_to_bin(str.charCodeAt(i))
    }
    return result;
}

function bin_to_str(str) {
    var result = '';


    var bin_nums = split_data(str, 8)
    for (var i=0; i<bin_nums.length; i++) {
        result += String.fromCharCode(parseInt(bin_nums[i],2))
    }

    return result;
}

function bin_to_hex(bin_in) {
    let value = split_data(bin_in, 8)
    
    let output = ''
    for (let a = 0 ; a < value.length ; a++){
        let hex_value = parseInt(value[a],2).toString(16)
        if (hex_value.length < 2) {
            
            hex_value = "0"+hex_value
            
        }
        output += hex_value
    }
    return output
}

function hex_to_bin(hex_in) {
    let value = split_data(hex_in, 2)
    let output = ''
    for (let a = 0 ; a < value.length ; a++){
        output += int_to_bin(parseInt(value[a],16))
    }
    return output
}

function xor_arrays(arr1, arr2){
    if (arr1.length != arr2.length) {
        console.log("ERROR: arrays length are not equal",arr1.length, arr2.length)
        return;
    }

    var result = ''
    for (var i=0; i<arr1.length;i++) {
        var tmp = '';
        if ((arr1[i] == '1' && arr2[i] == '1') || (arr1[i] == '0' && arr2[i] == '0') ) {
            tmp = '0'
        } else {
            tmp = '1'
        }
        result += tmp
    }

    return result
}

function rotate_right(arr, n){
    var result = '';
    //console.log(arr.length)
    for (var i = 0; i<arr.length; i++) {
        var index = arr.length-n+i
        while (index < 0) {
            index += arr.length
        }
        //console.log(index % arr.length)
        result += arr[index % arr.length]
    }

    return result
}

function apply_sbox(s_array_tmp) {
    var res = ['','','','','']
    for (var a = 0 ; a < 64 ; a++) {
        var bin_value_to_be_subtituded = ''
        for (var x = 0 ; x < 5 ; x++) {
            bin_value_to_be_subtituded += s_array_tmp[x][a]
        }

        var value_subtituded = sbox[bin_value_to_be_subtituded]
        for (var x = 0 ; x < 5 ; x++) {
            res[x] += value_subtituded[x]
        }
    }
    return res
}

function apply_lin_layer_custom_constants(bin_data, const1, const2){
    var x0 = bin_data
    var x1 = rotate_right(bin_data,const1)
    var x2 = rotate_right(bin_data,const2)
    return xor_arrays(x0,xor_arrays(x1,x2))
}

function linear_layer(s_array_tmp) {

    var x0 = s_array_tmp[0]
    var x1 = rotate_right(s_array_tmp[0],19)
    var x2 = rotate_right(s_array_tmp[0],28)
    s_array_tmp[0] = xor_arrays(x0,xor_arrays(x1,x2))

    x0 = s_array_tmp[1]
    x1 = rotate_right(s_array_tmp[1],61)
    x2 = rotate_right(s_array_tmp[1],39)
    s_array_tmp[1] = xor_arrays(x0,xor_arrays(x1,x2))

    x0 = s_array_tmp[2]
    x1 = rotate_right(s_array_tmp[2],1)
    x2 = rotate_right(s_array_tmp[2],6)
    s_array_tmp[2] = xor_arrays(x0,xor_arrays(x1,x2))

    x0 = s_array_tmp[3]
    x1 = rotate_right(s_array_tmp[3],10)
    x2 = rotate_right(s_array_tmp[3],17)
    s_array_tmp[3] = xor_arrays(x0,xor_arrays(x1,x2))

    x0 = s_array_tmp[4]
    x1 = rotate_right(s_array_tmp[4],7)
    x2 = rotate_right(s_array_tmp[4],41)
    s_array_tmp[4] = xor_arrays(x0,xor_arrays(x1,x2))

    return s_array_tmp
}

function split_internal_state(internal_state) {
    var s_splited = []
    for (var i = 0 ; i < 5;i++) {
        s_layer = ''
        for (var a = 0; a < 64; a++){
            s_layer += internal_state[64*i + a] 
        }

        s_splited.push(s_layer)
    
    }
    return s_splited;
}

function get_key_parts(key) {
    var key_parts = ['','']
    for (var i = 0 ; i < 2 ; i++) {
        for (var a = 0 ; a< 64; a++) {
            key_parts[i] += key[64*i + a]
        }
    }
    return key_parts
}

function get_key_parts_80pq_initalization(key) {
    key = '00000000000000000000000000000000' + key // 192 - 160 = 32 bits
    var key_parts = ['','','']
    for (var i = 0 ; i < 3 ; i++) {
        for (var a = 0 ; a< 64; a++) {
            key_parts[i] += key[64*i + a]
        }
    }
    return key_parts
}

function get_key_parts_80pq_finalization(key) {
    key = key + '00000000000000000000000000000000' // 192 - 160 = 32 bits
    var key_parts = ['','','']
    for (var i = 0 ; i < 3 ; i++) {
        for (var a = 0 ; a< 64; a++) {
            key_parts[i] += key[64*i + a]
        }
    }
    return key_parts
}

function gen_random_printable_char() {

	let number = Math.trunc(Math.random() * 126)
	if (number < 33) {
		while (number < 33) {
			let n2 = Math.trunc(Math.random() * 126)
			number = (number + n2) % 126
			
		}
	}

	return String.fromCharCode(number)
}

function gen_random_printable_string_128bits(){
	let res = ""
	for (let i = 0 ; i < 16 ; i++) {
		res += gen_random_printable_char()
	}
	return res
}

function gen_random_printable_string_64bits(){
	let res = ""
	for (let i = 0 ; i < 8 ; i++) {
		res += gen_random_printable_char()
	}
	return res
}

function gen_random_printable_string_160bits(){
	let res = ""
	for (let i = 0 ; i < 20 ; i++) {
		res += gen_random_printable_char()
	}
	return res
}

function gen_64_bits_random(){
    res = ""
    for (let i = 0; i < 64 ; i+=8){
        let number = Math.trunc(Math.random() * 256)
        res += int_to_bin(number)
    }
    return res
}

function set_display_flex(id_to_find){
    document.getElementById(id_to_find).style.display = "flex"
}

function set_display_none(id_to_find){
    document.getElementById(id_to_find).style.display = "none"
}

function set_opposite_display(id_to_find) {
    let value = document.getElementById(id_to_find).style.display
    if (value == "none"){
        document.getElementById(id_to_find).style.display = "flex"
    } else{
        document.getElementById(id_to_find).style.display = "none"
    }
}
