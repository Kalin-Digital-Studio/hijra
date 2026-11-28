import { useState } from 'react';
import { Pressable,ScrollView,StyleSheet,View,useWindowDimensions } from 'react-native';
import { BodyText,Input,ProgressBar } from '../../components/ui';
import { useTheme } from '../../hooks/useTheme';
import { reportModes, validCustom, type DateRange, type ReportSelection, type CalendarMode } from '../../services/reportDates';
import { addDays,parseLocalDate } from '../../utils/localDate';
import { light,radius,space } from '../../theme/tokens';
import { formatDate,formatNumber } from '../goals/GoalUI';
import type { GoalTranslate } from '../goals/GoalUI';
import { PrayerAction,PrayerModal,PrayerPanel,prayerStyles } from '../prayer/PrayerUI';
import { PrayerIcon } from '../prayer/PrayerIcon';

export function dateLabel(range:DateRange,locale:string) {
  if(range.start>=range.end)return '—';
  const last=addDays(range.end,-1);
  const ending=formatDate(last,locale);
  if(range.start===last)return ending;
  const start=range.start.slice(0,7)===last.slice(0,7)
    ? new Intl.DateTimeFormat(locale,{day:'numeric'}).format(parseLocalDate(range.start)!)
    : formatDate(range.start,locale);
  return start+' – '+ending;
}
export const valueText=(value:number|null,locale:string)=>value===null?'—':formatNumber(value,locale);
export const percent=(value:number|null,locale:string)=>value===null?'—':valueText(value,locale)+'%';

