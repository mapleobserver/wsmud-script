// raid.flow
// 一键日常+一键追捕扫荡+一键请安+买吃养精丹（绿10个，绿以上只吃7个）
// 导入后第一次运行之前，先自己手动吃几个蓝养精丹，免得精力不够小树林
// 四区 白三三

stopstate
$wait 500

// 一键日常
@js WG.oneKeyDaily()
//$wait 120000
@tip 你获得了五十元宝

// 一键扫荡
@js WG.oneKeySD()
$wait 60000

@js WG.oneKeyQA()
$wait 10000

// 买吃养精丹
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
@await 1000
[if] {b养精丹}? != null
    [if] {b养精丹#}? <= 7
        use {b养精丹}[{b养精丹#}]
    [else]
        use {b养精丹}[7]

// 挖矿
$wait 2000
$zdwk