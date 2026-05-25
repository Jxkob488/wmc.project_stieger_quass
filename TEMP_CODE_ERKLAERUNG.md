# Temporaere Code-Erklaerung fuer das Projekt

Diese Datei beschreibt das Projekt in zwei Ebenen:

1. Ganz oben einen schnellen Überblick: Was macht dieses Projekt? Welche Teile gibt es?
2. Danach detailliertere Erklärungen zu den wichtigsten Dateien, Methoden, APIs und neuen Erweiterungen.

Sie ist als Orientierungshilfe gedacht, um den Code schneller zu verstehen und neue Dateien einzuordnen.

## 1. Kurzueberblick

Das Projekt besteht aus zwei Hauptteilen:

- Einem **Online-Shop** mit Backend, Datenbank, Produktanzeige, Warenkorb und Checkout-Formular.
- Einem **Shop-System-Guide** mit statischen HTML-Seiten, der erklaert, wie man ein passendes Shopsystem auswaehlt.

Der Shop laeuft ueber einen Node.js/Express-Server. Die Produkte und Kundendaten werden in einer SQLite-Datenbank gespeichert. Das Frontend liegt im Ordner `public` und kommuniziert per `fetch` mit der API im Backend.

Zusätzlich gibt es eine eigene Checkout-Seite `public/pages/checkout.html`, die im Browser den Warenkorb an den Server sendet und dort eine E-Mail-Bestätigung vorbereitet und versendet.

Wichtigster Startpunkt:

- `src/app.js`: startet den Server.
- `public/pages/shop.html`: ist die Hauptseite des Shops.
- `public/js/shop.js`: steuert Produktanzeige, Warenkorb und Checkout.
- `database/shop.sql`: definiert Tabellen und Beispieldaten.
- `database/shop.db`: echte SQLite-Datenbankdatei.

## 2. Projektstruktur

```text
.
|-- .env
|-- package.json
|-- project-description.md
|-- technologies.md
|-- database/
|   |-- shop.sql
|   |-- shop.db
|   |-- er-diagram.puml
|-- src/
|   |-- app.js
|   |-- models/
|   |   |-- db.js
|   |   |-- Product.js
|   |   |-- Customer.js
|   |-- routes/
|       |-- products.js
|       |-- customers.js
|-- public/
|   |-- css/
|   |   |-- online-shop.css
|   |   |-- style.css
|   |-- js/
|   |   |-- checkout.js
|   |   |-- products.js
|   |   |-- shop.js
|   |   |-- progress.js
|   |-- images/
|   |-- pages/
|       |-- shop.html
|       |-- checkout.html
|       |-- guide/
|       |-- basic-informations/
```

## 3. Installation und Start

Die verwendeten Pakete stehen in `package.json`.

Wichtige Befehle:

```bash
npm start
npm run dev
```

`npm start` fuehrt `node src/app.js` aus. `npm run dev` startet denselben Server mit `nodemon`, damit er bei Aenderungen automatisch neu startet.

Der Server ist danach unter dieser Adresse erreichbar:

```text
http://localhost:3000
```

## 4. package.json

Datei: `package.json`

Diese Datei beschreibt das Node-Projekt.

Wichtige Eintraege:

- `main: "src/app.js"` sagt, dass `src/app.js` die Hauptdatei ist.
- `scripts.start` startet den Server normal.
- `scripts.dev` startet den Server im Entwicklungsmodus mit `nodemon`.
- `dependencies` enthaelt die benoetigten Pakete:
  - `express`: Webserver und Routing.
  - `sqlite3`: Zugriff auf SQLite-Datenbank.
  - `dotenv`: liest `.env`-Dateien.
  - `nodemailer`: Paket fuer E-Mail-Versand, wird im Checkout-Backend eingesetzt.
- `devDependencies.nodemon`: Entwicklungstool fuer automatischen Server-Neustart.

## 5. Umgebungsvariablen

Datei: `.env`

```text
DB_FILE=./database/shop.db
PORT=3000
```

