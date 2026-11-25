# HIJRA — PHASE 04
## SHALAT SUNNAH TRACKER IMPLEMENTATION

Act as a Senior React Native Developer, Mobile Application Architect, SQLite Database Engineer, and UI/UX Engineer.

Implement Phase 04 of the existing Hijra mobile application based on the approved Development Brief and Business Requirements prepared by Alissa.

Phase 01, Phase 02, and Phase 03 have been completed.

This is an incremental development task, not a new project initialization.

Perform the actual implementation directly in the existing workspace.

# 1. PROJECT BASELINE

Application Name: Hijra

Developer: Kalin Digital Studio

Tagline: Every day, a better journey.

Release: 1.0 — Ibadah Planner & Tracker

Development Status:

- Phase 01 — Application Foundation: DONE
- Phase 02 — Onboarding & User Profile: DONE
- Phase 03 — Shalat Wajib Tracker: DONE
- Phase 04 — Shalat Sunnah Tracker: APPROVED

Technology Stack:

- React Native
- Expo
- TypeScript
- Expo Router
- SQLite using expo-sqlite
- Zustand
- i18next
- react-i18next
- Existing centralized design system
- Existing approved icon library
- Offline-first architecture

Target platforms:

- Android
- iOS

Development testing:

- Expo Go

Supported languages:

- Indonesian (id): Default and fallback.
- English (en): Secondary language.

Supported themes:

- Light
- Dark
- System

Development methodology:

Agile and Iterative Development.

Formal Product Owner UAT will be conducted during Phase 12.

# 2. PRE-IMPLEMENTATION ASSESSMENT

Before modifying any files:

1. Inspect the existing repository structure.
2. Execute git status.
3. Identify existing uncommitted changes.
4. Read the existing project documentation.
5. Inspect package.json and the lockfile.
6. Identify the actual Expo SDK version.
7. Inspect existing Expo Router navigation.
8. Inspect SQLite initialization and migration history.
9. Inspect user_profiles.
10. Inspect app_settings.
11. Inspect ibadah_categories.
12. Inspect ibadah_types.
13. Inspect prayer_logs.
14. Identify existing Sunnah prayer master records.
15. Inspect Phase 03 repository implementations.
16. Inspect Phase 03 auto-save and concurrency protection.
17. Inspect existing local date utilities.
18. Inspect weekly period calculation helpers.
19. Inspect Dashboard and Tracker screens.
20. Inspect reusable prayer components.
21. Inspect existing localization namespaces.
22. Inspect existing centralized theme tokens.
23. Read docs/LICENSING_POLICY.md.
24. Read docs/THIRD_PARTY_LICENSES.md.
25. Read docs/UI_UX_GUIDELINES.md if available.

Prepare a concise implementation plan and proceed with actual development.

Do not stop after producing the implementation plan.

Preserve existing working code and Product Owner changes.

Do not execute destructive Git commands.

Do not automatically commit or push to GitHub.

Do not upgrade or downgrade Expo SDK without explicit approval.

# 3. DEVELOPMENT OBJECTIVES

Implement:

- Built-in Sunnah prayer catalog.
- Personalized activity selection.
- Default activity preferences.
- Activity activation and deactivation.
- Activity sort order.
- Custom Sunnah activities.
- Daily Sunnah Prayer Tracker.
- Quick completion checklist.
- Multiple prayer sessions.
- Optional rakaat recording.
- Optional prayer time.
- Optional private notes.
- Individual session editing.
- Individual session deletion.
- Historical date navigation.
- Automatic SQLite persistence.
- Daily summary.
- Weekly summary.
- Weekly activity matrix.
- Activity breakdown visualization.
- Dashboard integration.
- Future Goals measurement foundation.
- Non-destructive database migration.
- Bilingual UI.
- Light and Dark Mode.
- Development testing and regression verification.

# 4. MANDATORY ARCHITECTURE RULES

Follow the existing project architecture.

Requirements:

- SQLite remains the persistent source of truth.
- Zustand is used for runtime state where appropriate.
- All database operations use repository layers.
- Business calculations use centralized services.
- Screen components must not execute SQL directly.
- Use parameterized queries.
- Use TypeScript strict mode.
- Avoid unnecessary use of any.
- Reuse existing UI components.
- Reuse existing date utilities.
- Reuse existing theme tokens.
- Reuse Phase 03 patterns where appropriate.
- Preserve offline functionality.
- Do not introduce an external backend.
- Do not introduce unnecessary dependencies.
- Do not perform unrelated refactoring.

Do not modify Shalat Wajib transaction behavior.

Shalat Wajib and Shalat Sunnah have different transaction models and must remain logically separated.

# 5. POSITIVE HABIT TRACKING CONCEPT

Sunnah prayer tracking must not behave like obligatory prayer tracking.

Do not implement:

- MISSED status.
- EXEMPT status.
- Failure percentages.
- Daily obligation denominators.
- Negative achievement indicators.
- Spiritual scores.
- Automatic penalties.

An activity is recorded when at least one session exists for the selected date.

An activity without a session is simply not logged.

Do not assume that the user did not perform the prayer merely because no record exists.

Do not display progress such as 3/5 based on the number of enabled Sunnah activities.

Personal goal achievement will be implemented in Phase 07.

# 6. PROPOSED MODULE STRUCTURE

Extend the existing modular architecture.

Suggested structure:

```text
app/
├── (tabs)/
│   ├── index.tsx
│   ├── tracker.tsx
│   ├── goals.tsx
│   ├── reports.tsx
│   └── profile.tsx
└── sunnah/
    ├── index.tsx
    ├── activities.tsx
    └── history.tsx

src/
├── features/
│   └── sunnah/
│       ├── components/
│       │   ├── SunnahActivityCard.tsx
│       │   ├── SunnahDailySummary.tsx
│       │   ├── SunnahSessionForm.tsx
│       │   ├── SunnahSessionList.tsx
│       │   ├── SunnahActivitySelector.tsx
│       │   ├── CustomSunnahActivityForm.tsx
│       │   ├── SunnahWeeklySummary.tsx
│       │   ├── SunnahHistoryMatrix.tsx
│       │   └── SunnahActivityChart.tsx
│       ├── screens/
│       │   ├── DailySunnahScreen.tsx
│       │   ├── ManageSunnahActivitiesScreen.tsx
│       │   └── SunnahHistoryScreen.tsx
│       ├── hooks/
│       ├── services/
│       ├── constants/
│       └── types/
├── database/
│   ├── migrations/
│   └── repositories/
│       ├── sunnah.repository.ts
│       └── sunnah-preferences.repository.ts
├── stores/
├── locales/
│   ├── id/
│   └── en/
└── utils/
```

This structure is a proposal.

Adapt it to actual existing project conventions.

Do not create duplicate repositories, stores, routes, date utilities, or generic UI components.

Keep route files lightweight.

# 7. MASTER DATA SHALAT SUNNAH

Inspect the existing ibadah_types records before adding master data.

The approved Sunnah prayer catalog contains:

| Indonesian | English |
|---|---|
| Tahajud | Tahajjud |
| Witir | Witr |
| Dhuha | Duha |
| Qabliyah Subuh | Before Fajr |
| Qabliyah Dzuhur | Before Dhuhr |
| Ba'diyah Dzuhur | After Dhuhr |
| Qabliyah Ashar | Before Asr |
| Qabliyah Maghrib | Before Maghrib |
| Ba'diyah Maghrib | After Maghrib |
| Qabliyah Isya | Before Isha |
| Ba'diyah Isya | After Isha |
| Tahiyatul Masjid | Mosque Greeting Prayer |
| Istikharah | Istikhara |
| Hajat | Hajat Prayer |
| Taubat | Repentance Prayer |
| Tarawih | Tarawih |
| Sunnah Wudhu | Ablution Prayer |

