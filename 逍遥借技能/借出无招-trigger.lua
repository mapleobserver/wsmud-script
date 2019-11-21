// raid.flow
// 四区：白三三
// 新提示信息触发
// 关键字：白三三想和你比试
$stoppfm
setting auto_pfm 0
($id) = {r白三三}?
fight (id)
@until (:combating) == true
@await 1000
@perform sword.wu
@until (:combating) == false
$startpfm
@liaoshang
@dazuo
$zdwk