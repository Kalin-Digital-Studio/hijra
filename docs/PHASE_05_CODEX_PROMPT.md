# HIJRA — PHASE 05
## AL-QUR'AN READING TRACKER IMPLEMENTATION

Act as a Senior React Native Developer, Mobile Application Architect, SQLite Database Engineer, Data Integrity Engineer, Software Licensing Compliance Engineer, and UI/UX Engineer.

Implement Phase 05 of the existing Hijra mobile application based on the approved Development Brief prepared by Alissa.

Phase 01, Phase 02, Phase 03, and Phase 04 have been completed.

This is an incremental development task.

Perform actual implementation directly in the existing workspace.

Do not initialize a new project.

# 1. PROJECT BASELINE

Application Name: Hijra

Developer: Kalin Digital Studio

Tagline: Every day, a better journey.

Release: 1.0 — Ibadah Planner & Tracker

Development Status:

- Phase 01 — Application Foundation: DONE
- Phase 02 — Onboarding & User Profile: DONE
- Phase 03 — Shalat Wajib Tracker: DONE
- Phase 04 — Shalat Sunnah Tracker: DONE
- Phase 05 — Al-Qur'an Reading Tracker: APPROVED FOR DEVELOPMENT

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

Before modifying files:

1. Inspect the existing repository structure.
2. Execute git status.
3. Identify existing uncommitted changes.
4. Read project documentation.
5. Inspect package.json and lockfile.
6. Identify the actual Expo SDK version.
7. Inspect existing Expo Router navigation.
8. Inspect SQLite initialization.
9. Inspect migration history.
10. Inspect user_profiles.
11. Inspect app_settings.
12. Inspect ibadah_categories.
13. Inspect ibadah_types.
14. Inspect prayer_logs.
15. Inspect user_sunnah_preferences.
16. Inspect sunnah_prayer_logs.
17. Inspect existing Quran-related master records.
18. Inspect repository architecture.
19. Inspect existing transaction handling.
20. Inspect existing date utilities.
21. Inspect existing weekly period utilities.
22. Inspect existing duplicate submission protection.
23. Inspect Dashboard.
24. Inspect Tracker landing page.
25. Inspect existing reusable UI components.
26. Inspect existing localization namespaces.
27. Inspect centralized theme tokens.
28. Read docs/LICENSING_POLICY.md.
29. Read docs/THIRD_PARTY_LICENSES.md.
30. Read docs/UI_UX_GUIDELINES.md if available.

Prepare a concise implementation plan and proceed with actual development.

Do not stop after providing an implementation plan.

Preserve existing working code.

Preserve Product Owner changes.

Do not execute destructive Git commands.

Do not automatically commit or push to GitHub.

Do not upgrade or downgrade the Expo SDK without explicit approval.

# 3. DEVELOPMENT OBJECTIVES

Implement:

- Verified metadata for all 114 Quran surahs.
- Arabic surah names.
- Latin surah names.
- Verified Indonesian and English surah name meanings.
- Accurate verse counts.
- Searchable surah selector.
- Daily Quran Reading Tracker.
- Single-surah reading sessions.
- Cross-surah reading sessions.
- Automatic inclusive ayah calculation.
- Multiple reading sessions.
- Optional reading duration.
- Optional private notes.
- Individual session editing.
- Individual session deletion.
- Last Reading Position.
- Manual bookmark management.
- Continue Reading shortcut.
- Historical date navigation.
- Daily reading summary.
- Weekly reading summary.
- Reading history visualization.
- Dashboard integration.
- Future Goals measurement foundation.
- Non-destructive database migration.
- Bilingual interface.
- Light and Dark Mode.
- Dataset licensing documentation.
- Development testing and regression verification.

# 4. STRICT RELEASE BOUNDARY

IMPORTANT:

Phase 05 is part of Release 1.

This phase implements a Quran Reading Tracker, not a Digital Quran Reader.

Users read the Quran using a physical mushaf or another Quran application and record their reading activity in Hijra.

Do not implement full Quran verse content.

Do not implement Indonesian or English verse translations.

Do not implement Quran audio.

Do not implement a Quran Reader.

Digital Quran functionality belongs to Release 2.

# 5. MANDATORY QURAN DATASET LICENSING GATE

Licensing verification is a mandatory implementation requirement.

Do not bypass this requirement.

## 5.1 Preferred Dataset Candidate

Evaluate Tanzil Quran Metadata.

Official reference:

https://tanzil.net/docs/Quran_Metadata

Tanzil is a candidate only.

It has not been approved as the final metadata source.

Verify the actual metadata file and its applicable license before including it in the application.

## 5.2 Mandatory License Criteria

The selected dataset must explicitly permit the intended usage:

- Free of licensing fees.
- Commercial use.
- Redistribution.
- Offline distribution.
- Bundling within Android applications.
- Bundling within iOS applications.
- Required data format conversion.
- Required SQLite import.
- Distribution through Google Play Store and Apple App Store.

Required attribution and copyright conditions must be fulfilled.

Do not assume that free download means free commercial redistribution.

Do not assume that a GitHub repository license automatically covers every included dataset.

Do not assume that the license for Arabic Quran verse text also applies to Quran metadata.

Do not assume that a metadata license also applies to verse translations.

## 5.3 Source Verification Procedure

Before bundling any dataset:

1. Identify the official source.
2. Identify the exact dataset name.
3. Identify the dataset version or revision.
4. Inspect the original metadata file.
5. Inspect embedded licensing statements.
6. Inspect official licensing documentation.
7. Verify commercial usage rights.
8. Verify redistribution rights.
9. Verify permitted data format conversion.
10. Verify attribution requirements.
11. Verify copyright notices.
12. Verify dataset accuracy.
13. Document the verification results.

Use official source documentation whenever available.

Do not rely only on package registry license labels.

## 5.4 Alternative Dataset

If Tanzil metadata licensing cannot be verified:

- Do not bundle the dataset.
- Evaluate alternative authoritative Quran metadata sources.
- Apply the same licensing and accuracy requirements.
- Do not introduce an unverified replacement dataset.

If no compliant source is available:

- Continue implementing dataset-independent functionality.
- Implement calculation services and tests using clearly labeled test fixtures where appropriate.
- Do not distribute test fixtures as production Quran metadata.
- Do not claim that the Quran catalog is production-ready.
- Report the dataset as a mandatory blocker.
- Do not mark Phase 05 DONE.

## 5.5 Indonesian and English Meanings

Surah name meanings are separate from Quran verse translations.

Verify the source and licensing of:

- Arabic surah names.
- Latin transliterations.
- Indonesian surah name meanings.
- English surah name meanings.
- Verse counts.

If additional sources are required for Indonesian or English meanings, document them separately.

Do not use Quran verse translations distributed under noncommercial-only terms.

Do not generate missing Quran metadata or surah meanings using AI as the sole source.

Do not silently substitute unverified data.

## 5.6 Licensing Documentation

Create or update:

```text
docs/QURAN_DATASET.md
docs/THIRD_PARTY_LICENSES.md
```

Document:

- Dataset source.
- Dataset version.
- Official source URL.
- Retrieval date.
- License name.
- Applicable license text.
- Copyright notice.
- Commercial usage rights.
- Redistribution rights.
- Format conversion rights.
- Attribution requirements.
- Local dataset checksum.
- Data transformations performed.
- Known restrictions.
- Verification evidence.

Make required license notices available through the existing offline Third-Party Licenses screen.

# 6. PREFERRED DATASET ARCHITECTURE

Use the following architecture wherever possible:

```text
Verified Quran metadata source
            |
            v
Bundled local JSON dataset
            |
            v
SQLite master data
            |
            v
Quran Repository
            |
            v
Reading Calculation Service
            |
            v
Quran Reading Tracker
```

Do not introduce a runtime Quran API.

Do not require API keys.

Do not require an internet connection.

Do not introduce a paid Quran subscription.

Do not install a Quran npm package if verified local metadata is sufficient.

A development-time dataset conversion script is acceptable if its dependencies and usage comply with the existing licensing policy.

