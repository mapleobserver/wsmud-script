// raid.flow
// 四区：白三三
<-stopSSAuto
<-recordGains
[if] (ZBWaitCD) == null
    ($ZBWaitCD) = 15
[if] (ZBcdskill) == null
    ($ZBcdskill) = ^none
[if](AZB_action) == null
    ($AZB_action) = $zdwk
#input ($ZBWaitCD) = 从此次追捕开始，等待技能冷却,(ZBWaitCD)
#input ($ZBcdskill) = 需要cd的技能使用英文逗号隔开或^不需要cd的技能,(ZBcdskill)
#select ($DieToReset) = 死亡自动重置,已开启|已关闭,已关闭
#input ($AZB_action) = 追捕完行为,(AZB_action)
#config
stopstate
@cmdDelay 1000
@toolbar jh
@toolbar tasks
@task 追杀逃犯：目前完成($currentN)/20个，共连续完成($comboN)个|追杀逃犯：($empty)目前完成($currentN)/20个，共连续完成($comboN)个
[while] (currentN) < 20



stopSSAuto->
recordGains->
@cmdDelay 0
@renew
@cd
(AZB_action)