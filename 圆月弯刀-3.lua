<-recordGains
<-stopSSAuto
($num) = 0
[while] (num) < 10
    jh fam 9 start
    kill {r守门人}
    @cmdDelay 0
    @until (:living) == false
    relive
    go east
    @cmdDelay 100
    jh fb 13 start1
    cr wuyue/qingcheng/shanlu
    go westup
    go north
    look cao
    tiao cao
    yywd ok
    pa tu
    @await 6000
    answer s2
    @tip 你定心凝神思索这里的诡异景象
    @await 1000
    answer s4
    @tip 一个梳高髻，着羽衣的绝色美人
    @await 1000
    answer s5
    @tip 叫做青青。你来这里做什么？
    @await 1000
    answer s7
    @tip 你告诉我为什么寻死
    @await 1000
    answer s9
    @tip 但是谷里有一棵忘忧草
    @await 1000
    answer s10
    @until (:room)==忧愁谷-谷底
    @tip 鹰一声长鸣，流星般飞去，瞬时间就消失在远方的黑暗中
    answer s1
    cai cao
    @tip 果然是这把刀，老天有眼，总算叫我找到了这把刀
    @await 500
    answer s3
    [if] (:living) == true
        @tip 青青看了你一眼转身跟了过去
        go west
        @await 600000
        go north
        @await 3000
        ($Cs) = 0
        [if] (Cs) = 0
            answer s2
            go south
            go south
            @await 3000
            answer s1
        [else]
//            [if] (Cs) = 1
                answer s1
                go south
                go south
                go south
                go south
                ofb
                ofb ok
//            [else]
//                
        ($Cs) = (Cs) + 1
    [else]
        relive
    ($num) = (num) + 1
stopSSAuto->
recordGains->
//@call 回豪宅打坐