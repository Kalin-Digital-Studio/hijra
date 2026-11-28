# HIJRA - PHASE 08
# DASHBOARD INTEGRATION
# PRODUCT OWNER APPROVED

Act as a Senior React Native Developer,
Mobile Application Architect, TypeScript Engineer,
SQLite Database Engineer, Business Logic Engineer,
and Mobile UI/UX Designer.

Implement Phase 08 of the existing Hijra application.

The Product Owner has approved the Dashboard
Integration scope and the proposed Beranda UI.

Transform the existing Beranda screen into a
comprehensive Personal Worship Dashboard.

Perform actual implementation directly in
the existing workspace.

Do not initialize a new project.

==================================================
1. PROJECT INFORMATION
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

Development methodology:

BUILD - TEST - FIX - RETEST.

Formal Product Owner UAT remains scheduled
for Phase 12.

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

The Product Owner has confirmed that the Target
menu is functionally working.

Some Phase 07 UI details differ from the prototype.

Do not redesign Phase 07 during this phase.

Preserve existing functional implementations.

Do not falsely assume all previous regression
tests have passed.

Quran Latin transliteration remains deferred.

Do not resume that enhancement.

==================================================
3. PRE-IMPLEMENTATION ASSESSMENT
==================================================

Before modifying files:

- Execute git status.
- Inspect current uncommitted changes.
- Inspect package.json.
- Inspect dependency lockfile.
- Identify actual Expo SDK.
- Inspect existing Beranda screen.
- Inspect Expo Router navigation.
- Inspect existing Dashboard components.
- Inspect existing Dashboard repositories.
- Inspect SQLite schema.
- Inspect user profile and avatar.
- Inspect existing theme architecture.
- Inspect localization architecture.
- Inspect local date utilities.
- Inspect existing state management.
- Inspect existing tracker repositories.
- Inspect existing MyQuran integration.
- Inspect existing prayer schedule service.
- Inspect existing countdown calculation.
- Inspect Quran bookmark service.
- Inspect Phase 07 Goal Calculation Engine.
- Inspect existing chart components.
- Inspect existing testing infrastructure.
- Inspect project licensing documentation.

Reuse actual existing code and conventions.

Do not assume proposed filenames or table names
match the current implementation.

Do not overwrite Product Owner changes.

Do not interrupt concurrent development tasks.

Do not upgrade Expo SDK.

Do not install new dependencies.

==================================================
4. APPROVED DEVELOPMENT SCOPE
==================================================

Implement:

08.1 - Personalized Greeting & Profile.
08.2 - Prayer Schedule & Countdown.
08.3 - Daily Worship Summary.
08.4 - Quran Continue Reading.
08.5 - Personal Goals Summary.
08.6 - Seven-Day Worship Trend.
08.7 - Recent Worship Activities.
08.8 - Automatic Dashboard Refresh.
08.9 - Offline & Performance Optimization.
08.10 - Integration & Regression Testing.

The primary development scope is Beranda.

Do not proceed to Phase 09.

==================================================
5. DASHBOARD BUSINESS OBJECTIVE
==================================================

Beranda is the personal information center.

It must answer:

- What is the next prayer time?
- What worship activities have I recorded today?
- Where did I finish reading the Quran?
- How is my personal goal progress?
- How consistent are my recorded prayers?
- What activities have I recently recorded?

Ibadah remains the worship execution and
Islamic learning center.

Target remains the personal goal management center.

Laporan will contain detailed analytics
during Phase 09.

Do not duplicate their entire functionality
inside Beranda.

==================================================
6. MANDATORY DASHBOARD LAYOUT
==================================================

Follow the approved Product Owner prototype.

Required section order:

1. Personalized Header.
2. Next Prayer Hero Card.
3. Ibadah Hari Ini.
4. Quran Continue Reading.
5. Target Ibadah Hari Ini.
6. Konsistensi 7 Hari Terakhir.
7. Aktivitas Terakhir.
8. Learn - Practice - Grow Footer.
9. Existing Bottom Navigation.

Do not randomly rearrange these sections.

