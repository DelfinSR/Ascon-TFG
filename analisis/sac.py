
sbox = [0x4,0xb,0x1f,0x14,0x1a,0x15,0x9,0x2,0x1b,0x5,0x8,0x12,0x1d,0x3,0x6,0x1c,0x1e,0x13,0x7,0xe,0x0,0xd,0x11,0x18,0x10,0xc,0x1,0x19,0x16,0xa,0xf,0x17]
#sbox =[1,0,25,26,17,29,21,27,20,5,4,23,14,18,2,28,15,8,6,3,13,7,24,16,30,9,31,10,22,12,11,19]

changes = [[0,0,0,0,0] for x in range(5)]
bits_changed = [0]*6
for x in range(32):

    for y in range(1):
        bits_x = "{0:05b}".format(x)

        first_sbox_value = "{0:05b}".format(sbox[x])

        x_bit_flipped = list(bits_x)
        if x_bit_flipped[y] == "1":
            x_bit_flipped[y] = "0"
        else:
            x_bit_flipped[y] = "1"
        x_bit_flipped = int("".join(x_bit_flipped),2)
        second_sbox_value = "{0:05b}".format(sbox[x_bit_flipped])
        n_changes = 0
        for z in range(5):
            if first_sbox_value[z] != second_sbox_value[z]:
                changes[y][z] += 1
                n_changes +=1
 
        bits_changed[n_changes] +=1

print(changes)
print(bits_changed)
