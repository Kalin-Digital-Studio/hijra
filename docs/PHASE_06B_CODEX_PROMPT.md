
# HIJRA — PHASE 06B
# ISLAMIC LIFESTYLE HUB & MYQURAN INTEGRATION

Act as a Senior React Native Developer, Mobile Application
Architect, TypeScript Engineer, REST API Integration Engineer,
SQLite Database Engineer, Mobile Sensor Engineer, and UI/UX
Designer.

Implement Phase 06B of the existing Hijra application.

Transform the existing Ibadah landing page into a comprehensive
Islamic Lifestyle Hub.

Perform actual implementation in the existing workspace.
Do not initialize a new project.

==================================================
1. PROJECT INFORMATION
==================================================

Application: Hijra
Developer: Kalin Digital Studio
Tagline: Every day, a better journey.

Product principles:
LEARN - PRACTICE - GROW

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
- Existing approved Arabic Quran font

Database: hijrah.db

Platforms:
- Android
- iOS

Languages:
- Indonesian (default)
- English

Appearance:
- Light
- Dark
- System

Development methodology:
BUILD - TEST - FIX - RETEST

Formal UAT remains scheduled for Phase 12.

==================================================
2. PRE-IMPLEMENTATION CHECKPOINT
==================================================

Before development:

- Execute git status.
- Inspect existing uncommitted changes.
- Inspect Phase 06 development status.
- Confirm no concurrent implementation is modifying
  the same workspace.
- Inspect package.json and dependency lockfile.
- Identify actual Expo SDK version.
- Inspect database migrations.
- Inspect existing navigation.
- Inspect existing Ibadah landing page.
- Inspect existing Dashboard.
- Inspect app_settings.
- Inspect localization architecture.
- Inspect theme architecture.
- Inspect existing Arabic font.
- Inspect reusable components.
- Inspect existing HTTP client.
- Inspect existing location and sensor dependencies.
- Read existing project documentation.
- Read LICENSING_POLICY.md.
- Read THIRD_PARTY_LICENSES.md.
- Read UI_UX_GUIDELINES.md.

Preserve all Product Owner changes.

Do not interrupt ongoing Phase 06 implementation.

Do not falsely mark pending religious content review
as completed.

Do not upgrade or downgrade Expo SDK without approval.

Do not automatically commit or push.

==================================================
3. DEVELOPMENT SCOPE
==================================================

Implement the following subphases:

06B.1 - Ibadah Home Redesign
06B.2 - MyQuran API Service
06B.3 - Jadwal Shalat & Countdown
06B.4 - Arah Kiblat
06B.5 - Kalender Islam
06B.6 - Hadis Digital
06B.7 - Doa Harian
06B.8 - Asmaul Husna
06B.9 - Integration & Regression Testing

Phase 06B is an additional enhancement phase.

Do not renumber the existing roadmap.

Phase 07 remains Personal Goals & Planner.

==================================================
4. ARCHITECTURE
==================================================

Implement Hybrid Offline-First architecture.

The following existing modules must remain fully offline:

- Shalat Wajib Tracker
- Shalat Sunnah Tracker
- Digital Quran Reader
- Quran Reading Tracker
- Digital Dzikir & Tasbih Tracker
- Local user profile
- Existing transaction history

New Islamic services may require internet for initial
data retrieval and refresh.

Use persistent caching only where permitted.

Existing worship trackers must remain operational
when MyQuran API is unavailable.

Do not introduce:
- Mandatory online authentication
- Additional backend
- Cloud synchronization
- Remote worship transaction storage

==================================================
5. MYQURAN API REFERENCES
==================================================

Official website:
https://api.myquran.com/

API v3 documentation:
https://api.myquran.com/v3/doc

API v2 documentation:
https://api.myquran.com/v2/doc

Prioritize v3 endpoints.

Use v2 only when equivalent functionality is not
available in v3.

Evaluate documented services for:

- Prayer schedules
- City or regency selection
- Hijri calendar
- Hadith
- Daily supplications
- Asmaul Husna

Potential v2 endpoints:

/v2/doa
/v2/doa/all
/v2/doa/sumber
/v2/husna
/v2/husna/all
/v2/husna/{id}

Verify actual endpoints before implementation.

Do not invent undocumented endpoints.

Inspect actual API response structures.

Validate:
- HTTP response status
- Response schema
- Pagination
- Search capability
- Rate limits
- Required fields
- Source attribution

Document actual endpoint URLs and versions.

If live network access is unavailable, clearly report
which API contracts remain unverified.

==================================================
6. MANDATORY LICENSING
==================================================

Preserve the existing Hijra licensing policy.

MyQuran provides free API access and permits data use
for applications according to its published information.

However, verify separately:

- Commercial application usage
- Google Play distribution
- Apple App Store distribution
- Live API access
- Temporary caching
- Persistent SQLite caching
- Offline redistribution
- Full dataset bundling
- Upstream religious content rights
- Translation rights
- Attribution requirements

Do not assume that free API access automatically
permits unlimited content redistribution.

Use feature-specific permission policies.

Suggested states:

- UNVERIFIED
- LIVE_ACCESS_APPROVED
- CACHE_APPROVED
- BUNDLE_APPROVED
- RESTRICTED

Production content must comply with documented rights.

Development integration may continue independently
using authorized testing or development-only fixtures.

Do not fabricate licensing approvals.

Document unresolved production release blockers.

==================================================
7. API SERVICE ARCHITECTURE
==================================================

Create a centralized Islamic Services Layer.

Suggested structure:

src/services/islamic/
    islamic-provider.types.ts
    islamic-provider.ts
    myquran-client.ts
    myquran-prayer.service.ts
    myquran-calendar.service.ts
    myquran-hadith.service.ts
    myquran-dua.service.ts
    myquran-husna.service.ts
    islamic-cache.service.ts
    content-permission.service.ts

Adapt to existing project conventions.

Use existing fetch or HTTP client.

Do not install unnecessary dependencies.

Requirements:

- HTTPS requests
- Centralized base URL
- Request timeout
- Request cancellation
- Response validation
- Request deduplication
- Controlled retries
- Error normalization
- Rate-limit handling
- Safe query encoding

Handle:
- HTTP 400
- HTTP 404
- HTTP 429
- HTTP 500
- HTTP 502
- HTTP 503
- HTTP 504
- Network failures
- Request timeout
- Invalid JSON
- Unexpected response schema
- Provider-level errors

Respect Retry-After when available.

Do not use unlimited retries.

Screens must not call remote endpoints directly.

==================================================
8. REDESIGN IBADAH HOME
==================================================

Transform the existing Ibadah page into an informative
Islamic Lifestyle Hub.

Do not redesign the main Beranda Dashboard.

Beranda remains the personal worship summary.

Ibadah becomes the central entry point for performing
worship and accessing Islamic learning resources.

Required layout:

1. Ibadah Header
2. Prayer Schedule Hero Card
3. Islamic Calendar Summary
4. Ibadah Harian
5. Perlengkapan Ibadah
6. Belajar & Mengenal Islam

IBADAH HARIAN:

- Shalat Wajib
- Shalat Sunnah
- Al-Quran
- Dzikir & Tasbih

Use a two-column card layout.

Each card should display its actual daily summary
using existing local database services.

PERLENGKAPAN IBADAH:

- Arah Kiblat
- Jadwal Shalat
- Kalender Islam

Use a compact three-column grid where screen width
and accessibility settings permit.

BELAJAR & MENGENAL ISLAM:

- Hadis
- Doa Harian
- Asmaul Husna

Use a compact three-column grid.

Preserve existing bottom navigation:

- Beranda
- Ibadah
- Target
- Laporan
- Profil

Do not display fictional activity statistics.

Do not introduce a unified spiritual score.

==================================================
9. PRAYER SCHEDULE HERO CARD
==================================================

Create a prominent Forest Green hero card.

Display:

- Selected city
- Applicable local date
- Next prayer name
- Next prayer time
- Countdown
- Subuh time
- Dzuhur time
- Ashar time
- Maghrib time
- Isya time
- Link to monthly schedule
- Schedule source

