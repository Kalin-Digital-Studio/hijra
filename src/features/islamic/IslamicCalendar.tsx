import { useCallback, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { indonesianHolidaySources, indonesianIslamicHolidays } from '../../services/islamic/indonesianHolidays';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { PrayerIcon } from '../prayer/PrayerIcon';
import { light, radius, space } from '../../theme/tokens';
import { useTranslation } from 'react-i18next';
import { BodyText } from '../../components/ui';
import { hijriDate } from '../../services/islamic/myquran';
import { monthDates, monthShift } from '../../services/islamic/rules';
import { parseLocalDate, weekDates } from '../../utils/localDate';
import { useSettings } from '../../stores/settings';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { useToday } from '../prayer/usePrayer';
import { IslamicScreen, RemoteState } from './IslamicUI';
import { useRemote } from './useRemote';

export function HijriSummary({date, compact}: {date:string; compact?:boolean}) {
  const {t,i18n}=useTranslation();
  const load=useCallback((signal:AbortSignal)=>hijriDate(date,signal),[date]);
  const result=useRemote(date,load);
  const local=formatHijri(i18n.resolvedLanguage,date,true);
  const router=useRouter();
  const {colors}=useTheme();
  if (compact) {
    const hijri=result.data;
    const label=hijri ? `${hijri.day} ${hijri.month} ${hijri.year} H` : local;
    return <Pressable accessibilityRole="button" onPress={()=>router.push('/islamic/calendar')}
      style={[summaryStyles.card,{backgroundColor:colors.surface,borderColor:colors.border}]}>
      <View style={[summaryStyles.badge,{backgroundColor:colors.selected}]}>
        <PrayerIcon kind="moon" color={colors.primary} background={colors.selected} size={20} />
      </View>
      <View style={summaryStyles.text}>
        <BodyText style={[prayerStyles.small,{color:colors.muted}]}>{t('hub.calendar')}</BodyText>
        <BodyText style={summaryStyles.title}>{label ?? t('hub.hijriToday')}</BodyText>
        <BodyText style={[prayerStyles.small,{color:colors.muted}]}>
          {hijri ? 'MyQuran' : local ? t('hub.civilCalendar') : t('hub.openCalendar')}
        </BodyText>
      </View>
      <PrayerIcon kind="next" color={colors.primary} background={colors.surface} size={18} />
    </Pressable>;
  }
  const hijri = result.data;
  return <>
    <PrayerPanel style={summaryStyles.hero}>
      <BodyText style={summaryStyles.heroCaption}>{t('hub.hijriDateLabel')}</BodyText>
      <BodyText style={summaryStyles.heroDate}>{hijri ? `${hijri.day} ${hijri.month}` : local ?? '—'}</BodyText>
      {hijri && <BodyText style={summaryStyles.heroYear}>{hijri.year} H</BodyText>}
      <BodyText style={summaryStyles.heroCaption}>{hijri
        ? `MyQuran · ${t('hub.method', { method: hijri.method })}`
        : local ? t('hub.civilCalendar') : t('hub.hijriToday')}</BodyText>
    </PrayerPanel>
    {!hijri && !local && <RemoteState error={result.error} retry={result.retry} />}
    {!hijri && local && result.error && <PrayerAction label={t('retry')} onPress={result.retry} />}
  </>;
}

export default function IslamicCalendar() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const today = useToday();
  const weekStart = useSettings((state) => state.week_start);
  const [selected, setSelected] = useState<string>();
  const date = selected ?? today;
  const month = date.slice(0, 7);
  const language = i18n.resolvedLanguage;
  const first = `${month}-01`;
  const week = weekDates(first, weekStart);
  const leading = week.indexOf(first);
  const monthLabel = new Intl.DateTimeFormat(language, { month: 'long', year: 'numeric' }).format(parseLocalDate(first)!);
  const weekday = new Intl.DateTimeFormat(language, { weekday: 'narrow' });
  const fullDate = new Intl.DateTimeFormat(language, { dateStyle: 'full' });
  const days = monthDates(month);
  const holidays = days.filter(day => indonesianIslamicHolidays[day]);
  const source = indonesianHolidaySources[month.slice(0, 4)];
  const trailing = (7 - (leading + days.length) % 7) % 7;
  const blanks = (count: number, prefix: string) =>
    Array.from({ length: count }, (_, index) => <View key={prefix + index} style={summaryStyles.cell} />);

  return <IslamicScreen title={t('hub.calendar')}>
    <HijriSummary date={date} />
    <View style={summaryStyles.monthHeader}>
      <PrayerAction icon="back" label={t('prayer.previous')} disabled={first <= '0001-01-01'}
        onPress={() => setSelected(monthShift(month, -1) + '-01')} />
      <BodyText accessibilityRole="header" style={summaryStyles.monthTitle}>{monthLabel}</BodyText>
      <PrayerAction icon="next" label={t('prayer.next')} disabled={first >= '9999-12-01'}
        onPress={() => setSelected(monthShift(month, 1) + '-01')} />
    </View>
    <View style={summaryStyles.grid}>
      {week.map((day) => <View key={day} style={[summaryStyles.cell, summaryStyles.weekday]}>
        <BodyText style={[prayerStyles.small, { color: colors.muted }]}>{weekday.format(parseLocalDate(day)!)}</BodyText>
      </View>)}
      {blanks(leading, 'before')}
      {days.map((day) => {
        const active = day === date;
        const current = day === today;
        const holiday = indonesianIslamicHolidays[day];
        const label = fullDate.format(parseLocalDate(day)!);
        return <Pressable key={day} accessibilityRole="button" accessibilityState={{ selected: active }}
          accessibilityLabel={holiday ? label + ' · ' + t('hub.holidays.' + holiday) : label} onPress={() => setSelected(day)}
          style={summaryStyles.cell}>
          <View style={[summaryStyles.day, active && { backgroundColor: colors.primary },
            current && !active && { borderWidth: 1, borderColor: colors.primary }]}>
            <BodyText style={active ? { color: colors.onPrimary, fontWeight: '700' } : undefined}>{Number(day.slice(-2))}</BodyText>
            {holiday && <View style={[summaryStyles.holidayDot, { backgroundColor: active ? colors.onPrimary : colors.accent }]} />}
          </View>
        </Pressable>;
      })}
      {blanks(trailing, 'after')}
    </View>
    {holidays.length > 0 && <PrayerPanel>
      <BodyText accessibilityRole="header" style={prayerStyles.section}>{t('hub.indonesianHolidays')}</BodyText>
      {holidays.map(day => <PrayerAction key={day} selected={day === date}
        label={fullDate.format(parseLocalDate(day)!) + ' · ' + t('hub.holidays.' + indonesianIslamicHolidays[day])}
        onPress={() => setSelected(day)} />)}
      {source && <Pressable accessibilityRole="link" onPress={() => { void Linking.openURL(source).catch(() => undefined); }}>
        <BodyText style={[prayerStyles.small, { color: colors.primary }]}>{t('hub.holidaySource')}</BodyText>
      </Pressable>}
    </PrayerPanel>}
    {date !== today && <PrayerAction label={t('prayer.today')} onPress={() => setSelected(undefined)} />}
    <BodyText style={[prayerStyles.small, { color: colors.muted, marginTop: space.md }]}>{t('hub.calendarFooter')}</BodyText>
  </IslamicScreen>;
}

