# Database Migration Script
# Run this after creating the migration to update your database

Write-Host "Starting database migration..." -ForegroundColor Cyan

# Navigate to project directory
Set-Location -Path "FoodE-Backend"

Write-Host "`nStep 1: Creating migration..." -ForegroundColor Yellow
dotnet ef migrations add AddPreparedStockAndOrderFields

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migration created successfully!" -ForegroundColor Green
    
    Write-Host "`nStep 2: Updating database..." -ForegroundColor Yellow
    dotnet ef database update
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database updated successfully!" -ForegroundColor Green
        Write-Host "`n🎉 Migration complete! You can now restart your backend." -ForegroundColor Cyan
    } else {
        Write-Host "❌ Database update failed!" -ForegroundColor Red
        Write-Host "Check the error message above for details." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Migration creation failed!" -ForegroundColor Red
    Write-Host "Check the error message above for details." -ForegroundColor Yellow
}

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
