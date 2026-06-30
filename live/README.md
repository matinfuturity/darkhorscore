# DARKHORSCORE LIVE v1

## Supabase SQL

```sql
create table if not exists live_board (
  id bigint primary key default 1,
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
  history text,
  roi text,
  profit text,
  updated_at timestamptz default now()
);

insert into live_board (id,race,safe_no,safe_name,safe_star,long_no,long_name,long_star,jiyo_no,jiyo_name,jiyo_star,memo,history,roi,profit)
values (1,'名古屋 11R','5','サンライズジパング','★★★★★','11','サヴァ','★★★☆☆','2','テストホース','★★★★☆','今日は前残り・内枠重視','○ ○ × ○ ○','128%','+214,580円')
on conflict (id) do update set race=excluded.race;
```

`supabase-config.js` にURLとanon keyを入れる。
