//raid.flow
//四区白三三
//配合 师徒云梦徒弟 流程使用
//新提示信息
//关键字：已进入组队副本【云梦沼泽】
//提前组队，徒弟号为队长
@stopSSAuto
stopstate
$wait 500
@renew
//进副本
cr cd/yunmeng/senlin 2 0
$wait 500
go east
@kill 巨鳄
go north
@kill 巨鳄,巨鳄
go east
@kill 巨鳄,巨鳄
go west;go north
@kill 巨鳄,巨鳄
look lu;kan lu;go north
@kill 火龙
go north
@kill 火龙
go north
@kill 火龙
go north
@kill 火龙王
cr;cr over
$zdwk
@recoverSSAuto