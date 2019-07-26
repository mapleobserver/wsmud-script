// 新聊天信息触发器
// 聊天信息内容：(content)
// 发言人：(name)
// 如需更多信息，可以到论坛触发器版块发帖。
// 频道：世界
// 关键字：mpz
($now) = (:hour)*3600 + (:minute)*60 + (:second)
[if] (MPT1) != null
    ($d) = (now) - (MPT1)
    @js ($dh) = parseInt((d)/3600)
    @js ($dm) = parseInt((d)%3600/60) 
    ($ds) = (d)%60
    ($msg1) = (MPA1)vs(MPB1) 开始于(dh)时(dm)分(ds)秒之前
[if] (MPT2) != null
    ($d) = (now) - (MPT2)
    @js ($dh) = parseInt((d)/3600)
    @js ($dm) = parseInt((d)%3600/60) 
    ($ds) = (d)%60
    ($msg2) = (MPA2)vs(MPB2) 开始于(dh)时(dm)分(ds)秒之前
[if] (MPT3) != null
    ($d) = (now) - (MPT3)
    @js ($dh) = parseInt((d)/3600)
    @js ($dm) = parseInt((d)%3600/60) 
    ($ds) = (d)%60
    ($msg3) = (MPA3)vs(MPB3) 开始于(dh)时(dm)分(ds)秒之前
[if] (msg1) == null && (msg2) == null && (msg3) == null
    chat 没有门派战记录
[else]
    @js ($msg) = var ma=new Array();if('(msg1)'!='null'){ma.push('(msg1)')};if('(msg2)'!='null'){ma.push('(msg2)')};if('(msg3)'!='null'){ma.push('(msg3)')};ma.join('|')
    chat (msg)