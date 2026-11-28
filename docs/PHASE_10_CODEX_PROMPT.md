# HIJRA - PHASE 10
# WEEKLY REFLECTION & WORSHIP HISTORY
# PRODUCT OWNER APPROVED

Act as a Senior React Native Developer,
Mobile Application Architect, TypeScript Engineer,
SQLite Database Engineer, Business Logic Engineer,
and Mobile UI/UX Designer.

Implement Phase 10 directly in the existing
Hijra application workspace.

Do not initialize a new project.

==================================================
1. PROJECT BASELINE
==================================================

Application: Hijra
Developer: Kalin Digital Studio
Tagline: Every day, a better journey.

Product principles:
LEARN - PRACTICE - GROW.

Technology:
- React Native
- Expo
- TypeScript
- Expo Router
- SQLite / expo-sqlite
- Zustand
- i18next
- Existing centralized theme
- Existing approved icon family

Database:
hijrah.db

Platforms:
Android and iOS.

Development environment:
Expo Go.

Languages:
Indonesian and English.

Appearance:
Light, Dark and System.

Methodology:
BUILD - TEST - FIX - RETEST.

Formal final UAT remains scheduled for Phase 12.

==================================================
2. CURRENT PROJECT CHECKPOINT
==================================================

Phase 01 - Application Foundation
Phase 02 - Onboarding & User Profile
Phase 03 - Shalat Wajib Tracker
Phase 04 - Shalat Sunnah Tracker
Phase 05 - Digital Quran & Reading Tracker
Phase 06 - Digital Dzikir & Tasbih Tracker
Phase 06B - Islamic Lifestyle Hub & MyQuran
Phase 07 - Personal Goals & Ibadah Planner
Phase 08 - Dashboard Integration
Phase 09 - Reports & Analytics

Phase 08:
14/14 Product Owner tests PASS.

Phase 09:
19/19 Product Owner tests PASS.

Phase 09A UI/UX Refinement:
PASS.

Preserve the approved Reports UI.

Current development milestone:
75%.

Target milestone after Phase 10 testing:
83.3%.

Quran Latin transliteration remains deferred.

Do not reopen previous enhancement scope.

==================================================
3. PRE-IMPLEMENTATION ASSESSMENT
==================================================

Inspect the actual workspace:

- git status and uncommitted changes.
- package.json and dependency lockfile.
- Actual Expo SDK version.
- Existing Laporan route and components.
- Existing Reports Aggregation Service.
- Dashboard Aggregation Service.
- Goal Calculation Engine.
- Existing tracker repositories.
- Existing activity history screens.
- Existing activity detail routes.
- Local profile ownership.
- SQLite schema and migrations.
- Local date utilities.
- Week Start preference.
- Theme tokens.
- Localization architecture.
- Existing testing infrastructure.

Reuse actual implementation conventions.

Do not assume proposed filenames or table names
are already present.

Do not overwrite Product Owner changes.

Do not install new dependencies.

Do not upgrade or downgrade Expo SDK.

==================================================
4. APPROVED DEVELOPMENT SCOPE
==================================================

Implement:

10.1 - Weekly Reflection Home.
10.2 - Automatic Weekly Worship Summary.
10.3 - Personal Feeling Check-in.
10.4 - Gratitude Journal.
10.5 - Challenges & Self Evaluation.
10.6 - Next Week Improvement Plan.
10.7 - Reflection History.
10.8 - Unified Worship History.
10.9 - History Filter & Activity Detail.
10.10 - Integration & Regression Testing.

All features must operate offline.

No new external API is approved.

No additional npm dependency is approved.

Do not start Phase 11.

==================================================
5. PRODUCT PRINCIPLES
==================================================

Weekly Reflection is a private,
optional self-reflection journal.

It is not:

- A religious merit assessment.
- A spiritual scoring system.
- A mental health diagnostic tool.
- A mandatory worship activity.
- A religious obligation.
- A competitive achievement system.

Do not infer faith or spiritual quality
from recorded activity counts or feelings.

Use supportive and neutral language.

Do not generate automatic judgments
about the user's personal reflections.

==================================================
6. NAVIGATION INTEGRATION
==================================================

