// raid.flow
// 需求：帮会交装备的那个 改成 固定给1个名字的玩家 如果列表没有 那个玩家就给帮会
@cmdDelay 300
[while] true
      alloc
      @tip 请选择对|目前没有可用的($finish)|不要急
      [if] (finish)!=null
            [break]
      //@js $(".content-message").find(".item-commands").last().children(":first").click()
      @js ($eqid) = $(".content-message").find(".item-commands").last().children(":first").attr("cmd").match("alloc (.*) 1")[1]
      @print (eqid)




($playname) = (鸡腿堡)
@print (playerid)
alloc
@tip 请选择对($eqname)分配方式|目前没有可用的($finish)|不要急
//($alloc2) = 2
@js ($eqid) = $(".content-message").find(".item-commands").last().children(":first").attr("cmd").match("alloc (.*) 1")[1]
party alloc (eqid) 2
@js ($playlist) = $(".content-message").find(".item-commands").last().text()
@js ($playyes) = "(playlist)".indexOf("ogwz4031f54")
@print (playyes)
@js ($playid) = $("(playlist)").match("(eqid) (.*)\">鸡腿堡")[1]
@print (playid)


($playerName) = 瓜皮猫
//点击分配按钮
@js $(".content-message").find(".item-commands").last().children("span:contains('分配给参与战斗的玩家')").click()
//检查是否存在指定玩家
$wait 500
@js ($playerList) = $(".content-message").find(".item-commands").last().children().text()
@js ($playerYes) = "(playerList)".indexOf('(playerName)')
[if] (playerYes) == -1
    a




@js ($playlist) = $(".content-message").find(".item-commands").last().children("span:contains('黑白')").click()