# 7. QURAN METADATA INTEGRITY

Production metadata must contain all 114 surahs.

Required fields:

| Field | Required |
|---|---|
| Surah number | Yes |
| Arabic name | Yes |
| Latin transliteration | Yes |
| Indonesian meaning | Yes |
| English meaning | Yes |
| Verse count | Yes |

Requirements:

- Surah numbers range from 1 through 114.
- No duplicate surah numbers.
- No missing surah numbers.
- Surah numbers must be integers.
- Verse counts must be positive integers.
- Arabic names must render correctly.
- Latin names must be verified.
- Localized meanings must have verified sources.
- Master records must remain read-only to users.

Use one documented verse-numbering convention consistently.

The commonly used Kufan verse-numbering convention associated with Hafs mushafs has an expected total of 6,236 numbered ayat.

Verify the actual selected dataset against its authoritative numbering convention, including individual surah verse counts.

Do not alter verse counts simply to force the dataset total to match an expected number.

Do not mix numbering conventions.

Do not treat unnumbered introductory Bismillah text as an additional tracked ayah.

Follow the verified dataset numbering convention.

# 8. PROPOSED MODULE STRUCTURE

Suggested structure:

```text
app/
├── (tabs)/
│   ├── index.tsx
│   ├── tracker.tsx
│   ├── goals.tsx
│   ├── reports.tsx
│   └── profile.tsx
└── quran/
    ├── index.tsx
    ├── history.tsx
    └── bookmark.tsx

src/
├── features/
│   └── quran/
│       ├── components/
│       │   ├── QuranDailySummary.tsx
│       │   ├── QuranBookmarkCard.tsx
│       │   ├── QuranSurahSelector.tsx
│       │   ├── QuranReadingSessionCard.tsx
│       │   ├── QuranReadingSessionForm.tsx
│       │   ├── QuranBookmarkForm.tsx
│       │   ├── QuranWeeklySummary.tsx
│       │   └── QuranReadingChart.tsx
│       ├── screens/
│       │   ├── DailyQuranScreen.tsx
│       │   ├── QuranHistoryScreen.tsx
│       │   └── QuranBookmarkScreen.tsx
│       ├── services/
│       │   ├── quran.service.ts
│       │   ├── quran-calculation.service.ts
│       │   ├── quran-summary.service.ts
│       │   └── quran-bookmark.service.ts
│       ├── hooks/
│       ├── constants/
│       └── types/
├── database/
│   ├── migrations/
│   └── repositories/
│       ├── quran.repository.ts
│       └── quran-bookmark.repository.ts
├── stores/
├── locales/
│   ├── id/
│   └── en/
└── utils/

assets/
└── data/
    └── quran/
        └── quran-surahs.json

docs/
└── QURAN_DATASET.md
```

This structure is a proposal.

Adapt it to the actual existing project conventions.

Do not create duplicate repositories, date utilities, stores, routes, or reusable components.

Do not add the production quran-surahs.json file until its source and license have been verified.

# 9. ARCHITECTURE REQUIREMENTS

- SQLite remains the persistent source of truth.
- Use existing repository patterns.
- Use centralized calculation services.
- Keep screen components free from direct SQL queries.
- Use parameterized queries.
- Use TypeScript strict mode.
- Avoid unnecessary use of any.
- Preserve existing Zustand architecture.
- Preserve centralized theme tokens.
- Preserve localization architecture.
- Reuse local date utilities from Phase 03 and Phase 04.
- Reuse weekly period utilities.
- Preserve offline operation.
- Avoid unnecessary dependencies.
- Avoid unrelated refactoring.

Do not modify existing obligatory or Sunnah prayer transaction models.

# 10. DATABASE MIGRATION

Database filename:

```text
hijrah.db
```

Use the existing SQLite database.

Inspect actual migration history and determine the next migration version.

Do not assume that Phase 05 corresponds to migration version 5.

Create three new tables:

- quran_surahs
- quran_reading_logs
- quran_bookmarks

Preserve:

- user_profiles
- app_settings
- ibadah_categories
- ibadah_types
- prayer_logs
- user_sunnah_preferences
- sunnah_prayer_logs

## 10.1 Table: quran_surahs

Proposed SQL:

```sql
CREATE TABLE quran_surahs (
    surah_number INTEGER PRIMARY KEY
        CHECK (
            surah_number BETWEEN 1 AND 114
        ),

    name_arabic TEXT NOT NULL,

    name_transliteration TEXT NOT NULL,

    name_id TEXT NOT NULL,

    name_en TEXT NOT NULL,

    verse_count INTEGER NOT NULL
        CHECK (
            typeof(verse_count) = 'integer'
            AND verse_count > 0
        )
);
```

Field semantics:

- name_arabic: Arabic surah name.
- name_transliteration: Verified Latin surah name.
- name_id: Indonesian surah name meaning or documented localized label.
- name_en: English surah name meaning or documented localized label.

Preserve consistent field semantics across all 114 records.

This table contains metadata only.

Do not store full Quran verse content.

## 10.2 Table: quran_reading_logs

Each record represents one continuous reading session.

Proposed SQL:

```sql
CREATE TABLE quran_reading_logs (
    id TEXT PRIMARY KEY NOT NULL,

    user_id TEXT NOT NULL,

    reading_date TEXT NOT NULL,

    start_surah INTEGER NOT NULL,

    start_ayah INTEGER NOT NULL
        CHECK (
            typeof(start_ayah) = 'integer'
            AND start_ayah > 0
        ),

    end_surah INTEGER NOT NULL,

    end_ayah INTEGER NOT NULL
        CHECK (
            typeof(end_ayah) = 'integer'
            AND end_ayah > 0
        ),

    duration_minutes INTEGER DEFAULT NULL
        CHECK (
            duration_minutes IS NULL
            OR (
                typeof(duration_minutes) = 'integer'
                AND duration_minutes > 0
            )
        ),

    notes TEXT DEFAULT NULL,

    created_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES user_profiles(id),

    FOREIGN KEY (start_surah)
        REFERENCES quran_surahs(surah_number),

    FOREIGN KEY (end_surah)
        REFERENCES quran_surahs(surah_number),

    CHECK (
        end_surah > start_surah
        OR (
            end_surah = start_surah
            AND end_ayah >= start_ayah
        )
    )
);

CREATE INDEX idx_quran_logs_user_date
ON quran_reading_logs (
    user_id,
    reading_date
);
```

Do not create a unique constraint on user_id and reading_date.

Multiple reading sessions per day must be supported.

Do not store total_ayah as authoritative transaction data.

Calculate ayah counts using the verified master dataset and shared calculation service.

## 10.3 Table: quran_bookmarks

Each profile may have one main reading bookmark.

Proposed SQL:

```sql
CREATE TABLE quran_bookmarks (
    id TEXT PRIMARY KEY NOT NULL,

    user_id TEXT NOT NULL UNIQUE,

    surah_number INTEGER NOT NULL,

    ayah_number INTEGER NOT NULL
        CHECK (
            typeof(ayah_number) = 'integer'
            AND ayah_number > 0
        ),

    created_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES user_profiles(id),

    FOREIGN KEY (surah_number)
        REFERENCES quran_surahs(surah_number)
);
```

Bookmark updates must not create reading session records.

## 10.4 Migration Safety

- Non-destructive migration.
- Versioned migration.
- Transactional migration.
- Enable foreign key enforcement.
- Preserve existing user profiles.
- Preserve avatar references.
- Preserve application settings.
- Preserve obligatory prayer records.
- Preserve Sunnah prayer records.
- Preserve activity preferences.
- Preserve existing master data.
- Do not reset the database.
- Do not seed fictional reading sessions.
- Do not seed fictional bookmarks.
- Failed migrations must not advance the migration version.

Adapt foreign key types to the actual existing schema.

# 11. MASTER DATA SEEDING

Bundle only verified Quran metadata.

Requirements:

- Seed all 114 master records.
- Validate metadata before insertion.
- Perform integrity checks during migration.
- Do not download metadata during normal application initialization.
- Do not require a runtime internet connection.
- Do not use INSERT OR REPLACE if it risks deleting referenced master records.
- Preserve stable surah numbers.
- Preserve verified verse counts.
- Maintain the documented numbering convention.

Create a reproducible validation or conversion script if necessary.

Document the checksum of the original source artifact and the final bundled dataset.

Future metadata changes must not silently alter historical reading calculations.

Any future change to verse numbering requires explicit assessment and an approved migration strategy.

# 12. TYPESCRIPT DOMAIN MODELS

Create strongly typed domain models.

Suggested master model:

```typescript
export interface QuranSurah {
  surahNumber: number;
  nameArabic: string;
  nameTransliteration: string;
  nameId: string;
  nameEn: string;
  verseCount: number;
}
```

Suggested reading position model:

```typescript
export interface QuranPosition {
  surahNumber: number;
  ayahNumber: number;
}
```

Suggested reading range model:

```typescript
export interface QuranReadingRange {
  start: QuranPosition;
  end: QuranPosition;
}
```

Suggested reading session model:

```typescript
export interface QuranReadingSession {
  id: string;
  userId: string;
  readingDate: string;

  startSurah: number;
  startAyah: number;

  endSurah: number;
  endAyah: number;

  durationMinutes: number | null;
  notes: string | null;

  createdAt: string;
  updatedAt: string;
}
```

Suggested bookmark model:

```typescript
export interface QuranBookmark {
  id: string;
  userId: string;
  surahNumber: number;
  ayahNumber: number;
  createdAt: string;
  updatedAt: string;
}
```

Use centralized database-to-domain mapping.

Do not automatically convert NULL duration into zero.

# 13. REPOSITORY IMPLEMENTATION

Suggested Quran master operations:

```typescript
getAllSurahs()

getSurahByNumber(surahNumber)

searchSurahs(query, language)
```

Suggested reading transaction operations:

```typescript
getReadingSessionsByDate(userId, date)

getReadingSessionsByDateRange(
  userId,
  startDate,
  endDate
)

getReadingSessionById(userId, sessionId)

createReadingSession(input)

updateReadingSession(input)

deleteReadingSession(userId, sessionId)
```

Suggested bookmark operations:

```typescript
getBookmark(userId)

upsertBookmark(input)

clearBookmark(userId)
```

Requirements:

- Parameterized queries.
- User-scoped operations.
- Stable session IDs.
- Stable bookmark IDs.
- Date-based retrieval.
- Date-range retrieval.
- Profile validation.
- Reading range validation.
- Bookmark validation.
- Preserve original created_at.
- Update updated_at when changes occur.
- No direct SQL in screen components.

# 14. SEARCHABLE SURAH SELECTOR

Implement a searchable selector containing all 114 verified surahs.

Search fields:

- Surah number.
- Arabic name.
- Latin transliteration.
- Indonesian meaning.
- English meaning.

Example:

```text
1. Al-Fatihah
   الفاتحة
   Pembukaan · 7 ayat

2. Al-Baqarah
   البقرة
   Sapi Betina · 286 ayat
```

Requirements:

- Default ordering by surah number.
- Case-insensitive Latin search.
- Unicode Arabic search.
- Localized surah meanings.
- Efficient list rendering.
- Offline operation.
- Keyboard-aware search.
- Accessible selection.
- Light and Dark Mode.

Allow users to select surahs without manually scrolling through the entire catalog.

Preserve Arabic names when the application language changes.

Use an existing system font if Arabic rendering is adequate.

If an additional font is necessary, verify its commercial redistribution license first.

Do not include verse text in the selector.

# 15. QURAN READING CALCULATION SERVICE

Create a centralized, pure calculation service where practical.

Suggested responsibilities:

```typescript
validateQuranPosition(position, surahs)

validateReadingRange(range, surahs)

getGlobalAyahPosition(position, surahs)

calculateAyahCount(range, surahs)

getNextReadingPosition(position, surahs)
```

Use verified Quran metadata for all calculations.

Do not hardcode individual surah verse counts inside multiple feature components.

## 15.1 Single-Surah Formula

```text
Ayah Count =
End Ayah - Start Ayah + 1
```

Example:

```text
Al-Baqarah 21–35

35 - 21 + 1 = 15 ayat
```

Reading a single ayah must return one.

## 15.2 Cross-Surah Formula

```text
Ayah Count =
Remaining Ayat in Start Surah
+ All Intermediate Surah Ayat
+ End Ayah
```

Example:

```text
Al-Baqarah ayat 280
through Ali 'Imran ayat 10

Al-Baqarah: 286 - 280 + 1 = 7
Ali 'Imran: 10

Total = 17 ayat
```

## 15.3 Cumulative Offset Approach

Preferred implementation:

```text
Global Ayah Position =
Sum of Verse Counts in All Previous Surahs
+ Current Ayah Number
```

Then:

```text
Reading Count =
End Global Position
- Start Global Position
+ 1
```

Use validated master data to construct cumulative offsets.

Do not persist cumulative offsets as user transaction records.

## 15.4 Reading Range Validation

Reject:

- Surah number below 1.
- Surah number above 114.
- Missing surah master record.
- Ayah number below 1.
- Ayah number exceeding the selected surah verse count.
- Fractional ayah numbers.
- Invalid numeric values.
- Reverse reading ranges.

For a valid range:

- End surah may equal start surah.
- End surah may be greater than start surah.
- End position must not precede start position.

If the user reads disconnected passages, record them as separate sessions.

# 16. READING VOLUME SEMANTICS

Reading Tracker measures recorded reading volume.

Example:

```text
Session 1:
Al-Ikhlas ayat 1–4

Session 2:
Al-Ikhlas ayat 1–4
```

Expected result:

```text
Total Sessions: 2
Total Recorded Ayat: 8
```

Repeated reading is valid.

Do not deduplicate intentional repeated reading.

Do not calculate unique Quran coverage.

Do not determine khatam from total recorded ayat.

Do not display a total reading progress percentage using 6,236 as the denominator.

A bookmark at a specific ayah does not prove that all previous ayat have been read.

# 17. DAILY QURAN READING TRACKER

Create the main Daily Quran Reading Tracker screen.

Indonesian:

Al-Qur'an

English:

Quran Reading

Required layout order:

1. Screen header.
2. Date navigation.
3. Daily summary card.
4. Last Reading Position card.
5. Continue Reading shortcut.
6. Reading session list.
7. Add Reading Session action.
8. Privacy information.

Provide History access using the existing navigation pattern.

## 17.1 Visual Reference

```text
┌──────────────────────────────────┐
│ ←  Al-Qur'an             History │
├──────────────────────────────────┤
│ ‹       Rabu, 25 November      › │
│             Hari ini             │
├──────────────────────────────────┤
│ Bacaan hari ini                  │
│                                  │
│ 35 ayat                          │
│                                  │
│ 35 Ayat    2 Sesi    25 Menit    │
├──────────────────────────────────┤
│ POSISI TERAKHIR MEMBACA          │
│                                  │
│ Bookmark   Al-Baqarah      Edit  │
│            Ayat 35 dari 286      │
│                                  │
│      Catat lanjutan bacaan       │
├──────────────────────────────────┤
│ SESI MEMBACA           + Tambah  │
├──────────────────────────────────┤
│ Al-Baqarah                 20    │
│ Ayat 1–20 · 15 menit      ayat   │
│                            ⋯     │
├──────────────────────────────────┤
│ Al-Baqarah                 15    │
│ Ayat 21–35 · 10 menit     ayat   │
│                            ⋯     │
├──────────────────────────────────┤
│       + Catat sesi membaca      │
└──────────────────────────────────┘
```

All values are illustrative.

Actual implementation must use actual SQLite records.

# 18. DAILY READING SUMMARY CARD

Use a compact Forest Green summary card consistent with previous trackers.

Display:

- Total recorded ayat.
- Total reading sessions.
- Recorded duration.

Example:

```text
Bacaan hari ini

35 ayat

35 Ayat
2 Sesi
25 Menit Tercatat
```