Preserve existing bottom navigation:

- Beranda.
- Ibadah.
- Target.
- Laporan.
- Profil.

Do not add another bottom tab.

Add a new section to Reports Home:

Refleksi & Riwayat
Reflection & History

Place the new section after Detail Laporan
and before the existing supportive footer.

Required shortcuts:

1. Refleksi Mingguan.
2. Riwayat Ibadah.
3. Riwayat Refleksi.

Do not redesign existing report sections.

Preserve the approved Phase 09A UI.

Suggested new routes:

app/reports/reflection/
  index.tsx
  history.tsx
  detail.tsx

app/reports/worship-history/
  index.tsx
  detail.tsx

Adapt routes to actual Expo Router conventions.

Reuse existing routes where available.

==================================================
7. REPORTS HOME ADDITIONAL UI
==================================================

Implement the following structure:

+--------------------------------------+
| Existing Phase 09 Reports UI         |
| Preserve all existing sections       |
+--------------------------------------+
| REFLEKSI & RIWAYAT                    |
|                                      |
| [Forest Green Reflection Card]       |
| Refleksi Mingguan                    |
| Current week reflection status       |
| [Mulai / Lanjutkan Refleksi]          |
|                                      |
| [Icon] Riwayat Ibadah           >    |
| [Icon] Riwayat Refleksi         >    |
+--------------------------------------+
| Existing supportive footer           |
| Existing bottom navigation           |
+--------------------------------------+

Reflection card:

- Forest Green background.
- Small gold or light-green icon.
- Concise supporting description.
- Current week reflection status.
- Clear primary action.

When no reflection exists:
Mulai Refleksi.

When a reflection exists:
Lihat Refleksi.

Do not show a spiritual completion percentage.

Do not increase the height of existing
report controls unnecessarily.

==================================================
8. WEEKLY REFLECTION PERIOD
==================================================

Use existing local date conventions.

Weekly periods follow the user's
Week Start preference.

Store:

- Actual week start.
- Actual week end exclusive.
- Week Start preference snapshot.

Default:
Current calendar week.

Allow:

- Current week reflection.
- Historical week reflection.
- Previous and next week navigation.
- Return to current week.

Do not permit future week reflections.

Current week summary includes only dates
up to the current local date.

Clearly display:

Minggu berjalan
or
Minggu sebelumnya.

Do not show future days as missed activity.

==================================================
9. WEEK START CHANGE HANDLING
==================================================

Preserve previously saved reflection boundaries.

Do not shift historical reflection dates
when Week Start preference changes.

Existing reflections must remain accessible
using their original stored date ranges.

If a newly selected weekly period overlaps
an existing reflection:

- Offer access to the existing reflection.
- Do not silently create a duplicate.
- Do not automatically merge journal text.
- Do not rewrite existing period boundaries.

Start subsequent new reflections on
non-overlapping calendar week boundaries.

Clearly document the implemented
transition behavior.

Ensure a Week Start preference change
cannot create duplicate or ambiguous journals.

==================================================
10. AUTOMATIC WORSHIP SUMMARY
==================================================

Reuse Phase 09 Reports Aggregation Service.

Display selected weekly period data:

Shalat Wajib:
Completed / applicable prayers.

Shalat Sunnah:
Total saved sessions.

Al-Quran:
Total saved ayat.

Dzikir & Tasbih:
Total actual saved repetitions.

Optionally display a compact goal summary
using existing Phase 07 and Phase 09 services.

Do not introduce a duplicate calculation engine.

Respect all existing tracker semantics.

Preserve EXEMPT and NOT_LOGGED behavior.

Exclude drafts.

Do not count unnumbered Basmalah.

Do not count collection parents twice.

Do not infer missing rakaat or duration.

Use actual historical data.

==================================================
11. REFLECTION SUMMARY CONSISTENCY
==================================================

Use live derived worship summaries.

Reflection text is persisted separately
from worship transaction statistics.

When an existing worship transaction is
corrected or deleted:

The weekly summary must reflect
the corrected authoritative data.

The user's saved journal content
must remain unchanged.

Do not store unnecessary duplicate
worship summary snapshots.

