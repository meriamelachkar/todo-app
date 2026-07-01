# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# TodoApp

Eine moderne Todo-Anwendung mit Angular-Frontend und Spring-Boot-Backend. Die Anwendung ermöglicht das Erstellen, Anzeigen und Verwalten von Todo-Listen und Aufgaben.

## Features

- Dashboard mit Übersicht über alle Listen und Aufgaben
- Anzeige von Gesamtzahl, offenen und erledigten Todos
- Globale Suche nach Listen und Aufgaben
- Weiterleitung aus der Suche zur passenden Liste oder Aufgabe
- Highlight der gefundenen Liste oder Aufgabe auf der Detailseite
- Erstellung und Löschung von Todo-Listen
- Auswahl eines Icons pro Liste
- Erstellung, Erledigung und Löschung von Todos
- Kategorien und Prioritäten für Todos
- Moderne responsive Oberfläche mit Sidebar
- Fehleranzeigen für Nutzer bei fehlgeschlagenen Aktionen
- Frontend-Tests mit Vitest

## Technologie-Stack

### Frontend

- Angular 21
- TypeScript
- Bootstrap
- CSS
- Vitest

### Backend

- Spring Boot
- Java
- PostgreSQL
- Docker

## Projektstruktur

```text
frontend/
  src/app/components/sidebar
  src/app/pages/dashboard-page
  src/app/pages/todo-list-page
  src/app/pages/todo-detail-page
  src/app/services
  src/app/models

todo-backend/
  src/main/java
  src/main/resources
```

## Frontend starten

```bash
cd frontend
npm install
npm start
```

Alternativ:

```bash
ng serve
```

Die Anwendung läuft danach unter:

```text
http://localhost:4200
```

## Backend starten

Im Projektordner kann das Backend mit Docker gestartet werden:

```bash
docker compose up
```

Danach läuft das Backend standardmäßig unter:

```text
http://localhost:8080
```

## Tests ausführen

Frontend-Tests einmalig ausführen:

```bash
cd frontend
npm test -- --watch=false
```

## Benutzerdokumentation

### 1. Anwendung öffnen

Nach dem Start des Frontends kann die TodoApp im Browser geöffnet werden:

```text
http://localhost:4200
```

Die Anwendung besteht aus einer Sidebar auf der linken Seite und dem jeweiligen Seiteninhalt rechts.

### 2. Navigation

Über die Sidebar kann zwischen den wichtigsten Bereichen gewechselt werden:

- **Dashboard:** Übersicht über Aufgaben, Listen und Fortschritt
- **Listen:** Verwaltung aller Todo-Listen
- **Neueste Listen:** Schnellzugriff auf die zuletzt erstellten Listen

### 3. Dashboard verwenden

Das Dashboard zeigt eine Gesamtübersicht über den aktuellen Stand der Todos.

Angezeigt werden:

- Gesamtzahl aller Todos
- Anzahl offener Todos
- Anzahl erledigter Todos
- Erledigungsrate in Prozent
- aktuelle Listen
- aktuelle Aufgaben

Offene Aufgaben können direkt im Dashboard über die Checkbox als erledigt markiert werden.

### 4. Globale Suche verwenden

Oben im Dashboard befindet sich eine Suchleiste. Dort kann nach Listen und Aufgaben gesucht werden.

Die Suche funktioniert für:

- Listennamen
- Todo-Titel
- Todo-Beschreibungen
- Kategorien
- Prioritäten

Während der Eingabe erscheinen passende Vorschläge als Dropdown. Wird ein Vorschlag angeklickt, leitet die Anwendung direkt zur passenden Liste weiter.

Bei einem Treffer wird die passende Stelle auf der Zielseite hervorgehoben:

- Bei einer gefundenen Liste wird der Listenname markiert.
- Bei einer gefundenen Aufgabe wird die passende Todo-Zeile markiert.

Wenn außerhalb der Suche geklickt wird, schließt sich das Dropdown automatisch.

### 5. Neue Liste erstellen

Auf der Seite **Listen** kann eine neue Todo-Liste erstellt werden.

Dafür werden folgende Angaben verwendet:

- Name der Liste
- optionale Beschreibung
- optionales Icon

Nach dem Erstellen wird die neue Liste gespeichert und automatisch geöffnet.

### 6. Liste öffnen

Eine Liste kann über die Listenübersicht, die Sidebar oder die Suche geöffnet werden. Auf der Detailseite werden alle Todos dieser Liste angezeigt.

### 7. Todo erstellen

Auf der Detailseite einer Liste kann ein neues Todo erstellt werden.

Ein Todo besteht aus:

- Titel
- optionaler Beschreibung
- Kategorie
- Priorität

Der Titel ist Pflicht. Ohne Titel wird eine Fehlermeldung angezeigt.

### 8. Todo erledigen

Todos können über die Checkbox als erledigt oder wieder offen markiert werden. Danach werden die Liste und die Todo-Statistiken automatisch aktualisiert.

### 9. Todo löschen

Ein Todo kann über den Löschbutton entfernt werden. Nach dem Löschen wird die Liste neu geladen.

### 10. Liste löschen

In der Listenübersicht kann eine Liste gelöscht werden. Vor dem Löschen erscheint eine Bestätigung. Wird der Vorgang bestätigt, wird die Liste entfernt und die Übersicht neu geladen.

### 11. Fehleranzeigen

Wenn Daten nicht geladen, erstellt, aktualisiert oder gelöscht werden können, zeigt die Anwendung eine passende Fehlermeldung an. Häufige Ursache ist, dass Backend oder Datenbank nicht laufen.

## Wichtige Seiten

### Dashboard

Das Dashboard zeigt eine Gesamtübersicht über alle Todos und Listen. Zusätzlich gibt es eine globale Suche, mit der Nutzer direkt zu passenden Listen oder Aufgaben springen können.

### Listenübersicht

In der Listenübersicht können neue Listen erstellt, bestehende Listen geöffnet und Listen gelöscht werden. Für jede Liste kann ein Icon ausgewählt werden.

### Detailseite

Auf der Detailseite einer Liste können Todos erstellt, erledigt und gelöscht werden. Todos besitzen Titel, Beschreibung, Kategorie und Priorität.

## API-Grundlage

Das Frontend kommuniziert mit dem Backend über REST-Endpunkte. Die wichtigsten Bereiche sind:

- Todo-Listen laden, erstellen und löschen
- Todos laden, erstellen, abhaken und löschen
- Dashboard-Statistiken laden

## Hinweis

Für die lokale Nutzung müssen Backend und Datenbank laufen, damit das Frontend Daten laden und speichern kann.
