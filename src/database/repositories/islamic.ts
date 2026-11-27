import type { SQLiteDatabase } from 'expo-sqlite';
import { zones, type City } from '../../services/islamic/rules.ts';
import type { Resource } from '../../services/islamic/client.ts';

export async function readPrayerCity(db: SQLiteDatabase): Promise<City | null> {
  const row = await db.getFirstAsync<{value:string}>("SELECT value FROM app_settings WHERE key='prayer_city_myquran_v3'");
  if (!row) return null;
  try {
    const city = JSON.parse(row.value) as City;
    return typeof city.id==='string' && !!city.id && typeof city.name==='string' && !!city.name && zones.includes(city.zone) ? city : null;
  } catch { return null; }
}
export function savePrayerCity(db: SQLiteDatabase, city: City) {
  return db.runAsync("INSERT INTO app_settings (key,value) VALUES ('prayer_city_myquran_v3',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",JSON.stringify(city));
}
export async function readIslamicBookmarks(db: SQLiteDatabase,user: string,type: Resource) {
  return db.getAllAsync<{key:string}>(`SELECT content_key AS key FROM islamic_content_bookmarks
    WHERE user_id=? AND content_type=? AND provider='myquran' ORDER BY created_at DESC`,user,type);
}
export function writeIslamicBookmark(db: SQLiteDatabase,user:string,type:Resource,key:string,selected:boolean) {
  return selected ? db.runAsync(`INSERT INTO islamic_content_bookmarks (user_id,content_type,provider,content_key)
    VALUES (?,?,'myquran',?) ON CONFLICT DO NOTHING`,user,type,key) :
    db.runAsync("DELETE FROM islamic_content_bookmarks WHERE user_id=? AND content_type=? AND provider='myquran' AND content_key=?",user,type,key);
}
