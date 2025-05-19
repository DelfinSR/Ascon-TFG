
function gen_password() {
    var new_pass = gen_random_printable_string_128bits()
    document.getElementById('password_input').value = new_pass
}

function gen_nonce() {
    var new_pass = gen_random_printable_string_128bits()
    document.getElementById('nonce_input').value = new_pass
}

function gen_password_128() {
    var new_pass = gen_random_printable_string_128bits()
    document.getElementById('password_input_encrypt_128').value = new_pass
}

function gen_nonce_128() {
    var new_pass = gen_random_printable_string_128bits()
    document.getElementById('nonce_input_encrypt_128').value = new_pass
}

function gen_password_128a() {
    var new_pass = gen_random_printable_string_128bits()
    document.getElementById('password_input_encrypt_128a').value = new_pass
}

function gen_nonce_128a() {
    var new_pass = gen_random_printable_string_128bits()
    document.getElementById('nonce_input_encrypt_128a').value = new_pass
}

function gen_password_80pq() {
    var new_pass = gen_random_printable_string_160bits()
    document.getElementById('password_input_encrypt_80pq').value = new_pass
}

function gen_nonce_80pq() {
    var new_pass = gen_random_printable_string_128bits()
    document.getElementById('nonce_input_encrypt_80pq').value = new_pass
}


function ascon_aead_encrypt() {
    var ascii_input = document.getElementById('ascii_input');
    var add_data_input = document.getElementById('add_data_input');
    var password_input = document.getElementById('password_input');
    var nonce_input = document.getElementById('nonce_input');

    
    var associated_data = str_to_bin(add_data_input.value.trim())
    var plaintext = str_to_bin(ascii_input.value.trim())

    if (plaintext == undefined || plaintext.length == 0) {
        alert("Debes introducir unos datos para cifrar")
        return
    } else if (nonce_input.value.trim() == undefined || nonce_input.value.trim().length == 0) {
        alert("Debes introducir un nonce")
        return
    }else if (password_input.value.trim() == undefined || password_input.value.trim().length == 0) {
        alert("Debes introducir una clave")
        return
    }

    var [_, ciphered, tag] = ascon_128_encrypt(plaintext, associated_data, password_input.value.trim(), nonce_input.value.trim())
    
    var tag_output = document.getElementById('tag_output');
    tag_output.value = tag


    var encrypted_output = document.getElementById('encrypted_output');
    encrypted_output.value = ciphered
}

function ascon_128_encrypt_demos() {
    var ascii_input = document.getElementById('ascii_input_128');
    var add_data_input = document.getElementById('add_data_input_encrypt_128');
    var password_input = document.getElementById('password_input_encrypt_128');
    var nonce_input = document.getElementById('nonce_input_encrypt_128');
    
    var associated_data = str_to_bin(add_data_input.value.trim())
    var plaintext = str_to_bin(ascii_input.value.trim())

    if (plaintext == undefined || plaintext.length == 0) {
        alert("Debes introducir unos datos para cifrar")
        return
    } else if (nonce_input.value.trim() == undefined || nonce_input.value.trim().length == 0) {
        alert("Debes introducir un nonce")
        return
    }else if (password_input.value.trim() == undefined || password_input.value.trim().length == 0) {
        alert("Debes introducir una clave")
        return
    }

    var [_, ciphered, tag] = ascon_128_encrypt(plaintext, associated_data, password_input.value.trim(), nonce_input.value.trim())
    
    var tag_output = document.getElementById('tag_output_encrypted_128');
    tag_output.value = tag


    var encrypted_output = document.getElementById('encrypted_output_128');
    encrypted_output.value = ciphered
}

