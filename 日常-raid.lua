//raid.flow
//四区白三三

// 武道自定义参数
[if] (WudaoWaitCDLevel) == null
    ($WudaoWaitCDLevel) = 30
[if] (WudaoManualMaxLevel) == null
    ($WudaoManualMaxLevel) = 84
[if] (WudaoWaitCDExp) == null
    ($WudaoWaitCDExp) = ^none
[if] (WudaoBefore) == null
    ($WudaoBefore) = $eq 1
#input ($WudaoBefore)=打塔前执行命令(用英文;隔开),(WudaoBefore)
#input ($WudaoWaitCDExp)=打塔等待以下技能冷却,(WudaoWaitCDExp)
#input ($WudaoWaitCDLevel)=从此层开始，等待技能冷却,(WudaoWaitCDLevel)
#input ($WudaoManualMaxLevel)=从此层开始快速扫荡,(WudaoManualMaxLevel)

// 追捕自定义参数
[if] (ZBWaitCD) == null
    ($ZBWaitCD) = 15
[if] (ZBMax) == null
    ($ZBMax) = 52
[if] (ZBcdskill) == null
    ($ZBcdskill) = ^none
[if] (ZBBefore) == null
    ($ZBBefore) = $eq 1
#input ($ZBBefore)=追捕前执行命令(用英文;隔开),(ZBBefore)
#input ($ZBWaitCD) = 从此次追捕开始，等待技能冷却,(ZBWaitCD)
#input ($ZBcdskill) = 需要cd的技能使用英文逗号隔开或^不需要cd的技能,(ZBcdskill)
#input ($ZBMax) = 最高连续追捕数达到后自动放弃,(ZBMax)
#select ($DieToReset) = 死亡自动重置,已开启|已关闭,已关闭

// 副本方式
#select ($FBName) = 副本,温府|恒山|青城山(只扫荡)|衡山|嵩山|桃花岛(简单)|桃花岛(困难)|白驼山(组队)|星宿海|冰火岛(简单扫荡)|冰火岛(困难扫荡)|移花宫(简单)|移花宫(困难)|燕子坞(简单)|燕子坞(困难)|燕子坞(偷书)|黑木崖(简单扫荡)|黑木崖(困难扫荡)|缥缈峰(简单扫荡)|缥缈峰(困难扫荡)|光明顶|光明顶(组队)|天龙寺(简单扫荡)|天龙寺(困难扫荡)|血刀门(只扫荡)|古墓派(简单扫荡)|古墓派(困难扫荡)|华山论剑|侠客岛(只扫荡)|净念禅宗(简单扫荡)|净念禅宗(困难扫荡),(FBName)
//#select ($FBDiff) = 副本难度,普通|困难|组队,普通
#select ($FBWay) = 刷本方式（选自动前先确定插件支持）,自动|扫荡,(FBWay)

// 日常结束后动作
[if](RCAfter_action) == null
    ($RCAfter_action) = $zdwk
#input ($RCAfter_action) = 日常结束后命令(用英文;隔开),(RCAfter_action)

#config


//停止，清包
stopstate
@tidyBag
$wait 10000

//师门
$sm
@tip 你先去休息一下吧

//请安
$wait 2000
@js WG.oneKeyQA()
$wait 10000

