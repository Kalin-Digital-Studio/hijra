# HIJRA - PHASE 09
# REPORTS & ANALYTICS

Act as a Senior React Native Developer,
Mobile Application Architect, TypeScript Engineer,
SQLite Database Engineer, Data Analytics Engineer,
Business Logic Engineer, and Mobile UI/UX Designer.

Implement Phase 09 of the existing Hijra application.

Activate the existing Laporan bottom navigation
and implement Personal Worship Analytics.

Perform actual implementation directly in
the existing workspace.

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
- SQLite
- expo-sqlite
- Zustand
- i18next
- Existing centralized theme
- Existing approved icon library

Database:
hijrah.db

Platforms:
- Android
- iOS

Development environment:
- Expo Go

Languages:
- Indonesian (default)
- English

Appearance:
- Light
- Dark
- System

Methodology:
BUILD - TEST - FIX - RETEST.

Formal final UAT remains scheduled for Phase 12.

==================================================
2. PROJECT CHECKPOINT
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

Phase 08 Product Owner testing:
14 of 14 tests PASSED.

The Product Owner confirmed:
- Dashboard calculations are correct.
- Existing trackers remain functional.
- Goal progress integration works.
- Offline behavior works.
- UI matches the approved prototype.
- No regression was observed in prior modules.

Preserve these existing implementations.

Quran Latin transliteration remains deferred.

Do not reopen previous enhancement scope.

==================================================
3. PRE-IMPLEMENTATION ASSESSMENT
==================================================

Before modifying files:

- Execute git status.
- Inspect uncommitted changes.
- Inspect package.json and dependency lockfile.
- Identify actual Expo SDK version.
- Inspect existing Laporan route.
- Inspect existing navigation.
- Inspect SQLite schema and migrations.
- Inspect all four worship tracker repositories.
- Inspect Dashboard Aggregation Service.
- Inspect Goal Calculation Engine.
- Inspect goal versioning and period services.
- Inspect historical transaction correction logic.
- Inspect local date utilities.
- Inspect Week Start settings.
- Inspect existing chart components.
- Inspect theme and localization architecture.
- Inspect existing test infrastructure.
- Inspect licensing documentation.

Identify actual transaction fields and services.

Do not assume proposed table names are actual names.

Reuse existing business calculations.

Do not overwrite Product Owner changes.

Do not interrupt concurrent development.

Do not install new dependencies.
Do not upgrade or downgrade Expo SDK.

==================================================
4. DEVELOPMENT SCOPE
==================================================

Implement:

09.1 - Reports Home.
09.2 - Date Range & Period Filter.
09.3 - Shalat Wajib Analytics.
09.4 - Shalat Sunnah Analytics.
09.5 - Quran Reading Analytics.
09.6 - Dzikir & Tasbih Analytics.
09.7 - Personal Goals Analytics.
09.8 - Worship Consistency Calendar.
09.9 - Period Comparison.
09.10 - Integration & Regression Testing.

Phase 09 must operate entirely offline.

No additional API is required.
No new dependency is approved.

Do not start Phase 10.

==================================================
5. BUSINESS OBJECTIVE
==================================================

Reports must help users understand their
recorded worship habits and development.

Beranda:
Current-day personal summary.

Ibadah:
Worship execution, learning and tracking.

Target:
Personal goal management.

Laporan:
Historical statistics and analytics.

Profil:
Personal settings.

Do not duplicate the entire functionality
of other menus inside Laporan.

Personal analytics must not be presented
as a religious merit or faith score.

==================================================
6. NAVIGATION
==================================================

Preserve the existing five bottom tabs:

- Beranda.
- Ibadah.
- Target.
- Laporan.
- Profil.

Activate the existing Laporan route.

Suggested route structure:

app/
  (tabs)/
    reports.tsx
  reports/
    wajib.tsx
    sunnah.tsx
    quran.tsx
    dhikr.tsx
    goals.tsx
    calendar.tsx
    comparison.tsx

Adapt to actual Expo Router conventions.

Do not create duplicate navigation stacks.

Preserve the existing Beranda and Target UI.

==================================================
7. REPORT DATE RANGE
==================================================

Support:

WEEKLY
MONTHLY
YEARLY
CUSTOM

Default recommendation:
Current calendar week.

WEEKLY:
Use existing Week Start preference.

MONTHLY:
Use actual Gregorian calendar month.

YEARLY:
January 1 through December 31.

CUSTOM:
Allow user-selected start and end dates.

Use existing local date conventions.

Internal boundaries:
Inclusive start and exclusive end.

UI date range:
Inclusive start and inclusive end.

