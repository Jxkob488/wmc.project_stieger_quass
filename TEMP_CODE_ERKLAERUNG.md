Der Shop nutzt ein Node.js/Express-Backend mit SQLite.

## Backend

In `src/app.js` wird der Express-Server aufgebaut:
- `express.json()` für JSON-Requests
- `express.urlencoded({ extended: true })` für Formdaten
- Router aus `src/routes` werden unter `/api` eingebunden
- statische Dateien laufen über `public`
- der Server startet auf Port `3000`

Wichtige Backend-Dateien:
- `src/routes/products.js`: Produkt-API
- `src/routes/customers.js`: Kunden-API
- `src/routes/checkout.js`: Checkout-API mit E-Mail-Versand
- `src/models/db.js`: SQLite-Verbindung und Initialisierung
- `src/models/Product.js`: Produktdatenzugriffe
- `src/models/Customer.js`: Kundendatenzugriffe

## Datenbank

`src/models/db.js` öffnet die SQLite-Datenbank:
- `dotenv` liest `DB_FILE`
- Standard: `database/shop.db`
- `initializeDatabase()` führt `database/shop.sql` aus, wenn die Tabellen fehlen oder leer sind

### Produktmodell
- `Product.getAll(callback)`: `SELECT * FROM products`
- `Product.getById(id, callback)`: `SELECT * FROM products WHERE id = ?`

### Kundenmodell
- `Customer.create(...)`: `INSERT INTO customers (name, email, address, phone) VALUES (?, ?, ?, ?)`
- `Customer.getAll(callback)`: `SELECT * FROM customers`
- `Customer.getById(id, callback)`: `SELECT * FROM customers WHERE id = ?`
- `Customer.getByEmail(email, callback)`: `SELECT * FROM customers WHERE email = ?`

## API-Routen

### Produkte
- `GET /api/products`: liefert alle Produkte
- `GET /api/products/:id`: liefert ein Produkt nach ID

### Kunden
- `POST /api/customers`: legt einen neuen Kunden an
- `GET /api/customers`: liefert alle Kunden
- `GET /api/customers/:id`: liefert einen Kunden nach ID

### Checkout
- `POST /api/checkout`: liest `email` und `cart`
- prüft Warenkorb und E-Mail
- berechnet Total
- versendet E-Mail mit `nodemailer`
- nutzt SMTP, falls konfiguriert, sonst Ethereal

Wichtig: Der Checkout speichert derzeit keine Bestellungen in der Datenbank.

## Datenbankschema

`database/shop.sql` legt die Tabellen fest:
- `products`
- `customers`
- `orders`
- `order_items`

`orders` und `order_items` sind Teil des Schemas, werden aktuell aber nicht vom Checkout-Backend befüllt.

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