Requirements:

- Reuse existing master data IDs.
- Preserve existing master data codes.
- Reuse existing Sunnah prayer category.
- Add missing approved master records only.
- Use stable activity identifiers.
- Use localized built-in activity labels.
- Prevent duplicate master data.
- Preserve existing obligatory prayer master records.
- Preserve unrelated Quran and Dhikr master data.

Do not delete existing valid master records.

If an existing generic Rawatib activity exists, preserve its ID and references.

Do not silently replace historical or existing references when introducing separate Qabliyah and Ba'diyah activities.

The catalog is provided for personal tracking purposes, not as a religious classification or determination of prayer validity.

# 8. DEFAULT ACTIVITY PREFERENCES

Initialize the following five activities as active for a local profile using the Sunnah module for the first time:

1. Tahajud
2. Witir
3. Dhuha
4. Qabliyah Subuh
5. Ba'diyah Dzuhur

Use the approved order.

Requirements:

- Initialize default preferences only once.
- Use a persistent initialization marker.
- Scope initialization to the local profile.
- Save preferences and initialization marker atomically where appropriate.
- Do not recreate deleted or disabled preferences automatically.
- Do not overwrite existing sort order.
- Do not activate additional activities without user action.
- Do not interpret an empty active list as an uninitialized profile.

If all activities are disabled, show an empty state with a Manage Activities action.

Default preferences must not generate prayer session records.

# 9. DATABASE MIGRATION

Database filename:

```text
hijrah.db
```

Use the existing SQLite database.

Inspect actual migration history.

Determine the next migration version.

Do not assume that Phase 04 corresponds to database migration version 4.

Create the following transaction and preference tables:

- user_sunnah_preferences
- sunnah_prayer_logs

Extend ibadah_types only if required for custom activity support.

## 9.1 Table: user_sunnah_preferences

Proposed SQL:

```sql
CREATE TABLE user_sunnah_preferences (
    id TEXT PRIMARY KEY NOT NULL,

    user_id TEXT NOT NULL,
    ibadah_type_id INTEGER NOT NULL,

    is_active INTEGER NOT NULL DEFAULT 1
        CHECK (is_active IN (0, 1)),

    sort_order INTEGER NOT NULL DEFAULT 0,

    default_rakaat INTEGER DEFAULT NULL
        CHECK (
            default_rakaat IS NULL
            OR (
                typeof(default_rakaat) = 'integer'
                AND default_rakaat > 0
            )
        ),

    created_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES user_profiles(id),

    FOREIGN KEY (ibadah_type_id)
        REFERENCES ibadah_types(id),

    UNIQUE (user_id, ibadah_type_id)
);
```

Requirements:

- One preference record per user and activity.
- Preserve activity sort order.
- Support nullable default rakaat.
- Support activation and deactivation.
- Preserve user-specific settings.
- Do not delete session records when preferences change.

## 9.2 Table: sunnah_prayer_logs

Each record represents one recorded prayer session.

Proposed SQL:

```sql
CREATE TABLE sunnah_prayer_logs (
    id TEXT PRIMARY KEY NOT NULL,

    user_id TEXT NOT NULL,
    ibadah_type_id INTEGER NOT NULL,

    prayer_date TEXT NOT NULL,
    prayer_time TEXT DEFAULT NULL,

    rakaat INTEGER DEFAULT NULL
        CHECK (
            rakaat IS NULL
            OR (
                typeof(rakaat) = 'integer'
                AND rakaat > 0
            )
        ),

    notes TEXT DEFAULT NULL,

    created_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES user_profiles(id),

    FOREIGN KEY (ibadah_type_id)
        REFERENCES ibadah_types(id)
);

CREATE INDEX idx_sunnah_logs_user_date
ON sunnah_prayer_logs (
    user_id,
    prayer_date
);

CREATE INDEX idx_sunnah_logs_user_type_date
ON sunnah_prayer_logs (
    user_id,
    ibadah_type_id,
    prayer_date
);
```

IMPORTANT:

Do not create a unique constraint on:

```text
user_id + ibadah_type_id + prayer_date
```

Multiple sessions for the same activity and date must be supported.

Every session must have its own stable unique ID.

Do not introduce COMPLETED, MISSED, or EXEMPT columns into this table.

The existence of a session record represents a recorded activity.

## 9.3 Actual Schema Compatibility

Adapt foreign key types to the actual existing database.

For example, do not assume ibadah_types.id is INTEGER if the existing schema uses TEXT.

The SQL examples define the approved logical model, not a mandatory replacement for existing conventions.

## 9.4 Migration Safety

- Non-destructive migrations.
- Versioned migrations.
- Transactional migrations where appropriate.
- Enable foreign key enforcement.
- Preserve Phase 01–03 data.
- Preserve prayer_logs.
- Preserve existing profile data.
- Preserve existing settings.
- Preserve master records.
- Preserve migration history.
- Do not reset the database.
- Do not seed fictional worship records.
- Failed migrations must not advance migration version.

# 10. CUSTOM MASTER DATA SUPPORT

If ibadah_types does not already support custom activities, extend the existing master structure using compatible fields.

Suggested logical fields:

| Field | Purpose |
|---|---|
| is_custom | Distinguish custom and built-in activity |
| owner_user_id | Local profile ownership |
| custom_name | User-defined activity name |
| custom_description | Optional user-defined description |

Requirements:

- Built-in records remain globally available.
- Custom records belong to the creating profile.
- Custom records use stable IDs and stable codes.
- Custom names remain independent of activity codes.
- Custom activities must belong to the Sunnah category.
- Built-in records must remain unchanged.
- Custom activities must not interfere with obligatory prayer queries.
- Do not introduce global master changes that break Phase 03.

If the existing master architecture already supports these requirements, reuse it.

Ensure custom records do not require fabricated translation keys.

Built-in activity names use localization keys.

Custom activity names use stored user-generated text.

# 11. TYPESCRIPT DOMAIN MODELS

Create strongly typed domain models.

Suggested types:

```typescript
export interface SunnahActivityPreference {
  id: string;
  userId: string;
  ibadahTypeId: number;
  isActive: boolean;
  sortOrder: number;
  defaultRakaat: number | null;
  createdAt: string;
  updatedAt: string;
}
```

```typescript
export interface SunnahPrayerSession {
  id: string;
  userId: string;
  ibadahTypeId: number;
  prayerDate: string;
  prayerTime: string | null;
  rakaat: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
```

```typescript
export interface SunnahActivityViewModel {
  activityId: number;
  activityCode: string;
  displayName: string;
  isCustom: boolean;
  isActive: boolean;
  sortOrder: number;
  defaultRakaat: number | null;
  sessions: SunnahPrayerSession[];
  sessionCount: number;
  recordedRakaat: number | null;
  isRecorded: boolean;
}
```

Adapt ID types to the actual master schema.

Use centralized database-to-domain mapping.

Preserve the difference between NULL and zero.

# 12. REPOSITORY IMPLEMENTATION

Create or extend dedicated repositories.

Suggested preference operations:

```typescript
getSunnahActivities(userId)

getSunnahPreferences(userId)

initializeDefaultPreferences(userId)

saveSunnahPreferences(userId, preferences)

updateActivityPreference(input)

createCustomSunnahActivity(input)

updateCustomSunnahActivity(input)

deactivateCustomSunnahActivity(input)
```

Suggested session operations:

