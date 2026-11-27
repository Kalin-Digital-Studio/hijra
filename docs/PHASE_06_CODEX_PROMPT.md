# HIJRA — PHASE 06
## DIGITAL DZIKIR & TASBIH TRACKER

Act as a Senior React Native Developer, Mobile Application Architect, TypeScript Engineer, SQLite Database Engineer, Religious Content Integrity Engineer, Software Licensing Compliance Engineer, and UI/UX Engineer.

Implement Phase 06 of the existing Hijra mobile application based on the approved Development Brief prepared by Alissa.

Phase 01 through Phase 05 have been completed and tested by the Product Owner.

This is an incremental development task.

Perform actual implementation directly in the existing workspace.

Do not initialize a new project.

Do not stop after providing an implementation plan.

# 1. PROJECT BASELINE

Application Name: Hijra

Developer: Kalin Digital Studio

Tagline: Every day, a better journey.

Release: 1.0 — Ibadah Planner & Tracker

Development Progress: 5 of 12 phases completed.

Completed phases:

- Phase 01 — Application Foundation: DONE
- Phase 02 — Onboarding & User Profile: DONE
- Phase 03 — Shalat Wajib Tracker: DONE
- Phase 04 — Shalat Sunnah Tracker: DONE
- Phase 05 — Digital Quran Reader & Reading Tracker: DONE

Current development:

- Phase 06 — Digital Dzikir & Tasbih Tracker: APPROVED FOR DEVELOPMENT

Technology baseline:

- React Native
- Expo
- TypeScript
- Expo Router
- SQLite
- expo-sqlite
- Zustand
- i18next
- react-i18next
- Existing centralized design system
- Existing approved icon library
- Existing approved Arabic Quran font

Database:

```text
hijrah.db
```

Target platforms:

- Android
- iOS

Development testing:

- Expo Go

Supported languages:

- Indonesian: Default and fallback.
- English: Secondary language.

Supported appearance:

- Light
- Dark
- System

Development methodology:

BUILD → TEST → FIX → RETEST.

Formal Product Owner UAT will be conducted during Phase 12.

# 2. PRE-IMPLEMENTATION ASSESSMENT

Before modifying files:

1. Execute git status.
2. Inspect existing uncommitted changes.
3. Inspect the repository structure.
4. Read README.md.
5. Read existing project documentation.
6. Inspect package.json and lockfile.
7. Identify the actual Expo SDK version.
8. Inspect existing application navigation.
9. Inspect SQLite initialization.
10. Inspect database migration history.
11. Inspect user_profiles.
12. Inspect app_settings.
13. Inspect ibadah_categories.
14. Inspect ibadah_types.
15. Inspect existing Dzikir master activities.
16. Inspect prayer_logs.
17. Inspect user_sunnah_preferences.
18. Inspect sunnah_prayer_logs.
19. Inspect quran_surahs.
20. Inspect quran_verses.
21. Inspect quran_reading_logs.
22. Inspect quran_bookmarks.
23. Inspect existing repository architecture.
24. Inspect transaction handling.
25. Inspect duplicate submission protection.
26. Inspect local date utilities.
27. Inspect weekly period utilities.
28. Inspect Zustand architecture.
29. Inspect localization namespaces.
30. Inspect centralized theme tokens.
31. Inspect existing Dashboard.
32. Inspect Tracker landing page.
33. Inspect Shalat Wajib completion flow.
34. Inspect Quran Arabic font configuration.
35. Inspect existing font-size settings.
36. Inspect existing haptic dependencies.
37. Inspect existing reusable chart components.
38. Read docs/LICENSING_POLICY.md.
39. Read docs/THIRD_PARTY_LICENSES.md.
40. Read docs/UI_UX_GUIDELINES.md.

Prepare a concise implementation plan and proceed with actual development.

Preserve existing Product Owner changes.

Do not execute destructive Git commands.

Do not automatically commit or push.

Do not upgrade or downgrade the Expo SDK without explicit approval.

# 3. DEVELOPMENT OBJECTIVES

Implement:

- Verified Dzikir master catalog.
- Digital Tasbih Counter.
- Native Dzikir Reader.
- Dzikir Pagi.
- Dzikir Petang.
- Dzikir Setelah Shalat.
- Dzikir Harian.
- Custom Dzikir.
- Favorite activities.
- Personalized activity ordering.
- Counter Mode.
- Checklist Mode.
- Configurable repetition targets.
- Free counter.
- Counter correction.
- Counter reset.
- Optional haptic feedback.
- Persistent standalone drafts.
- Persistent collection drafts.
- Resume unfinished activity.
- Multiple dzikir sessions.
- Historical manual recording.
- Individual session editing.
- Individual session deletion.
- Collection tracking.
- Partial collection recording.
- Completed collection recording.
- Daily summary.
- Weekly summary.
- Dzikir history.
- Dashboard integration.
- Shalat Wajib integration.
- Future Personal Goals measurement foundation.
- Offline operation.
- Mandatory licensing compliance.

The primary user experience is:

READ → RECITE → COUNT → SAVE → TRACK.

Users must be able to perform supported built-in dzikir directly inside Hijra.

Do not implement a tracker-only experience that requires another application for the actual readings.

# 4. RELIGIOUS CONTENT INTEGRITY GATE

Religious content accuracy is mandatory.

Before bundling built-in readings, verify the applicable:

- Arabic text.
- Arabic diacritics.
- Latin transliteration.
- Indonesian meaning.
- English meaning.
- Quran reference.
- Hadith reference.
- Narrated repetition count.
- Reading context.
- Authenticity assessment where applicable.
- Redistribution rights.

Do not generate religious content using AI as the sole source.

Do not invent:

- Hadith references.
- Hadith authenticity classifications.
- Prescribed repetition counts.
- Religious benefits.
- Mandatory reading sequences.
- Religious obligations.
- Morning or evening reading requirements.

If multiple authentic practices exist, preserve them as separately identified variations where supported.

Do not combine different narrated practices into an unsupported sequence.

Distinguish between:

1. Verified religious recommendations.
2. Application-defined counter presets.
3. User-defined personal repetition targets.

Do not present application-defined targets as religious requirements.

# 5. MANDATORY CONTENT LICENSING

Read and follow:

```text
docs/LICENSING_POLICY.md
docs/THIRD_PARTY_LICENSES.md
```

Every bundled content artifact must have verified rights permitting the intended usage.

Mandatory requirements:

- Free usage without mandatory licensing fees.
- Commercial application use.
- Offline bundling.
- Required redistribution.
- Android application distribution.
- iOS application distribution.
- Required structural data conversion where applicable.

Verify licenses separately for:

- Software packages.
- Arabic religious text editions and datasets.
- Transliteration datasets.
- Indonesian translations.
- English translations.
- Hadith databases.
- Collection compilations.
- Fonts.
- Images and icons.

Do not assume that a GitHub MIT license automatically covers religious content bundled inside the repository.

Do not assume that public online availability permits commercial redistribution.

Do not copy a modern copyrighted collection or translation without verified permission.

## 5.1 Content Acquisition Strategy

Evaluate authoritative sources for:

- Common daily dzikir.
- Morning dzikir.
- Evening dzikir.
- Post-prayer dzikir.

Potential research references include:

- Quran verses from the existing verified Phase 05 dataset.
- Sahih al-Bukhari.
- Sahih Muslim.
- Other relevant verified hadith sources.
- Hisnul Muslim as a research reference where appropriate.

These references are not blanket licensing approvals.

Verify the exact edition, text artifact, translation, compilation, and applicable rights before bundling.

Prefer a small, reliable, verified catalog over a large unverified catalog.

## 5.2 Mandatory and Optional Content

Mandatory:

- Verified Arabic wording for supported built-in readings.
- Verifiable references.
- Verified context-specific repetition rules.
- Functional Digital Tasbih.
- Functional morning collection.
- Functional evening collection.
- Functional post-prayer collection.

Optional when redistribution rights cannot be verified:

- Latin transliteration.
- Indonesian meaning.
- English meaning.

If optional content is unavailable:

- Store NULL.
- Hide unavailable content sections gracefully.
- Preserve bilingual application interface.
- Do not insert fabricated translations.

## 5.3 Blocker Handling

If a required content source cannot be verified:

- Do not bundle unverified content.
- Continue implementing independent functionality.
- Use clearly labeled development-only fixtures for tests.
- Do not distribute test fixtures as production religious content.
- Report the exact source and licensing blocker.
- Do not silently remove approved mandatory collections.
- Do not claim Phase 06 DONE while mandatory blockers remain.

# 6. RELIGIOUS CONTENT DOCUMENTATION

Create:

```text
docs/DHIKR_DATASET.md
```

Document:

- Dataset name.
- Source URL.
- Source edition or version.
- Retrieval date.
- Original artifact checksum where applicable.
- Bundled artifact checksum.
- Arabic wording verification.
- Quran references.
- Hadith references.
- Repetition-count references.
- Context verification.
- Translation sources.
- Transliteration sources.
- Exact applicable licenses.
- Commercial use permissions.
- Redistribution permissions.
- Required attribution.
- Data transformations.
- Known restrictions.
- Supported collection variations.
- Optional content intentionally deferred.

Update:

```text
docs/THIRD_PARTY_LICENSES.md
```

Expose required license notices through the existing offline Third-Party Licenses screen.

# 7. DZIKIR MASTER CATALOG

Create or reuse stable activity identifiers.

Proposed initial catalog:

| Code | Indonesian Name | English Name | Suggested Target |
|---|---|---|---:|
| TASBIH | Tasbih | Tasbih | 33 |
| TAHMID | Tahmid | Tahmid | 33 |
| TAKBIR | Takbir | Takbir | 33 |
| TAHLIL | Tahlil | Tahlil | NULL |
| ISTIGHFAR | Istighfar | Seeking Forgiveness | 100 |
| SHALAWAT | Shalawat Nabi | Salawat | NULL |
| HAUQALAH | Hauqalah | Hawqala | NULL |
| TASBIH_TAHMID | Tasbih dan Tahmid | Glorification and Praise | 100 |

Suggested wording identifiers:

- Subhanallah.
- Alhamdulillah.
- Allahu Akbar.
- La ilaha illallah.
- Astaghfirullah.
- Verified specific Shalawat wording.
- La haula wala quwwata illa billah.
- Subhanallahi wa bihamdihi.

These are catalog proposals, not production Arabic source data.

Verify exact Arabic content before bundling.

Shalawat must use a specifically identified verified wording.

