// 新聊天信息触发器
// 聊天信息内容：(content)
// 发言人：(name)
// 如需更多信息，可以到论坛触发器版块发帖。
// 关键字：xy
[if] (EnableXy) == true
    ($d) = (:hour)*60*60+(:minute)*60+(:second)-(TimeXyEndHour)*3600-(TimeXyEndMinute)*60-(TimeXyEndSecond)
    @js ($d0) = parseInt((d)/3600)
    @js ($d1) = parseInt(((d)%3600)/60)
    ($d2) = (d)%60
    chat 上一场襄阳结束于(TimeXyEndHour):(TimeXyEndMinute):(TimeXyEndSecond) 已经过(d0)时(d1)分(d2)秒
[if] (EnableXy) == false
    ($d) = (:hour)*60*60+(:minute)*60+(:second)-(TimeXyStartHour)*3600-(TimeXyStartMinute)*60-(TimeXyStartSecond)
    @js ($d0) = parseInt((d)/3600)
    @js ($d1) = parseInt(((d)%3600)/60)
    ($d2) = (d)%60
    chat 襄阳开始于(TimeXyStartHour):(TimeXyStartMinute):(TimeXyStartSecond) 已进行(d1)分(d2)秒
[if] (EnableXy) == null
    chat 没有记录