Do not replace the approved visual hierarchy
with a generic administrative dashboard.

The Daily Worship Summary must use a compact
two-column grid.

The Next Prayer Card must use a prominent
Forest Green background.

The Quran Continue Reading Card must use
a soft green surface with a clear primary action.

The Goal Summary must include a visual progress
indicator and up to three individual goal previews.

The Seven-Day Trend must use a compact bar chart
or equivalent existing approved component.

The Recent Activities section must use
a readable compact activity list.

Preserve the approved hierarchy in both
Light and Dark modes.

==================================================
7. VISUAL STRUCTURE REFERENCE
==================================================

Follow this structural reference:

+--------------------------------------+
| Hijra.                      [Avatar] |
| Assalamu'alaikum, [Name]             |
| [Current Local Date]                 |
+--------------------------------------+
| [Location]                    [Icon] |
| Waktu shalat berikutnya              |
| Dzuhur                        11:43  |
| 4 jam 23 menit lagi                  |
| Lihat jadwal lengkap                 |
+--------------------------------------+
| IBADAH HARI INI                      |
| +---------------+ +---------------+  |
| | Shalat Wajib  | | Shalat Sunnah |  |
| |      3/5      | |       2       |  |
| +---------------+ +---------------+  |
| +---------------+ +---------------+  |
| | Al-Quran      | | Dzikir        |  |
| |      35       | |      199      |  |
| +---------------+ +---------------+  |
+--------------------------------------+
| LANJUTKAN MEMBACA                    |
| Al-Baqarah                           |
| Terakhir membaca ayat 45            |
| Lanjutkan dari ayat 46               |
| [Lanjutkan Membaca]                  |
+--------------------------------------+
| TARGET IBADAH HARI INI               |
| [Progress Ring]  3 dari 5 target     |
| Quran           35/50    [Progress]  |
| Istighfar      100/100   [Progress]  |
| Dhuha             1/1    [Progress]  |
+--------------------------------------+
| KONSISTENSI 7 HARI TERAKHIR          |
| [Seven-Day Prayer Bar Chart]         |
+--------------------------------------+
| AKTIVITAS TERAKHIR                   |
| Quran Reading              07:15    |
| Shalat Dhuha               06:45    |
| Istighfar                  05:30    |
+--------------------------------------+
| Learn - Practice - Grow              |
| Every day, a better journey.         |
+--------------------------------------+
| Beranda Ibadah Target Laporan Profil |
+--------------------------------------+

All example data is illustrative.

Never hardcode these values in production.

Use actual user data.

==================================================
8. PERSONALIZED GREETING
==================================================

Use the existing local user profile.

Display:

- Hijra brand name.
- Assalamu'alaikum greeting.
- User display name when available.
- Current local Gregorian date.
- Existing local profile avatar.

If no avatar exists:

Use the existing profile fallback icon.

If no display name exists:

Display the greeting without a name.

Avatar action opens the existing Profile menu.

Do not duplicate profile storage.

Do not add a remote profile service.

==================================================
9. PRAYER SCHEDULE HERO CARD
==================================================

Reuse the Phase 06B MyQuran integration.

Display:

- Selected city or regency.
- Next obligatory prayer.
- Scheduled prayer time.
- Remaining countdown.
- Relevant prayer icon.
- Link to full prayer schedule.

Required prayer names:

- Subuh.
- Dzuhur.
- Ashar.
- Maghrib.
- Isya.

Use existing verified prayer schedule data.

Do not hardcode prayer times.

Do not implement a second prayer schedule engine.

Do not implement a separate city preference.

Reuse the selected city from Ibadah Hub.

Changing the city in the existing settings
must also update Beranda.

==================================================
10. PRAYER COUNTDOWN RULES
==================================================

Reuse existing countdown calculation.

Requirements:

- Calculate countdown locally.
- Respect the selected city timezone.
- Support WIB, WITA and WIT.
- Handle local midnight.
- Handle application resume.
- Handle city changes.
- Handle month and year boundaries.

After Isya:

Use tomorrow's verified Subuh schedule.

Do not reuse today's Subuh time as tomorrow's
schedule without verification.