Do not represent an ambiguous generic label as a complete religious reading.

Default targets are customizable application preferences.

# 8. DZIKIR CATEGORIES

Support:

```typescript
export type DhikrCategory =
  | 'DAILY'
  | 'MORNING'
  | 'EVENING'
  | 'POST_PRAYER'
  | 'PERSONAL';
```

Indonesian labels:

- Dzikir Harian.
- Dzikir Pagi.
- Dzikir Petang.
- Dzikir Setelah Shalat.
- Dzikir Pilihanku.

English labels:

- Daily Dhikr.
- Morning Dhikr.
- Evening Dhikr.
- Post-Prayer Dhikr.
- My Dhikr.

A master reading may be reused across multiple collections.

Collection-specific repetition counts and reading contexts must not overwrite the general daily activity defaults.

# 9. PROPOSED MODULE STRUCTURE

Adapt the following structure to the actual repository:

```text
app/
├── (tabs)/
│   ├── index.tsx
│   ├── tracker.tsx
│   ├── goals.tsx
│   ├── reports.tsx
│   └── profile.tsx
└── dhikr/
    ├── index.tsx
    ├── counter.tsx
    ├── collection.tsx
    ├── reader.tsx
    ├── history.tsx
    ├── manage.tsx
    ├── custom.tsx
    └── manual-log.tsx

src/
├── features/
│   └── dhikr/
│       ├── components/
│       │   ├── DhikrDailySummary.tsx
│       │   ├── DhikrCounter.tsx
│       │   ├── DhikrReadingCard.tsx
│       │   ├── DhikrActivitySelector.tsx
│       │   ├── DhikrCollectionCard.tsx
│       │   ├── DhikrCollectionProgress.tsx
│       │   ├── DhikrDraftCard.tsx
│       │   ├── DhikrTargetSelector.tsx
│       │   ├── DhikrHistoryCard.tsx
│       │   └── DhikrWeeklyChart.tsx
│       ├── screens/
│       ├── services/
│       │   ├── dhikr.service.ts
│       │   ├── dhikr-counter.service.ts
│       │   ├── dhikr-draft.service.ts
│       │   ├── dhikr-collection.service.ts
│       │   └── dhikr-summary.service.ts
│       ├── hooks/
│       ├── types/
│       └── constants/
├── database/
│   ├── migrations/
│   └── repositories/
│       ├── dhikr.repository.ts
│       ├── dhikr-draft.repository.ts
│       └── dhikr-collection.repository.ts
├── stores/
├── locales/
│   ├── id/
│   └── en/
└── utils/

assets/
└── data/
    └── dhikr/

docs/
├── DHIKR_DATASET.md
└── PHASE_06_CODEX_PROMPT.md
```

This structure is a proposal.

Reuse existing shared components and repository conventions.

Do not create duplicate date utilities, theme systems, navigation systems, or database abstractions.

# 10. ARCHITECTURE REQUIREMENTS

- SQLite remains the persistent source of truth.
- Use TypeScript strict mode.
- Use parameterized SQL.
- Keep SQL outside screen components.
- Reuse existing repository patterns.
- Use centralized domain validation.
- Use centralized summary calculations.
- Reuse existing local date utilities.
- Reuse existing week-start calculations.
- Reuse existing theme tokens.
- Reuse existing localization infrastructure.
- Maintain offline-first operation.
- Avoid unnecessary dependencies.
- Avoid unrelated refactoring.

Do not persist duplicate authoritative transaction datasets in Zustand.

# 11. DATABASE FOUNDATION

Use the existing database:

```text
hijrah.db
```

Inspect actual migration history.

Determine the next available migration version.

Do not assume that Phase 06 corresponds to migration version 6.

Preferred logical architecture:

1. dhikr_items
2. dhikr_collections
3. dhikr_collection_items
4. user_dhikr_preferences
5. dhikr_collection_sessions
6. dhikr_logs
7. dhikr_drafts

The dedicated collection session table is the preferred technical baseline for reliable collection grouping and completion tracking.

Adapt the schema to existing project conventions.

Do not duplicate existing ibadah master activities unnecessarily.

If integrating dhikr_items with ibadah_types, use stable references and preserve existing IDs.

# 12. TABLE: dhikr_items

Proposed SQL:

```sql
CREATE TABLE dhikr_items (
    id TEXT PRIMARY KEY NOT NULL,

    code TEXT NOT NULL UNIQUE,

    name_id TEXT NOT NULL,
    name_en TEXT,

    arabic_text TEXT,
    transliteration TEXT,

    meaning_id TEXT,
    meaning_en TEXT,

    reference_source TEXT,

    tracking_mode TEXT NOT NULL
        CHECK (
            tracking_mode IN (
                'COUNTER',
                'CHECKLIST'
            )
        ),

    default_target INTEGER,

    is_custom INTEGER NOT NULL DEFAULT 0
        CHECK (is_custom IN (0, 1)),

    owner_user_id TEXT,

    is_archived INTEGER NOT NULL DEFAULT 0
        CHECK (is_archived IN (0, 1)),

    created_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_user_id)
        REFERENCES user_profiles(id),

    CHECK (
        default_target IS NULL
        OR (
            typeof(default_target) = 'integer'
            AND default_target > 0
        )
    ),

    CHECK (
        tracking_mode = 'COUNTER'
        OR default_target IS NULL
    ),

    CHECK (
        (is_custom = 0 AND owner_user_id IS NULL)
        OR
        (is_custom = 1 AND owner_user_id IS NOT NULL)
    )
);
```

Requirements:

- Built-in content is read-only to users.
- Custom content belongs to its owner.
- Built-in Arabic content must pass verification before seeding.
- Custom Arabic content may be NULL.
- Custom names do not require an English translation.
- Custom codes must remain unique.
- Archive custom items instead of deleting referenced history.

Adapt identifier generation to existing project utilities.

# 13. TABLE: dhikr_collections

Proposed SQL:

```sql
CREATE TABLE dhikr_collections (
    id TEXT PRIMARY KEY NOT NULL,

    code TEXT NOT NULL UNIQUE,

    name_id TEXT NOT NULL,
    name_en TEXT NOT NULL,

    description_id TEXT,
    description_en TEXT,

    category TEXT NOT NULL
        CHECK (
            category IN (
                'MORNING',
                'EVENING',
                'POST_PRAYER'
            )
        ),

    reference_source TEXT NOT NULL,

    content_version TEXT NOT NULL,

    is_active INTEGER NOT NULL DEFAULT 1
        CHECK (is_active IN (0, 1)),

    created_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);
```

Requirements:

- Support verified collection variations.
- Preserve stable collection IDs.
- Version collection content.
- Do not overwrite historical completion criteria.
- Disable outdated collections without deleting historical records.

# 14. TABLE: dhikr_collection_items

Proposed SQL:

```sql
CREATE TABLE dhikr_collection_items (
    id TEXT PRIMARY KEY NOT NULL,

    collection_id TEXT NOT NULL,
    dhikr_item_id TEXT NOT NULL,

    tracking_mode TEXT NOT NULL
        CHECK (
            tracking_mode IN (
                'COUNTER',
                'CHECKLIST'
            )
        ),

    repetition_target INTEGER,

    is_required INTEGER NOT NULL DEFAULT 1
        CHECK (is_required IN (0, 1)),

    sort_order INTEGER NOT NULL,

    reference_source TEXT NOT NULL,

    FOREIGN KEY (collection_id)
        REFERENCES dhikr_collections(id),

    FOREIGN KEY (dhikr_item_id)
        REFERENCES dhikr_items(id),

    CHECK (
        repetition_target IS NULL
        OR (
            typeof(repetition_target) = 'integer'
            AND repetition_target > 0
        )
    ),

    CHECK (
        tracking_mode = 'COUNTER'
        OR repetition_target IS NULL
    ),

    CHECK (
        typeof(sort_order) = 'integer'
        AND sort_order >= 0
    ),

    UNIQUE (
        collection_id,
        sort_order
    )
);

CREATE INDEX idx_dhikr_collection_items
ON dhikr_collection_items (
    collection_id,
    sort_order
);
```

Do not add a uniqueness constraint on collection_id and dhikr_item_id.

The same reading may legitimately occur more than once within a collection.

Each occurrence must have its own stable collection_item_id.

For required COUNTER collection items, require an explicit verified completion criterion.

Do not infer collection completion from the general activity default target.

# 15. TABLE: user_dhikr_preferences

Proposed SQL:

```sql
CREATE TABLE user_dhikr_preferences (
    id TEXT PRIMARY KEY NOT NULL,

    user_id TEXT NOT NULL,
    dhikr_item_id TEXT NOT NULL,

    is_active INTEGER NOT NULL DEFAULT 1
        CHECK (is_active IN (0, 1)),

    is_favorite INTEGER NOT NULL DEFAULT 0
        CHECK (is_favorite IN (0, 1)),

    custom_target INTEGER,

    has_target_override INTEGER NOT NULL DEFAULT 0
        CHECK (has_target_override IN (0, 1)),

    sort_order INTEGER NOT NULL DEFAULT 0,

    created_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES user_profiles(id),

    FOREIGN KEY (dhikr_item_id)
        REFERENCES dhikr_items(id),

    UNIQUE (
        user_id,
        dhikr_item_id
    ),

    CHECK (
        custom_target IS NULL
        OR (
            typeof(custom_target) = 'integer'
            AND custom_target > 0
        )
    ),

    CHECK (
        has_target_override = 1
        OR custom_target IS NULL
    )
);
```

Target resolution:

- has_target_override = 0: Use master default.
- has_target_override = 1 and custom_target is NULL: Free counter.
- has_target_override = 1 and custom_target is positive: User-defined target.

This distinction is necessary so that choosing Free Counter does not accidentally fall back to a master default target.

# 16. TABLE: dhikr_collection_sessions

Proposed SQL:

```sql
CREATE TABLE dhikr_collection_sessions (
    id TEXT PRIMARY KEY NOT NULL,

    user_id TEXT NOT NULL,
    collection_id TEXT NOT NULL,

    collection_version TEXT NOT NULL,

    dhikr_date TEXT NOT NULL,

    prayer_context TEXT,

    status TEXT NOT NULL DEFAULT 'DRAFT'
        CHECK (
            status IN (
                'DRAFT',
                'PARTIAL',
                'COMPLETED'
            )
        ),

    current_collection_item_id TEXT,

    completion_snapshot TEXT NOT NULL,

    created_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    finalized_at TEXT,

    FOREIGN KEY (user_id)
        REFERENCES user_profiles(id),

    FOREIGN KEY (collection_id)
        REFERENCES dhikr_collections(id),

    FOREIGN KEY (current_collection_item_id)
        REFERENCES dhikr_collection_items(id),

    CHECK (
        prayer_context IS NULL
        OR prayer_context IN (
            'FAJR',
            'DHUHR',
            'ASR',
            'MAGHRIB',
            'ISHA',
            'GENERAL'
        )
    ),

    CHECK (
        (
            status = 'DRAFT'
            AND finalized_at IS NULL
        )
        OR
        (
            status IN ('PARTIAL', 'COMPLETED')
            AND finalized_at IS NOT NULL
        )
    )
);

CREATE INDEX idx_dhikr_collection_sessions
ON dhikr_collection_sessions (
    user_id,
    dhikr_date,
    status
);
```

Each intentional collection attempt receives its own stable ID.

The completion snapshot must preserve:

- Original collection version.
- Individual collection item IDs.
- Original tracking modes.
- Original verified repetition requirements.
- Required or optional status.
- Original prayer context applicability.
- Relevant historical display metadata.

Validate the snapshot structure before persistence.

Do not rely only on the current master collection when calculating historical completion.

Do not treat a DRAFT parent as finalized activity.

# 17. TABLE: dhikr_logs

Proposed SQL:

```sql
CREATE TABLE dhikr_logs (
    id TEXT PRIMARY KEY NOT NULL,

    user_id TEXT NOT NULL,
    dhikr_item_id TEXT NOT NULL,

    dhikr_date TEXT NOT NULL,

    tracking_mode TEXT NOT NULL
        CHECK (
            tracking_mode IN (
                'COUNTER',
                'CHECKLIST'
            )
        ),

    repetition_count INTEGER,

    target_count INTEGER,

    collection_session_id TEXT,
    collection_item_id TEXT,

    prayer_context TEXT,

    duration_seconds INTEGER,

    notes TEXT,

    item_name_snapshot TEXT,

    created_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES user_profiles(id),

    FOREIGN KEY (dhikr_item_id)
        REFERENCES dhikr_items(id),

    FOREIGN KEY (collection_session_id)
        REFERENCES dhikr_collection_sessions(id),

    FOREIGN KEY (collection_item_id)
        REFERENCES dhikr_collection_items(id),

    CHECK (
        (
            tracking_mode = 'COUNTER'
            AND repetition_count IS NOT NULL
            AND typeof(repetition_count) = 'integer'
            AND repetition_count > 0
        )
        OR
        (
            tracking_mode = 'CHECKLIST'
            AND repetition_count IS NULL
            AND target_count IS NULL
        )
    ),

    CHECK (
        target_count IS NULL
        OR (
            typeof(target_count) = 'integer'
            AND target_count > 0
        )
    ),

    CHECK (
        duration_seconds IS NULL
        OR (
            typeof(duration_seconds) = 'integer'
            AND duration_seconds > 0
        )
    ),

    CHECK (
        prayer_context IS NULL
        OR prayer_context IN (
            'FAJR',
            'DHUHR',
            'ASR',
            'MAGHRIB',
            'ISHA',
            'GENERAL'
        )
    ),

    CHECK (
        (
            collection_session_id IS NULL
            AND collection_item_id IS NULL
        )
        OR
        (
            collection_session_id IS NOT NULL
            AND collection_item_id IS NOT NULL
        )
    )
);

CREATE INDEX idx_dhikr_logs_user_date
ON dhikr_logs (
    user_id,
    dhikr_date
);

CREATE INDEX idx_dhikr_logs_activity
ON dhikr_logs (
    user_id,
    dhikr_item_id,
    dhikr_date
);

CREATE UNIQUE INDEX idx_dhikr_logs_collection_item
ON dhikr_logs (
    collection_session_id,
    collection_item_id
)
WHERE collection_session_id IS NOT NULL;
```

The partial unique index protects one finalized aggregate record per collection item occurrence within an attempt.

Multiple intentional standalone sessions remain allowed.

Multiple collection attempts remain allowed.

Do not add uniqueness constraints on user_id, date, and activity alone.

Collection category information should be resolved through the collection session relationship rather than storing contradictory duplicated category values.

Duration is optional.

Do not infer actual active recitation duration from application open time.

# 18. TABLE: dhikr_drafts

Proposed SQL:

```sql
CREATE TABLE dhikr_drafts (
    id TEXT PRIMARY KEY NOT NULL,

    user_id TEXT NOT NULL,
    dhikr_item_id TEXT NOT NULL,

    dhikr_date TEXT NOT NULL,

    tracking_mode TEXT NOT NULL
        CHECK (
            tracking_mode IN (
                'COUNTER',
                'CHECKLIST'
            )
        ),

    current_count INTEGER NOT NULL DEFAULT 0,

    checklist_completed INTEGER NOT NULL DEFAULT 0
        CHECK (
            checklist_completed IN (0, 1)
        ),

    target_count INTEGER,

    collection_session_id TEXT,
    collection_item_id TEXT,

    prayer_context TEXT,

    notes TEXT,

    revision INTEGER NOT NULL DEFAULT 0,

    created_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES user_profiles(id),

    FOREIGN KEY (dhikr_item_id)
        REFERENCES dhikr_items(id),

    FOREIGN KEY (collection_session_id)
        REFERENCES dhikr_collection_sessions(id),

    FOREIGN KEY (collection_item_id)
        REFERENCES dhikr_collection_items(id),

    CHECK (
        typeof(current_count) = 'integer'
        AND current_count >= 0
    ),

    CHECK (
        typeof(revision) = 'integer'
        AND revision >= 0
    ),

    CHECK (
        target_count IS NULL
        OR (
            typeof(target_count) = 'integer'
            AND target_count > 0
        )
    ),

    CHECK (
        (
            tracking_mode = 'COUNTER'
            AND checklist_completed = 0
        )
        OR
        (
            tracking_mode = 'CHECKLIST'
            AND current_count = 0
            AND target_count IS NULL
        )
    ),

    CHECK (
        prayer_context IS NULL
        OR prayer_context IN (
            'FAJR',
            'DHUHR',
            'ASR',
            'MAGHRIB',
            'ISHA',
            'GENERAL'
        )
    ),

    CHECK (
        (
            collection_session_id IS NULL
            AND collection_item_id IS NULL
        )
        OR
        (
            collection_session_id IS NOT NULL
            AND collection_item_id IS NOT NULL
        )
    )
);

CREATE INDEX idx_dhikr_drafts_user
ON dhikr_drafts (
    user_id,
    updated_at
);

CREATE UNIQUE INDEX idx_dhikr_drafts_collection_item
ON dhikr_drafts (
    collection_session_id,
    collection_item_id
)
WHERE collection_session_id IS NOT NULL;
```

Requirements:

- Allow multiple unfinished standalone drafts.
- Allow one draft per collection item occurrence within a collection attempt.
- Preserve draft identity when navigating.
- Preserve revision ordering.
- Do not count drafts as finalized activities.
- Do not recreate a finalized draft from a stale write.

# 19. DATABASE VALIDATION

SQL constraints alone are not sufficient.

Implement service-level validation for:

- User ownership.
- Activity ownership.
- Active or archived state.
- Collection membership.
- Collection item identity.
- Collection version.
- Valid local date.
- Prayer context applicability.
- Counter bounds.
- Target bounds.
- Checklist state.
- Draft status.
- Parent session status.
- Parent and child user consistency.
- Parent and child date consistency.
- Parent and child prayer context consistency.
- Historical snapshot consistency.

Prevent a collection child from referencing an unrelated parent or collection item.

Use actual verified SQLite foreign key behavior.

# 20. MIGRATION SAFETY

Requirements:

- Non-destructive migration.
- Versioned migration.
- Transactional migration.
- Foreign key enforcement.
- Validate seed data before committing.
- Preserve existing database records.
- Preserve application settings.
- Preserve Quran dataset and font settings.
- Preserve existing prayer and Quran transactions.
- Preserve existing Quran bookmarks.
- Preserve existing master activity IDs.

Do not:

- Reset hijrah.db.
- Seed fictional dzikir transactions.
- Seed fictional collection completion.
- Automatically reset user preferences.
- Delete existing ibadah master data.
- Advance the migration version after failure.

Seed verified master data idempotently.

# 21. TYPESCRIPT DOMAIN MODELS

Create strongly typed domain models.

Suggested types:

```typescript
export type DhikrTrackingMode =
  | 'COUNTER'
  | 'CHECKLIST';

export type DhikrCollectionStatus =
  | 'DRAFT'
  | 'PARTIAL'
  | 'COMPLETED';

export type DhikrPrayerContext =
  | 'FAJR'
  | 'DHUHR'
  | 'ASR'
  | 'MAGHRIB'
  | 'ISHA'
  | 'GENERAL';
```

Suggested activity model:

```typescript
export interface DhikrItem {
  id: string;
  code: string;

  nameId: string;
  nameEn: string | null;

  arabicText: string | null;
  transliteration: string | null;

  meaningId: string | null;
  meaningEn: string | null;

  referenceSource: string | null;

  trackingMode: DhikrTrackingMode;
  defaultTarget: number | null;

  isCustom: boolean;
  ownerUserId: string | null;
  isArchived: boolean;

  createdAt: string;
  updatedAt: string;
}
```

Suggested draft model:

```typescript
export interface DhikrDraft {
  id: string;
  userId: string;
  dhikrItemId: string;
  dhikrDate: string;

  trackingMode: DhikrTrackingMode;

  currentCount: number;
  checklistCompleted: boolean;
  targetCount: number | null;

  collectionSessionId: string | null;
  collectionItemId: string | null;

  prayerContext: DhikrPrayerContext | null;

  notes: string | null;
  revision: number;

  createdAt: string;
  updatedAt: string;
}
```

Suggested collection snapshot model:

```typescript
export interface DhikrCollectionItemSnapshot {
  collectionItemId: string;
  dhikrItemId: string;

  trackingMode: DhikrTrackingMode;

  requiredRepetitions: number | null;
  isRequired: boolean;

  sortOrder: number;

  displayName: string;
  referenceSource: string;
}
```

Suggested summary model:

```typescript
export interface DhikrSummary {
  totalRepetitions: number;
  totalSessions: number;
  distinctActivities: number;

  activeDays: number;

  checklistSessions: number;

  completedCollections: number;
  completedMorningCollections: number;
  completedEveningCollections: number;
  completedPostPrayerCollections: number;
}
```

