# HIJRA — PHASE 05
## REQUIREMENT REVISION & QURAN DATASET BLOCKER RESOLUTION

The Product Owner has clarified and simplified the Quran Reading Tracker requirements.

Continue the existing Phase 05 implementation.

Do not rebuild the module from scratch.

## 1. Revised Metadata Requirements

The primary objective is to record Quran reading activities based on surah and ayah ranges.

The following metadata is mandatory:

- Surah number.
- Latin surah name.
- Total ayah count.
- Complete catalog of 114 surahs.

Arabic surah names are optional if a verified compatible source is available.

The following metadata is no longer mandatory:

- Indonesian surah name meanings.
- English surah name meanings.

Defer localized surah meanings and full verse translations to Release 2.

Missing Indonesian or English surah meanings must no longer block Phase 05 completion.

Maintain the bilingual Indonesian and English application interface.

## 2. Alternative Quran Metadata Library

Evaluate the following open-source library:

Package: quran-meta

Repository:
https://github.com/quran-center/quran-meta

Documentation:
https://quran-center.github.io/quran-meta/docs/

Declared software license: MIT.

Evaluate:

- Actual package license.
- Applicable upstream metadata licenses.
- Commercial usage rights.
- Redistribution rights.
- Expo and React Native compatibility.
- Node.js version compatibility.
- Package version.
- Dependencies.
- Hafs verse-numbering convention.

Only use metadata fields whose redistribution rights have been verified.

Do not include unnecessary translations or metadata with unclear licensing.

If runtime package integration is unnecessary or incompatible, use an approved development-time extraction process to generate a lightweight local metadata dataset, provided its applicable license permits this.

Tanzil or another verified source remains acceptable if the required metadata has compatible licensing.

Do not bypass licensing requirements.

## 3. Minimum Functional Requirement

Users must be able to:

1. Open Ibadah → Al-Qur'an.
2. Select a surah from the complete 114-surah catalog.
3. Enter the starting ayah.
4. Enter the ending ayah.
5. See the calculated number of ayat.
6. Save the reading session.
7. Update the last reading position if selected.
8. View updated daily totals.
9. View updated Dashboard totals.

Example:

Surah: Al-Baqarah

Start Ayah: 1

End Ayah: 5

Expected Reading Count: 5 ayat.

Calculation:

Ayah Count = End Ayah - Start Ayah + 1.

After saving:

- Today's reading total increases by 5 ayat.
- Today's session count increases by 1.
- Bookmark becomes Al-Baqarah ayat 5 if bookmark update is selected.
- Continue Reading suggests Al-Baqarah ayat 6.

If the user records another session from ayat 6 through ayat 10:

- Today's reading total becomes 10 ayat.
- Total reading sessions becomes 2.
- Bookmark becomes Al-Baqarah ayat 10 if selected.

Assume no previous reading sessions for these test examples.

## 4. Database Compatibility

Inspect the actual Phase 05 database implementation.

If localized surah meanings are currently required by NOT NULL constraints, implement a compatible non-destructive migration or adjust the existing undeployed migration where appropriate.

Localized meanings may remain nullable.

Arabic names may remain nullable if not yet verified.

Use verified Latin surah names as the display fallback.

Do not insert fabricated localized meanings merely to satisfy database constraints.

Preserve all existing records and previous phase data.

Do not reset hijrah.db.

## 5. Preserve Existing Phase 05 Functionality

Maintain:

- Single-surah reading.
- Cross-surah reading.
- Multiple reading sessions.
- Automatic inclusive ayah calculation.
- Optional duration.
- Optional notes.
- Bookmark management.
- Continue Reading.
- Historical date recording.
- Reading session editing and deletion.
- Daily summary.
- Weekly history.
- Dashboard integration.
- Duplicate submission protection.
- Atomic session and bookmark persistence.
- Offline operation.
- Bilingual interface.
- Light and Dark Mode.

Do not remove previously approved functionality.

## 6. Data Integrity

Validate:

- Exactly 114 surahs.
- Unique surah numbers from 1 through 114.
- Valid Latin surah names.
- Positive integer ayah counts.
- Accurate individual verse counts.
- Consistent Hafs/Kufan verse numbering.
- Expected total of 6,236 ayat under the selected numbering convention.

Verify against authoritative references.

Do not fabricate metadata.

## 7. Licensing Documentation

Update:

- docs/QURAN_DATASET.md
- docs/THIRD_PARTY_LICENSES.md
- Existing offline Third-Party Licenses information.
- docs/BUSINESS_RULES.md
- docs/DATABASE_SCHEMA.md
- docs/DEVELOPMENT_PROGRESS.md

Document the revised requirement that localized surah meanings are optional and deferred.

Document the actual selected metadata source and applicable licensing evidence.

## 8. Development Verification

Test:

- Complete surah catalog.
- Surah selection.
- Ayah range validation.
- Ayat 1–5 equals 5 ayat.
- Ayat 6–10 equals 5 ayat.
- Two reading sessions produce a total of 10 ayat.
- Bookmark update.
- Continue Reading.
- Cross-surah calculations.
- Dashboard refresh.
- Database persistence after restart.
- Offline operation.
- Regression of Phase 01–04.

Run applicable TypeScript, lint, automated tests, and Expo Doctor checks.

Fix detected errors and retest.

## 9. Final Instruction

Resolve the existing Phase 05 metadata blocker using the revised minimum requirements.

Do not block development because Indonesian and English surah meanings are unavailable.

Do not use unverified or restricted-license metadata.

The main requirement is a working Quran Reading Tracker with an accurate and legally redistributable catalog of 114 surahs.

Implement actual changes directly in the existing workspace.

Report actual licensing evidence, implementation changes, and verification results.

If mandatory metadata licensing remains unresolved, report the specific blocker.

Do not claim Phase 05 DONE until the required catalog and reading tracker are operational.

Do not automatically commit or push.

Do not start Phase 06.

PROCEED WITH PHASE 05 BLOCKER RESOLUTION NOW.