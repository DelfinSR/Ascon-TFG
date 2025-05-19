from sage.combinat.integer_vector import IntegerVectors
from sage.crypto.boolean_function import BooleanFunction
from sage.matrix.constructor import Matrix
from sage.misc.cachefunc import cached_method
from sage.misc.functional import is_even
from sage.misc.misc_c import prod as mul
from sage.modules.free_module_element import vector
from sage.rings.finite_rings.element_base import is_FiniteFieldElement
from sage.rings.finite_rings.finite_field_constructor import FiniteField as GF
from sage.rings.ideal import FieldIdeal, Ideal
from sage.rings.integer_ring import ZZ
from sage.rings.integer import Integer
from sage.rings.polynomial.polynomial_ring_constructor import PolynomialRing
from sage.structure.sage_object import SageObject

from util import *
import util

from sage.crypto.sbox import SBox

in_out = eval(open("res3.txt","r").read())

my_sbox = [-1]*32

for x in range(31,-1,-1):
	good_ones = list()
	for key in in_out.keys():
		if key[0] == x:
			good_ones.append((key,in_out[key]))

	sorted_res = sorted(good_ones, key=lambda item: item[1])
	max_value = sorted_res[-2][0]
	
	value = max_value[1]
	if value in my_sbox:
		counter = 1
		while value in my_sbox:
			max_value = sorted_res[-counter][0]
			value = max_value[1]
			counter += 1

	my_sbox[max_value[0]] = value

S = SBox(my_sbox)
from sage.misc.misc_c import prod
from sage.modules.free_module import VectorSpace

m = S.input_size()
n = S.output_size()

f = [S.component_function(1<<i).algebraic_normal_form() for i in range(n)]
R = f[0].ring()
V = VectorSpace(GF(2), m)
monomials = [R.monomial(*v) for v in V]

cl = [monomials[i] + prod(f[j]**V[i][j] for j in range(m)) for i in range(1<<m)]
L0 = [[c(*v) for c in cl] for v in V]
L1 = [[GF(2)(1)] +  L[1:] for L in L0]

M0, M1 = Matrix(GF(2), L0), Matrix(GF(2), L1)
A0, A1 = M0.right_kernel().list(), M1.right_kernel().list()

T0 = [ sum([A0[i][j] * monomials[j] for j in range(1<<m)]) for i in range(len(A0)) ]
T1 = [ sum([A1[i][j] * monomials[j] for j in range(1<<m)]) for i in range(len(A1)) ]

invariants= tuple(set(T0 + T1))
print(len(invariants))
print(invariants)

util.sbox_array = my_sbox

for afn_string in invariants:
	if str(afn_string) == '0' or str(afn_string) == '1':
		continue
	print()
	AFN = from_print_AFN_to_AFN(str(afn_string))
	result = get_results_of_AFN(AFN)
	result2 = get_results_of_AFN_input_sbox(AFN)
	print(result == result2)
	print(afn_string)
	print(result)
	ones = 0
	zeros = 0
	for res in result:
		if res == 1:
			ones += 1
		else:
			zeros += 1
	
	print("AFN ",invariants.index(afn_string)," ",ones," ones| ",zeros," zeros")
