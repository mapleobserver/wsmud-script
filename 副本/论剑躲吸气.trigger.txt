//raid.flow
//buff新增：他人；
//buffid：hama|force|dodge
[if] (:room) == 华山论剑-论剑台(副本区域)
    $wait 5000
    [if] {r欧阳锋}? != null || {r洪七公}? != null
        @perform dodge.power