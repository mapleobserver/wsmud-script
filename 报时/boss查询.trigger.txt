// 新聊天信息触发器
// 聊天信息内容：(content)
// 发言人：(name)
// 如需更多信息，可以到论坛触发器版块发帖。
// 关键字：boss

($d) = (:hour)*60*60+(:minute)*60+(:second)-(TimeBossStartHour)*3600-(TimeBossStartMinute)*60-(TimeBossStartSecond)
@js ($d0) = parseInt((d)/3600)
@js ($d1) = parseInt(((d)%3600)/60)
($d2) = (d)%60
chat 上一波BOSS出现在(TimeBossStartHour):(TimeBossStartMinute):(TimeBossStartSecond)，已经过(d0)时(d1)分(d2)秒

