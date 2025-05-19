
function gen_password_AEAD128_standard() {
    var new_pass = gen_random_printable_string_128bits()
    document.getElementById('password_input_encrypt_AEAD128_standard').value = new_pass
}

function gen_nonce_AEAD128_standard() {
    var new_pass = gen_random_printable_string_128bits()
    document.getElementById('nonce_input_encrypt_AEAD128_standard').value = new_pass
}

function show_ascon_AEAD128(){
    document.getElementById('Ascon-AEAD128-button').style.backgroundColor = "#00916E"
    document.getElementById('Ascon-Hash256-button').style.backgroundColor = "#352208"
    document.getElementById('Ascon-XOF128-button').style.backgroundColor = "#352208"
    document.getElementById('Ascon-CXOF128-button').style.backgroundColor = "#352208"

    set_display_flex('prueba_ascon-AEAD128_standard_cifrar')
    set_display_flex('prueba_ascon-AEAD128_standard_descifrar')

    set_display_none('prueba_ascon-hash256')
    set_display_none('prueba_ascon-xof128')
    set_display_none('prueba_ascon-cxof128')
}

function show_ascon_Hash256(){
    document.getElementById('Ascon-AEAD128-button').style.backgroundColor = "#352208"
    document.getElementById('Ascon-Hash256-button').style.backgroundColor = "#00916E"
    document.getElementById('Ascon-XOF128-button').style.backgroundColor = "#352208"
    document.getElementById('Ascon-CXOF128-button').style.backgroundColor = "#352208"

    set_display_none('prueba_ascon-AEAD128_standard_cifrar')
    set_display_none('prueba_ascon-AEAD128_standard_descifrar')

    set_display_flex('prueba_ascon-hash256')
    set_display_none('prueba_ascon-xof128')
    set_display_none('prueba_ascon-cxof128')
}

function show_ascon_XOF128(){
    document.getElementById('Ascon-AEAD128-button').style.backgroundColor = "#352208"
    document.getElementById('Ascon-Hash256-button').style.backgroundColor = "#352208"
    document.getElementById('Ascon-XOF128-button').style.backgroundColor = "#00916E"
    document.getElementById('Ascon-CXOF128-button').style.backgroundColor = "#352208"

    set_display_none('prueba_ascon-AEAD128_standard_cifrar')
    set_display_none('prueba_ascon-AEAD128_standard_descifrar')

    set_display_none('prueba_ascon-hash256')
    set_display_flex('prueba_ascon-xof128')
    set_display_none('prueba_ascon-cxof128')
}

function show_ascon_CXOF128(){
    document.getElementById('Ascon-AEAD128-button').style.backgroundColor = "#352208"
    document.getElementById('Ascon-Hash256-button').style.backgroundColor = "#352208"
    document.getElementById('Ascon-XOF128-button').style.backgroundColor = "#352208"
    document.getElementById('Ascon-CXOF128-button').style.backgroundColor = "#00916E"

    set_display_none('prueba_ascon-AEAD128_standard_cifrar')
    set_display_none('prueba_ascon-AEAD128_standard_descifrar')

    set_display_none('prueba_ascon-hash256')
    set_display_none('prueba_ascon-xof128')
    set_display_flex('prueba_ascon-cxof128')
}

/* COMMON */
function ascon_check_inputs_encrypt(plaintext, nonce, password){
    if (plaintext == undefined || plaintext.length == 0) {
        alert("Debes introducir unos datos para cifrar")
        return false
    } else if (nonce == undefined || nonce.length == 0) {
        alert("Debes introducir un nonce")
        return false
    }else if (password == undefined || password.length == 0) {
        alert("Debes introducir una clave")
        return false
    }
    return true
}

function ascon_check_inputs_decrypt(ciphertext, tag_input, nonce, password){
    if (ciphertext == undefined || ciphertext.length == 0) {
        alert("Debes introducir los datos a descifrar")
        return false
    } else if (tag_input == undefined || tag_input.length == 0) {
        alert("Debes introducir un tag")
        return false
    }else if (nonce == undefined || nonce.length == 0) {
        alert("Debes introducir un nonce")
        return false
    }else if (password == undefined || password.length == 0) {
        alert("Debes introducir una clave")
        return false
    }
    return true
}

