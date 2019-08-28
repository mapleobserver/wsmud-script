//raid.flow
//新提示信息：你觉得你的经脉充盈，已经没有办法再增加内力了
[if] (:room) == 古墓派-卧室(副本区域)
    stopstate
    cr;cr over
    $eq 2
    $wait 6000
    dazuo