Clearly label the summary as based on
currently available saved records.

==================================================
12. PERSONAL FEELING CHECK-IN
==================================================

Implement an optional single-choice
weekly feeling selection.

Supported stable values:

DIFFICULT
OKAY
GOOD
HAPPY
CALM

Indonesian labels:

Berat
Cukup
Baik
Senang
Tenang

English labels:

Difficult
Okay
Good
Happy
Calm

Use five accessible emoji or existing
approved icon-based choices.

No default feeling selection.

Allow users to change or clear
their selection.

Do not store feelings as numeric scores.

Do not calculate mood trends or
mental health diagnoses in Phase 10.

Do not relate feeling values to
religious achievement percentages.

==================================================
13. GRATITUDE JOURNAL
==================================================

Add an optional multiline input.

Label:

Apa yang saya syukuri minggu ini?

English:

What am I grateful for this week?

Placeholder:

Tuliskan hal baik yang kamu rasakan
minggu ini.

Allow natural personal writing.

Do not automatically generate
or evaluate the journal content.

==================================================
14. CHALLENGES AND SELF EVALUATION
==================================================

Add an optional multiline input.

Label:

Apa tantangan saya minggu ini?

English:

What challenges did I face this week?

Use neutral and non-judgmental language.

Do not require disclosure of personal,
emotional or religious difficulties.

==================================================
15. NEXT WEEK IMPROVEMENT PLAN
==================================================

Add an optional multiline input.

Label:

Apa yang ingin saya tingkatkan?

English:

What would I like to improve?

Placeholder:

Rencana kecil untuk minggu berikutnya.

Treat this as a private personal note.

Do not automatically create,
edit or activate Personal Goals.

Do not automatically schedule reminders.

An optional navigation shortcut to
the existing Target menu is permitted.

Opening that shortcut must not create
any goal or worship transaction.

==================================================
16. SAVE REFLECTION RULES
==================================================

All reflection fields are individually optional.

Require at least one meaningful value:

- Selected feeling, or
- Non-empty gratitude text, or
- Non-empty challenges text, or
- Non-empty improvement plan.

Trim unnecessary surrounding whitespace.

Reject an entirely empty reflection.

Suggested technical limit:
5,000 characters per multiline field.

Display clear validation messages.

Use explicit Save action.

Prevent duplicate save submissions.

Save atomically in SQLite.

If saving fails:

Preserve current unsaved input.
Display a recoverable error.

Do not claim successful saving until
the database transaction succeeds.

==================================================
17. EDIT AND DELETE REFLECTION
==================================================

Allow reopening existing reflections.

Allow editing:

- Feeling.
- Gratitude.
- Challenges.
- Improvement plan.

Update the same stable reflection ID.

Preserve original created_at.

Update updated_at after successful save.

Do not create a new reflection record
for each edit.

Protect unsaved changes when navigating away
using the existing application conventions.

Allow deleting a reflection with
explicit confirmation.

Deleting a reflection must not delete:

- Worship transactions.
- Personal goals.
- Goal history.
- Quran bookmarks.
- Dzikir drafts.
- User settings.

==================================================
18. DATABASE DESIGN
==================================================

Use existing hijrah.db.

Proposed new table:

weekly_reflections

Suggested fields:

id                       TEXT PRIMARY KEY
user_id                  TEXT NOT NULL
week_start               TEXT NOT NULL
week_end_exclusive       TEXT NOT NULL
week_start_preference    INTEGER NOT NULL
feeling                  TEXT NULL
gratitude                TEXT NULL
challenges               TEXT NULL
improvement_plan         TEXT NULL
created_at               TEXT NOT NULL
updated_at               TEXT NOT NULL

Add a foreign key using the actual
existing local profile convention.

Add appropriate constraints and indexes.

Suggested unique constraint:

user_id,
week_start,
week_end_exclusive.

Use transactional service validation
to prevent overlapping reflection periods.

Validate:

- Valid local date boundaries.
- Supported feeling values.
- At least one meaningful reflection field.
- User ownership.

Do not create a duplicate
worship history transaction table.

Adapt the proposed schema to existing
database conventions where necessary.