function ascon_check_format_decrypt(ciphertext, tag_input) {
    if (current_status == 'bin') {
        if (! /^[01]+$/.test(ciphertext)) {
            alert("En el modo actual, los datos cifrados deben introducirse en binario")
            return false
        }

        if (! /^[01]+$/.test(tag_input)) {
            alert("En el modo actual, el tag debe introducirse en binario")
            return false
        }
    } else {
        if (! /^[A-Fa-f0-9]+$/.test(ciphertext)) {
            alert('En el modo actual, los datos cifrados introducirse en hexadecimal: solo utilizando caracteres del 0 al 9 y de la "a" a la "f"')
            return false
        }

        if (! /^[A-Fa-f0-9]+$/.test(tag_input)) {
            alert('En el modo actual, el tag debe introducirse en hexadecimal: solo utilizando caracteres del 0 al 9 y de la "a" a la "f"')
            return false
        }
    }
    return true
}

function ascon_decrypt_check_tag(tag, tag_input, decrypted, tag_output_id, is_little_endian = false) {
    if (tag != tag_input) {
        document.getElementById(tag_output_id).style.border = "10px solid #EF476F"
        decrypted = "El tag introducido no es el mismo al generado en el proceso de descifrado."
    } else {
        document.getElementById(tag_output_id).style.border = "10px solid #00916E"
        if (is_little_endian) {
            decrypted = bin_to_str_little_endian(decrypted)
        } else {
            decrypted = bin_to_str(decrypted)
        }
        for (let i = 0 ; i < decrypted.length ; i ++) {
            if (decrypted.charCodeAt(i) == 0) {
                decrypted = decrypted.substring(0,i-1)
                break
            }
        }
    }
    return decrypted
}

function hex_to_bin_little_endian(hex_in) {
    let value = split_data(hex_in, 2)
    let output = ''
    for (let a = value.length-1 ; a >=0 ; a--){
        output += int_to_bin(parseInt(value[a],16))
    }
    return output
}

function bin_to_hex_little_endian(bin_in) {
    let value = split_data(bin_in, 8)
    
    let output = ''
    for (let a = value.length-1 ; a >= 0 ; a--){
        let hex_value = parseInt(value[a],2).toString(16)
        if (hex_value.length < 2) {            
            hex_value = "0"+hex_value
        }
        output += hex_value
    }
    return output
}


function bin_to_str_little_endian(str) {
    var result = '';

    var bin_nums = split_data(str, 8)
    for (var i=bin_nums.length-1; i>=0; i--) {
        result += String.fromCharCode(parseInt(bin_nums[i],2))
    }

    return result;
}

function str_to_bin_little_endian(str) {
    var result = '';

    for (var i=str.length-1; i>=0; i--) {
        result += int_to_bin(str.charCodeAt(i))
    }
    return result;
}

function str_to_bin_little_endian_with_r(str, r) {
    str = split_data(str,r)

    for (var i=0; i<str.length; i++) {
        if (i == str.length-1) {
            str[i] = str[i].replaceAll("undefined","")
            str[i] = str_to_bin_little_endian(str[i])

        } else{

            str[i] = str_to_bin_little_endian(str[i])
        }
    }

    return str.join("");
}


function pad_and_split_data_little_endian(data_to_split, r, just_zeros = false) {
    if (data_to_split == undefined || data_to_split.length == 0) {
        return [""]
    }
    parts = split_data(data_to_split, r)

    parts[parts.length - 1] = parts[parts.length - 1].replaceAll("undefined","")

    if (parts[parts.length - 1].length % r != 0) {
        if (!just_zeros){
            parts[parts.length - 1] = '1' + parts[parts.length - 1]
        }
        while ( parts[parts.length - 1].length % r != 0) {
            parts[parts.length - 1] = '0' + parts[parts.length - 1]
        }
    }

    return parts;
}

