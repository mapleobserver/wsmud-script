// raid.flow
// 四区：白三三
// 新提示信息触发
// 关键字：白三三想和你比试
$stoppfm
@off 明玉夺魄
setting auto_pfm 0
($id) = {r白三三}?
fight (id)
@until (:combating) == true
@await 1000
@perform unarmed.duo
@until (:combating) == false
$startpfm
@on 明玉夺魄
@liaoshang
@dazuo
$zdwk