Do not perform API requests every second.

Do not automatically mark a prayer as completed
or missed based on schedule time.

Prayer schedule dates and worship transaction
dates have different responsibilities.

Prayer schedules follow the selected city timezone.

Personal worship summaries follow existing
tracker local-date conventions.

Do not silently mix these date rules.

==================================================
11. PRAYER SERVICE ERROR HANDLING
==================================================

Handle:

- No selected city.
- No internet connection.
- Provider unavailable.
- Request timeout.
- Invalid API response.
- HTTP 429.
- Missing tomorrow schedule.
- Unavailable or expired cached data.

When no city is selected:

Display a clear Select City action.

When schedule data is unavailable:

Display a concise unavailable state and retry.

Reuse permitted cached data according to
existing content permission policies.

Never display guessed prayer times.

Do not block the entire Dashboard when
MyQuran is unavailable.

==================================================
12. DAILY WORSHIP SUMMARY
==================================================

Create four compact summary cards.

1. Shalat Wajib.
2. Shalat Sunnah.
3. Al-Quran.
4. Dzikir & Tasbih.

Use actual saved activity records for today.

Every card must navigate to the corresponding
existing tracker.

Do not create new tracking functionality
inside Beranda.

Do not duplicate transaction records.

==================================================
13. SHALAT WAJIB SUMMARY
==================================================

Display:

- Completed prayer count.
- Applicable obligatory prayer count.
- Progress bar where applicable.

Calculation:

Applicable prayers = 5 - exempt prayer slots.

Completed prayers = saved COMPLETED records.

Example:

3 completed prayers.
1 exempt prayer.
1 not logged prayer.

Expected:

3/4 completed.
75%.

If all five prayers are EXEMPT:

Display Not Applicable.

Do not display 0% or 100%.

Unlogged prayers are not EXEMPT.

Do not count elapsed prayer times as completed.

Reuse existing Phase 03 business rules.

==================================================
14. SHALAT SUNNAH SUMMARY
==================================================

Primary metric:

Total saved Sunnah sessions today.

Optional secondary information when useful:

- Distinct Sunnah activities.
- Known recorded rakaat.

Do not confuse distinct activity count
with session count.

Example:

Two Tahajud sessions.
One Dhuha session.

Expected:

3 sessions.
2 distinct activities.

Do not estimate missing rakaat values.

Do not display unknown rakaat as known zero.

Reuse existing aggregation services.

==================================================
15. QURAN SUMMARY
==================================================

Primary metric:

Total ayat read today.

Use authoritative saved Quran reading logs.

Optional secondary metric:

Total reading sessions today.

Do not count unique verses as reading volume.

Repeated intentional reading sessions remain
valid reading volume.

Do not count:

- Opening Quran Reader.
- Scrolling.
- Changing font settings.
- Displaying translation.
- Changing bookmark.
- Unnumbered introductory Basmalah.

Preserve all Phase 05 reading calculations.

==================================================
16. DHIKR & TASBIH SUMMARY
==================================================

Primary metric:

Total actual saved repetitions today.

Optional secondary metrics:

- Saved sessions.
- Completed collections.

Exclude draft counters from completed activity.

Do not count checklist-only records as
numeric repetitions.

Do not count collection parents and child
logs twice.

A completed checklist or collection can still
be shown as recorded activity when the
numeric repetition total is zero.

Preserve existing Phase 06 semantics.

==================================================
17. QURAN CONTINUE READING
==================================================

Create a dedicated Continue Reading card.

Display:

- Surah name.
- Arabic surah name.
- Last reading position.
- Next reading position.
- Continue Reading action.

Use the existing Quran bookmark service.

Example:

Last position:
Al-Baqarah ayah 45.

Next position:
Al-Baqarah ayah 46.

At the end of a surah:

Continue using the next surah according
to existing rules.

At the end of An-Nas:

Preserve the existing explicit restart behavior.

Do not automatically declare khatam.

If no bookmark exists:

Display a friendly Start Reading action.

Do not fabricate an existing reading position.

Do not modify Quran bookmarks merely
because Beranda is opened.