Document the actual schema.

==================================================
19. DATABASE MIGRATION SAFETY
==================================================

Create a non-destructive versioned migration.

Preserve:

- Existing user profiles.
- Existing application settings.
- Existing worship records.
- Quran bookmarks.
- Dzikir logs and drafts.
- Dzikir collection snapshots.
- Personal goals and historical versions.
- Existing permitted Islamic content cache.

Do not reset hijrah.db.

Do not clear Expo Go application data.

Do not insert fictional reflections
or worship transactions.

Do not automatically create a reflection
for each historical week.

==================================================
20. WEEKLY REFLECTION UI
==================================================

Follow this exact visual hierarchy:

1. Back navigation and title.
2. Short supporting description.
3. Compact week navigation.
4. Forest Green weekly summary card.
5. Refleksi Saya section title.
6. Optional feeling selector.
7. Gratitude input card.
8. Challenges input card.
9. Improvement plan input card.
10. Primary Save button.
11. Privacy information card.

Visual reference:

+--------------------------------------+
| < Refleksi Mingguan                  |
| Luangkan waktu untuk refleksi        |
+--------------------------------------+
| < 16 - 22 November 2026 >            |
+--------------------------------------+
| RINGKASAN IBADAH                     |
| Forest Green background              |
|                                      |
| Shalat Wajib     Shalat Sunnah       |
| 30/35            12 sesi             |
|                                      |
| Al-Quran         Dzikir              |
| 235 ayat         1250 kali           |
+--------------------------------------+
| REFLEKSI SAYA                        |
| Bagaimana perasaanmu minggu ini?     |
| [Five compact feeling options]       |
+--------------------------------------+
| Apa yang saya syukuri?               |
| [Multiline input]                    |
+--------------------------------------+
| Apa tantangan saya?                  |
| [Multiline input]                    |
+--------------------------------------+
| Apa yang ingin saya tingkatkan?      |
| [Multiline input]                    |
+--------------------------------------+
| [Simpan Refleksi]                    |
| [Privacy information]                |
+--------------------------------------+

All sample statistics are illustrative.

Use actual saved user data.

Do not hardcode the sample values.

==================================================
21. REFLECTION HISTORY
==================================================

Create a dedicated history screen.

Display saved reflections in
reverse chronological weekly order.

Each card contains:

- Actual week date range.
- Selected feeling, when available.
- Last updated date.
- Concise reflection preview.
- Detail navigation.

Avoid displaying long personal notes
in summary cards.

Use neutral placeholders if a field
was not completed.

Allow filtering by calendar year
or available date range.

Provide empty state:

"Belum ada refleksi tersimpan."

Primary action:
Mulai Refleksi.

Do not automatically generate empty
reflection history entries.

==================================================
22. REFLECTION DETAIL
==================================================

Open an existing saved reflection.

Display:

- Original weekly date range.
- Current derived worship summary.
- Saved feeling.
- Saved gratitude.
- Saved challenges.
- Saved improvement plan.
- Created date.
- Updated date.

Provide Edit and Delete actions.

Do not evaluate the contents.

Do not modify existing reflection boundaries.

Do not change the journal automatically
when the worship summary is refreshed.

==================================================
23. UNIFIED WORSHIP HISTORY
==================================================

Implement one chronological,
read-only activity history.

Data sources:

1. Shalat Wajib records.
2. Shalat Sunnah saved sessions.
3. Quran saved reading logs.
4. Dzikir saved individual logs.
5. Finalized Dzikir collection sessions.

Reuse existing repositories.

Reuse Dashboard recent-activity
normalization where appropriate.

Do not create a second tracking system.

Do not create duplicate transaction tables.

==================================================
24. HISTORY RECORD NORMALIZATION
==================================================

Suggested shared presentation model:

WorshipHistoryItem:

- sourceCategory
- sourceRecordId
- activityDate
- actualActivityTime
- recordedAt
- title
- subtitle
- status
- metricValue
- metricUnit
- detailRoute
- detailParameters

Use stable source identifiers.

Preserve source record identity.

Ensure all records belong to
the active local user.

Do not invent absent values.

The history model is a derived
presentation model, not a new
authoritative transaction record.

