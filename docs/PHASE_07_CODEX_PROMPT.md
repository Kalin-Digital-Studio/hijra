# HIJRA - PHASE 07
# PERSONAL GOALS & IBADAH PLANNER
# PRODUCT OWNER APPROVED

Act as a Senior React Native Developer,
Mobile Application Architect,
TypeScript Engineer,
SQLite Database Engineer,
Business Logic Engineer,
and Mobile UI/UX Designer.

Implement Phase 07 of the existing Hijra application.

The Product Owner has approved the complete Phase 07
business scope and UI/UX direction.

Activate the existing Target bottom navigation menu
and implement a comprehensive Personal Goals
and Ibadah Planner module.

Perform actual implementation directly in the
existing workspace.

Do not initialize a new project.

Do not provide only theoretical recommendations.

==================================================
1. PROJECT INFORMATION
==================================================

Application: Hijra
Developer: Kalin Digital Studio
Tagline: Every day, a better journey.

Product principles:

LEARN - PRACTICE - GROW.

Phase 07 represents the GROW component.

Existing technology:

- React Native
- Expo
- TypeScript
- Expo Router
- SQLite
- expo-sqlite
- Zustand
- i18next
- Existing centralized theme
- Existing approved icon library

Database:

hijrah.db

Supported platforms:

- Android
- iOS

Supported development environment:

- Expo Go

Supported languages:

- Indonesian (default)
- English

Supported appearance:

- Light
- Dark
- System

Development methodology:

BUILD - TEST - FIX - RETEST.

Formal Product Owner UAT remains scheduled
for Phase 12.

==================================================
2. CURRENT PROJECT CHECKPOINT
==================================================

Previous development:

Phase 01 - Application Foundation
Phase 02 - Onboarding & User Profile
Phase 03 - Shalat Wajib Tracker
Phase 04 - Shalat Sunnah Tracker
Phase 05 - Digital Quran & Reading Tracker
Phase 06 - Digital Dzikir & Tasbih Tracker
Phase 06B - Islamic Lifestyle Hub & MyQuran

Phase 06 and its enhancement scope are closed.

Do not expand previous development scope.

Preserve unresolved verification and production
licensing requirements in existing documentation.

Quran Latin transliteration is deferred.

Do not resume Quran transliteration research
or implementation during Phase 07.

==================================================
3. PRE-IMPLEMENTATION ASSESSMENT
==================================================

Before implementing:

- Execute git status.
- Inspect current uncommitted changes.
- Inspect package.json.
- Inspect dependency lockfile.
- Identify actual Expo SDK.
- Inspect existing project structure.
- Inspect existing Expo Router routes.
- Inspect existing Target navigation.
- Inspect user profile architecture.
- Inspect app_settings.
- Inspect SQLite migrations.
- Inspect database schema.
- Inspect local date utilities.
- Inspect Week Start preferences.
- Inspect existing theme tokens.
- Inspect localization architecture.
- Inspect existing reusable UI components.
- Inspect existing chart components.
- Inspect existing tracker repositories.
- Inspect existing Dashboard services.
- Inspect existing testing infrastructure.
- Inspect licensing documentation.

Identify actual transaction tables and fields for:

1. Shalat Wajib.
2. Shalat Sunnah.
3. Quran Reading.
4. Dzikir and Tasbih.
5. Dzikir Collection Sessions.

Do not assume proposed table names match
the actual implementation.

Do not overwrite Product Owner changes.

Do not interrupt concurrent development tasks.

Preserve all existing functionality.

Do not install new npm dependencies.

Do not upgrade or downgrade Expo SDK.

==================================================
4. APPROVED DEVELOPMENT SCOPE
==================================================

Implement:

07.1 - Target Home.
07.2 - Recommended Goal Templates.
07.3 - Create Personal Goal.
07.4 - Goal Calculation Engine.
07.5 - Daily, Weekly and Monthly Recurring Goals.
07.6 - Goal Detail and Progress.
07.7 - Edit, Pause and Archive Goal.
07.8 - Goal Achievement History.
07.9 - Existing Tracker Integration.
07.10 - Integration and Regression Testing.

All ten development scope items are approved.

The module must operate entirely offline.

No external API is required.

No new dependency is approved.

==================================================
5. BUSINESS OBJECTIVES
==================================================

Help users:

- Establish personal worship goals.
- Start with manageable daily habits.
- Build consistency.
- Monitor actual progress.
- Understand previous achievements.
- Adjust targets according to personal ability.

Personal goals are self-management tools.

Do not represent goal achievements as
religious merit, spiritual ranking,
or measurement of faith.

Use supportive and non-judgmental language.

Suggested wording:

- Alhamdulillah, target tercapai.
- Teruslah bertumbuh.
- Mulailah dari yang mampu kamu lakukan.
- Target belum tercapai.
- Tidak berlaku.

Do not use judgmental failure labels.

==================================================
6. EXISTING NAVIGATION
==================================================

Preserve the existing bottom navigation:

- Beranda.
- Ibadah.
- Target.
- Laporan.
- Profil.

Activate Target.

Do not add another bottom navigation tab.

Do not redesign Beranda.

Do not redesign Ibadah.

Do not implement the complete Laporan module.

Suggested route structure:

app/
  (tabs)/
    goals.tsx
  goals/
    create.tsx
    templates.tsx
    detail.tsx
    edit.tsx
    history.tsx
    manage.tsx

Adapt routes to existing Expo Router conventions.

Reuse the existing Target route when available.

All route parameters must be validated.

==================================================
7. ARCHITECTURAL PRINCIPLES
==================================================

The existing four worship trackers remain
the authoritative transaction sources.

Goal Calculation Engine reads existing
saved worship transactions.

Personal Goals must never create additional
worship transaction records.

Architecture:

Existing Worship Trackers
        |
        v
Existing SQLite Transaction Tables
        |
        v
Goal Calculation Engine
        |
        v
Personal Goals and Goal Periods
        |
        v
Target Home, Goal Detail and History

Do not create a duplicate worship tracker.

Do not introduce duplicate transaction tables.

Do not require users to record the same
worship activity twice.

==================================================
8. GOAL CATEGORIES
==================================================

Support four categories:

- WAJIB
- SUNNAH
- QURAN
- DHIKR

Use existing domain constants when available.

Activity selections must use actual existing
master data and stable identifiers.

Do not hardcode only the default activities.