`DB_FILE` gibt an, welche SQLite-Datei verwendet werden soll. In `src/models/db.js` wird dieser Wert gelesen. `PORT` ist zwar in `.env` vorhanden, aber `src/app.js` verwendet aktuell fest `3000` und liest `PORT` nicht aus.

Optional koennen weitere Umgebungsvariablen fuer E-Mail-Versand gesetzt werden, wenn `src/routes/checkout.js` echten SMTP-Versand nutzen soll:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `FROM_EMAIL`

Wenn keine SMTP-Daten gesetzt sind, faellt das Projekt auf einen Ethereal-Testaccount zurück.

Wenn du den Port wirklich aus `.env` nutzen willst, muesste in `src/app.js` statt `app.listen(3000, ...)` ungefaehr `app.listen(process.env.PORT || 3000, ...)` stehen.

## 6. Backend-Einstieg

Datei: `src/app.js`

Diese Datei erstellt die Express-App und startet den Server.

Wichtige Schritte:

1. `express` und `path` werden importiert.
2. `const app = express();` erstellt die Server-App.
3. `app.use(express.json());` erlaubt JSON-Requests.
4. `app.use(express.urlencoded({ extended: true }));` erlaubt HTML-Formulardaten.
5. Produkt-, Kunden- und Checkout-Routen werden importiert:
   - `./routes/products`
   - `./routes/customers`
   - `./routes/checkout`
6. Alle drei Router werden unter `/api` registriert:
   - aus `/products` wird `/api/products`
   - aus `/customers` wird `/api/customers`
   - aus `/checkout` wird `/api/checkout`
7. Die Route `/` liefert `public/pages/shop.html`.
8. `express.static(...)` macht statische Dateien erreichbar, also CSS, JS, Bilder und HTML.
9. `app.listen(3000, ...)` startet den Server.

Wichtig: Die zweite statische Zeile `app.use(express.static(path.join(__dirname, "../pages")));` zeigt auf einen Ordner `pages` ausserhalb von `public`. Dieser Ordner existiert im Projekt aktuell nicht. Der wichtige statische Ordner ist `../public`.

## 7. API-Routen fuer Produkte

Datei: `src/routes/products.js`

Diese Datei definiert alle Produkt-Endpunkte.

### GET /api/products

Code-Stelle:

```js
router.get('/products', (req, res) => {
  Product.getAll((err, products) => {
    ...
  });
});
```

Aufgabe:

- Holt alle Produkte aus der Datenbank.
- Gibt sie als JSON zurueck.
- Bei einem Datenbankfehler wird HTTP 500 gesendet.

Wird vom Frontend in `public/js/products.js` mit `fetch("/api/products")` aufgerufen.

### GET /api/products/:id

Aufgabe:

- Holt ein Produkt anhand der ID.
- Wenn das Produkt existiert, wird es als JSON zurueckgegeben.
- Wenn kein Produkt gefunden wird, kommt HTTP 404.
- Bei Datenbankfehlern kommt HTTP 500.

Die eigentliche Datenbankabfrage liegt nicht in dieser Datei, sondern in `src/models/Product.js`.

## 8. API-Routen fuer Kunden

Datei: `src/routes/customers.js`

Diese Datei definiert alle Kunden-Endpunkte.

### POST /api/customers

Diese Route wird beim Checkout verwendet.

Ablauf:

1. `name`, `email`, `address` und `phone` werden aus `req.body` gelesen.
2. Es wird geprueft, ob `name` und `email` vorhanden sind.
3. Mit `Customer.getByEmail(email, ...)` wird geprueft, ob die E-Mail bereits existiert.
4. Wenn die E-Mail bereits existiert, kommt HTTP 400.
5. Wenn nicht, wird mit `Customer.create(...)` ein neuer Kunde gespeichert.
6. Bei Erfolg kommt HTTP 201 mit `{ success: true, customer }`.

Wichtig: Diese Route speichert aktuell nur Kundendaten. Sie speichert noch keine Bestellung in der Tabelle `orders` und keine Warenkorbpositionen in `order_items`.

