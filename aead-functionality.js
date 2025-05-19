function create_internal_state(key_length, block_length, 
    a_rounds_length, b_rounds_length, key, nonce) {

    var internal_state = int_to_bin(key_length)
    internal_state += int_to_bin(block_length) 
    internal_state += int_to_bin(a_rounds_length);
    internal_state += int_to_bin(b_rounds_length);

    for (var i = 0; i < (160 - key_length) ; i++) {
        internal_state += '0'
    }

    internal_state += str_to_bin(key)
    internal_state += str_to_bin(nonce)
    
    return internal_state
}

function initialization_phase(s_splited, key_parts, a) {

    // Apply permutation function a times
    s_splited = apply_rounds(s_splited, a)

    // Add 00..00password to internal state
    for (let i = 0 ; i < key_parts.length ; i++){
        //s_splited[3] = xor_arrays(s_splited[3],key_parts[0])
        s_splited[4-i] = xor_arrays(s_splited[4-i], key_parts[key_parts.length - 1 - i ])
    }

    return s_splited
}


function aditional_data_phase(s_splited, associated_data, r, b) {
    var parts = pad_and_split_data(associated_data, r)

    for (var e = 0; e < parts.length; e++) {
        var part = parts[e]
        s_splited[0] = xor_arrays(s_splited[0], part)

        s_splited = apply_rounds(s_splited, b)
    }

    var domain_separator = '0000000000000000000000000000000000000000000000000000000000000001'
    s_splited[4] = xor_arrays(s_splited[4],domain_separator)

    return s_splited
}

function aditional_data_phase_128(s_splited, associated_data, r, b) {
    if (r!=128) {
        alert("Se ha introducido el modo incorrecto")
    }
    var parts = pad_and_split_data(associated_data, r)
    parts = pad_and_split_data(parts.join(""), r/2)

    for (var e = 0; e < parts.length; e+=2) {
        s_splited[0] = xor_arrays(s_splited[0], parts[e])
        s_splited[1] = xor_arrays(s_splited[1], parts[e+1])

        s_splited = apply_rounds(s_splited, b)
    }

    var domain_separator = '0000000000000000000000000000000000000000000000000000000000000001'
    s_splited[4] = xor_arrays(s_splited[4],domain_separator)

    return s_splited
}

function plaintext_phase(s_splited, plaintext, r, b) {
    var original_length = plaintext.length
    var parts = pad_and_split_data(plaintext, r)
    var ciphered = '';
    for (var e = 0; e < parts.length; e++) {
        var part = parts[e]
        s_splited[0] = xor_arrays(s_splited[0], part)
        ciphered += s_splited[0]
        if (e != parts.length - 1 ){
            s_splited = apply_rounds(s_splited, b)
        }
    }

    ciphered = ciphered.substring(0,original_length)

    if (current_status == 'hex') {
        ciphered = bin_to_hex(ciphered)
        /*
        let value = split_data(ciphered, 8)
        let output = ''
        for (let a = 0 ; a < value.length ; a++){
            output += parseInt(value[a],2).toString(16)
        }
        ciphered = output
        */
    }

    return [s_splited, ciphered]
}

function plaintext_phase_128(s_splited, plaintext, r, b) {
    if (r!=128) {
        alert("Se ha introducido el modo incorrecto")
    }
    
    var original_length = plaintext.length
    var parts = pad_and_split_data(plaintext, r)
    parts = pad_and_split_data(parts.join(""), r/2)
    
    var ciphered = '';
    for (var e = 0; e < parts.length; e+=2) {
        s_splited[0] = xor_arrays(s_splited[0], parts[e])
        s_splited[1] = xor_arrays(s_splited[1], parts[e+1])
        ciphered += s_splited[0]
        ciphered += s_splited[1]
        if (e != parts.length - 2 ){
            s_splited = apply_rounds(s_splited, b)
        }
    }

    ciphered = ciphered.substring(0,original_length)

    if (current_status == 'hex') {
        ciphered = bin_to_hex(ciphered)
        /*
        let value = split_data(ciphered, 8)
        let output = ''
        for (let a = 0 ; a < value.length ; a++){
            output += parseInt(value[a],2).toString(16)
        }
        ciphered = output*/
    }

    return [s_splited, ciphered]
}

function ciphertext_phase(s_splited, plaintext, r, b) {
    var original_length = plaintext.length
    var parts = pad_and_split_data(plaintext, r)

    var plaintext = '';
    for (var e = 0; e < parts.length; e++) {
        var part = parts[e]
        if (e != parts.length - 1 ){
            plaintext += xor_arrays(s_splited[0], part)
    
            s_splited[0] = part
            s_splited = apply_rounds(s_splited, b)
        } else {
            plaintext += xor_arrays(s_splited[0], part)
            
            padding_encrypted = plaintext.substring(original_length, plaintext.length)
            part_without_padding = part.substring(0,part.length-padding_encrypted.length)
            part = part_without_padding+padding_encrypted
            s_splited[0] = part
        }
    }
    plaintext = plaintext.substring(0,original_length)

    return [s_splited, plaintext]
}

