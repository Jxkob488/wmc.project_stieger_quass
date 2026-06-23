# WMC Online Shop & Shop System Guide

Willkommen zu diesem Projekt! Hier findest du eine kurze Website, die erklärt, wie man das passende Shop-System auswählt, und gleichzeitig eine einfache Online-Shop-Demo, die zeigt, wie so ein System in der Praxis funktionieren kann.

## Was ist drin?

- `docs/`: Die Beratungswebsite mit einer Schritt-für-Schritt-Anleitung.
- `public/`: Öffentliche Website-Inhalte, die du direkt testen oder hosten kannst.
- `src/`: Das Backend des Online-Shops (Node.js/Express).
- `database/`: SQL-Datei und ER-Diagramm für die Datenbank.

## Was kann das Projekt?

- Ein Guide, der hilft, das richtige Shop-System zu wählen
- Ein Faktenbereich zu Hosting, Kosten, Internationalisierung, Performance und Zahlungen
- Ein einfacher Online-Shop mit Produktübersicht, Warenkorb und Checkout
- Ein Backend mit REST-API, Express und SQLite

## Installation

1. Öffne den Projektordner in der Konsole.
2. Installiere die Abhängigkeiten:

```bash
npm install
```

3. Starte den Entwicklungsserver:

```bash
npm run dev
```

4. Starte das Projekt im normalen Modus:

```bash
npm start
```

## So funktioniert das Backend

- Einstiegspunkt: `src/app.js`
- Routen:
  - `src/routes/products.js`
  - `src/routes/customers.js`
  - `src/routes/checkout.js`
- Datenbank: `src/models/db.js`
- Modelle: `src/models/Product.js`, `src/models/Customer.js`

## Technik und Tools

- Node.js mit Express
- SQLite (`sqlite3`)
- Umgebungsvariablen mit `dotenv`
- E-Mail-Versand mit `nodemailer`
- Automatischer Neustart in der Entwicklung mit `nodemon`

## So kannst du es nutzen

- Öffne die Website im Browser und schaue dir den Leitfaden an.
- Teste die Demo im `public/`-Ordner.
- Rufe das Backend lokal auf und probiere die API aus.

## Ziel des Projekts

Das Projekt soll zeigen, wie man eine verständliche Entscheidungshilfe für Shop-Systeme mit einer realen Shop-Anwendung kombiniert. Es richtet sich an alle, die eine einfache und praxisnahe Lösung suchen.
