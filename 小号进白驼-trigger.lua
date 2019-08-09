//raid.flow
//四区白三三
//配合 大号带白驼 流程使用
//新提示信息
//关键字：已进入组队副本【白驼山】
stopstate
cr baituo/damen 2 0
@await 1000
go north[4]
@until {r欧阳锋的尸体}? != null
select {r欧阳锋的尸体}?
get all from {r欧阳锋的尸体}?
@await 500
go south
@until {r欧阳克的尸体}? != null
select {r欧阳克的尸体}?
get all from {r欧阳克的尸体}?
@await 1000
cr;cr over