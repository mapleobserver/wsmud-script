// raid.flow
// 自动武道，可自定义冷却技能、疗伤、快速挑战，判断血刀技能等

[if] (WudaoWaitCDLevel) == null
    ($WudaoWaitCDLevel) = 15
[if] (Wudaoliaoshang) == null
    ($Wudaoliaoshang) = 15
[if] (WudaoWaitCDExp) == null
    ($WudaoWaitCDExp) = ^none
[if] (WudaoManualMaxLevel) == null
    ($WudaoManualMaxLevel) = 84
[if] (HpThreshold) == null
    ($HpThreshold) = 90
[if] (MpThreshold) == null
    ($MpThreshold) = 70
($Blade) = 否
[if] (:kf_dao) == xuedao
    ($Blade) = 是
    @print 判断为血刀使用者
[if] (Restart) == null
    ($Restart) = 是
[if] (Shop) == null
    ($Shop) = 否
[if] (useQuickPass) == null
    ($UseQuickPass) = 否
[if] (Speedwudao) == null
    ($Speedwudao) = 500


#input ($WudaoWaitCDLevel)=从此层开始，等待技能冷却,(WudaoWaitCDLevel)
#input ($Wudaoliaoshang)=从此层开始，开始每层原地疗伤,(Wudaoliaoshang)
#input ($WudaoWaitCDExp)=等待以下技能冷却,(WudaoWaitCDExp)

#input ($Speedwudao)= 操作间隔时间,(Speedwudao)
#select ($Restart) = 是否重置武塔,是|否,(Restart)
#select ($HpThreshold) = 疗伤，当气血低于百分比,100|90|80|70|60|50|40|30|20|10,(HpThreshold)
#select ($MpThreshold) = 打坐，当内力低于百分比,100|90|80|70|60|50|40|30|20|10,(MpThreshold)
#select ($UseQuickPass) =  是否使用扫荡符,是|否,(UseQuickPass)
#select ($Shop) = 是否买扫荡符,是|否,(Shop)
#input ($WudaoManualMaxLevel)=从此层开始扫荡符扫荡,(WudaoManualMaxLevel)
#config
($HpPer) = (HpThreshold)/100
($MpPer) = (MpThreshold)/100
@cmdDelay (Speedwudao)
[if] {b扫荡符}? != null
    ($Sdf) = {b扫荡符#}
    @print 拥有扫荡符{b扫荡符#}个

[if] (arg0) != null
    ($WudaoWaitCDLevel) = (arg0)
[if] (arg1) != null
    ($WudaoManualMaxLevel) = (arg1)
[if] (arg2) != null
    ($WudaoWaitCDExp) = (arg2)
<-stopSSAuto
<-recordGains
stopstate
$eq 1
[if] (:hpPer) < (HpPer) || (:mpPer) < (MpPer)
    [if] (Blade) == 否
        @renew
    [if] (Blade) == 是
        [if] (:hpPer) < 0.05
           @liaoshang
           @tip 你的气血恢复了
           stopstate
        [if] (:mpPer) < 0.30
           @renew
           
[if] (Blade) == 是
    ($force)=(:kf_nei)
    enable force none
    enable force (force)
    
jh fam 9 start
[if] (Restart) == 是
    select {r守门人};ask1 {r守门人}
    @tip 从头开始挑战|已经重置
jh fam 9 start
@tip 你目前可以直接去挑战第($level)层
go enter
    
//记录本次挑战最大未成功的层数，尝试3次，之后停止副本

($maxWDFailLevel) = 0
($wdFailLevel) = 1
[while] true
    //jh fam 9 start
    @print "<hiy>目前楼层 (:room) ,第(wdFailLevel)次尝试，最大楼层(maxWDFailLevel) </hiy>"
    [if] (maxWDFailLevel) == (:room)
        ($wdFailLevel) = (wdFailLevel)+1
    [else]
        ($wdFailLevel) = 1
    ($maxWDFailLevel) = (:room)
    [if] (wdFailLevel) > 2
        @print 目前楼层:(:room),第(wdFailLevel)次重试,超过最大尝试次数,退出
        [break]
    [if] (level) >= (WudaoManualMaxLevel)
        @print 目前楼层:(level)层,去用扫荡符,退出
        [break]
    [if] (level) >= (WudaoWaitCDLevel)
        @cd (WudaoWaitCDExp)
    //go enter;go up
    go up
    kill {r武道塔守护者}
    @until {r武道塔守护者}? == null || (:combating) == true
    @until {r武道塔守护者}? == null || (:combating) == false
    ($level) = (level) + 1
    [if] (:hpPer) < (HpPer) || (:mpPer) < (MpPer)
        [if] (Blade) == 否
            @renew
            jh fam 9 start
            //@tip 你目前可以直接去挑战第($level)层
            go enter
        [if] (Blade) == 是
            [if] (:hpPer) < 0.10
                @to 扬州城-武庙
                @await 500
                liaoshang
                @tip 你的气血恢复了
                stopstate
                jh fam 9 start
                //@tip 你目前可以直接去挑战第($level)层
                go enter
            [if] (:mpPer) < 0.30
                @renew
                jh fam 9 start
                //@tip 你目前可以直接去挑战第($level)层
                go enter
    [if] (level) >= (Wudaoliaoshang) + 1
        $to 扬州城-武庙
        @await 500
        @liaoshang
        jh fam 9 start
        //@tip 你目前可以直接去挑战第($level)层
        go enter

//使用扫荡符逻辑
[if] (UseQuickPass) == 是
    ($num)=0
    jh fam 9 start
    select {r守门人};ask2 {r守门人}
    @tip 用不着快速挑战了|不用快速挑战|快速挑战需要($num)张扫荡符
    [if] (num) > 0
        [if] (Shop) == 是
            [if] (num) > (sdf)
                ($num) = (num)-(sdf)
                shop 0 (num)
    select {r守门人};ask2 {r守门人};ask3 {r守门人}
    @tip 你的扫荡符不够|挑战完成|用不着快速挑战了|不用快速挑战

recordGains->
stopSSAuto->
stopstate;$zdwk