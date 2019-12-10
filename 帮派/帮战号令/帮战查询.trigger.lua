//raid.flow
//频道：帮派
//关键字：bpz
[if] (BPZStart) != null
    ($now) = (:hour)*3600 + (:minute)*60 + (:second)
    ($d) = (now) - (BPZStart)
    @js ($dm1) = parseInt((d)%3600/60) 
    ($ds1) = (d)%60
    [if] (ds1) > 0
        ($dm2) = 29 - (dm1)
        ($ds2) = 60 - (ds1)
    [else]
        ($dm2) = 30 - (dm1)
        ($ds2) = 60 - (ds1)
    ($msg) = 帮战开始于(BPZHour):(BPZMin):(BPZSec)，还有(dm2)分(ds2)秒结束。
    pty (msg)
[else]
    pty 帮战未开始！