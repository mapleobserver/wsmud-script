// raid.flow
// 四区：白三三
// 新提示信息触发
// 关键词人名自己修改
// 关键字：想和你比试
@js ($player) = "(text)".match("<hiy>([^%]+)想和你比试")[1]
[if] (player) == 白三三 || (player) == 开门送温暖
    $stoppfm
    // 关闭所有起手触发
    @off 明玉夺魄
    setting auto_pfm 0
    ($id) = {r(player)}?
    fight (id)
    @until (:combating) == true
    @await 1000
    @perform unarmed.duo
    @until (:combating) == false
    $startpfm
    // 开启相关触发
    @on 明玉夺魄
    @renew
    $zdwk