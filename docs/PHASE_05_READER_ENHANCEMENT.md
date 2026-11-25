# HIJRA — PHASE 05 ENHANCEMENT
## INTEGRATED DIGITAL QURAN READER & READING TRACKER

The Product Owner has clarified the actual Quran module requirements.

Phase 05 must include a functional Digital Quran Reader integrated with the existing Quran Reading Tracker.

Users must be able to read the complete Arabic Quran directly inside Hijra and record the number of ayat they have read.

This requirement supersedes previous instructions that excluded the Digital Quran Reader from Release 1.

Continue the existing Phase 05 implementation.

Do not rebuild the module from scratch.

## 1. REVISED RELEASE 1 SCOPE

Implement:

- Complete catalog of 114 surahs.
- Complete Arabic Quran text.
- Offline Quran Reader.
- Searchable surah list.
- Adjustable Arabic font size.
- Start reading position selection.
- End reading position selection.
- Automatic inclusive ayah calculation.
- Reading session recording directly from Quran Reader.
- Last reading position.
- Continue Reading shortcut.
- Daily and weekly reading summaries.
- Reading history.
- Dashboard integration.

Maintain the existing manual Reading Tracker as an alternative recording method.

Do not require users to enter a separate manual reading form after reading inside Hijra.

The following features remain deferred to Release 2:

- Indonesian verse translations.
- English verse translations.
- Tafsir.
- Audio murottal.
- Tajwid color visualization.
- Memorization tracker.
- Khatam coverage tracking.

Missing localized surah meanings must not block Phase 05.

## 2. QURAN TEXT DATASET

Preferred source:

Tanzil Quran Text — Uthmani Version 1.1.

Official download:

https://tanzil.net/download/

Official license:

https://tanzil.net/docs/Text_License

Official script documentation:

https://tanzil.net/docs/uthmani

The official Tanzil terms permit verbatim redistribution and application usage, subject to attribution, copyright preservation, and prohibition of text modification.

Before bundling:

- Obtain the official dataset.
- Verify the actual downloaded artifact.
- Verify its applicable licensing terms.
- Verify compatibility with Hijra's commercial redistribution policy.
- Preserve copyright notices.
- Preserve all required attribution.
- Include the official Tanzil website link.
- Document dataset version and checksum.

Do not modify Arabic verse content.

Do not remove Arabic diacritics.

Do not rewrite or regenerate verse text.

Do not normalize or transform stored verse content in a way that changes its original Unicode character sequence.

Structural conversion into JSON or SQLite is permitted only if applicable terms allow it and the original verse content is preserved exactly.

Validate the converted verse text against the original source.

Do not use AI-generated Quran verse content.

Do not bundle noncommercial verse translations.

## 3. METADATA COMPATIBILITY

Reuse the verified existing surah catalog if available.

Mandatory metadata:

- Surah number.
- Latin surah name.
- Verse count.

Arabic surah names may be included from a verified compatible source.

Indonesian and English surah meanings remain optional.

Ensure that the metadata and Quran text use the same verse-numbering convention.

Validate:

- Exactly 114 surahs.
- Exactly 6,236 numbered ayat under the selected Hafs/Kufan numbering convention.
- No missing ayat.
- No duplicate ayat.
- Correct individual surah verse counts.
- Correct surah and ayah ordering.

Follow the official dataset's handling of Bismillah.

Do not count unnumbered introductory Bismillah as a separate tracked ayah.

Do not add introductory Bismillah before Surah At-Tawbah.

Avoid duplicate Bismillah rendering.

## 4. OFFLINE ARCHITECTURE

Preferred architecture:

Official verified Quran dataset
→ Bundled local asset
→ SQLite Quran master tables
→ Quran Repository
→ Quran Reader
→ Existing Reading Tracker

Do not introduce:

- Runtime Quran API.
- Paid Quran service.
- Mandatory internet connection.
- Unnecessary Quran npm library.
- WebView-based remote Quran Reader.

Use existing Expo, React Native, TypeScript, and expo-sqlite dependencies.

## 5. DATABASE MIGRATION

Preserve existing tables:

- quran_surahs
- quran_reading_logs
- quran_bookmarks

Create an additional table if not already available:

```sql
CREATE TABLE quran_verses (
    surah_number INTEGER NOT NULL,
    ayah_number INTEGER NOT NULL,

    arabic_text TEXT NOT NULL,

    PRIMARY KEY (
        surah_number,
        ayah_number
    ),

    FOREIGN KEY (surah_number)
        REFERENCES quran_surahs(surah_number),

    CHECK (
        typeof(ayah_number) = 'integer'
        AND ayah_number > 0
    )
);
```

Adapt the proposed schema to the actual project architecture.

Use a non-destructive versioned migration.

Preserve:

- All previous phase data.
- Existing reading sessions.
- Existing bookmarks.
- Existing user profiles.
- Existing application settings.

Seed the complete verified Quran verse dataset.

Do not reset hijrah.db.

Quran master text must be read-only to users.

## 6. QURAN HOME SCREEN

Redesign only the existing Quran module landing page.

Do not redesign unrelated Dashboard or Tracker modules.

Required layout:

1. Quran module header.
2. Today's reading summary.
3. Last reading position.
4. Continue Reading button.
5. Searchable list of 114 surahs.
6. Reading History shortcut.
7. Manual Reading Log shortcut.

Each surah row displays:

- Surah number.
- Latin name.
- Arabic name when verified.
- Total ayat.
- Navigation chevron.

Selecting a surah opens the Quran Reader directly.

Do not open the manual bookmark form when the user selects a surah.

## 7. QURAN READER SCREEN

Implement a native React Native Quran Reader screen.

Required components:

- Back navigation.
- Surah title.
- Arabic surah name when available.
- Surah number.
- Total ayat.
- Arabic font size control.
- Go to Ayah action.
- Reading position controls.
- Scrollable Arabic verse list.
- Reading session summary.
- Save reading action.
- Previous and next surah navigation.

Display actual Arabic Quran text from the verified local dataset.

Every numbered ayah must have an identifiable ayah number.

Use a readable, calm, uncluttered layout.

Keep Arabic text right-aligned with correct right-to-left rendering.

Do not reverse the entire application interface when displaying Arabic verse content.

Use efficient list rendering for long surahs such as Al-Baqarah.

Ensure verse text is not truncated or clipped.

## 8. ARABIC FONT REQUIREMENTS

Use an existing suitable Arabic font if rendering is correct.

If an additional font is required:

- Select a font suitable for Quranic Arabic.
- Verify its exact license.
- Prefer SIL Open Font License 1.1.
- Verify commercial use and redistribution.
- Preserve font attribution and license notices.
- Bundle the font locally.

Provide adjustable Arabic text size.

Suggested options:

- Small.
- Medium.
- Large.
- Extra Large.

Persist the selected font size using existing app_settings conventions.

Verify Arabic glyphs, diacritics, pause marks, and line spacing on Android and iOS.

Do not alter source text to compensate for font rendering problems.

## 9. START READING POSITION

When opening a surah normally:

- Suggest ayah 1 as the initial reading position.
- Allow the user to select another starting ayah.
- Clearly identify the selected start position.

When using Continue Reading:

- Start from the next ayah after the saved bookmark.
- Automatically navigate to the correct surah and ayah.

The user may change the start position before recording a session.

Opening a surah does not create a reading session.

Scrolling does not create a reading session.

## 10. FINISH READING INTERACTION

Provide an accessible action on each ayah or within its action menu.

Indonesian:

Selesai membaca sampai ayat ini.

English:

Finish reading at this ayah.

When selected:

1. Identify the current session start position.
2. Identify the selected ending ayah.
3. Validate the reading range.
4. Calculate the inclusive ayah count.
5. Display a compact confirmation.
6. Allow the user to save or cancel.

Example:

Surah: Al-Fatihah

Start Ayah: 1

End Ayah: 5

Total: 5 ayat.

Confirmation:

Simpan 5 ayat sebagai bacaan hari ini?

Actions:

- Cancel.
- Save.

Do not count verses based solely on scrolling or screen visibility.

## 11. AUTOMATIC READING CALCULATION

