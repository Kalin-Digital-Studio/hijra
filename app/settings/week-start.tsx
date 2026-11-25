import { BackButton } from '../../src/components/BackButton';
import { ScreenContainer } from '../../src/components/ui';
import { SavedPreference } from '../../src/features/profile/Preferences';

export default function WeekStart() {
  return <ScreenContainer standalone><BackButton fallback="/profile" /><SavedPreference field="week_start" /></ScreenContainer>;
}