```typescript
getSunnahSessionsByDate(userId, date)

getSunnahSessionsByDateRange(
  userId,
  startDate,
  endDate
)

getSunnahSessionsByActivity(
  userId,
  activityId,
  startDate,
  endDate
)

getSunnahSessionById(userId, sessionId)

createSunnahSession(input)

updateSunnahSession(input)

deleteSunnahSession(userId, sessionId)
```

Requirements:

- Parameterized SQL.
- User-scoped queries.
- Stable session IDs.
- Category validation.
- Custom activity ownership validation.
- Date validation.
- Positive integer rakaat validation.
- Preserve original created_at during update.
- Update updated_at on actual modifications.
- Avoid SQL in screen components.

Do not use a generic upsert by activity and date for detailed Sunnah sessions.

An intentional new session must create a separate record.

Updating a session must target its individual ID.

# 13. DAILY SUNNAH TRACKER

Create Daily Sunnah Prayer Tracker.

Indonesian:

Shalat Sunnah

English:

Sunnah Prayers

## 13.1 Screen Structure

Required order:

1. Screen header.
2. Date navigation.
3. Daily summary card.
4. My Activities section.
5. Personalized activity cards.
6. Manage Activities shortcut.
7. Privacy information.

Provide History and Manage Activities access using the existing navigation patterns.

## 13.2 Visual Reference

```text
┌──────────────────────────────────┐
│ ←  Shalat Sunnah          ⚙     │
├──────────────────────────────────┤
│ ‹       Rabu, 25 November      › │
│             Hari ini             │
├──────────────────────────────────┤
│ Ibadah sunnah hari ini           │
│                                  │
│ 3 aktivitas                      │
│                                  │
│ 3 Jenis     4 Sesi     11 Rakaat │
├──────────────────────────────────┤
│ IBADAH PILIHANKU          Atur   │
├──────────────────────────────────┤
│ MoonStar  Tahajud      ☑    ⋯    │
│           1 sesi · 2 rakaat      │
├──────────────────────────────────┤
│ Moon      Witir        ☑    ⋯    │
│           1 sesi · 3 rakaat      │
├──────────────────────────────────┤
│ Sun       Dhuha        ☑    ⋯    │
│           2 sesi · 6 rakaat      │
├──────────────────────────────────┤
│ Sunrise   Qabliyah Subuh ☐   ⋯   │
│           Belum dicatat          │
├──────────────────────────────────┤
│ Sun       Ba'diyah Dzuhur ☐  ⋯   │
│           Belum dicatat          │
├──────────────────────────────────┤
│ + Tambah pilihan shalat sunnah   │
└──────────────────────────────────┘
```

Example values are illustrative.

Actual UI must display actual persisted data.

Do not use literal text glyphs as replacements for production icons.

## 13.3 Activity Visibility

The daily list must include:

- Currently active activities.
- Inactive activities with existing sessions on the selected date.

Use current preferences to determine active activity ordering.

Place inactive recorded activities in a clearly identified section or equivalent compact presentation.

If an inactive activity has no recorded sessions for the selected date, it must not appear as a new quick recording option.

# 14. SUNNAH ACTIVITY CARD

Implement a reusable activity card.

Required content:

- Activity icon.
- Localized activity name.
- Current recording state.
- Session count.
- Recorded rakaat information.
- Completion checkbox.
- Additional action menu.

Visual examples:

```text
Tahajud
1 sesi · 2 rakaat tercatat
```

```text
Dhuha
2 sesi · 6 rakaat tercatat
```

```text
Witir
1 sesi · Rakaat belum diisi
```

```text
Istikharah
Belum dicatat
```

For partially specified rakaat totals, use an accurate label indicating recorded rakaat.

Do not imply that a partial rakaat sum represents the complete number performed.

Use compact cards consistent with Shalat Wajib Tracker.

# 15. QUICK COMPLETION CHECKLIST

Quick Checklist is the primary recording interaction.

## 15.1 Check Activity

If no session exists for the selected activity and date:

1. Validate the local profile.
2. Validate activity eligibility.
3. Validate selected date.
4. Create one session.
5. Set rakaat to NULL.
6. Set prayer_time to NULL.
7. Set notes to NULL.
8. Persist to SQLite.
9. Refresh activity state.
10. Refresh summaries.

Do not automatically use default rakaat as an actual recorded value.

Do not automatically assign the current clock time as prayer_time.

## 15.2 Idempotent Quick Recording

Quick recording must not create duplicate sessions.

If one or more sessions already exist for that activity and date, checking the activity again must not create another session.

Implement a serialized or transactional check-and-create operation.

Do not rely solely on UI button disabling.

Do not introduce a unique activity/date database constraint because legitimate multiple sessions must remain supported.

## 15.3 Uncheck Activity

If exactly one session exists:

- Allow removal as a recording correction.
- If the session contains rakaat, prayer time, or notes, request confirmation.
- Remove only that individual session.
- Refresh all affected summaries.

If more than one session exists:

- Do not delete all sessions.
- Open session management or provide an explicit session selection action.
- Allow users to correct individual sessions.

If no session remains after correction:

- Activity becomes unchecked.
- Display Not logged.

## 15.4 Inactive Activity Correction

Existing sessions belonging to inactive activities remain editable and removable.

Creating a new session for an inactive activity requires the user to reactivate that activity.

Do not silently reactivate activities during historical corrections.

# 16. MULTIPLE SESSION MANAGEMENT

Implement individual session management.

Example:

```text
Dhuha

Session 1
2 rakaat
08:15

Session 2
4 rakaat
10:20
```

Supported actions:

- Add session.
- Edit session.
- Delete session.
- View session details.

Requirements:

- Every session has a stable ID.
- Session numbering is for display only.
- Session numbering must not be used as a primary key.
- Use deterministic display ordering.
- Prevent duplicate submissions.
- Preserve intentional multiple sessions.
- Do not delete unrelated records.
- Refresh Daily and Weekly summaries after successful modifications.

A session with the same activity, date, and rakaat as another session may be legitimate.

Do not reject valid intentional sessions solely because their contents match.

# 17. SESSION DETAIL FORM

Implement a compact modal, bottom sheet, or existing compatible form screen.

Required fields:

| Field | Required |
|---|---|
| Activity | Yes, context provided |
| Date | Yes, context provided |
| Rakaat | No |
| Prayer time | No |
| Notes | No |

Required actions:

- Save.
- Cancel.
- Delete session when editing an existing session.

Requirements:

- Context must clearly identify activity and selected date.
- New session mode creates a new session ID.
- Edit mode preserves the existing session ID.
- Save must be idempotent for a single submission intent.
- Cancel must not persist unfinished changes.
- Delete must target the individual session.
- Use localized validation and confirmation messages.

Use the existing form components.

Do not introduce unnecessary form libraries.

# 18. OPTIONAL RAKAAT RECORDING

Rakaat values:

- Positive integer.
- NULL.

Reject:

- Zero.
- Negative values.
- Decimal values.
- Non-numeric input.
- Values exceeding safe supported integer limits.

Requirements:

- Rakaat is optional.
- Support clearing the value back to NULL.
- Use a numeric input or compact stepper.
- Do not enforce even-number-only validation.
- Do not impose prayer-specific religious limits.
- Do not interpret missing rakaat as zero performed.
- Use a documented technical input bound where needed.

## 18.1 Default Rakaat Suggestion

Read default_rakaat from activity preferences.

When opening a new detailed session:

- The value may prefill the rakaat input.
- The user can modify it.
- The user can clear it.
- It becomes actual recorded rakaat only after the session is saved.

When using Quick Checklist:

- Always initialize rakaat as NULL.

When editing an existing session:

- Load the actual saved rakaat.
- Do not replace it with the current default preference.