export function ReportPeriod({selection,today,range,ongoing,t,locale,choose,move,next,previous,calendarOnly,atCurrent}: {
  selection:ReportSelection;today:string;range:DateRange;ongoing:boolean;t:GoalTranslate;locale:string;
  choose:(value:ReportSelection)=>void;move:(step:number)=>void;next:boolean;previous:boolean;calendarOnly?:boolean;atCurrent:boolean;
}) {
  const {colors}=useTheme();
  const {width,fontScale}=useWindowDimensions();
  const singleRow=width>=300&&fontScale<=1.25;
  const [open,setOpen]=useState(false);
  const [start,setStart]=useState(range.start);
  const [last,setLast]=useState(addDays(range.end,-1));
  const valid=validCustom(start,last,today);
  function mode(item:CalendarMode|'CUSTOM') {
    if(item==='CUSTOM') {
      setStart(range.start);setLast(addDays(range.end,-1));setOpen(true);
    }else choose({mode:item,anchor:today});
  }
  return <View style={styles.controls}>
    {!calendarOnly&&<View style={[styles.segments,{backgroundColor:colors.selected,borderColor:colors.border}]}>
      {reportModes.map(item=>{
        const selected=selection.mode===item;
        const label=t('reports.mode.'+item);
        return <Pressable key={item} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{selected}}
          onPress={()=>mode(item)} style={({pressed})=>[styles.segment,singleRow?styles.segmentNarrow:styles.segmentWide,
            {backgroundColor:selected?light.primary:pressed?colors.surface:colors.selected}]}>
          <BodyText style={[styles.segmentText,{color:selected?light.onPrimary:colors.muted}]}>
            {item==='CUSTOM'?t('reports.customSegment'):label}
          </BodyText>
        </Pressable>;
      })}
    </View>}
    <View style={[styles.dates,{backgroundColor:colors.surface,borderColor:colors.border}]}>
      <ReportIconButton icon="back" label={t('prayer.previous')} disabled={!previous} onPress={()=>move(-1)}/>
      <View style={styles.date}>
        <BodyText style={styles.dateLabel}>{dateLabel(range,locale)}</BodyText>
        {ongoing&&<BodyText accessibilityLabel={t('reports.ongoing')} style={[styles.caption,{color:colors.muted}]}>{t('reports.ongoingShort')}</BodyText>}
      </View>
      <ReportIconButton icon="next" label={t('prayer.next')} disabled={!next} onPress={()=>move(1)}/>
    </View>
    {!atCurrent&&<Pressable accessibilityRole="button" accessibilityLabel={t('reports.current')} style={styles.currentAction}
      onPress={()=>choose({mode:selection.mode==='CUSTOM'?'WEEKLY':selection.mode,anchor:today})}>
      <BodyText style={[styles.caption,{color:colors.primary}]}>{t('reports.currentShort')}</BodyText>
    </Pressable>}
    {open&&<PrayerModal dismiss={()=>setOpen(false)}>
      <BodyText style={prayerStyles.section}>{t('reports.mode.CUSTOM')}</BodyText>
      <Input value={start} onChangeText={setStart} maxLength={10} accessibilityLabel={t('reports.start')} placeholder={t('reports.start')}/>
      <Input value={last} onChangeText={setLast} maxLength={10} accessibilityLabel={t('reports.end')} placeholder={t('reports.end')}/>
      {!valid&&<BodyText>{t('reports.rangeError')}</BodyText>}
      <PrayerAction label={t('reports.apply')} disabled={!valid} emphasis="primary"
        onPress={()=>{choose({mode:'CUSTOM',start,last});setOpen(false);}}/>
      <PrayerAction label={t('quran.cancel')} onPress={()=>setOpen(false)}/>
    </PrayerModal>}
  </View>;
}
export function ReportIconButton({icon,label,onPress,disabled,outlined=false}:{
  icon:'back'|'next'|'calendar';label:string;onPress:()=>void;disabled?:boolean;outlined?:boolean;
}) {
  const {colors}=useTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{disabled}}
    onPress={onPress} disabled={disabled} style={({pressed})=>[styles.iconButton,
      outlined&&{backgroundColor:colors.selected},pressed&&{backgroundColor:colors.selected},disabled&&{opacity:0.35}]}>
    <PrayerIcon kind={icon} color={colors.primary} background={outlined?colors.selected:colors.surface} size={22}/>
  </Pressable>;
}
export function Filter({label,value,options,change,t,allLabel=t('goals.all')}:{label:string;value?:string;options:{id:string;label:string}[];change:(value?:string)=>void;t:GoalTranslate;allLabel?:string}) {
  const [open,setOpen]=useState(false);
  const labelValue=options.find(row=>row.id===value)?.label??allLabel;
  return <>
    <PrayerAction label={label+' · '+labelValue} onPress={()=>setOpen(true)}/>
    {open&&<PrayerModal dismiss={()=>setOpen(false)}>
      <BodyText style={prayerStyles.section}>{label}</BodyText>
      <ScrollView style={{maxHeight:320}} contentContainerStyle={{gap:space.xs}}>
        <PrayerAction label={allLabel} selected={!value} onPress={()=>{change();setOpen(false);}}/>
        {options.map(row=><PrayerAction key={row.id} label={row.label} selected={row.id===value}
          onPress={()=>{change(row.id);setOpen(false);}}/>)}
      </ScrollView>
      <PrayerAction label={t('quran.cancel')} onPress={()=>setOpen(false)}/>
    </PrayerModal>}
  </>;
}
export function StatCard({title,values,green=false,progress}:{title:string;values:{label:string;value:string}[];green?:boolean;progress?:number|null}) {
  const {colors}=useTheme();
  return <PrayerPanel style={green?{backgroundColor:light.primary,borderColor:light.primary}:undefined}>
    <BodyText accessibilityRole="header" style={[prayerStyles.section,green&&{color:light.onPrimary}]}>{title}</BodyText>
    {values.map(row=><View style={prayerStyles.line} key={row.label}>
      <BodyText style={[styles.flex,green?prayerStyles.onGreen:{color:colors.muted}]}>{row.label}</BodyText>
      <BodyText style={green?[prayerStyles.onGreen,prayerStyles.section]:prayerStyles.section}>{row.value}</BodyText>
    </View>)}
    {progress!=null&&<ProgressBar label={title} value={progress}/>}
  </PrayerPanel>;
}
export function Bars({title,rows,t,locale,unit}:{title:string;rows:{id?:string|number;label:string;value:number|null}[];t:GoalTranslate;locale:string;unit?:string}) {
  const max=Math.max(1,...rows.map(row=>row.value??0));
  const {colors}=useTheme();
  return <PrayerPanel>
    <BodyText accessibilityRole="header" style={prayerStyles.section}>{title}</BodyText>
    {!!unit&&<View style={styles.chartAxis}>
      <BodyText style={[styles.caption,{color:colors.muted}]}>{t('reports.chartPeriod')}</BodyText>
      <BodyText style={[styles.caption,{color:colors.muted}]}>{unit} · 0–{valueText(max,locale)}</BodyText>
    </View>}
    {!rows.length&&<BodyText>{t('reports.empty')}</BodyText>}
    {rows.map(row=><View key={row.id??row.label} style={styles.bar}>
      <View style={prayerStyles.line}><BodyText style={[prayerStyles.small,styles.flex]}>{row.label}</BodyText>
        <BodyText style={[styles.dateLabel,{color:row.value===null?colors.muted:colors.primary}]}>{row.value===null?t('prayer.na'):valueText(row.value,locale)}</BodyText></View>
      {row.value!==null&&<ReportBar color={colors.primary} value={row.value/max*100}
        label={row.label+' · '+valueText(row.value,locale)+(unit?' '+unit:'')}/>}
    </View>)}
    {rows.some(row=>row.value===null)&&<BodyText style={[styles.caption,{color:colors.muted}]}>{t('reports.chartNA')}</BodyText>}
  </PrayerPanel>;
}
export function ReportBar({value,label,color}:{value:number;label:string;color:string}) {
  const {colors}=useTheme();
  const bounded=Math.min(100,Math.max(0,value));
  return <View accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{text:label}}
    style={[styles.track,{backgroundColor:colors.selected}]}>
    <View style={{backgroundColor:color,width:bounded+'%',height:'100%',borderRadius:radius.md}}/>
  </View>;
}
const styles=StyleSheet.create({
  flex:{flex:1},
  controls:{gap:space.xs},
  segments:{flexDirection:'row',flexWrap:'wrap',borderRadius:radius.md,borderWidth:StyleSheet.hairlineWidth,padding:2},
  segment:{minHeight:48,alignItems:'center',justifyContent:'center',paddingHorizontal:2,paddingVertical:3,borderRadius:radius.md-3},
  segmentNarrow:{flex:1,minWidth:0},
  segmentWide:{width:'50%'},
  segmentText:{fontSize:12,lineHeight:16,fontWeight:'700',textAlign:'center'},
  dates:{flexDirection:'row',alignItems:'center',borderRadius:radius.md,borderWidth:StyleSheet.hairlineWidth},
  date:{flex:1,minWidth:0,alignItems:'center',paddingVertical:space.xs},
  dateLabel:{fontSize:13,lineHeight:18,fontWeight:'700',textAlign:'center'},
  caption:{fontSize:12,lineHeight:17},
  currentAction:{alignSelf:'flex-end',minHeight:48,justifyContent:'center',paddingHorizontal:space.xs},
  iconButton:{minWidth:48,minHeight:48,alignItems:'center',justifyContent:'center',borderRadius:radius.md},
  bar:{gap:4},
  track:{height:6,borderRadius:radius.md,overflow:'hidden'},
  chartAxis:{flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',gap:space.xs},
});
