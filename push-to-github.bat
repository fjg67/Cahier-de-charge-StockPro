@echo off
chcp 65001 >nul
echo ============================================
echo  StockPro - Push vers GitHub
echo ============================================
echo.

cd /d "%~dp0"

REM Copier les images d'abord (optionnel)
if exist "C:\Users\flori\.cursor\projects\c-Users-flori-Documents-Projet-Cahier-de-charge-StockPro\assets\*.png" (
    echo Copie des images...
    xcopy /Y "C:\Users\flori\.cursor\projects\c-Users-flori-Documents-Projet-Cahier-de-charge-StockPro\assets\*" "assets\" >nul 2>&1
)

echo [1/4] Ajout des fichiers...
git add index.html styles.css script.js README.md .gitignore .nojekyll copier-images.bat push-to-github.bat
git add assets\ 2>nul

echo [2/4] Statut...
git status

echo.
echo [3/4] Commit...
git commit -m "Cahier des charges StockPro - Site web complet" 2>nul
if errorlevel 1 (
    echo Pas de modification ou commit déjà fait.
)

echo [4/4] Push vers GitHub...
git push -u origin main

echo.
echo Terminé.
pause
