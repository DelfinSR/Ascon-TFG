import numpy as np

# ascon
sbox_array = [0x4,0xb,0x1f,0x14,0x1a,0x15,0x9,0x2,0x1b,0x5,0x8,0x12,0x1d,0x3,0x6,0x1c,0x1e,0x13,0x7,0xe,0x0,0xd,0x11,0x18,0x10,0xc,0x1,0x19,0x16,0xa,0xf,0x17]

#fides
#sbox_array = [1,0,25,26,17,29,21,27,20,5,4,23,14,18,2,28,15,8,6,3,13,7,24,16,30,9,31,10,22,12,11,19]

round_constant = [0xf0,0xe1,0xd2,0xc3,0xb4,0xa5,0x96,0x87,0x78,0x69,0x5a,0x4b]

def calc_AFN(f_x):
    test_table = {}
    values = ["00000","10000","01000","11000","00100","10100","01100","11100",
    "00010","10010","01010","11010","00110","10110","01110","11110",
    "00001","10001","01001","11001","00101","10101","01101","11101",
    "00011","10011","01011","11011","00111","10111","01111","11111"]
    for x in range(32):
        test_table[values[x]] = f_x[x]

        
    f0 = [0]*32
    for x in range(32//2):
        f0[x] = f_x[x]
        f0[(32//2)+x] = f_x[x] ^ f_x[(32//2)+x]

    f1 = [0]*32
    for x in range(16//2):
        f1[x] = f0[x]
        f1[(16//2)+x] = f0[x] ^ f0[(16//2)+x]

    for x in range(16//2):
        f1[16+x] = f0[16+x]
        f1[16+(16//2)+x] = f0[16+x] ^ f0[16+(16//2)+x]



    f2 = [0]*32
    for x in range(8//2):
        f2[x] = f1[x]
        f2[(8//2)+x] = f1[x] ^ f1[(8//2)+x]

    for x in range(8//2):
        f2[8+x] = f1[8+x]
        f2[8+(8//2)+x] = f1[8+x] ^ f1[8+(8//2)+x]

    for x in range(8//2):
        f2[16+x] = f1[16+x]
        f2[16+(8//2)+x] = f1[16+x] ^ f1[16+(8//2)+x]

    for x in range(8//2):
        f2[16+8+x] = f1[16+8+x]
        f2[16+8+(8//2)+x] = f1[16+8+x] ^ f1[16+8+(8//2)+x]
        


    f3 = [0]*32
    for x in range(2):
        f3[x] = f2[x]
        f3[(2)+x] = f2[x] ^ f2[(2)+x]

    for x in range(2):
        f3[4+x] = f2[4+x]
        f3[4+(2)+x] = f2[4+x] ^ f2[4+(2)+x]
    # 8 completado

    for x in range(2):
        f3[8+x] = f2[8+x]
        f3[8+(2)+x] = f2[8+x] ^ f2[8+(2)+x]

    for x in range(2):
        f3[8+4+x] = f2[8+4+x]
        f3[8+4+(2)+x] = f2[8+4+x] ^ f2[8+4+(2)+x]
    # 16 completado

    for x in range(2):
        f3[16+x] = f2[16+x]
        f3[16+(2)+x] = f2[16+x] ^ f2[16+(2)+x]

    for x in range(2):
        f3[16+4+x] = f2[16+4+x]
        f3[16+4+(2)+x] = f2[16+4+x] ^ f2[16+4+(2)+x]

    for x in range(2):
        f3[16+8+x] = f2[16+8+x]
        f3[16+8+(2)+x] = f2[16+8+x] ^ f2[16+8+(2)+x]

    for x in range(2):
        f3[16+8+4+x] = f2[16+8+4+x]
        f3[16+8+4+(2)+x] = f2[16+8+4+x] ^ f2[16+8+4+(2)+x]

    f4 = [0]*32
    for x in range(0,32,2):
        f4[x] = f3[x]
        f4[x+1] = f3[x] ^ f3[x+1]

    AFN = []
    for index,x in enumerate(f4):
        if x:
            AFN.append([int(x) for x in values[index]][::-1])

    result = get_results_of_AFN(AFN)
    if f_x != result:
        print("ERROR")
        AFN.append([0,0,0,0,0])
    return AFN

def get_results_of_AFN(AFN_func):
    res = []
    for x_i in range(32):
        x_bits = [int(x) for x in '{0:05b}'.format(x_i)]

        xor_result = 0
        xu = []
        for f in AFN_func:
            if f == [0,0,0,0,0]:
                xor_result = 1
                continue
            xu.append(calculate_power_u(x_bits, f))
        
        result = 0
        for _,x in enumerate(xu):
            r = 1
            for y in x:
                r &= y
            result ^= r

        res.append(result ^ xor_result)
    return res

def get_results_of_AFN_input_sbox(AFN_func):
    res = []
    for x_i in range(32):
        x_bits = [int(x) for x in '{0:05b}'.format(sbox_array[x_i])]

        xor_result = 0
        xu = []
        for f in AFN_func:
            if f == [0,0,0,0,0]:
                xor_result = 1
                continue
            xu.append(calculate_power_u(x_bits, f))
        
        result = 0
        for _,x in enumerate(xu):
            r = 1
            for y in x:
                r &= y
            result ^= r
        res.append(result ^ xor_result)
    return res

def check_if_invariant_is_a_sbox_componente(AFN_func):
    invariant_results = get_results_of_AFN_input_sbox(AFN_func)

    sbox_bin = [[int(zz) for zz in '{0:05b}'.format(sbox_array[x_i])] for x_i in range(32)]

    value0 = [s_val[0] for s_val in sbox_bin]
    value1 = [s_val[1] for s_val in sbox_bin]
    value2 = [s_val[2] for s_val in sbox_bin]
    value3 = [s_val[3] for s_val in sbox_bin]
    value4 = [s_val[4] for s_val in sbox_bin]

    return invariant_results == value0 or invariant_results == value1 or invariant_results == value2 or invariant_results == value3 or invariant_results == value3

def check_if_is_invariant(AFN_func):
    AFN_normal_result = get_results_of_AFN(AFN_func)
    AFN_sbox_result = get_results_of_AFN_input_sbox(AFN_func)

    last_result=-1
    passed=True
    for x in range(32):
        calc = AFN_normal_result[x] ^ AFN_sbox_result[x]
        if last_result == -1:
            last_result = calc
        else:
            if last_result != calc:
                passed = False
                break
    return passed

def calculate_power_u(i_bits, bits):
    res = []
    for index, x in enumerate(bits):
        if x:
            res.append(i_bits[index])

    if res == []:
        return [0]	
    return res

def calculate_power_u_and_return_integer(i_bits, bits):
    power_u_result = calculate_power_u(i_bits, bits)
    return int("".join([str(x) for x in power_u_result]),2)

def calculate_power_u_and_xor_numbers(i_bits, bits):
    power_u_result = calculate_power_u(i_bits, bits)
    res = 0
    for x in power_u_result:
        res ^= x
    return res	

def calculate_power_u_and_do_and(i_bits, bits):
    power_u_result = calculate_power_u(i_bits, bits)
    res = 1
    for x in power_u_result:
        res &= x
    return res

def calc_pctr_of_coincidence(arr1, arr2):
    if len(arr1) != len(arr2):
        print("Lengths must be equal")
    
    coincidence = 0
    for index,_ in enumerate(arr1):
        if arr1[index] == arr2[index]:
            coincidence +=1
    
    return coincidence / len(arr1)

def print_AFN(AFN_func):
    res = ""
    for x in AFN_func:
        if x == [0,0,0,0,0]:
            res += " + 1"
        else:
            poly = ""
            for y in range(len(x)):
                if x[y]:
                    poly+="x"+str(len(x)-1-y)
            if poly != "":
                if res == "":
                    res += poly
                else:
                    res += " + "+poly
    return res

def from_print_AFN_to_AFN(print_afn_form):
    AFN = []
    
    string_form = print_afn_form.replace("*","")
    if " + 1 + " in print_afn_form:
        AFN += [[0,0,0,0,0]]
        string_form = string_form.replace(" + 1 + ","")
    
    
    
    for nf in string_form.split(" + "):
        if nf == '':
            continue
        base = [0,0,0,0,0]

        if not "x" in nf and "1" in nf:
            AFN.append(base)
            continue

        positions = list(nf.replace("x",""))
        positions = [int(x) for x in positions]

        for pos in positions:
            base[4-pos] = 1
        AFN.append(base)
    
    return AFN

def calc_invert_truth_table(truth_t):
    res = []
    for x in truth_t:
        res.append(x ^ 1)
    return res

def count_number_of_ones(objective):
    res = 0
    for y in objective[ :32]:
        if y == 1:
            res +=1
    return res

def calc_loop(initial_value):
    pointer = initial_value
    counter = list()
    counter.append(pointer)
    while True:
        pointer = sbox_array[pointer]
        if pointer == initial_value:
            break
        counter.append(pointer)

    return counter

def calc_loop_from_another_sbox(initial_value,another_sbox):
    pointer = initial_value
    counter = list()
    counter.append(pointer)
    while True:
        pointer = another_sbox[pointer]
        if pointer == initial_value:
            break
        counter.append(pointer)
        if len(counter) > len(another_sbox):
            counter = [initial_value]
            break

    return counter

def calc_loops_from_another_sbox(another_sbox):
    already_counted = list()
    loops = list()
    for _,x in enumerate(another_sbox):
        if x in already_counted:
            continue

        res = calc_loop_from_another_sbox(x,another_sbox)
        loops.append(res)
        already_counted += res
    return loops

def calc_loops():
    already_counted = list()
    loops = list()
    for x,_ in enumerate(sbox_array):
        if x in already_counted:
            continue

        res = calc_loop(x)
        loops.append(list(res))
        already_counted += list(res)
    return loops

def get_P_loops():
    loops = calc_loops()
    identity = np.identity(len(sbox_array))
    P = np.identity(len(sbox_array))
    for loop in loops:
        for x in range(0,len(loop)+1):
            P[loop[(x+1)%len(loop)]] = identity[loop[x%len(loop)]]
    return P

def get_P_loops_from_another_sbox(another_sbox):
    loops = calc_loops_from_another_sbox(another_sbox)
    identity = np.identity(len(another_sbox))
    P = np.identity(len(another_sbox))
    for loop in loops:
        for x in range(0,len(loop)+1):
            P[loop[(x+1)%len(loop)]] = identity[loop[x%len(loop)]]
    return P

def rotate_right(array, n) -> str:
    rotated_array = [0]*len(array)

    for x in range(len(array)):
        rotated_index = (x+n) % len(array)
        rotated_array[rotated_index] = array[x]

    return rotated_array

def xor_two_arrays(arr1, arr2):
    return [arr1[x] ^ arr2[x] for x in range(len(arr1))]

def pl_linear_diffusion_layer_row(row, const1, const2) -> str:
    rotate_row_first = rotate_right(row,const1)
    rotate_row_second = rotate_right(row, const2)
    row = xor_two_arrays(row,rotate_row_first)
    row = xor_two_arrays(row,rotate_row_second)

    return row

def linear_layer_S0(row):
    return pl_linear_diffusion_layer_row(row, 19, 28)

def linear_layer_S1(row):
    return pl_linear_diffusion_layer_row(row, 61, 39)

def linear_layer_S2(row):
    return pl_linear_diffusion_layer_row(row, 1, 6)

def linear_layer_S3(row):
    return pl_linear_diffusion_layer_row(row, 10, 17)

def linear_layer_S4(row):
    return pl_linear_diffusion_layer_row(row, 7, 41)

def substitution(internal_state, sbox_to_apply, n_columns = 64):
    S_bits_subtituded = []
    for x in range(5):
        S_bits_subtituded.append(list())

    for y in range(n_columns):
        chunk = list()
        for x in range(5):
            chunk.append(internal_state[x][y])
        
        bin_value_of_chunk = "".join([str(x) for x in chunk])
        chunk_subtitued = sbox_to_apply[int(bin_value_of_chunk,2)]

        chunk_bin = [int(x) for x in '{0:05b}'.format(chunk_subtitued)]

        for x in range(5):
            S_bits_subtituded[x].append(chunk_bin[x])


    return list(S_bits_subtituded)

def apply_round_constant(state, round_n):
    round_cs = [0xf0,0xe1,0xd2,0xc3,0xb4,0xa5, 0x96,0x87,0x78,0x69,0x5a,0x4b]
    

    const = [int(xa) for xa in '{0:064b}'.format(round_cs[round_n])]
    state[2] = xor_two_arrays(state[2], const)

    return state

import random

def get_random_number():
  return random.getrandbits(64)

def get_random_bits(n = None):
    if n == None:
        n = get_random_number()
    bits  = [int(a) for a in '{0:064b}'.format(n)]
    return (n,bits)

