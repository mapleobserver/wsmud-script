// raid.flow
// 四区：白三三
@off 无招接五神
@off 起手夺魄五神
@off 补五神剑
$stoppfm
@liaoshang
@await 500
($id) = {r瞌睡虫}?
seleect (id)
fight (id)
@until (:combating) == true
perform dodge.lingbo
@tip 冷笑数声，手指微微弯曲成爪
@perform force.duo
@until (:combating) == false
$startpfm
@on 起手夺魄五神
@on 补五神剑