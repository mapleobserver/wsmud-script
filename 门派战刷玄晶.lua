// raid.flow
#select ($ZBmp) = 门派战刷玄晶,武当派|丐帮|华山派|峨眉派|少林派|逍遥派,(ZBmp)
#config
stopstate
[if] (arg0) != null
      ($ZBmp)=(arg0)
($n1)=弟子
($n2)=弟子
($ban)=掌门
[if] (ZBmp) == 丐帮
    ($n2)=长老
    ($ban)=帮主
    jh fam 6 start
[else if] (ZBmp) == 武当派
    ($n1)=道童
    jh fam 1 start
[else if] (ZBmp) == 华山派
    ($n1) = 十六代弟子
    jh fam 3 start
[else if] (ZBmp) == 少林派
    ($ban)=方丈
    jh fam 2 start
[else if] (ZBmp) == 峨眉派
    jh fam 4 start
[else if] (ZBmp) == 逍遥派
    jh fam 5 start
@wait 100
<---
@wait 100
[if] {r(ban)}?==null && {r(n1)}?# obj.p==1 # != null
    [if] (ZBmp) == 武当派
        @kill 道童
    [else if] (ZBmp) == 华山派
        ($n1) = 十六代弟子
        @kill 十六代弟子
    @until  (:combating) == false || {r(n1)}? == null
--->
  @cmdDelay 600
          [if] (ZBmp) == 武当派
              //jh fam 1 start
              go north
              go south;go west
              go west
              go east;go northup
              go north
              go east
              go west;go west
              go northup
              go northup
              go northup
              go north
              go north
              go north
              go north
              go north
              //go north
          [else if] (ZBmp) == 华山派
              //jh fam 3 start
              go eastup
              go southup
              jumpdown
              go southup
              go south
              go east
              jh fam 3 start
              go westup
              go north
              go east
              go west;go north
              go east
              go west;go north
              go south[3];go west
              go east;go south
              go southup
              go southup
              look bi;break bi;go enter
              go westup
              go westup
              jumpup
          [else if] (ZBmp) == 少林派
              //jh fam 2 start
              go north
              go west
              go east;go east
              go west;go north
              go northup
              go southdown;go northeast
              go northwest
              go southwest
              go northeast;go north
              go east
              go west;go west
              go east;go north
              go east
              go west;go west
              go east;go north
              go west
              go east;go north
              go north   
          [else if] (ZBmp) == 峨眉派
              //jh fam 4 start
              go northup
              go east
              go west;go southdown;go west
              go south
              go east
              go east
              go west;go south
              go north;go west;go south
              go north;go west
              go south
              go south
              go north;go north;go west
              go east;go north
              go north
          [else if] (ZBmp) == 逍遥派
              //jh fam 5 start
              go north
              go north
              jh fam 5 start;go east
              go north
              go south;go south
              go south
              jh fam 5 start;go west
              go south
              jh fam 5 start;go south
              go south
              jh fam 5 start;go down
              //go down
          [else if] (ZBmp) == 丐帮
              //jh fam 6 start
              go down
              go east
              go east
              go east
              go up
              go down;go east
              go east
              //go up
$zdwk