Adapt naming conventions to the existing codebase.

Do not convert NULL repetition counts into fabricated counts.

# 22. REPOSITORY IMPLEMENTATION

Suggested master operations:

```typescript
getAvailableDhikrItems(userId)

getDhikrItemById(userId, itemId)

getFavoriteDhikrItems(userId)

getActiveDhikrItems(userId)

searchDhikrItems(userId, query)
```

Preference operations:

```typescript
getDhikrPreferences(userId)

upsertDhikrPreference(input)

setDhikrFavorite(userId, itemId, favorite)

setDhikrActive(userId, itemId, active)

reorderDhikrActivities(userId, itemIds)

setDhikrTargetPreference(input)
```

Draft operations:

```typescript
createDhikrDraft(input)

getDhikrDraft(userId, draftId)

getUnfinishedDhikrDrafts(userId)

incrementDhikrDraft(input)

decrementDhikrDraft(input)

resetDhikrDraft(input)

updateDhikrDraftTarget(input)

setChecklistDraftCompleted(input)

discardDhikrDraft(input)

finalizeDhikrDraft(input)
```

Collection operations:

```typescript
getDhikrCollections(category)

getDhikrCollectionItems(collectionId)

createCollectionSession(input)

getCollectionSession(userId, sessionId)

getCollectionDraftProgress(userId, sessionId)

updateCollectionPosition(input)

finalizeCollectionSession(input)

discardCollectionDraft(input)
```

Transaction operations:

```typescript
getDhikrLogsByDate(userId, date)

getDhikrLogsByDateRange(
  userId,
  startDate,
  endDate
)

getDhikrLogById(userId, logId)

createManualDhikrLog(input)

updateDhikrLog(input)

deleteDhikrLog(userId, logId)

deleteCollectionSession(userId, sessionId)
```

All operations must enforce user ownership and applicable business rules.

# 23. DZIKIR HOME SCREEN

Create the main Dzikir Home screen.

Suggested route:

```text
/dhikr
```

Required visual hierarchy:

1. Compact screen header.
2. Daily summary.
3. Resume unfinished draft.
4. Digital Tasbih shortcut.
5. Dzikir Pagi.
6. Dzikir Petang.
7. Dzikir Setelah Shalat.
8. Dzikir Pilihanku.
9. Favorite activities.
10. Manual recording shortcut.
11. History shortcut.

Daily summary must display:

- Total saved repetitions.
- Total saved individual sessions.
- Distinct activities.

Optional additional indicators:

- Completed collections.
- Completed morning collection.
- Completed evening collection.

Display draft counts separately.

Do not add unfinished draft values to recorded totals.

# 24. DIGITAL TASBIH COUNTER SCREEN

Required components:

- Compact header.
- Dzikir activity selector.
- Arabic reading.
- Available Latin transliteration.
- Available localized meaning.
- Optional source reference.
- Large circular counter button.
- Current repetition count.
- Session target.
- Progress indicator.
- Decrease button.
- Reset button.
- Target selector.
- Haptic toggle.
- Save Session button.

Suggested layout:

```text
┌──────────────────────────────────┐
│ ← Digital Tasbih                 │
├──────────────────────────────────┤
│ [ Istighfar                  v ] │
│                                  │
│          أَسْتَغْفِرُ اللَّهَ          │
│          Astaghfirullah          │
│                                  │
│          ╭───────────╮           │
│          │ Target 100│           │
│          │           │           │
│          │    87     │           │
│          │           │           │
│          │ Ketuk +1  │           │
│          ╰───────────╯           │
│                                  │
│       [ −1 ]       [ Reset ]    │
│                                  │
│ Target                           │
│ [Bebas] [33] [99] [100] [Custom]│
│                                  │
│ Getaran                    [ON] │
│                                  │
│        [ Simpan Sesi ]           │
└──────────────────────────────────┘
```

The Arabic example is for layout illustration only.

Production religious wording must come from verified data.

# 25. COUNTER INTERACTION

Business rules:

- One accepted intentional tap equals one increment.
- Counter starts at zero for a new draft.
- Decrement subtracts one.
- Counter never becomes negative.
- Counter may exceed the selected target.
- Target completion does not automatically save.
- Target completion does not automatically reset.
- Zero-count counter drafts cannot become finalized reading logs.
- Counter must support rapid intentional tapping.
- Counter must remain responsive.

Use a documented technical maximum.

Recommended initial maximum:

```typescript
const MAX_DHIKR_COUNT = 1_000_000;
```

The maximum is a technical safety limit, not a religious restriction.

Apply equivalent validation in UI, domain services, and persistence.

# 26. COUNTER CONCURRENCY PROTECTION

Do not implement counter mutations using stale React state.

Avoid patterns equivalent to:

```typescript
setCount(count + 1);
```

when rapid repeated operations can read outdated values.

Use an appropriate functional state update, serialized command queue, atomic database increment, or equivalent reliable strategy.

Requirements:

- Every accepted tap is represented exactly once.
- Operations remain ordered.
- Decrement cannot race incorrectly with increment.
- Reset cannot be overwritten by an earlier pending increment.
- Target updates cannot overwrite the count.
- Changing activity cannot apply queued operations to the wrong draft.
- Saving waits for pending accepted mutations.
- Discarding a draft invalidates stale operations.
- Finalized drafts cannot be recreated by delayed writes.

Bind every operation to:

- Original user ID.
- Original draft ID.
- Original draft date.
- Expected revision or equivalent mutation identity.

Do not debounce counter taps into one increment.

# 27. PERSISTENT COUNTER DRAFT

Persist counter progress locally.

Preferred strategy:

- Create a stable draft ID.
- Use a serialized mutation queue.
- Persist accepted counter mutations promptly.
- Maintain an authoritative committed count.
- Track pending operations separately if optimistic rendering is used.
- Reconcile the displayed value after persistence failures.

If batching writes is necessary for performance, document the durability trade-off.

Do not claim a count is durably saved before its database write commits.

Do not rely exclusively on application background events for persistence.

An unexpected process termination may prevent lifecycle callbacks from running.

On restart:

- Restore the last successfully committed draft count.
- Restore selected activity.
- Restore session target.
- Restore checklist state where applicable.
- Restore original date.
- Restore collection context.
- Display a Resume Draft action.

No finalized transaction may be created merely by restoring a draft.

# 28. RAPID TAPPING ACCEPTANCE TEST

Create a deterministic stress test.

Example:

Start from a zero-count draft.

Submit 100 intentional increment operations rapidly.

Expected:

- Accepted increments: 100.
- Final persisted count: 100.
- Displayed count: 100.
- No duplicate operations.
- No missing operations.
- No finalized logs before Save.

Additional test:

Queue 100 increments, 10 decrements, and then Save in that order.

Expected:

- Finalized repetition count: 90.
- Exactly one finalized session.
- Draft closed.
- No pending stale mutation changes the finalized record.

Test reset ordering and concurrent navigation as well.

# 29. SESSION TARGET MANAGEMENT

Support presets:

```typescript
const DHIKR_TARGET_PRESETS = [
  33,
  99,
  100,
] as const;
```

Also support:

- Free Counter.
- Custom target.

Internally:

- Free Counter = NULL.
- Positive target = positive integer.

Reject:

- Zero as a persisted target.
- Negative targets.
- Fractional targets.
- Non-numeric values.
- Values above the documented technical maximum.

For standalone activities, target changes are allowed during an active draft.

Target changes must not modify the current count.

For verified guided collections:

- Preserve the verified required repetition count separately.
- A personal counter target must not reduce collection completion requirements.
- Do not mark a required 100-repetition item complete merely because the user sets a personal target of 10.

Do not present preset 33, 99, or 100 as universally prescribed counts.

# 30. COUNTER PROGRESS

If a session target exists:

```text
Display Progress =
MIN(Current Count / Target Count, 1)
```

If no target exists:

- Display Free Counter.
- Do not display an artificial percentage.
- Do not divide by zero.

If target is reached:

- Display a neutral target-reached indication.
- Allow further counting.
- Trigger optional milestone haptic feedback on the appropriate transition.
- Do not repeatedly trigger target completion feedback on every subsequent count.

The target progress indicator is a session measurement, not a spiritual achievement score.

# 31. COUNTER CORRECTION AND RESET

Decrease:

- Disabled or harmless when count is zero.
- Subtract exactly one.
- Persist the corrected draft count.

Reset:

- Confirm if current count is greater than zero.
- Reset the active draft count to zero.
- Preserve activity identity.
- Preserve selected target.
- Preserve draft date.
- Preserve existing finalized history.

Reset must not delete previous saved sessions.

Test reset while pending operations exist.

# 32. SWITCHING ACTIVITIES

When switching to another activity with an unfinished draft, provide:

- Save and Switch.
- Keep Draft and Switch.
- Discard and Switch.
- Cancel.

Requirements:

- Save and Switch waits for successful finalization.
- Keep Draft and Switch preserves the current draft.
- Discard requires confirmation.
- Cancel preserves current state.
- A persistence failure must not silently switch away and lose the draft.

When returning to an activity with multiple drafts, allow selection of the intended unfinished draft.

Do not merge unrelated drafts automatically.

# 33. HAPTIC FEEDBACK

Prefer an existing approved haptic implementation.

If expo-haptics is required:

- Inspect existing dependencies.
- Verify actual package license.
- Verify Expo SDK compatibility.
- Use the compatible installation mechanism.
- Review new direct and transitive dependencies.
- Update licensing documentation.

Suggested preference key:

```text
dhikr_haptics_enabled
```

Use the existing app_settings architecture.

Default recommendation:

Enabled when supported.

Requirements:

- User may disable haptics.
- Haptic preference persists.
- Haptic failure never cancels a counter increment.
- Haptic feedback is a best-effort non-blocking effect.
- Unsupported devices remain functional.
- Do not request unnecessary permissions.
- Avoid excessive overlapping haptic calls during rapid tapping.

# 34. DZIKIR READER

Create a native reading experience.

Required content:

- Reading title.
- Arabic text.
- Verified transliteration when available.
- Verified localized meaning when available.
- Reference information.
- Tracking controls.

Reuse the approved Phase 05 Arabic font if suitable.

Requirements:

- Correct Arabic shaping.
- Correct RTL rendering.
- Comfortable line height.
- No clipped Arabic characters.
- No clipped harakat.
- No missing glyphs.
- Responsive reading cards.
- Adjustable font size through existing compatible settings.
- Light and Dark Mode.
- Offline rendering.

