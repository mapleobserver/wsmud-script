// 扫荡困难移花，售卖副本装备
// 四区白三三
#input ($_repeat) = 重复次数,1
#config
[while] (_repeat) > 0
    [if] (_repeat) >= 10
        cr huashan/yihua/shandao 1 10
    [else]
        cr huashan/yihua/shandao 1 (_repeat)
    @wait 10000
    $to 扬州城-杂货铺
    [while] true
        [if] {b移花宫p#}? != null
            sell 1 {b移花宫p}? to {r杨永福}?
        [else if] {b涟星的冰玉簪y%#}? != null
            sell 1 {b涟星的冰玉簪y%}? to {r杨永福}?
        [else if] {b邀月的手镯y%#}? != null
            sell 1 {b邀月的手镯y%}? to {r杨永福}?
        [else if] {b花无缺的玉佩y%#}? != null
            sell 1 {b花无缺的玉佩y%}? to {r杨永福}?
        [else if] {b碧血照丹青o}? != null
            @print <hiy>碧血已出！</hiy>
            [exit]
        [else]
            [break]
    @tidyBag
    @wait 5000
    ($_repeat) = (_repeat) - 10