Do not change Quran Arabic text, font,
harakat, waqf marks or Basmalah numbering.

==================================================
18. PERSONAL GOALS SUMMARY
==================================================

Reuse the Phase 07 Goal Calculation Engine.

Display:

- Applicable active daily goals.
- Achieved daily goals.
- In-progress daily goals.
- Achievement percentage.
- Up to three individual goal previews.
- Link to the Target menu.

Do not implement a duplicate calculation engine.

Do not query personal_goal_periods as if cached
progress were always authoritative.

Ensure current calculations are refreshed
using existing Phase 07 services.

Respect goal lifecycle and versioning:

- ACTIVE.
- PAUSED.
- ARCHIVED.
- Pending configuration.
- Effective dates.

The Beranda summary is for DAILY goals only.

Weekly and monthly goals remain available
in the Target menu.

==================================================
19. GOAL SUMMARY CALCULATION
==================================================

Achievement percentage:

Achieved applicable active goals
divided by applicable active goals
multiplied by 100.

Example:

5 applicable daily goals.
3 achieved goals.

Expected:

60%.

Exclude NOT_APPLICABLE goals.

Exclude goals not effective for today.

Do not average unrelated individual percentages.

Do not present the result as a spiritual score.

For individual goal previews:

Display actual and effective target values.

Actual progress may exceed 100%.

Cap only the visual progress bar at 100%.

Use a stable preview ordering.

Prefer applicable in-progress goals first,
followed by achieved goals.

Limit the preview to three goals.

All active daily goals remain included
in the summary calculation.

==================================================
20. GOAL SUMMARY EMPTY STATES
==================================================

If there are no daily goals:

Display:

"Mulai perjalananmu."

"Buat target ibadah sesuai kemampuanmu."

Provide an action to the existing
Target creation or template screen.

If all daily goals are NOT_APPLICABLE:

Display an appropriate N/A summary.

Do not show misleading zero percentages.

If weekly or monthly goals exist but
daily goals do not:

Explain that no daily goal is active.

Provide a shortcut to view all goals.

==================================================
21. SEVEN-DAY WORSHIP TREND
==================================================

Create a compact seven-day chart.

Phase 08 chart scope:

Recorded obligatory prayer completion.

The range includes:

Today and the previous six local dates.

Use chronological order.

For every date calculate:

- Completed obligatory prayers.
- Applicable obligatory prayers.
- Exempt prayers.
- Unlogged prayers.

Use raw completed prayer counts on the Y-axis.

Expected range:

0 through 5.

Do not present these counts as completion
percentages or spiritual achievement scores.

Use actual dates for labels.

This is a rolling seven-day chart,
not a calendar-week report.

Week Start settings must not change
the rolling seven-day date range.

==================================================
22. CHART EXEMPTION HANDLING
==================================================

Highlight a fully completed applicable day
using the approved success color.

Example:

4 completed prayers.
1 exempt prayer.

This is a completed applicable day,
even though the bar height is 4.

If all prayers are EXEMPT:

Display N/A instead of a failed zero bar.

If a date has no recorded transactions:

Display no recorded activity.

Distinguish that state from an explicitly
recorded MISSED status where possible.

Do not classify an ongoing day as failed.

Provide accessible descriptions.

Example:

Monday:
4 of 4 applicable prayers completed.
1 exempt.

Use existing approved chart components.

Do not install a new chart dependency.

==================================================
23. RECENT WORSHIP ACTIVITIES
==================================================

Create a unified recent activity list
from existing tracker data.

Include qualifying saved activities from:

- Shalat Wajib.
- Shalat Sunnah.
- Quran Reading.
- Dzikir & Tasbih.

Display up to five recent items.

Each item includes:

- Category icon.
- Activity title.
- Relevant activity details.
- Date or time when reliably recorded.
- Existing detail or tracker navigation.

Examples:

Subuh - Selesai.

Shalat Dhuha - 2 rakaat.

Al-Baqarah - Ayat 31-45.

Istighfar - 100 pengulangan.

Use actual stored values.

Do not invent activity times.

