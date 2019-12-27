//触发：伤害已满
//人名关键词：涟星|黄药师|谢逊|欧阳锋|邀月|慕容博|丁春秋
//百分比：3
[if] (:room) == 帮会-聚义堂 && (:combating) == true
    $stoppfm
    pty 已满3
@until (:combating) == false
$startpfm