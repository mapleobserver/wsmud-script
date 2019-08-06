// raid.flow
// 四区：白三三
// 偷渡副本
#select ($fbName) = 偷渡副本,星宿海|困难移花|困难缥缈|光明顶|困难天龙|困难古墓,(fbName)
#input ($_repeat) = 偷渡副本次数,1
#config
<-stopSSAuto
[if] (fbName) == 星宿海
    ($fbAdd) = xingxiu/xxh6 0
[else if] (fbName) == 困难移花
    ($fbAdd) = huashan/yihua/shandao 1
[else if] (fbName) == 困难缥缈
    ($fbAdd) = lingjiu/shanjiao 1
[else if] (fbName) == 光明顶
    ($fbAdd) = mj/shanmen 0
[else if] (fbName) == 困难天龙
    ($fbAdd) = tianlong/damen 1
[else if] (fbName) == 困难古墓
    ($fbAdd) = gumu/gumukou 1
stopstate
($_i) = 0
[while] (_i) < (_repeat)
    cr (fbAdd) 0;cr over
    ($_i) = (_i) + 1
$to 住房-练功房;dazuo
stopSSAuto->