# 19. OPTIONAL PRAYER TIME

Store optional local prayer time using:

```text
HH:mm
```

Examples:

```text
04:15
08:30
21:45
```

Requirements:

- Validate hours and minutes.
- Allow NULL.
- Allow editing and clearing.
- Do not require external prayer schedules.
- Do not perform automatic on-time validation.
- Do not automatically use created_at as prayer_time.
- Do not change prayer_date based on prayer_time.

For night prayers, use the local calendar date explicitly selected by the user.

Do not shift dates using assumptions about religious day boundaries.

Use localized time formatting for presentation where appropriate.

# 20. PRIVATE NOTES

Notes are optional per session.

Requirements:

- Support create, edit, and remove.
- Use reasonable documented input length limits.
- Preserve user-generated content.
- Store empty notes as NULL where consistent with the existing project.
- Do not automatically translate notes.
- Do not display notes on Dashboard.
- Do not expose notes in development logs.
- Do not include notes in external telemetry.
- Notes must not affect summary calculations.

Use explicit Save and Cancel.

# 21. MANAGE ACTIVITIES SCREEN

Indonesian:

Atur Aktivitas

English:

Manage Activities

Required capabilities:

- Enable activities.
- Disable activities.
- Reorder activities.
- Configure default rakaat.
- Add custom activities.
- Edit custom activities.
- Deactivate custom activities.

Use grouped catalog sections:

- Sunnah Prayers.
- Before and After Obligatory Prayers.
- Custom Activities.

Grouping is for application navigation, not religious classification.

## 21.1 Visual Reference

```text
┌──────────────────────────────────┐
│ ← Atur Aktivitas                 │
├──────────────────────────────────┤
│ Pilih shalat sunnah yang ingin   │
│ kamu catat dalam keseharianmu.   │
├──────────────────────────────────┤
│ SHALAT SUNNAH                    │
│ Tahajud                    ON    │
│ Witir                      ON    │
│ Dhuha                      ON    │
│ Istikharah                 OFF   │
│ Hajat                      OFF   │
│ Taubat                     OFF   │
│ Tarawih                    OFF   │
├──────────────────────────────────┤
│ SEBELUM & SESUDAH SHALAT WAJIB   │
│ Qabliyah Subuh             ON    │
│ Qabliyah Dzuhur            OFF   │
│ Ba'diyah Dzuhur            ON    │
├──────────────────────────────────┤
│ CUSTOM ACTIVITIES                │
│ + Tambah Shalat Custom          │
├──────────────────────────────────┤
│       Simpan Preferensi          │
└──────────────────────────────────┘
```

Use compact settings rows.

Avoid oversized individual cards.

Provide accessible switches and controls.

## 21.2 Preference Saving

Use draft state while editing preferences.

On Save:

- Validate all changes.
- Persist preference updates consistently.
- Use a transaction for multiple related changes.
- Refresh runtime preferences.
- Refresh Daily Tracker.

On Cancel:

- Discard unsaved changes.
- Preserve existing preferences.

When custom activity creation or editing is integrated into this screen, ensure its save behavior is clear and consistent.

Do not silently persist custom changes while presenting them as cancelled.

# 22. ACTIVITY SORT ORDER

Support changing the display order of active activities.

Prefer existing compatible UI components.

A simple move-up and move-down control is acceptable.

Do not install a drag-and-drop dependency solely for activity ordering if equivalent functionality is already available.

Requirements:

- Persist sort_order.
- Preserve order after restart.
- Preserve order when changing language.
- Do not modify historical records.
- Use deterministic ordering for activities with equal sort values.

When activating a new activity, append it to a reasonable default position.

# 23. CUSTOM SUNNAH ACTIVITIES

Implement local user-defined activities.

Required fields:

- Activity name.
- Optional description.
- Optional default rakaat.
- Active status.
- Sort order.

Use a default approved icon for custom activities.

## 23.1 Custom Activity Creation

Requirements:

- Validate non-empty name.
- Trim surrounding whitespace.
- Support Unicode text.
- Use documented maximum name length.
- Prevent duplicate custom names for the same profile.
- Compare normalized names against built-in activity labels in both supported languages.
- Generate a stable custom activity ID and code.
- Associate the custom record with the local profile.
- Associate the record with the Sunnah category.
- Create its preference record.
- Use an atomic transaction for master and preference creation.

Custom activity must become available only after successful persistence.

## 23.2 Custom Activity Editing

Allow editing:

- Name.
- Description.
- Default rakaat.
- Active status.
- Sort order.

Preserve:

- Activity ID.
- Stable activity code.
- Owner profile.
- Existing session references.

Updating an activity name must not create a separate master record.

## 23.3 Custom Activity Deactivation

Use deactivation or archive semantics.

Do not permanently delete custom activities with historical session records.

Preserve all historical associations.

Do not cascade delete existing sessions.

For Phase 04, a deactivate-only approach is acceptable for all custom activities, including those without recorded sessions.

Do not introduce unnecessary permanent master deletion functionality.

## 23.4 Built-In Protection

Do not allow users to modify:

- Built-in master names.
- Built-in master codes.
- Built-in category association.
- Built-in ownership.

User preferences may configure visibility, display order, and default rakaat without modifying the built-in master record.

# 24. DATE HANDLING

Reuse Phase 03 local calendar date utilities.

Storage format:

```text
YYYY-MM-DD
```

Requirements:

- Default date is Today.
- Previous date navigation.
- Next date navigation.
- Date picker.
- Return to Today action.
- Historical recording permitted.
- Future recording prohibited.
- Invalid calendar dates rejected.
- Invalid route parameters handled safely.
- Date format follows active localization.
- Local midnight rollover supported.
- App resume refresh supported.

Do not use:

```typescript
new Date().toISOString().slice(0, 10)
```

for determining the local prayer date.

When switching dates during pending saves, ensure each operation remains associated with the date originally selected.

Do not apply save responses to the wrong daily screen.

# 25. AUTOMATIC SAVE AND CONCURRENCY

Reuse successful Phase 03 persistence patterns where appropriate.

Suggested service responsibilities:

```typescript
quickRecordActivity(input)

removeQuickSession(input)

createDetailedSession(input)

updateDetailedSession(input)

deleteIndividualSession(input)

saveActivityPreferences(input)
```

Requirements:

- Validate every mutation.
- Bind mutations to the original user, activity, date, and session ID.
- Prevent duplicate quick records.
- Prevent duplicate detail submissions.
- Prevent stale asynchronous responses.
- Preserve latest valid user intent.
- Preserve successful writes when unrelated writes fail.
- Refresh authoritative state after persistence.
- Do not execute updates against the wrong date.

For detailed session creation, use a stable session ID generated once per submission intent.

Retries of the same submission must not create additional records.

Intentional Add Session actions must generate independent IDs.

Use an appropriate combination of serialized mutations, transactional operations, and stable submission identifiers.

## 25.1 Error Handling

If persistence fails:

- Do not display the action as successfully saved.
- Show localized error feedback.
- Reconcile UI with actual database state.
- Preserve existing valid records.
- Allow retry.
- Do not reset or delete the database.

# 26. DAILY SUMMARY SERVICE

Implement a centralized Sunnah Summary Service.

Suggested domain model:

```typescript
export interface SunnahSummary {
  distinctActivities: number;
  totalSessions: number;
  activeDays: number;

  recordedRakaat: number | null;

  sessionsWithRakaat: number;
  sessionsWithoutRakaat: number;
}
```

Daily calculation:

