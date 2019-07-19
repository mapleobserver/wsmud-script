//raid.flow
//author:四区白三三
#input ($_repeat) = 进出古墓重复次数,1
#config
<-stopSSAuto
stopstate
($_i) = 0
[while] (_i) < (_repeat)
    cr gumu/gumukou;cr over
    ($_i) = (_i) + 1
stopSSAuto->