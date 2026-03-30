# FoodE Full-Stack Deployment Guide for Render

## 🎯 What Was Done

Your project has been configured for **full-stack deployment** on Render with:
- ✅ **Backend**: .NET 10 API with PostgreSQL
- ✅ **Frontend**: React + Vite static site
- ✅ **Database**: PostgreSQL (free tier)
- ✅ **Auto-scaling**: Infrastructure ready

### Changes Made:

1. **Database Migration**: SQL Server → PostgreSQL
   - Updated `.csproj` with `Npgsql.EntityFrameworkCore.PostgreSQL`
   - Changed `Program.cs` to use `UseNpgsql()`
   - Generated fresh PostgreSQL migrations

2. **Configuration Files**:
   - `appsettings.Production.json` - Production settings
   - `.env.production` & `.env.development` - Frontend environment
   - `render.yaml` - Complete Render deployment configuration
   - `Dockerfile` - Multi-stage Docker build

3. **CORS & Security**:
   - Dynamic CORS configuration from appsettings
   - Conditional HTTPS redirection (HTTP for Render)
   - Environment-specific allowed origins

---

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

```bash
git add .
git commit -m "Configure full-stack deployment for Render"
git push origin main
```

### Step 2: Create Render Account & Project

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select your GitHub repository: `mhrafi39/Food-E`

### Step 3: Connect Services

#### Option A: Using render.yaml (Recommended)
Render will auto-detect and deploy all services from `render.yaml`:
- PostgreSQL database
- Backend API
- Frontend static site

#### Option B: Manual Setup
Deploy each service separately:

**3a. PostgreSQL Database**
- Service Type: PostgreSQL
- Name: `foode-db`
- Plan: Free
- Region: Oregon

**3b. Backend API**
- Service Type: Web Service
- Runtime: Docker
- Build Command: (auto)
- Start Command: (from Dockerfile)
- Environment Variables:
  ```
  ASPNETCORE_ENVIRONMENT=Production
  DefaultConnection=postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}
  AllowedOrigins=https://foode-frontend.onrender.com
  ```

**3c. Frontend**
- Service Type: Static Site
- Build Command: `cd FoodE-Backend/ClientApp && npm install && npm run build`
- Publish Directory: `FoodE-Backend/ClientApp/dist`
- Environment Variables:
  ```
  VITE_API_URL=https://foode-backend.onrender.com
  ```

### Step 4: Environment Variables

Render will automatically provide these for PostgreSQL:
- `PGHOST` - Database host
- `PGPORT` - Database port
- `PGDATABASE` - Database name
- `PGUSER` - Database user
- `PGPASSWORD` - Database password

### Step 5: Database Migrations

Migrations will run automatically on deploy. To manually run:
```bash
dotnet ef database update
```

---

## 📋 API Endpoints

Your API will be available at:
- **Base URL**: `https://foode-backend.onrender.com`
- **OpenAPI (Swagger)**: `https://foode-backend.onrender.com/openapi/v1.json`

Update your frontend to call:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

---

## 🔐 Security Notes

1. **Connection String**: Automatically managed by Render
2. **HTTPS**: Enabled by default
3. **CORS**: Configured for production frontend URL
4. **Default Admin**: Email: `admin@foode.com` (use your own password hash)

---

## 🐛 Troubleshooting

### Migration Fails
- Check database is running: `render.yaml` shows `foode-db` status
- Verify connection string format
- Check logs in Render Dashboard

### Frontend Can't Connect to API
- Verify backend URL in frontend `.env.production`
- Check CORS settings in `appsettings.Production.json`
- Ensure backend is fully deployed (green status)

### Docker Build Fails
- Check `.dockerignore` for excluded files
- Verify `.csproj` has all required NuGet packages
- Review build logs in Render Dashboard

---

## 🔄 Updating Your App

### Push Changes
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will automatically rebuild and redeploy!

### Update Secrets
1. Go to Render Dashboard → Service Settings
2. Update environment variables
3. Redeploy the service

---

## 📊 Monitoring

View logs in Render Dashboard:
- **Backend Logs**: Check for runtime errors
- **Database Logs**: Monitor queries and connections
- **Frontend Logs**: Browser console and build logs

---

## 💡 Next Steps

1. **Test Locally First**:
   ```bash
   dotnet run
   cd FoodE-Backend/ClientApp && npm run dev
   ```

2. **Deploy to Render** (follow steps above)

3. **Update Frontend API URL** in production:
   - `.env.production`: `https://foode-backend.onrender.com`
   - Frontend build command will use this automatically

4. **Monitor**: Check Render Dashboard for any issues

---

## ✨ Your Services

When deployed, you'll have:

| Service | URL |
|---------|-----|
| **Frontend** | `https://foode-frontend.onrender.com` |
| **Backend API** | `https://foode-backend.onrender.com` |
| **Database** | PostgreSQL (managed by Render) |

---

**Questions?** Check [Render Docs](https://render.com/docs)
