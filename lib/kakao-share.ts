interface KakaoSDK { init:(key:string)=>void; isInitialized:()=>boolean; Share:{sendDefault:(value:unknown)=>void}; }
declare global { interface Window { Kakao?: KakaoSDK; } }
export const kakaoShareConfigured = Boolean(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
let loading:Promise<KakaoSDK>|null=null;
export function loadKakaoShare():Promise<KakaoSDK> {
  if(!process.env.NEXT_PUBLIC_KAKAO_JS_KEY)return Promise.reject(new Error("Kakao share not configured"));
  if(loading)return loading;
  loading=new Promise<KakaoSDK>((resolve,reject)=>{
    const initialize=()=>{try{const sdk=window.Kakao;if(!sdk)throw new Error("SDK missing");if(!sdk.isInitialized())sdk.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY!);resolve(sdk);}catch(e){reject(e);}};
    if(window.Kakao){initialize();return;}
    const script=document.createElement("script");script.src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js";
    script.integrity="sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy";script.crossOrigin="anonymous";script.async=true;
    const timer=window.setTimeout(()=>{script.remove();reject(new Error("SDK timeout"));},10000);
    script.onload=()=>{window.clearTimeout(timer);initialize();};script.onerror=()=>{window.clearTimeout(timer);script.remove();reject(new Error("SDK blocked"));};document.head.appendChild(script);
  }).catch(error=>{loading=null;throw error;});
  return loading;
}
export function sendKakaoShare({title,text,url,tool}:{title:string;text:string;url:string;tool:string}) {
  if(!window.Kakao?.isInitialized())throw new Error("SDK not ready");
  const known=["friendship-quiz","friend-manual","friend-chemistry","compliment-card","moon-compatibility"];
  const target=new URL(url,window.location.origin);
  if(!["http:","https:"].includes(target.protocol)||target.origin!==window.location.origin)throw new Error("Invalid destination");
  window.Kakao.Share.sendDefault({objectType:"feed",content:{title:title.slice(0,80),description:text.slice(0,180),imageUrl:`https://modu-dogu.pages.dev/${known.includes(tool)?`og/social/${tool}.png`:"og-image.png"}`,link:{mobileWebUrl:target.href,webUrl:target.href}},buttons:[{title:"열어보기",link:{mobileWebUrl:target.href,webUrl:target.href}}]});
}