If an activity has only a date,
display the date without a fabricated time.

Do not expose private notes in the
Dashboard activity preview.

==================================================
24. RECENT ACTIVITY ORDERING
==================================================

Normalize the existing activity records
into one presentation model.

Suggested fields:

- id
- category
- activityDate
- recordedAt
- actualActivityTime
- title
- subtitle
- route
- routeParameters

Preserve the distinction between:

- Actual activity date or time.
- Time the transaction was recorded.

Use the latest saved activity date first.

For records on the same date, use a reliable
recorded timestamp where available.

Use a stable deterministic tie-breaker.

Do not claim a precise actual activity time
when only the insertion timestamp exists.

Exclude drafts.

Avoid showing a collection parent and every
child as duplicate feed entries.

Represent a finalized collection as one
feed item where appropriate.

Individual standalone Dzikir logs remain
independent feed items.

==================================================
25. DASHBOARD AGGREGATION SERVICE
==================================================

Create or enhance a reusable Dashboard
Aggregation Service.

Reuse existing repositories.

Suggested domain model:

DashboardSummary:

- profile
- localDate
- prayerSummary
- sunnahSummary
- quranSummary
- dhikrSummary
- quranContinueReading
- dailyGoalSummary
- sevenDayPrayerTrend
- recentActivities
- calculatedAt

Keep prayer schedule network state
independent from local worship summaries.

Do not block SQLite aggregation while
waiting for a remote API response.

Use strongly typed TypeScript models.

Keep calculation logic outside
individual UI components.

==================================================
26. DATABASE ARCHITECTURE
==================================================

Use the existing hijrah.db database.

Read existing:

- User profiles.
- App settings.
- Shalat Wajib transactions.
- Shalat Sunnah sessions.
- Quran reading logs.
- Quran bookmarks.
- Dzikir logs.
- Dzikir collection sessions.
- Personal goals.
- Goal versions.
- Goal periods.

Use actual table names and schemas.

No new database table is planned.

Do not create duplicate dashboard
transaction or summary tables.

Prefer derived summaries and existing
repositories.

Only add necessary indexes if justified
by actual query performance.

Any schema change must use a
non-destructive versioned migration.

Do not reset hijrah.db.

==================================================
27. AUTOMATIC DASHBOARD REFRESH
==================================================

Refresh relevant Dashboard sections when:

- Application initializes.
- Beranda gains focus.
- Application resumes.
- Local date changes.
- User changes profile.
- Prayer city changes.
- Shalat Wajib records change.
- Shalat Sunnah sessions change.
- Quran reading sessions change.
- Quran bookmark changes.
- Dzikir records change.
- Dzikir collections change.
- Personal goals change.
- Goal calculation results change.

Reuse existing state management
and repository invalidation mechanisms.

Support pull-to-refresh if appropriate.

Do not require manual reload after
every worship transaction.

Do not reload the entire application.

==================================================
28. DATE ROLLOVER
==================================================

Handle the application remaining open
across midnight.

At the next local day:

- Update greeting date.
- Refresh daily worship summary.
- Refresh daily goals.
- Refresh seven-day chart.
- Resolve next prayer schedule.

Do not delete yesterday's data.

Continue Reading position persists
across date changes.

Recent activity history remains available.

Use existing local-date utilities.

Avoid fixed 24-hour calculations where
calendar-date arithmetic is required.

==================================================
29. PERFORMANCE OPTIMIZATION
==================================================

Requirements:

- Efficient SQLite queries.
- Indexed date filters where available.
- Reuse existing aggregate functions.
- Avoid unnecessary N+1 queries.
- Avoid repeated full-history scans.
- Avoid blocking the UI thread.
- Avoid duplicated API requests.
- Avoid unnecessary chart re-renders.

Countdown updates must not trigger
a full Dashboard database query.

Keep the countdown state isolated.

Prevent stale asynchronous results
from overwriting newer results.

Use bounded loading and refresh states.

Preserve last valid local summary during
refresh where appropriate.

Do not introduce excessive abstractions.

==================================================
30. OFFLINE BEHAVIOR
==================================================