function ciphertext_phase_128(s_splited, plaintext, r, b) {
    if (r!=128) {
        alert("Se ha introducido el modo incorrecto")
    }
    
    var original_length = plaintext.length
    var parts = pad_and_split_data(plaintext, r)
    parts = pad_and_split_data(parts.join(""), r/2)
    

    var plaintext = '';
    
    for (var e = 0; e < parts.length; e+=2) {
        if (e != parts.length - 2 ){
            plaintext += xor_arrays(s_splited[0], parts[e])
            plaintext += xor_arrays(s_splited[1], parts[e+1])

            s_splited[0] = parts[e]
            s_splited[1] = parts[e+1]

            s_splited = apply_rounds(s_splited, b)
        } else {

            if (original_length < r/2) {
                
                plaintext += xor_arrays(s_splited[0], parts[e])
                
                
                padding_encrypted = plaintext.substring(original_length, plaintext.length)
                
                part_without_padding = parts[e].substring(0,parts[e].length-padding_encrypted.length)
                
                parts[e] = part_without_padding+padding_encrypted
                
                
                plaintext += xor_arrays(s_splited[1], parts[e+1])
                s_splited[0] = parts[e]
                //s_splited[1] = parts[e+1]
            } else {
                plaintext += xor_arrays(s_splited[0], parts[e])
                plaintext += xor_arrays(s_splited[1], parts[e+1])
    
                padding_encrypted = plaintext.substring(original_length, plaintext.length)
                part_without_padding = parts[e+1].substring(0,parts[e+1].length-padding_encrypted.length)
                parts[e+1] = part_without_padding+padding_encrypted
    
                s_splited[0] = parts[e]
                s_splited[1] = parts[e+1]
            }

        }
    }
    plaintext = plaintext.substring(0,original_length)
    

    return [s_splited, plaintext]
}

function finalization_phase(s_splited, key_parts_init, key_parts_final, a, r_state = 1) {
    for (let i = 0 ; i < key_parts_final.length ; i++){
        s_splited[r_state+i] = xor_arrays(s_splited[r_state+i],key_parts_final[i])
    }

    //s_splited[1] = xor_arrays(s_splited[1],key_parts[0])
    //s_splited[2] = xor_arrays(s_splited[2],key_parts[1])
    
    s_splited = apply_rounds(s_splited, a)
    
    for (let i = 0 ; i < key_parts_init.length ; i++){
        s_splited[4-i] = xor_arrays(s_splited[4-i], key_parts_init[key_parts_init.length - 1 - i])
    }

    //s_splited[3] = xor_arrays(s_splited[3],key_parts[0])
    //s_splited[4] = xor_arrays(s_splited[4],key_parts[1])
    var tag = ''
    tag+=s_splited[3]
    tag+=s_splited[4]

    if (current_status == 'hex') {
        tag = bin_to_hex(tag)
        /*
        let value = split_data(tag, 8)
        let output = ''
        for (let a = 0 ; a < value.length ; a++){
            output += parseInt(value[a],2).toString(16)
        }
        tag = output*/
    }

    return [s_splited, tag]
}

function ascon_128_encrypt(ascii, add_data, password, nonce) {
    if (password.length != 16){
        alert("En Ascon-128 la clave debe medir 16 caracteres o 128 bits.")
        return
    } else if (nonce.length != 16){
        alert("En Ascon-128 el nonce debe medir 16 caracteres o 128 bits.")
        return
    }
    var k = 128;
    var r = 64;
    var a = 12;
    var b = 6;
    var s = create_internal_state(k, r, a, b, password, nonce);

    var s_splited = split_internal_state(s)
    var key_parts = get_key_parts(str_to_bin(password))

    s_splited = initialization_phase(s_splited, key_parts, a)

    s_splited = aditional_data_phase(s_splited, add_data, r, b)
    
    var [s_splited, ciphered] = plaintext_phase(s_splited, ascii, r, b)
    var [s_splited, tag] = finalization_phase(s_splited, key_parts, key_parts, a)

    return [s_splited, ciphered, tag]
}

