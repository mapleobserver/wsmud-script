// raid.flow
// author:四区白三三
// 加入帮派
[if] ($partyName) != null
    (partyName) = null
#input ($partyName)= 要加入的帮派,(partyName)
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
//@off 加入帮派