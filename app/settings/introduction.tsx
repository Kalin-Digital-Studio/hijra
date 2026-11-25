import { useRouter } from 'expo-router';
import { Introduction } from '../../src/features/onboarding/Introduction';

export default function Replay() {
  const router = useRouter();
  return <Introduction mode="REPLAY" onDone={() => {
    if (router.canGoBack()) router.back();
    else router.replace('/profile');
  }} />;
}
