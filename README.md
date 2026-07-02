# TodoApp

Eine moderne Fullstack-Todo-Anwendung mit Angular-Frontend und Spring-Boot-Backend. Nutzer können Todo-Listen erstellen, Aufgaben verwalten, Aufgaben als erledigt markieren und ihren Fortschritt über ein Dashboard verfolgen.

Das Projekt wurde als Portfolio-Projekt umgesetzt und zeigt die praktische Verbindung zwischen Frontend, Backend, REST-API, Datenbank, Docker und automatisierten Tests.

## Kurzüberblick

| Bereich | Umsetzung |
| --- | --- |
| Frontend | Angular, TypeScript, Angular Signals, Angular Router, Bootstrap |
| Backend | Java 21, Spring Boot, REST-API |
| Datenbank | PostgreSQL über Docker Compose |
| Tests | Vitest / Angular Tests |
| Architektur | Komponenten, Pages, Services, Models, REST-Kommunikation |
| Ziel | Portfolio-Projekt für Bewerbungen im Bereich Wirtschaftsinformatik / Softwareentwicklung |

## Inhaltsverzeichnis

- [Features](#features)
- [Screenshots](#screenshots)
- [Technologie-Stack](#technologie-stack)
- [Projektstruktur](#projektstruktur)
- [Tests](#tests)
- [Installation und Start](#installation-und-start)
- [Benutzerdokumentation](#benutzerdokumentation)
- [API-Endpunkte](#api-endpunkte)
- [Datenmodell](#datenmodell)
- [HTTP-Status-Codes](#http-status-codes)
- [Learnings](#learnings)
- [Hinweise](#hinweise)
- [Autorin](#autorin)

## Features

### Dashboard

- Übersicht über alle Todo-Listen und Aufgaben
- Anzeige von Gesamtzahl, offenen und erledigten Todos
- Berechnung und Anzeige der Erledigungsrate in Prozent
- Anzeige aktueller Listen und Aufgaben
- Direktes Erledigen offener Aufgaben über Checkboxen

### Todo-Listen

- Erstellung neuer Todo-Listen
- Bearbeitung bestehender Todo-Listen
- Löschung von Todo-Listen mit Bestätigung
- Auswahl und Speicherung eines Icons pro Liste
- Anzeige der neuesten Listen in der Sidebar

### Todos

- Erstellung neuer Todos
- Bearbeitung bestehender Todos
- Markieren von Todos als erledigt oder offen
- Löschung von Todos
- Kategorien für Todos
- Prioritäten für Todos

### Suche und Navigation

- Globale Suche nach Listen und Aufgaben
- Suchvorschläge als Dropdown während der Eingabe
- Suche nach Listennamen, Todo-Titeln, Beschreibungen, Kategorien und Prioritäten
- Weiterleitung aus der Suche zur passenden Liste oder Aufgabe
- Highlight der gefundenen Liste oder Aufgabe auf der Zielseite
- Moderne Sidebar-Navigation

### Benutzerfreundlichkeit

- Responsive Benutzeroberfläche
- Nutzerfreundliche Fehlermeldungen bei fehlgeschlagenen Aktionen
- Automatisches Neuladen relevanter Daten nach Änderungen
- Persistenz kleiner UI-Daten über localStorage, zum Beispiel Listen-Icons

## Screenshots

Die folgenden Screenshots zeigen die wichtigsten Ansichten der Anwendung.

### Dashboard

<img width="1127" height="930" alt="TodoApp Dashboard" src="https://github.com/user-attachments/assets/2c6a8d70-a96b-4225-aebd-93899e48ad86" />

### Listenübersicht

<img width="1129" height="922" alt="TodoApp Listenübersicht" src="https://github.com/user-attachments/assets/4b0c3da5-8694-48c6-aae7-91d4d63fdc86" />

### Todo-Detailansicht

<img width="1127" height="920" alt="TodoApp Todo-Detailansicht" src="https://github.com/user-attachments/assets/4015f626-5e9d-4a61-88bc-f22108f3190f" />

## Technologie-Stack

### Frontend

- Angular
- TypeScript
- Angular Signals
- Angular Router
- Bootstrap
- CSS
- Vitest / Angular Testing

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- PostgreSQL
- Docker / Docker Compose
- REST-API

## Projektstruktur

```text
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
```

## Tests

Das Frontend enthält automatisierte Tests für Komponenten, Pages und Services.

Aktueller Teststatus:

```text
Test Files  7 passed (7)
Tests       63 passed (63)
```

Getestet werden unter anderem:

- Laden von Dashboard-Daten
- Berechnung von Todo-Statistiken
- Globale Suche
- Navigation aus Suchergebnissen
- Highlight-Parameter für Suchtreffer
- Laden, Erstellen und Löschen von Listen
- Speichern und Auslesen von Listen-Icons
- Laden, Erstellen, Erledigen und Löschen von Todos
- Fehlerfälle bei fehlgeschlagenen API-Aufrufen
- Sidebar mit neuesten Listen
- Routing im App-Test
- HTTP-Requests der Angular Services

Tests ausführen:

```bash
cd frontend
npm test -- --watch=false
```

## Installation und Start

### Voraussetzungen

Für die lokale Ausführung werden benötigt:

- Java 21 oder neuer
- Node.js 20 oder neuer
- npm
- Angular CLI
- Docker Desktop
- PostgreSQL oder Docker Compose

### Repository klonen

```bash
git clone https://github.com/meriamelachkar/todo-app.git
cd todo-app
```

### Frontend-Abhängigkeiten installieren

```bash
cd frontend
npm install
```

### Datenbank starten

Im Projektordner:

```bash
docker-compose up -d
```

### Backend starten

In einem Terminal:

```bash
cd todo-backend
./gradlew bootRun
```

Das Backend läuft unter:

```text
http://localhost:8081
```

Die REST-API ist erreichbar unter:

```text
http://localhost:8081/api
```

### Frontend starten

In einem zweiten Terminal:

```bash
cd frontend
ng serve --port 4201
```

Alternativ:

```bash
npm start
```

Das Frontend läuft unter:

```text
http://localhost:4201
```

## Benutzerdokumentation

### 1. Anwendung öffnen

Nach dem Start des Frontends kann die TodoApp im Browser geöffnet werden:

```text
http://localhost:4201
```

Die Anwendung besteht aus einer Sidebar auf der linken Seite und dem jeweiligen Seiteninhalt rechts.

### 2. Navigation

Über die Sidebar kann zwischen den wichtigsten Bereichen gewechselt werden:

- Dashboard: Übersicht über Aufgaben, Listen und Fortschritt
- Listen: Verwaltung aller Todo-Listen
- Neueste Listen: Schnellzugriff auf zuletzt erstellte Listen

### 3. Dashboard verwenden

Das Dashboard zeigt eine Gesamtübersicht über den aktuellen Stand der Todos.

Angezeigt werden:

- Gesamtzahl aller Todos
- Anzahl offener Todos
- Anzahl erledigter Todos
- Erledigungsrate in Prozent
- aktuelle Listen
- aktuelle Aufgaben

Offene Aufgaben können direkt im Dashboard über die Checkbox als erledigt markiert werden. Nach dem Markieren werden die Daten automatisch neu geladen.

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

Auf der Seite Listen kann eine neue Todo-Liste erstellt werden.

Dafür werden folgende Angaben verwendet:

- Name der Liste
- optionale Beschreibung
- optionales Icon

Der Name der Liste ist Pflicht. Ohne Namen wird eine Fehlermeldung angezeigt.

Nach dem Erstellen wird die neue Liste gespeichert und automatisch geöffnet.

### 6. Todo erstellen

Auf der Detailseite einer Liste kann ein neues Todo erstellt werden.

Ein Todo besteht aus:

- Titel
- optionaler Beschreibung
- Kategorie
- Priorität

Der Titel ist Pflicht. Ohne Titel wird eine Fehlermeldung angezeigt.

### 7. Todo erledigen oder löschen

Todos können über die Checkbox als erledigt oder wieder offen markiert werden.

Ein Todo kann außerdem über den Löschbutton entfernt werden. Nach Änderungen werden die Daten automatisch neu geladen.

### 8. Fehleranzeigen

Wenn Daten nicht geladen, erstellt, aktualisiert oder gelöscht werden können, zeigt die Anwendung eine passende Fehlermeldung an.

Häufige Ursachen sind:

- Backend läuft nicht
- Datenbank läuft nicht
- Docker wurde nicht gestartet
- API ist nicht erreichbar

## API-Endpunkte

Die TodoApp stellt eine REST-API bereit, die unter folgender Basis-URL erreichbar ist:

```text
http://localhost:8081/api
```

Alle Anfragen und Antworten verwenden JSON.

### Todo-Listen

| Methode | Endpunkt | Beschreibung |
| --- | --- | --- |
| GET | `/api/lists` | Alle Listen abrufen |
| GET | `/api/lists/{id}` | Eine Liste mit allen Todos abrufen |
| POST | `/api/lists` | Neue Liste erstellen |
| PUT | `/api/lists/{id}` | Liste bearbeiten |
| DELETE | `/api/lists/{id}` | Liste löschen |

### Todos

| Methode | Endpunkt | Beschreibung |
| --- | --- | --- |
| GET | `/api/todos` | Alle Todos abrufen |
| GET | `/api/todos?listId=1&completed=false&priority=HIGH&category=ARBEIT` | Todos gefiltert abrufen |
| GET | `/api/todos/{id}` | Ein Todo abrufen |
| POST | `/api/todos` | Neues Todo erstellen |
| PUT | `/api/todos/{id}` | Todo bearbeiten |
| PATCH | `/api/todos/{id}/toggle` | Todo als erledigt oder offen markieren |
| DELETE | `/api/todos/{id}` | Todo löschen |
| GET | `/api/todos/stats` | Dashboard-Statistiken abrufen |
| GET | `/api/todos/categories` | Alle Kategorien abrufen |

## Datenmodell

Die TodoApp verwendet zwei zentrale Tabellen:

- `TODO_LIST`
- `TODO`

Eine Todo-Liste kann beliebig viele Todos enthalten. Jedes Todo gehört genau zu einer Todo-Liste.

`TodoPriority` und `TodoCategory` sind Enumerations und werden als String in der Datenbank gespeichert.

### TodoPriority

```text
LOW · MEDIUM · HIGH · URGENT
```

### TodoCategory

```text
ARBEIT · PRIVAT · UNI · EINKAUF · GESUNDHEIT · FINANZEN
```

### Beziehungen

| Beziehung | Typ | Beschreibung |
| --- | --- | --- |
| TODO_LIST → TODO | One-to-Many | Eine Liste enthält beliebig viele Todos |
| TODO → TODO_LIST | Many-to-One | Jedes Todo gehört genau einer Liste |

### Hinweise zum Datenmodell

- `tags` wird als kommaseparierter String gespeichert, zum Beispiel `java,backend`
- `color` speichert einen Hex-Farbwert, zum Beispiel `#6366f1`
- `icon` speichert ein Emoji, zum Beispiel `📋`
- Wird eine Liste gelöscht, werden alle zugehörigen Todos mitgelöscht. Das erfolgt über Cascade Delete.

## HTTP-Status-Codes

| Code | Bedeutung |
| --- | --- |
| 200 | Erfolgreich |
| 201 | Erfolgreich erstellt |
| 204 | Erfolgreich gelöscht |
| 400 | Ungültige Anfrage |
| 404 | Nicht gefunden |
| 500 | Serverfehler |

## Learnings

In diesem Projekt wurden folgende Themen praktisch umgesetzt:

- Aufbau einer Angular-Anwendung mit Standalone Components
- Nutzung von Angular Signals für lokalen UI-State
- Kommunikation mit einer REST-API über Angular Services
- Routing mit Angular Router
- Komponentenbasierte Strukturierung der Benutzeroberfläche
- Formularverarbeitung mit Angular Forms
- Fehlerbehandlung im Frontend
- Moderne UI-Gestaltung mit Bootstrap und CSS
- Persistenz kleiner UI-Daten über localStorage
- Fullstack-Zusammenspiel zwischen Angular, Spring Boot und PostgreSQL
- Schreiben von Frontend-Tests mit Vitest
- Mocking von Services, Router und localStorage in Tests
- Schreiben von HTTP-Service-Tests mit HttpTestingController
- Arbeiten mit Docker Compose für die lokale Entwicklungsumgebung
- Strukturierung eines Projekts für GitHub und Bewerbungen

## Hinweise

Für die lokale Nutzung müssen Backend und Datenbank laufen. Wenn im Frontend keine Daten angezeigt werden, sollte zuerst geprüft werden, ob Docker, PostgreSQL und das Backend gestartet sind.

Bei Problemen mit dem Frontend können die Tests ausgeführt werden:

```bash
cd frontend
npm test -- --watch=false
```

Bei Problemen mit fehlenden Daten sollte geprüft werden:

- Backend läuft auf `http://localhost:8081`
- Frontend läuft auf `http://localhost:4201`
- Datenbank ist erreichbar
- Docker Container laufen

## Autorin

Entwickelt von Meriam Elachkar.