function ascon_128_decrypt_demos() {
    var encrypted_input = document.getElementById('decrypted_input_128');
    var add_data_input = document.getElementById('add_data_input_decrypt_128');
    var password_input = document.getElementById('password_input_decrypt_128');
    var nonce_input = document.getElementById('nonce_input_decrypt_128');

    var ciphertext = encrypted_input.value.trim()
    var tag_input = document.getElementById('tag_input_decrypt_128').value.trim();
    var associated_data = str_to_bin(add_data_input.value.trim())

    if (ciphertext == undefined || ciphertext.length == 0) {
        alert("Debes introducir los datos a descifrar")
        return
    } else if (tag_input == undefined || tag_input.length == 0) {
        alert("Debes introducir un tag")
        return
    }else if (nonce_input.value.trim() == undefined || nonce_input.value.trim().length == 0) {
        alert("Debes introducir un nonce")
        return
    }else if (password_input.value.trim() == undefined || password_input.value.trim().length == 0) {
        alert("Debes introducir una clave")
        return
    }

    if (current_status == 'bin') {
        if (! /^[01]+$/.test(ciphertext)) {
            alert("En el modo actual, los datos cifrados deben introducirse en binario")
            return
        }

        if (! /^[01]+$/.test(tag_input)) {
            alert("En el modo actual, el tag debe introducirse en binario")
            return
        }
    } else {
        if (! /^[A-Fa-f0-9]+$/.test(ciphertext)) {
            alert('En el modo actual, los datos cifrados introducirse en hexadecimal: solo utilizando caracteres del 0 al 9 y de la "a" a la "f"')
            return
        }

        if (! /^[A-Fa-f0-9]+$/.test(tag_input)) {
            alert('En el modo actual, el tag debe introducirse en hexadecimal: solo utilizando caracteres del 0 al 9 y de la "a" a la "f"')
            return
        }
    }

    if (current_status == 'hex') {
        var ciphertext = hex_to_bin(ciphertext)
    }

    var [_, decrypted, tag] = ascon_128_decrypt(ciphertext, associated_data, password_input.value.trim(), nonce_input.value.trim())
    
    var tag_output = document.getElementById('tag_output_decrypted_128');
    tag_output.value = tag

    if (tag != tag_input) {
        document.getElementById('tag_output_decrypted_128').style.border = "10px solid #EF476F"
        decrypted = "El tag introducido no es el mismo al generado en el proceso de descifrado."
    } else {
        document.getElementById('tag_output_decrypted_128').style.border = "10px solid #00916E"
        decrypted = bin_to_str(decrypted)
        for (let i = 0 ; i < decrypted.length ; i ++) {
            if (decrypted.charCodeAt(i) == 0) {
                decrypted = decrypted.substring(0,i-1)
                break
            }
        }
    }


    var encrypted_output = document.getElementById('decrypted_output_128');
    encrypted_output.value = decrypted
}


function ascon_128a_encrypt_demos() {
    var ascii_input = document.getElementById('ascii_input_128a');
    var add_data_input = document.getElementById('add_data_input_encrypt_128a');
    var password_input = document.getElementById('password_input_encrypt_128a');
    var nonce_input = document.getElementById('nonce_input_encrypt_128a');


    var associated_data = str_to_bin(add_data_input.value.trim())
    var plaintext = str_to_bin(ascii_input.value.trim())

    if (plaintext == undefined || plaintext.length == 0) {
        alert("Debes introducir unos datos para cifrar")
        return
    }else if (nonce_input.value.trim() == undefined || nonce_input.value.trim().length == 0) {
        alert("Debes introducir un nonce")
        return
    }else if (password_input.value.trim() == undefined || password_input.value.trim().length == 0) {
        alert("Debes introducir una clave")
        return
    }

    var [_, ciphered, tag] = ascon_128a_encrypt(plaintext, associated_data, password_input.value.trim(), nonce_input.value.trim())
    
    var tag_output = document.getElementById('tag_output_encrypted_128a');
    tag_output.value = tag


    var encrypted_output = document.getElementById('encrypted_output_128a');
    encrypted_output.value = ciphered
}

function ascon_128a_decrypt_demos() {
    var encrypted_input = document.getElementById('decrypted_input_128a');
    var add_data_input = document.getElementById('add_data_input_decrypt_128a');
    var password_input = document.getElementById('password_input_decrypt_128a');
    var nonce_input = document.getElementById('nonce_input_decrypt_128a');

    var associated_data = str_to_bin(add_data_input.value.trim())
    var ciphertext = encrypted_input.value.trim()
    var tag_input = document.getElementById('tag_input_decrypt_128a').value.trim();

    if (ciphertext == undefined || ciphertext.length == 0) {
        alert("Debes introducir los datos a descifrar")
        return
    } else if (tag_input == undefined || tag_input.length == 0) {
        alert("Debes introducir un tag")
        return
    }else if (nonce_input.value.trim() == undefined || nonce_input.value.trim().length == 0) {
        alert("Debes introducir un nonce")
        return
    }else if (password_input.value.trim() == undefined || password_input.value.trim().length == 0) {
        alert("Debes introducir una clave")
        return
    }

    if (current_status == 'bin') {
        if (! /^[01]+$/.test(ciphertext)) {
            alert("En el modo actual, los datos cifrados deben introducirse en binario")
            return
        }

        if (! /^[01]+$/.test(tag_input)) {
            alert("En el modo actual, el tag debe introducirse en binario")
            return
        }
    } else {
        if (! /^[A-Fa-f0-9]+$/.test(ciphertext)) {
            alert('En el modo actual, los datos cifrados introducirse en hexadecimal: solo utilizando caracteres del 0 al 9 y de la "a" a la "f"')
            return
        }

        if (! /^[A-Fa-f0-9]+$/.test(tag_input)) {
            alert('En el modo actual, el tag debe introducirse en hexadecimal: solo utilizando caracteres del 0 al 9 y de la "a" a la "f"')
            return
        }
    }

    if (current_status == 'hex') {
        var ciphertext = hex_to_bin(ciphertext)
    }
    
    var [_, decrypted, tag] = ascon_128a_decrypt(ciphertext, associated_data, password_input.value.trim(), nonce_input.value.trim())
    
    var tag_output = document.getElementById('tag_output_decrypted_128a');
    tag_output.value = tag

    if (tag != tag_input) {
        document.getElementById('tag_output_decrypted_128a').style.border = "10px solid #EF476F"
        decrypted = "El tag introducido no es el mismo al generado en el proceso de descifrado."
    } else {
        document.getElementById('tag_output_decrypted_128a').style.border = "10px solid #00916E"
        decrypted = bin_to_str(decrypted)
        for (let i = 0 ; i < decrypted.length ; i ++) {
            if (decrypted.charCodeAt(i) == 0) {
                decrypted = decrypted.substring(0,i-1)
                break
            }
        }
    }


    var encrypted_output = document.getElementById('decrypted_output_128a');
    encrypted_output.value = decrypted
}


