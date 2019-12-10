// raid.flow
// 四区：白三三
// 新提示信息触发
// 关键词人名自己修改
// 关键字：白三三想和你比试
$stoppfm
// 关闭所有起手触发
@off 起手无招
@off 补无招
setting auto_pfm 0
($id) = {r白三三}?
fight (id)
@until (:combating) == true
@await 1000
@perform sword.wu
@until (:combating) == false
// 开启相关起手触发
@on 起手无招
@on 补无招
$startpfm
@liaoshang
@dazuo
$zdwk