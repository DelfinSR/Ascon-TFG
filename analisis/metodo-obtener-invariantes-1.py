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

from sage.crypto.sbox import SBox
from sage.misc.misc_c import prod
from sage.modules.free_module import VectorSpace

S = SBox(0x4,0xb,0x1f,0x14,0x1a,0x15,0x9,0x2,0x1b,0x5,0x8,0x12,0x1d,0x3,0x6,0x1c,0x1e,0x13,0x7,0xe,0x0,0xd,0x11,0x18,0x10,0xc,0x1,0x19,0x16,0xa,0xf,0x17)

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
print("Se han encontrado",len(invariants),"invariantes")
for inv_str in invariants:
    print("-",str(inv_str))
