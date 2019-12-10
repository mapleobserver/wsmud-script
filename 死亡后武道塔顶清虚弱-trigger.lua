//raid.flow
//触发：已经死亡
//死亡后自动复活，去武道塔100+层打守护者消除虚弱buff，武庙回血
@js ($thisroom) = '(:room)'.indexOf('副本区域')
[if] (thisroom) == -1
    relive;relive
    jh fam 9 start
    go enter;go up
    kill {r武道}
    @until (:combating) == false
    @renew