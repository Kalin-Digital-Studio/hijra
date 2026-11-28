import { useLocalSearchParams,useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { EmptyState,ScreenContainer } from '../../components/ui';
import { firstReportDate,reportModes,validCustom,type ReportSelection } from '../../services/reportDates';
import { parseLocalDate } from '../../utils/localDate';
import { PrayerAction } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { sections } from './ReportDetails';
import { ReportsScreen } from './Reports';

export default function ReportRoute() {
  const {t}=useTranslation();
  const router=useRouter();
  const today=useToday();
  const params=useLocalSearchParams<{section?:string;mode?:string;start?:string;last?:string;anchor?:string}>();
  const view=[...sections,'calendar','comparison'] as const;
  const section=view.find(item=>item===params.section);
  if(!section)return <ScreenContainer standalone compact>
    <EmptyState message={t('reports.empty')}/>
    <PrayerAction label={t('back')} onPress={()=>router.replace('/reports')}/>
  </ScreenContainer>;
  const mode=reportModes.find(item=>item===params.mode);
  const validAnchor=typeof params.anchor==='string'&&parseLocalDate(params.anchor)&&params.anchor>=firstReportDate&&params.anchor<=today;
  let initial:ReportSelection|undefined;
  if(mode==='CUSTOM'&&typeof params.start==='string'&&typeof params.last==='string'&&validCustom(params.start,params.last,today))
    initial=section==='calendar'?{mode:'MONTHLY',anchor:params.start}:{mode,start:params.start,last:params.last};
  else if(mode&&mode!=='CUSTOM'&&validAnchor)
    initial={mode:section==='calendar'?'MONTHLY':mode,anchor:params.anchor!};
  return <ReportsScreen key={section} view={section} initial={initial}/>;
}
