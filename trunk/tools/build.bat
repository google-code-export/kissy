@echo off
pushd "%~dp0"

cd ../src
for /F %%f in ('dir build.xml /b /s') do (
	cd %%~pf
	call e:\web_root\htdocs\ourtools\ant\bin\ant.bat
)
popd

cd ../build
for /F %%f in ('dir build.xml /b /s') do (
	cd %%~pf
	call e:\web_root\htdocs\ourtools\ant\bin\ant.bat
)
popd

pause
exit