Highlight the next prayer.

Use actual API data.

Do not hardcode prayer schedules.

Do not automatically mark prayers completed or missed
based on elapsed schedule times.

The schedule is independent from prayer transaction
records.

==================================================
10. CITY SELECTION
==================================================

Implement manual city selection as the default.

Required features:

- Search city or regency
- Display provider location results
- Select location
- Save selected location
- Change location
- Restore location after restart
- Refresh prayer schedules

Distinguish similarly named cities and regencies.

Preserve provider location IDs as strings.

Do not assume v2 and v3 location IDs are identical.

Suggested app_settings keys:

prayer_city_provider
prayer_city_id
prayer_city_name
prayer_city_timezone

Verify timezone mapping.

GPS permission must not be required to access
city-based prayer schedules.

==================================================
11. DAILY PRAYER SCHEDULE
==================================================

Retrieve prayer schedules from verified MyQuran
v3 endpoints.

Required fields:

- Fajr
- Dhuhr
- Asr
- Maghrib
- Isha

Additional fields when supplied:

- Imsak
- Sunrise
- Dhuha

Normalize API responses into internal typed models.

Validate all required times.

Reject malformed schedule data.

Display actual source attribution.

MyQuran identifies Bimas Islam Kementerian Agama RI
as its prayer schedule source.

Verify the actual applicable source metadata.

==================================================
12. PRAYER COUNTDOWN
==================================================

Calculate countdown locally.

Support correct selected-city timezone.

Indonesian timezones include:

- Asia/Jakarta
- Asia/Makassar
- Asia/Jayapura

Requirements:

- Identify next obligatory prayer
- Calculate remaining duration
- Update countdown locally
- Handle local midnight
- Handle application resume
- Handle selected-city change
- Handle device timezone differences

After Isya, use tomorrow's verified Subuh schedule.

Do not reuse today's Subuh time as tomorrow's time.

Do not request the API every second.

Do not treat Imsak, Sunrise, or Dhuha as additional
obligatory prayers.

If data is unavailable, show an appropriate
unavailable state.

==================================================
13. MONTHLY PRAYER SCHEDULE
==================================================

Create a dedicated Jadwal Shalat screen.

Required features:

- Selected city
- Month navigation
- Year navigation
- Return to current month
- Daily schedule rows
- Today's row highlight
- Selected date detail
- Source attribution
- Last refresh information

Display all five obligatory prayer times.

Additional times may be shown when available.

Use readable mobile layouts.

Persistent caching must follow verified permission
and retention requirements.

Cache keys must distinguish:
- Provider
- API version
- City
- Year
- Month
- Date

Never display another city's schedule.

==================================================
14. QIBLA DIRECTION
==================================================

Create a native Arah Kiblat screen.

Use local calculation and device sensors.

Do not require a remote Qibla API.

Required functionality:

- Device location acquisition
- Manual location fallback
- Qibla bearing calculation
- Device heading
- Interactive compass
- Direction indicator
- Bearing in degrees
- Sensor accuracy indication
- Calibration guidance
- Refresh location

Use verified Kaaba coordinates.

Suggested reference coordinates:

Latitude: 21.4225
Longitude: 39.8262

Verify the reference before implementation.

Calculate the initial great-circle bearing.

Normalize the bearing to 0-360 degrees.

Test against independently verified reference
locations.

==================================================
15. LOCATION & SENSOR PERMISSIONS
==================================================

Request foreground location only when the user
opens Arah Kiblat and explicitly chooses location use.

Do not request location during initial application
startup.

Requirements:

- Explain permission purpose
- Support permission denial
- Support unavailable location
- Support manual coordinate fallback
- Keep coordinates local
- No background location tracking
- No unnecessary location uploads

Evaluate existing dependencies first.

Potential dependencies:
- expo-location
- expo-sensors

Verify:
- Expo SDK compatibility
- Software license
- Transitive dependencies
- Android support
- iOS support
- Expo Go support

