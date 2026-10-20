@echo off
title Husky Adventures - Kaynnistin
echo Kaynnistetaan Husky Adventures...

:: Tarkistetaan onko portti 8000 aktiivisesti kuuntelutilassa (LISTENING)
netstat -ano | findstr LISTENING | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo Palvelin pyorii jo taustalla.
) else (
    echo Kaynnistetaan paikallinen palvelin...
    start /b py -m http.server 8000
    :: Odotetaan hetki palvelimen kaynnistymista
    timeout /t 1 /nobreak >nul
)

echo Avataan peli selaimessa...
start http://localhost:8000

exit
