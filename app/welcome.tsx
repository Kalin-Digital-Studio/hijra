import { useRouter } from 'expo-router';
import { Introduction } from '../src/features/onboarding/Introduction';

export default function Welcome() {
  const router = useRouter();
  return <Introduction mode="FIRST_RUN" onDone={() => router.push('/setup-profile')} />;
}