```text
Distinct Activities =
COUNT DISTINCT ibadah_type_id

Total Sessions =
COUNT session records

Recorded Rakaat =
SUM non-NULL rakaat

Sessions With Rakaat =
COUNT non-NULL rakaat

Sessions Without Rakaat =
COUNT NULL rakaat
```

For an eligible date:

```text
Active Days =
1 if at least one session exists
0 otherwise
```

## 26.1 Calculation Example

Input:

```text
Tahajud: 1 session, 2 rakaat
Witir:   1 session, 3 rakaat
Dhuha:   2 sessions, 2 and 4 rakaat
```

Expected result:

```text
Distinct Activities: 3
Total Sessions: 4
Recorded Rakaat: 11
Active Days: 1
```

## 26.2 Unknown Rakaat Example

Input:

```text
Session 1: 2 rakaat
Session 2: NULL
Session 3: 4 rakaat
```

Expected result:

```text
Total Sessions: 3
Recorded Rakaat: 6
Sessions With Rakaat: 2
Sessions Without Rakaat: 1
```

If all session rakaat values are NULL:

- recordedRakaat must remain NULL.
- UI must display Not specified or equivalent.
- Do not display zero as the actual rakaat performed.

If no session exists, show a neutral empty state.

## 26.3 Summary Invariants

```text
Total Sessions =
Sessions With Rakaat + Sessions Without Rakaat
```

```text
Distinct Activities <= Total Sessions
```

```text
Active Days <= Total Sessions
```

Calculate from actual session records.

Do not use current active preferences as a filter for historical totals.

Do not persist derived summaries as authoritative transaction records.

# 27. DAILY SUMMARY UI

Use a compact Forest Green summary card.

Required indicators:

- Distinct recorded activities.
- Total recorded sessions.
- Recorded rakaat.

Example:

```text
Ibadah sunnah hari ini

3 aktivitas

3 Jenis Shalat
4 Total Sesi
11 Rakaat Tercatat
```

For historical dates, update the header to refer to the selected date rather than Today.

Use positive and neutral language.

Do not implement a completion progress ring based on active activity count.

Do not use red failure indicators.

# 28. WEEKLY HISTORY SERVICE

Reuse Phase 03 week_start and local date utilities.

Requirements:

- Seven calendar days per period.
- Previous and next week navigation.
- Return to Current Week action.
- Localized date range.
- Follow configured week_start.
- Do not allow recording on future dates.
- Future dates appear as disabled visual states.

Calculate weekly results using all valid session records within the selected date range.

Do not filter out sessions from currently inactive activities.

## 28.1 Weekly Indicators

- Distinct activities.
- Total sessions.
- Distinct active dates.
- Recorded rakaat.
- Sessions with rakaat.
- Sessions without rakaat.
- Sessions by activity.
- Active dates by activity.
- Recorded rakaat by activity.
- Daily session counts.

## 28.2 Weekly Calculation Example

```text
Tahajud:
5 active days, 5 sessions, 10 rakaat

Witir:
7 active days, 7 sessions, 21 rakaat

Dhuha:
6 active days, 8 sessions, 24 rakaat

Qabliyah Subuh:
6 active days, 6 sessions, 12 rakaat

Ba'diyah Dzuhur:
4 active days, 4 sessions, 8 rakaat
```

Expected totals:

```text
Distinct Activities: 5
Total Sessions: 30
Recorded Rakaat: 75
```

Active days must be calculated from the union of recorded calendar dates.

For this example, Witir was recorded on all seven days, so the total active days are seven.

Do not sum active days from individual activities.

# 29. SUNNAH PRAYER HISTORY SCREEN

Indonesian:

Riwayat Sunnah

English:

Sunnah Prayer History

Required layout:

1. Screen header.
2. Weekly period navigation.
3. Weekly summary card.
4. Activity session matrix.
5. Session count legend.
6. Activity breakdown visualization.

## 29.1 Weekly Summary Card

Display:

- Active days.
- Total sessions.
- Recorded rakaat.

Example:

```text
7 Hari Aktif
30 Total Sesi
75 Rakaat Tercatat
```

Use the approved Forest Green summary design.

## 29.2 Activity Session Matrix

Example:

```text
              Sen Sel Rab Kam Jum Sab Min

Tahajud        1   —   1   1   —   1   1
Witir          1   1   1   1   1   1   1
Dhuha          1   2   1   —   1   2   1
Q. Subuh       1   1   1   1   —   1   1
B. Dzuhur      —   1   1   —   1   —   1
```

Use actual numeric session counts.

Visual rules:

- Recorded: Soft green.
- Not logged: Neutral surface.
- Multiple sessions: Actual count.
- Future date: Disabled neutral state.

Do not use MISSED or EXEMPT status colors.

Requirements:

- Dynamic activity rows.
- Include active activities.
- Include inactive activities with records in the period.
- Support custom activity names.
- Support long names.
- Support localized weekdays.
- Support different week_start preferences.
- Use responsive sizing or controlled horizontal scrolling.
- Provide accessible cell labels.
- Allow eligible date selection.
- Open Daily Sunnah Tracker for the selected date.
- Disable future date selection.

Do not truncate essential information merely to fit all content on a narrow screen.

## 29.3 Activity Breakdown

Display sessions by activity using lightweight horizontal bars.

Example:

```text
Dhuha              8 sesi
Witir              7 sesi
Qabliyah Subuh     6 sesi
Tahajud            5 sesi
Ba'diyah Dzuhur    4 sesi
```

Requirements:

- Actual SQLite data.
- Deterministic ordering.
- Accessible labels.
- Support custom activity names.
- Support Light and Dark Mode.
- No fictional values.
- No unnecessary chart library.

Use existing React Native View components or existing approved chart support.

# 30. DASHBOARD INTEGRATION

Preserve the existing Dashboard and Shalat Wajib functionality.

Replace the Shalat Sunnah placeholder with an actual daily summary card.

Required content:

- Shalat Sunnah.
- Distinct activities recorded today.
- Total sessions recorded today.
- Recorded rakaat.
- Compact preview of recorded activity names.
- Navigation shortcut.

Visual reference:

```text
┌──────────────────────────────────┐
│ MoonStar  Shalat Sunnah       ›  │
│           Ibadah pilihan hari ini│
│                                  │
│ 3 Aktivitas  4 Sesi  11 Rakaat   │
│                                  │
│ ✓ Tahajud  ✓ Witir  ✓ Dhuha     │
└──────────────────────────────────┘
```

Requirements:

- Use actual data.
- Open Daily Sunnah Tracker when selected.
- Default selected date is Today.
- Refresh after successful changes affecting Today.
- Refresh when returning to Dashboard.
- Preserve accurate Shalat Wajib statistics.
- Do not mix obligatory and Sunnah session counts.
- Do not alter today's summary when editing an unrelated historical date.
- Display a neutral empty state when no sessions exist.
- Limit activity preview length to maintain compact Dashboard layout.

Do not display private notes.

Do not redesign unrelated Dashboard sections.

Preserve Quran and Dhikr placeholders until their respective phases.

# 31. TRACKER LANDING PAGE

Activate the existing Shalat Sunnah shortcut.

Requirements:

- Open Daily Sunnah Tracker.
- Default selected date is Today.
- Preserve Shalat Wajib Tracker.
- Preserve Quran shortcut.
- Preserve Dhikr shortcut.
- Preserve existing navigation.
- Preserve localized labels.
- Preserve bottom navigation.
- Ensure hardware Back behavior works.
- Avoid duplicate route definitions.

Do not implement Quran or Dhikr transactions.

# 32. FUTURE PERSONAL GOALS COMPATIBILITY

Prepare reusable measurement functions for Phase 07.

Supported measurement foundations:

