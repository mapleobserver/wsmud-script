// raid.flow
// 一键学习
// 武馆需要先交学费，其他门派自动拜师
// 基于@andyfos的版本修改
// 四区白三三
[if] (Sf) == null
   ($Sf) = 逍遥子

#select ($Sf) = 师傅姓名,谷虚道长|宋远桥|张三丰|清乐比丘|道绝禅师|慧合尊者|澄净|玄难|高根明|岳不群|封不平|风清扬|苏梦清|静心|周芷若|灭绝|薛慕华|苏星河|逍遥子|左全|简长老|鲁有脚|洪七公|何小二|李四|雾中楼|武馆教习,(Sf)
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

[if] (Sf) == 谷虚道长||(Sf) == 宋远桥
    ($Xxdd) = 武当派-三清殿
[if] (Sf) == 张三丰
    ($Xxdd) = 武当派-后山小院
[if] (Sf) == 清乐比丘
    ($Xxdd) = 少林派-广场
[if] (Sf) == 道绝禅师
    ($Xxdd) = 少林派-天王殿
[if] (Sf) == 慧合尊者
    ($Xxdd) = 少林派-般若堂
[if] (Sf) == 澄净
    ($Xxdd) = 少林派-罗汉堂
[if] (Sf) == 玄难
    ($Xxdd) = 少林派-方丈楼
[if] (Sf) == 高根明
    ($Xxdd) = 华山派-镇岳宫
[if] (Sf) == 岳不群
    ($Xxdd) = 华山派-客厅
[if] (Sf) == 封不平
    ($Xxdd) = 华山派-林间小屋
[if] (Sf) == 风清扬
    ($Xxdd) = 华山派-落雁峰
[if] (Sf) == 苏梦清
    ($Xxdd) = 峨眉派-庙门
[if] (Sf) == 静心
    ($Xxdd) = 峨眉派-大殿
[if] (Sf) == 周芷若
    ($Xxdd) = 峨眉派-小屋
[if] (Sf) == 灭绝
    ($Xxdd) = 峨眉派-清修洞
[if] (Sf) == 薛慕华
    ($Xxdd) = 逍遥派-木屋
[if] (Sf) == 苏星河
    ($Xxdd) = 逍遥派-青草坪
[if] (Sf) == 逍遥子
    ($Xxdd) = 逍遥派-地下石室
[if] (Sf) == 左全
    ($Xxdd) = 丐帮-树洞下
[if] (Sf) == 简长老
    ($Xxdd) = 丐帮-土地庙
[if] (Sf) == 鲁有脚
    ($Xxdd) = 丐帮-林间小屋
[if] (Sf) == 洪七公
    ($Xxdd) = 丐帮-林间小屋
[if] (Sf) == 何小二
    ($Xxdd) = 杀手楼-大厅
[if] (Sf) == 李四
    ($Xxdd) = 杀手楼-银楼
[if] (Sf) == 雾中楼
    ($Xxdd) = 杀手楼-书房
[if] (Sf) == 武馆教习
    ($Xxdd) = 扬州城-扬州武馆

stopstate
$to (Xxdd)
[if] (Sf) == 鲁有脚
    go down
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
    [else if] (:hpPer) < 0.8
        stopstate
        @liaoshang
    [else if] (:mpPer) < 0.8
        stopstate
        @dazuo
    [if] (:room) != (Xxdd)
        stopstate
        @wait 300
        $to (Xxdd)
        [if] (Sf) == 鲁有脚
            go down
        @wait 300
    [if] {r(Sf)}? != null && (:state) != 学习
        stopstate
        bai {r(Sf)}?
        @wait 300
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
    ($Lastcmd) = blade
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
    [if] (nl) == 的内力
        ($ts) == 由于你的内力不够，部分技能未能学习
    [if] (nl) == 说道：你对本门的贡献还
        ($ts2) == 由于你的门贡不够，部分技能未能学习
    ($Lastcmd) = throwing
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
    [if] (nl) == 的内力
        ($ts) == 由于你的内力不够，部分技能未能学习
    [if] (nl) == 说道：你对本门的贡献还
        ($ts2) == 由于你的门贡不够，部分技能未能学习
    ($Lastcmd) = club
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
    [if] (nl) == 的内力
        ($ts) == 由于你的内力不够，部分技能未能学习
    [if] (nl) == 说道：你对本门的贡献还
        ($ts2) == 由于你的门贡不够，部分技能未能学习
    ($Lastcmd) = whip
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    xue (Lastcmd) from {r(Sf)}?
    @wait 300
    @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
    [if] (nl) == 的内力
        ($ts) == 由于你的内力不够，部分技能未能学习
    [if] (nl) == 说道：你对本门的贡献还
        ($ts2) == 由于你的门贡不够，部分技能未能学习
    ($Lastcmd) = staff
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

    [if] (Hzmp) == 武当
        ($Lastcmd) = taijijian
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = taijishengong
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = taijiquan
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = tiyunzong
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习

    [if] (Hzmp) == 少林
        ($Lastcmd) = yijinjing
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = yizhichan
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = ranmudao
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = shaolinshenfa
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习

    [if] (Hzmp) == 华山
        ($Lastcmd) = kuangfengkuaijian
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = dugujiujian
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = zixiashengong
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

    [if] (Hzmp) == 峨眉
        ($Lastcmd) = yitianjianfa
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = linjizhuang
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = jiuyinbaiguzhao
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = zhutianbu
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        [if] (Sf) != 灭绝 && (Sf) != 周芷若
            ($Lastcmd) = huifengjian
            xue (Lastcmd) from {r(Sf)}?
            @wait 300
            xue (Lastcmd) from {r(Sf)}?
            @wait 300
            @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
            [if] (nl) == 的内力
                ($ts) == 由于你的内力不够，部分技能未能学习
            [if] (nl) == 说道：你对本门的贡献还
                ($ts2) == 由于你的门贡不够，部分技能未能学习

    [if] (Hzmp) == 逍遥
        ($Lastcmd) = beimingshengong
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = lingboweibu
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = zhemeishou
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = liuyangzhang
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = xiaowuxianggong
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习


    [if] (Hzmp) == 丐帮
        ($Lastcmd) = xianglongzhang
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = huntianqigong
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = dagoubang
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = xiaoyaoyou
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习


    [if] (Hzmp) == 杀手楼
        ($Lastcmd) = shashouxinfa
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = feidao
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = taxuexunmei
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = mantianhuayu
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = shashengjue
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        xue (Lastcmd) from {r(Sf)}?
        @wait 300
        @tip 讲解总是无法领会|这项技能你的程度已经不输你师父|你的潜能不够|不会这个技能|你($nl)不够
        [if] (nl) == 的内力
            ($ts) == 由于你的内力不够，部分技能未能学习
        [if] (nl) == 说道：你对本门的贡献还
            ($ts2) == 由于你的门贡不够，部分技能未能学习
        ($Lastcmd) = chuanxinzhang
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
