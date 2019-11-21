//raid.flow
//已死亡
[if] (:room) == 华山论剑-论剑台(副本区域)
    $wait 1000
    relive
    relive
    @renew
    @cd
    @until (:status xuruo) == false
    jh fb 30 start1;cr huashan/lunjian/leitaixia
    go up