// 买十个养精丹吃+吃师门的养精丹，蓝养精丹一次最多吃10个，以防太快被游戏强制下线。
stopstate
@await 500
$to 扬州城-药铺
select {r平一指}
list {r平一指}
@dialog
($count) = {b养精丹g#}?
[if] (count) == null
    ($count) = 10
[else]
    ($count) = 10 - (count)
buy (count) {d养精丹g} from {r平一指}
use {养精丹g}[10]
[if] {b养精丹b}? != null
    [if] {b养精丹b#} <= 10
        use {b养精丹b}[{b养精丹b#}]
    [else]
        use {b养精丹b}[10]

//追捕
stopstate
@cd
@print 开始自动追捕
@tidyBag
$wait 10000
(ZBBefore)
$wait 5000
@call 自动追捕
stopstate
$wait 5000

//武道塔
stopstate
@cd
@print 开始自动武道塔
@tidyBag
$wait 10000
(WudaoBefore)
$wait 5000
@call 自动武道塔
stopstate
$wait 5000

//副本
stopstate
[if] (FBName) == 温府
    ($FBCr) = cr cd/wen/damen 0 10
[else if] (FBName) == 恒山
    ($FBCr) = cr wuyue/hengshan/daziling 0 10
[else if] (FBName) == 青城山(只扫荡)
    ($FBCr) = cr wuyue/qingcheng/shanlu 0 10
[else if] (FBName) == 衡山
    ($FBCr) = cr wuyue/henshan/hengyang 0 10
[else if] (FBName) == 嵩山
    ($FBCr) = cr wuyue/songshan/taishi 0 10
[else if] (FBName) == 桃花岛(简单)
    ($FBCr) = cr taohua/haitan 0 10
[else if] (FBName) == 桃花岛(困难)
    ($FBCr) = cr taohua/haitan 1 10
[else if] (FBName) == 星宿海
    ($FBCr) = cr xingxiu/xxh6 0 10
[else if] (FBName) == 冰火岛(简单扫荡)
    ($FBCr) = cr mj/bhd/haibian 0 10
[else if] (FBName) == 冰火岛(困难扫荡)
    ($FBCr) = cr mj/bhd/haibian 1 10
[else if] (FBName) == 移花宫(简单)
    ($FBCr) = cr huashan/yihua/shandao 0 10
[else if] (FBName) == 移花宫(困难)
    ($FBCr) = cr huashan/yihua/shandao 1 10
[else if] (FBName) == 燕子坞(简单)
    ($FBCr) = cr murong/anbian 0 10
[else if] (FBName) == 燕子坞(困难)
    ($FBCr) = cr murong/anbian 1 10
[else if] (FBName) == 黑木崖(简单扫荡)
    ($FBCr) = cr heimuya/shangu 0 10
[else if] (FBName) == 黑木崖(困难扫荡)
    ($FBCr) = cr heimuya/shangu 1 10
[else if] (FBName) == 缥缈峰(简单扫荡)
    ($FBCr) = cr lingjiu/shanjiao 0 10
[else if] (FBName) == 缥缈峰(困难扫荡)
    ($FBCr) = cr lingjiu/shanjiao 1 10
[else if] (FBName) == 光明顶
    ($FBCr) = cr mj/shanmen 0 10
[else if] (FBName) == 天龙寺(简单扫荡)
    ($FBCr) = cr tianlong/damen 0 10
[else if] (FBName) == 天龙寺(困难扫荡)
    ($FBCr) = cr tianlong/damen 1 10
[else if] (FBName) == 血刀门(只扫荡)
    ($FBCr) = cr xuedao/shankou 0 10
[else if] (FBName) == 古墓派(简单扫荡)
    ($FBCr) = cr gumu/gumukou 0 10
[else if] (FBName) == 古墓派(困难扫荡)
    ($FBCr) = cr gumu/gumukou 1 10
[else if] (FBName) == 华山论剑
    ($FBCr) = cr huashan/lunjian/leitaixia 0 10
[else if] (FBName) == 侠客岛(只扫荡)
    ($FBCr) = cr xkd/shimen 0 10
[else if] (FBName) == 净念禅宗(普通扫荡)
    ($FBCr) = cr chanzong/shanmen 0 10
[else if] (FBName) == 净念禅宗(困难扫荡)
    ($FBCr) = cr chanzong/shanmen 1 10
[if] (FBWay) == 扫荡
    //扫荡模式
    [if] (FBName) == 白驼山(组队) || (FBName) == 燕子坞(偷书) || (FBName) == 光明顶(组队)
        @print <hiy>(FBName)</hiy><ord>无法扫荡！</ord>
    [else]
        [if] {b扫荡符#} < 20
            shop 0 20
        <-recordGains
        (FBCr)
        $wait 10000
        @tidyBag
        $wait 10000
        (FBCr)
        $wait 10000
        @tidyBag
        $wait 10000
        recordGains->
[else if] (FBWay) == 自动
    //脚本自动模式
    [if] (FBName) == 温府 || (FBName) == 恒山 || (FBName) == 衡山 || (FBName) == 嵩山 || (FBName) == 桃花岛(简单) || (FBName) == 桃花岛(困难) || (FBName) == 白驼山(组队) || (FBName) == 星宿海 || (FBName) == 移花宫(简单) || (FBName) == 移花宫(困难) || (FBName) == 燕子坞(简单) || (FBName) == 燕子坞(困难) || (FBName) == 燕子坞(偷书) || (FBName) == 光明顶 || (FBName) == 光明顶(组队)
        @js ManagedPerformerCenter.start(`自动副本-(FbName)`, GetDungeonSource("(FbName)").replace(/#.*\n/g,'($_repeat) = 20'))
        @until (:room) == 住房-练功房 || (:room) == 住房-卧室 || (:room) == 扬州城-大门
    [else]
        @print <hiy>(FBName)</hiy><ord>没有自动脚本！</ord>

//领取签到奖励
$wait 5000
stopstate
taskover signin
$wait 2000
taskover signin
$wait 10000

//日常结束后
(RCAfter_action)