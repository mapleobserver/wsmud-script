// raid.flow
<-stopSSAuto
<-recordGains
[if] (WudaoWaitCDLevel) == null
    ($WudaoWaitCDLevel) = 75
[if] (WudaoWaitCDExp) == null
    ($WudaoWaitCDExp) = ^none
[if] (WudaoManualMaxLevel) == null
    ($WudaoManualMaxLevel) = 84
#input ($WudaoWaitCDLevel)=从此层开始，等待技能冷却,(WudaoWaitCDLevel)
#input ($WudaoWaitCDExp)=等待以下技能冷却,(WudaoWaitCDExp)
#input ($WudaoManualMaxLevel)=从此层开始扫荡符扫荡,(WudaoManualMaxLevel)
#config

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
recordGains->
stopSSAuto->
stopstate
@tidyBag
$to 住房-练功房
dazuo