function ascon_80pq_encrypt_demos() {
    var ascii_input = document.getElementById('ascii_input_80pq');
    var add_data_input = document.getElementById('add_data_input_encrypt_80pq');
    var password_input = document.getElementById('password_input_encrypt_80pq');
    var nonce_input = document.getElementById('nonce_input_encrypt_80pq');


    var associated_data = str_to_bin(add_data_input.value.trim())
    var plaintext = str_to_bin(ascii_input.value.trim())

    if (plaintext == undefined || plaintext.length == 0) {
        alert("Debes introducir unos datos para cifrar")
        return
    } else if (nonce_input.value.trim() == undefined || nonce_input.value.trim().length == 0) {
        alert("Debes introducir un nonce")
        return
    }else if (password_input.value.trim() == undefined || password_input.value.trim().length == 0) {
        alert("Debes introducir una clave")
        return
    }

    var [_, ciphered, tag] = ascon_80pq_encrypt(plaintext, associated_data, password_input.value.trim(), nonce_input.value.trim())
    
    var tag_output = document.getElementById('tag_output_encrypted_80pq');
    tag_output.value = tag


    var encrypted_output = document.getElementById('encrypted_output_80pq');
    encrypted_output.value = ciphered
}

function ascon_80pq_decrypt_demos() {
    var encrypted_input = document.getElementById('decrypted_input_80pq');
    var add_data_input = document.getElementById('add_data_input_decrypt_80pq');
    var password_input = document.getElementById('password_input_decrypt_80pq');
    var nonce_input = document.getElementById('nonce_input_decrypt_80pq');

    var associated_data = str_to_bin(add_data_input.value.trim())
    var ciphertext = encrypted_input.value.trim()
    var tag_input = document.getElementById('tag_input_decrypt_80pq').value.trim();

    if (ciphertext == undefined || ciphertext.length == 0) {
        alert("Debes introducir los datos a descifrar")
        return
    } else if (tag_input == undefined || tag_input.length == 0) {
        alert("Debes introducir un tag")
        return
    }else if (nonce_input.value.trim() == undefined || nonce_input.value.trim().length == 0) {
        alert("Debes introducir un nonce")
        return
    }else if (password_input.value.trim() == undefined || password_input.value.trim().length == 0) {
        alert("Debes introducir una clave")
        return
    }

    if (current_status == 'bin') {
        if (! /^[01]+$/.test(ciphertext)) {
            alert("En el modo actual, los datos cifrados deben introducirse en binario")
            return
        }

        if (! /^[01]+$/.test(tag_input)) {
            alert("En el modo actual, el tag debe introducirse en binario")
            return
        }
    } else {
        if (! /^[A-Fa-f0-9]+$/.test(ciphertext)) {
            alert('En el modo actual, los datos cifrados introducirse en hexadecimal: solo utilizando caracteres del 0 al 9 y de la "a" a la "f"')
            return
        }

        if (! /^[A-Fa-f0-9]+$/.test(tag_input)) {
            alert('En el modo actual, el tag debe introducirse en hexadecimal: solo utilizando caracteres del 0 al 9 y de la "a" a la "f"')
            return
        }
    }

    if (current_status == 'hex') {
        var ciphertext = hex_to_bin(ciphertext)
    }

    var [_, decrypted, tag] = ascon_80pq_decrypt(ciphertext, associated_data, password_input.value.trim(), nonce_input.value.trim())
    
    var tag_output = document.getElementById('tag_output_decrypted_80pq');
    tag_output.value = tag

    if (tag != tag_input) {
        document.getElementById('tag_output_decrypted_80pq').style.border = "10px solid #EF476F"
        decrypted = "El tag introducido no es el mismo al generado en el proceso de descifrado."
    } else {
        document.getElementById('tag_output_decrypted_80pq').style.border = "10px solid #00916E"
        decrypted = bin_to_str(decrypted)
        for (let i = 0 ; i < decrypted.length ; i ++) {
            if (decrypted.charCodeAt(i) == 0) {
                decrypted = decrypted.substring(0,i-1)
                break
            }
        }
    }


    var encrypted_output = document.getElementById('decrypted_output_80pq');
    encrypted_output.value = decrypted
}



