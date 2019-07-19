// raid.flow
// 门派战时间监控
// 监控公共频道，发言人：玄难|张三丰|岳不群|灭绝|逍遥子|洪七公
// 关键字：格杀勿论
@js ($mpWD) = '(content)'.indexOf('，对武当')
@js ($mpSL) = '(content)'.indexOf('，对少林')
@js ($mpHS) = '(content)'.indexOf('，对华山派')
@js ($mpEM) = '(content)'.indexOf('，对峨眉')
@js ($mpXY) = '(content)'.indexOf('，对逍遥')
@js ($mpGB) = '(content)'.indexOf('，对丐帮')
($start_h) = (:hour)
($start_m) = (:minute)
($start_s) = (:second)
[if] (name) == 张三丰
    ($mp1) = 武当
    [if] (mpSL) != -1
        ($mp2) = 少林
    [else if] (mpHS) != -1
        ($mp2) = 华山
    [else if] (mpEM) != -1
        ($mp2) = 峨眉
    [else if] (mpXY) != -1
        ($mp2) = 逍遥
    [else if] (mpGB) != -1
        ($mp2) = 丐帮    
[if] (name) == 玄难
    ($mp1) = 少林
    [if] (mpWD) != -1
        ($mp2) = 武当
    [else if] (mpHS) != -1
        ($mp2) = 华山
    [else if] (mpEM) != -1
        ($mp2) = 峨眉
    [else if] (mpXY) != -1
        ($mp2) = 逍遥
    [else if] (mpGB) != -1
        ($mp2) = 丐帮
[if] (name) == 岳不群
    ($mp1) = 华山
    [if] (mpWD) != -1
        ($mp2) = 武当
    [else if] (mpSL) != -1
        ($mp2) = 少林
    [else if] (mpEM) != -1
        ($mp2) = 峨眉
    [else if] (mpXY) != -1
        ($mp2) = 逍遥
    [else if] (mpGB) != -1
        ($mp2) = 丐帮
[if] (name) == 灭绝
    ($mp1) = 峨眉
    [if] (mpWD) != -1
        ($mp2) = 武当
    [else if] (mpSL) != -1
        ($mp2) = 少林
    [else if] (mpHS) != -1
        ($mp2) = 华山
    [else if] (mpXY) != -1
        ($mp2) = 逍遥
    [else if] (mpGB) != -1
        ($mp2) = 丐帮
[if] (name) == 逍遥子
    ($mp1) = 逍遥
    [if] (mpWD) != -1
        ($mp2) = 武当
    [else if] (mpSL) != -1
        ($mp2) = 少林
    [else if] (mpHS) != -1
        ($mp2) = 华山
    [else if] (mpEM) != -1
        ($mp2) = 峨眉
    [else if] (mpGB) != -1
        ($mp2) = 丐帮
[if] (name) == 洪七公
    ($mp1) = 丐帮
    [if] (mpWD) != -1
        ($mp2) = 武当
    [else if] (mpSL) != -1
        ($mp2) = 少林
    [else if] (mpHS) != -1
        ($mp2) = 华山
    [else if] (mpEM) != -1
        ($mp2) = 峨眉
    [else if] (mpXY) != -1
        ($mp2) = 逍遥
chat (start_h)时(start_m)分(start_s)秒：(mp1)-(mp2) 开战
@await 30000
chat (mp1)-(mp2) 于(start_h)时(start_m)分(start_s)秒开战，已过去30秒。
@await 30000
chat (mp1)-(mp2) 于(start_h)时(start_m)分(start_s)秒开战，已过去1分钟。
@await 60000
chat (mp1)-(mp2) 于(start_h)时(start_m)分(start_s)秒开战，已过去2分钟。
@await 60000
chat (mp1)-(mp2) 于(start_h)时(start_m)分(start_s)秒开战，已过去3分钟。
@await 60000
chat (mp1)-(mp2) 于(start_h)时(start_m)分(start_s)秒开战，已过去4分钟。
@await 3060000
chat 上一场 (mp1)-(mp2) 已结束55分钟。
@await 60000
chat 上一场 (mp1)-(mp2) 已结束56分钟。
@await 60000
chat 上一场 (mp1)-(mp2) 已结束57分钟。
@await 60000
chat 上一场 (mp1)-(mp2) 已结束58分钟。
@await 60000
chat 上一场 (mp1)-(mp2) 已结束59分钟。
@await 30000
chat 距离 (mp1)-(mp2) 门派战冷却还有30秒。
@await 25000
chat 距离 (mp1)-(mp2) 门派战冷却只有5秒，大佬们动手吧。