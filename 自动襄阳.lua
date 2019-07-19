// raid.flow
// 自动襄阳扫墙
// 自动报名，自动复活，自动扫墙
stopstate
jh fam 8 start
select {r郭靖}
baoming {r郭靖}
$wait 500
go north[4]
@cmdDelay 800
[while] true
    <---
    @js ($roomXY) = '(:room)'.indexOf('襄阳城')
    @js ($roomWM) = '(:room)'.indexOf('武庙')
    [if] (roomXY) == -1
        [if] (roomWM) == -1
            $to 襄阳城-广场
            go north[4]
    [if] {r蒙古}? != null
        stopstate
        kill {r蒙古}?
    @until (:combating) == false
    [if] (:living) != true
        relive
        @renew
        $to 襄阳城-广场
        go north[4]
    [else if] (:hpPer) < 0.5 && (:combating) == false
        stopstate
        @liaoshang
    [else if] (:mpPer) < 0.3 && (:combating) == false
        stopstate
        @dazuo
    --->
    //从北门开始
    go east
    go east
    go east
    go east
    //到达右上
    go south
    go south
    go south
    go south;go south
    go south
    go south
    go south
    go south
    //右下
    go west
    go west
    go west
    go west;go west
    go west
    go west
    go west
    go west
    //左下
    go north
    go north
    go north
    go north;go north
    go north
    go north
    go north
    go north
    //左上
    go east
    go east
    go east
    go east;go east