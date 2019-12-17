//raid.flow
//普通古墓，卸下九阴再装上，残血血刀砍杨过拿残页
[if] (_DungeonBagCleanWay) == null
    ($_DungeonBagCleanWay) = 存仓及售卖
#select ($_DungeonBagCleanWay) = 背包清理方案,不清理|售卖|存仓及售卖,(_DungeonBagCleanWay)
#input ($_repeat) = 重复次数,1
#config
<-stopSSAuto
<-recordGains
stopstate
($_i) = 0
[while] (_i) < (_repeat)
    //@renew
    [if] (_DungeonBagCleanWay) == 售卖
        @cleanBag
    [else if] (_DungeonBagCleanWay) == 存仓及售卖
        @tidyBag
//进副本
    jh fb 29 start1
    cr gumu/gumukou 0 0
    go enter;go east
    enable force none;enable force jiuyinshengong
    @cd
    kill {r杨过}?;kill {r杨过}?
    @until {r杨过的尸体}? != null && {r小龙女的尸体}? != null
// 副本结束
    cr;cr over
    ($_i) = (_i) + 1
[if] (_DungeonBagCleanWay) == 售卖
    @cleanBag
[else if] (_DungeonBagCleanWay) == 存仓及售卖
    @tidyBag
$to 住房-练功房;dazuo
recordGains->
stopSSAuto->