Custom Sunnah and custom Dzikir activities
must be selectable where supported.

Archived activities must remain identifiable
for existing goal history.

Do not allow invalid activity references.

==================================================
9. SHALAT WAJIB GOAL METRICS
==================================================

Support:

COMPLETED_PRAYERS
COMPLETE_DAYS
ON_TIME_PRAYERS
CONGREGATIONAL_PRAYERS

COMPLETED_PRAYERS:

Count saved prayer records with COMPLETED status.

COMPLETE_DAYS:

Count distinct local dates where:

- At least one obligatory prayer is applicable.
- Every applicable obligatory prayer is COMPLETED.

ON_TIME_PRAYERS:

Count COMPLETED prayers explicitly recorded
as performed on time.

CONGREGATIONAL_PRAYERS:

Count COMPLETED prayers explicitly recorded
as performed in congregation.

Do not infer completion from elapsed prayer times.

Do not infer on-time status from schedule data.

Do not infer congregational status.

Do not treat NULL optional attributes as YES.

Preserve the existing Phase 03 status semantics.

==================================================
10. SHALAT WAJIB EXEMPTION RULES
==================================================

Support the existing EXEMPT status.

EXEMPT prayer slots must not be considered missed.

NOT_LOGGED or absent records are not EXEMPT.

For a goal covering all applicable daily prayers:

Effective target =
Total applicable obligatory prayer slots.

Example:

Daily configured target: 5 prayers.
Exempt prayer slots: 1.
Applicable prayer slots: 4.
Completed prayers: 3.

Effective target: 4.
Actual value: 3.
Progress: 75%.

If all five prayer slots are EXEMPT:

Status: NOT_APPLICABLE.
Progress percentage: NULL.

For fixed prayer-count goals:

Effective target must not exceed the number
of applicable prayer slots in the eligible period.

For COMPLETE_DAYS goals:

Exclude fully exempt days from applicable day
capacity.

If no applicable day exists, use NOT_APPLICABLE.

Do not mark a fully exempt day as a completed day.

Future and unlogged slots within a current period
remain expected applicable slots unless explicitly
recorded as EXEMPT.

Do not classify an ongoing period as failed
before it ends.

Store configured target and effective target
separately.

Do not modify Shalat Wajib Tracker records.

==================================================
11. SHALAT SUNNAH GOAL METRICS
==================================================

Support:

SESSION_COUNT
ACTIVE_DAYS
RAKAAT_COUNT

SESSION_COUNT:

Count actual saved Sunnah prayer sessions.

ACTIVE_DAYS:

Count distinct local dates containing qualifying
saved sessions.

RAKAAT_COUNT:

Sum known, explicitly recorded rakaat values.

Do not estimate missing rakaat.

Do not treat unknown rakaat as known zero.

Display a concise data-coverage indication
when applicable.

Support individual Sunnah prayer activities.

Examples:

- Tahajud.
- Witir.
- Dhuha.
- Existing Rawatib activities.
- User-created custom activities.

Support all Sunnah activities as an explicit
aggregate filter where appropriate.

For grouped Rawatib goals, use verified existing
master activity IDs.

Do not infer groups from translated display names.

Multiple sessions on one day count as multiple
sessions but only one active day.

==================================================
12. QURAN GOAL METRICS
==================================================

Support:

AYAH_COUNT
SESSION_COUNT
DURATION_MINUTES
ACTIVE_DAYS

AYAH_COUNT:

Sum ayah counts from saved Quran reading logs.

Use the existing authoritative reading
calculation logic.

Do not count unique verses unless explicitly
supported by a different future metric.

Repeated intentional reading sessions count
as actual reading volume.

SESSION_COUNT:

Count saved Quran reading sessions.

DURATION_MINUTES:

Sum recorded reading duration.

Verify the actual stored duration unit.

Convert to minutes correctly.

Do not round individual sessions before summing.

Do not invent missing reading duration.

If the existing tracker does not support recorded
duration, disable the duration metric and report
the limitation.

Do not implement automatic reading timers
as additional scope.

ACTIVE_DAYS:

Count distinct local dates containing saved
reading sessions.

Do not count:

- Opening the Quran Reader.
- Scrolling through verses.
- Displaying translations.
- Changing font size.
- Changing bookmark.
- Unnumbered introductory Basmalah.

Preserve all existing Quran tracker rules.

==================================================
13. DHIKR GOAL METRICS
==================================================

Support:

REPETITION_COUNT
SESSION_COUNT
ACTIVE_DAYS
COLLECTION_COMPLETION

REPETITION_COUNT:

Sum actual repetition values from saved
counter-mode Dzikir logs.

Exclude checklist-only logs from numeric
repetition totals.

SESSION_COUNT:

Count qualifying saved individual Dzikir logs.

Do not add collection parent sessions again
to individual log counts.

ACTIVE_DAYS:

Count distinct local dates containing
qualifying saved activity.

COLLECTION_COMPLETION:

Count finalized collection parent sessions
with COMPLETED status.

Do not count PARTIAL collections as complete.

Do not count DRAFT collections.

A partially completed finalized collection may
contribute its actual saved individual repetition
or session logs to the appropriate metrics.

Do not count the same child log twice.

Support individual activities such as:

- Tasbih.
- Tahmid.
- Takbir.
- Istighfar.
- Shalawat.
- Existing custom Dzikir.

Support collections such as:

- Dzikir Pagi.
- Dzikir Petang.
- Dzikir Setelah Shalat.

For collection-specific ACTIVE_DAYS goals,
count distinct dates with a qualifying completed
collection.

For combined morning and evening goals,
use explicit collection identifiers and
clearly define the selected aggregate metric.

Do not introduce new religious completion rules.

Reuse existing collection completion snapshots.

==================================================
14. METRIC REGISTRY
==================================================

Create a centralized goal metric registry.

Each supported metric must define:

- Category.
- Metric identifier.
- Allowed activity filter.
- Unit.
- Supported periods.
- Validation rules.
- Aggregation method.
- Applicable maximum where relevant.
- Localization labels.
- Existing tracker navigation target.

Suggested architecture:

GoalMetricDefinition
GoalActivityFilter
GoalMetricRegistry
GoalCalculationResult

Use discriminated TypeScript unions or
equivalent strong typing.

Prevent incompatible combinations.

Examples of invalid combinations:

- Quran with RAKAAT_COUNT.
- Checklist-only Dzikir with REPETITION_COUNT.
- Shalat Wajib with Quran AYAH_COUNT.
- Individual Dzikir with COLLECTION_COMPLETION.

Use one shared registry for:

- Create Goal.
- Goal Templates.
- Edit Goal.
- Goal Calculation.
- Goal Detail.
- History.

Avoid duplicate metric definitions across screens.

==================================================
15. RECURRING GOAL PERIODS
==================================================

Support:

DAILY
WEEKLY
MONTHLY

DAILY:

Local calendar date.

WEEKLY:

Seven-day calendar period based on the
existing user Week Start preference.

Support every existing Week Start option.

MONTHLY:

Gregorian calendar month.

Use local calendar date strings:

YYYY-MM-DD.

Use inclusive start and exclusive end boundaries.

Example:

Daily:

Start: 2026-11-28.
End exclusive: 2026-11-29.

Monthly:

Start: 2026-11-01.
End exclusive: 2026-12-01.

Do not use a fixed 30-day monthly period.

Do not use UTC date truncation to determine
the local worship date.

Handle leap years and actual month lengths.

Reuse existing date utilities.

==================================================
16. CURRENT PERIOD ACTIVATION
==================================================

A newly created goal starts in the current period.

Count qualifying transactions already saved
within that current period.

Example:

User reads 15 ayat in the morning.

User creates a daily 20-ayat goal
in the afternoon.

Expected:

Actual progress: 15 ayat.
Target: 20 ayat.
Percentage: 75%.

Do not generate goal history for periods
before the goal's initial activation period.

Do not create future goal periods unnecessarily.

Clearly explain that existing activity in the
current period is included.

==================================================
17. AUTOMATIC PERIOD ROLLOVER
==================================================

Automatically resolve the current goal period.

Trigger reconciliation when:

- Application initializes.
- Application resumes.
- Target screen gains focus.
- Relevant worship transactions change.
- Local calendar date changes.

Do not require background execution.

If the application is closed for several days,
reconcile all eligible elapsed periods when
the user returns.

Read saved transactions for each period.

Do not assume elapsed periods have zero activity.

Avoid duplicate period records.

Use deterministic period identities.

Process large reconciliation ranges in
reasonable batches when necessary.

Do not delete historical periods.

==================================================
18. WEEK START CHANGES
==================================================

Preserve existing historical weekly boundaries.

Store the applicable Week Start value
with weekly period snapshots.

When the user changes Week Start preference:

- Do not rewrite completed historical periods.
- Do not retroactively change the open period.
- Apply the new preference after the current
  weekly period ends.

If necessary, create a shorter transition period
before alignment with the new weekly boundary.

Do not create overlapping date ranges.

Do not silently double-count dates across
consecutive periods of the same goal.

Clearly display actual transition period dates.

==================================================
19. GOAL CALCULATION ENGINE
==================================================

Create a reusable calculation service.

Suggested responsibilities:

- Resolve applicable goal configuration.
- Resolve effective period boundaries.
- Resolve activity filters.
- Read authoritative worship transactions.
- Aggregate actual values.
- Determine applicable capacity.
- Calculate effective target.
- Calculate progress percentage.
- Determine period status.
- Return contributing activities.
- Identify incomplete optional metric coverage.

Suggested result:

GoalCalculationResult:

- goalId
- goalVersionId
- periodStart
- periodEndExclusive
- configuredTarget
- effectiveTarget
- actualValue
- remainingValue
- progressPercentage
- progressBarPercentage
- applicableValue
- achievementStatus
- contributingRecordCount
- knownValueCount
- missingValueCount
- calculatedAt

Keep the engine independent from UI components.

Do not place business calculation logic inside
individual React components.

==================================================
20. PROGRESS CALCULATION
==================================================

For applicable positive targets:

Progress percentage =
Actual value / Effective target * 100.

Remaining value =
Maximum of zero and Effective target - Actual value.

Progress bar percentage =
Minimum of 100 and actual progress percentage.

Examples:

Target: 20.
Actual: 15.

Progress: 75%.
Remaining: 5.

Target: 20.
Actual: 30.

Progress: 150%.
Progress bar: 100%.
Remaining: 0.

Preserve actual values above target.

Use the unrounded actual value to determine
whether the target has been achieved.

Do not mark 99.9% as achieved merely because
a rounded display shows 100%.

Prevent division by zero.

Use NULL percentage for NOT_APPLICABLE.

==================================================
21. PERIOD ACHIEVEMENT STATUS
==================================================

Support:

IN_PROGRESS
ACHIEVED
NOT_ACHIEVED
NOT_APPLICABLE

Rules:

ACHIEVED:

Actual value is greater than or equal to
the effective target.

IN_PROGRESS:

Period is still open and applicable target
has not yet been achieved.

NOT_ACHIEVED:

Applicable period has ended and target
has not been achieved.

NOT_APPLICABLE:

No applicable obligation exists or the
goal is not active during the period.

An achieved open period may become
IN_PROGRESS if a contributing transaction
is corrected or deleted.

Do not treat status as permanent when
the underlying worship data changes.

Display neutral user-facing status wording.

==================================================
22. GOAL LIFECYCLE
==================================================

Support goal lifecycle states:

ACTIVE
PAUSED
ARCHIVED

Distinguish lifecycle status from
period achievement status.

A goal may be ACTIVE while its current
period is ACHIEVED.

Lifecycle changes must have effective dates.

Do not rely solely on the current master
goal status to reconstruct historical periods.

Maintain lifecycle history through immutable
configuration versions or equivalent persisted
effective-date records.

==================================================
23. EDIT GOAL AND VERSIONING
==================================================

Allow editing:

- Goal name.
- Activity selection.
- Metric.
- Target quantity.
- Period type.

Configuration changes take effect after
the current period ends.

Preserve the current period configuration.

Example:

Weekly Quran target: 140 ayat.

User edits target to 200 ayat.

Current week target remains 140.

Next eligible period uses 200.

Display pending configuration and effective date.

Allow cancellation or replacement of a pending
configuration before it becomes effective.

Do not create overlapping effective ranges.

Do not modify configuration snapshots of
closed historical periods.

When changing period type:

Finish the current period using its original rules.

Start the new configuration at the next boundary
after the old period ends.

If the new period type is not aligned with that
date, create a clearly labeled transition period.