function ascon_128_decrypt(ascii, add_data, password, nonce) {
    if (password.length != 16){
        alert("En Ascon-128 la clave debe medir 16 caracteres o 128 bits.")
        return
    } else if (nonce.length != 16){
        alert("En Ascon-128 el nonce debe medir 16 caracteres o 128 bits.")
        return
    }
    var k = 128;
    var r = 64;
    var a = 12;
    var b = 6;
    var s = create_internal_state(k, r, a, b, password, nonce);

    var s_splited = split_internal_state(s)
    var key_parts = get_key_parts(str_to_bin(password))

    
    s_splited = initialization_phase(s_splited, key_parts, a)

    s_splited = aditional_data_phase(s_splited, add_data, r, b)
    
    var [s_splited, decrypted] = ciphertext_phase(s_splited, ascii, r, b)

    var [s_splited, tag] = finalization_phase(s_splited, key_parts, key_parts, a)

    return [s_splited, decrypted, tag]
}

function ascon_128a_encrypt(ascii, add_data, password, nonce) {
    if (password.length != 16){
        alert("En Ascon-128a la clave debe medir 16 caracteres o 128 bits.")
        return
    } else if (nonce.length != 16){
        alert("En Ascon-128a el nonce debe medir 16 caracteres o 128 bits.")
        return
    }

    var k = 128;
    var r = 128;
    var a = 12;
    var b = 8;
    var s = create_internal_state(k, r, a, b, password, nonce);

    var s_splited = split_internal_state(s)
    var key_parts = get_key_parts(str_to_bin(password))

    s_splited = initialization_phase(s_splited, key_parts, a)

    s_splited = aditional_data_phase_128(s_splited, add_data, r, b)
    
    var [s_splited, ciphered] = plaintext_phase_128(s_splited, ascii, r, b)
    var [s_splited, tag] = finalization_phase(s_splited, key_parts, key_parts, a, 2)

    return [s_splited, ciphered, tag]
}

function ascon_128a_decrypt(ascii, add_data, password, nonce) {
    if (password.length != 16){
        alert("En Ascon-128a la clave debe medir 16 caracteres o 128 bits.")
        return
    } else if (nonce.length != 16){
        alert("En Ascon-128a el nonce debe medir 16 caracteres o 128 bits.")
        return
    }
    var k = 128;
    var r = 128;
    var a = 12;
    var b = 8;
    var s = create_internal_state(k, r, a, b, password, nonce);

    var s_splited = split_internal_state(s)
    var key_parts = get_key_parts(str_to_bin(password))

    
    s_splited = initialization_phase(s_splited, key_parts, a)

    s_splited = aditional_data_phase_128(s_splited, add_data, r, b)
    
    var [s_splited, decrypted] = ciphertext_phase_128(s_splited, ascii, r, b)
    

    var [s_splited, tag] = finalization_phase(s_splited, key_parts, key_parts, a, 2)

    return [s_splited, decrypted, tag]
}

function ascon_80pq_encrypt(ascii, add_data, password, nonce) {
    if (password.length != 20){
        alert("En Ascon-80pq la clave debe medir 20 caracteres o 160 bits.")
        return
    } else if (nonce.length != 16){
        alert("En Ascon-80pq el nonce debe medir 16 caracteres o 128 bits.")
        return
    }
    var k = 160;
    var r = 64;
    var a = 12;
    var b = 6;
    var s = create_internal_state(k, r, a, b, password, nonce);

    var s_splited = split_internal_state(s)

    var key_parts_init = get_key_parts_80pq_initalization(str_to_bin(password))
    var key_parts_final = get_key_parts_80pq_finalization(str_to_bin(password))
    s_splited = initialization_phase(s_splited, key_parts_init, a)

    s_splited = aditional_data_phase(s_splited, add_data, r, b)
    
    var [s_splited, ciphered] = plaintext_phase(s_splited, ascii, r, b)

    
    var [s_splited, tag] = finalization_phase(s_splited, key_parts_init, key_parts_final, a)

    return [s_splited, ciphered, tag]
}

function ascon_80pq_decrypt(ascii, add_data, password, nonce) {
    if (password.length != 20){
        alert("En Ascon-80pq la clave debe medir 20 caracteres o 160 bits.")
        return
    } else if (nonce.length != 16){
        alert("En Ascon-80pq el nonce debe medir 16 caracteres o 128 bits.")
        return
    }
    var k = 160;
    var r = 64;
    var a = 12;
    var b = 6;
    var s = create_internal_state(k, r, a, b, password, nonce);

    var s_splited = split_internal_state(s)
    var key_parts_init = get_key_parts_80pq_initalization(str_to_bin(password))
    var key_parts_final = get_key_parts_80pq_finalization(str_to_bin(password))

    
    s_splited = initialization_phase(s_splited, key_parts_init, a)

    s_splited = aditional_data_phase(s_splited, add_data, r, b)
    
    var [s_splited, decrypted] = ciphertext_phase(s_splited, ascii, r, b)

    var [s_splited, tag] = finalization_phase(s_splited, key_parts_init, key_parts_final, a)

    return [s_splited, decrypted, tag]
}