==================================================
25. SHALAT WAJIB HISTORY
==================================================

Include explicitly recorded statuses:

COMPLETED
MISSED
EXEMPT

Display:

- Prayer name.
- Recorded date.
- Actual recorded time, if available.
- Status.
- On-time attribute, if available.
- Congregation attribute, if available.

Do not generate fake history entries
for absent or NOT_LOGGED prayer slots.

Do not treat a prayer schedule time as
the actual time the prayer was performed.

Do not infer missing optional attributes.

Use neutral status wording.

==================================================
26. SHALAT SUNNAH HISTORY
==================================================

Include saved Sunnah sessions.

Display:

- Activity name.
- Local date.
- Actual recorded time, if available.
- Recorded rakaat, if known.

Preserve multiple sessions on one date.

Support custom Sunnah activities.

Preserve archived historical activity names.

Do not assume missing rakaat.

Do not merge separate sessions
into a single transaction.

==================================================
27. QURAN HISTORY
==================================================

Include saved Quran reading logs.

Display:

- Reading date.
- Starting surah and ayah.
- Ending surah and ayah.
- Authoritative total ayat count.
- Recorded duration, if available.

Support cross-surah sessions.

Repeated intentional reading sessions
remain independent history records.

Do not count:

- Opening Quran Reader.
- Scrolling.
- Bookmark changes.
- Unnumbered introductory Basmalah.
- Unsaved reading selections.

Do not modify Quran content or Reader UI.

==================================================
28. DHIKR HISTORY
==================================================

Include saved individual Dzikir logs.

Display:

- Activity name.
- Actual saved repetitions when applicable.
- Checklist completion when applicable.
- Recorded date.
- Actual recorded time, if available.

Exclude drafts.

Checklist-only activities must not display
fictional repetition values.

Preserve custom and archived
historical activity names.

==================================================
29. DHIKR COLLECTION HISTORY
==================================================

Represent a finalized collection as
one top-level history item.

Support:

COMPLETED
PARTIAL

Exclude DRAFT collections.

Display:

- Collection name.
- Recorded date.
- Finalized collection status.
- Recorded repetition summary where applicable.
- Existing child activity detail.

Do not also display its child logs
as duplicate top-level feed entries.

Standalone Dzikir logs remain independent.

Use existing collection snapshots.

Do not introduce new religious
collection completion rules.

==================================================
30. HISTORY FILTERS
==================================================

Support category filters:

- Semua Aktivitas.
- Shalat Wajib.
- Shalat Sunnah.
- Al-Quran.
- Dzikir & Tasbih.

Support date filters:

- Today.
- Current week.
- Current month.
- Custom date range.

Use existing local date and
Week Start utilities.

Validate start and end dates.

Do not allow future custom dates.

Preserve selected filters
when opening and returning
from activity details.

Use the current week as the default.

==================================================
31. HISTORY SORTING
==================================================

Group records by local activity date.

Display latest date first.

For the same date:

Use actual recorded activity time
when consistently available.

Otherwise use a reliable recorded
timestamp for ordering where available.

Apply a deterministic tie-breaker
using category and source record ID.

Do not label the record creation time
as the actual worship time.

If no reliable activity time exists:

Display the date without a fabricated time.

==================================================
32. WORSHIP HISTORY UI
==================================================

Required layout:

1. Back navigation and title.
2. Short supporting description.
3. Compact date range card.
4. Category filter.
5. Record count.
6. Date-grouped chronological activity cards.

Visual reference:

+--------------------------------------+
| < Riwayat Ibadah                     |
| Setiap aktivitas berarti             |
+--------------------------------------+
| [Forest Green Date Range Card]       |
| 23 - 28 November 2026                |
+--------------------------------------+
| [Semua Aktivitas v]                  |
| Actual record count                  |
+--------------------------------------+
| 28 November 2026                     |
| [Icon] Shalat Dhuha          06:30  |
|        2 rakaat                 >   |
|                                      |
| [Icon] Membaca Al-Quran      05:40  |
|        Al-Baqarah 31-45         >   |
|                                      |
| [Icon] Dzikir Pagi           05:15  |
|        Rangkaian lengkap        >   |
+--------------------------------------+
| 27 November 2026                     |
| [More actual saved activities]       |
+--------------------------------------+

