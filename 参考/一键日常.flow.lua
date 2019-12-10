//raid.flow
//四区白三三
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

//买十个养精丹吃+吃师门的养精丹
@call 买吃养精

//战前准备 套装、技能、触发器、自动出招
$eq 1
@await 6000

//追捕
@call 自动追捕
stopstate

//武道塔
$eq 1
@await 4000
@call 自动武道
stopstate
@tidyBag
$wait 10000
stopstate
$eq 1
@await 6000

//副本-扫荡
stopstate
shop 0 20
cr baituo/damen 0 10
$wait 10000
@tidyBag
$wait 10000
cr baituo/damen 0 10
$wait 10000
@tidyBag
$wait 10000

//副本-流程
//($name) = 白驼山(组队)
//@js ManagedPerformerCenter.start(`自动副本-(name)`, GetDungeonSource("(name)").replace(/#.*\n/g,'($_repeat) = 20'))
//@until (:room) == 住房-练功房

//领取签到奖励
stopstate
taskover signin
$wait 2000
taskover signin
$wait 10000
//日常结束
$eq 2
@await 6000
dazuo