Use the smallest necessary approved dependency set.

==================================================
16. QIBLA COMPASS ACCURACY
==================================================

The calculated Qibla bearing is relative to true north.

Prefer true-heading measurements when available.

Do not directly compare magnetic heading with
true-north bearing without appropriate correction.

If only magnetic heading is available:

- Apply verified declination correction where possible.
- Otherwise label the direction as approximate.

Requirements:

- Smooth compass rotation
- Correct device orientation
- Correct angle normalization
- Handle crossing 0 and 360 degrees
- Handle missing sensors
- Handle inaccurate heading
- Provide calibration guidance
- Stop sensor subscriptions when leaving the screen

Do not fabricate sensor accuracy.

If live heading is unavailable, display static bearing
information instead of a simulated working compass.

==================================================
17. ISLAMIC CALENDAR
==================================================

Implement Kalender Islam.

Use verified MyQuran calendar endpoints.

Required functionality:

- Current Gregorian date
- Corresponding Hijri date
- Monthly calendar
- Hijri date labels
- Previous month
- Next month
- Return to today
- Selected date detail
- Calendar source
- Calendar calculation method when available

Display verified important Islamic dates where
supported.

Examples:
- Islamic New Year
- Ramadan
- Eid al-Fitr
- Eid al-Adha

Distinguish calculated Hijri dates from officially
confirmed religious observance dates.

Do not fabricate dates.

Do not silently apply arbitrary day adjustments.

==================================================
18. HADITH DIGITAL
==================================================

Create a dedicated Hadis module.

Evaluate actual MyQuran v3 Hadith endpoints.

Required functionality where supported:

- Hadith collection list
- Browse by collection
- Browse by category
- Search
- Pagination
- Hadith detail
- Personal bookmarks
- Source reference

Display available verified fields:

- Arabic text
- Indonesian translation
- English translation when available
- Hadith collection
- Narrator when available
- Hadith number
- Reference
- Authenticity classification when reliably provided

Do not fabricate authenticity classifications.

Do not label all Hadith as authentic automatically.

Use existing approved Arabic font.

Do not download entire Hadith libraries unnecessarily.

Support clear offline and API error states.

==================================================
19. HADITH SEARCH
==================================================

Use documented provider search endpoints.

Implement:

- Query validation
- Debounced text search
- Pagination
- Loading state
- Empty state
- Cancellation of stale requests
- Error handling
- Retry

Do not invent provider search capabilities.

Offline search is limited to legitimately cached
or licensed local content.

==================================================
20. DOA HARIAN
==================================================

Create a dedicated Daily Supplications module.

Evaluate documented MyQuran v2 or v3 services.

Required features:

- Supplication list
- Search
- Categories or sources where available
- Reading detail
- Favorites

Reading presentation:

1. Title
2. Arabic text
3. Latin transliteration
4. Indonesian meaning
5. English meaning when available
6. Reference

Prioritize beginner-friendly presentation.

Reuse the existing Arabic font.

Provide independent visibility settings for:
- Latin
- Translation

Display only verified supplementary content.

Do not fabricate unavailable Latin or translations.

Opening or bookmarking a supplication must not
automatically create a worship transaction.

==================================================
21. ASMAUL HUSNA
==================================================

Create a dedicated Asmaul Husna module.

Evaluate actual MyQuran endpoints.

Required features:

- Complete supported catalog
- Arabic names
- Latin names
- Indonesian meanings
- English meanings when verified
- Search by number
- Search by name
- Search by meaning
- Detail view
- Favorites

For a catalog presented as 99 names, validate:

- Record count
- Unique identifiers
- Ordering
- Arabic wording
- Meanings
- Source enumeration

Do not fabricate missing names to reach 99.

Do not invent religious benefits or guaranteed
outcomes associated with individual names.

Use a clean, premium two-column card layout.

==================================================
22. BOOKMARKS & FAVORITES
==================================================

Support local bookmarks for:

- Hadith
- Daily Supplications
- Asmaul Husna

Store stable content identifiers locally.

Suggested table:

islamic_content_bookmarks