Do not alter existing Quran text or its numbering.

If a collection references Quran passages, reuse the existing verified source text and preserve its applicable attribution requirements.

Do not count a Quran passage as multiple dzikir repetitions merely because it contains multiple Quran ayat.

Dzikir repetitions and Quran ayah tracking are independent measurements.

Reading a Quran passage within Dzikir must not automatically create a Quran Reading Tracker transaction.

# 35. CHECKLIST MODE

Checklist Mode is used for activities without a numeric repetition measurement.

Draft values:

```text
tracking_mode = CHECKLIST
current_count = 0
checklist_completed = 0 or 1
target_count = NULL
```

Finalized values:

```text
tracking_mode = CHECKLIST
repetition_count = NULL
target_count = NULL
```

Only explicitly completed checklist activities may be finalized.

Do not create a transaction when the checklist remains unchecked.

A finalized checklist activity contributes:

- One individual saved session.
- One distinct activity where applicable.
- One active day where applicable.

A finalized checklist activity contributes zero to numeric repetition aggregation.

This zero is an aggregation behavior, not a stored fabricated repetition count.

# 36. DZIKIR PAGI

Implement a verified morning dzikir collection.

Required screens:

- Collection introduction.
- Ordered reading list.
- Individual reading screen.
- Collection progress.
- Previous reading navigation.
- Next reading navigation.
- Resume unfinished collection.
- Save collection.

Each collection item includes:

- Verified reading.
- Applicable repetition rule.
- Reference.
- Counter or checklist mode.
- Required or optional completion status.
- Stable collection item identity.

Do not hardcode an arbitrary collection size.

The actual number of readings must reflect the selected verified collection.

Do not label a collection as universally mandatory or exhaustive.

# 37. DZIKIR PETANG

Implement a verified evening dzikir collection.

Use the same collection infrastructure as Dzikir Pagi.

Preserve independent:

- Context.
- Reading sequence.
- Repetition requirements.
- Source references.
- Collection version.

Morning and evening readings may reuse master records where appropriate.

Do not assume that every morning reading also applies to evening practice.

# 38. DZIKIR SETELAH SHALAT

Implement verified post-prayer collections.

Support context selection:

| Code | Indonesian | English |
|---|---|---|
| FAJR | Subuh | Fajr |
| DHUHR | Dzuhur | Dhuhr |
| ASR | Ashar | Asr |
| MAGHRIB | Maghrib | Maghrib |
| ISHA | Isya | Isha |
| GENERAL | Umum | General |

Verify context-specific differences.

Support clearly identified authentic variations.

Do not mix distinct narrated sequences without a supporting source.

For example:

- A verified 33–33–34 sequence.
- A verified 33–33–33 sequence with its applicable closing reading.

These must not be treated as identical practices if their verified completion requirements differ.

The actual selected collection definitions must be documented.

# 39. COLLECTION SESSION CREATION

When starting a new collection:

1. Validate the selected collection.
2. Validate the selected user.
3. Validate the selected local date.
4. Validate applicable prayer context.
5. Generate a stable collection session ID.
6. Create the immutable completion snapshot.
7. Create a DRAFT parent session.
8. Initialize item drafts where needed.
9. Set the initial reading position.
10. Open the collection reader.

Create draft records lazily or eagerly according to the existing architecture.

Both approaches must preserve correct completion semantics.

Opening a collection must not create finalized activity logs.

# 40. COLLECTION PROGRESS

Each collection item must have a deterministic progress status.

Suggested runtime statuses:

- NOT_STARTED
- IN_PROGRESS
- COMPLETED

For COUNTER items:

- Zero repetitions: NOT_STARTED.
- Positive repetitions below required threshold: IN_PROGRESS.
- Verified completion threshold satisfied: COMPLETED.

For CHECKLIST items:

- Unchecked: NOT_STARTED.
- Explicitly completed: COMPLETED.

Optional items do not block collection completion.

Collection progress should display:

```text
Completed required items / Total required items
```

Example:

```text
3 dari 12 bacaan selesai
```

This is an illustration only.

Use the actual verified collection size.

Do not calculate completion from the number of screens visited.

Do not calculate completion merely from scrolling.

# 41. COLLECTION NAVIGATION

Support:

- Previous reading.
- Next reading.
- Reading list.
- Jump to a collection item.
- Resume saved position.
- Return to collection overview.

Navigation must not discard counts.

Navigation must not automatically create transactions.

Users may revisit an earlier item and correct its draft count.

Persist the selected item identity.

Do not use array index as the authoritative identity of a collection item.

# 42. COLLECTION COMPLETION SERVICE

Implement a pure domain calculation where practical.

Suggested function:

```typescript
evaluateCollectionCompletion(
  snapshot,
  itemProgress
)
```

Suggested result:

```typescript
export interface CollectionCompletionResult {
  requiredItems: number;
  completedRequiredItems: number;

  optionalItems: number;
  completedOptionalItems: number;

  isComplete: boolean;
  hasRecordedActivity: boolean;
}
```

Completion requirements:

- Snapshot must be valid.
- Required items must have valid completion criteria.
- Every required item must be satisfied.
- Optional items may remain incomplete.
- An empty or invalid required-item configuration must not automatically produce completed religious activity.

Do not infer completion from total repetitions across unrelated items.

Example:

Required item A: 33.

Required item B: 33.

Required item C: 34.

Actual counts:

A: 50.

B: 50.

C: 0.

Total repetitions: 100.

Expected collection status: INCOMPLETE.

The aggregate total of 100 does not prove that every required reading was completed.

# 43. COLLECTION SAVE

Provide an explicit Save Collection action.

Before saving:

- Drain pending accepted item mutations.
- Validate the parent DRAFT session.
- Validate original collection snapshot.
- Validate child ownership and identity.
- Determine actual recorded activities.
- Determine completion status.

Save:

- Positive counter counts.
- Explicitly completed checklist items.
- Partial positive counts.

Exclude:

- Untouched counter items.
- Zero-count items.
- Unchecked checklist items.

When all required items are satisfied:

```text
status = COMPLETED
```

When recorded activity exists but required items remain incomplete:

```text
status = PARTIAL
```

Do not finalize an entirely empty collection.

After saving a partial collection, it becomes a finalized partial attempt.

Do not silently reopen or duplicate it as another draft.

A new intentional collection attempt must use a new parent session ID.

Allow correction through the history management flow.

# 44. ATOMIC COLLECTION FINALIZATION

Use the actual expo-sqlite transaction mechanism compatible with the installed SDK.

Conceptual sequence:

```text
BEGIN TRANSACTION

Validate draft collection session

Load and validate item drafts

Insert finalized individual reading logs

Evaluate completion using original snapshot

Update parent collection session status

Set finalized_at

Close or remove item drafts

COMMIT TRANSACTION
```

On failure:

```text
ROLLBACK TRANSACTION
```

Requirements:

- All statements use the same transaction context.
- No unrelated asynchronous writes enter the transaction.
- No partial finalized collection remains after rollback.
- Draft remains available after failure.
- Stable IDs protect retries.
- Successful finalization is idempotent.
- Summary invalidation occurs after commit.

# 45. ATOMIC STANDALONE SESSION SAVE

When saving a standalone draft:

1. Wait for accepted pending counter operations.
2. Validate the committed draft state.
3. Validate activity ownership.
4. Validate the selected date.
5. Generate or reuse the stable final session ID.
6. Begin transaction.
7. Insert finalized log.
8. Close or delete draft.
9. Commit transaction.
10. Refresh affected summaries.

Use a stable mapping between draft ID and finalized log ID.

Using the draft ID as the finalized log ID is acceptable if compatible with the existing architecture.

Do not generate a new log ID for every retry.

If the transaction already committed but a response was lost, retry must return or reconcile the existing finalized record rather than create a duplicate.

# 46. DUPLICATE SUBMISSION PROTECTION

Prevent duplicates caused by:

- Save double tap.
- Rapid repeated Save actions.
- Retry after persistence failure.
- Retry after uncertain transaction outcome.
- Screen navigation.
- App resume.
- Delayed asynchronous responses.
- Stale draft mutation callbacks.

Requirements:

- Stable operation identities.
- Stable session IDs.
- Serialized mutation handling.
- Pending submission state.
- Database-level uniqueness where appropriate.
- Idempotent retry behavior.
- Reconciliation with authoritative database state.

Intentional multiple sessions must remain supported.

Do not use uniqueness rules that prohibit legitimate repeated dzikir.

# 47. SHALAT WAJIB INTEGRATION

Add an optional shortcut from completed obligatory prayer activities.

Indonesian:

Dzikir Setelah Shalat.

English:

Post-Prayer Dhikr.

When selected:

- Pass the existing prayer context.
- Pass the selected local prayer date.
- Open the applicable collection.
- Validate route parameters.

Requirements:

- Do not force navigation when prayer status changes.
- Do not automatically start dzikir.
- Do not automatically record dzikir.
- Do not automatically modify prayer status.
- Preserve all Phase 03 business rules.
- Keep the shortcut visually compact.
- Permit independent access from Dzikir Home.

If a user records dzikir for yesterday's completed prayer, preserve yesterday's date unless explicitly changed.

# 48. CUSTOM DZIKIR

Allow local users to create personal activities.

Required field:

- Activity name.

Optional fields:

- Arabic text.
- Latin transliteration.
- Meaning.
- Private notes.
- Default repetition target.

Required configuration:

- COUNTER or CHECKLIST mode.
- Active status.

Optional configuration:

- Favorite status.

Requirements:

- Stable custom activity ID.
- Profile ownership.
- Create.
- Edit.
- Activate.
- Deactivate.
- Archive.
- Reorder.
- Configure default target.

Do not allow users to modify built-in religious source content.

Clearly identify custom content as user-provided.

Do not imply that Hijra has verified custom content.

Do not automatically translate custom content.

If a custom activity has historical logs, preserve the original recorded tracking mode.

Changing the custom item's mode must not reinterpret historical records.

# 49. FAVORITE AND PERSONALIZATION

Allow users to:

- Add favorites.
- Remove favorites.
- Activate activities.
- Deactivate activities.
- Reorder activities.
- Set target overrides.
- Reset target overrides to master defaults.
- Explicitly choose Free Counter.

Suggested initial favorites:

- Tasbih.
- Tahmid.
- Takbir.
- Istighfar.

Apply initial defaults only once per applicable user profile.

Do not recreate removed favorites after application restart.

Allow users to remove all favorites.

Inactive activities remain available in history.

