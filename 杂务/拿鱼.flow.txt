// raid.flow
dc {r(arg0)} stopstate;select {r(arg0)};pack {r(arg0)}
@dialog
($cmd) = null
[if] {d鲢鱼}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d鲢鱼#} {d鲢鱼}
[if] {d草鱼}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d草鱼#} {d草鱼}
[if] {d鲤鱼}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d鲤鱼#} {d鲤鱼}
[if] (cmd) != null
    (cmd)
($cmd) = null
[if] {d鲮鱼}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d鲮鱼#} {d鲮鱼}
[if] {d鳊鱼}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d鳊鱼#} {d鳊鱼}
[if] {d鲂鱼}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d鲂鱼#} {d鲂鱼}
[if] (cmd) != null
    (cmd)
($cmd) = null
[if] {d太湖银鱼}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d太湖银鱼#} {d太湖银鱼}
[if] {d黄颡鱼}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d黄颡鱼#} {d黄颡鱼}
[if] {d黄金鳉}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d黄金鳉#} {d黄金鳉}
[if] (cmd) != null
    (cmd)
($cmd) = null
[if] {d虹鳟}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d虹鳟#} {d虹鳟}
[if] {d反天刀}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d反天刀#} {d反天刀}
[if] {d孔雀鱼}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d孔雀鱼#} {d孔雀鱼}
[if] (cmd) != null
    (cmd)
($cmd) = null
[if] {d罗汉鱼}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d罗汉鱼#} {d罗汉鱼}
[if] {d银龙鱼}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d银龙鱼#} {d银龙鱼}
[if] {d黑龙鱼}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d黑龙鱼#} {d黑龙鱼}
[if] (cmd) != null
    (cmd)
dc {r(arg0)} diao