/* AEAD */
function ascon_AEAD128_standard_encrypt_demos() {
    var plaintext = str_to_bin_little_endian_with_r(document.getElementById('ascii_input_AEAD128_standard').value.trim(),64/8);
    var associated_data = str_to_bin_little_endian_with_r(document.getElementById('add_data_input_encrypt_AEAD128_standard').value.trim(),64/8);
    var password = document.getElementById('password_input_encrypt_AEAD128_standard').value.trim();
    var nonce = document.getElementById('nonce_input_encrypt_AEAD128_standard').value.trim();

    if (!ascon_check_inputs_encrypt(plaintext, nonce, password)) {
        return
    }
    var [_, ciphered, tag] = ascon_AEAD128_standard_encrypt(plaintext, associated_data, password, nonce)
    var tag_output = document.getElementById('tag_output_encrypted_AEAD128_standard');
    tag_output.value = tag


    var encrypted_output = document.getElementById('encrypted_output_AEAD128_standard');
    encrypted_output.value = ciphered
}

function ascon_AEAD128_standard_decrypt_demos() {
    var ciphertext = document.getElementById('decrypted_input_AEAD128_standard').value.trim();
    var associated_data = str_to_bin_little_endian_with_r(document.getElementById('add_data_input_decrypt_AEAD128_standard').value.trim(), 64/8);
    var password = document.getElementById('password_input_decrypt_AEAD128_standard').value.trim();
    var nonce = document.getElementById('nonce_input_decrypt_AEAD128_standard').value.trim();
    var tag_input = document.getElementById('tag_input_decrypt_AEAD128_standard').value.trim();

    if (!ascon_check_inputs_decrypt(ciphertext, tag_input, nonce, password)) {
        return
    }

    if (!ascon_check_format_decrypt(ciphertext, tag_input)) {
        return
    }

    if (current_status == 'hex') {
        var ciphertext = hex_to_bin_little_endian(ciphertext)
    }
    
    var [_, decrypted, tag] = ascon_AEAD128_standard_decrypt(ciphertext, associated_data, password, nonce)
    
    var tag_output = document.getElementById('tag_output_decrypted_AEAD128_standard');
    tag_output.value = tag

    decrypted = ascon_decrypt_check_tag(tag, tag_input, decrypted, 'tag_output_decrypted_AEAD128_standard', true)

    var encrypted_output = document.getElementById('decrypted_output_AEAD128_standard');
    encrypted_output.value = decrypted
}


function aditional_data_phase_128_standard(s_splited, associated_data, r, b) {
    if (r!=128) {
        alert("Se ha introducido el modo incorrecto")
    }
    var parts = pad_and_split_data_little_endian(associated_data, r/2)
    parts = pad_and_split_data_little_endian(parts.join(""), r)
    parts = split_data(parts.join(""),64)

    for (var e = 0; e < parts.length; e+=2) {
        s_splited[0] = xor_arrays(s_splited[0], parts[e])
        s_splited[1] = xor_arrays(s_splited[1], parts[e+1])

        s_splited = apply_rounds(s_splited, b)
    }

    var domain_separator = '1000000000000000000000000000000000000000000000000000000000000000'
    s_splited[4] = xor_arrays(s_splited[4],domain_separator)

    return s_splited
}


function plaintext_phase_128_standard(s_splited, plaintext, r, b) {
    if (r!=128) {
        alert("Se ha introducido el modo incorrecto")
    }
    
    var original_length = plaintext.length
    
    var parts = pad_and_split_data_little_endian(plaintext, r/2)
    if (plaintext.length % (r/2) == 0 ) {
        parts.push("0000000000000000000000000000000000000000000000000000000000000001")
    }  else if (original_length % r == 0) {
        parts.push("0000000000000000000000000000000000000000000000000000000000000000")
        parts.push("0000000000000000000000000000000000000000000000000000000000000000")
    }
    if (parts.length % 2 != 0) {
        parts.push("0000000000000000000000000000000000000000000000000000000000000000")
    }
    
    var ciphered = '';
    for (var e = 0; e < parts.length; e+=2) {
        if (e != parts.length - 2 ){
            s_splited[0] = xor_arrays(s_splited[0], parts[e])
            s_splited[1] = xor_arrays(s_splited[1], parts[e+1])
            ciphered = s_splited[0] + ciphered
            ciphered = s_splited[1] + ciphered
            s_splited = apply_rounds(s_splited, b)
        } else {
            s_splited[0] = xor_arrays(s_splited[0], parts[e])
            s_splited[1] = xor_arrays(s_splited[1], parts[e+1])
            if ((original_length % 128) < 64){
                ciphered = s_splited[0].substring(64 - (original_length % 64),64) + ciphered
            } else {
                ciphered = s_splited[0].substring(64-64,64) + ciphered
            }

            if ((original_length % 128) > 64) {
                ciphered = s_splited[1].substring(64 - (original_length % 64),64) + ciphered

            }
            
        }
    }

    if (current_status == 'hex') {
        ciphered = bin_to_hex_little_endian(ciphered)
    }

    return [s_splited, ciphered]
}

