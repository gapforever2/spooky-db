param (
    # [string]$target = "d:\code\personal\unitdb\app",
    # [string]$faUnitFile = "d:\games\steam\SteamApps\common\Supreme Commander Forged Alliance\gamedata\units.scd",
    # [string]$fafFile = "c:\ProgramData\FAForever\gamedata\faforever.faf",
    # [string]$fafUnitsFile = "c:\ProgramData\FAForever\gamedata\units.nx2",
    # [string]$fafLuaFile = "c:\ProgramData\FAForever\gamedata\lua.nx2"

    [string]$target = "",
    [string]$inputUnits = "",
    [string]$inputLua = ""
)

$ErrorActionPreference = 'Stop'

Write-Output "target: $target"
Write-Output "inputUnits: $inputUnits"
Write-Output "inputLua: $inputLua"

$env:Path -split ';'

Function Create-UnitIndex {
    param (
        [string]$unitDir,
        [string]$luaVersionFile
    )

    $version = lua getVersion.lua "$luaVersionFile"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to read game version from $luaVersionFile"
    }

    Write-Output '{'
    Write-Output "`"version`": `"$version`","

    $blueprints = @(Get-ChildItem "$unitDir\**\*_unit.bp")
    if ($blueprints.Count -eq 0) {
        throw "No unit blueprints found in $unitDir"
    }
    $count = 1
    $total = $blueprints.Count
    $exported = 0

    Write-Output '"units": '
    Write-Output '['
    $blueprints | Foreach-Object {
        $file = $_.BaseName
        Write-Progress -Activity "Parsing $file" -Status "($count/$total)"

        $unitJson = lua blueprint2json.lua $_.FullName
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to export blueprint $($_.FullName)"
        }
        if ($unitJson) {
            if ($exported -gt 0) {
                Write-Output ','
            }
            Write-Output $unitJson
            $exported++
        }

        $count++
    }
    if ($exported -eq 0) {
        throw "No static unit blueprints exported from $unitDir"
    }
    Write-Output ']'

    Write-Output '}'
}

Function Create-Version {
    param (
        [string]$luaVersionFile
    )

    $version = lua getVersion.lua "$luaVersionFile"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to read game version from $luaVersionFile"
    }

    Write-Output "{ `"version`": `"$version`" }"
}

Function Run {
    param (
        [string]$target
    )

    Write-Progress -Activity "Creating unit index"
    $jsonVersion = Create-Version "$inputLua/version.lua"
    $jsonData = Create-UnitIndex "$inputUnits" "$inputLua/version.lua"

    Set-Content -Path "$target\data\version.json" -Value $jsonVersion
    Set-Content -Path "$target\data\index.json" -Value $jsonData

    Write-Progress -Activity "Cleaning"
    python cleaner.py $target
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to clean generated unit data"
    }
}

Run $target