Validate:
- Valid local dates.
- Start date is not after end date.
- No future custom dates.
- Supported technical date range.

Do not use fixed 30-day months.
Do not use UTC date truncation for worship dates.

==================================================
8. PERIOD NAVIGATION
==================================================

Provide:

- Previous period.
- Next period.
- Return to current period.
- Date range selector.
- Custom date range selection.

Disable navigation into entirely future periods.

Preserve selected report date range when
opening detail analytics screens.

Avoid resetting filters unexpectedly when
returning from a detail screen.

Clearly identify the actual displayed dates.

==================================================
9. CURRENT PERIOD RULES
==================================================

For current calendar periods:

Exclude all future calendar dates.

Example:

Current date: November 28.

November report:
Calculate November 1 through November 28.

Do not include November 29 or November 30
as missed or unlogged worship days.

For today's obligatory prayer slots,
preserve existing Phase 03 and Phase 08 rules.

Upcoming or unlogged slots today may remain
applicable in the denominator.

However, do not classify them as MISSED.

Clearly identify an ongoing period.

Do not show unfinished periods as final failures.

==================================================
10. REPORTS HOME UI
==================================================

Follow this required layout order:

1. Laporan Ibadah header.
2. Supporting description.
3. Period filter.
4. Selected date range and navigation.
5. Forest Green obligatory prayer summary.
6. Two-column period summary cards.
7. Prayer trend chart.
8. Period comparison preview.
9. Detailed report shortcuts.
10. Consistency calendar shortcut.
11. Supportive footer.
12. Existing bottom navigation.

Preserve approved Hijra design identity.

Do not replace the layout with an unrelated
administrative dashboard.

Use actual calculated statistics.

Never hardcode demonstration values.

==================================================
11. VISUAL STRUCTURE REFERENCE
==================================================

+--------------------------------------+
| Laporan Ibadah           [Calendar] |
| Lihat perkembangan ibadahmu         |
+--------------------------------------+
| Mingguan | Bulanan | Tahunan        |
| [Custom date range]                  |
| < 16 - 22 November 2026 >            |
+--------------------------------------+
| PENYELESAIAN SHALAT WAJIB            |
| [Progress Ring]       30/35          |
| 85.7% tercatat selesai               |
+--------------------------------------+
| RINGKASAN PERIODE                    |
| +---------------+ +---------------+  |
| | Shalat Sunnah | | Al-Quran      |  |
| | 12 sesi       | | 235 ayat      |  |
| +---------------+ +---------------+  |
| +---------------+ +---------------+  |
| | Dzikir        | | Target Ibadah |  |
| | 1250 kali     | | 15/20         |  |
| +---------------+ +---------------+  |
+--------------------------------------+
| TREN SHALAT WAJIB                    |
| [Bar chart]                          |
+--------------------------------------+
| PERBANDINGAN PERIODE                 |
| [Current vs previous period]         |
+--------------------------------------+
| DETAIL LAPORAN                       |
| Shalat Wajib                    >    |
| Shalat Sunnah                   >    |
| Al-Quran                        >    |
| Dzikir & Tasbih                 >    |
| Target Ibadah                   >    |
| Kalender Konsistensi            >    |
+--------------------------------------+
| Setiap langkah berarti.              |
+--------------------------------------+
| Beranda Ibadah Target Laporan Profil |
+--------------------------------------+

All example data is illustrative.

==================================================
12. REPORT AGGREGATION ARCHITECTURE
==================================================

Create a centralized Reports Aggregation Service.

Suggested responsibilities:

- Resolve report date range.
- Resolve comparison date range.
- Aggregate saved worship transactions.
- Resolve applicable prayer slots.
- Calculate category-specific metrics.
- Calculate trend buckets.
- Produce consistency calendar data.
- Read historical goal configuration.
- Reconcile goal achievements.
- Produce period comparisons.

Reuse:

- Existing tracker repositories.
- Dashboard Aggregation Service.
- Goal Calculation Engine.
- Existing date utilities.

Use strongly typed TypeScript domain models.

Keep business calculations outside UI components.

Do not create independent calculation logic
that conflicts with existing tracker rules.

==================================================
13. DATABASE REQUIREMENTS
==================================================

Use existing hijrah.db.

Read existing:

- User profiles.
- App settings.
- Obligatory prayer records.
- Sunnah prayer sessions.
- Quran reading logs.
- Dhikr logs.
- Dhikr collection sessions.
- Personal goals.
- Goal versions.
- Goal periods.

Use actual table and field names.

No new database table is planned.

Do not create duplicate reporting transactions.

Do not persist unnecessary summary copies.

