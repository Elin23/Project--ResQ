param(
    [switch]$Full,
    [switch]$Build,
    [switch]$Install
)

$ErrorActionPreference = "Continue"

# Build symbols at runtime so the script file itself stays ASCII-safe.
$PassMark = [char]0x2705
$FailMark = [char]0x274C

function Write-Title([string]$Text) {
    Write-Host ""
    Write-Host ("=" * 72) -ForegroundColor DarkCyan
    Write-Host $Text -ForegroundColor Cyan
    Write-Host ("=" * 72) -ForegroundColor DarkCyan
}

function Find-ProjectRoot {
    $current = (Get-Location).Path
    while ($true) {
        if (Test-Path (Join-Path $current "package.json")) {
            return $current
        }

        $parent = Split-Path $current -Parent
        if ([string]::IsNullOrWhiteSpace($parent) -or $parent -eq $current) {
            return $null
        }

        $current = $parent
    }
}

$ProjectRoot = Find-ProjectRoot
if (-not $ProjectRoot) {
    Write-Host "$FailMark package.json was not found." -ForegroundColor Red
    Write-Host "Run this script from the project directory or one of its subdirectories." -ForegroundColor Yellow
    exit 2
}

Set-Location $ProjectRoot
Write-Title "ResQ test runner"
Write-Host "Project : $ProjectRoot"
Write-Host ("Mode    : " + $(if ($Full) { "FULL" } else { "BASIC" }))

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "$FailMark Node.js is not available in PATH." -ForegroundColor Red
    exit 2
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "$FailMark npm is not available in PATH." -ForegroundColor Red
    exit 2
}

Write-Host "Node    : $(node --version)"
Write-Host "npm     : $(npm --version)"

if ($Install -or -not (Test-Path "node_modules")) {
    Write-Title "Installing dependencies"

    if (Test-Path "package-lock.json") {
        Write-Host "> npm ci" -ForegroundColor DarkGray
        & npm.cmd ci
    }
    else {
        Write-Host "> npm install" -ForegroundColor DarkGray
        & npm.cmd install
    }

    if ($LASTEXITCODE -ne 0) {
        Write-Host "$FailMark Dependency installation FAILED." -ForegroundColor Red
        exit $LASTEXITCODE
    }

    Write-Host "$PassMark Dependencies installed successfully." -ForegroundColor Green
}

$package = Get-Content "package.json" -Raw | ConvertFrom-Json
$results = New-Object System.Collections.Generic.List[object]

function Test-ScriptExists([string]$ScriptName) {
    return ($null -ne $package.scripts.PSObject.Properties[$ScriptName])
}

function Run-NpmScript([string]$ScriptName, [string]$Description) {
    if (-not (Test-ScriptExists $ScriptName)) {
        $script:results.Add([PSCustomObject]@{
            Script      = $ScriptName
            Description = $Description
            Status      = "SKIPPED"
            Passed      = $true
            ExitCode    = 0
            Seconds     = 0
        })
        Write-Host "[SKIP] npm script '$ScriptName' does not exist." -ForegroundColor Yellow
        return
    }

    Write-Title "TEST: $Description"
    Write-Host "> npm run $ScriptName" -ForegroundColor DarkGray

    $started = Get-Date
    & npm.cmd run $ScriptName
    $code = $LASTEXITCODE
    $elapsed = (Get-Date) - $started
    $ok = ($code -eq 0)

    $script:results.Add([PSCustomObject]@{
        Script      = $ScriptName
        Description = $Description
        Status      = $(if ($ok) { "PASSED" } else { "FAILED" })
        Passed      = $ok
        ExitCode    = $code
        Seconds     = [math]::Round($elapsed.TotalSeconds, 1)
    })

    if ($ok) {
        Write-Host "$PassMark PASSED - $Description" -ForegroundColor Green
    }
    else {
        Write-Host "$FailMark FAILED - $Description (exit code: $code)" -ForegroundColor Red
    }
}

# Core checks.
Run-NpmScript "typecheck" "TypeScript type checking"
Run-NpmScript "lint"      "ESLint code-quality checks"
Run-NpmScript "test"      "Automated test suite"

# Run all project-specific check:* scripts when -Full is supplied.
if ($Full) {
    Write-Title "Project-specific check:* scripts"

    $checkScripts = @(
        $package.scripts.PSObject.Properties |
        Where-Object {
            $_.Name -like "check:*" -and $_.Name -ne "check"
        } |
        Select-Object -ExpandProperty Name |
        Sort-Object
    )

    if ($checkScripts.Count -eq 0) {
        Write-Host "[SKIP] No check:* scripts were found in package.json." -ForegroundColor Yellow
    }
    else {
        foreach ($scriptName in $checkScripts) {
            Run-NpmScript $scriptName "Project check: $scriptName"
        }
    }
}

if ($Build) {
    Run-NpmScript "build" "Production/build compilation"
}

Write-Title "FINAL RESULT"

$passed = @($results | Where-Object { $_.Status -eq "PASSED" })
$failed = @($results | Where-Object { $_.Status -eq "FAILED" })
$skipped = @($results | Where-Object { $_.Status -eq "SKIPPED" })

foreach ($r in $results) {
    if ($r.Status -eq "PASSED") {
        Write-Host ("{0} PASSED  {1}  [{2}s]" -f $PassMark, $r.Description, $r.Seconds) -ForegroundColor Green
    }
    elseif ($r.Status -eq "FAILED") {
        Write-Host ("{0} FAILED  {1}  [{2}s]" -f $FailMark, $r.Description, $r.Seconds) -ForegroundColor Red
    }
    else {
        Write-Host ("- SKIPPED {0}" -f $r.Description) -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host ("PASSED : {0}" -f $passed.Count) -ForegroundColor Green
Write-Host ("FAILED : {0}" -f $failed.Count) -ForegroundColor $(if ($failed.Count -eq 0) { "Green" } else { "Red" })
Write-Host ("SKIPPED: {0}" -f $skipped.Count) -ForegroundColor Yellow
Write-Host ("TOTAL   : {0}" -f $results.Count) -ForegroundColor Cyan

if ($failed.Count -eq 0) {
    Write-Host ""
    Write-Host "$PassMark ALL EXECUTED TESTS PASSED." -ForegroundColor Green
    exit 0
}

Write-Host ""
Write-Host "$FailMark SOME TESTS FAILED." -ForegroundColor Red
Write-Host "Failed checks:" -ForegroundColor Red
foreach ($r in $failed) {
    Write-Host ("  {0} {1}  (npm run {2})" -f $FailMark, $r.Description, $r.Script) -ForegroundColor Red
}

exit 1