### GET /api/customers

Gibt alle Kunden als JSON zurueck. Das ist eher fuer eine Admin-Ansicht gedacht.

### GET /api/customers/:id

Gibt einen einzelnen Kunden anhand der ID zurueck. Wenn kein Kunde gefunden wird, kommt HTTP 404.

### POST /api/checkout

Datei: `src/routes/checkout.js`

Diese Route verarbeitet den Checkout per E-Mail.

Ablauf:

1. Liest `email` und `cart` aus `req.body`.
2. Prueft, ob eine E-Mail vorhanden ist.
3. Prueft, ob der Warenkorb ein Array ist und mindestens einen Artikel enthaelt.
4. Berechnet den Gesamtpreis und erstellt eine lesbare Bestelltext-Version.
5. Erzeugt HTML und Text fuer die E-Mail.
6. Versendet die E-Mail entweder mit echtem SMTP (wenn `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` gesetzt sind) oder mit einem Ethereal-Testaccount.
7. Gibt als Antwort `{ success: true }` zurueck und, falls vorhanden, `previewUrl` fuer die Test-E-Mail.

Wichtig: `nodemailer` wird hier aktiv verwendet. Die Bestellung wird nicht in der SQLite-Datenbank gespeichert, sondern nur per E-Mail verarbeitet.

## 9. Datenbankverbindung

Datei: `src/models/db.js`

Diese Datei ist die zentrale Datenbankdatei. Alle Models verwenden diese Verbindung.

Wichtige Aufgaben:

- `sqlite3` wird geladen.
- `dotenv` wird geladen, damit `.env` gelesen wird.
- Der Datenbankpfad wird bestimmt:
  - zuerst `process.env.DB_FILE`
  - sonst automatisch `database/shop.db`
- Mit `new sqlite3.Database(...)` wird die Verbindung geoeffnet.
- `database/shop.sql` wird gelesen.
- `initializeDatabase()` prueft, ob die Datenbank initialisiert werden muss.

Initialisierungslogik:

1. Es wird geprueft, ob die Tabelle `products` existiert.
2. Wenn nicht, wird `shop.sql` ausgefuehrt.
3. Wenn die Tabelle existiert, wird geprueft, ob Produkte vorhanden sind.
4. Wenn keine Produkte vorhanden sind, wird ebenfalls `shop.sql` ausgefuehrt.
5. Wenn Produkte vorhanden sind, werden einige Produktbeschreibungen synchronisiert.

Hinweis: In der Konsolenausgabe sieht man wegen Zeichencodierung teilweise Zeichen wie `PrÃ¼fen` oder `âœ“`. Inhaltlich sind das deutsche Umlaute bzw. Sonderzeichen, die falsch dekodiert angezeigt werden.

## 10. Product Model

Datei: `src/models/Product.js`

Diese Klasse kapselt Produkt-Datenbankzugriffe.

### Product.getAll(callback)

SQL:

```sql
SELECT * FROM products
```

Gibt alle Produkte zurueck.

### Product.getById(id, callback)

SQL:

```sql
SELECT * FROM products WHERE id = ?
```

Das `?` ist ein Platzhalter. Die ID wird als Parameter uebergeben. Das ist besser als String-Verkettung, weil es SQL-Injection verhindert.

## 11. Customer Model

Datei: `src/models/Customer.js`

Diese Klasse kapselt Kunden-Datenbankzugriffe.

### Customer.create(name, email, address, phone, callback)

SQL:

```sql
INSERT INTO customers (name, email, address, phone) VALUES (?, ?, ?, ?)
```

Speichert einen neuen Kunden. Nach dem Insert wird `this.lastID` genutzt, um die neue ID zurueckzugeben.

### Customer.getAll(callback)

SQL:

```sql
SELECT * FROM customers
```

Gibt alle Kunden zurueck.

### Customer.getById(id, callback)

SQL:

```sql
SELECT * FROM customers WHERE id = ?
```

Gibt einen Kunden anhand der ID zurueck.