Do not backdate the new configuration.

Do not silently prorate the configured target.

Explain the actual first-period date range.

==================================================
24. PAUSE GOAL
==================================================

Allow users to pause an active goal.

Explain that the current period remains recorded.

Default behavior:

- Current period finishes using existing rules.
- Pause becomes effective at the next period boundary.
- No new applicable target periods are generated
  during the paused interval.

Display scheduled pause information immediately.

Allow cancellation before the pause takes effect.

Paused periods must not be classified as failed.

Preserve previous achievements.

Do not delete or modify worship transactions.

==================================================
25. RESUME GOAL
==================================================

Allow users to resume a paused goal.

Resume takes effect at the next eligible
period boundary.

Display the effective resume date.

Do not retroactively create active target
requirements for paused intervals.

Preserve previous configuration unless
the user explicitly changes it.

Continue using the same stable goal identity.

==================================================
26. ARCHIVE GOAL
==================================================

Allow users to archive a goal with confirmation.

Default behavior:

- Current applicable period remains recorded.
- Archive becomes effective at the next boundary.
- No new applicable periods after archive.
- Historical records remain accessible.

Display pending archive status.

Allow cancellation before archive takes effect.

Archived goals must remain available
in historical views.

Do not hard-delete goals with history.

Permanent deletion is outside Phase 07.

==================================================
27. HISTORICAL DATA CONSISTENCY
==================================================

Goal configuration history is immutable
after the applicable period begins.

Calculated progress is derived and correctable.

Example:

Week 1 target: 140 ayat.
Week 1 recorded actual: 150 ayat.

User later changes target to 200 ayat.

Week 1 target remains 140 ayat.

If the user deletes a 20-ayat reading log
from Week 1:

Week 1 actual becomes 130 ayat.
Week 1 target remains 140 ayat.
Week 1 achievement status is recalculated.

Do not confuse immutable goal configuration
with immutable calculated achievement.

Maintain a calculation timestamp.

Ensure historical views reflect corrections
to authoritative worship transactions.

==================================================
28. DATABASE DESIGN
==================================================

Use existing hijrah.db.

Proposed new tables:

- personal_goals
- personal_goal_versions
- personal_goal_periods

Inspect actual database conventions before
creating migrations.

Use stable IDs.

Use existing profile foreign key conventions.

Use parameterized queries.

Enable and preserve foreign key integrity.

Do not introduce duplicate transaction tables.

The proposed schema may be refined to support
all required lifecycle and versioning behavior.

Document the final schema and any differences.

==================================================
29. PERSONAL_GOALS TABLE
==================================================

Suggested fields:

id                      TEXT PRIMARY KEY
user_id                 TEXT NOT NULL
name                    TEXT NOT NULL
category                TEXT NOT NULL
status                  TEXT NOT NULL
created_at              TEXT NOT NULL
updated_at              TEXT NOT NULL
archived_at             TEXT NULL

Purpose:

Stable master identity of a personal goal.

The master status is a convenient current-state
projection, not the only lifecycle history source.

Add appropriate ownership foreign keys.

Add indexes for:

- user_id.
- status.
- category.

Ensure every query respects local user ownership.

==================================================
30. PERSONAL_GOAL_VERSIONS TABLE
==================================================

Suggested fields:

id                      TEXT PRIMARY KEY
goal_id                 TEXT NOT NULL
version_number          INTEGER NOT NULL
name_snapshot           TEXT NOT NULL
category_snapshot       TEXT NOT NULL
activity_type           TEXT NOT NULL
activity_id             TEXT NULL
activity_filter_json    TEXT NULL
metric_type             TEXT NOT NULL
target_value            INTEGER NOT NULL
period_type             TEXT NOT NULL
lifecycle_status        TEXT NOT NULL
effective_from          TEXT NOT NULL
effective_until         TEXT NULL
created_at              TEXT NOT NULL

Use a validated activity filter structure
for grouped activities.

Store stable activity identifiers.

Ensure:

- Positive target value.
- Supported metric.
- Supported period.
- Valid lifecycle state.
- Unique goal/version number.
- No overlapping effective ranges.
- No conflicting pending configurations.

The end boundary is exclusive.

Use database constraints and transactional
service-level validation as appropriate.

Do not silently rewrite historical versions.

==================================================
31. PERSONAL_GOAL_PERIODS TABLE
==================================================

Suggested fields:

id                      TEXT PRIMARY KEY
goal_id                 TEXT NOT NULL
goal_version_id         TEXT NOT NULL
period_start            TEXT NOT NULL
period_end_exclusive    TEXT NOT NULL
period_type_snapshot    TEXT NOT NULL
week_start_snapshot     INTEGER NULL
target_snapshot         INTEGER NOT NULL
effective_target        REAL NULL
actual_value            REAL NOT NULL
applicable_value        INTEGER NULL
period_status           TEXT NOT NULL
is_transition_period    INTEGER NOT NULL
calculated_at           TEXT NOT NULL
created_at              TEXT NOT NULL

Actual values may require fractional precision
for duration metrics.

Use the actual existing storage convention
where more appropriate.

Store configured target and effective target
independently.

Use unique constraints to prevent duplicate periods.

Validate that the version belongs to the same goal.

Prevent overlapping periods for the same goal.

Ensure historical target snapshots are preserved.

Treat actual_value as a derived calculation cache.

Do not use this table as a new authoritative
worship transaction source.

==================================================
32. DATABASE MIGRATION SAFETY
==================================================

Create a non-destructive versioned migration.

Requirements:

- Transactional migration.
- Idempotent migration behavior.
- Foreign key integrity.
- Appropriate indexes.
- Existing database compatibility.
- Preserve existing user profiles.
- Preserve existing settings.
- Preserve Shalat Wajib records.
- Preserve Shalat Sunnah sessions.
- Preserve Quran records and bookmarks.
- Preserve Dzikir logs and drafts.
- Preserve Dzikir collection snapshots.
- Preserve existing Islamic Hub data.

Do not reset hijrah.db.

Do not clear Expo Go data.

Do not insert fictional worship records.

Do not automatically create default personal
goals without user consent.

==================================================
33. RECOMMENDED GOAL TEMPLATES
==================================================

Implement three optional template groups.

GROUP 1:

LANGKAH AWAL
Getting Started

Suggested targets:

- Complete all applicable daily obligatory prayers.
- Read 5 Quran ayat daily.
- Istighfar 33 repetitions daily.

