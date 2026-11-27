import { useEffect, useState } from 'react';
import { canPreviewMyQuran } from '../../services/islamic/client';

export function useRemote<T>(key: string | null, load: (signal: AbortSignal) => Promise<T>, delay=0) {
  const [revision, setRevision]=useState(0);
  const [result,setResult]=useState<{key:string;revision:number;data?:T;error?:Error;fetchedAt?:number}>();
  useEffect(() => {
    if (!key || !canPreviewMyQuran) return;
    const controller=new AbortController();
    const timer=setTimeout(() => {
      void load(controller.signal).then(
        (data) => { if (!controller.signal.aborted) setResult({key,revision,data,fetchedAt:Date.now()}); },
        (error: Error) => { if (!controller.signal.aborted) setResult({key,revision,error}); },
      );
    },delay);
    return () => { clearTimeout(timer); controller.abort(); };
  },[key,load,revision,delay]);
  return { ...(result?.key===key && result.revision===revision ? result : undefined),
    retry: () => setRevision((value)=>value+1) };
}
