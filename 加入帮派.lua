// raid.flow
// 加入帮派
// author:四区白三三
#input ($partyName) = null
#config
[if] (arg0) != null
    ($partyName) = (arg0)
stopstate
$to 帮会-大院
select {r帮会管理员}
jiaru {r帮会管理员}
@await 500
say (partyName)
@await 1000
party join (partyName) ok
@await 1000
dazuo