Collection reading availability must not be broken merely because a user removes a daily activity from favorites.

# 50. HISTORICAL MANUAL RECORDING

Implement a manual recording form for dzikir performed outside Hijra.

Required fields:

- Selected date.
- Selected activity.
- Tracking mode.
- Actual repetitions for COUNTER mode.
- Explicit completion for CHECKLIST mode.

Optional fields:

- Target count.
- Prayer context.
- Private notes.
- Duration if supported.

Actions:

- Save.
- Cancel.

Requirements:

- Today is default.
- Historical dates are permitted.
- Future dates are prohibited.
- Numeric values must be valid integers.
- Do not create an empty counter transaction.
- Do not save an unchecked checklist.
- Prevent duplicate submissions.

A standalone manual record associated with a prayer context must not automatically count as a completed post-prayer collection.

If manual collection recording is supported, it must use an actual validated collection attempt with item-level completion information.

# 51. DATE HANDLING

Reuse existing local date utilities.

Storage format:

```text
YYYY-MM-DD
```

Requirements:

- Today.
- Previous day.
- Next day.
- Date picker.
- Return to Today.
- Historical recording.
- Future date rejection.
- Malformed date rejection.
- Invalid calendar date rejection.
- Local midnight handling.
- Application resume handling.

Do not determine local date using:

```typescript
new Date().toISOString().slice(0, 10)
```

Preserve the original selected date for pending writes.

If an unfinished draft is resumed on another calendar day:

- Display its original date.
- Allow continuation on its original date.
- Offer explicit date reassignment where appropriate.
- Do not silently move it to today.

Date reassignment for a collection must update parent and child drafts consistently in a transaction.

# 52. HISTORY MANAGEMENT

Provide daily history and weekly history.

Support:

- View individual activities.
- View collection attempts.
- View partial collection attempts.
- View completed collection attempts.
- Edit recorded repetitions.
- Edit applicable notes.
- Delete individual sessions.
- Delete an entire collection attempt.
- Navigate to historical dates.

Requirements:

- Confirm destructive actions.
- Preserve unrelated sessions.
- Preserve inactive and archived activity names.
- Preserve original target snapshots.
- Preserve original tracking modes.
- Preserve historical collection criteria.

When a saved collection child is edited or deleted:

- Re-evaluate the collection using its original snapshot.
- Update COMPLETED or PARTIAL status transactionally.
- Refresh summaries.

If the last remaining recorded child is deleted, remove the empty finalized parent or use an equivalent documented consistent cleanup strategy.

Do not leave an empty finalized parent counted as a completed collection.

# 53. DAILY SUMMARY SERVICE

Implement centralized aggregation.

Required measurements:

```text
Total Repetitions =
SUM of valid finalized COUNTER repetitions

Total Sessions =
COUNT of finalized individual activity logs

Distinct Activities =
COUNT DISTINCT dhikr_item_id

Checklist Sessions =
COUNT of finalized CHECKLIST logs

Active Days =
COUNT DISTINCT dhikr_date

Completed Collections =
COUNT of distinct finalized COMPLETED collection sessions
```

Do not include:

- Draft counter values.
- Draft checklist values.
- Draft parent collections.
- Untouched collection items.
- Fictional completion data.

Avoid aggregation queries that multiply rows through collection joins.

Aggregate each measurement at its proper entity level.

# 54. DAILY SUMMARY EXAMPLE

Input:

```text
Tasbih: 33 repetitions
Tahmid: 33 repetitions
Takbir: 33 repetitions
Istighfar: 100 repetitions
```

Expected:

```text
Total Repetitions: 199
Total Sessions: 4
Distinct Activities: 4
Active Days: 1
Checklist Sessions: 0
```

Add one saved checklist activity:

```text
Total Repetitions: 199
Total Sessions: 5
Distinct Activities: 5
Active Days: 1
Checklist Sessions: 1
```

Assume the checklist activity has a different master activity ID.

# 55. COLLECTION SUMMARY EXAMPLE

Test fixture:

Required item A: 33.

Required item B: 33.

Required item C: 34.

One completed attempt:

```text
Total Repetitions: 100
Total Individual Sessions: 3
Completed Collections: 1
```

Two intentional completed attempts:

```text
Total Repetitions: 200
Total Individual Sessions: 6
Completed Collections: 2
```

Additional partial attempt:

```text
Item A: 33
Item B: 10
Item C: 0
```

Combined totals:

```text
Total Repetitions: 243
Total Individual Sessions: 8
Completed Collections: 2
Partial Collections: 1
```

This is a technical test fixture.

Actual religious collection requirements must use verified sources.

# 56. WEEKLY SUMMARY SERVICE

Reuse the existing week_start preference.

Support:

- Monday.
- Tuesday.
- Wednesday.
- Thursday.
- Friday.
- Saturday.
- Sunday.

Required weekly indicators:

- Total recorded repetitions.
- Total individual sessions.
- Distinct active days.
- Distinct activities.
- Checklist activity count.
- Completed morning collections.
- Completed evening collections.
- Completed post-prayer collections.
- Daily repetition distribution.
- Repetitions grouped by activity.

Count distinct activities across the entire period.

Do not calculate weekly distinct activities by adding daily distinct activity totals.

Do not count future dates as failed worship days.

Do not count draft-only dates as active days.

# 57. DZIKIR HISTORY SCREEN

Required visual structure:

1. Compact header.
2. Weekly period navigation.
3. Weekly summary.
4. Daily repetition chart.
5. Activity breakdown.
6. Completed collection breakdown.
7. Daily history list.
8. Manual recording shortcut.

Reuse existing lightweight chart components where possible.

Do not install a large chart framework solely for this module.

Requirements:

- Actual SQLite values.
- Dynamic chart scale.
- Localized date labels.
- Localized weekday labels.
- Accessible descriptions.
- Neutral zero-data states.
- Future dates visually distinct.
- Light and Dark Mode.

Selecting an eligible date opens the daily history or recording view.

# 58. DASHBOARD INTEGRATION

Activate the existing Dzikir Dashboard card.

Required content:

- Total saved repetitions today.
- Total saved individual sessions today.
- Distinct activities today.
- Completed collection status when available.

Provide navigation to:

- Dzikir Home.
- Digital Tasbih.
- Unfinished draft where applicable.

Example:

```text
Dzikir

199 kali
4 sesi
4 jenis dzikir

Dzikir pagi tercatat selesai

[ Mulai Berdzikir ]
```

Display completion indicators only when actual finalized data supports them.

Do not display draft counts as saved repetitions.

Preserve:

- Existing greeting.
- Shalat Wajib Dashboard.
- Shalat Sunnah Dashboard.
- Al-Qur'an Dashboard.
- Existing Quran Continue Reading shortcut.
- Existing Dashboard layout.

Do not redesign unrelated Dashboard sections.

# 59. TRACKER LANDING INTEGRATION

Activate the existing Dzikir shortcut under Ibadah.

Requirements:

- Opens Dzikir Home.
- Defaults to Today.
- Preserves existing navigation conventions.
- Preserves existing bottom navigation.
- Preserves hardware Back behavior.
- Avoids duplicate route definitions.

Do not modify the other three tracker workflows unnecessarily.

# 60. FUTURE PERSONAL GOALS FOUNDATION

Prepare reusable measurements for Phase 07.

Suggested type:

```typescript
export type DhikrMeasurement =
  | 'REPETITION_COUNT'
  | 'SESSION_COUNT'
  | 'ACTIVE_DAYS'
  | 'COLLECTION_COMPLETION';
```

Suggested filter:

```typescript
export interface DhikrMeasurementFilter {
  userId: string;

  startDate: string;
  endDate: string;

  activityId?: string;

  collectionId?: string;

  collectionCategory?:
    | 'MORNING'
    | 'EVENING'
    | 'POST_PRAYER';

  prayerContext?: DhikrPrayerContext;
}
```

Suggested service methods:

```typescript
sumRecordedRepetitions(filter)

countRecordedSessions(filter)

countDistinctActiveDays(filter)

countCompletedCollections(filter)
```

Measurement examples:

| Goal | Measurement |
|---|---|
| Istighfar 100 times daily | REPETITION_COUNT |
| Dzikir 1,000 times weekly | REPETITION_COUNT |
| Dzikir five days weekly | ACTIVE_DAYS |
| Complete morning dzikir daily | COLLECTION_COMPLETION |
| Complete post-prayer dzikir 20 times weekly | COLLECTION_COMPLETION |

Do not implement actual Personal Goals screens, scheduling, or recurring goal transactions during Phase 06.

# 61. STATE MANAGEMENT

Use the existing Zustand architecture only where justified.

Potential runtime state:

- Active draft ID.
- Active collection session ID.
- Current committed count.
- Pending mutation count.
- Selected activity.
- Selected date.
- Selected target.
- Current reading position.
- Pending save status.
- Error status.
- Summary invalidation.

Requirements:

- SQLite remains authoritative.
- Do not persist duplicate transaction records in Zustand.
- Avoid stale closure updates.
- Avoid cross-draft state contamination.
- Refresh after successful persistence.
- Reconcile after persistence failure.
- Avoid unnecessary exposure of private notes.

# 62. UI/UX DESIGN REQUIREMENTS

Follow the existing Hijra design system.

Design direction:

- Modern Islamic.
- Premium.
- Calm.
- Clean.
- Minimalist.
- Comfortable.
- Mobile-first.

Reference Light Mode palette:

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

Use actual centralized theme tokens.

Use existing Dark Mode equivalents.

Do not introduce a conflicting color system.

# 63. COMPONENT DIMENSIONS

Suggested React Native logical dimensions:

| Component | Specification |
|---|---|
| Screen padding | 16–20 |
| Screen title | 24 |
| Activity title | 16 |
| Secondary text | 12–13 |
| Icon size | 22–24 |
| Icon container | 38–40 |
| Card radius | 14–16 |
| Card padding | 12–16 |
| Card spacing | 8–12 |
| Summary main value | 26–32 |
| Counter diameter | Approximately 220–260 |
| Counter primary value | Approximately 52–64 |
| Minimum touch target | 48 |

Adapt to small screens and accessibility settings.

The Digital Tasbih counter must remain the primary visual focus.

Avoid unnecessary cards surrounding every small control.

Avoid fixed heights that clip content.

# 64. ICONOGRAPHY

Reuse the existing approved icon library.

Suggested icon concepts:

| Function | Icon |
|---|---|
| Dzikir | Fingerprint or approved tasbih icon |
| Morning | Sunrise |
| Evening | Sunset |
| Post-Prayer | Existing prayer icon |
| Favorite | Heart |
| Counter increment | Plus |
| Counter correction | Minus |
| Reset | RotateCcw |
| History | History |
| Personalization | SlidersHorizontal |
| Save | CheckCircle |
| Edit | Pencil |
| Delete | Trash2 |
| Haptic feedback | Vibrate |
| Resume draft | PlayCircle |

Use only available icons.

Do not introduce an unnecessary icon pack.

Do not use unsupported raw glyphs for production navigation icons.

# 65. ACCESSIBILITY

Requirements:

- Accessible counter increment label.
- Accessible decrement action.
- Accessible reset action.
- Accessible current count.
- Accessible target information.
- Accessible progress description.
- Minimum touch targets.
- Sufficient contrast.
- System font scaling.
- Safe area support.
- Keyboard-aware manual forms.
- Screen reader support.
- Correct Arabic RTL rendering.
- No horizontal overflow.

Avoid overwhelming screen reader users with unnecessary announcements during rapid counter tapping.

Use an appropriate accessible announcement strategy while preserving current count discoverability.

# 66. LOCALIZATION

Add or extend matching localization namespaces.

Suggested:

```text
src/locales/id/dhikr.json
src/locales/en/dhikr.json
```

Adapt to existing architecture.

Required translations:

| Indonesian | English |
|---|---|
| Dzikir | Dhikr |
| Digital Tasbih | Digital Tasbih |
| Mulai Berdzikir | Start Dhikr |
| Dzikir Hari Ini | Today's Dhikr |
| Dzikir Pagi | Morning Dhikr |
| Dzikir Petang | Evening Dhikr |
| Dzikir Setelah Shalat | Post-Prayer Dhikr |
| Dzikir Harian | Daily Dhikr |
| Dzikir Pilihanku | My Dhikr |
| Pengulangan | Repetitions |
| Total Sesi | Total Sessions |
| Jenis Dzikir | Dhikr Activities |
| Hari Aktif | Active Days |
| Target Sesi | Session Target |
| Bebas | Free Counter |
| Target Kustom | Custom Target |
| Kurangi | Decrease |
| Reset Hitungan | Reset Counter |
| Simpan Sesi | Save Session |
| Lanjutkan Dzikir | Continue Dhikr |
| Sesi Belum Disimpan | Unsaved Session |
| Rangkaian Selesai | Completed Collection |
| Rangkaian Sebagian | Partial Collection |
| Catat Manual | Manual Entry |
| Getaran | Haptic Feedback |
| Bacaan Sebelumnya | Previous Reading |
| Bacaan Selanjutnya | Next Reading |
| Referensi Bacaan | Reading Reference |
| Favorit | Favorites |
| Atur Dzikir | Manage Dhikr |

Also localize:

- Errors.
- Validation messages.
- Confirmation dialogs.
- Empty states.
- Loading states.
- Draft status.
- Retry actions.
- Accessibility descriptions.
- Date labels.
- Collection status.

Indonesian remains default and fallback.

Arabic religious content must remain unchanged when changing interface language.

Do not automatically translate user-created content.

# 67. PRIVACY REQUIREMENTS

All dzikir records remain local.

Do not introduce:

- External telemetry.
- Analytics SDKs.
- Advertising SDKs.
- Cloud storage.
- Online authentication.
- User tracking.
- Voice recording.
- Location permissions.
- Public worship activity sharing.

Do not expose private notes in logs.

Do not generate spiritual scores.

Do not rank religious merit.

Do not compare worship achievements between users.

Do not display negative failure indicators for days without recorded dzikir.

# 68. DEPENDENCY LICENSING

Prioritize existing dependencies.

All new software and assets must satisfy the mandatory licensing policy.

Preferred compatible licenses include:

- MIT.
- Apache-2.0.
- BSD-2-Clause.
- BSD-3-Clause.
- ISC.
- SIL Open Font License.
- Verified CC0.
- Verified public domain.

Evaluate attribution-based content licenses individually.

Review direct and transitive dependencies.

Preserve the existing approved MPL-2.0 exception only for:

- Lightning CSS.
- Required Lightning CSS platform binaries.
- Existing Expo/Metro build tooling.

Do not extend the exception to unrelated dependencies.

Avoid unnecessary:

- Dzikir npm packages.
- External religious content APIs.
- Chart frameworks.
- Additional state management packages.
- Additional date libraries.
- Additional icon libraries.
- Additional Arabic font packages.

# 69. BUSINESS RULES

BR-0601: Users can perform supported dzikir directly in Hijra.

BR-0602: Every accepted intentional counter tap increments exactly once.

BR-0603: Counter values cannot become negative.

BR-0604: Session targets are configurable.

BR-0605: Free Counter is supported.

BR-0606: Reaching the target does not stop counting.

BR-0607: Counter correction is supported.

BR-0608: Reset affects the current draft only.

BR-0609: Unfinished drafts persist locally.

BR-0610: Drafts are excluded from finalized statistics.

BR-0611: Draft finalization is atomic.

BR-0612: Multiple intentional sessions are supported.

BR-0613: COUNTER and CHECKLIST modes are supported.

BR-0614: Verified morning collections are supported.

BR-0615: Verified evening collections are supported.

BR-0616: Verified post-prayer collections are supported.

BR-0617: Custom activities belong to the local profile.

BR-0618: Favorite activities are supported.

BR-0619: Activity activation and deactivation are supported.

BR-0620: Inactive activities retain their historical records.

BR-0621: Haptic feedback is optional.

BR-0622: Historical recording is allowed.

BR-0623: Future recording is prohibited.

BR-0624: Checklist records do not fabricate repetitions.

BR-0625: Summaries use actual finalized SQLite records.

BR-0626: Weekly periods respect week_start.

BR-0627: No negative worship failure indicators.

BR-0628: No spiritual scoring.

BR-0629: All core functionality works offline.

BR-0630: Mandatory licensing policy applies.

BR-0631: Built-in religious content must be verified.

BR-0632: Duplicate submissions must be prevented.

BR-0633: Phase 01–05 functionality is preserved.

BR-0634: Dzikir does not modify prayer completion.

BR-0635: Bilingual interface and all theme modes are supported.

BR-0636: Collection completions are distinct from individual sessions.

BR-0637: Historical collection criteria are preserved.

BR-0638: Personal session targets cannot override verified collection completion criteria.

BR-0639: Collection child operations preserve parent identity.

BR-0640: Unverified optional translations may remain NULL.

BR-0641: Required collection content cannot be silently omitted.

BR-0642: Draft dates cannot change silently.

BR-0643: Stale counter operations cannot recreate finalized drafts.

BR-0644: Prayer context does not prove collection completion.

BR-0645: Dzikir Quran passages do not automatically create Quran reading transactions.

# 70. MANDATORY DEVELOPMENT TESTING

Execute applicable automated and runtime tests.

## 70.1 Content and Licensing

- Verify initial Arabic catalog.
- Verify source references.
- Verify morning collection.
- Verify evening collection.
- Verify post-prayer collections.
- Verify selected variations.
- Verify repetition requirements.
- Verify content redistribution rights.
- Verify optional missing translations.
- Verify Arabic font licensing.
- Verify offline attribution notices.

## 70.2 Counter

- New counter starts at zero.
- Single tap increments once.
- Rapid taps preserve every accepted increment.
- Decrement corrects count.
- Decrement at zero remains zero.
- Reset requires confirmation.
- Reset preserves saved history.
- Preset 33 works.
- Preset 99 works.
- Preset 100 works.
- Custom target works.
- Free Counter works.
- Invalid targets are rejected.
- Counter continues beyond target.
- Target completion does not automatically save.
- Zero-count save is rejected.
- Haptic preference persists.
- Unsupported haptics do not interrupt counting.

## 70.3 Draft

- Draft count persists.
- Draft restores after restart.
- Original draft date persists.
- Original activity persists.
- Original target persists.
- Keep Draft and Switch works.
- Save and Switch works.
- Discard and Switch requires confirmation.
- Failed write reconciles runtime state.
- Save waits for pending mutations.
- Stale writes cannot recreate finalized draft.
- Reset ordering is correct.
- Multiple drafts remain independent.

## 70.4 Standalone Sessions

- Save positive repetitions.
- Save multiple intentional sessions.
- Save identical intentional counts twice.
- Double-tap Save does not duplicate.
- Retry does not duplicate.
- Transaction rollback preserves draft.
- Checklist saves NULL repetition count.
- Unchecked checklist cannot save.
- Edit session.
- Delete session.
- Historical recording.
- Reject future dates.

## 70.5 Collections

- Start morning collection.
- Start evening collection.
- Start post-prayer collection.
- Select prayer context.
- Navigate between collection items.
- Preserve item-specific counts.
- Preserve repeated master-item occurrences.
- Resume collection after restart.
- Save partial collection.
- Save completed collection.
- Reject empty collection save.
- Optional items do not block completion.
- Missing required items block completion.
- Personal target cannot bypass completion.
- Repeated attempts remain independent.
- Parent and child ownership validation.
- Parent and child date consistency.
- Collection transaction rollback.
- Duplicate collection save protection.
- Edit saved collection item.
- Delete saved collection item.
- Recalculate collection completion.
- Delete entire collection.
- Preserve historical completion snapshot.

## 70.6 Integration

- Shalat Wajib shortcut.
- Correct prayer context.
- Correct historical prayer date.
- Prayer status remains unchanged.
- Dzikir Home summary.
- Dashboard summary.
- Tracker shortcut.
- Manual recording shortcut.
- Resume draft shortcut.
- Quran Reader remains operational.
- Quran bookmarks remain unchanged.
- Arabic font settings remain compatible.

## 70.7 General

- Indonesian interface.
- English interface.
- Light Mode.
- Dark Mode.
- System Mode.
- Offline operation.
- Application restart.
- Local midnight rollover.
- Week-start preferences.
- Accessibility.
- Database migration integrity.
- Phase 01–05 regression.

# 71. REQUIRED ACCEPTANCE TEST CASES

## TEST A — Daily Tasbih

Record Tasbih 33 times.

Expected:

```text
Saved Repetitions: 33
Saved Sessions: 1
Distinct Activities: 1
```

## TEST B — Multiple Sessions

Record Tasbih 33 times twice.

Expected:

```text
Saved Repetitions: 66
Saved Sessions: 2
Distinct Activities: 1
```

## TEST C — Persistent Draft

Record 87 repetitions.

Wait for persistence confirmation.

