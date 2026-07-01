const DEMO = {
  race:'名古屋 11R',
  safe_no:'5', safe_name:'サンライズジパング', safe_star:'★★★★★',
  long_no:'11', long_name:'サヴァ', long_star:'★★★☆☆',
  jiyo_no:'2', jiyo_name:'テストホース', jiyo_star:'★★★★☆',
  memo:'今日は前残り・内枠重視',
  safe_record:'184-96', long_record:'62-208', jiyo_record:'81-39',
  roi:'128%', profit:'+214,580円', history:'○ ○ × ○ ○'
};

const $ = (id) => document.getElementById(id);
let supabaseClient = null;

function fitStage(){
  const stage = $('stage');
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  stage.style.transform = `scale(${scale})`;
  stage.style.left = `${(window.innerWidth - 1920 * scale) / 2}px`;
  stage.style.top = `${(window.innerHeight - 1080 * scale) / 2}px`;
}

function val(data, key){
  return data && data[key] !== undefined && data[key] !== null && data[key] !== '' ? data[key] : DEMO[key];
}

function render(data){
  $('race').textContent = val(data,'race');
  $('safeNo').textContent = val(data,'safe_no');
  $('safeName').textContent = val(data,'safe_name');
  $('safeStar').textContent = val(data,'safe_star');
  $('longNo').textContent = val(data,'long_no');
  $('longName').textContent = val(data,'long_name');
  $('longStar').textContent = val(data,'long_star');
  $('jiyoNo').textContent = val(data,'jiyo_no');
  $('jiyoName').textContent = val(data,'jiyo_name');
  $('jiyoStar').textContent = val(data,'jiyo_star');
  $('memo').textContent = val(data,'memo');
  $('safeRecord').textContent = val(data,'safe_record');
  $('longRecord').textContent = val(data,'long_record');
  $('jiyoRecord').textContent = val(data,'jiyo_record');
  $('roi').textContent = val(data,'roi');
  $('profit').textContent = val(data,'profit');
  $('history').textContent = val(data,'history');
  $('updated').textContent = 'UPDATED ' + new Date().toLocaleTimeString('ja-JP',{hour12:false});
  $('stage').classList.remove('flash');
  void $('stage').offsetWidth;
  $('stage').classList.add('flash');
}

function hasSupabaseConfig(){
  return window.DARKHORSE_SUPABASE_URL && window.DARKHORSE_SUPABASE_ANON_KEY && window.supabase;
}

async function fetchLiveBoard(){
  if(!hasSupabaseConfig()){
    render(DEMO);
    return;
  }
  if(!supabaseClient){
    supabaseClient = window.supabase.createClient(
      window.DARKHORSE_SUPABASE_URL,
      window.DARKHORSE_SUPABASE_ANON_KEY
    );
  }
  const rowId = window.DARKHORSE_LIVE_ROW_ID || 1;
  const { data, error } = await supabaseClient
    .from('live_board')
    .select('*')
    .eq('id', rowId)
    .single();

  if(error){
    console.warn('Supabase fetch error:', error.message);
    render(DEMO);
    return;
  }
  render(data);
}

function subscribeLiveBoard(){
  if(!hasSupabaseConfig() || !supabaseClient) return;
  const rowId = window.DARKHORSE_LIVE_ROW_ID || 1;
  supabaseClient
    .channel('darkhorscore-live-board')
    .on('postgres_changes', { event:'*', schema:'public', table:'live_board', filter:`id=eq.${rowId}` }, (payload) => {
      render(payload.new || DEMO);
    })
    .subscribe();
}

window.addEventListener('resize', fitStage);
window.addEventListener('load', async () => {
  fitStage();
  await fetchLiveBoard();
  subscribeLiveBoard();
  setsetInterval(fetchLiveBoard, 3000);
});
