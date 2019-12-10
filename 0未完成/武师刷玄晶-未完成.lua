//内力血量低于一定值自动恢复

<---
@await 100
[while] true
    [if] (mpzname) == 峨眉
        ($mpy) = {r峨眉派第四代弟子}?
        ($mpc) = {r峨眉派第五代弟子}?
        ($mpz) = {r峨眉派第三代弟子}?
        ($mpboss) = {r灭绝}?
        ($KillType) = 蓝黄都杀
    [if] (mpc) != null && (:maxHp (mpc)) == 40000
        kill (mpc)
        @until (:combating) == false
        //[if] (KillType) == 蓝黄都杀
        [if] (mpy) != null && (:maxHp (mpy)) == 200000
            kill (mpy)
            @until (:combating) == false
            [if] (:living) == false
                ($thisroom) == (:room)
                relive
                @renew
                @until (:status xuruo) == false
                $to (thisroom)
                [continue]
    [else]
        [break]
--->
@cmdDelay 500
//峨眉派
($mpzname) = 峨眉
jh fam 4 start
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