function ciphertext_phase_128_standard(s_splited, plaintext, r, b) {
    if (r!=128) {
        alert("Se ha introducido el modo incorrecto")
    }
    
    var original_length = plaintext.length

    if (plaintext.length % r == 0) {
        plaintext = "0000000000000000000000000000000000000000000000000000000000000000" + plaintext
        plaintext = "0000000000000000000000000000000000000000000000000000000000000000" + plaintext
    } else {
        while (plaintext.length % r != 0) {
            plaintext="0"+plaintext
        }
    }
    var parts = pad_and_split_data_little_endian(plaintext, r/2).reverse()

    var plaintext = '';    
    for (var e = 0; e < parts.length; e+=2) {
        if (e != parts.length - 2 ){
            plaintext = xor_arrays(s_splited[0], parts[e]) + plaintext
            plaintext = xor_arrays(s_splited[1], parts[e+1]) + plaintext

            s_splited[0] = parts[e]
            s_splited[1] = parts[e+1]

            s_splited = apply_rounds(s_splited, b)
        } else {

            if ((original_length % r) < r/2) {

                var to_add = xor_arrays(s_splited[0], parts[e])
                var added_bit = "0"
                if (to_add[64-(original_length % r) -1] == "0") {
                    added_bit = "1"
                }
                
                to_add_splitted = to_add.substring(64-(original_length % r), to_add.length)
                plaintext = to_add_splitted + plaintext
                

                padding_encrypted = to_add.substring(0, 64-(original_length % r)-1)
                part_without_padding = parts[e].substring(padding_encrypted.length+1, 64)
                parts[e] = padding_encrypted + added_bit + part_without_padding
                s_splited[0] = parts[e]
            } else {
                to_add = xor_arrays(s_splited[1], parts[e+1])
                to_add += xor_arrays(s_splited[0], parts[e])
                
                var tmp = xor_arrays(s_splited[1], parts[e+1])
                var added_bit = "0"
                if (original_length % r == 64) {
                    if (tmp[63] == "0") {
                        added_bit = "1"
                    }
                } else if (tmp[128-(original_length % r)-1] == "0") {
                    added_bit = "1"
                }

                to_add_splitted = to_add.substring(to_add.length-(original_length % r), to_add.length)
                plaintext = to_add_splitted + plaintext
    
                padding_encrypted = to_add.substring(0, 128 - (original_length % r) -1)

                part_without_padding = parts[e+1].substring(padding_encrypted.length+1, 64)
                parts[e+1] = padding_encrypted+added_bit+part_without_padding
                s_splited[0] = parts[e]
                s_splited[1] = parts[e+1]
            }

        }
    }
    
    return [s_splited, plaintext]
}

function finalization_phase_standard(s_splited, key_parts_init, key_parts_final, a, r_state = 1) {
    
    for (let i = 0 ; i < key_parts_final.length ; i++){
        console.log(key_parts_final[i])
        s_splited[r_state+i] = xor_arrays(s_splited[r_state+i],key_parts_final[i])
    }
    s_splited = apply_rounds(s_splited, a)
    
    for (let i = 0 ; i < key_parts_init.length ; i++){
        s_splited[4-i] = xor_arrays(s_splited[4-i], key_parts_init[key_parts_init.length - 1 - i])
    }

    var tag = ''
    tag+= s_splited[3]
    tag+= s_splited[4]

    if (current_status == 'hex') {
        tag = ''
        tag+= bin_to_hex_little_endian(s_splited[3])
        tag+= bin_to_hex_little_endian(s_splited[4])
    }

    return [s_splited, tag]
}

