// raid.flow
[if] (Sf) == null
   ($Sf) = 高根明

#select ($Sf) = 师傅姓名,武馆教习|高根明|岳不群,(Sf)
#select ($Xsm) = 学习何种技能,基本技能|门派技能|两者皆学,两者皆学
#config

[if] (Sf) == 谷虚道长||(Sf) == 宋远桥||(Sf) == 张三丰
    ($Hzmp) = 武当
[if] (Sf) == 清乐比丘||(Sf) == 道绝禅师||(Sf) == 慧合尊者||(Sf) == 澄净||(Sf) == 玄难
    ($Hzmp) = 少林
[if] (Sf) == 高根明||(Sf) == 岳不群||(Sf) == 封不平||(Sf) == 风清扬
    ($Hzmp) = 华山
[if] (Sf) == 苏梦清||(Sf) == 静心||(Sf) == 周芷若||(Sf) == 灭绝
    ($Hzmp) = 峨眉
[if] (Sf) == 薛慕华||(Sf) == 苏星河||(Sf) == 逍遥子
    ($Hzmp) = 逍遥
[if] (Sf) == 左全||(Sf) == 简长老||(Sf) == 鲁有脚||(Sf) == 洪七公
    ($Hzmp) = 丐帮
[if] (Sf) == 何小二||(Sf) == 李四||(Sf) == 雾中楼
    ($Hzmp) = 杀手楼
[if] (Sf) == 武馆教习
    ($Hzmp) = 武馆

[if] (Sf) == 高根明
    ($Xxdd) = 华山派-镇岳宫
[if] (Sf) == 岳不群
    ($Xxdd) = 华山派-客厅
[if] (Sf) == 武馆教习
    ($Xxdd) = 扬州城-扬州武馆

stopstate
$to (Xxdd)
@wait 300
select {r(Sf)}?
@wait 300
@liaoshang
@dazuo

<===
[while] true
    [if] (:living) != true
        relive
        @renew
    [if] (:room) != (Xxdd)
        stopstate
        @wait 300
        $to (Xxdd)
        [if] (Sf) == 鲁有脚
            go down
        @wait 300
    [if] {r(Sf)}? != null && (:state) != 学习
        stopstate
        select {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
    @wait 60000
===>


[if] (Xsm) == 基本技能 || (Xsm) == 两者皆学
    ($Lastcmd) = force
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
    [if] (nl) == 的内力
        ($ts) == 由于你的内力不够，部分技能未能学习
    [if] (nl) == 说道：你对本门的贡献还
        ($ts2) == 由于你的门贡不够，部分技能未能学习
    ($Lastcmd) = dodge
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
    [if] (nl) == 的内力
        ($ts) == 由于你的内力不够，部分技能未能学习
    [if] (nl) == 说道：你对本门的贡献还
        ($ts2) == 由于你的门贡不够，部分技能未能学习
    ($Lastcmd) = unarmed
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
    [if] (nl) == 的内力
        ($ts) == 由于你的内力不够，部分技能未能学习
    [if] (nl) == 说道：你对本门的贡献还
        ($ts2) == 由于你的门贡不够，部分技能未能学习
    ($Lastcmd) = parry
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
    [if] (nl) == 的内力
        ($ts) == 由于你的内力不够，部分技能未能学习
    [if] (nl) == 说道：你对本门的贡献还
        ($ts2) == 由于你的门贡不够，部分技能未能学习
    ($Lastcmd) = sword
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
    [if] (nl) == 的内力
        ($ts) == 由于你的内力不够，部分技能未能学习
    [if] (nl) == 说道：你对本门的贡献还
        ($ts2) == 由于你的门贡不够，部分技能未能学习
[if] (Xsm) == 门派技能 || (Xsm) == 两者皆学

    [if] (Hzmp) == 华山
        ($Lastcmd) = feiyanhuixiang
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = huashanjianfa
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = huashanxinfa
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = poyuquan
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习

$zdwk

[if] (ts) != null && (ts2) != null
    @js alert('学习已完成\n(ts)\n(ts2)')
[else if] (ts) != null
    @js alert('学习已完成\n(ts)')
[else if] (ts2) != null
    @js alert('学习已完成\n(ts2)')
[else]
    @js alert('学习已完成')

[exit]
