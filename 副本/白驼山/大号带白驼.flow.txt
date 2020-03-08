// raid.flow
//四区白三三
//配合 小号进白驼 流程使用
[if] (_DungeonHpThreshold) == null
    ($_DungeonHpThreshold) = 50
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
($_i) = 0
[while] (_i) < (_repeat)
    team set free_get
    setting auto_get 0
    @renew
    cr baituo/damen 2 0
    go north[4]
    @until {r(FBBTSPlayerName)} != null
    @kill 欧阳锋
    go south
    @until {r(FBBTSPlayerName)} != null
    @kill 欧阳克,白衣少女
    @until {r(FBBTSPlayerName)} == null
    cr;cr over
    $wait 3000
    ($_i) = (_i) + 1
setting auto_get 1
$to 住房-练功房;dazuo
stopSSAuto->