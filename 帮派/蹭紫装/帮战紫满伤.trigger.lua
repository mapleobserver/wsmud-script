// raid.flow
// 四区：白三三
// 伤害已满触发
// 关键字：长老
// 伤害百分比3
[if] (:room) == 丐帮-暗道 && (:combating) == true
    kill {r长老}?
    pty 触发：伤害占比百分之(percent)，切换目标。