// raid.flow
//四区白三三
//配合 小号进移花 流程使用
[if] (_DungeonHpThreshold) == null
    ($_DungeonHpThreshold) = 90
[if] (_DungeonWaitSkillCD) == null
    ($_DungeonWaitSkillCD) = 打开
[if] (_DungeonBagCleanWay) == null
    ($_DungeonBagCleanWay) = 存仓及售卖
#input ($FBBTSPlayerName) = 小号名字,(FBBTSPlayerName)
//#select ($_DungeonHpThreshold) = 副本内疗伤，当气血低于百分比,100|90|80|70|60|50|40|30|20|10,(_DungeonHpThreshold)
#select ($_DungeonWaitSkillCD) = Boss战前等待技能冷却,打开|关闭,(_DungeonWaitSkillCD)
//#select ($_DungeonBagCleanWay) = 背包清理方案,不清理|售卖|存仓及售卖,(_DungeonBagCleanWay)
#input ($_repeat) = 重复次数,1
#config
//队伍分配改自由拾取、关闭个人自动拾取
<-stopSSAuto
stopstate
<---
($hpPer) = (_DungeonHpThreshold)/100
[if] (:hpPer) < (hpPer)
    @liaoshang
--->
($_i) = 0
[while] (_i) < (_repeat)
    team set free_get
    setting auto_get 0
    @renew
    jh fb 22 start2;cr huashan/yihua/shandao 2 0
    go south[5]
    go south[5]
    go south[5]
    //@until {r(FBBTSPlayerName)} != null
    @kill 花月奴
    go south;go south
    //@until {r(FBBTSPlayerName)} != null
    @kill 移花宫女弟子,移花宫女弟子
    go south
    //@until {r(FBBTSPlayerName)} != null
    @kill 移花宫女弟子,移花宫女弟子
    [if] (_DungeonWaitSkillCD) == 打开
        @cd
    go southeast
    @until {r(FBBTSPlayerName)} != null
    @kill 涟星
    [if] {r邀月}? != null
        @kill 邀月
    ($deadyaoyue) = true
    [if] {邀月的尸体}? == null
        ($deadyaoyue) = false
        [if] (_DungeonWaitSkillCD) == 打开
            @cd
    go northwest;go southwest
    [if] ($deadyaoyue) == false
        @until {r(FBBTSPlayerName)} != null
        @kill 邀月
    look hua
    @tip 你数了下大概有($number)朵花
    go southeast
    @until {r(FBBTSPlayerName)} != null
    look bed;pushstart bed;pushleft bed[(number)]
    pushright bed[8]
    go down;fire;go west
    @until {r(FBBTSPlayerName)} != null
    @kill 花无缺
    look xia;open xia
    @until {r(FBBTSPlayerName)} == null
    cr;cr over
    $wait 3000
    ($_i) = (_i) + 1
setting auto_get 1
$to 住房-练功房;dazuo
stopSSAuto->