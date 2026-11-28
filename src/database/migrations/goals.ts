export const goalSchema = `
CREATE TABLE IF NOT EXISTS personal_goals (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  created_date TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_personal_goals_user ON personal_goals(user_id);
CREATE TABLE IF NOT EXISTS personal_goal_versions (
  goal_id TEXT NOT NULL REFERENCES personal_goals(id),
  effective_from TEXT NOT NULL,
  name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 80),
  category TEXT NOT NULL CHECK(category IN ('WAJIB','SUNNAH','QURAN','DHIKR')),
  filter TEXT NOT NULL,
  metric TEXT NOT NULL,
  target INTEGER NOT NULL CHECK(typeof(target) = 'integer' AND target BETWEEN 1 AND 1000000),
  cadence TEXT NOT NULL CHECK(cadence IN ('DAILY','WEEKLY','MONTHLY')),
  state TEXT NOT NULL CHECK(state IN ('ACTIVE','PAUSED','ARCHIVED')),
  PRIMARY KEY(goal_id,effective_from)
);
CREATE TABLE IF NOT EXISTS personal_goal_periods (
  goal_id TEXT NOT NULL,
  start TEXT NOT NULL,
  end_exclusive TEXT NOT NULL CHECK(end_exclusive > start),
  version_from TEXT NOT NULL CHECK(version_from <= start),
  week_start TEXT,
  transition INTEGER NOT NULL CHECK(transition IN (0,1)),
  PRIMARY KEY(goal_id,start),
  FOREIGN KEY(goal_id,version_from) REFERENCES personal_goal_versions(goal_id,effective_from)
);
CREATE INDEX IF NOT EXISTS idx_goal_periods_end ON personal_goal_periods(goal_id,end_exclusive);
CREATE TRIGGER IF NOT EXISTS goal_period_no_overlap BEFORE INSERT ON personal_goal_periods
WHEN EXISTS (
  SELECT 1 FROM personal_goal_periods p WHERE p.goal_id=NEW.goal_id
  AND p.start<NEW.end_exclusive AND p.end_exclusive>NEW.start
)
BEGIN SELECT RAISE(ABORT,'Overlapping goal period'); END;
`;