Add indexes only if actual performance requires
them and explain the reason.

Any database change must use a non-destructive,
versioned migration.

Do not reset hijrah.db.
Do not clear Expo Go application data.

Preserve all existing records.

==================================================
14. SHALAT WAJIB ANALYTICS
==================================================

Required metrics:

- Total expected prayer slots.
- Applicable prayer slots.
- Completed prayers.
- Missed prayers.
- Not-logged prayers.
- Exempt prayers.
- Completion percentage.
- Complete applicable days.
- On-time prayers.
- Congregational prayers.
- Breakdown by prayer type.

Prayer types:

- Subuh.
- Dzuhur.
- Ashar.
- Maghrib.
- Isya.

Use existing Phase 03 status semantics.

Do not infer prayer completion from
MyQuran schedule information.

Do not create new prayer records.

==================================================
15. OBLIGATORY PRAYER CALCULATION
==================================================

Expected slots =
Number of eligible calendar dates multiplied by 5.

Applicable slots =
Expected slots minus explicit EXEMPT slots.

Completed =
Actual saved COMPLETED prayer records.

Completion percentage =
Completed / Applicable slots * 100.

Example:

Seven completed calendar dates.
35 expected slots.
2 exempt slots.
28 completed prayers.

Expected:

Applicable: 33.
Completed: 28.
Completion rate: 84.85%.

If applicable slots are zero:

Percentage: NULL.
Status: NOT_APPLICABLE.

Never divide by zero.

Absent records remain NOT_LOGGED,
not automatically MISSED or EXEMPT.

Respect existing tracker eligibility boundaries.

Do not invent historical eligibility start dates
or classify pre-profile days as missed worship.

Clearly document any history-coverage limitation.

==================================================
16. ON-TIME AND CONGREGATION METRICS
==================================================

Use only COMPLETED prayer records.

On-time count:
COMPLETED records with explicit on-time YES.

Congregational count:
COMPLETED records with explicit congregation YES.

Reuse existing tracker percentage semantics:

On-time YES / COMPLETED.
Congregation YES / COMPLETED.

Display optional attribute coverage separately.

Example:

20 completed prayers.
12 recorded on time.
4 explicitly not on time.
4 unknown.

Expected:

On-time YES: 12.
On-time percentage of completed: 60%.
Unknown attribute count: 4.

Do not silently interpret unknown as NO.

Do not label the percentage as the rate
among known answers unless using that
separate denominator explicitly.

If no completed prayers exist:
Display N/A.

==================================================
17. SHALAT WAJIB DETAIL UI
==================================================

Display:

- Selected report period.
- Completion summary.
- Status breakdown.
- On-time statistics.
- Congregational statistics.
- Statistics for each prayer type.
- Complete applicable days.
- Historical trend.

Use donut, bar, stacked bar or equivalent
existing approved visualizations.

Clearly differentiate:

COMPLETED
MISSED
NOT_LOGGED
EXEMPT

Do not rely solely on color.

==================================================
18. SHALAT SUNNAH ANALYTICS
==================================================

Required metrics:

- Total saved sessions.
- Distinct activities.
- Distinct active dates.
- Total known rakaat.
- Rakaat coverage.
- Sessions per activity.
- Active days per activity.
- Trend over selected period.

Support existing:

- Tahajud.
- Dhuha.
- Witir.
- Rawatib.
- Other built-in activities.
- User-created custom activities.
- Archived historical activities.

Use stable activity IDs.

Do not group records by translated name alone.

Count multiple sessions on one day as
multiple sessions but one active day.

Do not treat unknown rakaat as known zero.

Do not create missed Sunnah records.

==================================================
19. SHALAT SUNNAH DETAIL UI
==================================================

Display:

- Total sessions.
- Distinct activities.
- Active days.
- Known recorded rakaat.
- Activity distribution chart.
- Sessions trend.
- Activity filter.
- Category-specific statistics.

Allow filtering by existing Sunnah activity.

Preserve archived activity display names
for historical reports.

Do not modify existing tracker records.

==================================================
20. QURAN READING ANALYTICS
==================================================

Required metrics:

- Total ayat read.
- Total saved reading sessions.
- Distinct active reading dates.
- Average ayat per elapsed report day.
- Average ayat per active reading day.
- Recorded reading duration when available.
- Distribution of reading volume by surah.
- Reading trend over selected period.

Use authoritative Quran reading logs.

Repeated intentional reading counts
as actual reading volume.

Do not label total ayat read / 6236
as khatam progress.

Do not count:

- Opening Quran Reader.
- Scrolling.
- Translation visibility.
- Bookmark changes.
- Unnumbered introductory Basmalah.

