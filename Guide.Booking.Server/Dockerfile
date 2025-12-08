# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["Guide.Booking.Server/Guide.Booking.Server.csproj", "Guide.Booking.Server/"]
RUN dotnet restore "Guide.Booking.Server/Guide.Booking.Server.csproj"

# Copy everything else and build
COPY Guide.Booking.Server/ Guide.Booking.Server/
WORKDIR "/src/Guide.Booking.Server"
RUN dotnet build "Guide.Booking.Server.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Guide.Booking.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Guide.Booking.Server.dll"]
