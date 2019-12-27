//raid.flow
//buff变化：移除
//buffid:food
//对象：自己
[if] (:room) == 古墓派-卧室(副本区域) && (:state) == 打坐
    [if] {b蕴象丸}? != null
        stopstate;use {b蕴象丸};dazuo
    [else]
        @print 没药了！