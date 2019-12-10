//raid.flow
//武师小号刷门派蓝怪
//四区白三三
[if] (MPBefore) == null
    ($MPBefore) = $eq 1
[if](MPAfter) == null
    ($MPAfter) = $zdwk
#input ($MPBefore)=刷蓝前执行命令(用英文;隔开),(MPBefore)
#input ($MPAfter) =结束后命令(用英文;隔开),(MPAfter)
#config
<-stopSSAuto
<-recordGains
stopstate
@await 500
(MPBefore)
@await 4000
@renew
@cd
($mpzname) = 丐帮
<---
[if] (:hpPer) < 0.8
    @liaoshang
[if] (:mpPer) < 0.5
    @dazuo
@await 100
[while] true
    @await 100
    ($now) = (:minute)
    [if] (now) > 30
        recordGains->
        stopSSAuto->
        @tidyBag
        @renew
        (MPAfter)
        [exit]
    [if] (mpzname) == 峨眉
        ($mpc) = {r峨眉派第五代弟子}?
    [else if] (mpzname) == 丐帮
        ($mpc) = {r丐帮七袋弟子}?
    [else if] (mpzname) == 华山
        ($mpc) = {r华山派第十五代弟子}?
    [else if] (mpzname) == 武当
        ($mpc) = {r武当派第三代弟子}?
    [else if] (mpzname) == 逍遥
        ($mpc) = {r逍遥派第三代弟子}?
    [else if] (mpzname) == 少林
        ($mpc) = {r少林派第四十代弟子}?
    [if] (mpc) != null && (:maxHp (mpc)) == 40000
        kill (mpc)
        @until (:combating) == false && (:free) == true
    [else]
        [break]
--->
[while] true
    @cmdDelay 500
    //丐帮
    ($mpzname) = 丐帮
    jh fam 6 start
    go down
    go east
    go east
    go east
    go up
    go down;go east
    go east
    go up
    //峨眉派
    ($mpzname) = 峨眉
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
    //华山派
    ($mpzname) = 华山
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
    //逍遥派
    ($mpzname) = 逍遥
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
    //少林派
    ($mpzname) = 少林
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
    //武当派
    ($mpzname) = 武当
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
(MPAfter)