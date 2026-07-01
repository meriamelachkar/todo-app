# TodoApp

Eine moderne Fullstack-Todo-Anwendung mit Angular-Frontend und Spring-Boot-Backend. Nutzer können Todo-Listen erstellen, Aufgaben verwalten, Aufgaben als erledigt markieren und ihren Fortschritt über ein Dashboard verfolgen.

Das Projekt wurde als Portfolio-Projekt umgesetzt und zeigt die Verbindung zwischen Frontend, Backend, REST-API, Datenbank, Docker und automatisierten Frontend-Tests.

## Inhaltsverzeichnis

* Features⁠￼
* Screenshots⁠￼
* Technologie-Stack⁠￼
* Projektstruktur⁠￼
* Voraussetzungen⁠￼
* Installation⁠￼
* Anwendung starten⁠￼
* Tests ausführen⁠￼
* Benutzerdokumentation⁠￼
* API-Endpunkte⁠￼
* Datenmodell⁠￼
* HTTP-Status-Codes⁠￼
* Learnings⁠￼
* Hinweise⁠￼

### Features

* Dashboard mit Übersicht über alle Todo-Listen und Aufgaben
* Anzeige von Gesamtzahl, offenen und erledigten Todos
* Berechnung und Anzeige der Erledigungsrate in Prozent
* Globale Suche nach Listen und Aufgaben
* Suchvorschläge als Dropdown während der Eingabe
* Weiterleitung aus der Suche zur passenden Liste oder Aufgabe
* Highlight der gefundenen Liste oder Aufgabe auf der Zielseite
* Erstellung von Todo-Listen
* Bearbeitung von Todo-Listen
* Löschung von Todo-Listen
* Auswahl eines Icons pro Liste
* Erstellung von Todos
* Bearbeitung von Todos
* Todos als erledigt oder offen markieren
* Löschung von Todos
* Kategorien für Todos
* Prioritäten für Todos
* Moderne Sidebar-Navigation
* Anzeige der neuesten Listen in der Sidebar
* Responsive Benutzeroberfläche
* Nutzerfreundliche Fehlermeldungen bei fehlgeschlagenen Aktionen
* Frontend-Tests mit Vitest

### Screenshots

Screenshots können im Ordner docs/screenshots abgelegt und hier eingebunden werden.


Beispiel:


<img width="1127" height="930" alt="Bildschirmfoto 2026-07-01 um 22 46 54" src="https://github.com/user-attachments/assets/2c6a8d70-a96b-4225-aebd-93899e48ad86" />
<img width="1129" height="922" alt="Bildschirmfoto 2026-07-01 um 22 47 20" src="https://github.com/user-attachments/assets/4b0c3da5-8694-48c6-aae7-91d4d63fdc86" />
<img width="1127" height="920" alt="Bildschirmfoto 2026-07-01 um 22 47 36" src="https://github.com/user-attachments/assets/4015f626-5e9d-4a61-88bc-f22108f3190f" />


### Technologie-Stack

Frontend

* Angular 21
* TypeScript
* Angular Signals
* Angular Router
* Bootstrap
* CSS
* Vitest

Backend

* Java 21
* Spring Boot
* PostgreSQL
* Docker
* REST-API

Projektstruktur

TodoApp/
  frontend/
    src/
      app/
        components/
          sidebar/
        pages/
          dashboard-page/
          todo-list-page/
          todo-detail-page/
        services/
          todo.service.ts
          todo-list.service.ts
        models/
          todo.model.ts
          todo-list.model.ts
  todo-backend/
    src/
      main/
        java/
        resources/
  docker-compose.yml
  Dockerfile
  README.md

### Voraussetzungen

Für die lokale Ausführung werden benötigt:

* Java 21 oder neuer
* Node.js 20 oder neuer
* npm
* Angular CLI
* Docker Desktop
* PostgreSQL oder Docker Compose

Installation

Repository klonen:

git clone https://github.com/meriamelachkar/todo-app.git
cd todo-app

Frontend-Abhängigkeiten installieren:

cd frontend
npm install

Anwendung starten

1. Datenbank starten

Im Projektordner:

docker-compose up -d

2. Backend starten

In einem Terminal:

cd todo-backend
./gradlew bootRun

Das Backend läuft unter:

http://localhost:8081

Die REST-API ist erreichbar unter:

http://localhost:8081/api

3. Frontend starten

In einem zweiten Terminal:

cd frontend
ng serve --port 4201

Alternativ:

npm start

Das Frontend läuft unter:

http://localhost:4201

Die Anwendung ist danach im Browser unter http://localhost:4201 erreichbar.

Tests ausführen

Frontend-Tests einmalig ausführen:

cd frontend
npm test -- --watch=false

Tests im Watch-Modus ausführen:

npm test

Aktueller Testumfang:

App
Sidebar
DashboardPage
TodoListPage
TodoDetailPage

Die Tests prüfen unter anderem:

* Laden von Dashboard-Daten
* Berechnung von Todo-Statistiken
* Globale Suche
* Navigation aus Suchergebnissen
* Highlight-Parameter für Suchtreffer
* Laden, Erstellen und Löschen von Listen
* Speichern und Auslesen von Listen-Icons
* Laden, Erstellen, Erledigen und Löschen von Todos
* Fehlerfälle bei fehlgeschlagenen API-Aufrufen
* Sidebar mit neuesten Listen
* Routing im App-Test

## Benutzerdokumentation

1. Anwendung öffnen

Nach dem Start des Frontends kann die TodoApp im Browser geöffnet werden:

http://localhost:4201

Die Anwendung besteht aus einer Sidebar auf der linken Seite und dem jeweiligen Seiteninhalt rechts.

2. Navigation

Über die Sidebar kann zwischen den wichtigsten Bereichen gewechselt werden:

* Dashboard: Übersicht über Aufgaben, Listen und Fortschritt
* Listen: Verwaltung aller Todo-Listen
* Neueste Listen: Schnellzugriff auf die zuletzt erstellten Listen

3. Dashboard verwenden

Das Dashboard zeigt eine Gesamtübersicht über den aktuellen Stand der Todos.

Angezeigt werden:

* Gesamtzahl aller Todos
* Anzahl offener Todos
* Anzahl erledigter Todos
* Erledigungsrate in Prozent
* aktuelle Listen
* aktuelle Aufgaben

Offene Aufgaben können direkt im Dashboard über die Checkbox als erledigt markiert werden. Nach dem Markieren werden die Daten automatisch neu geladen.

4. Globale Suche verwenden

Oben im Dashboard befindet sich eine Suchleiste. Dort kann nach Listen und Aufgaben gesucht werden.

Die Suche funktioniert für:

* Listennamen
* Todo-Titel
* Todo-Beschreibungen
* Kategorien
* Prioritäten

Während der Eingabe erscheinen passende Vorschläge als Dropdown. Wird ein Vorschlag angeklickt, leitet die Anwendung direkt zur passenden Liste weiter.

Bei einem Treffer wird die passende Stelle auf der Zielseite hervorgehoben:

* Bei einer gefundenen Liste wird der Listenname markiert.
* Bei einer gefundenen Aufgabe wird die passende Todo-Zeile markiert.

Wenn außerhalb der Suche geklickt wird, schließt sich das Dropdown automatisch.

5. Neue Liste erstellen

Auf der Seite Listen kann eine neue Todo-Liste erstellt werden.

Dafür werden folgende Angaben verwendet:

* Name der Liste
* optionale Beschreibung
* optionales Icon

Der Name der Liste ist Pflicht. Ohne Namen wird eine Fehlermeldung angezeigt.

Nach dem Erstellen wird die neue Liste gespeichert und automatisch geöffnet.

6. Liste öffnen

Eine Liste kann über die Listenübersicht, die Sidebar oder die Suche geöffnet werden.

Auf der Detailseite werden alle Todos dieser Liste angezeigt.

7. Todo erstellen

Auf der Detailseite einer Liste kann ein neues Todo erstellt werden.

Ein Todo besteht aus:

* Titel
* optionaler Beschreibung
* Kategorie
* Priorität

Der Titel ist Pflicht. Ohne Titel wird eine Fehlermeldung angezeigt.

8. Todo erledigen

Todos können über die Checkbox als erledigt oder wieder offen markiert werden.

Nach der Änderung werden die Todos und die Listenstatistiken automatisch aktualisiert.

9. Todo löschen

Ein Todo kann über den Löschbutton entfernt werden.

Nach dem Löschen wird die Liste neu geladen.

10. Liste löschen

In der Listenübersicht kann eine Liste gelöscht werden.

Vor dem Löschen erscheint eine Bestätigung. Wird der Vorgang bestätigt, wird die Liste entfernt und die Übersicht neu geladen.

11. Fehleranzeigen

