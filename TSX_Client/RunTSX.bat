echo off
title TSX Basic Launcher
color A
cls

OPENFILES >nul 2>nul
if '%errorlevel%' NEQ '0' (

  echo You appear to not be running as administrator
  set /p admingain="Attempt to gain admin powers [y]|n: "
    
  if "%admingain%"=="n" (
      color CF
      echo Right click on this file and select 'Run as administrator'.
      pause
      exit /B
  )

    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params = %*:"=""
    echo UAC.ShellExecute "%~s0", "%params%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"
    cls

echo Hello %username% welcome to the TSX Basic Launcher
echo You are probably participating in the closed beta of our private server.
if not exist PrivateServerLauncher.exe echo Could not find PrivateServerLauncher.exe
if not exist TwelveSky.exe echo Could not find TwelveSky.exe

echo Please check blog for updates: http://inifintiesky.blogspot.co.nz/
set /a GuestLogin=(%Random% %%10)+1
echo Please enter your TSX login or use Guest%GuestLogin%
set /p usr=Username: 
if "%usr%"=="" set usr=Guest%GuestLogin%
set /p password=Password: 
if "%password%"=="" set password=Guest%GuestLogin%

:choose_resolution
echo Resolutions:
echo 1. 1024x768 Window
echo 2. 1024x768 Full Screen
echo 3. 1280x1024 Window
echo 4. 1280x1024 Full Screen
echo 5. Custom - You choose :)
set /p res=Please choose resolution [1]: 
echo 

set resx=1024
set resy=768
set mode=2
if "%res%"=="2" (
  set mode=3
)
if "%res%"=="3" (
  set resx=1280
  set resy=1024
  set mode=2
)
if "%res%"=="4" (
  set resx=1280
  set resy=1024
  set mode=3
)
if "%res%"=="5" (
  echo Okay you asked for it...
  set /p resx=ResolutionX: 
  set /p resy=ResolutionY: 
  set /p mode=Mode [2] Windowed 3 FullScreen: 
)

:launch
echo Launching Game...
PrivateServerLauncher.exe alt1games.twelvesky1:/%usr%/%password%/0/18/0/%mode%/%resx%/%resy%