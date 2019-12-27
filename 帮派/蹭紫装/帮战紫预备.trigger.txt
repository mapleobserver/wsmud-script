// raid.flow
// 四区：白三三
// 频道：帮派
// 发言人：能开启帮战的人
// 关键字：即刻起开始进攻丐帮
stopstate
@stopSSAuto
$wait 3500
$eq 1
$wait 4000
@renew
$wait 2000
$to 丐帮-破庙密室
go east
$wait 1000
$startpfm
@on 帮战开打紫
@on 帮战紫满伤
@on 帮战紫翻车
@on 帮战紫换场
@on 帮战打完紫
@on 帮战结束
pty 触发：帮战预备，打紫🍆人员已就位！