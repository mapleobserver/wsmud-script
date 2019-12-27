// raid.flow
// 四区白三三
// 可选择残血状态增加攻击力，适用于九阴血刀。
<-stopSSAuto
<-recordGains
[if] (EscortHpThreshold) == null
    ($EscortHpThreshold) = 90
[if] (EscortMpThreshold) == null
    ($EscortMpThreshold) = 70
[if] (EscortTangshi) == null
    ($EscortTangshi) = 不使用
[if] (EscortWaitCDExp) == null
    ($EscortWaitCDExp) = ^none
[if] (EscortWeaponID) == null
    ($EscortWeaponID) = ^none
[if] (wmTime) == null
    ($wmTime) = 10000
#select ($EscortHpThreshold) = 疗伤，当气血低于百分比,100|90|80|70|60|50|40|30|20|10,(EscortHpThreshold)
#select ($EscortMpThreshold) = 打坐，当内力低于百分比,100|90|80|70|60|50|40|30|20|10,(EscortMpThreshold)
#select ($EscortTangshi) = 唐诗剑法,使用|不使用,(EscortTangshi)
#select ($EscortXuedao) = 残血使用血刀九阴(不自动疗伤),打开|关闭,(EscortXuedao)
#input ($EscortWaitCDExp) = 等待CD的技能sid,(EscortWaitCDExp)
#input ($EscortWeaponID) = 切换躺尸武器sid,(EscortWeaponID)
#input ($repeat) = 重复次数,1
#config
stopstate
@tidyBag
($hpPer) = (EscortHpThreshold)/100
($mpPer) = (EscortMpThreshold)/100
($jianfa) = (:kf_jian)
($weapon) = (:eq0)
($numJF) = 0
($num) = 0
[while] (num) < (repeat)
    @renew
    @wait 2000
    jh fam 0 start;go west[2];go south[2]
    select {林震南};biao {r林震南}
    // 确定已接到任务
    [while] true
        ($go) = null
        ($go1) = null
        task yunbiao {r林震南} start ok
        @tip 客户好像不见了|你现在就($go)吧|你精($finish)不足|如果你($go1)按时送到
        [if] (go) == 出发
            [break]
        [if] (go1) == 不能把镖银
            task yunbiao {r林震南} begin
            [break]
    [if] (finish) != null
        [break]
    // 不断向东
    [while] true
        [if] (:hpPer) < (hpPer) && (EscortXuedao) == 关闭
            @liaoshang
        [if] (:mpPer) < (mpPer)
            @dazuo
        [if] (EscortTangshi) == 使用
            cha none;enable sword tangshijianfa;eq (EscortWeaponID)
            @wait 3000
            @cd sword.wu
        @cd (EscortWaitCDExp)
        @until (:status xuruo) == false
        [if] (EscortTangshi) == 使用
            go east;$waitpfm sword.wu
        [else]
            [if] (EscortXuedao) == 打开
                enable force none;enable force jiuyinshengong
            go east
            @wait 1000
        [if] (:room) == 运镖-青石大道
            [if] (EscortTangshi) == 使用
                @cd sword.wu
                cha none;enable sword (jianfa);eq (weapon)
                @wait 3000
                @cd
                kill {r蒙面大盗}?
            @until {r蒙面大盗}? == null || (:combating) == true || (:living) == false
            @until {r蒙面大盗}? == null || (:combating) == false || (:living) == false
            [if] (:living) == true
                ($numJF) = (numJF) + 1
                @print 已打死 (numJF) 个劫匪
                [continue]
            [if] (:living) == false
                relive
                @renew
                jh fam 0 start;go west[2];go south[2]
                select {林震南};biao {r林震南}
                task yunbiao {r林震南} begin
        [else]
            @tip 你推着镖银风尘仆仆地来到($map)，只要把镖银交给($name)就完成了。
            select {(name)};task yunbiao {(name)} give
            [break]
    ($num) = (num) + 1
    ($numJF) = 0
recordGains->
stopSSAuto->
enable sword (jianfa);eq (weapon)
@renew
$to 住房-练功房;dazuo