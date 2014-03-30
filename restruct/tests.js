(function() {
    var tests = {
        // pad
        testUnpackPad: function(test) {
            test.expect(1);
            var struct = restruct.pad(2);
            test.deepEqual(struct.unpack([0, 0]), {});
            test.done();
        },

        testUnpackOnePad: function(test) {
            test.expect(1);
            var struct = restruct.pad();
            test.deepEqual(struct.unpack([0]), {});
            test.done();
        },

        testPackPad: function(test) {
            test.expect(1);
            var struct = restruct.pad(2);
            test.deepEqual(struct.pack({}), [0, 0]);
            test.done();
        },

        testPackOnePad: function(test) {
            test.expect(1);
            var struct = restruct.pad();
            test.deepEqual(struct.pack({}), [0]);
            test.done();
        },

        // boolean
        testUnpackBoolean: function(test) {
            test.expect(1);
            var struct = restruct.boolean('test', 2);
            test.deepEqual(struct.unpack([37, 24]), {test: [
                [true, false, true, false, false, true, false, false],
                [false, false, false, true, true, false, false, false]
            ]});
            test.done();
        },

        testUnpackOneBoolean: function(test) {
            test.expect(1);
            var struct = restruct.boolean('test');
            test.deepEqual(struct.unpack([37]), {test: [true, false, true, false, false, true, false, false]});
            test.done();
        },

        testPackBoolean: function(test) {
            test.expect(1);
            var struct = restruct.boolean('test', 2);
            test.deepEqual(struct.pack({test: [
                [true, false, true, false, false, true, false, false],
                [false, false, false, true, true, false, false, false]
            ]}), [37, 24]);
            test.done();
        },

        testPackOneBoolean: function(test) {
            test.expect(1);
            var struct = restruct.boolean('test');
            test.deepEqual(struct.pack({test: [true, false, true, false, false, true, false, false]}), [37]);
            test.done();
        },

        // nibble
        testUnpackNibble: function(test) {
            test.expect(1);
            var struct = restruct.nibble('test', 2);
            test.deepEqual(struct.unpack([0x37, 0x24]), {test: [
                [0x3, 0x7],
                [0x2, 0x4]
            ]});
            test.done();
        },

        testUnpackOneNibble: function(test) {
            test.expect(1);
            var struct = restruct.nibble('test');
            test.deepEqual(struct.unpack([0x37]), {test: [0x3, 0x7]});
            test.done();
        },

        testPackNibble: function(test) {
            test.expect(1);
            var struct = restruct.nibble('test', 2);
            test.deepEqual(struct.pack({test: [
                [0x3, 0x7],
                [0x2, 0x4]
            ]}), [0x37, 0x24]);
            test.done();
        },

        testPackOneNibble: function(test) {
            test.expect(1);
            var struct = restruct.nibble('test');
            test.deepEqual(struct.pack({test: [0x3, 0x7]}), [0x37]);
            test.done();
        },

        // int8
        testUnpackInt8ls: function(test) {
            test.expect(1);
            var struct = restruct.int8ls('test', 2);
            test.deepEqual(struct.unpack([0x34, 0xf2]), {test: [-0xe, 0x34]});
            test.done();
        },

        testUnpackOneInt8ls: function(test) {
            test.expect(1);
            var struct = restruct.int8ls('test');
            test.deepEqual(struct.unpack([0xf2]), {test: -0xe});
            test.done();
        },

        testPackInt8ls: function(test) {
            test.expect(1);
            var struct = restruct.int8ls('test', 2);
            test.deepEqual(struct.pack({test: [0xf2, 0x34]}), [0x34, 0xf2]);
            test.done();
        },

        testPackOneInt8ls: function(test) {
            test.expect(1);
            var struct = restruct.int8ls('test');
            test.deepEqual(struct.pack({test: 0xf2}), [0xf2]);
            test.done();
        },

        testUnpackInt8lu: function(test) {
            test.expect(1);
            var struct = restruct.int8lu('test', 2);
            test.deepEqual(struct.unpack([0x34, 0xf2]), {test: [0xf2, 0x34]});
            test.done();
        },

        testUnpackOneInt8lu: function(test) {
            test.expect(1);
            var struct = restruct.int8lu('test');
            test.deepEqual(struct.unpack([0xf2]), {test: 0xf2});
            test.done();
        },

        testPackInt8lu: function(test) {
            test.expect(1);
            var struct = restruct.int8lu('test', 2);
            test.deepEqual(struct.pack({test: [0xf2, 0x34]}), [0x34, 0xf2]);
            test.done();
        },

        testPackOneInt8lu: function(test) {
            test.expect(1);
            var struct = restruct.int8lu('test');
            test.deepEqual(struct.pack({test: 0xf2}), [0xf2]);
            test.done();
        },

        testUnpackInt8bs: function(test) {
            test.expect(1);
            var struct = restruct.int8bs('test', 2);
            test.deepEqual(struct.unpack([0xf2, 0x34]), {test: [-0xe, 0x34]});
            test.done();
        },

        testUnpackOneInt8bs: function(test) {
            test.expect(1);
            var struct = restruct.int8bs('test');
            test.deepEqual(struct.unpack([0xf2]), {test: -0xe});
            test.done();
        },

        testPackInt8bs: function(test) {
            test.expect(1);
            var struct = restruct.int8bs('test', 2);
            test.deepEqual(struct.pack({test: [0xf2, 0x34]}), [0xf2, 0x34]);
            test.done();
        },

        testPackOneInt8bs: function(test) {
            test.expect(1);
            var struct = restruct.int8bs('test');
            test.deepEqual(struct.pack({test: 0xf2}), [0xf2]);
            test.done();
        },

        testUnpackInt8bu: function(test) {
            test.expect(1);
            var struct = restruct.int8bu('test', 2);
            test.deepEqual(struct.unpack([0xf2, 0x34]), {test: [0xf2, 0x34]});
            test.done();
        },

        testUnpackOneInt8bu: function(test) {
            test.expect(1);
            var struct = restruct.int8bu('test');
            test.deepEqual(struct.unpack([0xf2]), {test: 0xf2});
            test.done();
        },

        testPackInt8bu: function(test) {
            test.expect(1);
            var struct = restruct.int8bu('test', 2);
            test.deepEqual(struct.pack({test: [0xf2, 0x34]}), [0xf2, 0x34]);
            test.done();
        },

        testPackOneInt8bu: function(test) {
            test.expect(1);
            var struct = restruct.int8bu('test');
            test.deepEqual(struct.pack({test: 0xf2}), [0xf2]);
            test.done();
        },

        // int16
        testUnpackInt16ls: function(test) {
            test.expect(1);
            var struct = restruct.int16ls('test', 2);
            test.deepEqual(struct.unpack([0x78, 0xf6, 0x34, 0xf2]), {test: [-0xdcc, -0x988]});
            test.done();
        },

        testUnpackOneInt16ls: function(test) {
            test.expect(1);
            var struct = restruct.int16ls('test');
            test.deepEqual(struct.unpack([0x34, 0xf2]), {test: -0xdcc});
            test.done();
        },

        testPackInt16ls: function(test) {
            test.expect(1);
            var struct = restruct.int16ls('test', 2);
            test.deepEqual(struct.pack({test: [0xf234, 0xf678]}), [0x78, 0xf6, 0x34, 0xf2]);
            test.done();
        },

        testPackOneInt16ls: function(test) {
            test.expect(1);
            var struct = restruct.int16ls('test');
            test.deepEqual(struct.pack({test: 0xf234}), [0x34, 0xf2]);
            test.done();
        },

        testUnpackInt16lu: function(test) {
            test.expect(1);
            var struct = restruct.int16lu('test', 2);
            test.deepEqual(struct.unpack([0x78, 0xf6, 0x34, 0xf2]), {test: [0xf234, 0xf678]});
            test.done();
        },

        testUnpackOneInt16lu: function(test) {
            test.expect(1);
            var struct = restruct.int16lu('test');
            test.deepEqual(struct.unpack([0x34, 0xf2]), {test: 0xf234});
            test.done();
        },

        testPackInt16lu: function(test) {
            test.expect(1);
            var struct = restruct.int16lu('test', 2);
            test.deepEqual(struct.pack({test: [0xf234, 0xf678]}), [0x78, 0xf6, 0x34, 0xf2]);
            test.done();
        },

        testPackOneInt16lu: function(test) {
            test.expect(1);
            var struct = restruct.int16lu('test');
            test.deepEqual(struct.pack({test: 0xf234}), [0x34, 0xf2]);
            test.done();
        },

        testUnpackInt16bs: function(test) {
            test.expect(1);
            var struct = restruct.int16bs('test', 2);
            test.deepEqual(struct.unpack([0xf2, 0x34, 0xf6, 0x78]), {test: [-0xdcc, -0x988]});
            test.done();
        },

        testUnpackOneInt16bs: function(test) {
            test.expect(1);
            var struct = restruct.int16bs('test');
            test.deepEqual(struct.unpack([0xf2, 0x34]), {test: -0xdcc});
            test.done();
        },

        testPackInt16bs: function(test) {
            test.expect(1);
            var struct = restruct.int16bs('test', 2);
            test.deepEqual(struct.pack({test: [0xf234, 0xf678]}), [0xf2, 0x34, 0xf6, 0x78]);
            test.done();
        },

        testPackOneInt16bs: function(test) {
            test.expect(1);
            var struct = restruct.int16bs('test');
            test.deepEqual(struct.pack({test: 0xf234}), [0xf2, 0x34]);
            test.done();
        },

        testUnpackInt16bu: function(test) {
            test.expect(1);
            var struct = restruct.int16bu('test', 2);
            test.deepEqual(struct.unpack([0xf2, 0x34, 0xf6, 0x78]), {test: [0xf234, 0xf678]});
            test.done();
        },

        testUnpackOneInt16bu: function(test) {
            test.expect(1);
            var struct = restruct.int16bu('test');
            test.deepEqual(struct.unpack([0xf2, 0x34]), {test: 0xf234});
            test.done();
        },

        testPackInt16bu: function(test) {
            test.expect(1);
            var struct = restruct.int16bu('test', 2);
            test.deepEqual(struct.pack({test: [0xf234, 0xf678]}), [0xf2, 0x34, 0xf6, 0x78]);
            test.done();
        },

        testPackOneInt16bu: function(test) {
            test.expect(1);
            var struct = restruct.int16bu('test');
            test.deepEqual(struct.pack({test: 0xf234}), [0xf2, 0x34]);
            test.done();
        },

        // int24
        testUnpackInt24ls: function(test) {
            test.expect(1);
            var struct = restruct.int24ls('test', 2);
            test.deepEqual(struct.unpack([0xab, 0x90, 0xf8, 0x56, 0x34, 0xf2]), {test: [-0xdcbaa, -0x76f55]});
            test.done();
        },

        testUnpackOneInt24ls: function(test) {
            test.expect(1);
            var struct = restruct.int24ls('test');
            test.deepEqual(struct.unpack([0x56, 0x34, 0xf2]), {test: -0xdcbaa});
            test.done();
        },

        testPackInt24ls: function(test) {
            test.expect(1);
            var struct = restruct.int24ls('test', 2);
            test.deepEqual(struct.pack({test: [0xf23456, 0xf890ab]}), [0xab, 0x90, 0xf8, 0x56, 0x34, 0xf2]);
            test.done();
        },

        testPackOneInt24ls: function(test) {
            test.expect(1);
            var struct = restruct.int24ls('test');
            test.deepEqual(struct.pack({test: 0xf23456}), [0x56, 0x34, 0xf2]);
            test.done();
        },

        testUnpackInt24lu: function(test) {
            test.expect(1);
            var struct = restruct.int24lu('test', 2);
            test.deepEqual(struct.unpack([0xab, 0x90, 0xf8, 0x56, 0x34, 0xf2]), {test: [0xf23456, 0xf890ab]});
            test.done();
        },

        testUnpackOneInt24lu: function(test) {
            test.expect(1);
            var struct = restruct.int24lu('test');
            test.deepEqual(struct.unpack([0x56, 0x34, 0xf2]), {test: 0xf23456});
            test.done();
        },

        testPackInt24lu: function(test) {
            test.expect(1);
            var struct = restruct.int24lu('test', 2);
            test.deepEqual(struct.pack({test: [0xf23456, 0xf890ab]}), [0xab, 0x90, 0xf8, 0x56, 0x34, 0xf2]);
            test.done();
        },

        testPackOneInt24lu: function(test) {
            test.expect(1);
            var struct = restruct.int24lu('test');
            test.deepEqual(struct.pack({test: 0xf23456}), [0x56, 0x34, 0xf2]);
            test.done();
        },

        testUnpackInt24bs: function(test) {
            test.expect(1);
            var struct = restruct.int24bs('test', 2);
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56, 0xf8, 0x90, 0xab]), {test: [-0xdcbaa, -0x76f55]});
            test.done();
        },

        testUnpackOneInt24bs: function(test) {
            test.expect(1);
            var struct = restruct.int24bs('test');
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56]), {test: -0xdcbaa});
            test.done();
        },

        testPackInt24bs: function(test) {
            test.expect(1);
            var struct = restruct.int24bs('test', 2);
            test.deepEqual(struct.pack({test: [0xf23456, 0xf890ab]}), [0xf2, 0x34, 0x56, 0xf8, 0x90, 0xab]);
            test.done();
        },

        testPackOneInt24bs: function(test) {
            test.expect(1);
            var struct = restruct.int24bs('test');
            test.deepEqual(struct.pack({test: 0xf23456}), [0xf2, 0x34, 0x56]);
            test.done();
        },

        testUnpackInt24bu: function(test) {
            test.expect(1);
            var struct = restruct.int24bu('test', 2);
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56, 0xf8, 0x90, 0xab]), {test: [0xf23456, 0xf890ab]});
            test.done();
        },

        testUnpackOneInt24bu: function(test) {
            test.expect(1);
            var struct = restruct.int24bu('test');
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56]), {test: 0xf23456});
            test.done();
        },

        testPackInt24bu: function(test) {
            test.expect(1);
            var struct = restruct.int24bu('test', 2);
            test.deepEqual(struct.pack({test: [0xf23456, 0xf890ab]}), [0xf2, 0x34, 0x56, 0xf8, 0x90, 0xab]);
            test.done();
        },

        testPackOneInt24bu: function(test) {
            test.expect(1);
            var struct = restruct.int24bu('test');
            test.deepEqual(struct.pack({test: 0xf23456}), [0xf2, 0x34, 0x56]);
            test.done();
        },

        // int32
        testUnpackInt32ls: function(test) {
            test.expect(1);
            var struct = restruct.int32ls('test', 2);
            test.deepEqual(struct.unpack([0xef, 0xcd, 0xab, 0xf0, 0x78, 0x56, 0x34, 0xf2]), {test: [-0xdcba988, -0xf543211]});
            test.done();
        },

        testUnpackOneInt32ls: function(test) {
            test.expect(1);
            var struct = restruct.int32ls('test');
            test.deepEqual(struct.unpack([0x78, 0x56, 0x34, 0xf2]), {test: -0xdcba988});
            test.done();
        },

        testPackInt32ls: function(test) {
            test.expect(1);
            var struct = restruct.int32ls('test', 2);
            test.deepEqual(struct.pack({test: [0xf2345678, 0xf0abcdef]}), [0xef, 0xcd, 0xab, 0xf0, 0x78, 0x56, 0x34, 0xf2]);
            test.done();
        },

        testPackOneInt32ls: function(test) {
            test.expect(1);
            var struct = restruct.int32ls('test');
            test.deepEqual(struct.pack({test: 0xf2345678}), [0x78, 0x56, 0x34, 0xf2]);
            test.done();
        },

        testUnpackInt32lu: function(test) {
            test.expect(1);
            var struct = restruct.int32lu('test', 2);
            test.deepEqual(struct.unpack([0xef, 0xcd, 0xab, 0xf0, 0x78, 0x56, 0x34, 0xf2]), {test: [0xf2345678, 0xf0abcdef]});
            test.done();
        },

        testUnpackOneInt32lu: function(test) {
            test.expect(1);
            var struct = restruct.int32lu('test');
            test.deepEqual(struct.unpack([0x78, 0x56, 0x34, 0xf2]), {test: 0xf2345678});
            test.done();
        },

        testPackInt32lu: function(test) {
            test.expect(1);
            var struct = restruct.int32lu('test', 2);
            test.deepEqual(struct.pack({test: [0xf2345678, 0xf0abcdef]}), [0xef, 0xcd, 0xab, 0xf0, 0x78, 0x56, 0x34, 0xf2]);
            test.done();
        },

        testPackOneInt32lu: function(test) {
            test.expect(1);
            var struct = restruct.int32lu('test');
            test.deepEqual(struct.pack({test: 0xf2345678}), [0x78, 0x56, 0x34, 0xf2]);
            test.done();
        },

        testUnpackInt32bs: function(test) {
            test.expect(1);
            var struct = restruct.int32bs('test', 2);
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56, 0x78, 0xf0, 0xab, 0xcd, 0xef]), {test: [-0xdcba988, -0xf543211]});
            test.done();
        },

        testUnpackOneInt32bs: function(test) {
            test.expect(1);
            var struct = restruct.int32bs('test');
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56, 0x78]), {test: -0xdcba988});
            test.done();
        },

        testPackInt32bs: function(test) {
            test.expect(1);
            var struct = restruct.int32bs('test', 2);
            test.deepEqual(struct.pack({test: [0xf2345678, 0xf0abcdef]}), [0xf2, 0x34, 0x56, 0x78, 0xf0, 0xab, 0xcd, 0xef]);
            test.done();
        },

        testPackOneInt32bs: function(test) {
            test.expect(1);
            var struct = restruct.int32bs('test');
            test.deepEqual(struct.pack({test: 0xf2345678}), [0xf2, 0x34, 0x56, 0x78]);
            test.done();
        },

        testUnpackInt32bu: function(test) {
            test.expect(1);
            var struct = restruct.int32bu('test', 2);
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56, 0x78, 0xf0, 0xab, 0xcd, 0xef]), {test: [0xf2345678, 0xf0abcdef]});
            test.done();
        },

        testUnpackOneInt32bu: function(test) {
            test.expect(1);
            var struct = restruct.int32bu('test');
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56, 0x78]), {test: 0xf2345678});
            test.done();
        },

        testPackInt32bu: function(test) {
            test.expect(1);
            var struct = restruct.int32bu('test', 2);
            test.deepEqual(struct.pack({test: [0xf2345678, 0xf0abcdef]}), [0xf2, 0x34, 0x56, 0x78, 0xf0, 0xab, 0xcd, 0xef]);
            test.done();
        },

        testPackOneInt32bu: function(test) {
            test.expect(1);
            var struct = restruct.int32bu('test');
            test.deepEqual(struct.pack({test: 0xf2345678}), [0xf2, 0x34, 0x56, 0x78]);
            test.done();
        },

        // int40
        testUnpackInt40ls: function(test) {
            test.expect(1);
            var struct = restruct.int40ls('test', 2);
            test.deepEqual(struct.unpack([0x34, 0x12, 0xef, 0xcd, 0xfb, 0x90, 0x78, 0x56, 0x34, 0xf2]), {test: [-0xdcba98770, -0x43210edcc]});
            test.done();
        },

        testUnpackOneInt40ls: function(test) {
            test.expect(1);
            var struct = restruct.int40ls('test');
            test.deepEqual(struct.unpack([0x90, 0x78, 0x56, 0x34, 0xf2]), {test: -0xdcba98770});
            test.done();
        },

        testPackInt40ls: function(test) {
            test.expect(1);
            var struct = restruct.int40ls('test', 2);
            test.deepEqual(struct.pack({test: [0xf234567890, 0xfbcdef1234]}), [0x34, 0x12, 0xef, 0xcd, 0xfb, 0x90, 0x78, 0x56, 0x34, 0xf2]);
            test.done();
        },

        testPackOneInt40ls: function(test) {
            test.expect(1);
            var struct = restruct.int40ls('test');
            test.deepEqual(struct.pack({test: 0xf234567890}), [0x90, 0x78, 0x56, 0x34, 0xf2]);
            test.done();
        },

        testUnpackInt40lu: function(test) {
            test.expect(1);
            var struct = restruct.int40lu('test', 2);
            test.deepEqual(struct.unpack([0x34, 0x12, 0xef, 0xcd, 0xfb, 0x90, 0x78, 0x56, 0x34, 0xf2]), {test: [0xf234567890, 0xfbcdef1234]});
            test.done();
        },

        testUnpackOneInt40lu: function(test) {
            test.expect(1);
            var struct = restruct.int40lu('test');
            test.deepEqual(struct.unpack([0x90, 0x78, 0x56, 0x34, 0xf2]), {test: 0xf234567890});
            test.done();
        },

        testPackInt40lu: function(test) {
            test.expect(1);
            var struct = restruct.int40lu('test', 2);
            test.deepEqual(struct.pack({test: [0xf234567890, 0xfbcdef1234]}), [0x34, 0x12, 0xef, 0xcd, 0xfb, 0x90, 0x78, 0x56, 0x34, 0xf2]);
            test.done();
        },

        testPackOneInt40lu: function(test) {
            test.expect(1);
            var struct = restruct.int40lu('test');
            test.deepEqual(struct.pack({test: 0xf234567890}), [0x90, 0x78, 0x56, 0x34, 0xf2]);
            test.done();
        },

        testUnpackInt40bs: function(test) {
            test.expect(1);
            var struct = restruct.int40bs('test', 2);
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56, 0x78, 0x90, 0xfb, 0xcd, 0xef, 0x12, 0x34]), {test: [-0xdcba98770, -0x43210edcc]});
            test.done();
        },

        testUnpackOneInt40bs: function(test) {
            test.expect(1);
            var struct = restruct.int40bs('test');
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56, 0x78, 0x90]), {test: -0xdcba98770});
            test.done();
        },

        testPackInt40bs: function(test) {
            test.expect(1);
            var struct = restruct.int40bs('test', 2);
            test.deepEqual(struct.pack({test: [0xf234567890, 0xfbcdef1234]}), [0xf2, 0x34, 0x56, 0x78, 0x90, 0xfb, 0xcd, 0xef, 0x12, 0x34]);
            test.done();
        },

        testPackOneInt40bs: function(test) {
            test.expect(1);
            var struct = restruct.int40bs('test');
            test.deepEqual(struct.pack({test: 0xf234567890}), [0xf2, 0x34, 0x56, 0x78, 0x90]);
            test.done();
        },

        testUnpackInt40bu: function(test) {
            test.expect(1);
            var struct = restruct.int40bu('test', 2);
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56, 0x78, 0x90, 0xfb, 0xcd, 0xef, 0x12, 0x34]), {test: [0xf234567890, 0xfbcdef1234]});
            test.done();
        },

        testUnpackOneInt40bu: function(test) {
            test.expect(1);
            var struct = restruct.int40bu('test');
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56, 0x78, 0x90]), {test: 0xf234567890});
            test.done();
        },

        testPackInt40bu: function(test) {
            test.expect(1);
            var struct = restruct.int40bu('test', 2);
            test.deepEqual(struct.pack({test: [0xf234567890, 0xfbcdef1234]}), [0xf2, 0x34, 0x56, 0x78, 0x90, 0xfb, 0xcd, 0xef, 0x12, 0x34]);
            test.done();
        },

        testPackOneInt40bu: function(test) {
            test.expect(1);
            var struct = restruct.int40bu('test');
            test.deepEqual(struct.pack({test: 0xf234567890}), [0xf2, 0x34, 0x56, 0x78, 0x90]);
            test.done();
        },

        // int48
        testUnpackInt48ls: function(test) {
            test.expect(1);
            var struct = restruct.int48ls('test', 2);
            test.deepEqual(struct.unpack([0x56, 0x34, 0x12, 0xef, 0xcd, 0xfb, 0xab, 0x90, 0x78, 0x56, 0x34, 0xf2]), {test: [-0xdcba9876f55, -0x43210edcbaa]});
            test.done();
        },

        testUnpackOneInt48ls: function(test) {
            test.expect(1);
            var struct = restruct.int48ls('test');
            test.deepEqual(struct.unpack([0xab, 0x90, 0x78, 0x56, 0x34, 0xf2]), {test: -0xdcba9876f55});
            test.done();
        },

        testPackInt48ls: function(test) {
            test.expect(1);
            var struct = restruct.int48ls('test', 2);
            test.deepEqual(struct.pack({test: [0xf234567890ab, 0xfbcdef123456]}), [0x56, 0x34, 0x12, 0xef, 0xcd, 0xfb, 0xab, 0x90, 0x78, 0x56, 0x34, 0xf2]);
            test.done();
        },

        testPackOneInt48ls: function(test) {
            test.expect(1);
            var struct = restruct.int48ls('test');
            test.deepEqual(struct.pack({test: 0xf234567890ab}), [0xab, 0x90, 0x78, 0x56, 0x34, 0xf2]);
            test.done();
        },

        testUnpackInt48lu: function(test) {
            test.expect(1);
            var struct = restruct.int48lu('test', 2);
            test.deepEqual(struct.unpack([0x56, 0x34, 0x12, 0xef, 0xcd, 0xfb, 0xab, 0x90, 0x78, 0x56, 0x34, 0xf2]), {test: [0xf234567890ab, 0xfbcdef123456]});
            test.done();
        },

        testUnpackOneInt48lu: function(test) {
            test.expect(1);
            var struct = restruct.int48lu('test');
            test.deepEqual(struct.unpack([0xab, 0x90, 0x78, 0x56, 0x34, 0xf2]), {test: 0xf234567890ab});
            test.done();
        },

        testPackInt48lu: function(test) {
            test.expect(1);
            var struct = restruct.int48lu('test', 2);
            test.deepEqual(struct.pack({test: [0xf234567890ab, 0xfbcdef123456]}), [0x56, 0x34, 0x12, 0xef, 0xcd, 0xfb, 0xab, 0x90, 0x78, 0x56, 0x34, 0xf2]);
            test.done();
        },

        testPackOneInt48lu: function(test) {
            test.expect(1);
            var struct = restruct.int48lu('test');
            test.deepEqual(struct.pack({test: 0xf234567890ab}), [0xab, 0x90, 0x78, 0x56, 0x34, 0xf2]);
            test.done();
        },

        testUnpackInt48bs: function(test) {
            test.expect(1);
            var struct = restruct.int48bs('test', 2);
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56, 0x78, 0x90, 0xab, 0xfb, 0xcd, 0xef, 0x12, 0x34, 0x56]), {test: [-0xdcba9876f55, -0x43210edcbaa]});
            test.done();
        },

        testUnpackOneInt48bs: function(test) {
            test.expect(1);
            var struct = restruct.int48bs('test');
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56, 0x78, 0x90, 0xab]), {test: -0xdcba9876f55});
            test.done();
        },

        testPackInt48bs: function(test) {
            test.expect(1);
            var struct = restruct.int48bs('test', 2);
            test.deepEqual(struct.pack({test: [0xf234567890ab, 0xfbcdef123456]}), [0xf2, 0x34, 0x56, 0x78, 0x90, 0xab, 0xfb, 0xcd, 0xef, 0x12, 0x34, 0x56]);
            test.done();
        },

        testPackOneInt48bs: function(test) {
            test.expect(1);
            var struct = restruct.int48bs('test');
            test.deepEqual(struct.pack({test: 0xf234567890ab}), [0xf2, 0x34, 0x56, 0x78, 0x90, 0xab]);
            test.done();
        },

        testUnpackInt48bu: function(test) {
            test.expect(1);
            var struct = restruct.int48bu('test', 2);
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56, 0x78, 0x90, 0xab, 0xfb, 0xcd, 0xef, 0x12, 0x34, 0x56]), {test: [0xf234567890ab, 0xfbcdef123456]});
            test.done();
        },

        testUnpackOneInt48bu: function(test) {
            test.expect(1);
            var struct = restruct.int48bu('test');
            test.deepEqual(struct.unpack([0xf2, 0x34, 0x56, 0x78, 0x90, 0xab]), {test: 0xf234567890ab});
            test.done();
        },

        testPackInt48bu: function(test) {
            test.expect(1);
            var struct = restruct.int48bu('test', 2);
            test.deepEqual(struct.pack({test: [0xf234567890ab, 0xfbcdef123456]}), [0xf2, 0x34, 0x56, 0x78, 0x90, 0xab, 0xfb, 0xcd, 0xef, 0x12, 0x34, 0x56]);
            test.done();
        },

        testPackOneInt48bu: function(test) {
            test.expect(1);
            var struct = restruct.int48bu('test');
            test.deepEqual(struct.pack({test: 0xf234567890ab}), [0xf2, 0x34, 0x56, 0x78, 0x90, 0xab]);
            test.done();
        },


        // struct
        testPackOneStruct: function(test) {
            test.expect(1);
            var struct = restruct.struct('test', restruct.string('test', 10));
            test.deepEqual(struct.pack({test: {test: "hello\u00ac"}}, []), [104, 101, 108, 108, 111, 194, 172, 0, 0, 0]);
            test.done();
        },

        testPackStruct: function(test) {
            test.expect(1);
            var struct = restruct.struct('test', restruct.string('test', 10), 2);
            test.deepEqual(struct.pack({test: [{test: "hello\u00ac"}, {test: "hallo\u00ac"}]}, []), [104, 101, 108, 108, 111, 194, 172, 0, 0, 0, 104, 97, 108, 108, 111, 194, 172, 0, 0, 0]);
            test.done();
        },

        testUnpackOneStruct: function(test) {
            test.expect(1);
            var struct = restruct.struct('test', restruct.string('test', 10));
            test.deepEqual(struct.unpack([104, 101, 108, 108, 111, 194, 172, 0, 0, 0]), {test: {test: "hello\u00ac"}});
            test.done();
        },

        testPackStruct: function(test) {
            test.expect(1);
            var struct = restruct.struct('test', restruct.string('test', 10), 2);
            test.deepEqual(struct.unpack([104, 101, 108, 108, 111, 194, 172, 0, 0, 0, 104, 97, 108, 108, 111, 194, 172, 0, 0, 0]), {test: [{test: "hello\u00ac"}, {test: "hallo\u00ac"}]});
            test.done();
        },

        // string
        testPackString: function(test) {
            test.expect(1);
            var struct = restruct.string('test', 10);
            test.deepEqual(struct.pack({test: "hello\u00ac"}, []), [104, 101, 108, 108, 111, 194, 172, 0, 0, 0]);
            test.done();
        },

        testUnpackString: function(test) {
            test.expect(1);
            var struct = restruct.string('test', 10);
            test.deepEqual(struct.unpack([104, 101, 108, 108, 111, 194, 172, 0, 0, 0]), {test: "hello\u00ac"});
            test.done();
        },

        // composition
        testPackComposed: function(test) {
            test.expect(2);
            var struct = restruct.string('a', 10).int8ls('b');
            test.strictEqual(struct.size, 11);
            test.deepEqual(struct.pack({a: "hello", b: -1}, []), [104, 101, 108, 108, 111, 0, 0, 0, 0, 0, 255]);
            test.done();
        },

        testUnpackComposed: function(test) {
            test.expect(1);
            var struct = restruct.string('a', 10).int8ls('b');
            test.deepEqual(struct.unpack([104, 101, 108, 108, 111, 0, 0, 0, 0, 0, 255]), {a: "hello", b: -1});
            test.done();
        },

        // typed arrays
        testPackTypedArray: function(test) {
            test.expect(1);

            if(typeof Uint8Array === 'undefined') {
                test.ok(true, "browser does not support typed arrays");
            } else {
                var struct = restruct.string('a', 10).int8ls('b');

                var arr = new Uint8Array(11);
                struct.pack({a: "hello", b: -1}, arr);

                var result = [];
                for(var i = 0; i < 11; ++i) {
                    result.push(arr[i]);
                }

                test.deepEqual(result, [104, 101, 108, 108, 111, 0, 0, 0, 0, 0, 255]);
            }
            test.done();
        },

        testUnpackTypedArray: function(test) {
            test.expect(1);
            if(typeof Uint8Array === 'undefined') {
                test.ok(true, "browser does not support typed arrays");
            } else {
                var struct = restruct.string('a', 10).int8ls('b');
                test.deepEqual(struct.unpack(new Uint8Array([104, 101, 108, 108, 111, 0, 0, 0, 0, 0, 255])), {a: "hello", b: -1});
            }
            test.done();
        }
    };

    var restruct;

    if(typeof module !== "undefined" && module.exports) {
        restruct = require(__dirname + '/restruct.js');
        module.exports = tests;
    }
    if(typeof window !== "undefined") {
        restruct = window.restruct;
        window.tests = tests;
    }
})();