Wenn Daten nicht geladen, erstellt, aktualisiert oder gelöscht werden können, zeigt die Anwendung eine passende Fehlermeldung an.

Häufige Ursachen sind:

* Backend läuft nicht
* Datenbank läuft nicht
* Docker wurde nicht gestartet
* API ist nicht erreichbar

## API-Endpunkte

Einführung

Die TodoApp stellt eine REST-API bereit, die unter folgender Basis-URL erreichbar ist:

http://localhost:8081/api

Alle Anfragen und Antworten verwenden JSON.

Todo-Listen

Methode	Endpunkt	Beschreibung
GET	/api/lists	Alle Listen abrufen
GET	/api/lists/{id}	Eine Liste mit allen Todos abrufen
POST	/api/lists	Neue Liste erstellen
PUT	/api/lists/{id}	Liste bearbeiten
DELETE	/api/lists/{id}	Liste löschen

Todos

Methode	Endpunkt	Beschreibung
GET	/api/todos	Alle Todos abrufen
GET	/api/todos?listId=1&completed=false&priority=HIGH&category=ARBEIT	Todos gefiltert abrufen
GET	/api/todos/{id}	Ein Todo abrufen
POST	/api/todos	Neues Todo erstellen
PUT	/api/todos/{id}	Todo bearbeiten
PATCH	/api/todos/{id}/toggle	Todo als erledigt oder offen markieren
DELETE	/api/todos/{id}	Todo löschen
GET	/api/todos/stats	Dashboard-Statistiken abrufen
GET	/api/todos/categories	Alle Kategorien abrufen

Datenmodell

Einführung

Die TodoApp verwendet zwei zentrale Tabellen:

TODO_LIST
TODO

Eine Todo-Liste kann beliebig viele Todos enthalten. Jedes Todo gehört genau zu einer Todo-Liste.

TodoPriority und TodoCategory sind Enumerations und werden als String in der Datenbank gespeichert.

TodoPriority

LOW · MEDIUM · HIGH · URGENT

TodoCategory

ARBEIT · PRIVAT · UNI · EINKAUF · GESUNDHEIT · FINANZEN

Beziehungen

Beziehung	Typ	Beschreibung
TODO_LIST → TODO	One-to-Many	Eine Liste enthält beliebig viele Todos
TODO → TODO_LIST	Many-to-One	Jedes Todo gehört genau einer Liste

Hinweise zum Datenmodell

* tags wird als kommaseparierter String gespeichert, zum Beispiel "java,backend"
* color speichert einen Hex-Farbwert, zum Beispiel "#6366f1"
* icon speichert ein Emoji, zum Beispiel "📋"
* Wird eine Liste gelöscht, werden alle zugehörigen Todos mitgelöscht. Das erfolgt über Cascade Delete.

HTTP-Status-Codes

Code	Bedeutung
200	Erfolgreich
201	Erfolgreich erstellt
204	Erfolgreich gelöscht
400	Ungültige Anfrage
404	Nicht gefunden
500	Serverfehler

Learnings

In diesem Projekt wurden folgende Themen praktisch umgesetzt:

* Aufbau einer Angular-Anwendung mit Standalone Components
* Nutzung von Angular Signals für lokalen UI-State
* Kommunikation mit einer REST-API über Angular Services
* Routing mit Angular Router
* Komponentenbasierte Strukturierung der Benutzeroberfläche
* Formularverarbeitung mit Angular Forms
* Fehlerbehandlung im Frontend
* Moderne UI-Gestaltung mit Bootstrap und CSS
* Persistenz kleiner UI-Daten über localStorage
* Fullstack-Zusammenspiel zwischen Angular, Spring Boot und PostgreSQL
* Schreiben von Frontend-Tests mit Vitest
* Mocking von Services, Router und localStorage in Tests
* Arbeiten mit Docker Compose für die lokale Entwicklungsumgebung

### Hinweise

Für die lokale Nutzung müssen Backend und Datenbank laufen. Wenn im Frontend keine Daten angezeigt werden, sollte zuerst geprüft werden, ob Docker, PostgreSQL und das Backend gestartet sind.

Bei Problemen mit dem Frontend können die Tests ausgeführt werden:

cd frontend
npm test -- --watch=false

Bei Problemen mit fehlenden Daten sollte geprüft werden:

Backend läuft auf http://localhost:8081
Frontend läuft auf http://localhost:4201
Datenbank ist erreichbar
Docker Container laufen

Autorin

Entwickelt von Meriam Elachkar.
