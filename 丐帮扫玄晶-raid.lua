stopstate
@wait 500
$startpfm
$eq 1
@wait 3000
($n1)=弟子
($n2)=弟子
<---
[if] (:hpPer) < 0.8
    @liaoshang
[if] (:mpPer) < 0.5
    @dazuo
[if] {r(n1)}? != null || {r(n2)}? != null
    $killall        
    @until (:combating) == false || {r(n1)}?==null&&{r(n2)}?==null
    relive
    @cd
--->
jh fam 6 start
go down
go east
go east
go east
go up
go down;go east
go east
go up