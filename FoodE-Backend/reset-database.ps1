# FoodE Backend - Database Reset Script
# This script will drop the database, remove all migrations, and recreate everything fresh

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " FoodE Backend - Database Reset Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Drop existing database
Write-Host "Step 1: Dropping existing database..." -ForegroundColor Yellow
try {
    dotnet ef database drop -f
    Write-Host "✓ Database dropped successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Error dropping database: $_" -ForegroundColor Red
    Write-Host "This is OK if database doesn't exist" -ForegroundColor Gray
}
Write-Host ""

# Step 2: Remove all existing migrations
Write-Host "Step 2: Cleaning up migration files..." -ForegroundColor Yellow
$migrationsFolder = ".\Migrations"
if (Test-Path $migrationsFolder) {
    try {
        Remove-Item "$migrationsFolder\*" -Recurse -Force
        Write-Host "✓ Migration files removed" -ForegroundColor Green
    } catch {
        Write-Host "✗ Error removing migrations: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ No migrations folder found" -ForegroundColor Green
}
Write-Host ""

# Step 3: Create fresh initial migration
Write-Host "Step 3: Creating fresh initial migration..." -ForegroundColor Yellow
try {
    dotnet ef migrations add InitialCreate
    Write-Host "✓ Initial migration created" -ForegroundColor Green
} catch {
    Write-Host "✗ Error creating migration: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Apply migration to create database
Write-Host "Step 4: Applying migration to create database..." -ForegroundColor Yellow
try {
    dotnet ef database update
    Write-Host "✓ Database created and migration applied" -ForegroundColor Green
} catch {
    Write-Host "✗ Error applying migration: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: Verify setup
Write-Host "Step 5: Verifying setup..." -ForegroundColor Yellow
try {
    $migrations = dotnet ef migrations list 2>&1 | Select-String "InitialCreate"
    if ($migrations) {
        Write-Host "✓ Migration verified" -ForegroundColor Green
    } else {
        Write-Host "✗ Migration verification failed" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠ Could not verify migrations" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Database Reset Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default Admin Credentials:" -ForegroundColor Cyan
Write-Host "  Email: admin@foode.com" -ForegroundColor White
Write-Host "  Password: Admin@123" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Run 'dotnet run' to start the backend" -ForegroundColor White
Write-Host "  2. Login as admin and set up raw materials" -ForegroundColor White
Write-Host "  3. Create food items with recipes" -ForegroundColor White
Write-Host "  4. Start taking orders!" -ForegroundColor White
Write-Host ""
