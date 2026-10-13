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

Die Testresultate werden nach dem abschließenden lokalen Smoke-Test ergänzt.

## Offene / bewusst nicht automatisierte Punkte

- Kein globaler Punktestand / Stage-Live-API angebunden; es existiert keine zugesicherte offizielle öffentliche Datenquelle.
- Exakte Patch-, DLC- und Twitch-Uhrzeiten wurden nicht vom Entwickler/Twitch bestätigt; deshalb keine künstliche Uhrzeit.
- Wenn Crytek ein künftiges Chapter 3 mit Daten ankündigt, neue offizielle Daten ergänzen.
- Drittquellen-Angaben zu Stufe 2/4 und Punktehöhe bei Crytek / im Spiel gegenprüfen, wenn Updates eintreffen.

## Docker / Deployment

`docker compose up -d --build`; Service `web`, Port **8080 intern**, optional localhost Port 8085. Dokploy: Compose aus GitHub `main`, Domain auf `web:8080`, HTTPS via Dokploy.
