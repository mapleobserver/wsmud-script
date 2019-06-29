// raid.flow

// 停止自动喜宴和boss，记录获取物品
<-stopSSAuto
<-recordGains

// 武道自定义参数
[if] (WudaoWaitCDLevel) == null
    ($WudaoWaitCDLevel) = 30
[if] (WudaoWaitCDExp) == null
    ($WudaoWaitCDExp) = ^none
[if] (WudaoManualMaxLevel) == null
    ($WudaoManualMaxLevel) = 84
#input ($WudaoWaitCDLevel)=从此层开始，等待技能冷却,(WudaoWaitCDLevel)
#input ($WudaoWaitCDExp)=等待以下技能冷却,(WudaoWaitCDExp)
#input ($WudaoManualMaxLevel)=从此层开始扫荡符扫荡,(WudaoManualMaxLevel)
#config

// 停止当前状态，清理背包
stopstate
$wait 1000
@tidyBag
$wait 10000

// 师门
$sm
//$wait 500
//[if] (:room) == 杂货铺
//    $sm
@tip 你先去休息一下吧

// 请安
$wait 2000
@js WG.oneKeyQA()
$wait 15000

// 买十个养精丹吃+吃师门的养精丹，蓝养精丹一次最多吃30，以防太快被游戏强制下线。
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
[if]{b养精丹}? != null
    use {b养精丹}[{b养精丹#}]

//战前准备 套装、技能、触发器、自动出招，可自行修改。
stopstate
@cd
$eq 1
$wait 5000