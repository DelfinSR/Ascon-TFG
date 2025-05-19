from util import *
import numpy as np
from sage.all import Matrix, QQ

np.set_printoptions(threshold=np.inf)


S_orig = np.matrix([
    [1, 1],
    [1, -1]
])

S = S_orig.copy()

while len(S)*len(S[0]) != 32:
    S = np.kron(S_orig,S)

sage_S = Matrix(QQ, S.tolist())

P = get_P_loops()
P_t = P.transpose()
C = S.dot(P_t).dot(S.transpose())
C = (1/(2**5))*C

sage_matrix = Matrix(QQ, C.tolist())

vectors = sage_matrix.eigenvectors_right()

selected_with_one = []
selected_with_minus_one = []

for eigenvalue, eigenvectors,number_of_vectors in vectors:
    if eigenvalue == 1:
        [selected_with_one.append(x) for x in eigenvectors]
    elif eigenvalue == -1:
        [selected_with_minus_one.append(x) for x in eigenvectors]
    else:        
        pass

good_ones = list()

print("vectors_with_minus_one: ",len(selected_with_minus_one), "|vectors_with_one: ",len(selected_with_one))

for aaa in range(-20,20):
    for bbb in range(-20,20):
        sums = aaa*selected_with_one[0] + bbb*selected_with_one[1]
        result = sage_S*sums

        values = {value for value in result}
        if len(values) == 2:
            good_ones.append(result)

for aaa in range(-20,20):
    for bbb in range(-20,20):
        sums = aaa*selected_with_minus_one[0] + bbb*selected_with_minus_one[1]
        result = sage_S*sums

        values = {value for value in result}
        if len(values) == 2:
            good_ones.append(result)

prob_invariant = set()
for selected in good_ones:
    converted = list()
    for x in selected:
        if x < 0:
            converted.append(1)
        else:
            converted.append(0)
    AFN = calc_AFN(converted)

    AFN_normal_result = get_results_of_AFN(AFN)
    AFN_sbox_result = get_results_of_AFN_input_sbox(AFN)

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
    if passed:
        prob_invariant.add(print_AFN(AFN))
    
    converted = [1^x for x in converted]
    if [0,0,0,0,0] in AFN:
        AFN.remove([0,0,0,0,0])
    else:
        AFN = [[0,0,0,0,0]]+AFN
    AFN_normal_result = [1^x for x in AFN_normal_result]
    AFN_sbox_result = [1^x for x in AFN_sbox_result]

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
    if passed:
        prob_invariant.add(print_AFN(AFN))

length = len(prob_invariant)
print("Se han encontrado",length,"invariantes")
for inv_str in prob_invariant:
    print("-",inv_str)
