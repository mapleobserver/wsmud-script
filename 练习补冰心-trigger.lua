//raid.flow
//buff变化：移除
//buffid:food
//对象：自己
//要先手动吃一颗
[if] (:room) == 住房-练功房 && (:state) == 练习 && {b冰心丹}? != null
   stopstate
   use {b冰心丹}
   dazuo