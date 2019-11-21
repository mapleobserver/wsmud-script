// raid.flow
// 人物刷新：东邪|西毒|南帝|北丐|中神通
[if] (:room) == 华山论剑-论剑台(副本区域)
    @wait 50
    @perform parry.yi
    [if] (:cd force.wuwo) == false
        @perform force.wuwo
    [else if] (:cd sword.duo) == false
        @perform sword.duo
    [else if] (:cd sword.wu) == false
        @perform sword.wu
    [else if] (:cd dodge.lingbo) == false
        @perform dodge.lingbo