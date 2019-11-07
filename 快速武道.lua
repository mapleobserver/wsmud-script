// raid.flow
//快速打武道，不等CD，不疗伤。砍完99层才结束。

<-stopSSAuto
<-recordGains
stopstate
@cmdDelay 500
//@renew
($WDnum)=0
jh fam 9 start
select {r守门人};ask1 {r守门人}
@tip 从头开始挑战|已经重置
go enter
[while] true
    [if] (:room) == 武道塔-第一百层
        [break]
    kill {r武道塔守护者}
    @until {r武道塔守护者}? == null || (:combating) == true
    @until {r武道塔守护者}? == null || (:combating) == false
    $wait 500
    go up
recordGains->
stopSSAuto->
stopstate
@tidyBag
@renew
$zdkw