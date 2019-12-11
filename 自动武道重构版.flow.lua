// raid.flow
// 自动武道重构版，可判断是否需要重置，血量低可设定是否回复（有血刀的可以不回复），由于不需要打一层就回一次武道塔，速度会比早期版本快点。
// 四区：白三三
[if] (WudaoWaitCDLevel) == null
    ($WudaoWaitCDLevel) = 75
[if] (WudaoWaitCDExp) == null
    ($WudaoWaitCDExp) = ^none
[if] (WudaoManualMaxLevel) == null
    ($WudaoManualMaxLevel) = 84
[if] (WudaoRenew) == null
    ($WudaoRenew) = 打开
#input ($WudaoWaitCDLevel)=从此层开始，等待技能冷却,(WudaoWaitCDLevel)
#input ($WudaoWaitCDExp)=等待以下技能冷却,(WudaoWaitCDExp)
#input ($WudaoManualMaxLevel)=从此层开始扫荡符扫荡,(WudaoManualMaxLevel)
#select ($WudaoRenew)=血量低时自动回复,打开|关闭,(WudaoRenew)
#config
<-stopSSAuto
<-recordGains
stopstate
@cmdDelay 500
@renew
jh fam 9 start
@toolbar jh
@toolbar tasks
@task 武道塔可以重置，进度($currentN)/($finalN)，|武道塔已重置，进度($currentN)/($finalN)，
//@print (currentN)/(finalN)
($manualMax) = (WudaoManualMaxLevel) - 1
[if] (currentN) == (finalN)
    select {r守门人};ask1 {r守门人}
    @tip 从头开始挑战|已经重置
go enter
[while] true
    ($type1) = 0
    @await 500
    //@toolbar jh
    @toolbar tasks
    @task 武道塔可以重置，进度($currentN)/($finalN)，|武道塔已重置，进度($currentN)/($finalN)，
    [if] (currentN) >= (manualMax) || (currentN) == (finalN) 
        [break]
    [if] (WudaoRenew) == 打开 && (:hpPer) < 0.8
        @liaoshang
    [if] (:mpPer) < 0.1
        dazuo
        @until (:mpPer) > 0.2
    [if] (currentN) >= (WudaoWaitCDLevel)
        @cd (WudaoWaitCDExp)
    kill {r武道塔守护者}?
    @tip 你的挑战($type1)了|你现在可以进入|不要急|你要攻击谁
    [if] (type1) != 0
        kill {r武道塔守护者}?
    [else]
        go up
($num)=0
jh fam 9 start
select {r守门人};ask2 {r守门人}
@tip 用不着快速挑战了|不用快速挑战|快速挑战需要($num)张扫荡符
[if] (num) > 0
    shop 0 (num)
select {r守门人};ask2 {r守门人};ask3 {r守门人}
@tip 你的扫荡符不够|挑战完成|用不着快速挑战了|不用快速挑战
recordGains->
stopSSAuto->
stopstate
@tidyBag
@renew
$zdwk