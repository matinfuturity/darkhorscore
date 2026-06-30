# DARKHORSCORE LIVE v1

## GitHubに入れるファイル
`/live` に以下を上書きしてください。

- index.html
- style.css
- app.js
- supabase-config.js
- README.md

## Supabase テーブルSQL
Supabase SQL Editorで実行します。

```sql
create table if not exists live_board (
  id bigint primary key,
  race text,
  safe_no text,
  safe_name text,
  safe_star text,
  long_no text,
  long_name text,
  long_star text,
  jiyo_no text,
  jiyo_name text,
  jiyo_star text,
  memo text,
  safe_record text,
  long_record text,
  jiyo_record text,
  roi text,
  profit text,
  history text,
  updated_at timestamptz default now()
);

alter table live_board enable row level security;

create policy "live_board public read"
on live_board for select
using (true);

insert into live_board (
  id, race,
  safe_no, safe_name, safe_star,
  long_no, long_name, long_star,
  jiyo_no, jiyo_name, jiyo_star,
  memo, safe_record, long_record, jiyo_record, roi, profit, history
) values (
  1, '名古屋 11R',
  '5', 'サンライズジパング', '★★★★★',
  '11', 'サヴァ', '★★★☆☆',
  '2', 'テストホース', '★★★★☆',
  '今日は前残り・内枠重視', '184-96', '62-208', '81-39', '128%', '+214,580円', '○ ○ × ○ ○'
)
on conflict (id) do update set
  race = excluded.race,
  safe_no = excluded.safe_no,
  safe_name = excluded.safe_name,
  safe_star = excluded.safe_star,
  long_no = excluded.long_no,
  long_name = excluded.long_name,
  long_star = excluded.long_star,
  jiyo_no = excluded.jiyo_no,
  jiyo_name = excluded.jiyo_name,
  jiyo_star = excluded.jiyo_star,
  memo = excluded.memo,
  safe_record = excluded.safe_record,
  long_record = excluded.long_record,
  jiyo_record = excluded.jiyo_record,
  roi = excluded.roi,
  profit = excluded.profit,
  history = excluded.history,
  updated_at = now();
```

## 接続設定
`supabase-config.js` の2つを入れます。

```js
window.DARKHORSE_SUPABASE_URL = 'https://xxxxx.supabase.co';
window.DARKHORSE_SUPABASE_ANON_KEY = 'xxxxx';
```

空欄のままならデモ表示になります。
