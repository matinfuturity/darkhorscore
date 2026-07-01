const TABLE = 'live_board';
const ROW_ID = 1;

const statusCard = document.getElementById('statusCard');
const statusText = document.getElementById('statusText');
const form = document.getElementById('adminForm');
const saveBtn = document.getElementById('saveBtn');
const reloadBtn = document.getElementById('reloadBtn');

function setStatus(text, type=''){
  statusText.textContent = text;
  statusCard.className = `status-card ${type}`;
}

function getClient(){
  if(!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY){
    throw new Error('supabase-config.js が未設定です');
  }
  return window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
}

function setValue(id, value){
  const el = document.getElementById(id);
  if(el) el.value = value ?? '';
}

function collect(){
  return {
    race: form.race.value.trim(),
    safe_no: form.safe_no.value.trim(),
    safe_name: form.safe_name.value.trim(),
    safe_star: form.safe_star.value,
    long_no: form.long_no.value.trim(),
    long_name: form.long_name.value.trim(),
    long_star: form.long_star.value,
    jiyo_no: form.jiyo_no.value.trim(),
    jiyo_name: form.jiyo_name.value.trim(),
    jiyo_star: form.jiyo_star.value,
    memo: form.memo.value.trim(),
    safe_record: form.safe_record.value.trim(),
    long_record: form.long_record.value.trim(),
    jiyo_record: form.jiyo_record.value.trim(),
    roi: form.roi.value.trim(),
    profit: form.profit.value.trim(),
    history: form.history.value.trim(),
    updated_at: new Date().toISOString()
  };
}

async function loadCurrent(){
  try{
    const client = getClient();
    setStatus('現在データを読み込み中...');
    const { data, error } = await client.from(TABLE).select('*').eq('id', ROW_ID).single();
    if(error) throw error;
    ['race','safe_no','safe_name','safe_star','long_no','long_name','long_star','jiyo_no','jiyo_name','jiyo_star','memo','safe_record','long_record','jiyo_record','roi','profit','history'].forEach(k=>setValue(k, data[k]));
    setStatus('接続OK。編集して保存できます', 'ok');
  }catch(e){
    setStatus('読込エラー：' + e.message, 'err');
  }
}

async function saveCurrent(e){
  e.preventDefault();
  saveBtn.disabled = true;
  try{
    const client = getClient();
    setStatus('保存中...');
    const { error } = await client.from(TABLE).update(collect()).eq('id', ROW_ID);
    if(error) throw error;
    setStatus('保存完了。LIVE画面を更新しました', 'ok');
  }catch(e){
    setStatus('保存エラー：' + e.message, 'err');
  }finally{
    saveBtn.disabled = false;
  }
}

form.addEventListener('submit', saveCurrent);
reloadBtn.addEventListener('click', loadCurrent);
loadCurrent();
