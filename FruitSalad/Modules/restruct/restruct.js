(function() {
    // UTF-8 encode/decode routines.
    var decodeUTF8 = function(s) {
        return s;
        //return decodeURIComponent(escape(s));
    };

    var encodeUTF8 = function(s) {
        if (typeof(s) === "undefined") return '';
        return s;
        //return unescape(encodeURIComponent(s));
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

    // 8-bit routines.
    var sign8 = function(i) {
        return (i + 0x80) % 0x100 - 0x80;
    };

    var unpack8 = function(binary) {
        return binary.array[binary.offset++];
    };

    var pack8 = function(val, binary) {
        binary.array[binary.offset++] = val & 0xff;
    };

    // 16-bit routines.
    var sign16 = function(i) {
        return (i + 0x8000) % 0x10000 - 0x8000;
    };

    var unpack16l = function(binary) {
        var val = binary.array[binary.offset++];
        val |= binary.array[binary.offset++] << 8;
        val >>>= 0;
        return val;
    };

    var pack16l = function(val, binary) {
        binary.array[binary.offset++] = val & 0xff;
        binary.array[binary.offset++] = (val >> 8) & 0xff;
    };

    var unpack16b = function(binary) {
        var val = binary.array[binary.offset++] << 8;
        val |= binary.array[binary.offset++];
        val >>>= 0;
        return val;
    };

    var pack16b = function(val, binary) {
        binary.array[binary.offset++] = (val >> 8) & 0xff;
        binary.array[binary.offset++] = val & 0xff;
    };

    // 24-bit routines.
    var sign24 = function(i) {
        return (i + 0x800000) % 0x1000000 - 0x800000;
    };

    var unpack24l = function(binary) {
        var val = binary.array[binary.offset++];
        val |= binary.array[binary.offset++] << 8;
        val |= binary.array[binary.offset++] << 16;
        val >>>= 0;
        return val;
    };

    var pack24l = function(val, binary) {
        binary.array[binary.offset++] = val & 0xff;
        binary.array[binary.offset++] = (val >> 8) & 0xff;
        binary.array[binary.offset++] = (val >> 16) & 0xff;
    };

    var unpack24b = function(binary) {
        var val = binary.array[binary.offset++] << 16;
        val |= binary.array[binary.offset++] << 8;
        val |= binary.array[binary.offset++];
        val >>>= 0;
        return val;
    };

    var pack24b = function(val, binary) {
        binary.array[binary.offset++] = (val >> 16) & 0xff;
        binary.array[binary.offset++] = (val >> 8) & 0xff;
        binary.array[binary.offset++] = val & 0xff;
    };

    // 32-bit routines.
    var sign32 = function(i) {
        return (i + 0x80000000) % 0x100000000 - 0x80000000;
    };

    var unpack32l = function(binary) {
        var val = binary.array[binary.offset++];
        val |= binary.array[binary.offset++] << 8;
        val |= binary.array[binary.offset++] << 16;
        val |= binary.array[binary.offset++] << 24;
        val >>>= 0;
        return val;
    };

    var pack32l = function(val, binary) {
        binary.array[binary.offset++] = val & 0xff;
        binary.array[binary.offset++] = (val >> 8) & 0xff;
        binary.array[binary.offset++] = (val >> 16) & 0xff;
        binary.array[binary.offset++] = (val >> 24) & 0xff;
    };

    var unpack32b = function(binary) {
        var val = binary.array[binary.offset++] << 24;
        val |= binary.array[binary.offset++] << 16;
        val |= binary.array[binary.offset++] << 8;
        val |= binary.array[binary.offset++];
        val >>>= 0;
        return val;
    };

    var pack32b = function(val, binary) {
        binary.array[binary.offset++] = (val >> 24) & 0xff;
        binary.array[binary.offset++] = (val >> 16) & 0xff;
        binary.array[binary.offset++] = (val >> 8) & 0xff;
        binary.array[binary.offset++] = val & 0xff;
    };

    // 40-bit routines.
    var sign40 = function(i) {
        return (i + 0x8000000000) % 0x10000000000 - 0x8000000000;
    };

    var unpack40l = function(binary) {
        var val = binary.array[binary.offset++];
        val |= binary.array[binary.offset++] << 8;
        val |= binary.array[binary.offset++] << 16;
        val |= binary.array[binary.offset++] << 24;
        val >>>= 0;
        val += binary.array[binary.offset++] * 0x100000000;
        return val;
    };

    var pack40l = function(val, binary) {
        binary.array[binary.offset++] = val & 0xff;
        binary.array[binary.offset++] = (val >> 8) & 0xff;
        binary.array[binary.offset++] = (val >> 16) & 0xff;
        binary.array[binary.offset++] = (val >> 24) & 0xff;
        binary.array[binary.offset++] = (val / 0x100000000) & 0xff;
    };

    var unpack40b = function(binary) {
        var head = binary.array[binary.offset++] * 0x100000000;
        var val = binary.array[binary.offset++] << 24;
        val |= binary.array[binary.offset++] << 16;
        val |= binary.array[binary.offset++] << 8;
        val |= binary.array[binary.offset++];
        val >>>= 0;
        val += head;
        return val;
    };

    var pack40b = function(val, binary) {
        binary.array[binary.offset++] = (val / 0x100000000) & 0xff;
        binary.array[binary.offset++] = (val >> 24) & 0xff;
        binary.array[binary.offset++] = (val >> 16) & 0xff;
        binary.array[binary.offset++] = (val >> 8) & 0xff;
        binary.array[binary.offset++] = val & 0xff;
    };

    // 48-bit routines.
    var sign48 = function(i) {
        return (i + 0x800000000000) % 0x1000000000000 - 0x800000000000;
    };

    var unpack48l = function(binary) {
        var val = binary.array[binary.offset++];
        val |= binary.array[binary.offset++] << 8;
        val |= binary.array[binary.offset++] << 16;
        val |= binary.array[binary.offset++] << 24;
        val >>>= 0;
        val += binary.array[binary.offset++] * 0x100000000;
        val += binary.array[binary.offset++] * 0x10000000000;
        return val;
    };

    var pack48l = function(val, binary) {
        binary.array[binary.offset++] = val & 0xff;
        binary.array[binary.offset++] = (val >> 8) & 0xff;
        binary.array[binary.offset++] = (val >> 16) & 0xff;
        binary.array[binary.offset++] = (val >> 24) & 0xff;
        binary.array[binary.offset++] = (val / 0x100000000) & 0xff;
        binary.array[binary.offset++] = (val / 0x10000000000) & 0xff;
    };

    var unpack48b = function(binary) {
        var head = binary.array[binary.offset++] * 0x10000000000;
        head += binary.array[binary.offset++] * 0x100000000;
        var val = binary.array[binary.offset++] << 24;
        val |= binary.array[binary.offset++] << 16;
        val |= binary.array[binary.offset++] << 8;
        val |= binary.array[binary.offset++];
        val >>>= 0;
        val += head;
        return val;
    };

    var pack48b = function(val, binary) {
        binary.array[binary.offset++] = (val / 0x10000000000) & 0xff;
        binary.array[binary.offset++] = (val / 0x100000000) & 0xff;
        binary.array[binary.offset++] = (val >> 24) & 0xff;
        binary.array[binary.offset++] = (val >> 16) & 0xff;
        binary.array[binary.offset++] = (val >> 8) & 0xff;
        binary.array[binary.offset++] = val & 0xff;
    };

	// Float Routines
	//Float to int
	function FloatToIEEE(f)
	{
		var buf = new ArrayBuffer(4);
		(new Float32Array(buf))[0] = f;
		return (new Uint32Array(buf))[0];
	};

	//int to float
	function IEEEToFloat(i)
	{
		var buf = new ArrayBuffer(4);
		(new Uint32Array(buf))[0] = i;
		return (new Float32Array(buf))[0];
	};

	//Float to hex array
	function FloatToHex(f)
	{
	  return FloatToIEEE(f).toString(16)
		.toUpperCase().match(/../g).reverse();
	};

	//Hex string to float, eg 7F7FFFEE
	function HexToFloat(h)
	{
	  return parseInt(h,16);
	};

	//Get array of each 8 bits in 32-bits of IEEEE
	function IEEEToBits(i)
	{
	  return parseInt(i).toString(2);//.match(/..../g);//.reverse();
	};

	// Converts Hex Arary to Int Array
	function HexArrayToIntArray(h)
	{
	  for(var ii = 0; ii < h.length; ii++)
	  {
		h[ii] = parseInt("0x"+h[ii]);
	  }
	  return h;
	};

	// Converts Int Array to Hex Array
	function IntArrayToHexArray(ia)
	{
	  for(var ii = 0; ii < ia.length; ii++)
	  {
		ia[ii] = ia[ii].toString(16).toUpperCase();
	  }
	  return ia;
	};

	//Convert int array back to float
	function intArrayToFloat(ia)
	{
	  ia = ia.reverse();
	  ia = IntArrayToHexArray(ia);
	  ia = ia.join("");
	  ia = HexToFloat(ia);
	  return IEEEToFloat(ia);
	}
	// End of Float routines

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
        generateDocumentation: function() {
            // Generate type, name\n
            var result = '';
            for(var i=0;i<this.formats.length;i++)
            {
                result+=this.formats[i].type
                if (this.formats[i].name) {result+=this.formats[i].name+' '};
                result+='\n';
            }
            return result;
        },
        // Pad NUL bytes.
        pad: function(n) {
            if(typeof n === 'undefined') n = 1;

            return new Restruct(this, n, {
                type: 'pad['+n+']',
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
                    name: k, type: 'boolean',
                    unpack: function(binary, struct) {
                        struct[k] = unpackBoolean(binary);
                    },

                    pack: function(struct, binary) {
						if (typeof struct[k] === "undefined") struct[k]={};
                        packBoolean(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 6 * n, {
                name: k, type: 'boolean['+n+']',
                unpack: function(binary, struct) {
                    struct[k] = [];
                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = unpackBoolean(binary);
                    }
                },

                pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = 0; i < n; ++i) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        packBoolean(struct[k][i], binary);
                    }
                }
            });
        },

        // Nibbles.
        nibble: function(k, n) {
            if(typeof n === "undefined") {
                return new Restruct(this, 1, {
                    name: k, type: 'nibble',
                    unpack: function(binary, struct) {
                        struct[k] = unpackNibble(binary);
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};
                        packNibble(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 6 * n, {
                name: k, type: 'nibble['+n+']',
                unpack: function(binary, struct) {
                    struct[k] = [];
                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = unpackNibble(binary);
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = 0; i < n; ++i) {
						if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        packNibble(struct[k][i], binary);
                    }
                }
            });
        },

        // 8-bit signed little-endian integer.
        int8ls: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 1, {
                    name: k, type: 'int8ls',
                    unpack: function(binary, struct) {
                        struct[k] = sign8(unpack8(binary));
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};
                        pack8(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 1 * n, {
                name: k, type: 'int8ls['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = n - 1; i >= 0; --i) {
                        struct[k][i] = sign8(unpack8(binary));
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = n - 1; i >= 0; --i) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack8(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 8-bit unsigned little-endian integer.
        int8lu: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 1, {
                    name: k, type: 'int8lu',
                    unpack: function(binary, struct) {
                        struct[k] = unpack8(binary);
                    },

                    pack: function(struct, binary) {
                        if (struct==null) { pack8(0,binary); return; }
						//if (typeof struct[k] === "undefined") struct[k]={};
                        pack8(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 1 * n, {
                name: k, type: 'int8lu['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = n - 1; i >= 0; --i) {
                        struct[k][i] = unpack8(binary);
                    }
                },

                pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = n - 1; i >= 0; --i) {
						if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack8(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 8-bit signed big-endian integer.
        int8bs: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 1, {
                    name: k, type: 'int8bs',
                    unpack: function(binary, struct) {
                        struct[k] = sign8(unpack8(binary));
                    },

                    pack: function(struct, binary) {
						if (typeof struct[k] === "undefined") struct[k]={};
                        pack8(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 1 * n, {
                name: k, type: 'int8bs['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = sign8(unpack8(binary));
                    }
                },

                pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = 0; i < n; ++i) {
						if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack8(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 8-bit unsigned big-endian integer.
        int8bu: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 1, {
                    name: k, type: 'int8bu',
                    unpack: function(binary, struct) {
                        struct[k] = unpack8(binary);
                    },

                    pack: function(struct, binary) {
						if (typeof struct[k] === "undefined") struct[k]={};
                        pack8(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 1 * n, {
                name: k, type: 'int8bu['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = unpack8(binary);
                    }
                },

                pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = 0; i < n; ++i) {
						if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack8(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 16-bit signed little-endian integer.
        int16ls: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 2, {
                    name: k, type: 'int16ls',
                    unpack: function(binary, struct) {
                        struct[k] = sign16(unpack16l(binary));
                    },

                    pack: function(struct, binary) {
						if (typeof struct[k] === "undefined") struct[k]={};
                        pack16l(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 2 * n, {
                name: k, type: 'int16ls['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = n - 1; i >= 0; --i) {
                        struct[k][i] = sign16(unpack16l(binary));
                    }
                },

                pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = n - 1; i >= 0; --i) {
						if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack16l(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 16-bit unsigned little-endian integer.
        int16lu: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 2, {
                    name: k, type: 'int16lu',
                    unpack: function(binary, struct) {
                        struct[k] = unpack16l(binary);
                    },

                    pack: function(struct, binary) {
                        if (struct==null) { pack16l(0,binary); return; }
                        pack16l(struct[k], binary);
						// if (typeof struct[k] === "undefined") struct[k]={};
      //                   pack16l(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 2 * n, {
                name: k, type: 'int16lu['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = n - 1; i >= 0; --i) {
                        struct[k][i] = unpack16l(binary);
                    }
                },

                pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = n - 1; i >= 0; --i) {
                        if (struct==null) { pack16l(0,binary); return; }
                        pack16l(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 16-bit signed big-endian integer.
        int16bs: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 2, {
                    name: k, type: 'int16bs',
                    unpack: function(binary, struct) {
                        struct[k] = sign16(unpack16b(binary));
                    },

                    pack: function(struct, binary) {
						if (typeof struct[k] === "undefined") struct[k]={};
                        pack16b(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 2 * n, {
                name: k, type: 'int16bs['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = sign16(unpack16b(binary));
                    }
                },

                pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = 0; i < n; ++i) {
						if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack16b(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 16-bit unsigned big-endian integer.
        int16bu: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 2, {
                    name: k, type: 'int16bu',
                    unpack: function(binary, struct) {
                        struct[k] = unpack16b(binary);
                    },

                    pack: function(struct, binary) {
						if (typeof struct[k] === "undefined") struct[k]={};
                        pack16b(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 2 * n, {
                name: k, type: 'int16bu['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = unpack16b(binary);
                    }
                },

                pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = 0; i < n; ++i) {
						if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack16b(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 24-bit signed little-endian integer.
        int24ls: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 3, {
                    name: k, type: 'int24ls',
                    unpack: function(binary, struct) {
                        struct[k] = sign24(unpack24l(binary));
                    },

                    pack: function(struct, binary) {
						if (typeof struct[k] === "undefined") struct[k]={};
                        pack24l(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 3 * n, {
                name: k, type: 'int24ls['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = n - 1; i >= 0; --i) {
                        struct[k][i] = sign24(unpack24l(binary));
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = n - 1; i >= 0; --i) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack24l(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 24-bit unsigned little-endian integer.
        int24lu: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 3, {
                    name: k, type: 'int24lu',
                    unpack: function(binary, struct) {
                        struct[k] = unpack24l(binary);
                    },

                    pack: function(struct, binary) {
						if (typeof struct[k] === "undefined") struct[k]={};
                        pack24l(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 3 * n, {
                name: k, type: 'int24lu['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = n - 1; i >= 0; --i) {
                        struct[k][i] = unpack24l(binary);
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = n - 1; i >= 0; --i) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack24l(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 24-bit signed big-endian integer.
        int24bs: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 3, {
                    name: k, type: 'int24bs',
                    unpack: function(binary, struct) {
                        struct[k] = sign24(unpack24b(binary));
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};
                        pack24b(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 3 * n, {
                name: k, type: 'int24bs['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = sign24(unpack24b(binary));
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = 0; i < n; ++i) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack24b(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 24-bit unsigned big-endian integer.
        int24bu: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 3, {
                    name: k, type: 'int24bu',
                    unpack: function(binary, struct) {
                        struct[k] = unpack24b(binary);
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};
                        pack24b(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 3 * n, {
                name: k, type: 'int24bu['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = unpack24b(binary);
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = 0; i < n; ++i) {
					if(typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack24b(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 32-bit signed little-endian integer.
        int32ls: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 4, {
                    name: k, type: 'int32ls',
                    unpack: function(binary, struct) {
                        struct[k] = sign32(unpack32l(binary));
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};
                        pack32l(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 4 * n, {
                name: k, type: 'int32ls['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = n - 1; i >= 0; --i) {
                        struct[k][i] = sign32(unpack32l(binary));
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = n - 1; i >= 0; --i) {
					if(typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack32l(struct[k][i] || 0, binary);
                    }
                }
            });
        },
        debug: function(){
            console.log("SIZE: " + this.size);
            return new Restruct(this, 0, []);
        },
        // 32-bit unsigned little-endian integer.
        int32lu: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 4, {
                    name: k, type: 'int32lu',
                    unpack: function(binary, struct) {
                        struct[k] = unpack32l(binary);
                    },

                    pack: function(struct, binary) {
						//if (typeof(struct) == "undefined") struct = [];
                        //if (struct==null) struct={};
						//if (typeof(struct[k]) == "undefined") struct[k]={};

						//if (struct==null) { console.log('Errors here'); debugger; }
                        if (struct==null) { pack32l(0,binary); return; }
                        pack32l(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 4 * n, {
                name: k, type: 'int32lu['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = n - 1; i >= 0; --i) {
                        struct[k][i] = unpack32l(binary);
                    }
                },

                pack: function(struct, binary) {
                    for(var i = n - 1; i >= 0; --i) {
                            pack32l(struct[k] === undefined || struct[k][i] === undefined ? 0 : struct[k][i], binary);
                    }
                }
            });
        },

        // 32-bit signed big-endian integer.
        int32bs: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 4, {
                    name: k, type: 'int32bs',
                    unpack: function(binary, struct) {
                        struct[k] = sign32(unpack32b(binary));
                    },

                    pack: function(struct, binary) {
						if (typeof struct[k] === "undefined") struct[k]={};
                        pack32b(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 4 * n, {
                name: k, type: 'int32bs['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = sign32(unpack32b(binary));
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = 0; i < n; ++i) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack32b(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 32-bit unsigned big-endian integer.
        int32bu: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 4, {
                    name: k, type: 'int32bu',
                    unpack: function(binary, struct) {
                        struct[k] = unpack32b(binary);
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack32b(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 4 * n, {
                name: k, type: 'int32bu['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = unpack32b(binary);
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k][i] === "undefined") struct[k][i]={};
                    for(var i = 0; i < n; ++i) {
					if(typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack32b(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 40-bit signed little-endian integer.
        int40ls: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 5, {
                    name: k, type: 'int40ls',
                    unpack: function(binary, struct) {
                        struct[k] = sign40(unpack40l(binary));
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack40l(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 5 * n, {
                name: k, type: 'int40ls['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = n - 1; i >= 0; --i) {
                        struct[k][i] = sign40(unpack40l(binary));
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k][i] === "undefined") struct[k][i]={};
                    for(var i = n - 1; i >= 0; --i) {
					if(typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack40l(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 40-bit unsigned little-endian integer.
        int40lu: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 5, {
                    name: k, type: 'int40lu',
                    unpack: function(binary, struct) {
                        struct[k] = unpack40l(binary);
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack40l(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 5 * n, {
                name: k, type: 'int40lu['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = n - 1; i >= 0; --i) {
                        struct[k][i] = unpack40l(binary);
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k][i] === "undefined") struct[k][i]={};
                    for(var i = n - 1; i >= 0; --i) {
					if(typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack40l(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 40-bit signed big-endian integer.
        int40bs: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 5, {
                    name: k, type: 'int40bs',
                    unpack: function(binary, struct) {
                        struct[k] = sign40(unpack40b(binary));
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack40b(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 5 * n, {
                name: k, type: 'int40bs['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = sign40(unpack40b(binary));
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k][i] === "undefined") struct[k][i]={};
                    for(var i = 0; i < n; ++i) {
					if(typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack40b(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 40-bit unsigned big-endian integer.
        int40bu: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 5, {
                    name: k, type: 'int40bu',
                    unpack: function(binary, struct) {
                        struct[k] = unpack40b(binary);
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack40b(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 5 * n, {
                name: k, type: 'int40bu['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = unpack40b(binary);
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k][i] === "undefined") struct[k][i]={};
                    for(var i = 0; i < n; ++i) {
					if(typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack40b(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 48-bit signed little-endian integer.
        int48ls: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 6, {
                    name: k, type: 'int48ls',
                    unpack: function(binary, struct) {
                        struct[k] = sign48(unpack48l(binary));
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack48l(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 6 * n, {
                name: k, type: 'int48ls['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = n - 1; i >= 0; --i) {
                        struct[k][i] = sign48(unpack48l(binary));
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k][i] === "undefined") struct[k][i]={};
                    for(var i = n - 1; i >= 0; --i) {
					if(typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack48l(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 48-bit unsigned little-endian integer.
        int48lu: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 6, {
                    name: k, type: 'int48lu',
                    unpack: function(binary, struct) {
                        struct[k] = unpack48l(binary);
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack48l(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 6 * n, {
                name: k, type: 'int48lu['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = n - 1; i >= 0; --i) {
                        struct[k][i] = unpack48l(binary);
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k][i] === "undefined") struct[k][i]={};
                    for(var i = n - 1; i >= 0; --i) {
					if(typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack48l(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 48-bit signed big-endian integer.
        int48bs: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 6, {
                    name: k, type: 'int48bs',
                    unpack: function(binary, struct) {
                        struct[k] = sign48(unpack48b(binary));
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack48b(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 6 * n, {
                name: k, type: 'int48bs['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = sign48(unpack48b(binary));
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k][i] === "undefined") struct[k][i]={};
                    for(var i = 0; i < n; ++i) {
					if(typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack48b(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // 48-bit unsigned big-endian integer.
        int48bu: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 6, {
                    name: k, type: 'int48bu',
                    unpack: function(binary, struct) {
                        struct[k] = unpack48b(binary);
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack48b(struct[k], binary);
                    }
                });
            }

            return new Restruct(this, 6 * n, {
                name: k, type: 'int48bu['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = unpack48b(binary);
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k][i] === "undefined") struct[k][i]={};
                    for(var i = 0; i < n; ++i) {
					if(typeof struct[k][i] === "undefined") struct[k][i]={};
                        pack48b(struct[k][i] || 0, binary);
                    }
                }
            });
        },

        // UTF-8 string.
        string: function(k, n, a) { // k is name of string, n is length of string, a is length of array
                if (typeof a === "undefined")
                    {
                        return new Restruct(this, n, {
                        name: k, type: 'string['+n+']',
                        // Not Array of string
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
        					if (struct==null) struct={};
                            if (typeof struct[k] === "undefined")
                            {
                                struct[k]='';
                            }

                            if(struct[k] === null) struct[k] = "";

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
            }
            else
            { // Array of string
                return new Restruct(this, n * a, {
                name: k, type: 'string['+n+']['+a+']',
                unpack: function(binary, struct) {
                    struct[k] = [];

                    for(var i = 0; i < a; ++i) {
                        var bytes = [];
                        var eos = false;
                        for(var x = 0; x < n; ++x) {
                            var byte = unpack8(binary);
                            if(byte === 0) eos = true;

                            if(!eos) bytes.push(byte);
                        }

                        struct[k][i] = decodeUTF8(String.fromCharCode.apply(String, bytes));
                    }
                },

                pack: function(struct, binary) {
                if (typeof struct[k] === "undefined") struct[k]=[];

                    for(var i = 0; i < a; ++i) {
                        if (typeof struct[k][i] === "undefined") struct[k][i]='';
                        if (struct[k][i]==null) struct[k][i]='';

                        var str = encodeUTF8(struct[k][i]);
                        var len = Math.min(str.length, n);

                        for(var x = 0; x < len; ++x) {
                            pack8(str.charCodeAt(x), binary);
                        }

                        for(; len < n; ++len) {
                            pack8(0, binary);
                        }
                    }
                }
            });
            }
        },

        // Another struct.
        struct: function(k, s, n) {
            if(typeof n === "undefined") {
                //return new Restruct(this, 1, { <-- This was reporting wrong sizes for struct-in-struct!
				return new Restruct(this, s.size, {
                    name: k, type: s,
                    unpack: function(binary, struct) {
                        struct[k] = s.unpack(binary.array, binary.offset);
                        binary.offset += s.size;
                    },

                    pack: function(struct, binary) {
						if (typeof struct[k] === "undefined") struct[k]={};
                        s.pack(struct[k], binary.array, binary.offset);
                        binary.offset += s.size;
                    }
                });
            }

            return new Restruct(this, n * s.size, {
                name: k, type: s+'['+n+']',
                unpack: function(binary, struct) {
                    struct[k] = [];
                    for(var i = 0; i < n; ++i) {
                        struct[k][i] = s.unpack(binary.array, binary.offset);
                        binary.offset += s.size;
                    }
                },

                pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = 0; i < n; ++i) {
						if (typeof struct[k][i] === "undefined") struct[k][i]={};
                        s.pack(struct[k][i], binary.array, binary.offset);
                        binary.offset += s.size;
                    }
                }
            });
        },

		// Floats
        // 32-bit signed little-endian float.
        float32l: function(k, n, buf) {
            if(typeof n === "undefined") {
                return new Restruct(this, 4, {
                    name: k, type: 'float32l',
                    unpack: function(binary, struct) {

						var buf = new ArrayBuffer(4);
						(new Uint32Array(buf))[0] = unpack32l(binary);
						var res = (new Float32Array(buf))[0];

						struct[k] = res;
                    },

                    pack: function(struct, binary) {
					if (typeof struct[k] === "undefined") struct[k]={};

						var buf = new ArrayBuffer(4);
						(new Float32Array(buf))[0] = struct[k];
						var res = (new Uint32Array(buf))[0];

						pack32l(res+1, binary);
				}
                });
            }

            return new Restruct(this, 4 * n, {
                name: k, type: 'float32l['+n+']',
                unpack: function(binary, struct) {
                    if(typeof buf !== "undefined") {
                        struct[k] = buf;
                    } else {
                        struct[k] = [];
                    }

                    for(var i = n - 1; i >= 0; --i) {

						var buf = new ArrayBuffer(4);
						(new Uint32Array(buf))[0] = unpack32l(binary);
						var res = (new Float32Array(buf))[0];

						struct[k][i] = res;
                    }
                },

                pack: function(struct, binary) {
				if (typeof struct[k] === "undefined") struct[k]={};
                    for(var i = n - 1; i >= 0; --i) {
					if(typeof struct[k][i] === "undefined") struct[k][i]={};
						var buf = new ArrayBuffer(4);
						(new Float32Array(buf))[0] = struct[k];
						var res = (new Uint32Array(buf))[0];

						pack32l(res, binary);
                    }
                }
            });
        },

        // Unpack an array to a struct.
        unpack: function(array, offset) {
            if(typeof offset === 'undefined') offset = 0;
			if(typeof array === 'undefined') array = [this.length];

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

        // Create js Object with undef keys.
        objectify: function() {
            if(typeof offset === 'undefined') offset = 0;
            if(typeof array === 'undefined') array = [this.length];

            function objectify_formats(formats){
                for(var i = 0; i < formats.length; ++i) {
                    var struct = {};
                    if (typeof(formats[i].type) === 'string') {
                        var objcheck = formats[i].type.indexOf('[object Object]');
                        if (objcheck===0){
                            formats[i].type = formats[i].type.substr(15);
                            objcheck=1;
                        }

                        var lb = formats[i].type.indexOf('[');
                        var rb = formats[i].type.indexOf(']');

                        if (lb>-1 && rb>-1) {
                            lb++;
                            rb--;

                            if (objcheck) {
                                struct[formats[i].name] = new Array(Number(formats[i].type.substr(lb,rb-lb)));
                                throw new Error('Array of struct not yet supported in objectify.');
                            }
                            else {
                                struct[formats[i].name] = new Array(Number(formats[i].type.substr(lb,rb-lb)));
                            }
                        } else {
                            struct[formats[i].name] = undefined;
                        }
                    } else if (typeof(formats[i].type) === 'object') {
                        struct[formats[i].name] = objectify_formats(formats[i].type.formats);
                    };
                }

                return struct;
            }
            var struct = objectify_formats(this.formats);


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
})();
