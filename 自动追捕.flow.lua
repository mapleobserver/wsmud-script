// raid.flow
// auto_zhuibu v2.1
<-stopSSAuto
<-recordGains
[if] (ZBWaitCD) == null
   ($ZBWaitCD) = 15
[if] (ZBMax) == null
   ($ZBMax) = 52
[if] (ZBcdskill) == null
   ($ZBcdskill) = ^none
[if](AZB_action) == null
   ($AZB_action) = $zdwk
#input ($ZBWaitCD) = 从此次追捕开始，等待技能冷却,(ZBWaitCD)
#input ($ZBcdskill) = 需要cd的技能使用英文逗号隔开或^不需要cd的技能,(ZBcdskill)
#input ($ZBMax) = 最高连续追捕数达到后自动放弃,(ZBMax)
#select ($DieToReset) = 死亡自动重置,已开启|已关闭,已关闭
#input ($AZB_action) = 追捕完行为,(AZB_action)

#config

stopstate

@cmdDelay 1000
@toolbar tasks
@task 追杀逃犯：目前完成($currentN)/20个，共连续完成($comboN)个|追杀逃犯：($empty)目前完成($currentN)/20个，共连续完成($comboN)个

[while](currentN) < 20
   @renew
   @until (:status xuruo) == false
   
   [if](comboN)>=(ZBMax)
      $to 扬州城-衙门正厅
      ask1 {程药发}
      ask2 {程药发}
      ($comboN) = 0
   [if](comboN)>=(ZBWaitCD)
      @cd (ZBcdskill)

   $to 扬州城-衙门正厅
   ($olddir1) = (dir1)
   ($olddir2) = (dir2)
   @print (olddir1)
   ($escapee) = null
   
   [while] (escapee) == null
      ask1 {程药发}
      @toolbar tasks
      @task 追杀逃犯：($escapee)，据说最近在($dir1)-($dir2)出现过，你还有($time)去寻找他，目前完成($currentN)/20个，共连续完成($comboN)个。|追杀逃犯：目前完成($currentN)/20个，共连续完成($comboN)个

   [if](olddir1) != (dir1) && (olddir2) != (dir2)
       ($start_h) = (:hour)
       ($start_m) = (:minute)

   $wait 500

   [while] {(escapee)}? == null
          <---
             @cmdDelay 1000
             [if] {(escapee)}? != null
                 ($type1) = null
                 kill {(escapee)}

                 @until {(escapee)的尸体}? != null | {r(escapee)}? == null | (:combating) == false
                 @tip 你的追捕任务完成了，目前完成($currentN)/20个，已连续完成($comboN)个。|你($type1)死了($type2)|你要攻击谁
                 relive
                 [if](type1)!= null
                    relive
                    [if](DieToReset) == 已开启
                       $to 扬州城-衙门正厅
                       ask2 {程药发}
                 [break]
             [if] (DieToReset) == 已关闭
                 ($tb)=(start_h)*60-(:hour)*60-(start_m)+(:minute)
                 //@print 已耗时(tb)
                 [if](tb)>10
                    [break]               
          --->
          @cmdDelay 300
          $to (dir1)-(dir2)
          [if] (dir1) == 武当派
              [if](dir2) == 林间小径
                  go south
              jh fam 1 start
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
              go north
          [else if] (dir1) == 华山派
              jh fam 3 start
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
          [else if] (dir1) == 少林派
              [if](dir2) == 竹林
                  go south
              jh fam 2 start
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
          [else if] (dir1) == 峨眉派
              [if](dir2) == 走廊
                  go north
                  go south[2]
                  go north;go east[2]
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
          [else if] (dir1) == 逍遥派
              [if](dir2) == 林间小道
                  go west;go north
                  go south;go west
                  go east;go south
              [else if](dir2) == 木屋
                  go south[4]
              [else if](dir2) == 地下石室
                  go up
              jh fam 5 start
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
              go down
          [else if] (dir1) == 丐帮
              [if](dir2) == 暗道
                  go east
                  go east[2]
                  go east
              jh fam 6 start
              go down
              go east
              go east
              go east
              go up
              go down;go east
              go east
              go up
recordGains->
stopSSAuto->
@renew
//追捕后复原
@cmdDelay 0
@cd
(AZB_action)