import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const DEMO = {
  race:'名古屋 11R', safe_no:'5', safe_name:'サンライズジパング', safe_star:'★★★★★',
  long_no:'11', long_name:'サヴァ', long_star:'★★★☆☆', jiyo_no:'2', jiyo_name:'テストホース', jiyo_star:'★★★★☆',
  memo:'今日は前残り・内枠重視', history:'○ ○ × ○ ○', roi:'128%', profit:'+214,580円'
};
const $ = (id)=>document.getElementById(id);
function fit(){const c=document.querySelector('.canvas');const s=Math.min(innerWidth/1920,innerHeight/1080);c.style.transform=`scale(${s})`;c.style.left=`${(innerWidth-1920*s)/2}px`;c.style.top=`${(innerHeight-1080*s)/2}px`;}
addEventListener('resize',fit);fit();
function render(d=DEMO){
  $('race').textContent=d.race||DEMO.race; $('safeNo').textContent=d.safe_no||DEMO.safe_no; $('safeName').textContent=d.safe_name||DEMO.safe_name; $('safeStar').textContent=d.safe_star||DEMO.safe_star;
  $('longNo').textContent=d.long_no||DEMO.long_no; $('longName').textContent=d.long_name||DEMO.long_name; $('longStar').textContent=d.long_star||DEMO.long_star;
  $('jiyoNo').textContent=d.jiyo_no||DEMO.jiyo_no; $('jiyoName').textContent=d.jiyo_name||DEMO.jiyo_name; $('jiyoStar').textContent=d.jiyo_star||DEMO.jiyo_star;
  $('memo').textContent=d.memo||DEMO.memo; $('history').textContent=d.history||DEMO.history; $('roi').textContent=d.roi||DEMO.roi; $('profit').textContent=d.profit||DEMO.profit;
  $('updated').textContent='UPDATED '+new Date().toLocaleTimeString('ja-JP',{hour12:false}); document.querySelector('.canvas').classList.remove('flash'); void document.body.offsetWidth; document.querySelector('.canvas').classList.add('flash');
}
let supabase=null;
const ready = SUPABASE_URL && !SUPABASE_URL.includes('YOUR_') && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('YOUR_');
if(ready) supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
async function load(){
  if(!supabase){render(DEMO);return;}
  const {data,error}=await supabase.from('live_board').select('*').eq('id',1).single();
  if(error){console.warn(error);render(DEMO);return;} render(data);
}
load(); setInterval(load,5000);
if(supabase){ supabase.channel('live_board_changes').on('postgres_changes',{event:'*',schema:'public',table:'live_board'},load).subscribe(); }