==================================================
21. CROSS-SURAH REPORTING
==================================================

For a reading session crossing surahs,
allocate the actual inclusive ayah range
to each corresponding surah.

Example:

Al-Fatihah ayah 6 through
Al-Baqarah ayah 3.

Expected:

Al-Fatihah: 2 ayat.
Al-Baqarah: 3 ayat.
Total: 5 ayat.

Reuse existing authoritative Quran
range calculation and master identifiers.

Do not count the entire session total
against each surah.

Verify:

Sum of allocated reading volume equals
the saved authoritative reading count.

If a legacy record lacks sufficient range data,
preserve its total and report an unallocated
category rather than guessing the distribution.

==================================================
22. QURAN DURATION RULES
==================================================

Use recorded duration only.

Inspect actual stored duration unit.

Convert units correctly.

Do not round individual sessions before summing.

Do not estimate missing duration using
ayah count or assumed reading speed.

If duration is unsupported:

Hide duration analytics or display
a concise unavailable indication.

Do not implement a new reading timer.

==================================================
23. QURAN DETAIL UI
==================================================

Display:

- Total ayat.
- Total sessions.
- Active reading days.
- Average daily reading.
- Recorded duration if supported.
- Reading trend chart.
- Surah reading distribution.
- Surah filter where supported.

Use actual reading logs.

Do not modify:

- Quran Arabic dataset.
- Quran font.
- Harakat and waqf marks.
- Basmalah numbering.
- MyQuran translation.
- Quran bookmarks.
- Existing Reader and Tracker behavior.

==================================================
24. DHIKR & TASBIH ANALYTICS
==================================================

Required metrics:

- Total actual repetitions.
- Total saved individual logs.
- Distinct activities.
- Distinct active dates.
- Checklist-only activity count.
- Completed collection count.
- Partial finalized collection count.
- Distribution by activity.
- Repetition trend.

Exclude unfinalized drafts.

Checklist-only logs may contribute
to session and active-day metrics.

They must not contribute to numeric
repetition totals.

Do not invent missing repetition values.

==================================================
25. DHIKR COLLECTION ANALYTICS
==================================================

Support existing collections:

- Dzikir Pagi.
- Dzikir Petang.
- Dzikir Setelah Shalat.

Use finalized parent collection status.

COMPLETED:
Count as completed collection.

PARTIAL:
Count as partial finalized collection.

DRAFT:
Exclude from finalized analytics.

Individual saved child logs may contribute
their actual repetitions and sessions.

Do not count parent session again as an
individual repetition or session log.

Preserve historical collection snapshots.

Reuse actual collection identifiers.

Do not introduce new religious completion rules.

==================================================
26. DHIKR DETAIL UI
==================================================

Display:

- Total repetitions.
- Saved sessions.
- Active days.
- Completed collections.
- Partial collections.
- Dzikir activity distribution.
- Repetition trend.
- Activity and collection filters.

Support existing custom Dzikir activities.

Preserve historical archived activity names.

Do not redesign the Digital Tasbih module.

==================================================
27. PERSONAL GOALS ANALYTICS
==================================================

Reuse Phase 07 Goal Calculation Engine.

Required metrics:

- Closed applicable goal periods.
- Achieved goal periods.
- Not-achieved goal periods.
- Not-applicable goal periods.
- Achievement rate.
- Breakdown by goal category.
- Breakdown by goal frequency.
- Historical achievement trends.

Preserve goal versioning.

Use the configuration applicable to
each historical period.

Do not apply the current target value
retroactively to older periods.

Reconcile derived historical results
against existing worship transactions.

==================================================
28. GOAL PERIOD ATTRIBUTION
==================================================

Avoid counting the same goal period
multiple times across report ranges.

Attribute a closed goal period to its
last included calendar date:

period_end_exclusive minus one calendar day.

Include closed periods when this date
falls inside the selected report range.

Example:

A weekly goal covers November 30
through December 6.

Its finalized achievement belongs to
December reporting.

Do not split one completed goal period
into multiple monthly achievement records.

Display open current goal periods separately
when they overlap the selected range.

Do not include open periods in the finalized
achievement-rate denominator.

Exclude paused and NOT_APPLICABLE periods
from the applicable achievement denominator.

==================================================
29. GOAL ACHIEVEMENT FORMULA
==================================================

Finalized achievement rate =

Achieved applicable closed goal periods
divided by all applicable closed goal periods
multiplied by 100.

Example:

20 closed goal periods:
15 achieved.
3 not achieved.
2 not applicable.

Expected:

Applicable denominator: 18.
Achieved: 15.
Achievement rate: 83.33%.

