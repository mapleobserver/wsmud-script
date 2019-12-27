//raid.flow
//困难缥缈偷渡，可选凌波或者神行，背人后比试易直非开凌波或神行过桥，童姥下来后杀李秋水再杀童姥，提高不老爆率。
//四区白三三
[if] (Skill_Dodge) == null
    ($Skill_Dodge) = 凌波
[if] (_DungeonHpThreshold) == null
    ($_DungeonHpThreshold) = 50
[if] (_DungeonWaitSkillCD) == null
    ($_DungeonWaitSkillCD) = 打开
[if] (_DungeonBagCleanWay) == null
    ($_DungeonBagCleanWay) = 存仓及售卖
#select ($Skill_Dodge) = 使用轻功,凌波|神行,(Skill_Dodge)
#select ($_DungeonHpThreshold) = 副本内疗伤，当气血低于百分比,100|90|80|70|60|50|40|30|20|10,(_DungeonHpThreshold)
#select ($_DungeonWaitSkillCD) = Boss战前等待技能冷却,打开|关闭,(_DungeonWaitSkillCD)
#select ($_DungeonBagCleanWay) = 背包清理方案,不清理|售卖|存仓及售卖,(_DungeonBagCleanWay)
#input ($_repeat) = 重复次数,1
#config
[if] (arg0) != null
    ($_DungeonHpThreshold) = (arg0)
[if] (arg1) != null
    ($_DungeonWaitSkillCD) = (arg1)
[if] (arg2) != null
    ($_DungeonBagCleanWay) = (arg2)
[if] (arg3) != null
    ($_repeat) = (arg3)
<-stopSSAuto
stopstate
[if] (Skill_Dodge) == 凌波
    ($skilldodge) = dodge.lingbo
[else if] (Skill_Dodge) == 神行
    ($skilldodge) = dodge.chan
<---
($hpPer) = (_DungeonHpThreshold)/100
[if] (:hpPer) < (hpPer)
    @liaoshang
--->
<-recordGains
($_i) = 0
[while] (_i) < (_repeat)
    @renew
    [if] (_DungeonBagCleanWay) == 售卖
        @cleanBag
    [else if] (_DungeonBagCleanWay) == 存仓及售卖
        @tidyBag
    //进副本
    jh fb 25 start2
    cr lingjiu/shanjiao 1 0
    go northup
    @kill 乌老大,不平道人
    go northup
    @kill 卓不凡
    @await 1000
    go southdown
    jiu {r女童}
    go southdown
    @liaoshang
    //等待所有技能冷却，或者只等待凌波神行冷却
    [if] (_DungeonWaitSkillCD) == 打开
        @cd
    [else]
        @cd (skilldodge)
    //比试易直非过桥
    $stoppfm
    fight {r易直非};$waitpfm (skilldodge);go northup[3]
    zou tiesuo
    $startpfm
    @until (:status tong) == false || {r童姥} != null
    @kill 李秋水
    @until {r李秋水的尸体}? != null
    [if] (_DungeonWaitSkillCD) == 打开
        @cd
    @kill 童姥
    go northup;go north
    @kill 余婆婆
    go north;go north;go west
    @kill 竹剑
    go east;go east
    @kill 梅剑
    go west;go north;go west
    @kill 菊剑
    go east;go east
    @kill 兰剑
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