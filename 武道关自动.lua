// raid.flow
// 新提示信息
// 关键字：你目前可以直接去挑战
[if] (:room) == 武道塔-入口
    @js ($wdFloor) = "(text))".match("你目前可以直接去挑战第([^%]+)层")[1]
    [if] (wdFloor) >69 && (wdFloor) < 80
        @print 第 (wdFloor) 层，关闭自动攻击
        $stoppfm
    [else if] (wdFloor) > 79
        @print 第 (wdFloor) 层，开启自动攻击
        $startpfm