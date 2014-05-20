// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

/* jslint node: true */
/*global cli */
"use strict";

function LOBYTE(x) {
  return x;
};

// Pointer to data, length
cli.test = function CLI_Test(input) {
  var a1 = new Buffer('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  var a2 = new Buffer('000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
  var a3 = 3;

  var result; // eax@1 int
  var v4; // dl@1 unsigned __int8
  var v5; // cl@1 unsigned __int8
  var v6; // ebp@1 int
  var v7; // edx@2 int
  var v8; // edi@2 int
  var v9; // esi@2 int
  var v10; // ecx@3 int
  var v11; // edx@3 int
  var v12; // bl@3 char
  var v13; // [sp+Bh] [bp-1h]@3 char
  var v14; // [sp+10h] [bp+4h]@3 char

  result = a1;

  var __result = 0;

  v5 = a1.readUInt8(0);
  v4 = a1.readUInt8(1);
  v6 = 0;
  if ( a3 <= 0 )
  {
    a1.writeUInt8(v5,0);
    a1.writeUInt8(v4,1);
  }
  else
  {
    v8 = v4;
    v7 = a2;
    v9 = v5;
    do
    {
      v14 = v7.readUInt8(v6);
      v10 = (v9 + 1) % 256;
      v9 = v10;

      v11 = (v8 + result.readUInt32LE(v10 + 2)) % 256;
      v8 = v11;
      v13 = v11;
      //LOBYTE(v11) = result.readUInt8(v11 + 2);
      console.log(v11, ' - ', result.readUInt8(v11 + 2));
      v11 = result.readUInt8(v11 + 2);

      result.writeUInt8(result.readUInt8(v10 + 2),  v8 + 2);
      result.writeUInt8(v11,  v10 + 2);

      v12 = v14 ^ result.readUInt8((result.readUInt8(v8 +2) + v11) % 256 + __result + 2);
      v7 = a2;
      a2.writeUInt8(v12, v6++);
    }
    while ( v6 < a3 );    
    result.writeUInt8(0, v10);
    result.writeUInt8(0, v13);
  }

  logHex(result);
};

cli.help.help = function CLI_Test_help(input) {
  return 'Runs a test.';
};

// Half converted function
// _BYTE *__stdcall encryptPacket(_BYTE *buffer, _BYTE *encryptBuffer, int size) {
//   _BYTE *result; // eax@1
//   char v4;       // dl@1
//   char v5;       // cl@1
//   int v6;        // ebp@1
//   _BYTE *v7;     // edx@2
//   int v8;        // edi@2
//   int v9;        // esi@2
//   int v10;       // ecx@3
//   int v11;       // edx@3
//   char v12;      // bl@3
//   char v13;      // [sp+Bh] [bp-1h]@3
//   char v14;      // [sp+10h] [bp+4h]@3

//   result = buffer;
//   v5 = *buffer;
//   v4 = buffer[1];
//   v6 = 0;
//   if ( size <= 0 ) {
//     buffer[0] = v5;
//     buffer[1] = v4;
//   }
//   else
//   {
//     v8 = (v4 && 0x000000FF);
//     v7 = encryptBuffer;
//     v9 = (v5 && 0x000000FF);
//     do
//     {
//       v14 = v7[v6];
//       v10 = (v9 + 1) % 256;
//       v9 = (v10 && 0x000000FF);
//       v11 = (v8 + result[(v10 && 0x000000FF) + 2]) % 256;
//       v8 = (v11 && 0x000000FF);
//       v13 = v11;
      

//       v11 = (v11 >> 8) && result[(v11 && 0x000000FF) + 2]
//       //LOBYTE(v11) = result[(v11 && 0x000000FF) + 2];

//       result[v8 + 2] = result[(v10 && 0x000000FF) + 2];
//       result[(v10 && 0x000000FF) + 2] = v11;
//       v12 = v14 ^ result[(result[v8 + 2] + (v11 && 0x000000FF)) % 256 + 2];
//       v7 = encryptBuffer;
//       encryptBuffer[v6++] = v12;
//     }
//     while ( v6 < size );
//     result[0] = v10;
//     result[1] = v13;
//   }
//   return result;
// }