Reuse the existing Quran Reading Calculation Service.

Single-surah formula:

Ayah Count = End Ayah - Start Ayah + 1.

Example A:

Al-Fatihah ayat 1 through 5.

Expected: 5 ayat.

Example B:

Al-Fatihah ayat 6 through 7.

Expected: 2 ayat.

Example C:

Al-Baqarah ayat 1 through 10.

Expected: 10 ayat.

Preserve cross-surah reading support.

If the user continues into the next surah before ending the session, calculate the complete contiguous reading range.

Do not silently include unread intermediate surahs.

Allow users to start a new reading session if they jump to a non-contiguous position.

## 12. SAVE READING SESSION

Reuse the existing quran_reading_logs transaction model.

When saving from Quran Reader:

- Generate a stable session ID.
- Save the local reading date.
- Save start surah and start ayah.
- Save end surah and end ayah.
- Use the existing inclusive calculation service.
- Update the bookmark when selected.
- Refresh today's reading summary.
- Refresh weekly history.
- Refresh Dashboard.

Duration and notes remain optional.

Do not require additional form input for normal Quran Reader recording.

Prevent duplicate sessions caused by repeated Save actions.

Session and selected bookmark updates must be atomic.

After saving, clearly indicate that the reading session has been recorded.

A subsequent intentional reading session must use a new session ID.

## 13. BOOKMARK BEHAVIOR

Reuse quran_bookmarks.

Default behavior for Quran Reader:

- Saving a reading session updates the main bookmark unless the user chooses otherwise.
- Bookmark points to the last ayah read.
- Continue Reading points to the next ayah.

Example:

Saved bookmark:

Al-Fatihah ayat 5.

Continue Reading:

Al-Fatihah ayat 6.

When reaching the last ayah of a surah:

- Continue Reading opens ayah 1 of the next surah.

When reaching the last ayah of An-Nas:

- Offer an explicit restart from Al-Fatihah.
- Do not automatically declare khatam.
- Do not automatically reset the bookmark.

Manual bookmark editing must remain independent from reading transactions.

Correct the existing bookmark form label from Start Ayah to Last Read Ayah.

Indonesian:

Ayat terakhir dibaca.

English:

Last read ayah.

## 14. DASHBOARD INTEGRATION

Preserve the existing Dashboard.

Update the Quran card to display:

- Total ayat read today.
- Total reading sessions today.
- Last reading position.
- Continue Reading shortcut.

Example:

Al-Qur'an

5 ayat dibaca hari ini.

1 sesi membaca.

Posisi terakhir:

Al-Fatihah ayat 5.

Lanjutkan membaca.

Selecting Continue Reading must open the actual Quran Reader at ayah 6, not the manual recording form.

## 15. UI/UX REFINEMENT

Follow the existing Hijra design system.

Primary color: #174638.

Secondary color: #769B87.

Accent color: #C7A76C.

Background: #F7F8F3.

Use centralized theme tokens.

Requirements:

- Modern Islamic visual style.
- Compact navigation headers.
- Forest Green reading summary.
- Clear primary Save button.
- Secondary Cancel button.
- Destructive actions visually distinguished.
- Consistent icons.
- Light, Dark, and System Mode.
- Safe area support.
- Responsive layout.
- Accessible touch targets.

Fix the existing Quran bookmark screen:

- Prevent the long title from overlapping header actions.
- Use a compact responsive header.
- Replace the current Ayat Awal label with Ayat Terakhir Dibaca.
- Use the primary Forest Green style for Save.
- Use secondary styling for Cancel.
- Use destructive styling and confirmation for Clear Bookmark.

Do not redesign unrelated modules.

## 16. LOCALIZATION

Support Indonesian and English interfaces.

Arabic Quran verse content must remain identical in both interface languages.

Required labels:

- Daftar Surah / Surah List
- Lanjutkan Membaca / Continue Reading
- Mulai Membaca / Start Reading
- Ayat Awal / Start Ayah
- Ayat Terakhir Dibaca / Last Read Ayah
- Selesai Membaca / Finish Reading
- Simpan Sesi Membaca / Save Reading Session
- Ukuran Huruf / Font Size
- Lompat ke Ayat / Go to Ayah
- Riwayat Membaca / Reading History

