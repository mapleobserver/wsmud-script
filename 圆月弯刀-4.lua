@cmdDelay 0
@print  ***************************************
@print   
@print   结婚线的触发目前推断为年龄判定
@print   约20-40岁之间才会触发       
@print   除此之外只能触发残页或者武器剧情 
@print                                      
@print  ***************************************
#select ($method) = 选择剧情,残页|武器|结婚,(method)
#config
@print  ***************************************
@print   
@print      请确认当前装备剑武器且血量为1点   
@print          确认后进入青城山副本          
@print                                        
@print  ***************************************
@until (:room) == 青城山-青城山路(副本区域)
go westup
go north
tian cao
yywd ok
pa tu
@tip 神界就在前方，只要伸手就到了.....
    answer s2
@tip 神界就在前方，不要管那么多了.....
    answer s4
@tip 你是人是鬼？
    answer s5
@tip 不要阻止
    answer s7
@tip 我不是为了寻死，只是觉得有些诡异...
    answer s9
@tip 你带我去看看吧...
    answer s10
@tip 没有我带路你是走不进去的
@cmdDelay 1000
[while] true
    [if] (:room) == 忧愁谷-谷底
        [break]
    @tip 青青往($distance)方走去。
    [if] (distance) == 东
        go east
    [if] (distance) == 南
        go south
    [if] (distance) == 西
        go west
    [if] (distance) == 北
        go north
@cmdDelay 0
@tip 瞬时间就消失在远方的黑暗中
    answer s1
    cai cao
@tip 挡住
    answer s3
@tip 青青看了你一眼转身跟了过去。
    go west
    @wait 600000
    go north
[if] (method) == 残页
    @print ***************************************
    @print 
    @print  此处选告辞...
    @print  获得5张残页（一天限一次）
    @print 
    @print ***************************************
[if] (method) == 武器
    @print ***************************************
    @print 
    @print  此处选青青呢...
    @print  然后向下两格
    @print  点后会有期...
    @print  获得小楼一夜听春雨（一天限一次）
    @print 
    @print ***************************************
[if] (method) == 结婚
    @print ***************************************
    @print 
    @print  结婚线需要手动
    @print  放弃后可以拿武器
    @print  私奔需要5忘忧草
    @print  和10醉仙酿
    @print 
    @print ***************************************