Use actual saved records.

No fictional sample data in production.

==================================================
33. ACTIVITY DETAIL NAVIGATION
==================================================

Reuse existing activity detail
routes where available.

If no detail route exists,
implement a compact read-only detail view.

Display actual source record data.

Provide a shortcut to the existing
tracker when appropriate.

Any editing or deletion must be
performed through the existing
authoritative tracker flow.

Do not implement duplicate editing
and deletion business logic.

If the original record no longer exists:

Show a clear unavailable state
and refresh history.

==================================================
34. HISTORY PERFORMANCE
==================================================

Support efficient history loading.

Use bounded date-range queries.

Use pagination or efficient incremental
list rendering for large histories.

Avoid loading the entire database
on application startup.

Avoid N+1 query patterns.

Use parameterized queries.

Apply stable sorting and pagination.

Do not install new dependencies.

Do not create persistent duplicate
history records for performance.

==================================================
35. AUTOMATIC REFRESH
==================================================

Refresh relevant views when:

- Screen gains focus.
- Application resumes.
- Selected date range changes.
- Category filter changes.
- Local date changes.
- Week Start preference changes.
- Relevant tracker transactions change.
- Reflection is saved, edited or deleted.

Reuse existing invalidation mechanisms.

A historical transaction correction
must update the derived history and
reflection summary.

Do not overwrite unsaved journal input
when refreshing statistics.

==================================================
36. PRIVACY AND OFFLINE BEHAVIOR
==================================================

All Phase 10 features must work offline.

Do not transmit:

- Personal feelings.
- Gratitude journal.
- Challenges.
- Improvement plans.
- Worship history.
- Private worship notes.

Do not log journal text to console,
analytics or crash-reporting systems.

Do not send journal content to
external AI services.

Do not expose private journal text
on Beranda or public previews.

Do not claim encryption or biometric
protection unless actually implemented.

Display an accurate privacy notice:

Catatan refleksi disimpan secara lokal
dan tidak dikirimkan oleh Hijra
ke server.

Preserve existing local profile isolation.

Backup and Restore implementation
remains scheduled for Phase 11.

==================================================
37. UI/UX DESIGN SYSTEM
==================================================

Reuse the successful Phase 08
and refined Phase 09A visual style.

Reference colors:

Primary:        #174638
Secondary:      #769B87
Accent:         #C7A76C
Background:     #F7F8F3
Surface:        #FFFFFF
Text Primary:   #20312A
Text Secondary: #64748B
Border:         #E2E8E3

Use existing centralized theme tokens.

Reference dimensions:

Screen padding:      14-16 dp
Main heading:        24-28
Section heading:     16-18
KPI values:          24-28
Body text:           14-16
Secondary text:      12-13
Card radius:         14-16
Card padding:        12-16
Card gap:            8-10
Section gap:         12-16
Icon size:           20-24
Minimum touch area:  48 dp

Design direction:

Modern Islamic.
Premium.
Calm.
Personal.
Compact.
Beginner-friendly.

Avoid generic form-heavy appearance.

Avoid oversized date controls.

Avoid excessive vertical whitespace.

Do not repeat the previous Phase 09
visual conformity issue.

==================================================
38. LOCALIZATION AND ACCESSIBILITY
==================================================

Support Indonesian and English.

Required labels:

Refleksi Mingguan / Weekly Reflection
Refleksi Saya / My Reflection
Ringkasan Ibadah / Worship Summary
Riwayat Refleksi / Reflection History
Riwayat Ibadah / Worship History
Simpan Refleksi / Save Reflection
Edit Refleksi / Edit Reflection
Hapus Refleksi / Delete Reflection
Mulai Refleksi / Start Reflection
Lihat Refleksi / View Reflection
Catatan Pribadi / Private Journal
Minggu Berjalan / Current Week
Semua Aktivitas / All Activities

Localize:

- Dates and number formats.
- Feeling labels.
- Journal prompts.
- Status labels.
- Empty states.
- Form errors.
- Confirmation messages.
- Accessibility descriptions.

