//raid.lua
//触发：已死亡
//九阴打华山红专供版，前提是武道塔已经打穿99层，可以在100层消除虚弱debuff
//死亡复活去武道塔100层清虚弱buff，再去回血等九阴CD冷却，砍独孤
relive
$to 武道塔;go enter
[if] (:room)==武道塔-第一百层
    kill {r武道}? 
@until (:combating)==false
$to 扬州城-武庙
dazuo
@until (:mpPer)>0.01
stopstate
liaoshang
@until  (:cd force.cui)==false
stopstate
$to 华山派-客厅
[if] {r独孤败天}? != null
    kill {r独孤败天}?;perform force.cui
[if] {r独孤败天的尸体}? != null
    get all from {r独孤败天的尸体}?