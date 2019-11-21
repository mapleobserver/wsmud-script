// raid.flow
// 四区：白三三
@off 起手凌波夺魄
@off 起手夺魄五神
@off 补五神剑
$stoppfm
@liaoshang
@await 500
($id) = {r胧月夜}?
seleect (id)
fight (id)
@until (:combating) == true
perform dodge.lingbo
@until (:status weapon,(id)) == true
@perform force.duo
@perform force.record
@until (:combating) == false
$startpfm
@on 无招接五神