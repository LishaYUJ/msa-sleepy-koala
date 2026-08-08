FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY backend/SleepyKoala.Api.csproj backend/
RUN dotnet restore backend/SleepyKoala.Api.csproj

COPY backend/ backend/
RUN dotnet publish backend/SleepyKoala.Api.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

RUN apt-get update \
    && apt-get install --yes --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/data \
    && chown -R app:app /app

COPY --from=build --chown=app:app /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

USER app

HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --retries=5 \
  CMD curl --fail --silent http://127.0.0.1:8080/health > /dev/null || exit 1

ENTRYPOINT ["dotnet", "SleepyKoala.Api.dll"]
