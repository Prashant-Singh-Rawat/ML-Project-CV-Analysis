$WshShell = New-Object -ComObject WScript.Shell
$StartupFolder = [Environment]::GetFolderPath("Startup")
$ShortcutPath = Join-Path $StartupFolder "TonyCV_App.lnk"
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)

$ProjectRoot = $PSScriptRoot
$VbsPath = Join-Path $ProjectRoot "start_hidden.vbs"

$Shortcut.TargetPath = "wscript.exe"
$Shortcut.Arguments = "`"$VbsPath`""
$Shortcut.WorkingDirectory = $ProjectRoot
$Shortcut.WindowStyle = 1
$Shortcut.IconLocation = "powershell.exe,0"
$Shortcut.Description = "Starts the TonyCV App Backend and Frontend"
$Shortcut.Save()

Write-Host "Startup shortcut created successfully at: $ShortcutPath" -ForegroundColor Green
Write-Host "The application will now automatically start in the background when you log in or restart." -ForegroundColor Yellow
Write-Host "To remove it, just delete the shortcut from your Startup folder." -ForegroundColor Gray
