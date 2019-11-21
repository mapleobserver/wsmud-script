// raid.flow
// 四区：白三三
// 已经死亡触发
[if] (:room) == 丐帮-暗道
    relive
    pty 触发：💊翻车了，武庙回血中💊
    $wait 1000
    @renew
    pty 🥺虚弱恢复中，请稍等🥺
    @until (:status xuruo) == false
    $wait 2000
    $to 丐帮-破庙密室
    go east
    pty 💪我又回来了💪
    [if] (:room) == 丐帮-暗道 && (:combating) == false && {r长老}? = null
        go east