GROUP 2:

MEMBANGUN KONSISTENSI
Building Consistency

Suggested targets:

- Complete all applicable daily obligatory prayers.
- Dhuha on 3 distinct days weekly.
- Read 20 Quran ayat daily.
- Complete Dzikir Pagi daily.
- Complete Dzikir Petang daily.

GROUP 3:

TERUS BERTUMBUH
Continuing to Grow

Suggested targets:

- Perform applicable obligatory prayers on time.
- Tahajud 3 sessions weekly.
- Read 50 Quran ayat daily.
- Istighfar 100 repetitions daily.
- Complete Dzikir Pagi daily.
- Complete Dzikir Petang daily.

These are optional personal goal suggestions.

Do not classify these groups as levels of faith.

Do not force users to complete a lower group
before accessing another group.

==================================================
34. TEMPLATE SELECTION FLOW
==================================================

Allow users to:

- Browse template groups.
- View included goals.
- Select an entire group.
- Select individual goals within a group.
- Customize target quantities.
- Customize supported periods.
- Review selected goals before saving.
- Cancel without creating records.

Use actual existing activity identifiers.

Do not create goals with missing master activities.

Show a warning for equivalent active goals.

An equivalent goal has matching category,
activity filter, metric, period and target.

Avoid accidental duplicate creation.

Allow intentional distinct personal goals
after explicit user confirmation.

Save selected template goals atomically.

If saving fails, do not leave partial duplicates.

==================================================
35. CREATE PERSONAL GOAL
==================================================

Implement a beginner-friendly creation flow.

STEP 1:

Choose category:

- Shalat Wajib.
- Shalat Sunnah.
- Al-Quran.
- Dzikir & Tasbih.

STEP 2:

Choose activity.

Use available actual tracker activities.

STEP 3:

Choose supported metric and unit.

STEP 4:

Configure:

- Optional goal name.
- Target quantity.
- Daily, weekly or monthly period.

Display a preview:

Example:

Membaca Al-Quran.
20 ayat setiap hari.

Explain:

Progress is calculated automatically
from existing worship activity.

Allow Save and Cancel.

Do not create a worship transaction when
saving a personal goal.

==================================================
36. INPUT VALIDATION
==================================================

Validate:

- Supported category.
- Existing activity reference.
- Compatible metric.
- Supported period.
- Positive integer target input.
- Reasonable technical upper bound.
- Trimmed optional goal name.
- Safe text length.
- Duplicate submission prevention.

Suggested general technical maximum:

1,000,000.

Apply more specific metric limits.

ACTIVE_DAYS:

- Daily: maximum 1.
- Weekly: maximum 7.
- Monthly: maximum 31.

Monthly effective day capacity depends
on actual month length.

For goals exceeding the applicable days in
a shorter month, show the effective capacity
and explicit adjustment information.

SHALAT WAJIB COUNT:

- Daily: maximum 5.
- Weekly: maximum 35.
- Monthly: maximum 155.

Apply actual period capacity and exemptions.

Do not silently reduce ordinary session,
ayah or repetition targets.

Do not impose religious restrictions beyond
the existing supported tracker rules.

==================================================
37. TARGET HOME SCREEN
==================================================

Activate the existing Target menu.

Required layout:

1. Header:
   Target Ibadah.

2. Supporting text:
   Setiap langkah kecil adalah bagian
   dari perjalananmu.

3. Forest Green summary card.

4. Period selector:
   Harian.
   Mingguan.
   Bulanan.

5. Active Goal cards.

6. Create New Goal action.

7. Recommended Goal Templates shortcut.

8. Goal History and Management access.

Keep the approved compact mobile-first layout.

Preserve existing bottom navigation.

==================================================
38. TARGET SUMMARY CARD
==================================================

Display summary for the selected period type.

Required information:

- Applicable active goal count.
- Achieved goal count.
- In-progress goal count.
- Achievement percentage.

Summary achievement percentage:

Number of achieved applicable goals
divided by number of applicable active goals.

Example:

Applicable active goals: 5.
Achieved goals: 3.

Summary: 60%.

Do not average unrelated metrics such as
ayah counts, rakaat and repetitions.

Do not present the percentage as a
spiritual or religious score.

Exclude NOT_APPLICABLE goals from the
percentage denominator.

If no applicable goals exist:

Display an informative empty state.

Do not display misleading 0% or 100%.

Show N/A goal count separately when relevant.

==================================================
39. GOAL CARD DESIGN
==================================================

Each card displays:

- Category icon.
- Goal name.
- Actual value.
- Effective target.
- Metric unit.
- Progress percentage.
- Progress bar.
- Achievement or lifecycle status.
- Navigation to detail.

Example:

Membaca Al-Quran
15 dari 20 ayat
75%
Kurang 5 ayat lagi.

For achieved goals:

Alhamdulillah, target tercapai.

For adjusted obligatory prayer targets,
clearly show applicable target information.

For pending edits or lifecycle changes,
display a concise effective-date indication.

Do not use hardcoded sample values.

==================================================
40. EMPTY STATE
==================================================

When there are no personal goals:

Display:

"Mulai perjalananmu."

Supporting text:

"Buat target ibadah sesuai kemampuanmu
dan pantau perkembangannya setiap hari."

Primary action:

Buat Target Baru.

Secondary action:

Lihat Rekomendasi Target.

Do not automatically activate template goals.

If the selected period has no goals but
other periods contain goals, provide
appropriate navigation or explanation.

==================================================
41. GOAL DETAIL SCREEN
==================================================

Display:

- Goal title.
- Category.
- Activity.
- Metric.
- Period type.
- Actual period dates.
- Configured target.
- Effective target when different.
- Current actual progress.
- Remaining value.
- Progress percentage.
- Achievement status.
- Pending configuration when applicable.
- Relevant contributing activity records.
- Recent achievement history.
- Shortcut to existing worship tracker.
- Edit action.
- Pause or Resume action.
- Archive action.

Show seven recent periods by default.

For daily goals:

Show recent daily periods.

For weekly goals:

Show recent weekly periods.

For monthly goals:

Show recent monthly periods.

Do not show a daily target chart for a
monthly goal without clearly distinguishing
daily activity from monthly achievement.

Use the actual period target for each
historical bar or row.

Display N/A periods distinctly from zero.

Do not display future periods as failed.