If no applicable closed periods exist:
Display N/A.

Do not average unrelated worship metrics.

Distinguish goal-period count from
number of unique personal goals.

==================================================
30. GOAL ANALYTICS UI
==================================================

Display:

- Finalized achievement summary.
- Achieved and not-achieved periods.
- Not-applicable count.
- Daily, weekly and monthly filters.
- Category filter.
- Historical progress.
- Existing active-period preview when relevant.
- Archived goal history.

Provide navigation to existing Goal Detail.

Do not duplicate goal management functionality.

==================================================
31. WORSHIP CONSISTENCY CALENDAR
==================================================

Implement a monthly calendar with
category-specific activity visualization.

Supported categories:

- Shalat Wajib.
- Shalat Sunnah.
- Quran.
- Dhikr.

Use existing Week Start preference.

Required features:

- Month navigation.
- Return to current month.
- Category selector.
- Calendar intensity visualization.
- Selected-day summary.
- Accessible color legend.
- Future date handling.

The calendar is an activity visualization,
not a unified worship or spiritual score.

==================================================
32. CALENDAR METRIC RULES
==================================================

WAJIB:

Show completed and applicable counts.

Distinguish:
- Fully completed applicable day.
- Partially completed day.
- Explicit missed records.
- No recorded activity.
- Fully exempt day.
- Future date.

SUNNAH:

Use saved session count.

QURAN:

Use total saved ayat count.

DHIKR:

Use actual saved repetition count.

If checklist or collection activity exists
with zero repetitions, provide a separate
activity indicator or explanatory label.

Use transparent category-specific
intensity thresholds.

Do not treat higher activity volume
as higher spiritual value.

==================================================
33. CALENDAR SELECTED-DAY DETAIL
==================================================

On date selection, display:

- Selected local date.
- Selected category.
- Actual daily metric.
- Applicable status when relevant.
- Secondary summary where useful.

Example:

Shalat Wajib:
4 of 4 applicable prayers completed.
1 exempt.

Quran:
20 ayat.
2 reading sessions.

Dhikr:
100 repetitions.
1 completed collection.

Reuse existing tracker navigation.

Do not implement full daily transaction history
or reflection journals in Phase 09.

Those belong to Phase 10.

==================================================
34. PERIOD COMPARISON
==================================================

Compare selected period against
the preceding comparable period.

WEEKLY:
Previous calendar week.

MONTHLY:
Previous calendar month.

YEARLY:
Previous calendar year.

CUSTOM:
Immediately preceding range of equal
calendar-day length.

For ongoing periods, compare the same
elapsed number of calendar days.

For unequal-length calendar periods:

- Clearly label the actual dates and day counts.
- Use normalized per-day metrics where appropriate.
- For matched-window volume comparisons,
  compare only the common available day count.
- Do not silently compare a partial month
  against a full previous month.

Show actual date ranges for both periods.

==================================================
35. COMPARISON CALCULATIONS
==================================================

For numeric activity metrics:

Absolute change =
Current value minus previous value.

Percentage change =
(Current - Previous) / Previous * 100.

Example:

Current Quran volume: 150 ayat.
Previous Quran volume: 100 ayat.

Expected:

Absolute change: +50 ayat.
Percentage change: +50%.

If previous value is zero:

Display absolute change.
Percentage change: unavailable.

Do not display Infinity or NaN.

For rates, use percentage-point differences.

Example:

Previous prayer completion: 80%.
Current prayer completion: 90%.

Expected:

+10 percentage points.

Do not incorrectly label it +10%
relative percentage growth.

If either rate is not applicable:
Display comparison unavailable.

==================================================
36. COMPARISON PRESENTATION
==================================================

Use paired bars or compact comparison rows.

Support:

- Prayer completion rate.
- Sunnah session count.
- Quran reading volume.
- Dhikr repetitions.
- Finalized goal achievement rate.

Display:
- Selected-period value.
- Previous-period value.
- Actual date ranges.
- Absolute change.
- Percentage change where valid.

Use neutral and supportive language.

Do not label lower worship volume
as a personal or religious failure.

Do not imply causation from statistical changes.

==================================================
37. CHART TIME BUCKETS
==================================================

Weekly report:
Daily buckets.

Monthly report:
Calendar-week segments clipped to the
selected month boundaries.

Yearly report:
Monthly buckets.

Custom report:
Choose daily, weekly or monthly buckets
based on actual selected range length.

Requirements:

- Chronological ordering.
- No overlapping buckets.
- No dates outside selected range.
- No future dates included.
- Correct localized labels.
- Actual bucket dates available in detail.

