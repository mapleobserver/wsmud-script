// raid.flow
// author:四区白三三
// 气血低于XX数值或百分比
[if] (:room) == 华山派-客厅 && (:combating) == true
    ($id_ban) = {r岳不群}?
    [if] (id) == (id_ban)
        $stoppfm
        $tts 快停下来
        pty 停手
        [while] (:room) == 华山派-客厅
            perform unarmed.qi
            go south
            @await 500
        @until (:combating) == false
        go north