Suggested fields:

- id
- user_id
- content_type
- provider
- content_key
- created_at

Add appropriate unique constraints.

Prevent duplicate bookmarks.

Use canonical identifiers that distinguish collections
and editions.

Do not store full restricted content merely because
a user bookmarks it.

Preserve existing Quran bookmarks and Dzikir favorites.

==================================================
23. DATABASE & CACHE
==================================================

Use existing hijrah.db.

Inspect actual database architecture.

Potential new tables:

- islamic_api_cache
- islamic_content_bookmarks
- prayer_schedule_cache

Create only necessary tables.

Suggested cache fields:

- cache_key
- provider
- api_version
- resource_type
- payload_json
- source_url
- source_attribution
- fetched_at
- expires_at
- permission_policy_version

Persistent caching requires verified permission.

Use deterministic cache keys.

Validate data before storage.

Do not overwrite valid cached content with failed
or malformed API responses.

Apply applicable retention requirements.

Use non-destructive versioned migrations.

Preserve all Phase 01-06 data.

Do not reset hijrah.db.

==================================================
24. OFFLINE BEHAVIOR
==================================================

When internet is unavailable:

- Existing four core worship trackers remain usable.
- Existing Arabic Quran content remains available.
- Existing Dzikir content remains available.
- Local user data remains accessible.
- Qibla bearing may work with available coordinates.
- Compass may work with supported device sensors.
- Permitted valid cached content remains accessible.
- Local bookmarks remain visible.

If remote content is unavailable:

- Display clear offline information.
- Provide retry.
- Do not display fictional content.
- Do not block unrelated modules.

Existing worship functionality must not depend
on MyQuran server availability.

==================================================
25. API PERFORMANCE
==================================================

Requirements:

- Avoid duplicate API requests.
- Avoid downloading all services at startup.
- Fetch content when needed.
- Use pagination.
- Use permitted caching.
- Avoid unlimited retries.
- Avoid excessive background refresh.
- Keep scrolling responsive.
- Use efficient list rendering.

Countdown calculations must run locally.

One failed service must not block the entire
Ibadah Home.

==================================================
26. UI/UX DESIGN SYSTEM
==================================================

Preserve existing Hijra visual identity.

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

Design direction:

- Modern Islamic
- Premium
- Calm
- Informative
- Clean
- Beginner-friendly
- Mobile-first

Suggested dimensions:

- Screen padding: 16-20
- Screen title: 24-28
- Section title: 16-18
- Prayer time value: 32-40
- Body text: 14-16
- Secondary text: 12-14
- Card radius: 14-18
- Card padding: 12-16
- Card spacing: 8-12
- Icon size: 22-26
- Minimum touch target: 48

Reuse existing icon library.

Support accessibility and system font scaling.

Avoid clipped Arabic text.

Avoid generic administrative dashboard styling.

==================================================
27. LOCALIZATION
==================================================

Support Indonesian and English.

Localize:

- Ibadah
- Ibadah Harian
- Perlengkapan Ibadah
- Belajar & Mengenal Islam
- Jadwal Shalat
- Waktu Shalat Berikutnya
- Pilih Kota
- Arah Kiblat
- Kalender Islam
- Hadis
- Doa Harian
- Asmaul Husna
- Latin
- Arti Bacaan
- Sumber Data
- Terakhir Diperbarui
- Favorit
- Loading states
- Error states
- Offline states
- Retry actions
- Permission explanations
- Accessibility labels

Preserve original Arabic text.

Do not fabricate English translations when only
Indonesian content is available.

==================================================
28. PRIVACY
==================================================

Keep personal worship records local.

Do not transmit:

- User name
- Avatar
- Prayer history
- Quran reading history
- Quran bookmarks
- Dzikir history
- Personal goals
- Private notes
- Local database contents

Send only parameters required to retrieve public
provider content.

Do not transmit precise GPS coordinates unnecessarily.

Do not introduce analytics or tracking SDKs.

Document network usage for future privacy disclosures.

==================================================
29. PHASE 05 PROTECTION
==================================================