### Customer.getByEmail(email, callback)

SQL:

```sql
SELECT * FROM customers WHERE email = ?
```

Wird verwendet, um doppelte E-Mail-Adressen beim Checkout zu verhindern.

## 12. Datenbankschema

Datei: `database/shop.sql`

Diese Datei erstellt vier Tabellen:

### products

Speichert Produkte.

Spalten:

- `id`: eindeutige Produkt-ID.
- `name`: Produktname.
- `price`: Preis.
- `category`: Kategorie.
- `image`: Bildpfad, z. B. `/images/tshirt.png`.
- `description`: Beschreibung.
- `inStock`: 1 bedeutet verfuegbar, 0 bedeutet nicht verfuegbar.

Beispielprodukte:

- Basic T-Shirt
- Hoodie
- Sneaker
- Cap
- Backpack
- Watch

### customers

Speichert Kundendaten.

Spalten:

- `id`: eindeutige Kunden-ID.
- `name`: Name.
- `email`: E-Mail, eindeutig durch `UNIQUE`.
- `address`: Adresse.
- `phone`: Telefonnummer.
- `created_at`: Zeitpunkt der Erstellung.

### orders

Speichert Bestellungen.

Spalten:

- `id`: eindeutige Bestell-ID.
- `customer_id`: Verweis auf `customers.id`.
- `order_date`: Bestelldatum.
- `total`: Gesamtpreis.
- `status`: z. B. `pending` oder `completed`.

Aktuell existiert die Tabelle, aber der Checkout-Code schreibt noch keine neuen Orders hinein.

### order_items

Speichert einzelne Positionen einer Bestellung.

Spalten:

- `id`: eindeutige Positions-ID.
- `order_id`: Verweis auf `orders.id`.
- `product_id`: Verweis auf `products.id`.
- `quantity`: Menge.
- `price`: Preis zum Bestellzeitpunkt.

Auch diese Tabelle wird aktuell vom Checkout-Code noch nicht beschrieben.

## 13. ER-Diagramm

Datei: `database/er-diagram.puml`

Das ist ein PlantUML-Diagramm fuer die Datenbankbeziehungen.

Beziehungen:

- Ein Kunde kann mehrere Bestellungen haben.
- Eine Bestellung kann mehrere Bestellpositionen haben.
- Ein Produkt kann in mehreren Bestellpositionen vorkommen.

Kurz gesagt:

```text
customers -> orders -> order_items -> products
```

## 14. Hauptseite des Shops

Datei: `public/pages/shop.html`

Diese HTML-Datei ist die sichtbare Shop-Seite.

Wichtige Bereiche:

- `<header>`: Titel und kurze Beschreibung.
- `#product-list`: Hier rendert JavaScript die Produktkarten hinein.
- `#cart`: Hier rendert JavaScript den Warenkorb hinein.
- `#checkout-form`: Formular fuer Name, E-Mail, Adresse und Telefonnummer.
- `#success-message`: Erfolgsmeldung nach erfolgreichem Checkout.
- `<script type="module" src="../js/shop.js"></script>` laedt die Shop-Logik.

Wichtig: Die Seite enthaelt neben `online-shop.css` auch Inline-CSS fuer Checkout-Formular, Erfolgsmeldung und Fehlermeldungen.

### Zusätzliche Checkout-Seite

Datei: `public/pages/checkout.html`

Diese Seite zeigt eine zweite Checkout-Oberflaeche, die den aktuellen Warenkorb lokal aus `localStorage` laedt und an den Server sendet. Sie nutzt `public/js/checkout.js`, um den Bestellzusammenhang anzuzeigen, die E-Mail-Adresse zu validieren und den Request an `/api/checkout` zu senden.

## 15. Produktdaten im Frontend laden

Datei: `public/js/products.js`

Diese Datei exportiert zwei Dinge:

```js
export let products = [];
export async function loadProducts() { ... }
```

`products` ist ein Array, in dem die geladenen Produkte gespeichert werden.

`loadProducts()` macht:

1. `fetch("/api/products")`
2. prueft `response.ok`
3. wandelt die Antwort mit `response.json()` in JavaScript-Daten um
4. speichert die Daten in `products`
5. gibt die Produkte zurueck

Wenn ein Fehler passiert, wird er in der Konsole ausgegeben und es wird ein leeres Array zurueckgegeben.

## 16. Shop-Logik im Browser

Datei: `public/js/shop.js`

Diese Datei ist die wichtigste Frontend-Datei fuer den Shop.

Ganz oben:

```js
import { products, loadProducts } from './products.js';
const cart = [];
```

`products` kommt aus `products.js`. `cart` ist der Warenkorb und existiert nur im Browser-Speicher. Wenn man die Seite neu laedt, ist der Warenkorb wieder leer.

### Start beim Laden der Seite

```js
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    displayCart();
    displayProducts();
    setupCheckoutForm();
});
```

Ablauf:

1. Warten, bis HTML fertig geladen ist.
2. Produkte vom Backend laden.
3. Warenkorb anzeigen.
4. Produktkarten anzeigen.
5. Checkout-Formular vorbereiten.

### displayProducts()

Diese Funktion sucht `#product-list` und fuellt den Bereich mit Produktkarten.

Pro Produkt wird ein `div.product-card` erstellt mit:

- Produktbild
- Name
- Preis
- Kategorie
- Beschreibung
- Button `Add to Cart`

Der Button bekommt einen Click-Listener:

```js
button.addEventListener('click', () => addToCart(product.id));
```

### addToCart(productId)

Diese Funktion fuegt ein Produkt zum Warenkorb hinzu.

Ablauf:

1. Produkt anhand der ID in `products` suchen.
2. Pruefen, ob es schon im Warenkorb ist.
3. Wenn ja: `quantity` erhoehen.
4. Wenn nein: neuen Eintrag in `cart` einfuegen.
5. `displayCart()` neu aufrufen.

### removeFromCart(productId)

Entfernt ein Produkt komplett aus dem Warenkorb.

### increaseQuantity(productId)

Erhoeht die Menge eines Warenkorbprodukts um 1.

### decreaseQuantity(productId)

Verringert die Menge um 1. Wenn die Menge dadurch 0 oder kleiner wird, wird das Produkt aus dem Warenkorb entfernt.

### clearCart()

Leert den gesamten Warenkorb mit:

```js
cart.length = 0;
```

Danach wird der Warenkorb neu gerendert.

### displayCart()

Diese Funktion rendert den kompletten Warenkorb neu.

Sie berechnet zuerst den Gesamtpreis:

```js
const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
```

Dann wird `cartSection.innerHTML` neu gesetzt.

Wenn der Warenkorb leer ist:

- Es erscheint `Your cart is empty.`
- Checkout- und Clear-Button werden nicht angezeigt.

Wenn Produkte enthalten sind:

- jedes Produkt wird als Listeneintrag angezeigt
- Minus-Button verringert Menge
- Plus-Button erhoeht Menge
- Remove-Button entfernt den Artikel
- Checkout-Button zeigt das Formular
- Clear-Cart-Button leert alles

Wichtig: Weil `innerHTML` jedes Mal neu gesetzt wird, muessen danach alle Event-Listener neu gesetzt werden. Genau das macht die Funktion unten im Anschluss.

### setupCheckoutForm()

Diese Funktion verbindet das Formular mit JavaScript.

- Submit auf `#customer-form` ruft `submitCustomerData()` auf.
- Click auf `#cancel-order` ruft `hideCheckoutForm()` auf.

### showCheckoutForm()

Macht das Formular sichtbar, indem die CSS-Klasse `show` gesetzt wird.

### hideCheckoutForm()

Versteckt das Formular, setzt es zurueck und entfernt Fehlermeldungen.

### clearErrorMessages()

Entfernt die Klasse `show` von `#name-error` und `#email-error`.

### submitCustomerData()

Diese Funktion wird beim Absenden des Checkout-Formulars ausgefuehrt.

Ablauf:

1. Werte aus den Feldern lesen.
2. Name und E-Mail trimmen.
3. Alte Fehlermeldungen entfernen.
4. Name pruefen.
5. E-Mail pruefen.
6. E-Mail-Format mit Regex pruefen.
7. Wenn ein Fehler existiert, abbrechen.
8. Per `fetch('/api/customers', { method: 'POST', ... })` Daten an das Backend senden.
9. Antwort in JSON umwandeln.
10. Bei Erfolg:
    - Formular verstecken.
    - Erfolgsmeldung anzeigen.
    - Warenkorb leeren.
    - Formular resetten.
11. Bei bekannter Fehlermeldung `Diese E-Mail existiert bereits` wird im Formular ein englischer Fehler angezeigt.
12. Bei anderen Fehlern kommt ein `alert`.

Wichtig: Der Warenkorb selbst wird nicht ans Backend geschickt. Dadurch wird keine echte Bestellung gespeichert, sondern nur ein Kunde.

### showSuccessMessage()

Zeigt `#success-message` fuer 5 Sekunden an.

## 17. Shop-CSS

Datei: `public/css/online-shop.css`

Diese Datei gestaltet den Shop.

Wichtige Bereiche:

- Globaler Reset mit `* { margin: 0; padding: 0; box-sizing: border-box; }`
- `body`: Grundschrift, Hintergrundfarbe und Textfarbe.
- `header`: dunkler Header mit Verlauf.
- `.shop-container`: Grid-Layout mit Produktspalte und Warenkorbspalte.
- `#product-list`: responsive Produktkarten.
- `.product-card`: Karte fuer jedes Produkt.
- `.cart-panel`: rechter Warenkorbbereich.
- `.cart-items`: Liste der Warenkorbpositionen.
- Buttons fuer Warenkorb, Menge und Entfernen.
- Media Queries fuer kleinere Bildschirme.

Bei Bildschirmen unter 980px wird das Layout einspaltig. Der Warenkorb wird dann oben angezeigt, weil `.cart-panel { order: -1; }` gesetzt wird.

## 18. Allgemeines Guide-CSS

Datei: `public/css/style.css`

Diese CSS-Datei wird fuer die Guide- und Basic-Information-Seiten verwendet.

Wichtige Klassen:

- `.sidebar`: linke Navigation.
- `.sidebar .nav-link`: Links in der Sidebar.
- `.sidebar .nav-link.active`: aktiver Navigationspunkt.
- `.main-card`: helle Inhaltskarte.
- `.old-table`: Tabellenstil.
- `.subnav`: sticky Unter-Navigation.
- `.content-scroll`: scrollbarer Inhaltsbereich.
- `.cost-image` und `.cost-image-wrapper`: Darstellung fuer Bilder auf Infoseiten.

## 19. Progress-Bar im Guide

Datei: `public/js/progress.js`

Diese Datei steuert die Fortschrittsleiste auf den Guide-Seiten.

Ablauf:

1. Es wird nach `.progress` gesucht.
2. Wenn keine Progress-Bar existiert, passiert nichts.
3. `data-step` wird aus dem HTML gelesen.
4. `totalSteps` ist fest `7`.
5. Breite wird berechnet:

```js
const targetWidth = (currentStep / totalSteps) * 100;
```

6. Die Breite der Progress-Bar wird gesetzt.

Beispiel: Bei `data-step="3"` ist die Breite `3 / 7 * 100`, also ca. 42.86 Prozent.

## 20. Guide-Seiten

Ordner: `public/pages/guide/`

Diese Seiten bilden den linearen 7-Schritte-Guide:

- `guide-1.html`: Einfuehrung und Bedeutung von Online-Shops.
- `guide-2-idea.html`: Shop-Idee und Ziel.
- `guide-3-choose.html`: Auswahl eines Shopsystems.
- `guide-4-hosting.html`: Hosting-Entscheidung.
- `guide-5-design.html`: Design-Thema.
- `guide-6-payment.html`: Zahlung.
- `guide-7-testing.html`: Testen.