Totals across trend buckets must match
the corresponding report aggregate.

==================================================
38. DATA VISUALIZATION
==================================================

Use existing approved chart components
or lightweight native View-based visualizations.

No new chart dependency.

Supported visualizations:

- Progress ring or equivalent.
- Bar chart.
- Stacked bar chart.
- Horizontal distribution bar.
- Paired comparison bars.
- Calendar intensity visualization.

Use clear legends and units.

Show N/A distinctly from zero.

Avoid combining ayat, rakaat, sessions
and repetitions on one unlabelled axis.

Do not create a single combined worship score.

==================================================
39. AUTOMATIC REPORT REFRESH
==================================================

Refresh reports when:

- Laporan gains focus.
- Application resumes.
- Selected period changes.
- Category filter changes.
- Week Start changes.
- Relevant tracker records change.
- Goal calculation results change.
- Local date changes.

Handle historical corrections and deletions.

If a transaction moves to another date,
invalidate affected original and new periods.

Reuse existing invalidation mechanisms.

Prevent stale asynchronous query results
from overwriting newer filters.

==================================================
40. PERFORMANCE OPTIMIZATION
==================================================

Requirements:

- Efficient date-range queries.
- Parameterized SQLite queries.
- Appropriate aggregation queries.
- Avoid N+1 query patterns.
- Avoid unnecessary full-history scans.
- Batch related aggregations.
- Efficient list rendering.
- Memoized chart data where appropriate.
- Lazy-load detailed analytics when opened.

Do not load every detailed report
on application startup.

Long yearly and custom ranges must remain usable.

Avoid blocking the UI thread.

Do not persist duplicate transaction data
for performance convenience.

==================================================
41. EMPTY AND ERROR STATES
==================================================

Handle:

- No recorded activity.
- No personal goals.
- No applicable prayer slots.
- No finalized goal periods.
- Unknown optional data.
- No previous comparison data.
- Loading state.
- Local database query failure.
- Invalid date range.

No recorded numeric activity may show zero.

Undefined percentages must display N/A.

Do not use fake sample data as fallback.

Do not treat unknown values as zero.

Provide a retry action for recoverable errors.

==================================================
42. OFFLINE AND PRIVACY
==================================================

Reports must work without internet.

All calculations use local worship data.

Do not introduce:

- API calls.
- Remote analytics.
- Cloud synchronization.
- External tracking.
- Authentication requirements.
- Remote storage.

Do not transmit worship history.

Do not expose private worship notes
in summary reports.

Preserve existing local profile ownership.

==================================================
43. UI/UX DESIGN SYSTEM
==================================================

Preserve existing Hijra theme tokens.

Reference palette:

Primary:        #174638
Secondary:      #769B87
Accent:         #C7A76C
Background:     #F7F8F3
Surface:        #FFFFFF
Text Primary:   #20312A
Text Secondary: #64748B
Border:         #E2E8E3

Design direction:

- Modern Islamic.
- Calm.
- Premium.
- Compact.
- Informative.
- Beginner-friendly.
- Mobile-first.

Suggested dimensions:

Screen padding:      16-20.
Main heading:        24-28.
Section title:       16-18.
KPI value:           24-28.
Body text:           14-16.
Secondary text:      12-13.
Card radius:         14-16.
Card padding:        12-16.
Card spacing:        8-12.
Icon size:           22-24.
Minimum touch area:  48.

Do not hardcode light-mode styling.

==================================================
44. VISUAL CONFORMITY
==================================================

Follow the provided Reports Home layout.

Required visual hierarchy:

- Forest Green summary hero.
- Period controls above summaries.
- Two-column summary grid.
- Compact trend visualization.
- Period comparison card.
- Detailed report shortcuts.
- Consistency calendar.
- Existing bottom navigation.

Do not randomly rearrange the sections.

Phase 08 prototype conformity was successful.

Maintain the same design quality.

Document any necessary UI deviations
and reasons in the final report.

==================================================
45. LOCALIZATION & ACCESSIBILITY
==================================================

Support Indonesian and English.

Required labels:

Laporan Ibadah / Worship Reports
Ringkasan Periode / Period Summary
Mingguan / Weekly
Bulanan / Monthly
Tahunan / Yearly
Rentang Tanggal / Date Range
Perbandingan Periode / Period Comparison
Kalender Konsistensi / Consistency Calendar
Hari Aktif / Active Days
Tercatat Selesai / Recorded Complete
Belum Tercatat / Not Logged
Terlewat / Missed
Dikecualikan / Exempt
Tidak Berlaku / Not Applicable
Periode Berjalan / Current Period
Target Tercapai / Goals Achieved