Without internet, Beranda must still show:

- Existing profile.
- Current local date.
- Daily worship summaries.
- Quran Continue Reading.
- Personal goal progress.
- Seven-day worship trend.
- Recent recorded activities.

Prayer times may remain available using
existing permitted valid cached data.

When prayer schedule data is unavailable:

Only the prayer schedule section should
show an offline or unavailable state.

Do not disable the entire Beranda screen.

Do not block local tracker shortcuts.

==================================================
31. UI DESIGN SYSTEM
==================================================

Preserve Hijra visual identity.

Reference palette:

Primary:        #174638
Secondary:      #769B87
Accent:         #C7A76C
Background:     #F7F8F3
Surface:        #FFFFFF
Text Primary:   #20312A
Text Secondary: #64748B
Border:         #E2E8E3

Use actual centralized theme tokens.

Design direction:

- Modern Islamic.
- Premium.
- Calm.
- Compact.
- Informative.
- Mobile-first.

Recommended dimensions:

Screen padding:       16-20.
Section title:        16-18.
Main heading:         24-28.
Hero prayer time:     32-40.
KPI values:           24-28.
Body text:            14-16.
Secondary text:       12-13.
Card radius:          14-16.
Card padding:         12-16.
Card spacing:         8-12.
Icon size:            22-24.
Minimum touch target: 48.

Keep card heights consistent where appropriate.

Avoid oversized cards and excessive whitespace.

Do not use rigid heights that clip text.

Reuse the existing approved icon family.

==================================================
32. VISUAL IMPLEMENTATION REQUIREMENT
==================================================

The Product Owner previously reported UI differences
between the Phase 07 prototype and implementation.

For Phase 08, follow the approved layout
reference closely.

Preserve:

- Section order.
- Visual hierarchy.
- Forest Green prayer hero.
- Two-column worship KPI grid.
- Quran Continue Reading card.
- Goal progress summary.
- Compact seven-day chart.
- Recent activity list.
- Existing bottom navigation.

Use actual available screen width.

Adapt for accessibility and small devices.

If a UI deviation is necessary because of
existing components or platform limitations:

Document the exact deviation and its reason.

Do not silently replace the design with
an unrelated layout.

Do not install new dependencies to reproduce
decorative effects.

==================================================
33. LOCALIZATION
==================================================

Support Indonesian and English.

Required labels:

Beranda / Home
Ibadah Hari Ini / Today's Worship
Waktu Shalat Berikutnya / Next Prayer
Lihat Jadwal Lengkap / View Full Schedule
Lanjutkan Membaca / Continue Reading
Mulai Membaca / Start Reading
Terakhir Membaca / Last Reading Position
Target Ibadah Hari Ini / Today's Worship Goals
Target Tercapai / Goals Achieved
Lihat Semua / View All
Konsistensi 7 Hari Terakhir / Last 7 Days
Aktivitas Terakhir / Recent Activities
Tidak Berlaku / Not Applicable
Belum Ada Aktivitas / No Recorded Activity
Pilih Kota / Select City
Coba Lagi / Try Again

Localize:

- Date labels.
- Countdown units.
- Prayer names.
- Metric units.
- Empty states.
- Error states.
- Accessibility descriptions.

Preserve existing translation architecture.

==================================================
34. ACCESSIBILITY
==================================================

Support:

- Screen reader labels.
- Text scaling.
- Accessible progress descriptions.
- Sufficient contrast.
- Minimum touch targets.
- Safe areas.
- Small screen layouts.
- Long user names.
- Long goal names.
- Light, Dark and System modes.

Do not rely on color alone.

Charts must provide understandable
textual descriptions.

==================================================
35. NAVIGATION INTEGRATION
==================================================

Use actual existing routes.

Required shortcuts:

Profile avatar:
Open Profile.

Prayer hero:
Open Prayer Schedule.

Shalat Wajib card:
Open Shalat Wajib Tracker.

Shalat Sunnah card:
Open Shalat Sunnah Tracker.

Quran card:
Open Quran module.

Dzikir card:
Open Dzikir & Tasbih.

