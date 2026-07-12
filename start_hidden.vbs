Set objFSO = CreateObject("Scripting.FileSystemObject")
strPath = Wscript.ScriptFullName
Set objFile = objFSO.GetFile(strPath)
strFolder = objFSO.GetParentFolderName(objFile)

Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = strFolder

' Run the powershell script silently (0 means hidden window)
WshShell.Run "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & strFolder & "\start_local.ps1""", 0
