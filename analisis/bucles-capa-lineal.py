from util import linear_layer_S0

vector = [0]*64
vector[-1] = 1

for x in range(65):
    print(x,"&",tuple(vector),"&",int("".join([str(y) for y in vector]),2),"\\\\")
    print("\\hline")
    vector = linear_layer_S0(vector)