// raid.flow
// author:四区白三三
// 修改下面一行的帮派名字
($partyName) = 帮派名字自己修改
stopstate
$to 帮会-大院
select {r帮会管理员}
jiaru {r帮会管理员}
@await 500
say (partyName)
@await 1000
party join (partyName) ok
@await 1000
@renew
$zdwk