function ascon_AEAD128_standard_encrypt(ascii, add_data, key, nonce) {
    if (key.length != 16){
        alert("En Ascon-AEAD128 la clave debe medir 16 caracteres o 128 bits.")
        return
    } else if (nonce.length != 16){
        alert("En Ascon-AEAD128 el nonce debe medir 16 caracteres o 128 bits.")
        return
    }

    key = split_data(key,8)
    key = key[1] + key[0]

    nonce = split_data(nonce,8)
    nonce = nonce[1] + nonce[0]

    var k = 128;
    var r = 128;
    var a = 12;
    var b = 8;
    var s = "0000000000000000000100000000000010000000100011000000000000000001" + str_to_bin_little_endian(key) + str_to_bin_little_endian(nonce) // standard
    var s_splited = split_internal_state(s)
    var key_parts = get_key_parts(str_to_bin_little_endian(key))

    s_splited = initialization_phase(s_splited, key_parts, a)

    s_splited = aditional_data_phase_128_standard(s_splited, add_data, r, b, true)


    var [s_splited, ciphered] = plaintext_phase_128_standard(s_splited, ascii, r, b, true)

    var [s_splited, tag] = finalization_phase_standard(s_splited, key_parts, key_parts, a, 2, true)

    return [s_splited, ciphered, tag]
}

function ascon_AEAD128_standard_decrypt(ascii, add_data, key, nonce) {
    if (key.length != 16){
        alert("En Ascon-AEAD128 la clave debe medir 16 caracteres o 128 bits.")
        return
    } else if (nonce.length != 16){
        alert("En Ascon-AEAD128 el nonce debe medir 16 caracteres o 128 bits.")
        return
    }

    key = split_data(key,8)
    key = key[1] + key[0]

    nonce = split_data(nonce,8)
    nonce = nonce[1] + nonce[0]

    var k = 128;
    var r = 128;
    var a = 12;
    var b = 8;
    var s = "0000000000000000000100000000000010000000100011000000000000000001" + str_to_bin_little_endian(key) + str_to_bin_little_endian(nonce) // standard

    var s_splited = split_internal_state(s)
    var key_parts = get_key_parts(str_to_bin_little_endian(key))

    
    s_splited = initialization_phase(s_splited, key_parts, a)

    s_splited = aditional_data_phase_128_standard(s_splited, add_data, r, b, true)

    var [s_splited, decrypted] = ciphertext_phase_128_standard(s_splited, ascii, r, b, true)

    var [s_splited, tag] = finalization_phase_standard(s_splited, key_parts, key_parts, a, 2, true)

    return [s_splited, decrypted, tag]
}

/* HASH */
function hash256_demonstration() {
    var ascii_input = document.getElementById('hash256_ascii_input');

    if (ascii_input.value.trim() == undefined || ascii_input.value.trim().length == 0) {
        alert("Debes introducir los datos a resumir")
        return
    }

    var hash = ascon_hash_256(ascii_input.value.trim())

    var hash_output = document.getElementById('hash256_output');
    hash_output.value = hash
}

function xof128_demonstration() {
    var ascii_input = document.getElementById('xof128_ascii_input');

    if (ascii_input.value.trim() == undefined || ascii_input.value.trim().length == 0) {
        alert("Debes introducir los datos a resumir")
        return
    }

    var xof_length = document.getElementById('xof128_output_length');
    var xof = ascon_XOF_128(ascii_input.value.trim(), parseInt(xof_length.value))

    var xof_output = document.getElementById('xof128_output');
    xof_output.value = xof
}

