from util import *


def check_afn_with_chunk(chunk, AFN_func):
	xor_result = 0
	xu = []
	for f in AFN_func:
		if f == [0,0,0,0]:
			xor_result = 1
			continue
		xu.append(calculate_power_u(chunk, f))
		
	result = 0
	for _,x in enumerate(xu):
		r = 1
		for y in x:
			r &= y
		result ^= r
	return result ^ xor_result


def apply_lin_inv_to_state(state, invariantes_lines):
	res_all = [check_afn_with_chunk(state[xx],invariantes_lines[xx]) for xx in range(5)]

	res = 0
	for res_singular in res_all:
		res ^= res_singular

	return res

def get_good_afns(invariantes_Sx, linear_layer_Sx):
	res_good = list()
	for inv_str in invariantes_Sx:
		inv = [i[1:] for i in  from_print_AFN_to_AFN(inv_str)]
		total_sum = 0
		for i in range(2**4):
			n_bits = [int(x) for x in '{0:04b}'.format(i)]

			first = check_afn_with_chunk(n_bits, inv)

			n_bits = linear_layer_Sx(n_bits)

			second = check_afn_with_chunk(n_bits, inv)

			if first != second:
				print("YO I STOP")
				exit()

			
			total_sum += second

		if total_sum == 8:
			res_good.append(inv)
	
	return res_good

invariantes_S0_bad = open("AFNS_S0.txt","r").read().split("\n")
invariantes_S1_bad = open("AFNS_S1.txt","r").read().split("\n")
invariantes_S2_bad = open("AFNS_S2.txt","r").read().split("\n")
invariantes_S3_bad = open("AFNS_S3.txt","r").read().split("\n")
invariantes_S4_bad = open("AFNS_S4.txt","r").read().split("\n")

invariantes_S0 = get_good_afns(invariantes_S0_bad, linear_layer_S0)
invariantes_S1 = get_good_afns(invariantes_S1_bad, linear_layer_S1)
invariantes_S2 = get_good_afns(invariantes_S2_bad, linear_layer_S2)
invariantes_S3 = get_good_afns(invariantes_S3_bad, linear_layer_S3)
invariantes_S4 = get_good_afns(invariantes_S4_bad, linear_layer_S4)

print(len(invariantes_S0),"Invariantes, para S0, eliminadas = ",len(invariantes_S0_bad) - len(invariantes_S0))
print(len(invariantes_S1),"Invariantes, para S1, eliminadas = ",len(invariantes_S1_bad) - len(invariantes_S1))
print(len(invariantes_S2),"Invariantes, para S2, eliminadas = ",len(invariantes_S2_bad) - len(invariantes_S2))
print(len(invariantes_S3),"Invariantes, para S3, eliminadas = ",len(invariantes_S3_bad) - len(invariantes_S3))
print(len(invariantes_S4),"Invariantes, para S4, eliminadas = ",len(invariantes_S4_bad) - len(invariantes_S4))


#file = open("all_state_lin_invariant.txt","a")
for inv_s0 in invariantes_S0:
	print(invariantes_S0.index(inv_s0),"S0")
	for inv_s1 in invariantes_S1:
		print("\t",invariantes_S1.index(inv_s1),"S1")
		for inv_s2 in invariantes_S2:
			for inv_s3 in invariantes_S3:
				for inv_s4 in invariantes_S4:
					# Obtenemos el invariante
					invariante = [inv_s0, inv_s1, inv_s2, inv_s3, inv_s4]

					times_1 = 0
					times_0 = 0
					times_random_was_wrong = 0
					times_ascon_was_right = 0
					for _ in range(1000):
						# Obtenemos un estado aleatorio
						state = [get_random_bits()[1][:4] for x in range(5)]

						calqued = apply_lin_inv_to_state(state, invariante)

						state[0] = linear_layer_S0(state[0])
						state[1] = linear_layer_S1(state[1])
						state[2] = linear_layer_S2(state[2])
						state[3] = linear_layer_S3(state[3])
						state[4] = linear_layer_S4(state[4])

						calqued2 = apply_lin_inv_to_state(state, invariante)

						if calqued != calqued2:
							print("YO I STOP")
							exit()
						else:
							times_ascon_was_right +=1 

						state_r = [get_random_bits()[1][:4] for x in range(5)]

						calqued3 = apply_lin_inv_to_state(state_r, invariante)

						if calqued != calqued3:
							times_random_was_wrong +=1

						if calqued2:
							times_1 += 1
						else:
							times_0 +=1
					
					if times_0 <= 400 or times_1 <= 400:
						print("Not adding")
						input()
					else:
						print(times_0, times_1,"|", times_ascon_was_right, times_random_was_wrong)
						#file.write(str(invariante)+"\n")

#file.close()