==================================================
42. WORSHIP SHORTCUTS
==================================================

Connect Goal Detail to existing tracker routes.

Examples:

Shalat Wajib goal:

Open Shalat Wajib Tracker.

Tahajud goal:

Open existing Sunnah activity.

Quran reading goal:

Open existing Quran Reader or Quran module.

Istighfar goal:

Open existing Digital Tasbih activity.

Dzikir Pagi goal:

Open existing morning collection.

Use actual supported route parameters.

Do not invent navigation targets.

Do not automatically save worship activity
when opening a shortcut.

If a referenced activity has been archived,
show a clear unavailable or archive notice.

Preserve its historical goal data.

==================================================
43. GOAL ACHIEVEMENT HISTORY
==================================================

Create a dedicated history screen.

Support filters:

- All categories.
- Shalat Wajib.
- Shalat Sunnah.
- Quran.
- Dzikir.

Support period filters:

- Daily.
- Weekly.
- Monthly.

Display:

- Goal name snapshot.
- Actual period dates.
- Historical target.
- Historical actual value.
- Progress percentage.
- Achievement status.
- Applicable or exemption information.

Support archived goal history.

Use actual saved goal configuration
and authoritative transaction calculations.

Do not display fictional achievements.

Provide pagination or efficient list rendering
for long histories.

==================================================
44. AUTOMATIC PROGRESS REFRESH
==================================================

Target progress must refresh after:

- Shalat Wajib completion update.
- Shalat Wajib status correction.
- Sunnah session creation.
- Sunnah session edit or deletion.
- Quran reading session save.
- Quran reading session edit or deletion.
- Dzikir log save.
- Dzikir log edit or deletion.
- Dzikir collection finalization.
- Dzikir collection historical correction.
- Application resume.
- Period rollover.

Reuse existing state management and
repository mutation patterns.

Use a centralized invalidation mechanism
or equivalent reliable refresh architecture.

Refresh affected historical periods
when transactions are backdated or corrected.

Refresh both original and new dates when
a transaction date changes.

Avoid unnecessary full-history recalculation
on every render.

Do not create a network dependency.

==================================================
45. DATA CONSISTENCY AND PERFORMANCE
==================================================

Use efficient SQLite queries.

Prefer indexed date and activity filters.

Avoid N+1 queries for each goal card.

Avoid repeatedly recalculating unchanged goals.

Batch related aggregation work where practical.

Do not perform heavy synchronous operations
inside UI render functions.

Handle concurrent mutations safely.

Prevent stale asynchronous calculations from
overwriting newer progress results.

Ensure derived progress can be rebuilt
from authoritative saved worship records.

Use database transactions for version changes
and period materialization where required.

==================================================
46. UI/UX DESIGN SYSTEM
==================================================

Preserve the approved Hijra design identity.

Reference palette:

Primary:        #174638
Secondary:      #769B87
Accent:         #C7A76C
Background:     #F7F8F3
Surface:        #FFFFFF
Text Primary:   #20312A
Text Secondary: #64748B
Border:         #E2E8E3

Use existing centralized theme tokens.

Do not hardcode light-mode colors
throughout the implementation.

Design direction:

- Modern Islamic.
- Premium.
- Calm.
- Compact.
- Informative.
- Beginner-friendly.
- Mobile-first.

Suggested dimensions:

- Screen padding: 16-20.
- Header font: 24-28.
- Section title: 16-18.
- Body text: 14-16.
- Secondary text: 12-13.
- Card radius: 14-16.
- Card padding: 12-16.
- Card spacing: 8-12.
- Icon size: 22-24.
- Minimum touch target: 48.

Reuse existing approved components.

==================================================
47. PROGRESS VISUALIZATION
==================================================

Use existing approved chart components
or simple native View-based progress bars.

Do not install a new chart library.

Required visualizations:

- Summary progress ring or equivalent.
- Individual goal progress bars.
- Historical achievement bars or list.

If a ring cannot be implemented cleanly with
existing approved dependencies, use a
clear progress bar and summary values.

Do not use additional dependencies solely
to reproduce a decorative visualization.

Preserve accurate values above 100%.

Do not rely on color alone for status.

==================================================
48. LOCALIZATION
==================================================

Support Indonesian and English.

Required labels include:

Target Ibadah / Worship Goals
Target Aktif / Active Goals
Buat Target Baru / Create New Goal
Rekomendasi Target / Recommended Goals
Detail Target / Goal Details
Riwayat Target / Goal History
Harian / Daily
Mingguan / Weekly
Bulanan / Monthly
Jumlah Target / Target Amount
Tercapai / Achieved
Belum Tercapai / Not Yet Achieved
Berjalan / In Progress
Tidak Berlaku / Not Applicable
Jeda Target / Pause Goal
Lanjutkan Target / Resume Goal
Arsipkan Target / Archive Goal
Edit Target / Edit Goal
Perubahan Berikutnya / Upcoming Changes

Localize:

- Metric labels.
- Units.
- Template names.
- Status messages.
- Effective-date information.
- Form validation.
- Empty states.
- Confirmation messages.
- Error states.
- Accessibility labels.

Use proper singular and plural forms.

Do not hardcode Indonesian text inside
calculation services.

==================================================
49. ACCESSIBILITY
==================================================

Support:

- Screen reader labels.
- Accessible progress descriptions.
- Font scaling.
- Readable text contrast.
- Minimum touch targets.
- Safe areas.
- Flexible layouts.
- Clear form validation.
- Long goal names.
- Light, Dark and System modes.

Ensure progress remains understandable
without relying solely on color or graphics.

==================================================
50. OFFLINE AND PRIVACY
==================================================

Phase 07 must be fully offline.

Do not introduce:

- API requests.
- Remote authentication.
- Cloud data.
- Analytics SDK.
- External goal calculation services.
- Tracking pixels.
- External notifications.

Keep all goals and worship records local.

Do not transmit user profile information,
worship progress or private notes.

Existing MyQuran features remain independent
from the Personal Goals module.

Verify Target works when internet is disabled.

==================================================
51. INTEGRATION BOUNDARIES
==================================================

Do not modify existing tracker business rules.

Allowed integration changes:

- Read-only aggregation access.
- Shared repository functions.
- Relevant mutation invalidation events.
- Existing tracker navigation shortcuts.
- Necessary compatibility fixes.

Do not redesign:

- Beranda.
- Ibadah Home.
- Shalat Wajib Tracker.
- Shalat Sunnah Tracker.
- Quran Reader.
- Digital Tasbih.
- Dzikir collections.
- Islamic Lifestyle Hub.

Expose reusable goal summary services for
future Phase 08 and Phase 09.

Do not implement those phases now.

==================================================
52. IMPLEMENTATION SEQUENCE
==================================================

STEP 1:

Inspect existing workspace and produce
a concise implementation plan.

STEP 2:

Implement versioned SQLite migration.

STEP 3:

Implement goal domain types and metric registry.

STEP 4:

Implement repositories and ownership validation.

STEP 5:

Implement period resolution and versioning.

STEP 6:

Implement tracker aggregation services.

STEP 7:

Implement Goal Calculation Engine.

STEP 8:

Implement create goal and template selection.

STEP 9:

Implement Target Home.

STEP 10:

Implement Goal Detail and History.

STEP 11:

Implement Edit, Pause, Resume and Archive.

STEP 12:

Implement automatic progress invalidation.

STEP 13:

Complete localization and theme compatibility.

STEP 14:

Execute automated and development testing.

STEP 15:

Fix detected issues and retest.

STEP 16:

Update project documentation.

==================================================
53. MANDATORY ACCEPTANCE TESTS - QURAN
==================================================

CASE 1:

Create daily Quran target: 20 ayat.

Save Quran reading session: 15 ayat.

Expected:

Actual: 15.
Target: 20.
Progress: 75%.

CASE 2:

Save another intentional session: 15 ayat.

Expected:

Actual: 30.
Target: 20.
Progress: 150%.
Progress bar: 100%.
Status: ACHIEVED.

CASE 3:

Delete one 15-ayat session.

Expected:

Actual: 15.
Progress: 75%.
Status: IN_PROGRESS if the period is open.

CASE 4:

Change Quran translation visibility.

Expected:

No goal progress change.

CASE 5:

Read across surahs and save a session.

Expected:

Goal progress equals the authoritative
saved reading count.

CASE 6:

Create a goal after recording Quran activity
in the same current period.

Expected:

Existing qualifying activity is included.

==================================================
54. MANDATORY ACCEPTANCE TESTS - WAJIB
==================================================

CASE 1:

Five applicable prayers.
Three COMPLETED.

Expected:

Actual: 3.
Effective target: 5.
Progress: 60%.

CASE 2:

One prayer EXEMPT.
Three COMPLETED.
One NOT_LOGGED.

Expected:

Actual: 3.
Effective target: 4.
Progress: 75%.

CASE 3:

Four COMPLETED.
One EXEMPT.

Expected:

Actual: 4.
Effective target: 4.
Progress: 100%.
Status: ACHIEVED.

CASE 4:

All five prayers EXEMPT.

Expected:

Status: NOT_APPLICABLE.
Progress percentage: NULL.

CASE 5:

Prayer is COMPLETED but on-time attribute
is NULL.

Expected:

Count toward completed prayers.
Do not count toward on-time prayers.

CASE 6:

Prayer schedule time has elapsed but
no completion was recorded.

Expected:

No completed goal progress.

CASE 7:

One fully exempt day in a weekly
COMPLETE_DAYS goal.

Expected:

Fully exempt day is excluded from
applicable day capacity.

==================================================
55. MANDATORY ACCEPTANCE TESTS - SUNNAH
==================================================

CASE 1:

Weekly Tahajud target: 3 sessions.

Record 2 sessions.

Expected:

Progress: 2 of 3.

CASE 2:

Record two Dhuha sessions on one date.

For SESSION_COUNT:

Expected: 2.

For ACTIVE_DAYS:

Expected: 1.

CASE 3:

Record sessions with known rakaat values
of 2 and 4, plus one unknown value.

Expected:

Known total: 6 rakaat.
Unknown rakaat remains unknown.

CASE 4:

Create goal using a custom Sunnah activity.

Expected:

Goal references the stable activity ID
and calculates actual matching sessions.

==================================================
56. MANDATORY ACCEPTANCE TESTS - DHIKR
==================================================

CASE 1:

Daily Istighfar goal: 100 repetitions.

Save 75 repetitions.

Expected:

75%.

CASE 2:

Save another 25 repetitions.

Expected:

100%.
Status: ACHIEVED.

CASE 3:

Create a Dzikir draft with 100 repetitions.

Expected:

Draft does not increase goal progress.

CASE 4:

Save a checklist-only Dzikir activity.

Expected:

May count toward session metrics.
Does not increase numeric repetitions.

CASE 5:

Finalize a PARTIAL Dzikir Pagi collection.

Expected:

Completed collection goal remains unchanged.

CASE 6:

Finalize a COMPLETED Dzikir Pagi collection.

Expected:

Completed collection count increases by one.

CASE 7:

Correct a historical completed collection
so it becomes PARTIAL.

Expected:

Related goal progress is recalculated.

CASE 8:

Collection parent and child logs exist.

Expected:

No duplicate session or repetition counting.

==================================================
57. MANDATORY ACCEPTANCE TESTS - PERIODS
==================================================

Test:

- Daily rollover.
- Weekly rollover.
- Monthly rollover.
- Every supported Week Start preference.
- Week Start preference changes.
- Short transition periods.
- February.
- Leap year.
- Thirty-day month.
- Thirty-one-day month.
- Gregorian year rollover.
- Local timezone date handling.
- Application resume after midnight.
- Application closed across multiple periods.
- Historical transaction insertion.
- Historical transaction correction.
- Transaction moved to another date.
- No duplicate period records.
- No overlapping period boundaries.

Verify history is not generated for periods
before initial goal activation.

==================================================
58. MANDATORY ACCEPTANCE TESTS - LIFECYCLE
==================================================

Test:

- Create custom goal.
- Create goal from template.
- Select individual template goals.
- Prevent duplicate submission.
- Intentional distinct goals.
- Edit target quantity.
- Edit goal metric.
- Edit goal period type.
- Pending configuration display.
- Configuration effective-date activation.
- Cancel pending configuration.
- Pause goal.
- Cancel scheduled pause.
- Resume goal.
- Archive goal.
- Archived goal history.
- No new periods during paused intervals.
- Historical target remains unchanged.
- Historical actual progress recalculates
  after transaction corrections.

==================================================
59. MANDATORY REGRESSION TESTING
==================================================

