from sage.crypto.sbox import SBox

def print_table(table):
    for x,_ in enumerate(table):
        print('{0:02x}'.format(x),"&"," & ".join([str(y) for y in table[x]]),"\\\\")

sbox = SBox([0x4,0xb,0x1f,0x14,0x1a,0x15,0x9,0x2,0x1b,0x5,0x8,0x12,0x1d,0x3,0x6,0x1c,0x1e,0x13,0x7,0xe,0x0,0xd,0x11,0x18,0x10,0xc,0x1,0x19,0x16,0xa,0xf,0x17])
#sbox = SBox([1,0,25,26,17,29,21,27,20,5,4,23,14,18,2,28,15,8,6,3,13,7,24,16,30,9,31,10,22,12,11,19])
#sbox = SBox(0xE, 0x4, 0xD, 0x1, 0x2, 0xF, 0xB, 0x8, 0x3, 0xA, 0x6, 0xC, 0x5, 0x9, 0x0, 0x7)

nl = sbox.nonlinearity()
print("\nNo linealiedad de la S-box: ", nl)


if sbox.is_balanced():
    res = "Sí"
else:
    res = "No"
print("\n¿Está la S-box balanceada? "+res)

puntos_fijos = sbox.fixed_points()
if len(puntos_fijos) == 0:
    res = "La S-box no tiene puntos fijos"
else:
    res = puntos_fijos
print("\nPuntos fijos de la S-box: "+res)

print("\n DDT")
ddt = sbox.difference_distribution_table()
print_table(ddt)

print("Probabilidad máxima:",sbox.maximal_difference_probability())

res = sbox.differential_branch_number()
print("\nDBN:",res)

print("\n LAT")
lat = sbox.linear_approximation_table()
print_table(lat)

print("Sesgo máximo:",sbox.maximal_linear_bias_absolute())

res = sbox.linear_branch_number()
print("\nLBN:",res)

print("\n TABLA DE AUTOCORRELACION")
autocorr = sbox.autocorrelation_table()
counter = 0
for x,_ in enumerate(autocorr):
    print('{0:02x}'.format(x),"&"," & ".join([str(y) for y in autocorr[x]]),"\\\\")
    if x!= 0:
        for l,_ in enumerate(autocorr[x]):
            if l!=0 and abs(autocorr[x][l]) == 32:
                counter +=1

print("Estructuras lineales: ",counter)

print("\n TABLA DE CONECTIVIDAD BUMERAN")
bct = sbox.boomerang_connectivity_table()
print_table(bct)