Requirements:

- Do not display fictional achievements.
- Do not display a daily target percentage.
- Do not display failure indicators.
- Show a neutral empty state if no reading session exists.
- Display Not Specified if all recorded session durations are NULL.
- Historical date labels must refer to the selected date, not always Today.

# 19. READING SESSION FORM

Use a compact screen, modal, or bottom sheet consistent with existing forms.

Required fields:

- Selected reading date.
- Start surah.
- Start ayah.
- End surah.
- End ayah.

Optional fields:

- Duration in minutes.
- Private notes.
- Update main bookmark selection.

Required actions:

- Save.
- Cancel.
- Delete when editing an existing session.

## 19.1 Single-Surah Mode

Default to a compact single-surah form.

Suggested layout:

```text
Catat Sesi Membaca

Surah
[ Al-Baqarah                 v ]

Ayat mulai          Ayat terakhir
[ 36 ]              [ 50 ]

Total: 15 ayat

[ ] Bacaan lintas surah

Durasi (opsional)
[ Menit ]

Catatan (opsional)
[                         ]

[✓] Jadikan posisi terakhir membaca

[ Batal ]           [ Simpan ]
```

End surah follows start surah while single-surah mode is active.

## 19.2 Cross-Surah Mode

When enabled:

```text
Surah awal
[ Al-Baqarah ]

Ayat awal
[ 280 ]

Surah terakhir
[ Ali 'Imran ]

Ayat terakhir
[ 10 ]

Total bacaan: 17 ayat
```

Requirements:

- Searchable surah selection.
- Accurate ayah limits.
- Automatic calculation preview.
- Explicit Save.
- Explicit Cancel.
- Invalid ranges cannot be saved.
- Do not autosave incomplete form inputs.

Do not automatically assume that the user has read a suggested end position.

Require the user to enter or explicitly confirm the final ayah.

# 20. READING SESSION MANAGEMENT

Each session must have a stable unique ID.

Supported operations:

- Add session.
- View session.
- Edit session.
- Delete session.
- View and edit private notes.

Requirements:

- Add mode creates a new session ID.
- Edit mode preserves the existing session ID.
- Deleting one session must not affect other sessions.
- Identical ranges across different sessions are allowed.
- Confirm destructive deletion.
- Prevent accidental duplicate submissions.
- Refresh relevant summaries after successful persistence.
- Do not modify bookmark automatically during session deletion.

Display session ordering consistently using existing application conventions.

# 21. OPTIONAL READING DURATION

Store duration as nullable positive integer minutes.

Valid examples:

```text
5
15
30
NULL
```

Reject:

- Zero.
- Negative numbers.
- Decimal numbers.
- Non-numeric values.
- Values exceeding documented safe technical limits.

Requirements:

- Duration is optional.
- User can clear duration.
- Empty value maps to NULL.
- Do not derive duration from created_at.
- Do not implement a timer.
- Do not treat unspecified duration as an actual reading duration of zero.

When displaying totals from partially specified sessions, use the label Recorded Duration.

# 22. OPTIONAL PRIVATE NOTES

Support:

- Add notes.
- Edit notes.
- Remove notes.
- Save.
- Cancel.

Requirements:

- Notes are stored locally.
- Notes do not affect reading calculations.
- Notes do not affect bookmark position.
- Notes are not translated automatically.
- Notes are not displayed on Dashboard.
- Notes are not exposed in development logs.
- Use a documented maximum input length.
- Preserve user-generated content.

Follow existing note form conventions.

# 23. LAST READING POSITION

Implement one main bookmark per local profile.

The bookmark represents the last reading position explicitly selected by the user.

It is independent from recorded reading history.

Visual reference:

```text
POSISI TERAKHIR MEMBACA

Al-Baqarah
Ayat 35 dari 286

Bacaan selanjutnya:
Al-Baqarah ayat 36

[ Catat lanjutan bacaan ]
```

Requirements:

- Display selected surah.
- Display last read ayah.
- Display total ayat of that surah.
- Provide Edit Position action.
- Provide Continue Reading action.
- Provide Clear Bookmark action with confirmation.
- Display a neutral empty state if no bookmark exists.
- Do not create a default persisted bookmark.

If a position bar is displayed, label it as a location indicator within the surah, not a completion percentage.

Do not assume all preceding ayat have been read.

# 24. MANUAL BOOKMARK MANAGEMENT

Implement manual bookmark creation and editing.

Required fields:

- Surah.
- Ayah number.

Required actions:

- Save.
- Cancel.
- Clear bookmark where applicable.

Validate the selected position using the shared Quran calculation service.

Manual bookmark changes:

- Must not create a reading session.
- Must not increase total recorded ayat.
- Must not increase session count.
- Must not increase active days.
- Must not change reading duration.

Clearing a bookmark must not delete reading history.

# 25. BOOKMARK UPDATE RULES

Provide an explicit checkbox in the reading session form:

Indonesian:

Jadikan posisi terakhir membaca.

English:

Set as last reading position.

Default behavior:

| Action | Default Bookmark Update |
|---|---|
| New session for today | Enabled |
| Continue Reading for today | Enabled |
| New historical session | Disabled |
| Continue Reading on historical date | Disabled |
| Editing an existing session | Disabled |

Allow users to change the selection before saving.

If bookmark update is selected:

- Update bookmark to the end surah and end ayah.
- Save reading session and bookmark atomically.

If bookmark update is not selected:

- Preserve the existing bookmark.
- Save only the reading session.

When editing or deleting historical sessions, do not automatically move the main bookmark.

# 26. CONTINUE READING LOGIC

Continue Reading opens the reading session form.

It does not open a Quran Reader.

## 26.1 Within Same Surah

Input:

```text
Bookmark:
Al-Baqarah ayat 35
```

Expected:

```text
Next start position:
Al-Baqarah ayat 36
```

## 26.2 End of Surah

Input:

```text
Bookmark:
Al-Fatihah ayat 7
```

Expected:

```text
Next start position:
Al-Baqarah ayat 1
```

## 26.3 End of An-Nas

Input:

```text
Bookmark:
An-Nas ayat 6
```

Expected behavior:

- Indicate that the saved position is at the end of An-Nas.
- Offer an explicit restart from Al-Fatihah ayat 1.
- Do not automatically reset the bookmark.
- Do not automatically record khatam.
- Do not automatically create a reading session.
- Require user confirmation before using the restart position.

## 26.4 No Bookmark

Expected behavior:

- Show an option to set a reading position.
- Show an option to log a reading session.
- Offer Al-Fatihah ayat 1 as a starting suggestion where appropriate.
- Do not persist a fictional bookmark or reading session.

## 26.5 Continue Reading Form Behavior

Prefill the suggested start position only.

The end position must be entered or confirmed by the user.

The user must remain free to change the suggested start position.

# 27. ATOMIC PERSISTENCE

When the user selects update bookmark, save both operations in the same SQLite transaction.

Conceptual sequence:

```text
BEGIN TRANSACTION

Save or update reading session

If updateBookmark is enabled:
    Insert or update main bookmark

COMMIT TRANSACTION
```

If either operation fails:

```text
ROLLBACK TRANSACTION
```

Use the actual expo-sqlite transaction API compatible with the existing Expo SDK.

Requirements:

- Ensure both operations use the same transaction context.
- Do not allow unrelated asynchronous writes to join the transaction unintentionally.
- Preserve existing bookmark if the session save fails.
- Preserve existing session state if the bookmark update fails.
- Do not display partial success.
- Refresh runtime state only after successful transaction completion.

# 28. DUPLICATE SUBMISSION PROTECTION

Prevent duplicate sessions caused by:

- Double tap on Save.
- Rapid repeated submissions.
- Retry after a database error.
- Screen navigation during persistence.
- Stale asynchronous callbacks.

Generate a stable session ID once per submission intent.

Retries of the same submission intent must reuse that ID.

Intentional new reading sessions must use new IDs.

Do not add uniqueness constraints that prohibit legitimate repeated reading.

Requirements:

