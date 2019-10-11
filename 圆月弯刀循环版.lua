// raid.flow
// 四区白三三
// 暂用版
@cmdDelay 500
cr wuyue/qingcheng/shanlu
go westup
go north
look cao
tiao cao
yywd ok
pa tu
//@tip 忘了所有的烦恼
@tip 只要伸手就到了
answer s2
//@tip 思索这里的诡异景象
@tip 神界就在前方
answer s4
//@tip 就和壁画上的仙子完全一样
@tip 是人是鬼
answer s5
//@tip 你来这里做什么
@tip 不要阻止我
answer s7
//@tip 你告诉我为什么寻死
@tip 只是觉得有些诡异
answer s9
//@tip 就会将所有的优愁烦恼都忘记
@tip 去看看
answer s10
[while] true
    @tip 青青往($direction)方走去|无边无际的黑暗中($goout)
    [if] (goout) != null
        @print (goout)
        [break]
    [if] (direction) == 东
        go east
    [if] (direction) == 西
        go west
    [if] (direction) == 北
        go north
    [if] (direction) == 南
        go south
look cao
cai cao
@tip 你小心点
answer s1
@tip 杀了他
answer s3
@until (:combating) == true
@perform sword.wu
@tip 从刚才的山洞出去
go south
ofb
ofb ok