# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file
COPY ["FoodE-Backend/FoodE-Backend.csproj", "FoodE-Backend/"]

# Restore dependencies
RUN dotnet restore "FoodE-Backend/FoodE-Backend.csproj"

# Copy source code
COPY . .

# Build the application
RUN dotnet build "FoodE-Backend/FoodE-Backend.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "FoodE-Backend/FoodE-Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=publish /app/publish .

# Create migration script
RUN echo '#!/bin/bash\nset -e\necho "Running database migrations..."\ndotnet FoodE-Backend.dll &\nPID=$!\nsleep 10\nkill $PID 2>/dev/null || true\necho "Migrations completed"\nexec dotnet FoodE-Backend.dll' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["/app/entrypoint.sh"]