```typescript
type SunnahMeasurement =
  | 'ACTIVE_DAYS'
  | 'SESSION_COUNT'
  | 'RAKAAT_COUNT';
```

Suggested aggregation operations:

```typescript
countActiveDaysByActivity(
  userId,
  activityId,
  startDate,
  endDate
)

countSessionsByActivity(
  userId,
  activityId,
  startDate,
  endDate
)

sumRecordedRakaatByActivity(
  userId,
  activityId,
  startDate,
  endDate
)
```

These functions may be implemented within existing repository or summary service conventions.

Examples:

- Dhuha five days per week.
- Tahajud three sessions per week.
- Witir every day.
- Dhuha twenty-eight recorded rakaat per week.
- Qabliyah Subuh seven days per week.

If Dhuha has two sessions on the same date:

```text
ACTIVE_DAYS = 1
SESSION_COUNT = 2
RAKAAT_COUNT = Sum of recorded rakaat
```

When rakaat is NULL, do not fabricate target progress.

Return sufficient information to distinguish incomplete rakaat data from actual known totals.

Support both built-in and custom activity IDs.

Do not implement goal creation, goal screens, recurring goals, or goal transaction tables during Phase 04.

# 33. STATE MANAGEMENT

Extend existing Zustand architecture only where justified.

Possible runtime state:

- Selected date.
- Current activity preferences.
- Daily activity view models.
- Session list.
- Pending mutations.
- Daily summary.
- Error state.
- Cache invalidation signals.

Requirements:

- SQLite remains authoritative.
- Do not persist duplicate session datasets in Zustand storage.
- Avoid duplicate global stores.
- Avoid stale selected date state.
- Refresh only affected summaries and screens where practical.
- Preserve successful records when unrelated operations fail.
- Avoid unnecessarily exposing private notes globally.

Reuse existing Phase 03 patterns where appropriate without coupling the two transaction models.

# 34. UI/UX IMPLEMENTATION REQUIREMENTS

Visual requirements are part of development acceptance criteria.

Follow the approved Phase 04 mockups prepared by Alissa.

Maintain consistency with Shalat Wajib Tracker.

Design direction:

- Modern Islamic.
- Premium.
- Compact.
- Calm.
- Minimalist.
- Clean.
- Consistent.

## 34.1 Visual Dimensions

Use React Native logical units.

| Component | Specification |
|---|---|
| Screen horizontal padding | 16–20 |
| Screen title | 24 |
| Activity title | 16 |
| Secondary text | 12–13 |
| Activity icon | 22–24 |
| Icon container | 38–40 |
| Card radius | 14–16 |
| Card padding | 12–16 |
| Card spacing | 8–12 |
| Touch target | Minimum 48 |
| Summary primary value | 26–32 |
| Section spacing | 16–20 |

These dimensions are design baselines.

Support accessibility and system font scaling.

Do not force fixed heights that clip content.

## 34.2 Color Palette

Use existing centralized theme tokens.

Light mode reference:

```text
Primary:        #174638
Secondary:      #769B87
Accent:         #C7A76C
Background:     #F7F8F3
Surface:        #FFFFFF
Text Primary:   #20312A
Text Secondary: #64748B
Border:         #E2E8E3
```

Use existing Dark Mode equivalents.

Do not create conflicting theme systems.

## 34.3 Suggested Activity Icons

| Activity | Icon |
|---|---|
| Tahajud | MoonStar |
| Witir | Moon |
| Dhuha | Sun |
| Qabliyah Subuh | Sunrise |
| Dzuhur-related prayers | Sun |
| Ashar-related prayers | CloudSun |
| Maghrib-related prayers | Sunset |
| Isya-related prayers | Moon |
| Tahiyatul Masjid | Landmark or existing equivalent |
| Sunnah Wudhu | Droplets |
| Custom activity | Heart or existing default |

Use the existing approved icon family.

Do not introduce another icon library.

## 34.4 Interaction Design

- One-tap Quick Checklist.
- Compact additional action menu.
- Simple session management.
- Clearly visible Manage Activities entry.
- Grouped configuration rows.
- Accessible switches.
- Consistent confirmations.
- No oversized forms.
- No excessive nested cards.
- No excessive bold font weights.
- No unnecessary animation dependencies.

## 34.5 Accessibility

- Screen reader labels.
- Accessible checkbox states.
- Accessible switch states.
- Adequate contrast.
- Minimum touch target sizes.
- Safe area support.
- Responsive layouts.
- System font scaling.
- Keyboard-aware forms.
- No horizontal overflow outside intentional scrollable matrices.

Follow docs/UI_UX_GUIDELINES.md if available.

# 35. LOCALIZATION

Preserve existing i18next architecture.

Add matching Indonesian and English translation keys.

Suggested namespaces:

```text
src/locales/id/sunnah.json
src/locales/en/sunnah.json
```

Adapt to existing conventions.

Required translation coverage:

| Indonesian | English |
|---|---|
| Shalat Sunnah | Sunnah Prayers |
| Riwayat Sunnah | Sunnah Prayer History |
| Atur Aktivitas | Manage Activities |
| Ibadah Pilihanku | My Activities |
| Tambah Aktivitas | Add Activity |
| Tambah Shalat Custom | Add Custom Prayer |
| Belum dicatat | Not logged |
| Tambah sesi | Add Session |
| Edit sesi | Edit Session |
| Hapus sesi | Delete Session |
| Jumlah rakaat | Rakaat count |
| Rakaat tercatat | Recorded rakaat |
| Rakaat belum diisi | Rakaat not specified |
| Rakaat default | Default rakaat |
| Waktu pelaksanaan | Prayer time |
| Catatan | Notes |
| Hari aktif | Active days |
| Total sesi | Total sessions |
| Aktif | Active |
| Nonaktif | Inactive |
| Simpan Preferensi | Save Preferences |
| Simpan | Save |
| Batal | Cancel |
| Hari ini | Today |
| Kemarin | Yesterday |
| Pekan ini | This week |

Also localize:

- Built-in master activity names.
- Empty states.
- Error messages.
- Validation messages.
- Confirmation messages.
- Date labels.
- Weekday labels.
- Accessibility labels.
- Save failure messages.
- Retry actions.

Indonesian remains default and fallback.

Do not hardcode user-facing UI strings.

Custom activity names, descriptions, and notes remain user-generated content.

# 36. PRIVACY REQUIREMENTS

All worship records must remain local.

Do not introduce:

- External user data APIs.
- Cloud storage.
- Remote analytics.
- Advertising SDKs.
- External telemetry.
- User tracking.
- GPS permissions.
- Notification permissions.

Do not expose private notes through logs or Dashboard.

Do not infer spiritual quality.

Do not compare worship activity between users.

Do not determine prayer validity.

The application records personal activities only.

# 37. MANDATORY LICENSING POLICY

Read and follow:

```text
docs/LICENSING_POLICY.md
docs/THIRD_PARTY_LICENSES.md
```

Prioritize existing dependencies.

All new dependencies and assets must:

- Be free to use.
- Permit commercial use.
- Permit required redistribution.
- Have verifiable licensing terms.
- Be compatible with the actual Expo SDK.
- Not require mandatory paid subscriptions.

Preferred licenses:

- MIT
- Apache-2.0
- BSD-2-Clause
- BSD-3-Clause
- ISC
- SIL Open Font License
- Verified CC0 or public domain

CC BY assets require appropriate attribution.

Review direct and transitive dependencies.

Preserve required copyright and license notices.

Do not introduce unapproved restricted-license components.

## 37.1 Existing MPL-2.0 Exception

Preserve the approved exception specifically for:

