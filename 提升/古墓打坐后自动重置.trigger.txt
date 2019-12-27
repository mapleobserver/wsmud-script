//raid.flow
//新提示信息：你觉得你的经脉充盈，已经没有办法再增加内力了
//古墓打坐后自动退出，换装，练功房重置武道，调用武道进阶流程
@stopSSAuto
[if] (:room) == 古墓派-卧室(副本区域)
    stopstate
    cr;cr over
    $wait 5000
    $usezml 悟装
    $wait 5000
    $to 住房-练功房
    $wait 5000
    lingwu reset
    lingwu reset ok
    @tip 你获得了|没有领悟到任何技能
    $wait 5000
    @call 武道进阶