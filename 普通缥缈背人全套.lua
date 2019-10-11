//raid.flow
//普通缥缈使用，换技能比试开神行，背过桥换技能打李秋水
//内功轻功技能代码需自己修改
//四区白三三
@off 起手紫霞破气
@cd
//****换神行等技能***
enable force mingyugong
enable dodge shenxingbaibian
//****换神行等技能***
@liaoshang
@cd
$stoppfm
fight {r女童}
perform force.power;perform dodge.chan
//perform throwing.jiang
//@until (:combating) == false
go northup;go southdown
//select {r女童};
jiu {r女童}?
jiu {r女童}?
//$wait 500
go northup;go northup;look tiesuo;zou tiesuo
$startpfm
//****换正常技能*
enable force zixiashengong2
enable dodge tagexing
//****换正常技能***
@on 起手紫霞破气
@until {r天山童姥} != null
kill {r李秋水};kill {r李秋水}