- Lightning CSS.
- Required Lightning CSS platform binaries.
- Expo/Metro build tooling.

Do not extend this exception to unrelated dependencies.

## 37.2 Dependency Restrictions

Do not introduce unnecessary:

- Drag-and-drop libraries.
- Chart frameworks.
- Form libraries.
- State management libraries.
- Date utility libraries.
- Icon packs.
- Animation libraries.

Reuse existing implementations wherever practical.

If a new dependency is necessary, verify compatibility and licensing first.

Update the third-party license inventory if dependencies or assets change.

# 38. BUSINESS RULES

BR-0401: Users can select Sunnah activities.

BR-0402: Five activities are active by default during first initialization.

BR-0403: Users can create custom activities.

BR-0404: Activities can be enabled and disabled.

BR-0405: Multiple sessions per activity and date are permitted.

BR-0406: Rakaat recording is optional.

BR-0407: Quick Checklist automatically persists.

BR-0408: Individual sessions can be corrected.

BR-0409: Historical recording is permitted.

BR-0410: Future recording is prohibited.

BR-0411: Sunnah tracking has no MISSED status.

BR-0412: Inactive activities retain historical records.

BR-0413: Prayer time and notes are optional.

BR-0414: Summaries use actual SQLite records.

BR-0415: Weekly periods follow week_start preferences.

BR-0416: Obligatory prayer data remains unaffected.

BR-0417: Custom names are not automatically translated.

BR-0418: Indonesian and English are supported.

BR-0419: Light, Dark, and System Mode are supported.

BR-0420: All functions work offline.

BR-0421: Mandatory licensing policy applies.

BR-0422: No Sunnah failure percentage is displayed.

BR-0423: NULL rakaat is not interpreted as zero performed.

BR-0424: Double taps must not create duplicate sessions.

BR-0425: Worship records remain private.

BR-0426: Default preferences initialize only once.

BR-0427: Custom activity renaming preserves its ID.

BR-0428: Built-in master records cannot be edited by users.

BR-0429: Unchecking multiple sessions must not delete all sessions.

BR-0430: Historical summaries are independent of current active preferences.

BR-0431: Default rakaat is a suggestion, not an actual recorded value.

BR-0432: Active days are calculated from distinct calendar dates.

BR-0433: Prayer dates use local calendar dates.

BR-0434: Failed persistence must not be displayed as successful.

BR-0435: Custom activities with history cannot be permanently deleted.

# 39. DEVELOPMENT TESTING

Follow the approved Agile methodology.

BUILD → TEST → FIX → RETEST.

Formal Product Owner UAT is deferred until Phase 12.

## 39.1 Functional Test Scenarios

| ID | Scenario | Expected Result |
|---|---|---|
| TEST-0401 | Open Sunnah Tracker | Screen opens |
| TEST-0402 | First initialization | Five default activities appear |
| TEST-0403 | Repeated initialization | Preferences remain unchanged |
| TEST-0404 | Enable activity | Activity becomes available |
| TEST-0405 | Disable activity | New recording option is hidden |
| TEST-0406 | Reactivate activity | Activity becomes available |
| TEST-0407 | Reorder activities | Order persists |
| TEST-0408 | Disable all activities | Neutral empty state appears |
| TEST-0409 | Create custom activity | Activity persists |
| TEST-0410 | Duplicate custom name | Validation prevents duplication |
| TEST-0411 | Edit custom activity | Stable ID is preserved |
| TEST-0412 | Deactivate custom activity | History remains |
| TEST-0413 | Quick Checklist | One session is created |
| TEST-0414 | Quick Checklist double tap | No duplicate session |
| TEST-0415 | Quick record with existing session | No additional session |
| TEST-0416 | Uncheck single session | Selected session removed |
| TEST-0417 | Uncheck detailed session | Confirmation appears |
| TEST-0418 | Uncheck multiple sessions | Sessions remain intact |
| TEST-0419 | Add multiple sessions | Individual records persist |
| TEST-0420 | Save double tap | Single intended session created |
| TEST-0421 | Retry same submission | No duplicate session |
| TEST-0422 | Edit session | Correct session updates |
| TEST-0423 | Delete session | Other sessions preserved |
| TEST-0424 | Record rakaat | Positive integer persists |
| TEST-0425 | Leave rakaat empty | NULL persists |
| TEST-0426 | Clear existing rakaat | NULL persists |
| TEST-0427 | Zero or negative rakaat | Validation rejects input |
| TEST-0428 | Decimal rakaat | Validation rejects input |
| TEST-0429 | Default rakaat | Detailed form suggestion works |
| TEST-0430 | Quick recording with default rakaat | Actual rakaat remains NULL |
| TEST-0431 | Record prayer time | Time persists |
| TEST-0432 | Clear prayer time | NULL persists |
| TEST-0433 | Invalid prayer time | Validation rejects input |
| TEST-0434 | Record notes | Notes persist |
| TEST-0435 | Cancel edit | Existing data preserved |
| TEST-0436 | Historical date | Correct sessions load |
| TEST-0437 | Future date | Recording is rejected |
| TEST-0438 | Switch date during save | Correct date remains associated |
| TEST-0439 | Daily summary | Actual counts are correct |
| TEST-0440 | Weekly summary | Actual counts are correct |
| TEST-0441 | Multiple sessions on one date | Active days counted once |
| TEST-0442 | All rakaat NULL | No fabricated rakaat total |
| TEST-0443 | Mixed known and unknown rakaat | Correct recorded total |
| TEST-0444 | Change week start | Weekly period updates |
| TEST-0445 | Inactive activity history | History remains visible |
| TEST-0446 | Select historical matrix date | Correct Tracker date opens |
| TEST-0447 | Dashboard update | Actual current-day data appears |
| TEST-0448 | Edit previous date | Today's summary remains accurate |
| TEST-0449 | Restart application | Data and preferences persist |
| TEST-0450 | Change language | UI localizes |
| TEST-0451 | Change theme | UI updates |
| TEST-0452 | Offline operation | Local functions remain available |
| TEST-0453 | Save failure | Error and recovery work |
| TEST-0454 | Upgrade existing database | Phase 01–03 data preserved |
| TEST-0455 | Local midnight rollover | Today context updates |
| TEST-0456 | Regression testing | Existing features work |
| TEST-0457 | License verification | All components comply |

## 39.2 Calculation Test Cases

Test Case A — No Sessions

```text
Distinct Activities: 0
Total Sessions: 0
Active Days: 0
Recorded Rakaat: NULL
```

Expected:

Neutral empty state.

Test Case B — Single Quick Session

```text
Dhuha: one session
Rakaat: NULL
```

Expected:

```text
Distinct Activities: 1
Total Sessions: 1
Active Days: 1
Recorded Rakaat: NULL
```

Test Case C — Multiple Sessions

```text
Dhuha session 1: 2 rakaat
Dhuha session 2: 4 rakaat
```

Expected:

```text
Distinct Activities: 1
Total Sessions: 2
Active Days: 1
Recorded Rakaat: 6
```

Test Case D — Mixed Activities

```text
Tahajud: 2 rakaat
Witir: 3 rakaat
Dhuha session 1: 2 rakaat
Dhuha session 2: 4 rakaat
```

Expected:

```text
Distinct Activities: 3
Total Sessions: 4
Active Days: 1
Recorded Rakaat: 11
```

Test Case E — Unknown Rakaat

```text
Session 1: 2
Session 2: NULL
Session 3: 4
```

Expected:

```text
Total Sessions: 3
Recorded Rakaat: 6
Sessions With Rakaat: 2
Sessions Without Rakaat: 1
```

Test Case F — Inactive Activity History

