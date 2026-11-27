import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BodyText, Checkbox, EmptyState, Input } from '../../components/ui';
import { readIslamicBookmarks, writeIslamicBookmark } from '../../database/repositories/islamic';
import { canPreviewMyQuran } from '../../services/islamic/client';
import { arbain, dua, duaDetail, duaSources, hadith, hadithDetail, husna, type Entry } from '../../services/islamic/myquran';
import { useProfile } from '../../stores/profile';
import { PrayerAction, PrayerPanel, prayerStyles } from '../prayer/PrayerUI';
import { IslamicScreen, RemoteState } from './IslamicUI';
import { useRemote } from './useRemote';
import { HadithCatalog } from './HadithCatalog';

type Library = 'hadith'|'dua'|'husna';
const editions:Record<Library,string>={hadith:'v3:enc:1.21.0',dua:'v2:doa',husna:'v3:husna'};
export default function IslamicLibrary() {
  const {resource}=useLocalSearchParams<{resource?:string}>();
  const {t}=useTranslation();
  if(resource!=='hadith' && resource!=='dua' && resource!=='husna')
    return <IslamicScreen title={t('tabs.tracker')}><EmptyState message={t('hub.noResults')} /></IslamicScreen>;
  if(resource==='hadith') return <HadithCatalog renderCollections={back => <LibraryContent type="hadith" onBack={back} />} />;
  return <LibraryContent key={resource} type={resource}/>;
}
function LibraryContent({type,onBack}: {type:Library;onBack?:()=>void}) {
  const {t}=useTranslation();
  const {width,fontScale}=useWindowDimensions();
  const db=useSQLiteContext();
  const user=useProfile(state=>state.profile?.id);
  const [query,setQuery]=useState('');
  const [source,setSource]=useState('all');
  const [collection,setCollection]=useState<'enc'|'arbain'>('enc');
  const [page,setPage]=useState(1);
  const [selected,setSelected]=useState<Entry>();
  const [saved,setSaved]=useState<string[]>([]);
  const [favorites,setFavorites]=useState(false);
  const [latin,setLatin]=useState(true);
  const [meaning,setMeaning]=useState(true);
  const [saveError,setSaveError]=useState(false);
  const q=query.trim();
  const sources=useRemote(type==='dua'?'doa-sources':null,duaSources);
  const enc=type==='hadith'&&collection==='enc';
  const remoteQuery=enc?q:'';
  const load=useCallback(async(signal:AbortSignal)=>{
    if(enc)return hadith(remoteQuery,page,signal);
    if(type==='hadith')return {entries:await arbain(signal),next:false};
    return {entries:await (type==='husna'?husna(signal):dua(signal)),next:false};
  },[type,remoteQuery,page,enc]);
  const key=enc?(q.length>0 && q.length<4?null:[type,q,page].join('|')):[type,collection].join('|');
  const list=useRemote(selected ? null:key,load,type==='hadith'?350:0);
  const selectedId = enc||type==='dua' ? selected?.id : null;
  const detail=useRemote(selectedId??null,useCallback((signal)=>type==='dua'?duaDetail(selected!,signal):hadithDetail(selectedId!,signal),[selected,selectedId,type]));
  const row=enc||type==='dua'?detail.data:selected;
  const bookmarkKey=(entry:Entry)=>entry.id?(type==='hadith'&&!enc?'v3:arbain':editions[type])+':'+entry.id:null;
  const currentKey=row?bookmarkKey(row):null;
  useEffect(()=>{
    if(!user)return;
    let active=true;
    void readIslamicBookmarks(db,user,type).then(rows=>{if(active)setSaved(rows.map(item=>item.key));},()=>{if(active)setSaveError(true);});
    return ()=>{active=false;};
  },[db,user,type]);
  async function favorite(){
    if(!user||!currentKey)return;
    try {
      await writeIslamicBookmark(db,user,type,currentKey,!saved.includes(currentKey));
      setSaved((await readIslamicBookmarks(db,user,type)).map(item=>item.key));
      setSaveError(false);
    }catch{setSaveError(true);}
  }
  const rows=(list.data?.entries??[]).filter((item)=>{
    if(type==='dua' && source!=='all' && item.category!==source)return false;
    if(favorites && !saved.includes(bookmarkKey(item)??''))return false;
    return enc||!q||[item.id,item.title,item.arabic,item.meaning].some(value=>value?.toLocaleLowerCase().includes(q.toLocaleLowerCase()));
  });
  return <IslamicScreen title={t('hub.'+type)} onBack={selected ? () => setSelected(undefined) : onBack}>
    {saveError && <BodyText>{t('hub.localError')}</BodyText>}
    <PrayerAction selected={favorites} label={t('hub.favorites')} onPress={()=>{setSelected(undefined);setFavorites(!favorites);}}/>
    {favorites && <PrayerPanel>
      <BodyText>{t('hub.savedIds')}</BodyText>
      {saved.map(id=><PrayerAction key={id} label={id} disabled={!canPreviewMyQuran||!id.startsWith(editions.hadith+':')}
        onPress={()=>{setCollection('enc');setSelected({id:id.split(':').at(-1)!,title:'#'+id.split(':').at(-1)});}}/>)}
      {!saved.length && <BodyText>{t('hub.noResults')}</BodyText>}
    </PrayerPanel>}
    {!canPreviewMyQuran ? <RemoteState retry={list.retry}/> : selected ? <>
      <PrayerAction label={t('back')} onPress={()=>setSelected(undefined)}/>
      {!row ? <RemoteState error={detail.error} retry={detail.retry}/> : <PrayerPanel>
        <BodyText style={prayerStyles.section}>{row.title}</BodyText>
        {row.arabic && <BodyText style={styles.arabic} accessibilityLanguage="ar">{row.arabic}</BodyText>}
        {type==='dua' && <><Checkbox label={t('dhikr.showLatin')} checked={latin} onChange={setLatin}/>
          <Checkbox label={t('dhikr.showTranslation')} checked={meaning} onChange={setMeaning}/></>}
        {latin && row.latin && <BodyText>{row.latin}</BodyText>}
        {meaning && row.meaning && <BodyText>{t('dhikr.indonesianLanguage')} · {row.meaning}</BodyText>}
        {row.reference && <BodyText>{row.reference}</BodyText>}
        {row.grade && <BodyText>{row.grade} · HadeethEnc</BodyText>}
        {currentKey ? <PrayerAction label={t('hub.favorites')} selected={saved.includes(currentKey)} disabled={!user} onPress={()=>void favorite()}/> :
          <BodyText>{t('hub.noStableId')}</BodyText>}
      </PrayerPanel>}
    </> : <>
      {type==='hadith' && <View style={prayerStyles.wrap}>
        <PrayerAction label="HadeethEnc" selected={collection==='enc'} onPress={()=>{setCollection('enc');setPage(1);setQuery('');}}/>
        <PrayerAction label="Al-Arba’in al-Nawawiyyah" selected={collection==='arbain'} onPress={()=>{setCollection('arbain');setPage(1);setQuery('');}}/>
      </View>}
      <Input placeholder={t('hub.search')} accessibilityLabel={t('hub.search')} value={query}
        onChangeText={value=>{setQuery(value);setPage(1);}} maxLength={80}/>
      {type==='dua' && <View style={prayerStyles.wrap}>
        {['all',...(sources.data??['harian'])].map(name=><PrayerAction key={name} label={name==='all'?t('hub.all'):name} selected={name===source} onPress={()=>setSource(name)}/>)}
      </View>}
      {key===null ? <BodyText>{t('hub.fourCharacters')}</BodyText> : !list.data ? <RemoteState error={list.error} retry={list.retry}/> :
        <View style={styles.list}>
          {!rows.length && <EmptyState message={t('hub.noResults')} />}
          {rows.map((entry,index)=><View key={entry.id??entry.title+index}
            style={type==='husna'&&width>=350&&fontScale<=1.2?styles.half:styles.full}>
            <PrayerAction label={enc?(entry.meaning?.slice(0,130)??entry.title):[entry.id,entry.title,entry.arabic&&type==='husna'?entry.arabic:null].filter(Boolean).join(' · ')}
              onPress={()=>setSelected(entry)}/>
          </View>)}
          {enc && <View style={prayerStyles.wrap}>
            <PrayerAction label={t('prayer.previous')} disabled={page===1} onPress={()=>setPage(page-1)}/>
            <BodyText>{page}</BodyText>
            <PrayerAction label={t('prayer.next')} disabled={!list.data.next} onPress={()=>setPage(page+1)}/>
          </View>}
        </View>}
    </>}
  </IslamicScreen>;
}
const styles=StyleSheet.create({
  arabic:{fontSize:30,lineHeight:54,textAlign:'right',writingDirection:'rtl'},
  list:{flexDirection:'row',flexWrap:'wrap',gap:8},half:{width:'48%',flexGrow:1},full:{width:'100%'},
});
