export const reflectionSchema = `
CREATE TABLE IF NOT EXISTS weekly_reflections (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  week_start TEXT NOT NULL,
  week_end_exclusive TEXT NOT NULL CHECK(week_end_exclusive>week_start),
  week_start_preference TEXT NOT NULL CHECK(week_start_preference IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  feeling TEXT CHECK(feeling IN ('DIFFICULT','OKAY','GOOD','HAPPY','CALM')),
  gratitude TEXT CHECK(length(gratitude) BETWEEN 1 AND 5000),
  challenges TEXT CHECK(length(challenges) BETWEEN 1 AND 5000),
  improvement_plan TEXT CHECK(length(improvement_plan) BETWEEN 1 AND 5000),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(user_id,week_start,week_end_exclusive),
  CHECK(feeling IS NOT NULL OR gratitude IS NOT NULL OR challenges IS NOT NULL OR improvement_plan IS NOT NULL)
);
CREATE TRIGGER IF NOT EXISTS weekly_reflections_no_overlap BEFORE INSERT ON weekly_reflections
WHEN EXISTS(SELECT 1 FROM weekly_reflections r WHERE r.user_id=NEW.user_id
  AND r.week_start<NEW.week_end_exclusive AND r.week_end_exclusive>NEW.week_start)
BEGIN SELECT RAISE(ABORT,'Overlapping reflection week'); END;
`;
