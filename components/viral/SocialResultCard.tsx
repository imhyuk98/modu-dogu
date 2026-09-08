"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";
import type { SocialCardData } from "@/lib/social-card";

export default function SocialResultCard({ data, url }: { data: SocialCardData; url: string }) {
  const [format,setFormat]=useState<"story"|"square">("story");
  const [asset,setAsset]=useState<{key:string;src:string;blob:Blob}|null>(null);
  const [error,setError]=useState("");
  const [status,setStatus]=useState("");
  const [retry,setRetry]=useState(0);
  const [sharing,setSharing]=useState(false);
  const signature=JSON.stringify(data), key=`${signature}|${format}|${url}|${retry}`;
  useEffect(()=>{
    let cancelled=false, objectUrl="";
    const timeout = window.setTimeout(()=>{if(!cancelled) setError(key);},12000);
    import("@/lib/render-social-card").then(({renderSocialCard})=>renderSocialCard(JSON.parse(signature),format,url)).then(blob=>{
      window.clearTimeout(timeout);if(cancelled)return;objectUrl=URL.createObjectURL(blob);setAsset({key,src:objectUrl,blob});
    }).catch(()=>{window.clearTimeout(timeout);if(!cancelled)setError(key);});
    return ()=>{cancelled=true;window.clearTimeout(timeout);if(objectUrl)URL.revokeObjectURL(objectUrl);};
  },[signature,format,url,key]);
  const ready=asset?.key===key;
  const save=()=>{
    if(!ready||!asset)return;
    const a=document.createElement("a");a.href=asset.src;a.download=`${data.kind}-${format}.png`;a.click();
    setStatus("이미지 다운로드를 요청했어요. 저장한 이미지를 SNS 앱에서 선택해 주세요.");trackEvent("result_image_save",{tool:data.kind,format});
  };
  const share=async()=>{
    if(!ready||!asset||sharing)return;
    const file=new File([asset.blob],`${data.kind}-${format}.png`,{type:"image/png"});
    if(!navigator.share||!navigator.canShare?.({files:[file]})){setStatus("이 브라우저에서는 이미지 직접 공유를 지원하지 않아요. 이미지 저장 후 SNS 앱에서 올려주세요.");return;}
    setSharing(true);
    try{
      // Image is prepared before this click: preserve transient user activation.
      await navigator.share({files:[file],title:data.title});
      setStatus("공유 메뉴 처리가 끝났어요. 실제 게시 여부는 선택한 앱에서 확인해 주세요.");trackEvent("result_share",{tool:data.kind,format,method:"native_file"});
    }catch(err){setStatus(err instanceof DOMException&&err.name==="AbortError"?"공유를 취소했어요.":"공유하지 못했어요. 이미지 저장 후 SNS 앱에서 올려주세요.");}
    finally{setSharing(false);}
  };
  return <section className="mt-5 rounded-xl border border-[#d8d1c5] bg-[#fffcf7] p-5 text-[#26231e]" aria-label="SNS 결과 이미지">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h3 className="font-bold">소장하고 싶은 한 장</h3><div role="group" aria-label="이미지 비율" className="flex gap-2">{(["story","square"] as const).map(value=><button key={value} type="button" aria-pressed={format===value} onClick={()=>{setFormat(value);setStatus("");}} className={`min-h-11 rounded-lg border px-3 text-xs font-bold ${format===value?"border-[#26231e] bg-[#26231e] text-white":"border-[#d8d1c5] text-[#625c53]"}`}>{value==="story"?"9:16 스토리":"1:1 피드"}</button>)}</div></div>
    <div className="mx-auto max-w-[330px] overflow-hidden rounded-lg border border-[#d8d1c5] bg-[#f4f0e8]" style={{aspectRatio:format==="story"?"9/16":"1/1"}}>
      {ready&&asset?<Image unoptimized src={asset.src} alt={`${data.title}. 저장되는 실제 결과 이미지 미리보기`} width={1080} height={format==="story"?1920:1080} className="h-full w-full object-contain"/>:<div className="grid h-full place-content-center p-6 text-center text-sm" role="status">{error===key?<><p>이미지를 만들지 못했어요.</p><button className="mt-4 min-h-11 underline" onClick={()=>setRetry(v=>v+1)}>다시 만들기</button></>:"공유할 한 장을 만들고 있어요…"}</div>}
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3"><button type="button" onClick={share} disabled={!ready||sharing} className="min-h-12 rounded-lg bg-[#a93d28] px-3 text-sm font-bold text-white disabled:opacity-40">이미지 공유</button><button type="button" onClick={save} disabled={!ready} className="min-h-12 rounded-lg border border-[#d8d1c5] px-3 text-sm font-bold disabled:opacity-40">이미지 저장</button></div>
    <p className="mt-3 text-xs leading-6 text-[#625c53]">인스타그램에는 저장한 이미지를 올리고, 복사한 결과 주소를 링크 스티커에 붙여주세요. 자동 게시 기능은 아닙니다. QR은 같은 놀이의 시작 화면으로 연결돼요.</p>
    <p role="status" aria-live="polite" className="mt-2 min-h-5 text-xs leading-5 text-[#625c53]">{status}</p>
  </section>;
}
