// raid.flow
// 谣言频道：进攻襄阳
// 系统频道：襄阳城告急
// 小炒肉：gb7w29c5931；杀手小炒肉：2uwm29c5762

<-stopSSAuto
($startXY_h) = (:hour)
($startXY_m) = (:minute)
stopstate
jh fam 8 start
@cmdDelay 800
[while] true
    <---
    @js ($roomXY) = '(:room)'.indexOf('襄阳城')
    [if] (roomXY) != -1
        [if] (:exist gb7w29c5931) == true || (:exist 2uwm29c5762) == true
            ($roomH) = (:room)
            chat (roomH)有【小炒肉】，可能存在堵门情况，请留意。
    --->
    // 去北门外
    go north[5]
    // 去南门外
    jh fam 8 start
    go south[5]
    // 去东门外
    jh fam 8 start
    go east[5]
    // 去西门外
    jh fam 8 start
    go west[5]
    // 回广场
    jh fam 8 start
    $wait 60000
    ($passTime) = (startXY_h)*60-(:hour)*60-(startXY_m)+(:minute)
    [if] (passTime) > 6
        [break]
$zdwk
stopSSAuto->