Gemeinsames Muster:

- Jede Seite ist eine HTML-Seite.
- Bootstrap wird per CDN geladen.
- `style.css` wird eingebunden.
- Es gibt eine Hauptkarte `.main-card`.
- Es gibt Navigation zur vorherigen/naechsten Seite.
- Die Progress-Bar bekommt `data-step`.
- `progress.js` animiert bzw. setzt die Fortschrittsanzeige.

## 21. Basic-Information-Seiten

Ordner: `public/pages/basic-informations/`

Diese Seiten sind tiefere Erklaerseiten zum Shop-System-Thema.

Wichtige Dateien:

- `(1)startscreen.html`: Startseite fuer den Informationsbereich.
- `overview.html`: Uebersicht ueber Shopsysteme wie Shopify, WooCommerce, Magento usw.
- `(2)hosting-models.html`: Hosting-Modelle.
- `(3)target-audience.html`: Zielgruppen.
- `(4)cost-structure.html`: Kostenstruktur.
- `(5)internationalization.html`: Internationalisierung.
- `(6)technical-requirements.html`: technische Anforderungen.
- `(7)checkout.html`: Checkout-Prozess.
- `(8)performance-optimization-techniques.html`: Performance-Optimierung.
- `(9)payment.html`: Zahlung.
- `(10)templates.html`: Templates.

Gemeinsames Muster:

- Sidebar-Navigation links.
- Hauptinhalt rechts in `.main-card`.
- Bootstrap fuer Layout und Buttons.
- `style.css` fuer eigenes Design.
- Teilweise Bilder aus `public/images`.

## 22. Bilder

Ordner: `public/images/`

Produktbilder:

- `tshirt.png`
- `hoodie.png`
- `sneaker.png`
- `cap.png`
- `backpack.png`
- `watch.jpg`

Guide-/Informationsbilder:

- `guide-payment.png`
- `guide-design.png`
- `guide-choose-hosting.png`
- `technicalrequirement.png`
- `performanceoptimization.png`

Die Produktbilder werden ueber Pfade wie `/images/tshirt.png` in der Datenbank gespeichert und im Frontend direkt als `src` im `<img>` verwendet.

## 23. Kompletter Datenfluss beim Laden des Shops

Wenn du `http://localhost:3000` oeffnest, passiert Folgendes:

1. Browser fragt `/` beim Express-Server an.
2. `src/app.js` liefert `public/pages/shop.html`.
3. Browser laedt `../css/online-shop.css`.
4. Browser laedt `../js/shop.js` als ES-Modul.
5. `shop.js` importiert `products.js`.
6. Nach `DOMContentLoaded` ruft `shop.js` `loadProducts()` auf.
7. `products.js` sendet `GET /api/products`.
8. `src/routes/products.js` nimmt die Anfrage entgegen.
9. Die Route ruft `Product.getAll(...)` auf.
10. `Product.js` fragt ueber `db.js` die SQLite-Datenbank ab.
11. Die Produkte gehen als JSON zurueck zum Browser.
12. `displayProducts()` baut daraus Produktkarten.
13. `displayCart()` zeigt den anfangs leeren Warenkorb.

## 24. Kompletter Datenfluss beim Checkout

Wenn ein Benutzer Produkte in den Warenkorb legt und Checkout klickt:

1. `addToCart()` fuegt Produkte in das Array `cart`.
2. `displayCart()` rendert Warenkorb und Gesamtpreis.
3. Klick auf `Checkout` ruft `showCheckoutForm()` auf.
4. Benutzer fuellt das Formular aus.
5. Submit ruft `submitCustomerData()` auf.
6. Frontend validiert Name und E-Mail.
7. Frontend sendet `POST /api/customers`.
8. `customers.js` prueft Pflichtfelder.
9. `Customer.getByEmail(...)` prueft doppelte E-Mail.
10. `Customer.create(...)` speichert den Kunden.
11. Backend antwortet mit HTTP 201.
12. Frontend zeigt Erfolgsmeldung und leert den Warenkorb.

