from util import *


def check_afn_with_numbers_in_columns(internal_state, AFN_func):
	res = []
	for y in range(64):
		chunk = list()
		for x in range(5):
			chunk.append(internal_state[x][y])
		
		xor_result = 0
		xu = []
		for f in AFN_func:
			if f == [0,0,0,0,0]:
				xor_result = 1
				continue
			xu.append(calculate_power_u(chunk, f))
		
		result = 0
		#print(x_i,xu)
		for _,x in enumerate(xu):
			r = 1
			for y in x:
				r &= y
			result ^= r
		res.append(result ^ xor_result)
	
	return res

AFNS = [
    "x0*x1*x2*x4 + x0*x1*x2 + x0*x1*x3*x4 + x0*x1*x3 + x0*x1*x4 + x0*x2*x3*x4 + x0*x2*x3 + x0*x2*x4 + x0*x2 + x0 + x1*x2*x4 + x1*x2 + x1*x4 + x1 + x2*x4 + x2 + x3 + x4",
    "x0*x1*x2*x4 + x0*x1*x2 + x0*x1*x3*x4 + x0*x1*x3 + x0*x1*x4 + x0*x2*x3*x4 + x0*x2*x3 + x0*x2*x4 + x0*x2 + x0 + x1*x2*x4 + x1*x2 + x1*x4 + x1 + x2*x4 + x2 + x3 + x4 + 1",
    "x0*x1*x2*x3 + x0*x1*x2*x4 + x0*x1*x2 + x0*x1*x3*x4 + x0*x1*x3 + x0*x1*x4 + x0*x2*x3*x4 + x0*x2*x3 + x0*x2*x4 + x0*x2 + x0*x3 + x0 + x1*x2*x3*x4 + x1*x2*x3 + x1*x2*x4 + x1*x2 + x1*x4 + x1 + x2*x4 + x2 + x3*x4 + x4",
    "x0*x1*x2*x3 + x0*x1*x2*x4 + x0*x1*x2 + x0*x1*x3*x4 + x0*x1*x3 + x0*x1*x4 + x0*x2*x3*x4 + x0*x2*x3 + x0*x2*x4 + x0*x2 + x0*x3 + x0 + x1*x2*x3*x4 + x1*x2*x3 + x1*x2*x4 + x1*x2 + x1*x4 + x1 + x2*x4 + x2 + x3*x4 + x4 + 1"
]

count = 0
for afn_string in AFNS:
	correct_position = [0]*64
	incorrect_position = [0]*64
	count +=1

	already_visited = set()

	AFN = from_print_AFN_to_AFN(afn_string)
	print(check_if_invariant_is_a_sbox_componente(AFN))
	for repeats in range(1000):

		state = []
		state.append(get_random_bits()[1])
		state.append(get_random_bits()[1])
		state.append(get_random_bits()[1])
		state.append(get_random_bits()[1])
		state.append(get_random_bits()[1])
		
		first_value = check_afn_with_numbers_in_columns(state, AFN)

		
		for x in range(12):
			state = apply_round_constant(state, x)

			state = substitution(state, sbox_array)

			state[0] = linear_layer_S0(state[0])
			state[1] = linear_layer_S1(state[1])
			state[2] = linear_layer_S2(state[2])
			state[3] = linear_layer_S3(state[3])
			state[4] = linear_layer_S4(state[4])

		second_value = check_afn_with_numbers_in_columns(state, AFN)
		

		for i in range(64):
			if first_value[i] == second_value[i]:
				correct_position[i] +=1
			else:
				incorrect_position[i] +=1
	
	print(correct_position)
	print(incorrect_position)
	res = [correct_position[i] / incorrect_position[i] for i in range(64)]
	print(res)
