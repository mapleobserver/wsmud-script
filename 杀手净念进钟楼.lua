//raid.flow
//四区白三三
//杀手专用
//有和氏璧buff后，从崖底运行这个流程
enable force shashengjue2
@cd force.tuoli
go south;go southwest;go north;go north
[while] true
    go north
    $waitpfm force.tuoli
    [if] (:room) == 净念禅宗-主殿(副本区域)
        go north;go northwest
        [break]
    [if] (:room) == 净念禅宗-白石广场(副本区域)
        go northwest
        [break]
    @cd force.tuoli