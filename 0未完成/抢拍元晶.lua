//raid.flow
($wp) = 玄虚步残页
($num) = 0
stopstate
jh fam 0 start;go south;go east;go up
select {r拍卖师}
spm {r拍卖师}
[while] true
    paimai showitem (num)
    @tip ($pmwp)
    @print (pmwp)
    [if] (pmwp) == (wp)
        //paimai add 2
        //paimai add2 2
        @print good
        @print (num)
        [break]
    ($num) = (num) + 1