function formatHijri(language:string|undefined,date:string,withYear=false) {
  try {
    const format=new Intl.DateTimeFormat(language,{calendar:'islamic-civil',day:'numeric',month:'short',year:withYear?'numeric':undefined});
    const day=parseLocalDate(date);
    return day && format.resolvedOptions().calendar==='islamic-civil' ? format.format(day) : null;
  } catch { return null; }
}
const summaryStyles=StyleSheet.create({
  hero:{backgroundColor:light.primary,borderColor:light.primary,gap:space.xs},
  heroCaption:{color:'#C9DDD3',fontSize:12,lineHeight:17},
  heroDate:{color:light.onPrimary,fontSize:20,lineHeight:27,fontWeight:'700'},
  heroYear:{color:light.onPrimary,fontWeight:'600'},
  monthHeader:{flexDirection:'row',alignItems:'center',gap:space.xs},
  monthTitle:{flex:1,textAlign:'center',fontSize:15,fontWeight:'600'},
  grid:{flexDirection:'row',flexWrap:'wrap'},
  cell:{width:'14.2857%',minHeight:48,alignItems:'center',justifyContent:'center'},
  weekday:{minHeight:32},
  day:{width:'90%',minHeight:42,borderRadius:10,alignItems:'center',justifyContent:'center'},
  holidayDot:{position:'absolute',bottom:4,width:5,height:5,borderRadius:3},
  card:{flexDirection:'row',alignItems:'center',gap:space.sm,borderWidth:StyleSheet.hairlineWidth,borderRadius:radius.md,padding:space.sm,minHeight:56},
  badge:{width:36,height:36,borderRadius:10,alignItems:'center',justifyContent:'center'},
  text:{flex:1},
  title:{fontSize:15,lineHeight:22,fontWeight:'700'},
});
