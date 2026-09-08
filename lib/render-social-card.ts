import QRCode from "qrcode";
import { moonShape, socialCardLabels, type SocialCardData } from "./social-card";

export async function renderSocialCard(data: SocialCardData, format: "story" | "square", destination: string) {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1080; canvas.height = format === "story" ? 1920 : 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const story = format === "story", night = data.kind === "moon-compatibility";
  const paper = night ? "#1e2637" : "#f4f0e8", ink = night ? "#f8f0df" : "#26231e", muted = night ? "#c8cbd4" : "#625c53", accent = night ? "#e9c488" : "#a93d28", rule = night ? "#566078" : "#d8d1c5";
  const font = (size: number, weight = 700) => { ctx.font = `${weight} ${size}px "Noto Sans KR", "Malgun Gothic", sans-serif`; };
  const text = (value: string, x: number, y: number, width: number, size: number, maxLines = 1, color = ink, weight = 700) => {
    font(size, weight); ctx.fillStyle = color;
    const lines: string[] = []; let line = "";
    for (const char of value) {
      if (char === "\n" || (line && ctx.measureText(line + char).width > width)) { lines.push(line); line = char === "\n" ? "" : char; } else line += char;
    }
    if (line) lines.push(line);
    const visible = lines.slice(0, maxLines);
    if (lines.length > maxLines) { let tail = visible[maxLines - 1]; while (tail && ctx.measureText(tail + "…").width > width) tail = Array.from(tail).slice(0, -1).join(""); visible[maxLines - 1] = tail + "…"; }
    visible.forEach((value, i) => ctx.fillText(value, x, y + i * size * 1.25));
  };
  const circle = (x: number, y: number, r: number, color: string) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fillStyle = color; ctx.fill(); };
  const line = (x1: number, y1: number, x2: number, y2: number, color = rule, width = 2) => { ctx.beginPath(); ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke(); };
  ctx.fillStyle = paper; ctx.fillRect(0,0,1080,canvas.height);
  ctx.strokeStyle = rule; ctx.lineWidth = 2; ctx.strokeRect(40,40,1000,canvas.height-80);
  text("모두의도구",76,story ? 130 : 94,600,32);
  text("친구랑, 한 장.",76,story ? 190 : 138,800,24,1,muted,400);
  const y = story ? 435 : 246, r = story ? 135 : 75;
  if (data.kind === "moon-compatibility") {
    for (let i=0;i<20;i++) { const x=90+(i*137)%900, sy=(story ? 270 : 168)+(i*53)%(story ? 360 : 140); circle(x,sy, i%4===0?3:1.5,"#d8c9a5"); }
    (data.moons ?? [1,6]).forEach((phase,i) => { const x = i===0 ? 360 : 720; circle(x,y,r,"#414b63");ctx.save();ctx.translate(x,y);ctx.fillStyle="#f6dcaa";ctx.fill(new Path2D(moonShape(phase,r)));ctx.restore(); });
  } else if (data.kind === "friend-chemistry") {
    circle(450,y,r,"#e8b6a2"); circle(625,y,r,"#d6d8c6");
    ctx.save();ctx.beginPath();ctx.arc(450,y,r,0,Math.PI*2);ctx.clip();circle(625,y,r,accent);ctx.restore();
    text(data.metric ?? "우리의 공통점",story?335:385,y+16,440,story?58:44,1,ink);
  } else if (data.kind === "compliment-card") {
    ctx.fillStyle=accent;ctx.beginPath();ctx.moveTo(485,y+40);ctx.lineTo(455,y+r+65);ctx.lineTo(540,y+r+30);ctx.lineTo(625,y+r+65);ctx.lineTo(595,y+40);ctx.fill();
    ctx.beginPath();for(let i=0;i<40;i++){const angle=i*Math.PI/20;const radius=i%2 ? r*.91 : r; const x=540+Math.cos(angle)*radius,sy=y+Math.sin(angle)*radius;if(i===0)ctx.moveTo(x,sy);else ctx.lineTo(x,sy);}ctx.closePath();ctx.fillStyle="#e8c77e";ctx.fill();
    circle(540,y,r*.7,paper); text("고마워",540-r*.54,y+14,r*1.1,story?44:25,1,accent);
  } else if (data.kind === "friend-manual") {
    ctx.fillStyle="#fffcf7";ctx.fillRect(290,y-r,500,r*2);ctx.strokeStyle=rule;ctx.strokeRect(290,y-r,500,r*2);
    for(let i=0;i<3;i++){const sy=y-r*.55+i*r*.6;circle(320,sy,7,accent);line(365,sy,740,sy,rule,3);}
    text("나를 읽는 방법",365,y-r*.3,390,story?44:29,1,ink);
  } else {
    ctx.save();ctx.translate(540,y);ctx.rotate(-.09);ctx.strokeStyle=accent;ctx.lineWidth=5;ctx.strokeRect(-230,-r,460,r*2);text(data.metric??"우정고사", -195,15,400,story?90:60,1,accent);ctx.restore();
  }
  text(socialCardLabels[data.kind],76,story?660:385,928,story?28:24,1,accent);
  text(data.title,76,story?760:450,928,story?76:54,2,ink);
  text(data.subtitle,76,story?970:590,928,story?34:26,story?3:2,muted,400);
  const rowTop=story?1140:678, rowHeight=story?77:43;
  data.highlights.slice(0,5).forEach((item,index)=>{
    const sy=rowTop+index*rowHeight;
    line(76,sy-30,1004,sy-30);
    text(item.label,76,sy,story?230:200,story?25:21,1,muted,400);
    text(item.value,story?325:295,sy,story?679:709,story?31:24,1,ink);
  });
  const footer=story?1585:900;
  line(76,footer,1004,footer,accent,3);
  text("내 친구와도 해보기",76,footer+(story?80:52),650,story?35:26);
  text("놀이용 결과 · 실제 관계를 진단하지 않아요",76,footer+(story?130:88),720,story?26:21,1,muted,400);
  if(story) text("이미지를 올릴 때는 앱에서 링크 스티커를 직접 추가하세요",76,footer+185,700,22,2,muted,400);
  // Short public URL keeps the QR readable and excludes personal answers.
  const target = new URL(destination); target.hash=""; target.search="";
  const qr=await QRCode.toDataURL(target.href,{width:240,margin:4,errorCorrectionLevel:"M",color:{dark:"#26231e",light:"#fffcf7"}});
  const image=new Image();image.src=qr;await image.decode();
  const qrSize=story?210:120;ctx.drawImage(image,1004-qrSize,footer+20,qrSize,qrSize);
  return new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error("Image encoding failed")),"image/png"));
}
