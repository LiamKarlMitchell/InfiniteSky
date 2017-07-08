@echo off
title TSX Alpha
node --expose-gc %curpath% main | bunyan
pause
