var encoding = require("encoding");
var input = 'ÆÄ±ØÆÈº¯µµ';
var resultBuffer = encoding.convert(input, 'ISO-8859-1', 'CP949'); // 'cp949', 'iso8859-1'
console.log('파극팔변도');
console.log(resultBuffer.toString());

// convert from UTF-8 to ISO-8859-1
var Buffer = require('buffer').Buffer;
var Iconv  = require('iconv').Iconv;
var assert = require('assert');

var iconv = new Iconv('ISO-8859-1', 'UTF-8');
var iconv2 = new Iconv('UTF-8', 'CP949');
var buffer = iconv.convert(input);
// do something useful with the buffers
console.log(buffer.toString());

var c  =  new  Buffer('파극팔변도');
console.log(c.toString());