Localize:

- Dates.
- Number formatting.
- Percentages.
- Units.
- Chart legends.
- Empty states.
- Error messages.
- Accessibility descriptions.

Support Light, Dark and System modes.

Support system font scaling.

Do not rely solely on color.

Provide readable textual chart summaries.

==================================================
46. IMPLEMENTATION SEQUENCE
==================================================

1. Inspect existing workspace.
2. Implement report date range utilities.
3. Implement centralized aggregation service.
4. Implement Shalat Wajib analytics.
5. Implement Shalat Sunnah analytics.
6. Implement Quran analytics.
7. Implement Dhikr analytics.
8. Integrate Goal Calculation Engine.
9. Implement period comparison.
10. Implement consistency calendar.
11. Implement Reports Home.
12. Implement detailed analytics screens.
13. Complete navigation and automatic refresh.
14. Complete localization and theme support.
15. Run testing.
16. Fix issues and retest.
17. Update documentation.

==================================================
47. MANDATORY ACCEPTANCE TESTS
==================================================

TEST A - PRAYER COMPLETION

7 eligible days.
35 expected prayer slots.
2 EXEMPT.
28 COMPLETED.

Expected:

28 / 33 applicable prayers.
84.85%.

TEST B - FULL EXEMPTION

All selected slots EXEMPT.

Expected:

N/A completion rate.

TEST C - FUTURE DATES

Current date November 28.
Selected report November.

Expected:

November 29 and 30 excluded from
applicable activity calculations.

TEST D - UNKNOWN ATTRIBUTES

Completed prayer with unknown on-time value.

Expected:

Not counted as explicit on-time YES.
Unknown coverage displayed correctly.

TEST E - SUNNAH

Two Tahajud sessions and one Dhuha session
recorded on the same date.

Expected:

3 sessions.
2 distinct activities.
1 active day.

TEST F - QURAN

Two saved reading sessions of 15 ayat.

Expected:

30 ayat.
2 sessions.

TEST G - CROSS-SURAH

Al-Fatihah ayah 6 through
Al-Baqarah ayah 3.

Expected:

2 ayat allocated to Al-Fatihah.
3 ayat allocated to Al-Baqarah.
5 ayat total.

TEST H - DHIKR

75 and 25 saved repetitions.
100 unsaved draft repetitions.

Expected:

100 recorded repetitions.

TEST I - COLLECTION STATUS

One completed collection.
One partial finalized collection.
One draft.

Expected:

1 completed.
1 partial.
Draft excluded.

TEST J - GOAL ACHIEVEMENT

15 achieved closed periods.
3 not-achieved closed periods.
2 not-applicable periods.

Expected:

15 / 18 applicable periods.
83.33%.

TEST K - GOAL VERSIONING

Historical target: 140 ayat.
Current target: 200 ayat.

Expected:

Historical report retains 140 as
the applicable historical target.

TEST L - PERIOD COMPARISON

Previous volume: 100.
Current volume: 150.

Expected:

+50 absolute change.
+50% relative change.

TEST M - ZERO BASELINE

Previous volume: 0.
Current volume: 100.

Expected:

+100 absolute change.
Relative percentage unavailable.

TEST N - CURRENT PERIOD

Compare the first 10 elapsed days of
the current month with the corresponding
available 10 days of the previous month.

Expected:

Comparable date ranges clearly displayed.

TEST O - CALENDAR

Select a date containing saved transactions.

Expected:

Calendar summary matches existing trackers.

TEST P - HISTORICAL CORRECTION

Edit or delete a historical transaction.

Expected:

Affected analytics and goal periods refresh.

TEST Q - OFFLINE

Disable internet connection.

Expected:

All report calculations and screens work.

==================================================
48. DATE AND AGGREGATION TESTING
==================================================

Test:

- Every Week Start preference.
- Weekly boundaries.
- Monthly boundaries.
- Yearly boundaries.
- Leap year.
- February.
- Thirty-day month.
- Thirty-one-day month.
- Custom date ranges.
- Local timezone changes.
- Current period cutoff.
- No future activity.
- Zero denominators.
- Missing optional values.
- Unequal comparison period lengths.
- Cross-surah allocation.
- Goal period attribution.
- Historical corrections.
- Trend bucket totals matching summaries.

==================================================
49. REGRESSION TESTING
==================================================

Verify existing:

- Local profile.
- App settings.
- Shalat Wajib Tracker.
- EXEMPT handling.
- Shalat Sunnah Tracker.
- Multiple Sunnah sessions.
- Custom activities.
- Quran Reader.
- Quran harakat and waqf.
- Basmalah numbering.
- MyQuran translation.
- Quran Reading Tracker.
- Quran bookmark.
- Continue Reading.
- Digital Tasbih.
- Persistent drafts.
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
- Goal lifecycle.
- Dashboard Integration.
- Dashboard automatic refresh.

