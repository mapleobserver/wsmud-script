// raid.flow
// 武道自定义参数
[if] (WudaoWaitCDLevel) == null
    ($WudaoWaitCDLevel) = 30
[if] (WudaoManualMaxLevel) == null
    ($WudaoManualMaxLevel) = 84
[if] (WudaoWaitCDExp) == null
    ($WudaoWaitCDExp) = ^none
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
#input ($ZBWaitCD) = 从此次追捕开始，等待技能冷却,(ZBWaitCD)
#input ($ZBcdskill) = 需要cd的技能使用英文逗号隔开或^不需要cd的技能,(ZBcdskill)
#input ($ZBMax) = 最高连续追捕数达到后自动放弃,(ZBMax)
#select ($DieToReset) = 死亡自动重置,已开启|已关闭,已关闭
// 副本方式
#select ($FbName) = 副本,温府|恒山|衡山|嵩山|桃花岛|星宿海|冰火岛|移花宫|燕子坞|黑木崖|缥缈峰|光明顶|天龙寺|血刀门|古墓派|,(FbName)
#select ($FbDiff) = 副本难度,普通|困难,普通
#select ($FbWay) = 刷本方式（选自动前先确定插件支持）,自动|扫荡,扫荡
// 日常结束后动作
[if](ARC_action) == null
    ($ARC_action) = $zdwk
#input ($ARC_action) = 日常结束后行为,(ARC_action)
#config
// 停止自动喜宴和boss，记录获取物品
<-stopSSAuto
<-recordGains
// 停止当前状态，退出组队，清理背包
stopstate
$wait 500
stopstate
$wait 500
team out (:id)
$wait 1000
@tidyBag
$wait 10000
// 师门
$sm
@await 1000
@tip 你先去休息一下吧
// 请安
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
// 战前准备 套装、技能、触发器、自动出招，可自行修改。
stopstate
@cd
$eq 1
$wait 5000
// 武道塔具体流程
// 通过@call调用时的武道塔参数。
[if] (arg0) != null
    ($WudaoWaitCDLevel) = (arg0)
[if] (arg1) != null
    ($WudaoManualMaxLevel) = (arg1)
[if] (arg2) != null
    ($WudaoWaitCDExp) = (arg2)
stopstate
@renew
jh fam 9 start
select {r守门人};ask1 {r守门人}
@tip 从头开始挑战|已经重置
[while] true
    jh fam 9 start
    @tip 你目前可以直接去挑战第($level)层
    [if] (level) >= (WudaoManualMaxLevel)
        [break]
    [if] (level) >= (WudaoWaitCDLevel)
        @cd (WudaoWaitCDExp)
    go enter;go up
    kill {r武道塔守护者}
    @until {r武道塔守护者}? == null || (:combating) == true
    @until {r武道塔守护者}? == null || (:combating) == false
    [if] (:hpPer) < 0.8 || (:mpPer) < 0.5
        @renew
    @liaoshang
($num)=0
jh fam 9 start
select {r守门人};ask2 {r守门人}
@tip 用不着快速挑战了|不用快速挑战|快速挑战需要($num)张扫荡符
[if] (num) > 0
    shop 0 (num)
select {r守门人};ask2 {r守门人};ask3 {r守门人}
@tip 你的扫荡符不够|挑战完成|用不着快速挑战了|不用快速挑战
$wait 3000
@tidyBag
$wait 10000
// 追捕具体流程
stopstate
//追捕前准备
@cd
@cmdDelay 1000
@toolbar tasks
@task 追杀逃犯：目前完成($currentN)/20个，共连续完成($comboN)个|追杀逃犯：($empty)目前完成($currentN)/20个，共连续完成($comboN)个

