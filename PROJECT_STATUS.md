# Projektübergabe – Hunt Update Web

**Repository:** https://github.com/TheEnderHacker/hunt-update-web · Branch `main`  
**Zeitpunkt der inhaltlichen Prüfung:** 13.10.2026 (MESZ).

## Umsetzung

- Website komplett neu konzipiert (kein grün geprägtes Theme; dunkler Blutmond-Look mit gold/rot; Grün nur für die HEUTE-Markierung).
- Responsive Landing-Page mit eigenem Artwork, zwei Chapters, Datumsleiste, Release-Karten (08.09., 05.10., 06.10., 07.10., 13.10., 26.10., 09.11.) und Details.
- Timeline-Filter, deutscher Live-Timer, HEUTE-Sync, Anker zum nächsten aktuellen Release.
- Eigens erstellte Illustrationen für Inferno, Blood Moon, zwei Gegnertypen und Tarotkarten.
- Kapitel-1- und Kapitel-2-Erklärungen; offizieller vs. Community-Quellenstatus; 5 Event-Freischaltstufen mit Punktegrenzen.
- Twitch-Zeitraum und ausdrücklich **nicht** als echte Release-Uhrzeit ausgegebene Kalender-Countdown.
- Docker Compose, nichtprivilegierter Nginx auf internem Port 8080, Healthcheck, Dokploy-Anleitung.

## Technische Tests

- `node --check app.js` erfolgreich (JavaScript-Syntax).
- YAML über `PyYAML` erfolgreich geparst; Docker/Compose selbst ist in dieser Umgebung nicht installiert, ein echter Containerstart wurde **nicht** durchgeführt.
- HTML auf Struktur und referenzierte lokale Bilddateien geprüft (1× H1, 7 Kalendereinträge, 6 Quellenlinks, keine fehlenden lokalen Assets).
- GitHub-Branch und Dateiliste nach Push erfolgreich abgefragt.
- Visuelles Browser-Rendering war in der isolierten Prüfungsumgebung nicht zuverlässig möglich; daher kein behaupteter Screenshot- oder Crossbrowser-Test.

## Offene / bewusst nicht automatisierte Punkte

- Kein globaler Punktestand / Stage-Live-API angebunden; es existiert keine zugesicherte offizielle öffentliche Datenquelle.
- Exakte Patch-, DLC- und Twitch-Uhrzeiten wurden nicht vom Entwickler/Twitch bestätigt; deshalb keine künstliche Uhrzeit.
- Wenn Crytek ein künftiges Chapter 3 mit Daten ankündigt, neue offizielle Daten ergänzen.
- Drittquellen-Angaben zu Stufe 2/4 und Punktehöhe bei Crytek / im Spiel gegenprüfen, wenn Updates eintreffen.

## Docker / Deployment

`docker compose up -d --build`; Service `web`, Port **8080 intern**, lokaler Zugriff optional mit `-f compose.yaml -f compose.local.yaml`. Dokploy: `./docker-compose.yml` aus GitHub `main` (Standard), Domain auf `web:8080`, HTTPS via Dokploy.

## Verbesserte Übersicht (13. Oktober 2026)

- Gut sichtbarer Hero-Button **„Was ist schon da?“** und zweiter Button **„Wann kommen Waffen & Karten?“**.
- Neue automatisierte Statusliste der bereits verstrichenen offiziellen Release-Tage (Deutschland `Europe/Berlin`) und der nächsten Termine. Keine Live-Datenabfrage behauptet.
- Neue Karten für Burgess, Flame Rifle, The Atlas (Stufe 1), The Temperance (Stufe 3) und Long Derringer (Stufe 5) unmittelbar vor der langen Timeline.
- Separat gekennzeichneter **HEUTE**-Status und Warnung: Start 13. Oktober ist nicht automatisch eine globale Freischaltung.
- Mobile Ansicht auf eine Spalte reduziert, kompakterer Hero für schnellen Einstieg.
- Alle 3 Community-Items stehen bis zur tatsächlichen Bestätigung bewusst als „nicht live bestätigt“ statt als freigeschaltet.

### Verifikation

- HTML-ID-Eindeutigkeit und interne Links geprüft.
- `node --check app.js` bestanden.
- Browser-Rendering konnte in der isolierten Umgebung nicht zuverlässig durchgeführt werden (lokale Navigation wird durch Browser-Richtlinie blockiert).
