// raid.flow
@cmdDelay 300
[while] true
    alloc
    @tip 请选择对|目前没有可用的($finish)|不要急
    [if] (finish)!=null
        [break]
    @js $(".content-message").find(".item-commands").last().children(":first").click()