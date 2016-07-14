@echo off
title TSX Alpha
node --expose-gc --debug %curpath% main | bunyan
pause