- Validate submission state.
- Prevent conflicting saves.
- Bind operations to the original user and selected date.
- Preserve valid pending writes.
- Refresh authoritative database state after success.
- Do not apply a response to an unrelated selected date.

# 29. DATE HANDLING

Reuse existing local calendar date utilities.

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
- Reject malformed dates.
- Reject invalid calendar dates.
- Handle invalid route parameters.
- Refresh Today after app resume.
- Refresh Today after local midnight.

Do not use:

```typescript
new Date().toISOString().slice(0, 10)
```

to determine the local reading date.

Preserve the selected historical date when the application date changes.

Bookmark is profile-global and must not change merely because the selected tracker date changes.

# 30. DAILY SUMMARY SERVICE

Create a centralized Quran Summary Service.

Suggested model:

```typescript
export interface QuranReadingSummary {
  totalAyat: number;
  totalSessions: number;
  activeDays: number;

  recordedDurationMinutes: number | null;

  sessionsWithDuration: number;
  sessionsWithoutDuration: number;

  averageAyatPerActiveDay: number | null;
}
```

Calculation rules:

```text
Total Ayat =
SUM of calculated reading range counts

Total Sessions =
COUNT reading session records

Active Days =
COUNT DISTINCT reading_date

Recorded Duration =
SUM of non-NULL duration values

Sessions With Duration =
COUNT non-NULL duration values

Sessions Without Duration =
COUNT NULL duration values
```

Do not persist derived summary values as authoritative transaction data.

## 30.1 Example

```text
Session 1:
20 ayat, 15 minutes

Session 2:
15 ayat, 10 minutes

Session 3:
4 ayat, duration NULL
```

Expected:

```text
Total Ayat: 39
Total Sessions: 3
Active Days: 1
Recorded Duration: 25
Sessions With Duration: 2
Sessions Without Duration: 1
```

## 30.2 Empty Data

When no sessions exist:

```text
Total Ayat: 0
Total Sessions: 0
Active Days: 0
Recorded Duration: NULL
Average Ayat Per Active Day: NULL
```

Do not report NaN or Infinity.

# 31. WEEKLY SUMMARY SERVICE

Reuse existing week_start preferences.

Supported weekday preferences:

- monday
- tuesday
- wednesday
- thursday
- friday
- saturday
- sunday

Default:

monday

Required weekly indicators:

- Total recorded ayat.
- Total reading sessions.
- Distinct active days.
- Recorded duration.
- Sessions with duration.
- Sessions without duration.
- Average ayat per active day.
- Daily ayat counts.
- Daily session counts.

Example:

```text
Monday:     30 ayat
Tuesday:    45 ayat
Wednesday:  20 ayat
Thursday:    0 ayat
Friday:     50 ayat
Saturday:   35 ayat
Sunday:     60 ayat
```

Expected:

```text
Total Ayat: 240
Active Days: 6
Average Ayat Per Active Day: 40
```

Formula:

```text
Average =
Total Recorded Ayat / Distinct Active Days
```

If Active Days = 0, return NULL.

Future dates must not be interpreted as inactive reading days.

# 32. QURAN READING HISTORY SCREEN

Indonesian:

Riwayat Al-Qur'an

English:

Quran Reading History

Required screen structure:

1. Screen header.
2. Weekly period navigation.
3. Weekly summary card.
4. Daily reading chart.
5. Additional summary.
6. Daily history list.

## 32.1 Weekly Navigation

Provide:

- Previous week.
- Next week.
- Current week.
- Localized date range.

Follow the user's configured week_start.

Do not open completely future weeks for recording.

## 32.2 Weekly Summary Card

Display:

```text
240 Ayat Dibaca

12 Sesi

6 Hari Aktif
```

Use actual database values.

## 32.3 Daily Reading Chart

Display recorded ayat counts per day.

Requirements:

- Actual SQLite data.
- Dynamic chart scale.
- Localized weekday labels.
- Future dates appear empty or disabled.
- Future dates are not represented as failed achievements.
- Accessible descriptions.
- Light and Dark Mode.
- Responsive layout.

Prefer existing lightweight React Native View-based chart components or existing approved SVG support.

Do not introduce a large chart library.

## 32.4 Additional Summary

Display:

- Recorded duration.
- Average ayat per active day.

Show Not Specified or Not Applicable when relevant.

## 32.5 Daily History List

Example:

```text
Minggu, 22 November
3 sesi · 60 ayat

Sabtu, 21 November
2 sesi · 35 ayat
```

Selecting an eligible date opens the Daily Quran Reading Tracker for that date.

Use neutral styling for dates without recorded sessions.

# 33. DASHBOARD INTEGRATION

Preserve the existing Dashboard from Phase 04.

Activate the Al-Qur'an summary card.

Required content:

- Recorded ayat today.
- Reading sessions today.
- Recorded duration today.
- Main bookmark position.
- Navigation shortcut.

Visual reference:

```text
┌──────────────────────────────────┐
│ BookOpen  Al-Qur'an          ›   │
│           Bacaan hari ini        │
│                                  │
│ 35 Ayat    2 Sesi    25 Menit    │
│                                  │
│ Bookmark                         │
│ Posisi terakhir                  │
│ Al-Baqarah · Ayat 35         ›   │
└──────────────────────────────────┘
```

Requirements:

- Quran card opens Daily Quran Reading Tracker.
- Default selected date is Today.
- Bookmark shortcut opens Continue Reading flow.
- Refresh today's totals after successful reading session changes.
- Refresh bookmark after manual bookmark updates.
- Historical session changes must not corrupt today's totals.
- Display neutral empty state when appropriate.
- Preserve Shalat Wajib summary.
- Preserve Shalat Sunnah summary.
- Preserve personalized greeting.
- Preserve Dzikir placeholder.
- Do not redesign unrelated sections.

Do not display private notes.

Do not display khatam progress.

# 34. TRACKER LANDING PAGE

Activate the existing Al-Qur'an shortcut.

Requirements:

- Open Daily Quran Reading Tracker.
- Default date is Today.
- Preserve Shalat Wajib Tracker.
- Preserve Shalat Sunnah Tracker.
- Preserve Dzikir shortcut.
- Preserve bottom navigation.
- Preserve localized category names.
- Avoid duplicate route definitions.
- Preserve hardware Back behavior.

Do not implement Dzikir transaction functionality.

# 35. FUTURE PERSONAL GOALS COMPATIBILITY

Prepare reusable measurements for Phase 07.

Suggested measurement type:

```typescript
export type QuranMeasurement =
  | 'AYAH_COUNT'
  | 'ACTIVE_DAYS'
  | 'SESSION_COUNT'
  | 'DURATION_MINUTES';
```

Suggested aggregation functions:

```typescript
countRecordedAyat(
  userId,
  startDate,
  endDate
)

countReadingActiveDays(
  userId,
  startDate,
  endDate
)

countReadingSessions(
  userId,
  startDate,
  endDate
)

sumRecordedReadingDuration(
  userId,
  startDate,
  endDate
)
```

Future goal examples:

| Goal | Measurement |
|---|---|
| Read 20 ayat daily | AYAH_COUNT |
| Read 140 ayat weekly | AYAH_COUNT |
| Read Quran 5 days weekly | ACTIVE_DAYS |
| Read 10 sessions weekly | SESSION_COUNT |
| Read 15 minutes daily | DURATION_MINUTES |

Repeated readings count toward reading volume measurements.

Unspecified duration must not generate fictional achievement.

Do not implement:

- Goal creation.
- Goal scheduling.
- Recurring goals.
- Goal progress screens.
- Goal transaction tables.

Phase 07 will implement the actual goal functionality.

# 36. FUTURE DIGITAL QURAN COMPATIBILITY

The Phase 05 architecture should support future Release 2 integration.

Conceptual integration:

```text
Digital Quran Reader
          |
          v
Verified Reading Position
          |
          v
Quran Reading Session
          |
          v
Existing Reading Tracker
```

Requirements:

- Preserve stable surah numbering.
- Preserve consistent ayah numbering.
- Preserve stable session IDs.
- Preserve bookmark semantics.
- Keep reading transactions independent of Quran content storage.

Do not create speculative Quran verse tables during Phase 05.

Do not install Quran Reader dependencies.

Do not download full verse translations.

Do not bundle Arabic verse text.

Future Quran text, translations, fonts, audio, and tafsir require independent licensing reviews.

# 37. STATE MANAGEMENT

Extend existing Zustand architecture only where justified.

Possible runtime responsibilities:

- Selected local date.
- Cached verified surah metadata.
- Current reading sessions.
- Current bookmark.
- Pending save state.
- Daily summary.
- Error state.
- Cache invalidation.

Requirements:

- SQLite remains authoritative.
- Do not persist duplicate reading session datasets in Zustand.
- Avoid unnecessary global stores.
- Avoid stale bookmark state.
- Avoid stale selected date state.
- Refresh affected summaries after persistence.
- Avoid exposing private notes unnecessarily in global state.

Reuse existing Phase 03 and Phase 04 patterns.

# 38. UI/UX IMPLEMENTATION REQUIREMENTS

Follow the approved visual references prepared by Alissa.

Visual quality is part of the implementation acceptance criteria.

Design direction:

- Modern Islamic.
- Premium.
- Calm.
- Compact.
- Minimalist.
- Clean.
- Consistent.
- Mobile-first.

## 38.1 Visual Dimensions

Use React Native logical units.

| Component | Specification |
|---|---|
| Screen horizontal padding | 16–20 |
| Screen title font size | 24 |
| Surah title font size | 16 |
| Secondary text font size | 12–13 |
| Icon size | 22–24 |
| Icon container size | 38–40 |
| Card radius | 14–16 |
| Card padding | 12–16 |
| Card spacing | 8–12 |
| Summary primary value | 26–32 |
| Section spacing | 16–20 |
| Minimum touch target | 48 |

Support accessibility and font scaling.

Avoid fixed heights that cause content clipping.

## 38.2 Existing Color Palette

Use actual centralized theme tokens.

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

Do not create a conflicting design system.

## 38.3 Iconography

Use existing approved icon library.

Suggested icons:

| Function | Icon |
|---|---|
| Quran Tracker | BookOpen |
| Reading Position | Bookmark |
| Reading History | History |
| Reading Duration | Clock |
| Multiple Sessions | Layers |
| Add Reading Session | PlusCircle |
| Edit | Pencil |
| Delete | Trash2 |
| Privacy | ShieldCheck |

Do not introduce an unnecessary icon pack.

Do not use raw text glyphs as production navigation icons.

## 38.4 Accessibility

- Accessible form labels.
- Accessible selector controls.
- Screen reader descriptions.
- Correct Arabic Unicode rendering.
- Appropriate text direction for Arabic names.
- Minimum touch targets.
- Sufficient contrast.
- System font scaling.
- Safe area support.
- Keyboard-aware forms.
- Responsive layouts.
- No horizontal overflow.

Follow docs/UI_UX_GUIDELINES.md where available.

# 39. LOCALIZATION

Preserve existing i18next architecture.

Add matching Indonesian and English translations.

Suggested namespace:

```text
src/locales/id/quran.json
src/locales/en/quran.json
```

Adapt to existing project conventions.

Required translation coverage:

| Indonesian | English |
|---|---|
| Al-Qur'an | Quran Reading |
| Riwayat Al-Qur'an | Quran Reading History |
| Catat Sesi Membaca | Log Reading Session |
| Catat Lanjutan Bacaan | Log Continued Reading |
| Posisi Terakhir Membaca | Last Reading Position |
| Bacaan Selanjutnya | Next Reading Position |
| Surah Awal | Start Surah |
| Surah Terakhir | End Surah |
| Ayat Awal | Start Ayah |
| Ayat Terakhir | End Ayah |
| Bacaan Lintas Surah | Cross-Surah Reading |
| Jumlah Ayat | Ayah Count |
| Ayat Dibaca | Ayat Read |
| Durasi Tercatat | Recorded Duration |
| Hari Aktif | Active Days |
| Total Sesi | Total Sessions |
| Rata-rata per Hari Aktif | Average per Active Day |
| Atur Posisi Membaca | Set Reading Position |
| Edit Posisi | Edit Position |
| Hapus Bookmark | Clear Bookmark |
| Jadikan Posisi Terakhir Membaca | Set as Last Reading Position |
| Mulai Kembali | Start Again |
| Catatan | Notes |
| Simpan | Save |
| Batal | Cancel |
| Belum Diisi | Not Specified |
| Tidak Berlaku | Not Applicable |
| Hari Ini | Today |
| Kemarin | Yesterday |
| Pekan Ini | This Week |

Also localize:

- Error messages.
- Validation messages.
- Delete confirmations.
- Empty states.
- Loading states.
- Date labels.
- Weekday labels.
- Accessibility descriptions.
- Save failure messages.
- Retry actions.

Indonesian remains the default and fallback language.

Do not hardcode user-facing strings.

Do not automatically translate user-generated notes.

# 40. PRIVACY REQUIREMENTS

All Quran reading records remain local.

Do not introduce:

- External user data APIs.
- Cloud storage.
- External analytics.
- Advertising SDKs.
- Remote telemetry.
- User tracking.
- Location permissions.
- Notification permissions.

Do not expose reading notes in development logs.

Do not transmit bookmarks or reading history to external services.

Do not generate spiritual scores.

Do not determine religious merit.

Do not compare worship achievements between users.

# 41. MANDATORY DEPENDENCY LICENSING

Read and follow:

```text
docs/LICENSING_POLICY.md
docs/THIRD_PARTY_LICENSES.md
```

Prioritize existing dependencies.

All new libraries and assets must:

- Be free to use.
- Permit commercial use.
- Permit required redistribution.
- Have verifiable licensing terms.
- Be compatible with the actual Expo SDK.
- Not require mandatory paid subscriptions.

Preferred software and asset licenses:

- MIT
- Apache-2.0
- BSD-2-Clause
- BSD-3-Clause
- ISC
- SIL Open Font License
- Verified CC0
- Verified public domain

CC BY content may be used if its applicable terms meet project requirements and attribution is provided.

Review direct and transitive dependencies.

Do not assume software package licenses also cover bundled Quran data.

## 41.1 Existing MPL-2.0 Exception

Preserve the existing approved exception specifically for:

- Lightning CSS.
- Required Lightning CSS platform binaries.
- Expo/Metro build tooling.

Do not extend this exception to unrelated dependencies.

## 41.2 Dependency Restrictions

Avoid unnecessary:

- Quran npm packages.
- Quran API clients.
- Arabic font packages.
- Chart frameworks.
- Form libraries.
- Date libraries.
- State management libraries.
- Icon packs.

If an additional dependency is necessary, verify licensing and compatibility before adding it.

# 42. BUSINESS RULES

BR-0501: Production metadata contains all 114 surahs.

BR-0502: Quran metadata is available offline.

BR-0503: Ayah count is the primary reading measurement.

BR-0504: Single-surah reading is supported.

BR-0505: Cross-surah reading is supported.

BR-0506: Reading counts are inclusive.

BR-0507: Reading ranges must be valid.

BR-0508: Multiple reading sessions are allowed.

BR-0509: Reading duration is optional.

BR-0510: Private notes are optional.

BR-0511: Reading forms use explicit Save and Cancel.

BR-0512: Individual sessions can be edited.

BR-0513: Individual sessions can be deleted.

BR-0514: Historical recording is permitted.

BR-0515: Future recording is prohibited.

BR-0516: One main bookmark per local profile.

BR-0517: Manual bookmark editing is supported.

BR-0518: Bookmark changes are not reading transactions.

BR-0519: Bookmark update during session save is optional.

BR-0520: Repeated readings count as reading volume.

BR-0521: Duplicate submissions must be prevented.

BR-0522: History uses actual SQLite records.

BR-0523: Weekly periods follow week_start preferences.

BR-0524: Reading data remains local and private.

BR-0525: Indonesian and English are supported.