function hash_demonstration() {
    var hash_ascii_input = document.getElementById('hash_ascii_input');

    if (hash_ascii_input.value.trim() == undefined || hash_ascii_input.value.trim().length == 0) {
        alert("Debes introducir los datos a resumir")
        return
    }

    var hash = ascon_hash(hash_ascii_input.value.trim())

    var hash_output = document.getElementById('hash_output');
    hash_output.value = hash
}

function hasha_demonstration() {
    var hasha_ascii_input = document.getElementById('hasha_ascii_input');

    if (hasha_ascii_input.value.trim() == undefined || hasha_ascii_input.value.trim().length == 0) {
        alert("Debes introducir los datos a resumir")
        return
    }

    var hasha = ascon_hasha(hasha_ascii_input.value.trim())

    var hasha_output = document.getElementById('hasha_output');
    hasha_output.value = hasha
}

function xof_demonstration() {
    var xof_ascii_input = document.getElementById('xof_ascii_input');

    if (xof_ascii_input.value.trim() == undefined || xof_ascii_input.value.trim().length == 0) {
        alert("Debes introducir los datos a resumir")
        return
    }


    var xof_length = document.getElementById('xof_output_length');

    var xof = ascon_xof(xof_ascii_input.value.trim(), parseInt(xof_length.value))

    var xof_output = document.getElementById('xof_output');
    xof_output.value = xof
}

function xofa_demonstration() {
    var xof_ascii_input = document.getElementById('xofa_ascii_input');

    if (xof_ascii_input.value.trim() == undefined || xof_ascii_input.value.trim().length == 0) {
        alert("Debes introducir los datos a resumir")
        return
    }

    var xofa_length = document.getElementById('xof_output_length');

    var xofa = ascon_xofa(xof_ascii_input.value.trim(), parseInt(xofa_length.value))

    var xofa_output = document.getElementById('xofa_output');
    xofa_output.value = xofa
}

