#!/usr/bin/env python

"""
restruct.js code generator. This generates the JavaScript for restruct.js using
Mako.
"""

import mako.template

BITS = [8, 16, 24, 32, 40, 48]


f = open("restruct.js", "w")

f.write(mako.template.Template("""(function() {
    // UTF-8 encode/decode routines.
    var decodeUTF8 = function(s) {
        return decodeURIComponent(escape(s));
    };

    var encodeUTF8 = function(s) {
        return unescape(encodeURIComponent(s));
    };

    // Boolean routines.
    var unpackBoolean = function(binary) {
        var x = unpack8(binary);
        return [!!(x & 1), !!(x & 2), !!(x & 4), !!(x & 8),
                !!(x & 16), !!(x & 32), !!(x & 64), !!(x & 128)];
    };

    var packBoolean = function(val, binary) {
        pack8(val[0] | (val[1] << 1) | (val[2] << 2) | (val[3] << 3) |
              (val[4] << 4) | (val[5] << 5) | (val[6] << 6) | (val[7] << 7),
              binary);
    };

    // Nibble routines.
    var unpackNibble = function(binary) {
        var x = unpack8(binary);
        return [x >> 4, x & 0x0f];
    };

    var packNibble = function(val, binary) {
        pack8(val[0] << 4 | val[1], binary);
    };

    % for bits in BITS:
    // ${bits}-bit routines.
    var sign${bits} = function(i) {
        return (i + 0x8${'0' * (bits // 4 - 1)}) % 0x1${'0' * (bits // 4)} - 0x8${'0' * (bits // 4 - 1)};
    };

    % if bits == 8:
    var unpack8 = function(binary) {
        return binary.array[binary.offset++];
    };

    var pack8 = function(val, binary) {
        binary.array[binary.offset++] = val & 0xff;
    };
    % else:
    var unpack${bits}l = function(binary) {
        var val = binary.array[binary.offset++];
        % for i in range(8, min(32, bits), 8):
        val |= binary.array[binary.offset++] << ${i};
        % endfor
        val >>>= 0;
        % for i in range(32, bits, 8):
        val += binary.array[binary.offset++] * 0x1${'0' * (i // 4)};
        % endfor
        return val;
    };

    var pack${bits}l = function(val, binary) {
        binary.array[binary.offset++] = val & 0xff;
        % for i in range(8, min(32, bits), 8):
        binary.array[binary.offset++] = (val >> ${i}) & 0xff;
        % endfor
        % for i in range(32, bits, 8):
        binary.array[binary.offset++] = (val / 0x1${'0' * (i // 4)}) & 0xff;
        % endfor
    };

    var unpack${bits}b = function(binary) {
        % if bits > 32:
        var head = binary.array[binary.offset++] * 0x1${'0' * ((bits - 8) // 4)};
        % for i in range(bits - 16, 32 - 1, -8):
        head += binary.array[binary.offset++] * 0x1${'0' * (i // 4)};
        % endfor
        % endif
        var val = binary.array[binary.offset++] << ${min(32, bits) - 8};
        % for i in range(min(32, bits) - 16, 8 - 1, - 8):
        val |= binary.array[binary.offset++] << ${i};
        % endfor
        val |= binary.array[binary.offset++];
        val >>>= 0;
        % if bits > 32:
        val += head;
        % endif
        return val;
    };

    var pack${bits}b = function(val, binary) {
        % for i in range(bits - 8, 32 - 1, -8):
        binary.array[binary.offset++] = (val / 0x1${'0' * (i // 4)}) & 0xff;
        % endfor
        % for i in range(min(32, bits) - 8, 8 - 1, - 8):
        binary.array[binary.offset++] = (val >> ${i}) & 0xff;
        % endfor
        binary.array[binary.offset++] = val & 0xff;
    };
    % endif

    % endfor
    // Restruct class.
    var Restruct = function(parent, size, format) {
        if(typeof parent === 'undefined') {
            this.size = 0;
            this.formats = [];
        } else {
            this.size = parent.size + size;
            this.formats = parent.formats.concat(format);
        }
    };

    Restruct.prototype = {
        // Pad NUL bytes.
        pad: function(n) {
            if(typeof n === 'undefined') n = 1;

            return new Restruct(this, n, {
                unpack: function(binary, struct) {
                    binary.offset += n;
                },

                pack: function(struct, binary) {
                    for(var i = 0; i < n; ++i) {
                        pack8(0, binary);
                    }
                }
            });
        },

        // Booleans.
        boolean: function(k, n) {
            if(typeof n === "undefined") {
                return new Restruct(this, 1, {
                    unpack: function(binary, struct) {
                        struct[k] = unpackBoolean(binary);
                    },

                    pack: function(struct, binary) {
                        packBoolean(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, ${bits // 8} * n, {
                unpack: function(binary, struct) {
                    struct[k] = [];
                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = unpackBoolean(binary);
                    }
                },

                pack: function(struct, binary) {
                    for(var i = 0; i < n; ++i) {
                        packBoolean(struct[k][i], binary);
                    }
                }
            });
        },

        // Nibbles.
        nibble: function(k, n) {
            if(typeof n === "undefined") {
                return new Restruct(this, 1, {
                    unpack: function(binary, struct) {
                        struct[k] = unpackNibble(binary);
                    },

                    pack: function(struct, binary) {
                        packNibble(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, ${bits // 8} * n, {
                unpack: function(binary, struct) {
                    struct[k] = [];
                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = unpackNibble(binary);
                    }
                },

                pack: function(struct, binary) {
                    for(var i = 0; i < n; ++i) {
                        packNibble(struct[k][i], binary);
                    }
                }
            });
        },

% for bits in BITS:
% for endianness in "lb":
% for signedness in "su":
        // ${bits}-bit ${signedness == "s" and "signed" or "unsigned"} ${endianness == "b" and "big" or "little"}-endian integer.
        int${bits}${endianness}${signedness}: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, ${bits // 8}, {
                    unpack: function(binary, struct) {
                        % if signedness == "s":
                        struct[k] = sign${bits}(unpack${bits}${bits != 8 and endianness or ""}(binary));
                        % else:
                        struct[k] = unpack${bits}${bits != 8 and endianness or ""}(binary);
                        % endif
                    },

                    pack: function(struct, binary) {
                        pack${bits}${bits != 8 and endianness or ""}(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, ${bits // 8} * n, {
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    % if endianness == "b":
                    for(var i = 0; i < n; ++i) {
                    % else:
                    for(var i = n - 1; i >= 0; --i) {
                    % endif
                        % if signedness == "s":
                        struct[k][i] = sign${bits}(unpack${bits}${bits != 8 and endianness or ""}(binary));
                        % else:
                        struct[k][i] = unpack${bits}${bits != 8 and endianness or ""}(binary);
                        % endif
                    }
                },

                pack: function(struct, binary) {
                    % if endianness == "b":
                    for(var i = 0; i < n; ++i) {
                    % else:
                    for(var i = n - 1; i >= 0; --i) {
                    % endif
                        pack${bits}${bits != 8 and endianness or ""}(struct[k][i] || 0, binary);
                    }
                }
            });
        },

% endfor
% endfor
% endfor
        // UTF-8 string.
        string: function(k, n) {
            return new Restruct(this, n, {
                unpack: function(binary, struct) {
                    var bytes = [];
                    var eos = false;

                    for(var i = 0; i < n; ++i) {
                        var byte = unpack8(binary);
                        if(byte === 0) eos = true;

                        if(!eos) bytes.push(byte);
                    }

                    struct[k] = decodeUTF8(String.fromCharCode.apply(String, bytes));
                },

                pack: function(struct, binary) {
                    var str = encodeUTF8(struct[k]);
                    var len = Math.min(str.length, n);

                    for(var i = 0; i < len; ++i) {
                        pack8(str.charCodeAt(i), binary);
                    }

                    for(; len < n; ++len) {
                        pack8(0, binary);
                    }
                }
            });
        },

        // Another struct.
        struct: function(k, s, n) {
            if(typeof n === "undefined") {
                return new Restruct(this, 1, {
                    unpack: function(binary, struct) {
                        struct[k] = s.unpack(binary.array, binary.offset);
                        binary.offset += s.size;
                    },

                    pack: function(struct, binary) {
                        s.pack(struct[k], binary.array, binary.offset);
                        binary.offset += s.size;
                    }
                });
            }

            return new Restruct(this, n * s.size, {
                unpack: function(binary, struct) {
                    struct[k] = [];
                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = s.unpack(binary.array, binary.offset);
                        binary.offset += s.size;
                    }
                },

                pack: function(struct, binary) {
                    for(var i = 0; i < n; ++i) {
                        s.pack(struct[k][i], binary.array, binary.offset);
                        binary.offset += s.size;
                    }
                }
            });
        },

        // Unpack an array to a struct.
        unpack: function(array, offset) {
            if(typeof offset === 'undefined') offset = 0;

            var binary = {
                offset: offset,
                array: array
            };

            var struct = {};

            for(var i = 0; i < this.formats.length; ++i) {
                this.formats[i].unpack(binary, struct);
            }

            return struct;
        },

        // Pack an array to a struct.
        pack: function(struct, array, offset) {
            if(typeof offset === 'undefined') offset = 0;
            if(typeof array === 'undefined') array = [];

            var binary = {
                offset: offset,
                array: array
            };

            for(var i = 0; i < this.formats.length; ++i) {
                this.formats[i].pack(struct, binary);
            }

            return binary.array;
        }
    };

    var restruct = new Restruct();

    if(typeof module !== "undefined" && module.exports) {
        module.exports = restruct;
    }
    if(typeof window !== "undefined") {
        window.restruct = restruct;
    }
})();""").render(BITS=BITS))

f.close()
