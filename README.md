# Bubatz Club

![bubatz-img](https://pbs.twimg.com/profile_banners/1550078321303625740/1685367141/1500x500)

Willkommen beim Bubatz Club Manager, einem Verwaltungstool für Cannabis Social Clubs (CSC) in Deutschland. Diese Plattform unterstützt Clubs bei der Verwaltung ihrer Mitglieder, Finanzen, Cannabisproduktion und Pflanzenmanagement unter Berücksichtigung der gesetzlichen Anforderungen.

## Zweck

Der Bubatz Club Manager ist eine Software-as-a-Service (SaaS) Plattform, die speziell für CSCs entwickelt wurde. Sie vereinfacht administrative Aufgaben und ermöglicht es den Clubs, sich auf ihre Kernaktivitäten zu konzentrieren. Zu den wichtigsten Funktionen gehören Mitgliederverwaltung, Finanzverfolgung, automatisierte Berichte und Compliance-Dokumentation.

## Technologie-Stack

- **Next.js 14**: Für den Aufbau einer schnellen, modernen Webanwendung.
- **Supabase**: Als Backend-Datenbank mit Echtzeit-Funktionen.
- **Tailwind CSS**: Für ein schlankes, responsives Design.
- **shadcn**: Zur Verbesserung der Benutzeroberfläche mit interaktiven Komponenten.
- **Zod**: Zur Gewährleistung der Datenvalidierung und Typsicherheit.
- **Drizzle ORM**: Vereinfachung der Datenbankinteraktionen.

## Einrichtungsanleitung

1. Klonen Sie das Repository und installieren Sie die Abhängigkeiten:

   ```
   git clone https://github.com/yourusername/bubatz-club.git
   cd bubatz-club
   npm install
   ```

2. Richten Sie eine PostgreSQL-Datenbank ein.

3. Erstellen Sie eine `.env`-Datei im Hauptverzeichnis des Projekts und fügen Sie die folgende Zeile hinzu:

   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
   ```

   Ersetzen Sie `username`, `password`, `localhost`, `5432` und `your_database_name` durch Ihre spezifischen Datenbankdetails.

4. Führen Sie die Datenbankmigrationen aus:

   ```
   npm run db:generate
   npm run db:migrate
   ```

5. Starten Sie den Entwicklungsserver:
   ```
   npm run dev
   ```

## Architektur

Die Anwendung folgt einer dreischichtigen Architektur, inspiriert von Clean Architecture-Prinzipien:

1. Präsentationsschicht (UI)
2. Domänenschicht (Use Cases)
3. Datenzugriffsschicht

## Projektstruktur

```
/src
  /app
      /(auth)
        /signin
        /signup
      /(dashboard)
        /members
        /sales
        /plants
          /batches
          /strains
      /about
      /features
      /pricing
      /faq
      /docs
      /blog
      layout.tsx
      page.tsx
  /modules
    /members
      /data-access
        schema.ts
        index.ts
      /use-cases
        index.ts
    /plants
      /data-access
      /use-cases
    /sales
      /data-access
      /use-cases
  /components
  /lib
  /config
    site.ts
```

## Hauptkomponenten

### Site-Konfiguration

Befindet sich in `/config/site.ts` und definiert allgemeine Anwendungseinstellungen:

```typescript
export const siteConfig = {
  name: 'Bubatz Manager',
  description: '.',
  auth: {
    providers: {
      emailPassword: true,
      phoneNumber: false,
      emailLink: false,
      emailOtp: false,
      oAuth: ['google', 'github'] as Provider[],
    },
  },
  links: {
    signIn: '/signin',
    signUp: '/signup',
    signOut: '/',
    members: {
      index: '/members',
      new: '/members/new',
      detail: '/members/:id',
      edit: '/members/:id/edit',
    },
    sales: {
      index: '/sales',
      new: '/sales/new',
      detail: '/sales/:id',
    },
    plants: {
      index: '/plants',
      batches: {
        index: '/plants/batches',
        detail: '/plants/batches/:id',
        new: '/plants/batches/new',
      },
      strains: {
        new: '/plants/strains/new',
        detail: '/plants/strains/:id',
        edit: '/plants/strains/:id/edit',
      },
    },
  },
  url: 'https://bubatz.club',
  // ... weitere Konfigurationen
}
```

### Datenmodelle (Schema)

Befinden sich in `/modules/{domain}/data-access/schema.ts`

Beispiel:

```typescript
export const memberRoleEnum = pgEnum('member_role', ['MEMBER', 'ADMIN'])
export const paymentStatusEnum = pgEnum('payment_status', [
  'PAID',
  'PENDING',
  'OVERDUE',
])

export const members = protectedSchema.table('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  // ... weitere Felder
})
```

### Datenzugriffsschicht

Befindet sich in `/modules/{domain}/data-access/index.ts`

Verantwortlich für Datenbankoperationen:

```typescript
const getMembers = async () => {
  const allMembers = await db.select().from(members)
  return allMembers
}

export const createMember = async (input: AddMemberInput) => {
  // ... Implementierung
}
```

### Use Cases

Befinden sich in `/modules/{domain}/use-cases/index.ts`

Definieren Geschäftslogik und Aktionen:

```typescript
export const addMemberUseCase = actionClient
  .schema(addMemberInputSchema)
  .action(async ({ parsedInput }) => {
    // ... Implementierung
  })
```

### Client-Komponenten

Nutzen Use Cases und handhaben UI-Interaktionen:

```typescript
export default function NewMemberForm() {
  const { execute, status } = useAction(addMemberUseCase, {
    onSuccess: ({ data }) => {
      // ... Erfolg behandeln
    },
    onError: (error) => {
      // ... Fehler behandeln
    },
  })
  // ... Formular-Implementierung
}
```

## Authentifizierung und Autorisierung

- Implementierung von Benutzerrollen (MEMBER, ADMIN)
- Sicherung von Routen basierend auf Benutzerrollen
- E-Mail- und Passwort-Authentifizierung

## Mehrsprachige Unterstützung

Verwendung von next-intl zur Bereitstellung mehrsprachiger Unterstützung, mit Fokus auf Deutsch und Englisch.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz für persönliche, pädagogische und nicht-kommerzielle Nutzung lizenziert.

Für kommerzielle Nutzung kontaktieren Sie uns bitte, um eine kommerzielle Lizenz zu erwerben.

## Kontakt

Für Unterstützung, Feature-Anfragen oder Hilfe beim Datenimport kontaktieren Sie uns unter [contact@bubatz.club](mailto:contact@bubatz.club).
Treten Sie meinem persönlichen Discord bei, wenn Sie möchten: https://discord.gg/2wSR6GPgB5

Beste Grüße - Johannes Hayer