Localized surah meanings are not required during Phase 05.

## 17. LICENSE DOCUMENTATION

Update:

- docs/QURAN_DATASET.md
- docs/THIRD_PARTY_LICENSES.md
- Existing offline Third-Party Licenses screen.

Document:

- Quran text source.
- Dataset version.
- Exact applicable license.
- Commercial redistribution terms.
- Attribution requirements.
- Original dataset checksum.
- Bundled dataset checksum.
- Verse content equality verification.
- Metadata source.
- Font license, if applicable.

Include visible Quran text attribution within the Quran module or its information screen.

Preserve the original required Tanzil copyright notice.

Do not modify the global licensing policy.

## 18. FUNCTIONAL ACCEPTANCE TEST

Test the following end-to-end scenario using a clean test profile or an empty reading date.

Step 1:

Open Ibadah → Al-Qur'an.

Expected:

Display complete list of 114 surahs.

Step 2:

Select Al-Fatihah.

Expected:

Display all seven Arabic ayat.

Step 3:

Start reading from ayat 1.

Step 4:

Select Finish Reading at ayat 5.

Expected:

Display calculated count of 5 ayat.

Step 5:

Save reading session.

Expected:

- Total reading volume today: 5 ayat.
- Total reading sessions today: 1.
- Bookmark: Al-Fatihah ayat 5.

Step 6:

Return to Dashboard.

Expected:

Quran card displays 5 ayat.

Step 7:

Select Continue Reading.

Expected:

Actual Quran Reader opens at Al-Fatihah ayat 6.

Step 8:

Finish reading at ayat 7 and save.

Expected:

- Total reading volume today: 7 ayat.
- Total sessions today: 2.
- Bookmark: Al-Fatihah ayat 7.
- Next reading position: Al-Baqarah ayat 1.

Step 9:

Restart the application with internet disabled.

Expected:

- Complete Quran text remains available.
- Reading sessions remain available.
- Bookmark remains available.
- Continue Reading remains functional.
- Dashboard totals remain accurate.

## 19. ADDITIONAL VERIFICATION

Verify:

- Complete 114-surah catalog.
- Complete verified 6,236 numbered ayat.
- Arabic text integrity.
- Arabic font rendering.
- Searchable surah list.
- Long surah performance.
- Go to Ayah functionality.
- Font size persistence.
- Single-surah calculation.
- Cross-surah calculation.
- Duplicate submission protection.
- Atomic session and bookmark persistence.
- Historical reading logs.
- Manual reading form.
- Dashboard integration.
- Offline operation.
- Light and Dark Mode.
- Indonesian and English interface.
- Phase 01–04 regression.

Run applicable existing commands:

```bash
npm run typecheck
npm run lint
npx expo-doctor
```

Use actual scripts defined in package.json.

Fix detected errors and retest.

Do not fabricate verification results.

## 20. DOCUMENTATION & COMPLETION

Update existing Phase 05 documentation to reflect the revised Release 1 scope.

The new Phase 05 title is:

Digital Quran Reader & Reading Tracker.

Update:

- PROJECT_OVERVIEW.md
- DEVELOPMENT_ROADMAP.md
- ARCHITECTURE.md
- BUSINESS_RULES.md
- DATABASE_SCHEMA.md
- DEVELOPMENT_PROGRESS.md
- UI_UX_GUIDELINES.md
- UAT_CHECKLIST.md

Phase 05 is considered complete only when users can read the Arabic Quran directly inside Hijra and successfully record reading activity.

Report:

- Actual implementation changes.
- Dataset source and licensing evidence.
- Quran text integrity verification.
- Database migration results.
- Reader implementation.
- Tracking integration.
- Test results.
- Known limitations.

Do not mark Phase 05 DONE if the Quran text or mandatory catalog is unavailable.

Do not automatically commit or push.

Do not start Phase 06.

Formal UAT remains scheduled for Phase 12.

IMPLEMENT THE INTEGRATED DIGITAL QURAN READER & READING TRACKER NOW.