BR-0526: Light, Dark, and System Mode are supported.

BR-0527: Mandatory licensing policy applies.

BR-0528: Phase 01–04 functionality remains operational.

BR-0529: Reading volume does not determine khatam.

BR-0530: No negative reading failure indicator.

BR-0531: Dataset commercial redistribution rights must be verified.

BR-0532: Selected session and bookmark updates must be atomic.

BR-0533: Manual bookmark changes do not increase ayah counts.

BR-0534: NULL duration is not actual zero-minute reading.

BR-0535: Future dates are not inactive reading days.

BR-0536: Session correction does not automatically modify bookmarks.

BR-0537: All calculations follow verified ayah numbering.

BR-0538: Continue Reading does not create sessions before Save.

BR-0539: End of An-Nas does not automatically record khatam.

BR-0540: Unverified Quran datasets cannot be distributed.

# 43. DEVELOPMENT TESTING

Follow the approved Agile methodology.

```text
BUILD → TEST → FIX → RETEST
```

Formal Product Owner UAT will take place during Phase 12.

## 43.1 Functional Test Scenarios

| ID | Scenario | Expected Result |
|---|---|---|
| TEST-0501 | Dataset licensing verification | Compatible rights verified |
| TEST-0502 | Dataset surah count | Exactly 114 |
| TEST-0503 | Surah numbering | No duplicate or missing numbers |
| TEST-0504 | Verse count validation | Matches authoritative source |
| TEST-0505 | Arabic name rendering | Correct and readable |
| TEST-0506 | Search by number | Correct results |
| TEST-0507 | Search by Latin name | Correct results |
| TEST-0508 | Search by Arabic name | Correct results |
| TEST-0509 | Search by localized meaning | Correct results |
| TEST-0510 | Single-surah reading | Correct session stored |
| TEST-0511 | Single ayah | Count equals one |
| TEST-0512 | Cross-surah reading | Correct inclusive count |
| TEST-0513 | Intermediate surahs | Correct inclusive count |
| TEST-0514 | Ayah zero | Rejected |
| TEST-0515 | Negative ayah | Rejected |
| TEST-0516 | Decimal ayah | Rejected |
| TEST-0517 | Ayah exceeds surah count | Rejected |
| TEST-0518 | Reverse range | Rejected |
| TEST-0519 | Invalid surah | Rejected |
| TEST-0520 | Multiple sessions | All intentional sessions persist |
| TEST-0521 | Repeated reading | Reading volume counted correctly |
| TEST-0522 | Save double tap | No duplicate session |
| TEST-0523 | Retry same submission | No duplicate session |
| TEST-0524 | Valid duration | Value persists |
| TEST-0525 | Empty duration | NULL persists |
| TEST-0526 | Invalid duration | Rejected |
| TEST-0527 | Clear duration | NULL persists |
| TEST-0528 | Save private notes | Notes persist |
| TEST-0529 | Cancel form | No unintended changes |
| TEST-0530 | Edit session | Correct session updates |
| TEST-0531 | Delete session | Other sessions preserved |
| TEST-0532 | Create bookmark manually | Bookmark persists |
| TEST-0533 | Edit bookmark manually | Position updates |
| TEST-0534 | Bookmark-only change | Reading totals unchanged |
| TEST-0535 | Save session with bookmark | Both changes persist |
| TEST-0536 | Bookmark transaction failure | Both changes rollback |
| TEST-0537 | Session transaction failure | Existing bookmark remains |
| TEST-0538 | Save without bookmark update | Existing bookmark preserved |
| TEST-0539 | Continue within surah | Next ayah suggested |
| TEST-0540 | Continue at surah ending | Next surah suggested |
| TEST-0541 | Continue after An-Nas | Explicit restart offered |
| TEST-0542 | Continue without saving | No session created |
| TEST-0543 | Edit historical session | Bookmark remains unless selected |
| TEST-0544 | Delete reading session | Bookmark remains unchanged |
| TEST-0545 | Clear bookmark | Reading history preserved |
| TEST-0546 | Previous date | Correct sessions load |
| TEST-0547 | Future date | Recording rejected |
| TEST-0548 | Switch date during save | Correct original date preserved |
| TEST-0549 | Daily summary | Accurate totals |
| TEST-0550 | Weekly summary | Accurate totals |
| TEST-0551 | Distinct active days | Correct calculation |
| TEST-0552 | All durations NULL | No fabricated duration |
| TEST-0553 | Mixed duration values | Correct recorded duration |
| TEST-0554 | Change week start | Weekly period updates |
| TEST-0555 | History date selection | Correct tracker date opens |
| TEST-0556 | Dashboard integration | Actual data displayed |
| TEST-0557 | Application restart | Sessions and bookmark persist |
| TEST-0558 | Language change | UI localizes |
| TEST-0559 | Theme change | UI updates |
| TEST-0560 | Offline operation | All local functions work |
| TEST-0561 | Persistence failure | Error recovery works |
| TEST-0562 | Existing database migration | Phase 01–04 data preserved |
| TEST-0563 | Local midnight rollover | Today context updates |
| TEST-0564 | Regression verification | Previous modules remain working |
| TEST-0565 | Offline license information | Required notices available |

# 44. CALCULATION TEST CASES

## Test Case A — Complete Single Surah

Input:

```text
Al-Fatihah ayat 1–7
```

Expected:

```text
Total Ayat: 7
```

## Test Case B — Partial Surah

Input:

```text
Al-Baqarah ayat 21–35
```

Expected:

```text
Total Ayat: 15
```

## Test Case C — Cross-Surah Reading

Input:

```text
Al-Baqarah ayat 280
through Ali 'Imran ayat 10
```

Expected:

```text
Start Surah Remaining Ayat: 7
End Surah Ayat: 10
Total Ayat: 17
```

## Test Case D — Intermediate Surah

Input:

```text
Al-Fatihah ayat 5
through Ali 'Imran ayat 3
```

Expected:

```text
Al-Fatihah: 3
Al-Baqarah: 286
Ali 'Imran: 3

Total Ayat: 292
```

## Test Case E — Single Ayah

Input:

```text
Al-Ikhlas ayat 2–2
```

Expected:

```text
Total Ayat: 1
```

## Test Case F — Repeated Reading

Input:

```text
Session 1: Al-Ikhlas ayat 1–4
Session 2: Al-Ikhlas ayat 1–4
```

Expected:

```text
Total Sessions: 2
Total Recorded Ayat: 8
```

Do not calculate khatam coverage.

## Test Case G — Mixed Duration

Input:

```text
Session 1: 20 ayat, 15 minutes
Session 2: 15 ayat, 10 minutes
Session 3: 4 ayat, NULL duration
```

Expected:

```text
Total Ayat: 39
Total Sessions: 3
Recorded Duration: 25
Sessions With Duration: 2
Sessions Without Duration: 1
```

## Test Case H — Manual Bookmark

Input:

```text
No reading sessions.

Set bookmark to:
Al-Baqarah ayat 100
```

Expected:

```text
Bookmark: Al-Baqarah ayat 100
Total Ayat: 0
Total Sessions: 0
Active Days: 0
```

## Test Case I — End of Surah

Input:

```text
Bookmark:
Al-Fatihah ayat 7
```

Expected:

```text
Next position:
Al-Baqarah ayat 1
```

## Test Case J — End of An-Nas

Input:

```text
Bookmark:
An-Nas ayat 6
```

Expected:

- Explicit restart option.
- No automatic bookmark reset.
- No reading session creation.
- No automatic khatam achievement.

## Test Case K — Invalid Range

Input:

```text
Al-Baqarah ayat 50–20
```

Expected:

Validation rejects the range.

## Test Case L — Invalid Surah Boundary

Input:

```text
Al-Fatihah ayat 8
```

Expected:

Validation rejects the position.

## Test Case M — Weekly Active Days

Input:

```text
Monday: 2 sessions
Tuesday: 3 sessions
Wednesday: No sessions
Thursday: 1 session
```

Expected:

```text
Total Sessions: 6
Active Days: 3
```

