//raid.flow
//四区：白三三
//随机夸损人
//多一句就对应改一次第一句命令后面的数字
@js ($num) = Math.ceil(Math.random()*40)
@js ($yesno) = Math.ceil(Math.random()*10)
[if] (yesno) = 1 || (yesno) = 4 || (yesno) = 7 || (yesno) = 10
    [if] (num) <= 1
        chat (name) 平时胆子很大，可是一看到蟑螂，就面如土色，抖似筛糠，只恨爹娘少生了两条腿。
    [else if] (num) = 2
        chat (name) 你的屁股等着挨板子吧，跟你的娇臀说再见！
    [else if] (num) = 3
        chat 别看 (name) 平时普普通通，其实他是个盗圣，昨晚一口气偷了醉仙楼一缸小米、两捆大葱、三桶豆油，还有五十斤棒子面。
    [else if] (num) = 4
        chat 小二，快给 (name) 大侠倒杯茶，记住不要放茶叶啊～
    [else if] (num) = 5
        chat (name) 不是一般人，就连跪地求饶的姿势，都比一般人威武。
    [else if] (num) = 6
        chat (name) 大声道：稿来！
    [else if] (num) = 7
        chat (name) 最近生活有困难吗？有困难要说，没困难制造困难也要说，挖矿传说就是你的家，任何困难都可以靠挖矿解决。
    [else if] (num) = 8
        chat (name) 戴的这手镯真好！瞧瞧这曲线，多有文化感；这质地，多有历史感；这堆铜锈，多有沧桑感，最重要的是它厚重，都能砸核桃！
    [else if] (num) = 9
        chat 额滴神呀，上帝以及老天爷呀，想找一个打不过 (name) 的人实在太难了！
    [else if] (num) = 10
        chat (name) 快去押镖吧，要是遇见蒙面大盗绑架你，你一定要哭着喊着让大盗给我写勒索信。十两银子以下都可以接受，我让金古易去赎你，超过十两的话，我就亲自去给你收尸。 
    [else if] (num) = 11
        chat (name) 非常贤惠，闲在家里什么都不会，也不去小花园帮丫鬟钓鱼。
    [else if] (num) = 12
        chat 听说岳不群最近想收 (name) 为徒，还打算亲手阉了他教他辟邪剑法。
    [else if] (num) = 13
        chat 要是我成为武神，我就拿轩辕剑刺 (name) 的小屁屁，每刺一剑，(name) 会惨叫一声：我错了！他死之前说了三万六千个字。
    [else if] (num) = 14
        chat 天不生 (name)，挖矿传说如长夜。
    [else if] (num) = 15
        chat (name) 决定请大家到擂台吃他豆腐。
    [else if] (num) = 16
        chat (name) 长得挺好看，就是有点黑，200连都没血刀残页那种黑。
    [else if] (num) = 17
        chat 别人有别人的长处，(name) 有自己的短处 →_→
    [else if] (num) = 18
        chat (name) 是武神的身子，挖矿的命。
    [else if] (num) = 19
        chat (name) 面对众人的挑衅，一招如来神掌……糊在自己脸上！
    [else if] (num) = 20
        chat (name) 是弱鸡吗？确定一定以及肯定！
    [else if] (num) = 21
        chat (name) 往擂台上一站，打遍天下无敌手，幸亏他没动真格，不然扬州城的武术教育水平起码倒退二十年。
    [else if] (num) = 22
        chat (name) 大侠仁义无双，助人为乐，万一哪天我离开了扬州城，请帮我照顾好我七舅姥爷三外甥的前一个丈母娘。
    [else if] (num) = 23
        chat (name) 再黑也没怨过莫非，再穷也没充过元宝，他是凭借一个「肝」字在挖矿传说里浪出一片天地。
    [else if] (num) = 24
        chat (name) 加油，我看好你呦~
    [else if] (num) = 25
        chat (name) 大佬很厉害的，童姥随便调戏，无忌随便揍，枯荣脑袋瓜随便摸。
    [else if] (num) = 26
        chat 祝 (name) 大佬九阴血刀200次凑齐。
    [else if] (num) = 27
        chat 莫文蔚的阴天，孙燕姿的雨天，周杰伦的晴天，都不如 (name) 和我聊天。
    [else if] (num) = 28
        chat 矿山稿仙三百万，见 (name) 也须尽低眉。
    [else if] (num) = 29
        chat 啊，是 (name) 大佬，我死了。
    [else if] (num) = 30
        chat 人在江湖飘，哪能不挨刀？白驼山壮骨粉，内用外服均有奇效，挨了一刀涂一包，还想再挨第二刀。华山论剑指定营养品，各大门派后勤均有销售。
    [else if] (num) = 31
        chat 我错了，我真的错了，我从一开始就不应该来挖矿，如果我不来挖矿，我就不会变成一个机器人。
    [else if] (num) = 32
        chat 东方不败在 (name) 背上刺了四个字：好汉饶命。
    [else if] (num) = 33
        chat (name) 大佬，快给我吸一口欧气！
    [else if] (num) = 34
        chat (name)，血刀齐了吗？九阴齐了吗？慈航静斋通关了吗？赶紧嗑几粒养精丹干活去！
    [else if] (num) = 35
        chat (name) 大佬带带我 (´･ω･`)
    [else if] (num) = 36
        chat 武神历三千二百一十六年，(name) 成为了扬州城一霸。
    [else if] (num) = 37
        chat 嘤嘤嘤，(name) 大佬别调戏我～
    [else if] (num) = 38
        chat (name) 整整闭关十年零八个月，终于打赢了狼王。
    [else if] (num) = 39
        chat (name) 你是我的禅，秀色可餐。
    [else if] (num) = 40
        chat 东风夜放花千树，我想去 (name) 家里住。