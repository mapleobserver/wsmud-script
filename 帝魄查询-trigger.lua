// raid.flow
// 四区白三三
// 频道：帮派
// 关键字：dp
//@print (DPList)
@js ($DPListNum) = [(DPList)].length
@js ($DPListSort) = [(DPList)].sort()
//@print (DPListSort)
($num1) = 0
[while] (num1) < (DPListNum)
    ($count) = 0
    ($num2) = (num1)
    [while] (num2) < (DPListNum)
        @js ($dpPlayer1) = '(DPListSort)'.split(',')[(num1)]
        @js ($dpPlayer2) = '(DPListSort)'.split(',')[(num2)]
        @js ($dpYes) = '(dpPlayer1)'.indexOf('(dpStat)')
        [if] (dpYes) != -1
            [break]
        [else]
            [if] (dpPlayer1) == (dpPlayer2)
                ($count) = (count) + 1
            ($num2) = (num2) + 1
    [if] (dpStat) != null
        ($dpStat) = (dpStat)；(dpPlayer1)x(count)
    [else]
        ($dpStat) = (dpPlayer1)x(count)
    ($num1) = (num1) + (count)
pty 帝魄统计：(dpStat)