Continue Reading:
Open Quran Reader at the correct next position.

Goal summary:
Open Target menu.

Individual goal preview:
Open Goal Detail when supported.

Recent activity:
Open its existing detail or relevant tracker.

Do not invent unsupported route parameters.

Do not add duplicate navigation stacks.

Preserve the existing five bottom tabs.

==================================================
36. IMPLEMENTATION SEQUENCE
==================================================

Step 1:

Inspect existing workspace and prepare
a concise implementation plan.

Step 2:

Implement or enhance Dashboard
Aggregation Service.

Step 3:

Integrate local profile and prayer schedule.

Step 4:

Integrate four daily worship summaries.

Step 5:

Integrate Quran Continue Reading.

Step 6:

Integrate Phase 07 Goal Summary.

Step 7:

Implement seven-day prayer trend.

Step 8:

Implement unified recent activities.

Step 9:

Implement approved Beranda layout.

Step 10:

Implement navigation shortcuts.

Step 11:

Implement automatic refresh and offline states.

Step 12:

Complete theme and localization support.

Step 13:

Run automated and development tests.

Step 14:

Fix issues and retest.

Step 15:

Update project documentation.

==================================================
37. MANDATORY ACCEPTANCE TESTS
==================================================

TEST A - SHALAT WAJIB

Record three completed prayers,
one exempt prayer and one unlogged prayer.

Expected:

3/4 applicable prayers completed.
75%.

TEST B - SHALAT SUNNAH

Record two Tahajud sessions and one Dhuha session.

Expected:

3 Sunnah sessions.

TEST C - QURAN

Save a 15-ayat reading session.

Expected:

Dashboard Quran count increases by 15.

TEST D - DHIKR

Save 75 Istighfar repetitions.

Expected:

Dashboard repetition total increases by 75.

Create a new draft of 100 repetitions.

Expected:

Draft does not increase the Dashboard total.

TEST E - CONTINUE READING

Save a reading session ending at
Al-Baqarah ayah 45 with bookmark update.

Expected:

Continue Reading opens ayah 46.

TEST F - PERSONAL GOALS

Create a daily Quran target of 20 ayat.

Record 15 ayat in a clean test period.

Expected:

Target preview displays 15/20.

Record another 5 ayat.

Expected:

Target preview becomes 20/20.
Achieved goal count increases by one.

TEST G - HISTORICAL CORRECTION

Correct or delete an existing transaction.

Expected:

Dashboard summaries, applicable chart
values and goal progress are refreshed.

TEST H - NO INTERNET

Disable internet connection.

Expected:

All local Dashboard summaries remain available.

Prayer schedule displays valid permitted
cached content or an unavailable state.

TEST I - CITY CHANGE

Change city through existing prayer settings.

Expected:

Beranda prayer schedule and countdown
use the new selected city.

TEST J - MIDNIGHT ROLLOVER

Simulate a local calendar date change.

Expected:

Daily summaries and goals resolve the new day.

Previous-day history remains intact.

TEST K - NO PERSONAL DATA

Use an isolated clean test profile or fixture.

Expected:

Valid empty states.
No fictional statistics.
No crashes.
No misleading percentages.

Do not erase Product Owner data to run tests.

==================================================
38. REGRESSION TESTING
==================================================

Verify existing:

- Application initialization.
- Local profile.
- Theme settings.
- Language settings.
- Week Start settings.
- Shalat Wajib statuses.
- Shalat Sunnah sessions.
- Quran Arabic text.
- Quran harakat and waqf marks.
- Quran Basmalah numbering.
- Quran translation.
- Quran Reading Tracker.
- Quran bookmarks.
- Digital Tasbih.
- Dzikir drafts.
- Dzikir collections.
- Custom activities.
- MyQuran services.
- Arah Kiblat.
- Kalender Islam.
- Hadith.
- Doa Harian.
- Asmaul Husna.
- Personal Goals.
- Goal versioning.
- Goal history.
- Pause, Resume and Archive.

Do not expand previous phase scope.

If existing unrelated issues are discovered,
document them separately.