Support Light, Dark and System.

Support text scaling and keyboard
avoidance on Android and iOS.

Provide screen reader labels
for emoji or icon-based choices.

Ensure inputs remain visible
when the keyboard opens.

==================================================
39. MANDATORY ACCEPTANCE TESTS
==================================================

TEST A - CREATE REFLECTION

Create a reflection with gratitude text.

Expected:
One saved reflection for the selected week.

TEST B - OPTIONAL FIELDS

Leave all fields except feeling empty.

Expected:
Saving is permitted.

TEST C - EMPTY REFLECTION

Leave all fields empty.

Expected:
Saving is prevented.

TEST D - EDIT REFLECTION

Edit an existing saved reflection.

Expected:
Same record ID.
Updated content.
Original created_at preserved.

TEST E - DUPLICATE PREVENTION

Submit the same reflection repeatedly.

Expected:
No duplicate records.

TEST F - WEEKLY SUMMARY

Compare reflection summary with
Phase 09 report for the same dates.

Expected:
Matching actual statistics.

TEST G - HISTORICAL CORRECTION

Correct a worship transaction.

Expected:
Summary updates.
Saved journal text remains unchanged.

TEST H - WEEK START CHANGE

Change Week Start preference.

Expected:
Historical reflection dates remain intact.
No overlapping duplicate reflections.

TEST I - DELETE REFLECTION

Delete one reflection.

Expected:
Only the selected reflection is removed.
All worship transactions remain intact.

TEST J - HISTORY FILTERS

Select each worship category
and different date ranges.

Expected:
Only matching saved source records appear.

TEST K - SHALAT WAJIB HISTORY

Include COMPLETED, MISSED and EXEMPT records.

Expected:
Correct explicit statuses.
No fabricated NOT_LOGGED transactions.

TEST L - QURAN HISTORY

Save a cross-surah reading session.

Expected:
Correct start, end and ayah count.

TEST M - DHIKR HISTORY

Create a draft and finalize
a separate saved Dzikir activity.

Expected:
Only saved activity appears.

TEST N - COLLECTION HISTORY

Finalize a collection with child logs.

Expected:
One top-level collection item.
Children accessible through details.
No duplicate top-level records.

TEST O - MISSING ACTIVITY TIME

Use a source record without
actual activity time.

Expected:
No fabricated worship time.

TEST P - OFFLINE

Disable internet connection.

Expected:
Reflection and worship history
remain fully functional.

TEST Q - PRIVACY

Inspect network and logging behavior.

Expected:
No journal content transmitted
or logged by Phase 10.

TEST R - REOPEN APP

Save reflection, close and reopen app.

Expected:
Saved reflection persists.

==================================================
40. REGRESSION TESTING
==================================================

Preserve all existing functionality.

Verify:

- Profile and settings.
- Shalat Wajib Tracker.
- EXEMPT and NOT_LOGGED semantics.
- Shalat Sunnah sessions.
- Quran Reader.
- Quran Arabic text.
- Harakat and waqf marks.
- Basmalah numbering.
- Quran Reading Tracker.
- Quran bookmarks.
- Continue Reading.
- Digital Tasbih.
- Dzikir drafts.
- Dzikir collections.
- Islamic Lifestyle Hub.
- Prayer schedule.
- Qibla.
- Islamic calendar.
- Hadith.
- Doa Harian.
- Asmaul Husna.
- Personal Goals.
- Goal versioning.
- Dashboard Integration.
- Reports & Analytics.
- Phase 09A approved UI.

Do not redesign previous modules.

Fix regressions introduced by Phase 10.

Document unrelated pre-existing issues
without expanding development scope.

==================================================
41. TECHNICAL VERIFICATION
==================================================

Run applicable scripts from package.json.

Expected checks where supported:

npm run typecheck
npm run lint
npx expo-doctor

Run applicable automated tests:

- Database migration.
- Reflection repository.
- User ownership.
- Duplicate prevention.
- Week Start changes.
- Reflection validation.
- Reflection persistence.
- History filtering.
- History sorting.
- Collection deduplication.
- Report summary consistency.
- Regression testing.