```text
Dhuha recorded: 2 sessions
Current Dhuha preference: Inactive
```

Expected:

- Both sessions remain in history.
- Both sessions remain in summaries.
- Existing sessions remain editable.
- Activity is not offered for new recording until reactivated.

Test Case G — Default Preference Protection

```text
User disables all default activities.
Application restarts.
```

Expected:

- No default activities automatically reactivated.
- Empty state remains.
- Historical sessions remain available.

Test Case H — Weekly Distinct Dates

```text
Monday: Tahajud, Witir, Dhuha
Tuesday: Dhuha, Dhuha
Wednesday: Witir
```

Expected:

```text
Distinct Activities: 3
Total Sessions: 6
Active Days: 3
```

Test Case I — Custom Activity Rename

```text
Create custom activity.
Record two sessions.
Rename custom activity.
```

Expected:

- Activity ID remains unchanged.
- Both existing sessions remain associated.
- Historical totals remain correct.

# 40. REGRESSION PROTECTION

Verify Phase 01 functionality:

- Application initialization.
- Existing master data.
- SQLite migrations.
- Localization.
- Theme management.
- Navigation.
- Third-party licenses.

Verify Phase 02 functionality:

- Onboarding.
- Local profile.
- Avatar management.
- Edit Profile.
- Personalized Dashboard.
- Language preferences.
- Theme preferences.
- Week start configuration.
- Introduction replay.

Verify Phase 03 functionality:

- Five obligatory prayers.
- Prayer status management.
- On-time tracking.
- Congregational tracking.
- Prayer notes.
- Automatic persistence.
- Historical date recording.
- Weekly history.
- Daily and weekly calculations.
- Dashboard integration.

Do not modify prayer_logs or Phase 03 business logic unnecessarily.

Verify obligatory prayer statistics remain unchanged after Sunnah session creation, editing, and deletion.

# 41. TECHNICAL VERIFICATION

Run applicable existing project verification commands.

```bash
npm run typecheck
npm run lint
npx expo-doctor
```

Use actual scripts defined in package.json.

Also run where supported:

- Existing automated tests.
- Database migration tests.
- Repository tests.
- Preference initialization tests.
- Custom activity tests.
- Duplicate session prevention tests.
- Session mutation tests.
- Rakaat validation tests.
- Daily summary tests.
- Weekly summary tests.
- Date utility tests.
- Translation consistency tests.
- Android JavaScript bundle verification.
- iOS JavaScript bundle verification.

Use existing test infrastructure.

Do not install unnecessary testing dependencies.

Fix errors introduced during Phase 04 and retest.

Clearly distinguish:

- Automated checks executed.
- Runtime checks executed.
- Manual testing pending.
- Physical Android testing pending.
- Physical iOS testing pending.

Do not fabricate successful test results.

# 42. PROJECT DOCUMENTATION

Update existing documentation according to actual implementation.

```text
README.md
docs/PROJECT_OVERVIEW.md
docs/DEVELOPMENT_ROADMAP.md
docs/ARCHITECTURE.md
docs/BUSINESS_RULES.md
docs/DATABASE_SCHEMA.md
docs/DEVELOPMENT_PROGRESS.md
docs/UI_UX_GUIDELINES.md
docs/UAT_CHECKLIST.md
```

Update licensing documentation when dependencies or assets change:

```text
docs/LICENSING_POLICY.md
docs/THIRD_PARTY_LICENSES.md
```

Add:

```text
docs/PHASE_04_CODEX_PROMPT.md
```

Document:

- Actual Expo SDK version.
- Master data reconciliation.
- Added built-in activities.
- Custom activity implementation.
- Preference initialization marker.
- Final database migration version.
- Actual database schema.
- Quick Checklist behavior.
- Multiple session architecture.
- Duplicate prevention strategy.
- Rakaat semantics.
- Prayer time and notes.
- Date handling.
- Activity deactivation.
- Historical record preservation.
- Summary calculation formulas.
- Future Goals compatibility.
- Dashboard integration.
- Actual development test results.
- Known limitations.

Preserve previous phase documentation and development history.

Do not mark Phase 04 as UAT PASS.

# 43. STRICT OUT OF SCOPE

Do not implement:

- Prayer procedure guidance.
- Prayer recitations.
- Prayer intention text.
- Religious rulings.
- Prayer validity assessment.
- Religious merit assessment.
- Automatic prayer schedules.
- GPS.
- Qibla compass.
- Adhan.
- Reminder notifications.
- Ramadan calendar.
- Quran Reading Tracker.
- Digital Quran.
- Dhikr Tracker.
- Personal Goals.
- Recurring Goals.
- Full Reports & Analytics.
- Cloud backup.
- Cloud synchronization.
- Online authentication.
- Subscription.
- Payments.
- Advertising.

Do not start Phase 05 automatically.

# 44. AGILE DEVELOPMENT COMPLETION

Phase 04 can be marked DONE when:

- Approved functionality is implemented.
- Development verification is completed.
- Critical bugs are resolved.
- Retesting is completed.
- Regression verification is completed.
- Database integrity is preserved.
- Licensing requirements are satisfied.
- Documentation is updated.

Formal Product Owner UAT will take place during Phase 12.

Do not block phase completion solely because formal UAT has not occurred.

Do not mark Phase 04 as DONE if critical implementation or licensing issues remain.

Document physical device tests that still need to be performed.

# 45. FINAL IMPLEMENTATION REPORT

Provide a structured final report containing:

1. Implementation summary.
2. Existing project assessment.
3. Actual Expo SDK version.
4. Created and modified files.
5. Master data reconciliation.
6. Added Sunnah master records.
7. Custom activity architecture.
8. Default preference initialization.
9. Actual database migration version.
10. Final database schema.
11. Repository implementation.
12. Quick Checklist implementation.
13. Multiple session implementation.
14. Duplicate session prevention.
15. Session editing and deletion.
16. Optional rakaat handling.
17. Prayer time and notes.
18. Date handling.
19. Daily summary calculation.
20. Weekly summary calculation.
21. History matrix implementation.
22. Activity breakdown implementation.
23. Dashboard integration.
24. Future Goals compatibility.
25. UI/UX implementation.
26. Localization coverage.
27. Dependency changes.
28. Licensing verification.
29. Calculation test results.
30. TypeScript verification.
31. Lint verification.
32. Expo Doctor verification.
33. Android and iOS bundle verification.
34. Regression verification.
35. Known limitations.
36. Physical device testing requirements.
37. Manual development testing instructions.

Successful status:

PHASE 04 DEVELOPMENT COMPLETE — DONE

If critical implementation or licensing blockers remain:

PHASE 04 DEVELOPMENT INCOMPLETE — BLOCKERS REMAIN

Do not claim formal UAT PASS.

# 46. FINAL INSTRUCTION

Implement Phase 04 directly in the existing Hijra workspace.

Do not only provide another implementation plan, sample code, or theoretical explanation.

Follow the approved Development Brief from Alissa.

Follow the approved UI/UX mockups.

Preserve all Phase 01–03 functionality.

Implement actual SQLite transactions.

Preserve historical records.

Prevent duplicate sessions.

Keep built-in master records protected.

Support custom activities.

Support multiple sessions per activity and date.

Maintain offline functionality.

Maintain bilingual localization.

Maintain centralized theme management.

Maintain mandatory licensing compliance.

Do not reset the database.

Do not introduce fictional worship records.

Do not automatically commit or push to GitHub.

Perform development testing, fix detected issues, and retest.

Update project documentation.

Do not proceed beyond the approved Phase 04 scope.

BEGIN ACTUAL PHASE 04 IMPLEMENTATION NOW.