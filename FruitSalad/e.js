var encoding = require("encoding");
var input = 'ÆÄ±ØÆÈº¯µµ';
var resultBuffer = encoding.convert(input, 'iso8859-1'); // 'cp949', 'iso8859-1'
console.log(resultBuffer.toString());
console.log('파극팔변도');

var decoder = new (require('string_decoder').StringDecoder)('utf-8')
console.log(decoder.write(input))