The Quran translation and transliteration enhancement
is deferred.

Do not:

- Replace existing Quran dataset.
- Replace existing Arabic font.
- Integrate MyQuran Quran translations.
- Integrate EQuran.id.
- Modify Quran Reader.
- Modify Quran verse numbering.
- Modify Basmalah handling.
- Modify Quran bookmarks.
- Modify reading calculation logic.
- Modify existing Quran reading records.

==================================================
30. PHASE 06 PROTECTION
==================================================

Preserve:

- Digital Tasbih
- Counter functionality
- Checklist functionality
- Dzikir Pagi
- Dzikir Petang
- Dzikir Setelah Shalat
- Persistent drafts
- Custom activities
- Favorites
- Latin and translation settings
- Content review status
- Haptic feedback
- Collection history
- Dashboard statistics

Do not automatically import MyQuran content into
existing Dzikir collections.

Do not overwrite approved or review-pending content.

==================================================
31. DEVELOPMENT SEQUENCE
==================================================

Implement incrementally:

06B.1:
Redesign Ibadah Home and preserve existing navigation.

06B.2:
Create MyQuran API client, provider abstraction,
response validation, and permission policies.

06B.3:
Implement city selection, daily prayer schedule,
monthly schedule, and countdown.

06B.4:
Implement Qibla calculation, location access,
heading sensor integration, and compass.

06B.5:
Implement Islamic calendar and Hijri conversion.

06B.6:
Implement Hadith Digital.

06B.7:
Implement Daily Supplications.

06B.8:
Implement Asmaul Husna.

06B.9:
Complete integration, offline checks, regression,
licensing verification, and documentation.

Test each subphase before proceeding.

Continue independent functionality when a specific
provider service is blocked.

Report remaining blockers explicitly.

==================================================
32. MANDATORY TESTING
==================================================

PRAYER SCHEDULE:

- City search
- City selection
- City persistence
- City change
- Daily schedule
- Monthly schedule
- Next prayer calculation
- Countdown
- Next prayer after Isya
- Midnight rollover
- Month rollover
- Year rollover
- WIB, WITA, and WIT handling
- Provider timeout
- Invalid response
- Wrong-city cache prevention

QIBLA:

- Bearing calculation
- Known reference locations
- Invalid coordinates
- Permission granted
- Permission denied
- Manual fallback
- Sensor available
- Sensor unavailable
- True heading
- Magnetic heading fallback
- Poor sensor accuracy
- Compass calibration
- Angle normalization
- Sensor cleanup
- Offline operation

CALENDAR:

- Gregorian date
- Hijri date
- Monthly navigation
- Return to today
- Month and year boundaries
- Source attribution
- Method information
- Offline behavior

HADITH:

- Collection browsing
- Search
- Pagination
- Arabic rendering
- Translation
- Reference
- Bookmark
- Duplicate bookmark prevention
- API error handling

DOA:

- Supplication catalog
- Search
- Arabic
- Latin when verified
- Meaning when verified
- Visibility settings
- Favorites
- References

ASMAUL HUSNA:

- Catalog integrity
- Unique identifiers
- Arabic names
- Latin names
- Meaning
- Search
- Favorites

GENERAL:

- Offline operation
- HTTP 429
- Network timeout
- Provider failure
- Malformed JSON
- Localization
- Theme management
- Accessibility
- Database migration integrity

==================================================
33. REGRESSION TESTING
==================================================

Verify all existing modules:

Phase 01:
- Application Foundation
- SQLite
- Navigation

Phase 02:
- Onboarding
- User Profile
- Settings

Phase 03:
- Shalat Wajib Tracker
- History
- Dashboard

Phase 04:
- Shalat Sunnah Tracker
- Custom activities
- Multiple sessions

Phase 05:
- 114 Quran surahs
- Arabic Quran Reader
- Harakat
- Waqf marks
- Basmalah numbering
- Reading Tracker
- Bookmark
- Continue Reading

Phase 06:
- Digital Tasbih
- Dzikir collections
- Counter
- Checklist
- Draft persistence
- Latin and translation settings
- History
- Dashboard

