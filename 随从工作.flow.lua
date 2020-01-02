//raid.flow
//掉线、游戏更新后，自动组队随从去工作
//四区白三三
#select ($SC_1) = 第 1 个随从,无|王语嫣|程灵素|青青|小昭|小龙女|丫鬟|双儿|韦春芳|小流氓|鳌拜|曲灵儿|夏雪宜|温仪|黄蓉|阿紫|阿碧|阿朱|张无忌|周芷若,无
#select ($Work_1) = 安排第 1 个随从,采药|钓鱼,采药
#select ($SC_2) = 第 2 个随从,无|王语嫣|程灵素|青青|小昭|小龙女|丫鬟|双儿|韦春芳|小流氓|鳌拜|曲灵儿|夏雪宜|温仪|黄蓉|阿紫|阿碧|阿朱|张无忌|周芷若,无
#select ($Work_2) = 安排第 2 个随从,采药|钓鱼,采药
#select ($SC_3) = 第 3 个随从,无|王语嫣|程灵素|青青|小昭|小龙女|丫鬟|双儿|韦春芳|小流氓|鳌拜|曲灵儿|夏雪宜|温仪|黄蓉|阿紫|阿碧|阿朱|张无忌|周芷若,无
#select ($Work_3) = 安排第 3 个随从,采药|钓鱼,采药
#config
stopstate
$to 住房-院子
team out
[if] (SC_1) != 无
    team with {r(SC_1)}
[if] (SC_2) != 无
    team with {r(SC_2)}
[if] (SC_3) != 无
    team with {r(SC_3)}
go northeast
[if] (Work_1) == 采药
    dc {r(SC_1)} cai
[else]
    dc {r(SC_1)} diao
[if] (Work_2) == 采药
    dc {r(SC_2)} cai
[else]
    dc {r(SC_2)} diao
[if] (Work_3) == 采药
    dc {r(SC_3)} cai
[else]
    dc {r(SC_3)} diao
team out
$zdwk