function apply_sbox(s_array_tmp, sbox_parsed) {
    if (sbox_parsed == undefined) {
        sbox_parsed = sbox
    }
    var res = ['','','','','']
    for (var a = 0 ; a < 64 ; a++) {
        var bin_value_to_be_subtituded = ''
        for (var x = 0 ; x < 5 ; x++) {
            bin_value_to_be_subtituded += s_array_tmp[x][a]
        }

        var value_subtituded = sbox_parsed[bin_value_to_be_subtituded]
        for (var x = 0 ; x < 5 ; x++) {
            res[x] += value_subtituded[x]
        }
    }
    return res
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
/*
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
*/
function lin_layer_demostration() {
    var const1 = parseInt(document.getElementById('constante1').value);
    var const2 = parseInt(document.getElementById('constante2').value);

    var to_encrypt = document.getElementById('lin_layer_output').value.trim()
    if (! /^[01]+$/.test(to_encrypt)) {
        alert("Para probar la capa lineal debes introducir una cadena binaria")
        return
    }

    var encrypted = apply_lin_layer_custom_constants(to_encrypt, const1, const2)

    document.getElementById('lin_layer_output').value = encrypted
    
}

function round_function_demonstration() {
    var state = document.getElementById('internal_state_output_round_function').value.trim()
    if (state.length != 320) {
        alert("El estado debe de medir 320 bits")
        return
    } else if (! /^[01]{320}$/.test(state)) {
        alert("El estado debe de estar en binario")
        return
    }
    state = split_internal_state(state)

    const rounds = parseInt(document.getElementById('round_number').value)

    let my_sbox = {}
    for(let i = 0 ; i < 32 ; i++){
        let input_id = 'sbox_'+i
        let value = parseInt(document.getElementById(input_id).value)
        my_sbox[int_to_bin(i,5)] = int_to_bin(value,5)
    }

    let my_round_constants = new Array()
    for (let i = 0 ; i < 12 ; i++) {
        let input_id = 'cons_'+i
        let value = parseInt(document.getElementById(input_id).value)
        my_round_constants.push(int_to_bin(value,64))
    }

    let my_lin_constants = new Array()
    for (let i = 0 ; i < 10 ; i+=2) {
        let input_id = 'lin_cons_'+i
        let value1 = parseInt(document.getElementById(input_id).value)
        input_id = 'lin_cons_'+(i+1)
        let value2 = parseInt(document.getElementById(input_id).value)
        my_lin_constants.push([value1,value2])
    }

    for(let round = 0 ; round < rounds ; round++){
        state[2] = xor_arrays(state[2], my_round_constants[round])
        
        state = apply_sbox(state, my_sbox)

        state[0] = apply_lin_layer_custom_constants(state[0], my_lin_constants[0][0],my_lin_constants[0][1])
        state[1] = apply_lin_layer_custom_constants(state[1], my_lin_constants[1][0],my_lin_constants[1][1])
        state[2] = apply_lin_layer_custom_constants(state[2], my_lin_constants[2][0],my_lin_constants[2][1])
        state[3] = apply_lin_layer_custom_constants(state[3], my_lin_constants[3][0],my_lin_constants[3][1])
        state[4] = apply_lin_layer_custom_constants(state[4], my_lin_constants[4][0],my_lin_constants[4][1])
    }

    document.getElementById('internal_state_output_round_function').value = state[0] + state[1] + state[2] + state[3] + state[4]

}
current_status = 'bin'
inputs_to_convert = ['hash_output', 'hasha_output', 
    'internal_state_output', 'encrypted_output',
    'tag_output', 'encrypted_output_128', 'encrypted_output_128a', 
    'encrypted_output_80pq','tag_output_encrypted_128',
    'tag_output_encrypted_128a','tag_output_encrypted_80pq',
    'tag_output_decrypted_128','tag_output_decrypted_128a',
    'tag_output_decrypted_80pq']

buttons_to_convert_encrypt = 7
buttons_to_convert_decrypt = 3
textareas_to_convert_decrypt = ['decrypted_input_128', 'decrypted_input_128a', 'decrypted_input_80pq', 
    'decrypted_input_AEAD128_standard']
tags_to_convert_decrypt = ['tag_input_decrypt_128', 'tag_input_decrypt_128a', 'tag_input_decrypt_80pq',
    'tag_input_decrypt_AEAD128_standard']

inputs_little_endian = ['encrypted_output_AEAD128_standard', 'hash256_output']

function convert_to_hex_bin() {
    for (let i = 0 ; i < inputs_to_convert.length ; i++){
        let element = document.getElementById(inputs_to_convert[i])
        let content = element.value
        if (content == undefined || content.length == 0) {
            continue
        }
        if (current_status == 'bin') {
            element.value = bin_to_hex(content)
        } else {
            element.value = hex_to_bin(content)            
        }
    }

    for (let i = 0 ; i < inputs_little_endian.length ; i++){
        let element = document.getElementById(inputs_little_endian[i])
        let content = element.value
        if (content == undefined || content.length == 0) {
            continue
        }
        if (current_status == 'bin') {
            element.value = bin_to_hex_little_endian(content)
        } else {
            element.value = hex_to_bin_little_endian(content)            
        }
    }

    let element = document.getElementById('tag_output_encrypted_AEAD128_standard')
    content = element.value

    if (content != undefined && content.length != 0) {
        if (current_status == 'bin') {
            content = split_data(content,64)
            element.value = bin_to_hex_little_endian(content[0]) + bin_to_hex_little_endian(content[1])
        } else {
            content = split_data(content,16)
            element.value = hex_to_bin_little_endian(content[0]) + hex_to_bin_little_endian(content[1])            
        }
    }

    element = document.getElementById('tag_output_decrypted_AEAD128_standard')
    content = element.value

    if (content != undefined && content.length != 0) {
        if (current_status == 'bin') {
            content = split_data(content,64)
            element.value = bin_to_hex_little_endian(content[0]) + bin_to_hex_little_endian(content[1])
        } else {
            content = split_data(content,16)
            element.value = hex_to_bin_little_endian(content[0]) + hex_to_bin_little_endian(content[1])            
        }
    }

    if (current_status == 'bin') {
        current_status = 'hex'
        for (let i = 0 ; i < buttons_to_convert_encrypt ; i++){
            document.getElementById('change-coding-encryption-'+i).innerHTML = "Convertir a binario"
        }

        for (let i = 0 ; i < buttons_to_convert_decrypt ; i++){
            document.getElementById('change-input-code-'+i).innerHTML = "Introduce los datos en binario"
            document.getElementById(textareas_to_convert_decrypt[i]).placeholder = "Introduce los datos cifrados en hexadecimal:"
            document.getElementById(textareas_to_convert_decrypt[i]).pattern="^[A-Fa-f0-9]+$"
            document.getElementById(tags_to_convert_decrypt[i]).placeholder = "Introduce el tag en hexadecimal"
            document.getElementById(tags_to_convert_decrypt[i]).pattern="^[A-Fa-f0-9]+$"
        }

        document.getElementById('decrypted_input_AEAD128_standard').placeholder = "Introduce los datos cifrados en hexadecimal:"
        document.getElementById('decrypted_input_AEAD128_standard').pattern="^[A-Fa-f0-9]+$"
        document.getElementById('tag_input_decrypt_AEAD128_standard').placeholder = "Introduce el tag en hexadecimal"
        document.getElementById('tag_input_decrypt_AEAD128_standard').pattern="^[A-Fa-f0-9]+$"

        document.getElementById('change-coding-encryption-AEAD128').innerHTML = "Convertir a binario"
        document.getElementById('change-coding-encryption-Hash256').innerHTML = "Convertir a binario"
        document.getElementById('change-input-code-AEAD128').innerHTML = "Introduce los datos en binario"

    } else {
        current_status = 'bin'
        for (let i = 0 ; i < buttons_to_convert_encrypt ; i++){
            document.getElementById('change-coding-encryption-'+i).innerHTML = "Convertir a hexadecimal"
        }

        for (let i = 0 ; i < buttons_to_convert_decrypt ; i++){
            document.getElementById('change-input-code-'+i).innerHTML = "Introduce los datos en hexadecimal"
            document.getElementById(textareas_to_convert_decrypt[i]).placeholder = "Introduce los datos cifrados en binario"
            document.getElementById(textareas_to_convert_decrypt[i]).pattern="^[01]+$"
            document.getElementById(tags_to_convert_decrypt[i]).placeholder = "Introduce el tag en binario"
            document.getElementById(tags_to_convert_decrypt[i]).pattern="^[01]+$"
        }
        document.getElementById('decrypted_input_AEAD128_standard').placeholder = "Introduce los datos cifrados en binario"
        document.getElementById('decrypted_input_AEAD128_standard').pattern="^[01]+$"
        document.getElementById('tag_input_decrypt_AEAD128_standard').placeholder = "Introduce el tag en binario"
        document.getElementById('tag_input_decrypt_AEAD128_standard').pattern="^[01]+$"
        document.getElementById('change-coding-encryption-AEAD128').innerHTML = "Convertir a hexadecimal"
        document.getElementById('change-coding-encryption-Hash256').innerHTML = "Convertir a hexadecimal"
        document.getElementById('change-input-code-AEAD128').innerHTML = "Introduce los datos en hexadecimal"
    }
}
/*
    Funciones estado interno
*/


function internal_state_demonstration_aead() {
    var key_length = parseInt(document.getElementById('key_length').value);
    var block_length = parseInt(document.getElementById('block_length').value);
    var a_rounds_length = parseInt(document.getElementById('a_rounds_length').value);
    var b_rounds_length = parseInt(document.getElementById('b_rounds_length').value);

    var key = document.getElementById('password_input_internal_state').value;
    var nonce = document.getElementById('password_input_internal_state').value;

    var internal_state = create_internal_state(key_length, block_length, a_rounds_length,
        b_rounds_length, key, nonce
    )

    if (current_status == 'hex') {
        internal_state = bin_to_hex(internal_state)
    }

    var internal_state_output = document.getElementById('internal_state_output');
    internal_state_output.value = internal_state
}

function internal_state_demonstration_hash() {
    var hash_length = parseInt(document.getElementById('hash_length').value);
    var block_length = parseInt(document.getElementById('block_length').value);
    var a_rounds_length = parseInt(document.getElementById('a_rounds_length').value);
    var b_rounds_length = parseInt(document.getElementById('b_rounds_length').value);

    var internal_state = create_internal_state_hash(block_length, a_rounds_length,
        b_rounds_length, hash_length
    )
    if (current_status == 'hex') {
        internal_state = bin_to_hex(internal_state)
    }
    var internal_state_output = document.getElementById('internal_state_output');
    internal_state_output.value = internal_state
}


function internal_state_demonstration_set_ascon_128_values(){
    set_display_flex('key-length-display-demostracion-estado-interno')
    set_display_flex('password-display-demostracion-estado-interno')
    set_display_flex('nonce-display-demostracion-estado-interno')

    set_display_none('hash-length-display-demostracion-estado-interno')


    document.getElementById('key_length').value = 128
    document.getElementById('block_length').value = 64
    document.getElementById('a_rounds_length').value = 12
    document.getElementById('b_rounds_length').value = 6
    
}

function internal_state_demonstration_set_ascon_128a_values(){
    set_display_flex('key-length-display-demostracion-estado-interno')
    set_display_flex('password-display-demostracion-estado-interno')
    set_display_flex('nonce-display-demostracion-estado-interno')

    set_display_none('hash-length-display-demostracion-estado-interno')


    document.getElementById('key_length').value = 128
    document.getElementById('block_length').value = 128
    document.getElementById('a_rounds_length').value = 12
    document.getElementById('b_rounds_length').value = 8
}

function internal_state_demonstration_set_ascon_hash_values(){
    set_display_none('key-length-display-demostracion-estado-interno')
    set_display_none('password-display-demostracion-estado-interno')
    set_display_none('nonce-display-demostracion-estado-interno')

    set_display_flex('hash-length-display-demostracion-estado-interno')

    document.getElementById('block_length').value = 64
    document.getElementById('a_rounds_length').value = 12
    document.getElementById('b_rounds_length').value = 12
    document.getElementById('hash_length').value = 256
}

function internal_state_demonstration_set_ascon_hasha_values(){
    set_display_none('key-length-display-demostracion-estado-interno')
    set_display_none('password-display-demostracion-estado-interno')
    set_display_none('nonce-display-demostracion-estado-interno')

    set_display_flex('hash-length-display-demostracion-estado-interno')

    document.getElementById('block_length').value = 64
    document.getElementById('a_rounds_length').value = 12
    document.getElementById('b_rounds_length').value = 8
    document.getElementById('hash_length').value = 256
}

function internal_state_demonstration_set_ascon_xof_values(){
    set_display_none('key-length-display-demostracion-estado-interno')
    set_display_none('password-display-demostracion-estado-interno')
    set_display_none('nonce-display-demostracion-estado-interno')

    set_display_flex('hash-length-display-demostracion-estado-interno')

    document.getElementById('block_length').value = 64
    document.getElementById('a_rounds_length').value = 12
    document.getElementById('b_rounds_length').value = 12
    document.getElementById('hash_length').value = 0
}

function internal_state_demonstration_set_ascon_xofa_values(){
    set_display_none('key-length-display-demostracion-estado-interno')
    set_display_none('password-display-demostracion-estado-interno')
    set_display_none('nonce-display-demostracion-estado-interno')

    set_display_flex('hash-length-display-demostracion-estado-interno')

    document.getElementById('block_length').value = 64
    document.getElementById('a_rounds_length').value = 12
    document.getElementById('b_rounds_length').value = 8
    document.getElementById('hash_length').value = 0
}

function actv_or_desc_sbox_layer(){
    set_opposite_display('sbox-layer')

    let my_sbox = {}
    for(let i = 0 ; i < 32 ; i++){
        let input_id = 'sbox_'+i
        let value = parseInt(document.getElementById(input_id).value)
        my_sbox[int_to_bin(i,5)] = int_to_bin(value,5)
    }

    let tmp = my_sbox
    my_sbox = past_sbox
    past_sbox = tmp

    for(let i = 0 ; i < 32 ; i++){
        let input_id = 'sbox_'+i
        document.getElementById(input_id).value = parseInt(my_sbox[int_to_bin(i,5)],2)
    }


    if (document.getElementById("activar-desactivar-sbox-layer").innerHTML == "Desactivar") {
        document.getElementById("activar-desactivar-sbox-layer").innerHTML = "Activar"
    } else {
        document.getElementById("activar-desactivar-sbox-layer").innerHTML = "Desactivar"
    }
}

function actv_or_desc_consts_layer() {
    set_opposite_display('constants-layer')

    let my_round_constants = new Array()
    for (let i = 0 ; i < 12 ; i++) {
        let input_id = 'cons_'+i
        let value = parseInt(document.getElementById(input_id).value)
        my_round_constants.push(int_to_bin(value,64))
    }

    let tmp = my_round_constants
    my_round_constants = past_constants
    past_constants = tmp

    for (let i = 0 ; i < 12 ; i++) {
        let input_id = 'cons_'+i
        document.getElementById(input_id).value = parseInt(my_round_constants[i],2)
    }

    if (document.getElementById("activar-desactivar-cons-layer").innerHTML == "Desactivar") {
        document.getElementById("activar-desactivar-cons-layer").innerHTML = "Activar"
    } else {
        document.getElementById("activar-desactivar-cons-layer").innerHTML = "Desactivar"
    }
}

function actv_or_desc_lin_layer() {
    set_opposite_display('lin-layer')

    let my_lin_constants = new Array()
    for (let i = 0 ; i < 10 ; i+=2) {
        let input_id = 'lin_cons_'+i
        let value1 = parseInt(document.getElementById(input_id).value)
        input_id = 'lin_cons_'+(i+1)
        let value2 = parseInt(document.getElementById(input_id).value)
        my_lin_constants.push([value1,value2])
    }

    let tmp = my_lin_constants
    my_lin_constants = past_lin_layer
    past_lin_layer = tmp

    for (let i = 0 ; i < 10 ; i+=2) {
        let input_id = 'lin_cons_'+i
        document.getElementById(input_id).value = my_lin_constants[i/2][0]
        input_id = 'lin_cons_'+(i+1)
        document.getElementById(input_id).value = my_lin_constants[i/2][1]
    }

    if (document.getElementById("activar-desactivar-lin-layer").innerHTML == "Desactivar") {
        document.getElementById("activar-desactivar-lin-layer").innerHTML = "Activar"
    } else {
        document.getElementById("activar-desactivar-lin-layer").innerHTML = "Desactivar"
    }
}

/* 


*/

function show_ascon_128(){

    document.getElementById('Ascon-128-button').style.backgroundColor = "#00916E"
    document.getElementById('Ascon-128a-button').style.backgroundColor = "#352208"
    document.getElementById('Ascon-80pq-button').style.backgroundColor = "#352208"

    set_display_flex('prueba_ascon-128_cifrar')
    set_display_flex('prueba_ascon-128_descifrar')

    set_display_none('prueba_ascon-128a_cifrar')
    set_display_none('prueba_ascon-128a_descifrar')

    set_display_none('prueba_ascon-80pq_cifrar')
    set_display_none('prueba_ascon-80pq_descifrar')
}

function show_ascon_128a(){

    document.getElementById('Ascon-128a-button').style.backgroundColor = "#00916E"
    document.getElementById('Ascon-128-button').style.backgroundColor = "#352208"
    document.getElementById('Ascon-80pq-button').style.backgroundColor = "#352208"

    set_display_none('prueba_ascon-128_cifrar')
    set_display_none('prueba_ascon-128_descifrar')

    set_display_flex('prueba_ascon-128a_cifrar')
    set_display_flex('prueba_ascon-128a_descifrar')

    set_display_none('prueba_ascon-80pq_cifrar')
    set_display_none('prueba_ascon-80pq_descifrar')
}

function show_ascon_80pq(){
    document.getElementById('Ascon-80pq-button').style.backgroundColor = "#00916E"
    document.getElementById('Ascon-128a-button').style.backgroundColor = "#352208"
    document.getElementById('Ascon-128-button').style.backgroundColor = "#352208"

    set_display_none('prueba_ascon-128_cifrar')
    set_display_none('prueba_ascon-128_descifrar')

    set_display_none('prueba_ascon-128a_cifrar')
    set_display_none('prueba_ascon-128a_descifrar')

    set_display_flex('prueba_ascon-80pq_cifrar')
    set_display_flex('prueba_ascon-80pq_descifrar')
}

correct_one = -1

function generar_textareas_aleatorios_y_aead(){
    let first_random = gen_64_bits_random()
    let second_random = gen_64_bits_random()

    let password = gen_random_printable_string_128bits()
    let nonce = gen_random_printable_string_128bits()
    
    let add_data = str_to_bin(gen_random_printable_string_128bits())
    let ascii = str_to_bin(gen_random_printable_string_64bits())
    var k = 128;
    var r = 64;
    var a = 12;
    var b = 6;
    var s = create_internal_state(k, r, a, b, password, nonce);
    var s_splited = split_internal_state(s)
    var key_parts = get_key_parts(str_to_bin(password))
    s_splited = initialization_phase(s_splited, key_parts, a)
    s_splited = aditional_data_phase(s_splited, add_data, r, b)

    if (current_status == 'hex') {
        current_status = "bin"
        var [_, ciphered] = plaintext_phase(s_splited, ascii, r, b)
        current_status = "hex"
    } else {
        var [_, ciphered] = plaintext_phase(s_splited, ascii, r, b)
    }

    let position = Math.trunc(Math.random() * 1000) % 3
    
    document.getElementById('textarea_random_'+position).style.border = "4px solid #FFB17A"
    document.getElementById('textarea_random_'+position).innerHTML = first_random
    position = (position + 1) % 3   
    document.getElementById('textarea_random_'+position).style.border = "4px solid #FFB17A"
    document.getElementById('textarea_random_'+position).innerHTML = ciphered
    correct_one = position
    position = (position + 1) % 3
    document.getElementById('textarea_random_'+position).style.border = "4px solid #FFB17A"
    document.getElementById('textarea_random_'+position).innerHTML = second_random

    set_display_flex("explain_random_choose")
}

function desvelar_posicion_random_aead(){
    let incorrect_1, incorrect_2;
    switch (correct_one){
        case 0:
            incorrect_1 = 1
            incorrect_2 = 2
            break
        case 1:
            incorrect_1 = 0
            incorrect_2 = 2
            break
        case 2:
            incorrect_1 = 0
            incorrect_2 = 1
            break
    }

    document.getElementById('textarea_random_'+incorrect_1).style.border = "10px solid #EF476F"
    document.getElementById('textarea_random_'+correct_one).style.border = "10px solid #00916E"
    document.getElementById('textarea_random_'+incorrect_2).style.border = "10px solid #EF476F"
}