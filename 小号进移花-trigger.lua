//raid.flow
//四区白三三
//配合 大号带移花 流程使用
//新提示信息
//关键字：已进入组队副本【移花宫】
@js ($FBDHPlayer) = '(text)'.match('你的队友([^%]+)已进入组队副本')[1]
<-stopSSAuto
stopstate
<---
[if] (:hpPer) < 0.9
    @liaoshang
--->
cr huashan/yihua/shandao 2 0
go south[5]
go south[5]
go south[5]
@wait 10000
//@until {r花月奴}? == null
go south;go south
//@until {r移花宫女弟子}? == null
@wait 10000
go south
//@until {r移花宫女弟子}? == null
@wait 10000
go southeast
@until {r涟星的尸体}? != null
select {r涟星的尸体}?
get all from {r涟星的尸体}?
@await 500
[if] {r邀月}? != null
    @until {r邀月的尸体}? != null
    select {r邀月的尸体}?
    get all from {r邀月的尸体}?
    @await 500
@until {r(FBDHPlayer)}? == null
@wait 5000
go southwest
@wait 1000
@until {r(FBDHPlayer)}? != null
@until {r(FBDHPlayer)}? == null
@wait 1000
go down;go west
@until {r花无缺的尸体}? != null
select {r花无缺的尸体}?
get all from {r花无缺的尸体}?
@await 500
look xia;open xia
@await 1000
cr;cr over
stopSSAuto->