Use existing testing infrastructure.

Use isolated test fixtures.

Do not erase Product Owner records.

Do not fabricate test results.

Distinguish:

- Automated tests.
- Emulator tests.
- Physical device tests.
- Product Owner testing.

==================================================
42. DOCUMENTATION
==================================================

Update existing documentation:

README.md
docs/DEVELOPMENT_ROADMAP.md
docs/ARCHITECTURE.md
docs/BUSINESS_RULES.md
docs/DATABASE_SCHEMA.md
docs/UI_UX_GUIDELINES.md
docs/DEVELOPMENT_PROGRESS.md
docs/UAT_CHECKLIST.md

Create:

docs/WEEKLY_REFLECTION.md
docs/WORSHIP_HISTORY.md
docs/PHASE_10_CODEX_PROMPT.md

Document:

- Approved development scope.
- Actual database schema.
- Reflection period rules.
- Week Start handling.
- Reflection validation.
- Save, edit and delete behavior.
- Live summary calculation.
- History normalization.
- Activity sorting.
- Collection deduplication.
- Offline behavior.
- Privacy behavior.
- UI implementation.
- Actual testing results.
- Known limitations.
- Remaining blockers.

Preserve Quran Latin transliteration backlog.

Preserve production content licensing,
religious content review and
pentashihan requirements.

Document weekly_reflections as a
required user-data source for the
future Phase 11 Backup & Restore.

==================================================
43. STRICT OUT OF SCOPE
==================================================

Do not implement:

- AI-generated personal reflections.
- AI religious advice.
- Mood analysis or diagnosis.
- Mood trend analytics.
- Spiritual scoring.
- Gamification.
- Streaks.
- Achievement badges.
- Reflection reminders.
- Push notifications.
- Social sharing.
- Journal export.
- PDF or Excel reports.
- Online journal synchronization.
- Cloud backup.
- Authentication.
- Payments.
- Subscription features.
- Advertisements.
- Quran Latin transliteration.
- Quran audio.
- New Islamic content providers.
- Backup and Restore.
- Final production release.

Do not start Phase 11.

==================================================
44. FINAL IMPLEMENTATION REPORT
==================================================

Provide:

1. Phase 10 implementation summary.
2. Created and modified files.
3. Actual database migration.
4. Reflection period implementation.
5. Week Start change handling.
6. Weekly summary integration.
7. Feeling check-in.
8. Gratitude journal.
9. Challenges journal.
10. Improvement plan.
11. Reflection persistence.
12. Edit and delete behavior.
13. Reflection history.
14. Unified worship history.
15. Date and category filters.
16. Activity detail navigation.
17. Collection deduplication.
18. Offline verification.
19. Privacy verification.
20. UI conformity.
21. Any UI deviations and reasons.
22. Database migration verification.
23. Dependency change verification.
24. Localization verification.
25. Theme verification.
26. TypeScript verification.
27. Lint verification.
28. Expo Doctor verification.
29. Automated test results.
30. Regression test results.
31. Physical device testing status.
32. Known limitations.
33. Remaining blockers.
34. Product Owner testing instructions.

Provide status for 10.1 through 10.10.

Possible final development status:

PHASE 10 DEVELOPMENT COMPLETE -
READY FOR PRODUCT OWNER TESTING

OR:

PHASE 10 DEVELOPMENT INCOMPLETE -
BLOCKERS REMAIN.

Do not claim formal UAT PASS.

==================================================
45. FINAL INSTRUCTIONS
==================================================

Implement Phase 10 directly in the
existing Hijra workspace.

Add Weekly Reflection.

Add Reflection History.

Add Unified Worship History.

Reuse existing Reports Aggregation Service.

Reuse existing tracker repositories.

Maintain the approved Phase 09A UI.

Maintain accurate local worship data.

Maintain private journal storage.

Maintain full offline functionality.

Do not install new dependencies.

Do not create duplicate transaction tables.

Do not reset hijrah.db.

Do not overwrite historical worship records.

Do not automatically commit or push.

Do not start Phase 11.

BUILD - TEST - FIX - RETEST.

BEGIN PHASE 10 IMPLEMENTATION NOW.