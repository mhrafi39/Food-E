# FoodE Backend - Project Verification Script
# This script checks if everything is set up correctly

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " FoodE Backend - Project Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check .NET SDK
Write-Host "Checking .NET SDK..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    Write-Host "✓ .NET SDK version: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ .NET SDK not found" -ForegroundColor Red
    $allGood = $false
}
Write-Host ""

# Check if project builds
Write-Host "Checking if project builds..." -ForegroundColor Yellow
try {
    $buildResult = dotnet build --no-restore 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Project builds successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Build failed" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "✗ Build error: $_" -ForegroundColor Red
    $allGood = $false
}
Write-Host ""

# Check database connection
Write-Host "Checking database connection..." -ForegroundColor Yellow
try {
    $efCheck = dotnet ef migrations list 2>&1
    if ($efCheck -match "InitialCreate" -or $efCheck -match "AddFoodItemsAndOrders") {
        Write-Host "✓ Database connection OK" -ForegroundColor Green
        Write-Host "Migrations found:" -ForegroundColor Cyan
        dotnet ef migrations list 2>&1 | Select-String -Pattern "^\d{14}" | ForEach-Object {
            Write-Host "  - $_" -ForegroundColor White
        }
    } else {
        Write-Host "⚠ No migrations found. Run 'dotnet ef database update'" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Database check failed: $_" -ForegroundColor Red
    $allGood = $false
}
Write-Host ""

# Check required files
Write-Host "Checking required files..." -ForegroundColor Yellow
$requiredFiles = @(
    "Program.cs",
    "appsettings.json",
    "Data\AppDbContext.cs",
    "Model\Order.cs",
    "Model\FoodItem.cs",
    "Model\User.cs",
    "Controllers\OrdersController.cs",
    "Controllers\AdminController.cs",
    "ClientApp\package.json"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file (missing)" -ForegroundColor Red
        $missingFiles += $file
        $allGood = $false
    }
}
Write-Host ""

# Check ClientApp dependencies
Write-Host "Checking ClientApp dependencies..." -ForegroundColor Yellow
if (Test-Path "ClientApp\node_modules") {
    Write-Host "✓ Node modules installed" -ForegroundColor Green
} else {
    Write-Host "⚠ Node modules not installed. Run 'npm install' in ClientApp folder" -ForegroundColor Yellow
}
Write-Host ""

# Check for common issues
Write-Host "Checking for common issues..." -ForegroundColor Yellow
$warnings = @()

# Check AppDbContext for decimal precision
$appDbContext = Get-Content "Data\AppDbContext.cs" -Raw
if ($appDbContext -match "HasPrecision") {
    Write-Host "✓ Decimal precision configured" -ForegroundColor Green
} else {
    Write-Host "⚠ Decimal precision not configured (may cause warnings)" -ForegroundColor Yellow
    $warnings += "Decimal precision"
}

# Check if Notes and PaymentMethod are in Order model
$orderModel = Get-Content "Model\Order.cs" -Raw
if ($orderModel -match "Notes" -and $orderModel -match "PaymentMethod") {
    Write-Host "✓ Order model has Notes and PaymentMethod" -ForegroundColor Green
} else {
    Write-Host "⚠ Order model missing Notes or PaymentMethod" -ForegroundColor Yellow
    $warnings += "Order model fields"
}

Write-Host ""

# Final summary
Write-Host "========================================" -ForegroundColor Cyan
if ($allGood -and $warnings.Count -eq 0) {
    Write-Host " ✓ ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Your project is ready to run!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To start the application:" -ForegroundColor Cyan
    Write-Host "  Backend:  dotnet run" -ForegroundColor White
    Write-Host "  Frontend: cd ClientApp && npm start" -ForegroundColor White
} elseif ($warnings.Count -gt 0 -and $allGood) {
    Write-Host " ✓ CHECKS PASSED WITH WARNINGS" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Warnings:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  - $warning" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "These warnings won't prevent the application from running." -ForegroundColor Gray
} else {
    Write-Host " ✗ SOME CHECKS FAILED" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please fix the errors above before running the application." -ForegroundColor Red
}
Write-Host ""