Verify Phase 01:

- Application initialization.
- Database initialization.
- Navigation.

Verify Phase 02:

- Onboarding.
- Local user profile.
- Avatar.
- Settings.
- Theme.
- Language.
- Week Start preference.

Verify Phase 03:

- Shalat Wajib statuses.
- EXEMPT semantics.
- On-time and congregation attributes.
- History.

Verify Phase 04:

- Sunnah checklist.
- Multiple sessions.
- Custom activities.
- Rakaat.
- History.

Verify Phase 05:

- Quran Arabic Reader.
- Harakat and waqf.
- Correct Basmalah numbering.
- MyQuran translation behavior.
- Reading Tracker.
- Bookmark.
- Continue Reading.
- Offline Arabic content.

Verify Phase 06:

- Digital Tasbih counter.
- Checklist mode.
- Persistent drafts.
- Dzikir collections.
- Partial and completed sessions.
- Latin and translation display.
- Favorites.
- Custom Dzikir.
- Existing history.

Verify Phase 06B:

- Ibadah Home.
- Prayer schedule.
- Qibla.
- Islamic calendar.
- Hadith.
- Doa Harian.
- Asmaul Husna.

For features requiring physical device testing
or external content access, report actual
verification limitations.

Do not expand their existing scope.

==================================================
60. TECHNICAL VERIFICATION
==================================================

Run applicable scripts defined in package.json.

Expected checks where supported:

npm run typecheck
npm run lint
npx expo-doctor

Also run:

- Existing automated tests.
- Goal metric unit tests.
- Goal calculation tests.
- Exemption tests.
- Date boundary tests.
- Period reconciliation tests.
- Versioning tests.
- Lifecycle tests.
- Database migration tests.
- Duplicate prevention tests.
- Ownership validation tests.
- Tracker integration tests.
- Localization tests.
- Regression tests.

Use existing testing infrastructure.

Do not install additional testing dependencies.

If a check cannot be executed, report why.

Do not fabricate passing test results.

Distinguish:

- Automated verification.
- Emulator verification.
- Physical device verification.
- Product Owner testing.

==================================================
61. DOCUMENTATION
==================================================

Update existing documentation where applicable:

README.md

docs/PROJECT_OVERVIEW.md
docs/DEVELOPMENT_ROADMAP.md
docs/ARCHITECTURE.md
docs/BUSINESS_RULES.md
docs/DATABASE_SCHEMA.md
docs/UI_UX_GUIDELINES.md
docs/DEVELOPMENT_PROGRESS.md
docs/UAT_CHECKLIST.md

Create:

docs/PERSONAL_GOALS.md
docs/GOAL_CALCULATION_ENGINE.md
docs/PHASE_07_CODEX_PROMPT.md

Document:

- Approved Phase 07 scope.
- Actual implementation architecture.
- Goal categories.
- Metric definitions.
- Supported activity filters.
- Calculation formulas.
- Exemption rules.
- Period boundaries.
- Week Start handling.
- Transition period handling.
- Goal configuration versioning.
- Lifecycle behavior.
- Historical correction behavior.
- Database changes.
- Route structure.
- Tracker integration.
- UI behavior.
- Actual verification results.
- Known limitations.
- Remaining Product Owner testing.

Preserve existing production content licensing
and religious content review backlog.

==================================================
62. STRICT OUT OF SCOPE
==================================================

Do not implement:

- Quran Latin transliteration.
- Quran dataset replacement.
- Additional Quran providers.
- Quran audio.
- Adhan audio.
- Prayer reminders.
- Goal reminder notifications.
- Background scheduling.
- Streak systems.
- Achievement badges.
- Gamification.
- Leaderboards.
- Spiritual scoring.
- Social features.
- Online authentication.
- Cloud synchronization.
- Payments.
- Subscriptions.
- Advertising.
- Full Dashboard redesign.
- Complete Reports and Analytics.
- Weekly Reflection.
- Backup and Restore.

Do not start Phase 08.

==================================================
63. FINAL IMPLEMENTATION REPORT
==================================================

Provide a structured report containing:

1. Phase 07 implementation summary.
2. Existing workspace assessment.
3. Actual Expo SDK version.
4. Created and modified files.
5. Database migration details.
6. Final database schema.
7. Supported goal categories.
8. Supported metric registry.
9. Goal templates.
10. Create Goal implementation.
11. Target Home implementation.
12. Goal Calculation Engine.
13. Shalat Wajib exemption handling.
14. Daily period handling.
15. Weekly period handling.
16. Monthly period handling.
17. Week Start change handling.
18. Goal versioning.
19. Edit functionality.
20. Pause and Resume functionality.
21. Archive functionality.
22. Achievement History.
23. Tracker integration.
24. Automatic progress refresh.
25. Historical correction behavior.
26. Offline verification.
27. Localization verification.
28. Theme verification.
29. Dependency change verification.
30. TypeScript verification.
31. Lint verification.
32. Expo Doctor verification.
33. Automated test results.
34. Regression testing results.
35. Physical device verification status.
36. Known limitations.
37. Remaining blockers.
38. Product Owner manual testing guide.

Include a status table for:

07.1 through 07.10.

Possible completion statuses:

PHASE 07 DEVELOPMENT COMPLETE -
READY FOR PRODUCT OWNER TESTING

or:

PHASE 07 DEVELOPMENT INCOMPLETE -
BLOCKERS REMAIN

Do not claim formal UAT PASS.

Do not claim physical device testing
unless it was actually performed.

==================================================
64. FINAL INSTRUCTIONS
==================================================

Implement Phase 07 directly in the
existing Hijra workspace.

Activate the Target bottom navigation menu.

Implement all ten approved development
scope items.

Use actual existing worship transactions.

Implement automatic goal progress.

Implement recurring goal periods.

Implement configuration versioning.

Implement achievement history.

Implement optional recommended templates.

Implement Edit, Pause, Resume and Archive.

Maintain the approved Forest Green UI.

Maintain full offline functionality.

Maintain local user data privacy.

Do not introduce a new external API.

Do not install new dependencies.

Do not reset hijrah.db.

Do not overwrite historical worship records.

Do not automatically commit or push.

Do not implement additional unapproved scope.

Do not start Phase 08.

BUILD - TEST - FIX - RETEST.

BEGIN PHASE 07 IMPLEMENTATION NOW.