function cxof128_demonstration() {
    var ascii_input = document.getElementById('cxof128_ascii_input');
    var custom_input = document.getElementById('cxof128_custom_input');

    if (ascii_input.value.trim() == undefined || ascii_input.value.trim().length == 0) {
        alert("Debes introducir los datos a resumir")
        return
    }

    if (custom_input.value.trim().length > 256) {
        alert("Los datos para personalizar no pueden medir más de 256 caracteres")
        return
    }

    var cxof_length = document.getElementById('cxof128_output_length');

    var cxof = ascon_CXOF_128(ascii_input.value.trim(), custom_input.value.trim(), parseInt(cxof_length.value))

    var cxof_output = document.getElementById('cxof128_output');
    cxof_output.value = cxof
}


function absorb_phase_hash_standard(s_splited, data, r, a) {
    if (data.length % r != 0) {
        data = "1" + data
        while (data.length % r != 0) {
            data = "0" + data
        }
    } else {
        data = "0000000000000000000000000000000000000000000000000000000000000001" + data
    }
    var parts = split_data(data, r).reverse();console.log(parts)

    for (var e = 0; e < parts.length; e++) {
        var part = parts[e]
        s_splited[0] = xor_arrays(s_splited[0], part)
        s_splited = apply_rounds(s_splited, a)
    }

    return s_splited
}


function customization_phase_hash_standard(s_splited, data, r, a) {
    var length_in_bytes = int_to_bin(data.length)
    
    while (length_in_bytes.length < 64) {
        length_in_bytes = "0" + length_in_bytes
    }

    data = data + length_in_bytes
    if (data.length % r != 0) {
        data = "1" + data
        while (data.length % r != 0) {
            data = "0" + data
        }
    } else {
        data = "0000000000000000000000000000000000000000000000000000000000000001" + data
    }
    var parts = split_data(data, r).reverse();console.log(parts)

    for (var e = 0; e < parts.length; e++) {
        var part = parts[e]
        s_splited[0] = xor_arrays(s_splited[0], part)
        s_splited = apply_rounds(s_splited, a)
    }

    return s_splited
}


function squeeze_phase_hash_standard(s_splited, a, b, l, r, isxof) {
    var hash = ''
    for (var i = 0 ; i < Math.ceil(l/r) ; i++){
        hash = s_splited[0] + hash
        s_splited = apply_rounds(s_splited,b)
    }

    if (isxof == undefined || isxof == false) {
        if (current_status == 'hex') {
            hash = bin_to_hex_little_endian(hash)
        }
    } else {
        hash = hash.substring(hash.length-l,hash.length)
    }

    return hash;
}


function ascon_hash_256(ascii) {
    var h = 256;
    var a = 12;
    var b = 12;
    var r = 64;

    var s = "00000000000000000000100000000001000000001100110000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    var s_splited = split_internal_state(s)
    
    s_splited = initialization_phase_hash(s_splited, a)
    s_splited = absorb_phase_hash_standard(s_splited, str_to_bin_little_endian(ascii), r, b)

    var hash = squeeze_phase_hash_standard(s_splited, a, b, h, r, false)

    return hash
}

function ascon_XOF_128(ascii, h) {
    var a = 12;
    var b = 12;
    var r = 64;

    var s = "00000000000000000000100000000000000000001100110000000000000000110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    var s_splited = split_internal_state(s)

    s_splited = initialization_phase_hash(s_splited, a)
    s_splited = absorb_phase_hash_standard(s_splited, str_to_bin_little_endian(ascii), r, b)

    var hash = squeeze_phase_hash_standard(s_splited, a, b, h, r, true)

    return hash
}

function ascon_CXOF_128(ascii, custom, h) {
    var a = 12;
    var b = 12;
    var r = 64;

    var s = "00000000000000000000100000000000000000001100110000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    var s_splited = split_internal_state(s)
    

    s_splited = initialization_phase_hash(s_splited, a)
    
    s_splited = customization_phase_hash_standard(s_splited, str_to_bin_little_endian(custom), r, b)

    s_splited = absorb_phase_hash_standard(s_splited, str_to_bin_little_endian(ascii), r, b)

    var hash = squeeze_phase_hash_standard(s_splited, a, b, h, r, true)

    return hash
}