[while](currentN) < 20
    @renew
    @until (:status xuruo) == false
    
    [if](comboN)>=(ZBMax)
        $to 扬州城-衙门正厅
        ask1 {程药发}
        ask2 {程药发}
        ($comboN) = 0
    [if](comboN)>=(ZBWaitCD)
        @cd (ZBcdskill)

    $to 扬州城-衙门正厅
    ($olddir1) = (dir1)
    ($olddir2) = (dir2)
    @print (olddir1)
    ($escapee) = null
    
    [while] (escapee) == null
        ask1 {程药发}
        @toolbar tasks
        @task 追杀逃犯：($escapee)，据说最近在($dir1)-($dir2)出现过，你还有($time)去寻找他，目前完成($currentN)/20个，共连续完成($comboN)个。|追杀逃犯：目前完成($currentN)/20个，共连续完成($comboN)个

    [if](olddir1) != (dir1) && (olddir2) != (dir2)
        ($start_h) = (:hour)
        ($start_m) = (:minute)

    $wait 500

    [while] {(escapee)}? == null
        <---
            @cmdDelay 1000
            [if] {(escapee)}? != null
                ($type1) = null
                kill {(escapee)}

                @until {(escapee)的尸体}? != null | {r(escapee)}? == null | (:combating) == false
                @tip 你的追捕任务完成了，目前完成($currentN)/20个，已连续完成($comboN)个。|你($type1)死($type2)|你要攻击谁
                relive
                [if](type1)!= null
                    relive
                    [if](DieToReset) == 已开启
                        $to 扬州城-衙门正厅
                        ask2 {程药发}
                [break]
            [if] (DieToReset) == 已关闭
                ($tb)=(start_h)*60-(:hour)*60-(start_m)+(:minute)
                //@print 已耗时(tb)
                [if](tb)>10
                    [break]                    
        --->
        @cmdDelay 300
        $to (dir1)-(dir2)
        [if] (dir1) == 武当派
            [if](dir2) == 林间小径
                go south
            jh fam 1 start
            go north
            go south;go west
            go west
            go east;go northup
            go north
            go east
            go west;go west
            go northup
            go northup
            go northup
            go north
            go north
            go north
            go north
            go north
            go north
        [else if] (dir1) == 华山派
            jh fam 3 start
            go eastup
            go southup
            jumpdown
            go southup
            go south
            go east
            jh fam 3 start
            go westup
            go north
            go east
            go west;go north
            go east
            go west;go north
            go south[3];go west
            go east;go south
            go southup
            go southup
            look bi;break bi;go enter
            go westup
            go westup
            jumpup
        [else if] (dir1) == 少林派
            [if](dir2) == 竹林
                go south
            jh fam 2 start
            go north
            go west
            go east;go east
            go west;go north
            go northup
            go southdown;go northeast
            go northwest
            go southwest
            go northeast;go north
            go east
            go west;go west
            go east;go north
            go east
            go west;go west
            go east;go north
            go west
            go east;go north
            go north    
        [else if] (dir1) == 峨眉派
            [if](dir2) == 走廊
                go north
                go south[2]
                go north;go east[2]
            jh fam 4 start
            go northup
            go east
            go west;go southdown;go west
            go south
            go east
            go east
            go west;go south
            go north;go west;go south
            go north;go west
            go south
            go south
            go north;go north;go west
            go east;go north
            go north
        [else if] (dir1) == 逍遥派
            [if](dir2) == 林间小道
                go west;go north
                go south;go west
                go east;go south
            [else if](dir2) == 木屋
                go south[4]
            [else if](dir2) == 地下石室
                go up
            jh fam 5 start
            go north
            go north
            jh fam 5 start;go east
            go north
            go south;go south
            go south
            jh fam 5 start;go west
            go south
            jh fam 5 start;go south
            go south
            jh fam 5 start;go down
            go down
        [else if] (dir1) == 丐帮
            [if](dir2) == 暗道
                go east
                go east[2]
                go east
            jh fam 6 start
            go down
            go east
            go east
            go east
            go up
            go down;go east
            go east
            go up
@cmdDelay 1000
@renew
@cd
// 副本
[if] (FbName) == 温府
    ($FbCr) = cd/wen/damen
[else if] (FbName) == 恒山
    ($FbCr) = wuyue/hengshan/daziling
[else if] (FbName) == 衡山
    ($FbCr) = wuyue/henshan/hengyang
[else if] (FbName) == 嵩山
    ($FbCr) = wuyue/songshan/taishi
[else if] (FbName) == 桃花岛
    ($FbCr) = taohua/haitan
[else if] (FbName) == 星宿海
    ($FbCr) = xingxiu/xxh6
[else if] (FbName) == 冰火岛
    ($FbCr) = mj/bhd/haibian
[else if] (FbName) == 移花宫
    ($FbCr) = huashan/yihua/shandao
[else if] (FbName) == 燕子坞
    ($FbCr) = murong/anbian
[else if] (FbName) == 黑木崖
    ($FbCr) = heimuya/shangu
[else if] (FbName) == 缥缈峰
    ($FbCr) = lingjiu/shanjiao
[else if] (FbName) == 光明顶
    ($FbCr) = mj/shanmen
[else if] (FbName) == 天龙寺
    ($FbCr) = tianlong/damen
[else if] (FbName) == 血刀门
    ($FbCr) = xuedao/shankou
[else if] (FbName) == 古墓派
    ($FbCr) = gumu/gumukou
[if] (FbDiff) == 普通
    ($FbDiffNum) = 0
[else]
    ($FbDiffNum) = 1
[if] (FbWay) == 扫荡
    //副本-扫荡模式
    [if] {b扫荡符#} < 20
        shop 0 20
    cr (FbCr) (FbDiffNum) 1 10
    $wait 10000
    @tidyBag
    $wait 10000
    cr (FbCr) (FbDiffNum) 1 10
    $wait 10000
    @tidyBag
    $wait 10000
[else if] (FbWay) == 自动
    @js ManagedPerformerCenter.start(`自动副本-(FbName)`, GetDungeonSource("(FbName)").replace(/#.*\n/g,'($_repeat) = 20'))
$wait 5000
//领取签到奖励
taskover signin
$wait 2000
taskover signin
$wait 10000
//日常结束，根据需要调用流程或者挖矿、修炼
recordGains->
stopSSAuto->
$eq 2
@await 6000
// 执行日常结束后动作
(ARC_action)