Fix regressions introduced by Phase 08.

==================================================
39. TECHNICAL VERIFICATION
==================================================

Run actual applicable scripts from package.json.

Expected checks where supported:

npm run typecheck
npm run lint
npx expo-doctor

Run applicable:

- Dashboard aggregation tests.
- Prayer timezone tests.
- Daily summary tests.
- Exemption tests.
- Goal summary tests.
- Quran bookmark tests.
- Seven-day chart tests.
- Recent activity ordering tests.
- Date rollover tests.
- Offline tests.
- Localization tests.
- Regression tests.

Use existing testing infrastructure.

Do not install new dependencies.

If a test cannot be executed, explain why.

Do not fabricate test results.

Distinguish:

- Automated verification.
- Emulator verification.
- Physical device verification.
- Product Owner testing.

==================================================
40. DOCUMENTATION
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

docs/DASHBOARD_INTEGRATION.md
docs/PHASE_08_CODEX_PROMPT.md

Document:

- Approved layout.
- Actual Dashboard architecture.
- Existing data sources.
- Summary calculation rules.
- Prayer schedule reuse.
- Goal Calculation Engine integration.
- Quran Continue Reading integration.
- Recent activity normalization.
- Date handling.
- Refresh behavior.
- Offline behavior.
- Performance decisions.
- Actual UI deviations.
- Actual testing results.
- Remaining blockers.

Preserve existing content licensing
and religious review requirements.

==================================================
41. STRICT OUT OF SCOPE
==================================================

Do not implement:

- Complete Reports & Analytics.
- Weekly Reflection.
- Backup and Restore.
- Quran Latin transliteration.
- Quran dataset replacement.
- Quran audio.
- Prayer notifications.
- Adhan audio.
- Goal reminders.
- Streak system.
- Achievement badges.
- Gamification.
- Leaderboards.
- Spiritual scoring.
- Online authentication.
- Cloud synchronization.
- Payments.
- Subscriptions.
- Advertisements.
- Additional external APIs.

Do not redesign Ibadah or Target.

Do not start Phase 09.

==================================================
42. FINAL IMPLEMENTATION REPORT
==================================================

Provide:

1. Phase 08 implementation summary.
2. Existing workspace assessment.
3. Created and modified files.
4. Dashboard Aggregation Service.
5. Profile integration.
6. Prayer schedule integration.
7. Daily worship summaries.
8. Quran Continue Reading.
9. Personal Goals integration.
10. Seven-day worship trend.
11. Recent activity integration.
12. Automatic refresh behavior.
13. Date rollover behavior.
14. Offline verification.
15. Performance optimization.
16. Database changes, if any.
17. Dependency change verification.
18. UI conformity to approved prototype.
19. Any visual deviations and reasons.
20. Localization verification.
21. Theme verification.
22. TypeScript verification.
23. Lint verification.
24. Expo Doctor verification.
25. Automated test results.
26. Regression test results.
27. Physical device testing status.
28. Known limitations.
29. Remaining blockers.
30. Product Owner manual testing guide.

Provide a status table for 08.1 through 08.10.

Possible completion statuses:

PHASE 08 DEVELOPMENT COMPLETE -
READY FOR PRODUCT OWNER TESTING

OR:

PHASE 08 DEVELOPMENT INCOMPLETE -
BLOCKERS REMAIN

Do not claim formal UAT PASS.

==================================================
43. FINAL INSTRUCTIONS
==================================================

Implement Phase 08 directly in the
existing Hijra workspace.

Transform Beranda into the approved
Personal Worship Dashboard.

Follow the approved visual structure.

Integrate actual existing data.

Reuse all existing tracker services.

Reuse the existing MyQuran integration.

Reuse the existing Goal Calculation Engine.

Maintain full offline access to local
worship information.

Do not introduce new dependencies.

Do not introduce duplicate transaction tables.

Do not reset hijrah.db.

Do not overwrite historical worship records.

Do not automatically commit or push.

Do not start Phase 09.

BUILD - TEST - FIX - RETEST.

BEGIN PHASE 08 IMPLEMENTATION NOW.