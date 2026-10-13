# BLOOD TESTAMENT · Hunt: Showdown 1896

**Inoffizieller, deutschsprachiger Fan-Guide** zu Chapter 1 & 2 des Blood-Testament-Events 2026. Keine Verbindung zu Crytek oder Twitch.

## Features

- **Blutmond-Design** in Schwarz, tiefem Rot und verwaschenem Gold, mit eigens generierter Hero-Illustration und mehreren selbst gezeichneten SVG-Grafiken.
- **Deutsche Live-Uhr (Europe/Berlin)** samt automatischer Sommer-/Winterzeit und grünem **HEUTE**-Indikator auf dem jeweiligen Release-Datum.
- **Chronologische Timeline** vom 8. September bis 9. November, Filter, Navigation zum aktuellen Datum und aufklappbare Detailinfos.
- **Erklärungen** zu den Ereignissen, Gegnern, betroffenen Kartenorten und dem Unterschied zwischen festen Release-Daten und Community-Freischaltungen.
- **Fünf Community-Stufen** mit Belohnungen und Punktegrenzen, mit klarer Abgrenzung zwischen offiziellen Crytek-Daten und Community-Spiel-Daten.
- **Twitch-Kalender-Countdown**, der ausdrücklich *keine nicht bestätigte Release-Uhrzeit* behauptet.
- **Ohne Datenbank, Build-Schritt, API-Schlüssel oder Benutzer-Tracking**: HTML + CSS + JS + statische Assets.

## Lokal ausprobieren

```bash
python3 -m http.server 8085
# Browser: http://localhost:8085
```

Alternativ als Container:

```bash
cp .env.example .env
# Optional HUNT_WEB_PORT ändern

docker compose up -d --build
# Browser auf dem Docker-Host: http://127.0.0.1:8085
```

## Dokploy (Docker Compose)

1. In Dokploy ein **Compose-Projekt** aus dem GitHub-Repository `TheEnderHacker/hunt-update-web` erstellen, Branch `main`, Compose-Pfad `compose.yaml`.
2. **Deploy / Build** ausführen. Der Compose-Service heißt **`web`**, der **interne Container-Port ist `8080`**.
3. In Dokploy unter **Domains** die gewünschte Domain dem Service `web` und **Port `8080`** zuordnen. HTTPS über die in Dokploy gewählte Domain-Konfiguration bereitstellen.
4. Optional: GitHub-Auto-Deploy/Webhook in Dokploy aktivieren. Bei jedem neuen Commit kann dann ein Rebuild gestartet werden.
5. Der lokale Port `127.0.0.1:8085` ist nur für direkten Host-Zugriff. Die Domain-Routing-Funktion von Dokploy verwendet das interne Service-Netz. Falls dein Setup Bindings anders benötigt, passe `HUNT_WEB_BIND` an.

Wichtig: **Nicht** den externen Port `8085` als internen Zielport für die Dokploy-Domain verwenden. Der Dienst lauscht innerhalb des Containers auf `8080`.

### Dateien

| Pfad | Zweck |
|---|---|
| `index.html` | barrierearme Seiteninhalte, Release-Fakten und Quellen |
| `styles.css` | responsive Blood-Moon-Optik |
| `app.js` | Zeit/Datum, Countdown, Filter, Mobile-Menü |
| `assets/hero.webp` | eigens generiertes Hintergrundmotiv |
| `assets/*.svg` | eigens erstellte Symbol-Illustrationen |
| `Dockerfile`, `compose.yaml`, `nginx.conf` | Nginx-Container für Dokploy |
| `SOURCES.md` | Datengrundlagen / Einschränkungen |
| `PROJECT_STATUS.md` | Projektstand und Übergabe |

## Inhalt aktuell halten

Die Release-Termine und Detailtexte stehen absichtlich **lesbar direkt in `index.html`**. Ändere die Einträge dort, committe und deploye neu. Das Skript liest das Datum jedes Timeline-Elements aus `data-date="YYYY-MM-DD"`.

**Keine vorgetäuschte Live-Datenverbindung:** Es gibt derzeit keine verlässliche angebundene API für weltweite Community-Punkte oder individuelle Twitch-Drops. Die Datumsanzeige ist live, das tatsächliche Community-Unlock-Level nicht. Es werden keine unbestätigten Zeiten in deutsche Stunden umgerechnet.

### Bild- und Markennutzung

Das große Motiv ist eigens für diese Fan-Seite generiert; alle SVGs sind selbst erstellte **symbolische** Illustrationen, keine Screenshots, offiziellen Kartenbilder oder exakten Gegner-/Item-Modelle. Produkt- und Itemnamen dienen ausschließlich der Berichterstattung über das Spiel. Alle Spielnamen und Marken gehören Crytek und ihren Rechteinhabern.
