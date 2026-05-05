## Frontend

## Backend

Das Backend ist der serverseitige Teil des Online-Shops. Es verarbeitet Anfragen vom Frontend, stellt API-Endpunkte bereit, liest und schreibt Daten in der Datenbank und liefert die statischen Dateien der Webseite aus. Der Einstiegspunkt des Backends ist `src/app.js`.

- **Node.js**: Das Projekt verwendet Node.js, um JavaScript ausserhalb des Browsers auszufuehren. Dadurch kann der Server direkt mit Dateien, Umgebungsvariablen und der SQLite-Datenbank arbeiten. Gestartet wird das Backend mit `npm start`, wodurch `node src/app.js` ausgefuehrt wird. Fuer die Entwicklung gibt es ausserdem `npm run dev`, das den Server mit `nodemon` startet und bei Codeaenderungen automatisch neu laedt.

- **Express.js**: Express wird als Webserver und Routing-Framework verwendet. In `src/app.js` werden Middleware-Funktionen registriert, damit JSON-Daten und URL-codierte Formulardaten aus Requests gelesen werden koennen. Ausserdem liefert Express die Dateien aus dem `public`-Ordner aus, zum Beispiel HTML-Seiten, CSS-Dateien, JavaScript-Dateien und Bilder. Die Startseite des Shops wird ueber die Route `/` geladen und verweist auf `public/pages/shop.html`.

- **API-Struktur**: Die API-Routen sind in eigene Dateien ausgelagert. `src/routes/products.js` enthaelt die Produkt-Endpunkte und `src/routes/customers.js` enthaelt die Kunden-Endpunkte. Beide Router werden in `src/app.js` unter dem gemeinsamen Pfad `/api` registriert. Dadurch entstehen zum Beispiel folgende Endpunkte:
  - `GET /api/products`: gibt alle Produkte als JSON zurueck.
  - `GET /api/products/:id`: gibt ein einzelnes Produkt anhand seiner ID zurueck.
  - `POST /api/customers`: speichert einen neuen Kunden in der Datenbank.
  - `GET /api/customers`: gibt alle Kunden zurueck.
  - `GET /api/customers/:id`: gibt einen einzelnen Kunden anhand seiner ID zurueck.

- **Model-Schicht**: Die Datenbankzugriffe sind in Models gekapselt. `src/models/Product.js` enthaelt Methoden zum Abrufen aller Produkte und einzelner Produkte. `src/models/Customer.js` enthaelt Methoden zum Erstellen und Abrufen von Kunden sowie zum Pruefen, ob eine E-Mail-Adresse bereits existiert. Dadurch sind Routing-Logik und Datenbanklogik voneinander getrennt.

- **SQLite-Anbindung**: Die Verbindung zur Datenbank wird in `src/models/db.js` aufgebaut. Das Backend verwendet das Paket `sqlite3` und verbindet sich standardmaessig mit `database/shop.db`. Der Pfad kann ueber die Umgebungsvariable `DB_FILE` in der `.env`-Datei geaendert werden. Beim Start prueft das Backend, ob die Produkttabelle bereits existiert und ob Produktdaten vorhanden sind. Falls nicht, wird `database/shop.sql` ausgefuehrt, um die Datenbank mit Tabellen und Beispieldaten zu initialisieren.

- **Fehlerbehandlung und Validierung**: Die Routen geben passende HTTP-Statuscodes zurueck. Wenn ein Produkt oder Kunde nicht gefunden wird, antwortet das Backend mit `404`. Bei Datenbankfehlern wird `500` zurueckgegeben. Beim Erstellen eines Kunden werden Name und E-Mail-Adresse als Pflichtfelder geprueft. Ausserdem kontrolliert das Backend, ob die E-Mail-Adresse bereits gespeichert ist, damit keine doppelten Kundeneintraege entstehen.

Der Server laeuft nach dem Start unter `http://localhost:3000`. Das Frontend kommuniziert ueber `fetch` mit den API-Endpunkten und erhaelt die Daten im JSON-Format.

### Backend-Dateiuebersicht

- **`src/app.js`**: Hauptdatei des Servers. Erstellt die Express-App, aktiviert JSON- und Formulardatenverarbeitung, bindet die API-Routen ein, liefert statische Frontend-Dateien aus und startet den Server auf Port `3000`.

- **`src/routes/products.js`**: Enthaelt die Produkt-API. Die Datei stellt Endpunkte bereit, um alle Produkte oder ein einzelnes Produkt per ID abzurufen.

- **`src/routes/customers.js`**: Enthaelt die Kunden-API. Die Datei erlaubt das Erstellen eines Kunden sowie das Abrufen aller Kunden oder eines einzelnen Kunden per ID.

- **`src/models/db.js`**: Stellt die Verbindung zur SQLite-Datenbank her und initialisiert sie mit `shop.sql`, wenn Tabellen oder Produktdaten fehlen.

- **`src/models/Product.js`**: Enthaelt Datenbankfunktionen fuer Produkte, zum Beispiel das Laden aller Produkte oder eines Produkts per ID.

- **`src/models/Customer.js`**: Enthaelt Datenbankfunktionen fuer Kunden, zum Beispiel Kunden erstellen, Kunden laden und pruefen, ob eine E-Mail-Adresse bereits existiert.

- **`database/shop.sql`**: Definiert die Datenbankstruktur und fuegt Beispieldaten fuer Produkte, Kunden, Bestellungen und Bestellpositionen ein.

- **`database/shop.db`**: SQLite-Datenbankdatei, in der die Anwendungsdaten gespeichert werden.

## Database
