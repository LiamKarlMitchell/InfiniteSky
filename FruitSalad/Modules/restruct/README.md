<a href="https://github.com/rfw/restruct.js"><img style="position: fixed; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>

# restruct.js

_A JavaScript binary data library._

`restruct.js` performs conversion to and from binary data types. It utilizes an
intuitive declarative API to define formats for binary structure parsers and
emitters. It works in both the browser and on Node.

`restruct.js` is freely distributable under the terms of the MIT license.

Example:

    > struct = restruct.
    ... int8lu('opcode').
    ... int8lu('version').
    ... string('username', 20);

    > packet = struct.pack({opcode: 1, version: 1, username: "test"});
    [ 1, 1, 116, 101, 115, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]

    > struct.unpack(packet);
    { opcode: 1,
      version: 1,
      username: 'test' }

`restruct.js` has support for typed arrays, where available.

## Usage

### Initializing

A `restruct.js` structure can be defined by using the `restruct` object, e.g.:

    restruct.type(k[, n[, buf]])

The `type` is specified by one of the types in the [data types](#Data-Types)
section.

The parameter `k` specifies the name of the field in the resulting struct.

The parameter `n` is optional and, if supplied, will unpack the field into an
array rather than a scalar value — this is useful for array values in structs.
The array will be unpacked according to the endianness of the data type. If the
supplied array during packing is shorter than `n`, the result will be padded
with null bytes.

The parameter `buf` is also optional and, if supplied, specifies the array
the field will be unpacked into, which can be useful for using typed arrays
as buffers.

An example of a structure:

    struct = restruct.
        int32bu('start_time').
        int32bu('end_time').
        int8bu('keys', 10);

### Unpacking

Once a structure has been initialized, the `unpack` method can be used on any
object that supports indexing (both normal and typed arrays):

    struct.unpack([ 0, 0, 0, 1, 73, 150, 2, 210, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]);

This will return the parsed structure:

    { start_time: 1, end_time: 1234567890, keys: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]}

### Packing

`restruct.js` also supports packing structures back to series of bytes:

    struct.pack({ start_time: 1, end_time: 1234567890, keys: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]});

This will return an array of bytes:

    [ 0, 0, 0, 1, 73, 150, 2, 210, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]

Optionally, the `struct.pack` function takes a second argument which specifies
an array to use for packing into. This can be a typed array:

    var arr = new Uint8Array(1);
    struct.pack({...}, arr);

## Size

The size of the structure can be obtained via `struct.size`, e.g.:

    > struct.size
    18

## Data Types

### pad

A `pad` is the null byte, used for empty fields of a struct.

### boolean

A `boolean` unpacks a 8-bit field into an array of eight boolean values, in
order of least significant bit to most significant bit, e.g. `37` unpacks to:

    [true, false, true, false, false, true, false, false]
     1     2      4     8      16     32    64     128

### nibble

A `nibble` unpacks a 8-bit field into an array of low and high nibbles. The
array is ordered `[0xL, 0xH]`.

### int{8,16,24,32,40,48}{l,b}{s,u}

These types specify various integer types. The number is indicative of the
bit size of the integer, the `l` and `b` indicative of little- and
big-endianness respectively, and `s` and `u` are indicative of signedness and
unsignedness.

As a side note about endianness with regards to the `int8` data type, this only
affects the packing/unpacking of arrays.

### string

A `string` is a string of variable length. On packing, it will encode the
string to UTF-8 and on unpacking will decode the string from UTF-8 (i.e.
conversion of native JavaScript strings to/from byte sequences, respectively).

### struct

A `struct` is another `Restruct` instance. This enables structs to be packed
inside of each other, as simple compositions or as arrays of structs.