Terminate and reopen the application.

Expected:

```text
Draft Count: 87
Finalized Sessions: 0
Recorded Repetitions: 0
```

## TEST D — Rapid Counter

Execute 100 accepted rapid taps.

Expected:

```text
Persisted Count: 100
Lost Accepted Increments: 0
Duplicate Increments: 0
```

## TEST E — Target Exceeded

Target: 33.

Actual count: 40.

Expected:

```text
Current Count: 40
Target Reached: true
Finalized Sessions Before Save: 0
```

## TEST F — Checklist

Complete one checklist activity and save.

Expected:

```text
Repetition Count: NULL
Saved Sessions: 1
Active Days: 1
Numeric Repetition Total: 0
```

## TEST G — Partial Collection

Required test items:

33, 33, 34.

Actual counts:

33, 10, 0.

Expected:

```text
Recorded Repetitions: 43
Individual Logs: 2
Collection Status: PARTIAL
Completed Collections: 0
```

## TEST H — Completed Collection

Required test items:

33, 33, 34.

Actual counts:

33, 33, 34.

Expected:

```text
Recorded Repetitions: 100
Individual Logs: 3
Collection Status: COMPLETED
Completed Collections: 1
```

## TEST I — Incorrect Aggregate Completion

Required test items:

33, 33, 34.

Actual counts:

50, 50, 0.

Expected:

```text
Recorded Repetitions: 100
Collection Status: PARTIAL
Completed Collections: 0
```

## TEST J — Collection Snapshot

Complete a verified test collection.

Change the current master collection requirements in an isolated test environment.

Expected:

Historical completion remains based on the original snapshot.

## TEST K — Collection Child Deletion

Delete a required reading from a previously completed collection.

Expected:

- Individual log removed.
- Repetition total corrected.
- Collection status recalculated.
- Completed collection count corrected.
- Unrelated logs preserved.

## TEST L — Historical Recording

Record Istighfar 50 times yesterday.

Expected:

- Yesterday increases by 50.
- Today remains unchanged.

## TEST M — Free Counter Override

Master default target: 33.

User explicitly selects Free Counter.

Restart application.

Expected:

- Target remains NULL.
- Application does not revert to 33.

## TEST N — Atomic Rollback

Simulate a failure after inserting a finalized log but before closing its draft.

Expected:

- No finalized transaction remains.
- Original draft remains.
- Dashboard totals unchanged.

## TEST O — Duplicate Save

Trigger multiple Save requests for the same draft.

Expected:

- Exactly one finalized log.
- Correct repetition count.
- No duplicate history.
- No reopened draft.

## TEST P — Quran Regression

Open Al-Baqarah.

Expected:

- Basmalah remains unnumbered.
- Al-Baqarah ayah 1 remains correct.
- Arabic font and waqf marks remain correct.
- Existing reading history remains intact.
- Existing bookmark remains intact.

# 72. REGRESSION PROTECTION

Verify Phase 01:

- Application initialization.
- Existing SQLite migrations.
- Existing master data.
- Localization.
- Theme.
- Navigation.
- Third-party notices.

Verify Phase 02:

- Onboarding.
- Local profile.
- Avatar.
- Edit Profile.
- Language.
- Theme.
- Week start.
- Introduction replay.

Verify Phase 03:

- Five obligatory prayers.
- Prayer status.
- On-time tracking.
- Congregational tracking.
- Private notes.
- Historical records.
- Daily summary.
- Weekly history.
- Dashboard integration.

Verify Phase 04:

- Sunnah master data.
- Personalized activities.
- Custom activities.
- Quick Checklist.
- Multiple sessions.
- Rakaat.
- Prayer time.
- Notes.
- Daily summary.
- Weekly history.

Verify Phase 05:

- Complete 114-surah catalog.
- Complete Arabic Quran Reader.
- Harakat.
- Waqf marks.
- Correct Basmalah presentation.
- Correct numbered ayat.
- Arabic font configuration.
- Reading calculation.
- Cross-surah reading.
- Reading sessions.
- Bookmark.
- Continue Reading.
- Offline Quran reading.
- Dashboard integration.

Do not modify unrelated business logic.

# 73. TECHNICAL VERIFICATION

Run applicable project commands:

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
- Counter concurrency tests.
- Counter persistence tests.
- Draft restart tests.
- Transaction rollback tests.
- Duplicate submission tests.
- Collection completion tests.
- Historical snapshot tests.
- Date utility tests.
- Summary aggregation tests.
- Translation key consistency tests.
- Android bundle verification.
- iOS bundle verification.
- Existing regression tests.

Use the existing testing infrastructure.

Do not add unnecessary testing dependencies.

Fix detected issues and retest.

Clearly distinguish:

- Automated tests executed.
- Runtime checks executed.
- Android physical device checks.
- iOS physical device checks.
- Manual testing pending.
- Content verification pending.
- Licensing verification pending.

Do not fabricate passing results.

# 74. PROJECT DOCUMENTATION

Update existing documentation according to actual implementation:

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
docs/DHIKR_DATASET.md
docs/PHASE_06_CODEX_PROMPT.md
```

Document:

- Actual database migration version.
- Final database schema.
- Dataset sources.
- Content verification.
- Collection variations.
- Repetition criteria.
- License evidence.
- Arabic font reuse.
- Haptic dependency changes.
- Counter concurrency strategy.
- Draft persistence strategy.
- Draft durability guarantees and limitations.
- Stable operation identifiers.
- Atomic standalone save.
- Atomic collection save.
- Historical completion snapshots.
- Duplicate submission protection.
- Manual recording.
- Daily summary formulas.
- Weekly summary formulas.
- Dashboard integration.
- Future Goals compatibility.
- Test results.
- Known limitations.

Preserve existing Phase 01–05 documentation.

Formal UAT remains scheduled for Phase 12.

# 75. STRICT OUT OF SCOPE

Do not implement:

- Audio dzikir.
- Audio streaming.
- Voice recognition.
- Automatic speech-based counting.
- Scheduled notifications.
- Dzikir reminders.
- Prayer time calculation.
- GPS.
- Smartwatch integration.
- Leaderboards.
- Public activity sharing.
- Spiritual scoring.
- Personal Goals screens.
- Recurring Goals.
- Complete Reports & Analytics.
- Cloud backup.
- Cloud synchronization.
- Online authentication.
- Subscriptions.
- Payments.
- Advertising.

Do not start Phase 07 automatically.

# 76. DEVELOPMENT COMPLETION CRITERIA

Phase 06 may be marked DONE only when:

- Approved functionality is implemented.
- Mandatory built-in religious content is verified.
- Mandatory content licensing is verified.
- Digital Tasbih is functional.
- Counter reliability is verified.
- Draft persistence is verified.
- Counter Mode is functional.
- Checklist Mode is functional.
- Required morning collection is functional.
- Required evening collection is functional.
- Required post-prayer collection is functional.
- Partial and completed collections are accurately recorded.
- Transaction integrity is verified.
- Duplicate submission protection is verified.
- Custom activities are functional.
- Personalization is functional.
- Historical recording is functional.
- Daily summaries are accurate.
- Weekly summaries are accurate.
- Dashboard integration is complete.
- Offline operation is verified.
- Regression verification is complete.
- Critical bugs are resolved.
- Documentation is updated.

Optional transliterations and meanings may remain deferred when their rights cannot be verified.

Mandatory content licensing, religious content accuracy, and required collection availability remain completion gates.

Do not claim formal UAT PASS.

# 77. FINAL IMPLEMENTATION REPORT

Provide a structured report containing:

1. Implementation summary.
2. Existing project assessment.
3. Actual Expo SDK version.
4. Created and modified files.
5. Selected religious content sources.
6. Verified content editions.
7. Actual licensing evidence.
8. Verified built-in activities.
9. Morning collection contents and references.
10. Evening collection contents and references.
11. Post-prayer collection contents and references.
12. Verified repetition criteria.
13. Deferred optional content.
14. Actual database migration version.
15. Final database schema.
16. Master data seeding.
17. Repository implementation.
18. Digital Tasbih implementation.
19. Counter concurrency protection.
20. Rapid tapping test results.
21. Draft persistence implementation.
22. Draft restart test results.
23. Haptic implementation.
24. Counter Mode.
25. Checklist Mode.
26. Collection session implementation.
27. Historical completion snapshot implementation.
28. Atomic standalone save.
29. Atomic collection save.
30. Duplicate submission protection.
31. Custom activity management.
32. Favorite and personalization implementation.
33. Historical recording.
34. Daily summary.
35. Weekly summary.
36. Dashboard integration.
37. Shalat Wajib integration.
38. Future Goals compatibility.
39. UI/UX implementation.
40. Localization coverage.
41. Dependency changes.
42. Licensing verification.
43. TypeScript verification.
44. Lint verification.
45. Expo Doctor verification.
46. Android and iOS bundle verification.
47. Regression verification.
48. Physical device testing status.
49. Known limitations.
50. Manual testing instructions.

If all mandatory requirements and completion criteria are satisfied:

PHASE 06 DEVELOPMENT COMPLETE — DONE

If mandatory blockers remain:

PHASE 06 DEVELOPMENT INCOMPLETE — BLOCKERS REMAIN

Do not mark Phase 06 DONE solely because the Digital Tasbih counter works.

The approved guided dzikir functionality must also be operational.

# 78. FINAL INSTRUCTIONS

Implement Phase 06 directly in the existing Hijra workspace.

Do not only provide a theoretical implementation plan.

Follow Alissa's approved Development Brief.

Prioritize religious content integrity.

Verify actual content licensing.

Use verified Arabic readings.

Implement Digital Tasbih.

Implement reliable counter concurrency.

Persist unfinished drafts.

Implement verified guided dzikir collections.

Support Counter and Checklist modes.

Implement accurate collection completion.

Implement multiple intentional sessions.

Implement atomic draft finalization.

Prevent duplicate transactions.

Support personalized activities.

Support historical recording.

Implement daily and weekly summaries.

Integrate Dashboard and Shalat Wajib.

Preserve all existing Phase 01–05 functionality.

Maintain offline operation.

Maintain bilingual localization.

Maintain centralized theme management.

Maintain mandatory licensing compliance.

Do not reset the database.

Do not seed fictional worship records.

Do not introduce unnecessary dependencies.

Do not automatically commit or push.

Perform development testing.

Fix detected errors.

Retest.

Update project documentation.

Do not proceed beyond Phase 06.

BEGIN ACTUAL PHASE 06 IMPLEMENTATION NOW.