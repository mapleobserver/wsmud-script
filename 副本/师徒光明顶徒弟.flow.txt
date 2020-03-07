// raid.flow
//四区白三三
//配合 师徒光明顶师父 触发使用
//提前组队，徒弟号为队长
#input ($FBMasterName) = 师父名字,(FBMasterName)
#input ($_repeat) = 重复次数,1
#config
<-stopSSAuto
stopstate
team set free_get
@renew
($_i) = 0
[while] (_i) < (_repeat)
    cr mj/shanmen 2 0
    @tip 你们师徒合力完成一次组队副本
    @await 2000
    cr;cr over
    @await 2000
    ($_i) = (_i) + 1
team out
stopSSAuto->
$zdwk