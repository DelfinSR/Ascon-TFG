from util import *


def check_afn_with_chunk(chunk, AFN_func, size=4):
	xor_result = 0
	xu = []
	for f in AFN_func:
		if f == [0]*size:
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
	return result ^ xor_result


def apply_lin_inv_to_state(state, invariantes_lines):
	res_all = [check_afn_with_chunk(state[xx],invariantes_lines[xx]) for xx in range(5)]

	#res = 0
	#for res_singular in res_all:
	#	res ^= res_singular

	return res_all

def check_afn_with_numbers_in_columns(internal_state, AFN_func, n_columns=4):
	res = []
	for y in range(n_columns):
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


def apply_invariant(s_inv, l_inv, state):
	#s_res_not_finished = check_afn_with_numbers_in_columns(state, s_inv)

	l_res = apply_lin_inv_to_state(state, l_inv)

	s_res = check_afn_with_chunk(l_res, s_inv,size=5)

	#return [s_res,int("".join([str(xn) for xn in l_res]),2)]# ^ l_res
	return s_res


invariantes_sbox = [
"x0*x1*x2*x4 + x0*x1*x2 + x0*x1*x3*x4 + x0*x1*x3 + x0*x1*x4 + x0*x2*x3*x4 + x0*x2*x3 + x0*x2*x4 + x0*x2 + x0 + x1*x2*x4 + x1*x2 + x1*x4 + x1 + x2*x4 + x2 + x3 + x4","x0*x1*x2*x4 + x0*x1*x2 + x0*x1*x3*x4 + x0*x1*x3 + x0*x1*x4 + x0*x2*x3*x4 + x0*x2*x3 + x0*x2*x4 + x0*x2 + x0 + x1*x2*x4 + x1*x2 + x1*x4 + x1 + x2*x4 + x2 + x3 + x4 + 1",
"x0*x1*x2*x3 + x0*x1*x2*x4 + x0*x1*x2 + x0*x1*x3*x4 + x0*x1*x3 + x0*x1*x4 + x0*x2*x3*x4 + x0*x2*x3 + x0*x2*x4 + x0*x2 + x0*x3 + x0 + x1*x2*x3*x4 + x1*x2*x3 + x1*x2*x4 + x1*x2 + x1*x4 + x1 + x2*x4 + x2 + x3*x4 + x4",
"x0*x1*x2*x3 + x0*x1*x2*x4 + x0*x1*x2 + x0*x1*x3*x4 + x0*x1*x3 + x0*x1*x4 + x0*x2*x3*x4 + x0*x2*x3 + x0*x2*x4 + x0*x2 + x0*x3 + x0 + x1*x2*x3*x4 + x1*x2*x3 + x1*x2*x4 + x1*x2 + x1*x4 + x1 + x2*x4 + x2 + x3*x4 + x4 + 1"
]

invariantes_lin_layer = []
for x in open("all_state_lin_invariant.txt","r").read().split("\n"):
	if x != '':
		invariantes_lin_layer.append(eval(x))
		


for inv_sbox in invariantes_sbox:
	for inv_lin in invariantes_lin_layer:
		correct_with_ascon = 0
		correct_with_random = 0

		for x in range(1000):
			state = []
			state.append(get_random_bits()[1][:4])
			state.append(get_random_bits()[1][:4])
			state.append(get_random_bits()[1][:4])
			state.append(get_random_bits()[1][:4])
			state.append(get_random_bits()[1][:4])

			first = apply_invariant(from_print_AFN_to_AFN(inv_sbox), inv_lin, state)
			for _ in range(12):
				state = substitution(state, sbox_array, n_columns = 4)

				state[0] = linear_layer_S0(state[0])
				state[1] = linear_layer_S1(state[1])
				state[2] = linear_layer_S2(state[2])
				state[3] = linear_layer_S3(state[3])
				state[4] = linear_layer_S4(state[4])

			second = apply_invariant(from_print_AFN_to_AFN(inv_sbox), inv_lin, state)

			if second == first:
				correct_with_ascon +=1
			

			rstate = [
				get_random_bits()[1][:4],
				get_random_bits()[1][:4],
				get_random_bits()[1][:4],
				get_random_bits()[1][:4],
				get_random_bits()[1][:4]
			]

			third = apply_invariant(from_print_AFN_to_AFN(inv_sbox), inv_lin, rstate)
			if first == third:
				correct_with_random +=1

		print(correct_with_ascon, correct_with_random)