Wichtige Einschraenkung:

Der Inhalt des Warenkorbs wird aktuell nicht gespeichert. Es gibt zwar Datenbanktabellen fuer `orders` und `order_items`, aber keine API-Route, die beim Checkout eine Bestellung erstellt.

## 25. Wo finde ich was?

- Serverstart: `src/app.js`
- Produkt-API: `src/routes/products.js`
- Kunden-API: `src/routes/customers.js`
- Checkout-API: `src/routes/checkout.js`
- Produkt-Datenbankzugriffe: `src/models/Product.js`
- Kunden-Datenbankzugriffe: `src/models/Customer.js`
- Datenbankverbindung: `src/models/db.js`
- Datenbankschema: `database/shop.sql`
- ER-Diagramm: `database/er-diagram.puml`
- Shop-HTML: `public/pages/shop.html`
- Shop-Design: `public/css/online-shop.css`
- Shop-Frontendlogik: `public/js/shop.js`
- Produktladen im Frontend: `public/js/products.js`
- Checkout-Frontend: `public/js/checkout.js`
- Guide-Fortschritt: `public/js/progress.js`
- Allgemeines Guide-Design: `public/css/style.css`
- Checkout-Seite: `public/pages/checkout.html`
- Guide-Seiten: `public/pages/guide/`
- Infoseiten: `public/pages/basic-informations/`
- Bilder: `public/images/`

## 26. Aktueller Funktionsumfang

Funktioniert:

- Express-Server startet.
- Shop-Seite wird ausgeliefert.
- Produkte werden aus SQLite geladen.
- Produkte werden im Browser angezeigt.
- Warenkorb funktioniert im Browser.
- Mengen koennen erhoeht und verringert werden.
- Produkte koennen aus dem Warenkorb entfernt werden.
- Warenkorb kann geleert werden.
- Checkout-Formular validiert Name und E-Mail.
- Checkout-Seite sendet Bestellinformationen per E-Mail via `/api/checkout`.
- Kundendaten werden in SQLite gespeichert.
- Doppelte E-Mail-Adressen werden verhindert.
- Guide- und Infoseiten sind statische HTML-Seiten.

Noch nicht vollstaendig umgesetzt:

- Keine echte Bestellspeicherung beim Checkout.
- `orders` und `order_items` werden nur in `shop.sql` angelegt, aber nicht vom Frontend genutzt.
- Kein Login/Register-System, obwohl es in der Projektbeschreibung als Feature genannt wird.
- `.env` enthaelt `PORT`, aber `src/app.js` nutzt aktuell fest Port 3000.

## 27. Typische Erweiterungen

Wenn du spaeter weiterarbeitest, waeren diese Erweiterungen logisch:

1. Checkout so erweitern, dass Warenkorbpositionen an das Backend geschickt werden.
2. Neue Route `POST /api/orders` bauen.
3. In dieser Route:
   - Kunde bestimmen oder erstellen.
   - Gesamtpreis berechnen.
   - Eintrag in `orders` erstellen.
   - Eintraege in `order_items` erstellen.
4. Optional eine Admin-Seite bauen, die Kunden und Bestellungen anzeigt.
5. Optional E-Mail-Bestaetigung mit `nodemailer` senden.
6. Port aus `.env` verwenden.
7. Encoding-Probleme bei Umlauten/Sonderzeichen bereinigen.

## 28. Wichtigste Merksaetze

- `src/app.js` verbindet alles.
- `routes` definieren URLs.
- `models` sprechen mit der Datenbank.
- `db.js` ist die zentrale SQLite-Verbindung.
- `shop.html` enthaelt die Grundstruktur.
- `shop.js` macht die Shop-Seite interaktiv.
- `products.js` holt Produktdaten vom Backend.
- `shop.sql` beschreibt, wie die Datenbank aufgebaut ist.
- Der Warenkorb ist aktuell nur im Browser gespeichert.
- Beim Checkout wird aktuell nur ein Kunde gespeichert, keine Bestellung.
