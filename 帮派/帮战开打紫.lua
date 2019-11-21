// raid.flow
// 四区：白三三
// 气血变化触发
// 关键字：长老
// 类型：气血低于100%
[if] (:room) == 丐帮-暗道 && (:combating) == false && {r长老}? != null
    $killall