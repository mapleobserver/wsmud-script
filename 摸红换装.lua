//raid.flow
//四区：白三三
#input ($MHweapon)=摸红武器id,(MHweapon)
#config
stopstate
//脱掉其他装备：鞋2、头3、披风4、项链6、饰品7、护腕8、腰带9
uneq (:eq2);uneq (:eq3);uneq (:eq4);uneq (:eq6);uneq (:eq7);uneq (:eq8);uneq (:eq9)
//换软猬甲（必需）、疤面（如果有）
[if] {b软猬甲}? != null
    eq {b软猬甲}?
[if] {b疤面面具}? != null
    eq {b疤面面具}?
[if] {b曲洋的琴环}? != null
    eq {b曲洋的琴环}?
[if] {b赵敏的戒指}? != null
    eq {b赵敏的戒指}?
[if] {b冰魄银针}? != null
    eq {b冰魄银针}?
//换打红武器
eq (MHweapon)
$wait 3000