Do not introduce regressions.

==================================================
34. TECHNICAL VERIFICATION
==================================================

Run applicable existing scripts:

npm run typecheck
npm run lint
npx expo-doctor

Use actual scripts defined in package.json.

Run applicable:

- Automated tests
- API response validation tests
- Prayer countdown tests
- Timezone tests
- Qibla bearing tests
- Database migration tests
- Bookmark tests
- Cache permission tests
- Localization tests
- Android bundle verification
- iOS bundle verification
- Regression tests

Clearly distinguish automated verification from
physical device verification.

Do not fabricate passing test results.

Fix detected errors and retest.

==================================================
35. DOCUMENTATION
==================================================

Update:

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

Maintain:

docs/LICENSING_POLICY.md

Create:

docs/MYQURAN_INTEGRATION.md
docs/ISLAMIC_CONTENT_LICENSES.md
docs/QIBLA_IMPLEMENTATION.md
docs/PHASE_06B_CODEX_PROMPT.md

Document:

- Actual API endpoints
- API versions
- Response contracts
- API limitations
- Source attribution
- Commercial usage evidence
- Cache permissions
- Content redistribution rights
- Database changes
- Qibla calculation
- Sensor dependencies
- Location permission requirements
- Timezone handling
- Calendar method
- Offline behavior
- Privacy impact
- Actual test results
- Outstanding blockers

==================================================
36. STRICT OUT OF SCOPE
==================================================

Do not implement:

- Quran translation enhancement
- Quran dataset replacement
- Quran audio
- Tafsir module
- Adhan audio
- Prayer notification scheduling
- Background location tracking
- Cloud synchronization
- Online authentication
- Premium subscriptions
- Payments
- Advertising
- Personal Goals
- Complete Reports & Analytics

Do not proceed to Phase 07.

==================================================
37. FINAL IMPLEMENTATION REPORT
==================================================

Report:

1. Implementation summary
2. Phase 06 prerequisite status
3. Actual Expo SDK
4. Created and modified files
5. Ibadah Home redesign
6. Verified MyQuran endpoints
7. API integration results
8. Licensing evidence
9. Prayer schedule implementation
10. Countdown implementation
11. Qibla implementation
12. Sensor and permission handling
13. Islamic calendar implementation
14. Hadith implementation
15. Doa Harian implementation
16. Asmaul Husna implementation
17. Bookmark implementation
18. Cache implementation
19. Offline behavior
20. Database migration results
21. Dependency changes
22. Privacy impact
23. TypeScript verification
24. Lint verification
25. Expo Doctor verification
26. Physical device verification status
27. Regression results
28. Known limitations
29. Outstanding production release blockers
30. Manual testing instructions

Completion status:

PHASE 06B DEVELOPMENT COMPLETE - DONE

OR:

PHASE 06B FUNCTIONAL DEVELOPMENT COMPLETE -
PRODUCTION CONTENT APPROVAL PENDING

OR:

PHASE 06B DEVELOPMENT INCOMPLETE -
BLOCKERS REMAIN

Do not claim DONE while mandatory requirements
remain unresolved.

Do not claim formal UAT PASS.

==================================================
38. FINAL INSTRUCTIONS
==================================================

Implement actual changes directly in the existing
Hijra workspace.

Transform Ibadah into an Islamic Lifestyle Hub.

Implement MyQuran integrations.

Implement:
- Jadwal Shalat
- Next Prayer Countdown
- Arah Kiblat
- Kalender Islam
- Hadis Digital
- Doa Harian
- Asmaul Husna

Preserve all existing Phase 01-06 functionality.

Maintain mandatory licensing compliance.

Maintain local worship data privacy.

Maintain bilingual interfaces.

Maintain centralized theme management.

Do not reset the database.

Do not fabricate religious content.

Do not automatically commit or push.

Do not start Phase 07.

BUILD - TEST - FIX - RETEST.

BEGIN PHASE 06B IMPLEMENTATION AFTER THE
PHASE 06 CHECKPOINT IS READY.
