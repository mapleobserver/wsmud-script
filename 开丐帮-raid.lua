//raid.flow
//party fam HUASHAN -> 华山派
//party fam WUDANG -> 武当派
//party fam GAIBANG -> 丐帮
//party fam SHAOLIN -> 少林派
//party fam EMEI -> 峨眉派
//party fam XIAOYAO -> 逍遥派

stopstate
$usezml 百免
$to 帮会-大院
select {r帮会管理员}?
askhyd {r帮会管理员}?
party fam
party fam GAIBANG
$wait 2000
$to 丐帮-林间小屋
$killall