## Test Case N — Atomic Transaction Failure

Simulate successful session insertion followed by bookmark update failure.

Expected:

- Session insertion rolls back.
- Existing bookmark remains unchanged.
- Summaries remain consistent.
- Error feedback is displayed.

## Test Case O — Dataset Integrity

For the selected verified numbering convention:

- Validate all 114 surahs.
- Validate each verse count.
- Validate expected aggregate verse count.
- Validate unique surah numbers.
- Validate no missing surahs.
- Validate non-empty required metadata.
- Validate dataset checksum.

Do not fabricate passing verification results.

# 45. REGRESSION PROTECTION

Verify Phase 01:

- Application initialization.
- Existing master data.
- SQLite migrations.
- Localization.
- Theme management.
- Navigation.
- Third-party license information.

Verify Phase 02:

- Native splash configuration.
- Onboarding.
- Local profile.
- Avatar management.
- Edit Profile.
- Personalized Dashboard.
- Language settings.
- Theme settings.
- Week start configuration.
- Introduction replay.

Verify Phase 03:

- Five obligatory prayers.
- Prayer status management.
- On-time tracking.
- Congregational tracking.
- Private notes.
- Automatic persistence.
- Historical recording.
- Daily summary.
- Weekly history.
- Dashboard integration.

Verify Phase 04:

- Sunnah master data.
- Personalized activity list.
- Activity activation.
- Activity deactivation.
- Custom activities.
- Quick Checklist.
- Multiple sessions.
- Optional rakaat.
- Optional prayer time.
- Private notes.
- Daily and weekly summaries.
- History.
- Dashboard integration.

Verify that Quran session creation, editing, deletion, and bookmark updates do not modify obligatory or Sunnah prayer transactions.

Do not change unrelated business logic.

# 46. TECHNICAL VERIFICATION

Run applicable existing project commands.

```bash
npm run typecheck
npm run lint
npx expo-doctor
```

Use actual scripts defined in package.json.

Also run where supported:

- Existing automated tests.
- Dataset validation tests.
- Database migration tests.
- Repository tests.
- Reading range calculation tests.
- Bookmark transition tests.
- Atomic transaction tests.
- Duplicate submission tests.
- Date utility tests.
- Summary calculation tests.
- Translation key consistency tests.
- Android JavaScript bundle verification.
- iOS JavaScript bundle verification.
- Existing regression tests.

Use existing test infrastructure.

Do not install unnecessary testing libraries.

Fix errors introduced during Phase 05 and retest.

Clearly distinguish:

- Automated tests executed.
- Runtime checks executed.
- Manual testing pending.
- Physical Android testing pending.
- Physical iOS testing pending.
- Dataset verification pending.

Do not fabricate successful test results.

# 47. PROJECT DOCUMENTATION

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
docs/THIRD_PARTY_LICENSES.md
```

Maintain:

```text
docs/LICENSING_POLICY.md
```

Add:

```text
docs/QURAN_DATASET.md
docs/PHASE_05_CODEX_PROMPT.md
```

Document:

- Actual Expo SDK version.
- Quran metadata source.
- Actual dataset license.
- Commercial redistribution verification.
- Dataset version.
- Dataset checksum.
- Numbering convention.
- Metadata validation results.
- Final database migration version.
- Final database schema.
- Repository implementation.
- Reading range formulas.
- Reading volume semantics.
- Cross-surah calculations.
- Bookmark behavior.
- Continue Reading logic.
- Atomic persistence.
- Duplicate submission protection.
- Date handling.
- Daily and weekly summary formulas.
- Future Goals compatibility.
- Future Digital Quran compatibility.
- Actual development verification results.
- Known limitations.

Preserve previous phase documentation.

Formal UAT scenarios remain scheduled for Phase 12.

Do not mark Phase 05 as UAT PASS.

# 48. STRICT OUT OF SCOPE

Do not implement:

- Digital Quran Reader.
- Full Arabic verse content.
- Indonesian verse translations.
- English verse translations.
- Tafsir.
- Murottal audio.
- Audio streaming.
- Quran text search.
- Tajwid visualization.
- Memorization tracking.
- Quran page tracking.
- Juz tracking.
- Unique ayah coverage.
- Khatam tracking.
- Reading timer.
- Reading reminders.
- Quran runtime APIs.
- Dzikir Tracker.
- Personal Goals.
- Recurring Goals.
- Complete Reports & Analytics.
- Cloud backup.
- Cloud synchronization.
- Online authentication.
- Subscription.
- Payments.
- Advertising.

Do not start Phase 06 automatically.

# 49. AGILE DEVELOPMENT COMPLETION CRITERIA

Phase 05 may be marked DONE only when:

- Approved functionality is implemented.
- Production dataset licensing is verified.
- Production metadata accuracy is verified.
- All 114 surahs are available.
- Reading calculations are accurate.
- Atomic persistence is verified.
- Critical bugs are resolved.
- Development testing and retesting are completed.
- Existing database integrity is preserved.
- Regression verification is completed.
- Licensing requirements are satisfied.
- Documentation is updated.

Formal Product Owner UAT remains scheduled for Phase 12.

Do not block development solely because formal UAT has not occurred.

However, unresolved Quran dataset licensing or accuracy requirements are mandatory blockers.

Do not mark Phase 05 DONE while these blockers remain.

# 50. FINAL IMPLEMENTATION REPORT

Provide a structured report containing:

1. Implementation summary.
2. Existing project assessment.
3. Actual Expo SDK version.
4. Created and modified files.
5. Selected Quran dataset source.
6. Actual dataset license.
7. Commercial usage verification.
8. Redistribution verification.
9. Format conversion permissions.
10. Dataset version and checksum.
11. Surah name meaning sources.
12. Verified verse-numbering convention.
13. Metadata validation results.
14. Total verified surahs.
15. Total verified ayat.
16. Actual database migration version.
17. Final database schema.
18. Repository implementation.
19. Single-surah reading implementation.
20. Cross-surah reading implementation.
21. Ayah calculation service.
22. Multiple reading session implementation.
23. Bookmark implementation.
24. Continue Reading implementation.
25. Atomic persistence protection.
26. Duplicate submission protection.
27. Optional duration and notes.
28. Date handling.
29. Daily summary implementation.
30. Weekly summary implementation.
31. History visualization.
32. Dashboard integration.
33. UI/UX implementation.
34. Localization coverage.
35. Dependency changes.
36. Licensing verification results.
37. Calculation test results.
38. TypeScript verification.
39. Lint verification.
40. Expo Doctor verification.
41. Android and iOS bundle verification.
42. Regression verification.
43. Known limitations.
44. Physical device testing requirements.
45. Manual development testing instructions.

Successful completion status:

PHASE 05 DEVELOPMENT COMPLETE — DONE

If mandatory blockers remain:

PHASE 05 DEVELOPMENT INCOMPLETE — BLOCKERS REMAIN

Do not claim formal UAT PASS.

# 51. FINAL INSTRUCTION

Implement Phase 05 directly in the existing Hijra workspace.

Do not only provide another implementation plan or theoretical explanation.

Follow the approved Development Brief prepared by Alissa.

Verify Quran dataset licensing before bundling production metadata.

Verify Quran metadata accuracy before production use.

Use a verified local dataset.

Do not introduce unnecessary Quran runtime dependencies.

Implement actual SQLite transactions.

Implement accurate reading range calculations.

Support cross-surah reading.

Implement independent bookmark management.

Ensure atomic session and bookmark persistence.

Prevent duplicate submissions.

Preserve all existing Phase 01–04 functionality.

Maintain offline functionality.

Maintain bilingual localization.

Maintain centralized theme management.

Maintain mandatory licensing compliance.

Do not reset the database.

Do not introduce fictional worship records.

Do not bundle full Quran verse text or translations.

Do not automatically commit or push to GitHub.

Perform development testing, fix detected errors, and retest.

Update project documentation.

Do not proceed beyond the approved Phase 05 scope.

BEGIN ACTUAL PHASE 05 IMPLEMENTATION NOW.