Preserve Phase 08 passing behavior.

Fix regressions introduced by Phase 09.

Do not expand unrelated development scope.

==================================================
50. TECHNICAL VERIFICATION
==================================================

Run applicable scripts from package.json.

Expected checks where supported:

npm run typecheck
npm run lint
npx expo-doctor

Run applicable:

- Report date utility tests.
- Prayer aggregation tests.
- Sunnah aggregation tests.
- Quran allocation tests.
- Dhikr aggregation tests.
- Goal analytics tests.
- Period comparison tests.
- Calendar tests.
- Offline tests.
- Localization tests.
- Regression tests.

Use existing testing infrastructure.

Do not install additional testing libraries.

Use isolated fixtures where necessary.

Do not delete or reset Product Owner data.

Do not fabricate passing results.

Distinguish automated, emulator and
physical device verification.

==================================================
51. DOCUMENTATION
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

docs/REPORTS_ANALYTICS.md
docs/REPORT_CALCULATION_RULES.md
docs/PHASE_09_CODEX_PROMPT.md

Document:

- Actual report architecture.
- Report date boundaries.
- Prayer completion formula.
- Attribute coverage rules.
- Sunnah aggregation.
- Quran cross-surah allocation.
- Dhikr collection handling.
- Goal period attribution.
- Period comparisons.
- Chart time buckets.
- Consistency calendar rules.
- Automatic refresh.
- Offline behavior.
- Performance decisions.
- Actual database changes.
- Actual test results.
- Known limitations.
- UI deviations.

Preserve existing production licensing,
religious content review and Quran
transliteration backlog.

==================================================
52. STRICT OUT OF SCOPE
==================================================

Do not implement:

- Weekly Reflection journals.
- Personal evaluation questionnaires.
- Full transaction history module.
- Backup and Restore.
- PDF report export.
- Excel report export.
- CSV report export.
- Social sharing.
- Goal reminders.
- Prayer notifications.
- Streak systems.
- Achievement badges.
- Leaderboards.
- Spiritual scores.
- Quran Latin enhancement.
- Quran audio.
- Additional APIs.
- Online authentication.
- Cloud synchronization.
- Payments.
- Subscriptions.
- Advertisements.

Do not redesign Beranda, Ibadah or Target.

Do not start Phase 10.

==================================================
53. FINAL IMPLEMENTATION REPORT
==================================================

Provide:

1. Implementation summary.
2. Workspace assessment.
3. Created and modified files.
4. Reports Home implementation.
5. Date range implementation.
6. Shalat Wajib analytics.
7. Shalat Sunnah analytics.
8. Quran analytics.
9. Cross-surah allocation.
10. Dhikr analytics.
11. Personal Goals analytics.
12. Goal period attribution.
13. Consistency calendar.
14. Period comparison.
15. Automatic refresh.
16. Database changes, if any.
17. Dependency verification.
18. Offline verification.
19. Performance optimization.
20. UI conformity.
21. Actual UI deviations.
22. Localization verification.
23. Theme verification.
24. TypeScript verification.
25. Lint verification.
26. Expo Doctor verification.
27. Automated test results.
28. Regression testing results.
29. Physical device testing status.
30. Known limitations.
31. Remaining blockers.
32. Product Owner testing instructions.

Provide status for 09.1 through 09.10.

Possible statuses:

PHASE 09 DEVELOPMENT COMPLETE -
READY FOR PRODUCT OWNER TESTING

OR:

PHASE 09 DEVELOPMENT INCOMPLETE -
BLOCKERS REMAIN.

Do not claim formal UAT PASS.

==================================================
54. FINAL INSTRUCTIONS
==================================================

Implement Phase 09 directly in the
existing Hijra workspace.

Activate the Laporan menu.

Implement all ten development subphases.

Follow the specified visual hierarchy.

Use actual saved worship transactions.

Reuse existing tracker calculations.

Reuse Dashboard Aggregation Service.

Reuse Goal Calculation Engine.

Maintain accurate historical reports.

Maintain full offline functionality.

Maintain local user data privacy.

Do not introduce new dependencies.

Do not introduce duplicate transaction tables.

Do not reset hijrah.db.

Do not overwrite historical worship records.

Do not automatically commit or push.

Do not start Phase 10.

BUILD - TEST - FIX - RETEST.

BEGIN PHASE 09 IMPLEMENTATION NOW.