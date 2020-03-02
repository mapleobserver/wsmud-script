//raid.flow
//整合了之前的几个相关流程，一键收割、安排随从工作
//收割过程中包满了会自动清包再继续，不过有概率卡住。
//四区白三三
[if] (SC_1) == null
    ($SC_1) = 王语嫣
    ($SCWork_1) = 采药
[if] (SC_2) == null
    ($SC_2) = 程灵素
    ($SCWork_2) = 采药
[if] (SC_3) == null
    ($SC_3) = 青青
    ($SCWork_3) = 采药
[if] (ItemQuality) == null
    ($ItemQuality) == 全部
#input ($SC_1) = 随从1,(SC_1)
#select ($SCWork_1) = 动作,采药|钓鱼,(SCWork_1)
#input ($SC_2) = 随从2,(SC_2)
#select ($SCWork_2) = 动作,采药|钓鱼,(SCWork_2)
#input ($SC_3) = 随从3,(SC_3)
#select ($SCWork_3) = 动作,采药|钓鱼,(SCWork_3)
#select ($ItemQuality) = 最多取到,全部|紫|黄|蓝|绿|白,(ItemQuality)
#input ($SCdiao) = 鱼饵给谁(没有可以不填),(SCdiao)
#config
stopstate
stopstate;jh fam 0 start;go west;go west;go north;go enter
team out
[if] {r(SC_1)}? != null
    team with {r(SC_1)}?
[if] {r(SC_2)}? != null
    team with {r(SC_2)}?
[if] {r(SC_3)}? != null
    team with {r(SC_3)}?
go northeast
team out
($sc) = '(SC_1)','(SC_2)','(SC_3)'
($work) = '(SCWork_1)','(SCWork_2)','(SCWork_3)'
($num) = 0
[while] (num) < 3
    @js ($s) = [(sc)][(num)]
    @js ($w) = [(work)][(num)]
    @print (s) (w)
    ($get) = true
    [if] (w) == 采药
        ($w) = cai
    [else]
        ($w) = diao
    [if] (s) != null
        dc {r(s)}? stopstate;select {r(s)}?;pack {r(s)}?
    [else]
        ($num) = (num) + 1
        [continue]
    @dialog
    <---
    [if] (get) == true
        @tip 给了你|身上东西($bagfull)了
        [if] (bagfull) != null
            @tidyBag
            ($bagfull) = null
            @await 1000
            stopstate;jh fam 0 start;go west;go west;go north;go enter;go northeast
            select {r(s)}?;pack {r(s)}?
            @dialog
    --->
    [if] {d鲢鱼}? != null
        dc {r(s)}? give (:id) {d鲢鱼#} {d鲢鱼}
    [if] {d草鱼}? != null
        dc {r(s)}? give (:id) {d草鱼#} {d草鱼}
    [if] {d鲤鱼}? != null
        dc {r(s)}? give (:id) {d鲤鱼#} {d鲤鱼}
    [if] {d鲮鱼}? != null
        dc {r(s)}? give (:id) {d鲮鱼#} {d鲮鱼}
    [if] {d鳊鱼}? != null
        dc {r(s)}? give (:id) {d鳊鱼#} {d鳊鱼}
    [if] {d鲂鱼}? != null
        dc {r(s)}? give (:id) {d鲂鱼#} {d鲂鱼}
    [if] {d芦荟}? != null
        dc {r(s)}? give (:id) {d芦荟#} {d芦荟}
    [if] {d山楂叶}? != null
        dc {r(s)}? give (:id) {d山楂叶#} {d山楂叶}
    [if] {d当归}? != null
        dc {r(s)}? give (:id) {d当归#} {d当归}
    [if] {d柴胡}? != null
        dc {r(s)}? give (:id) {d柴胡#} {d柴胡}
    [if] {d金银花}? != null
        dc {r(s)}? give (:id) {d金银花#} {d金银花}
    [if] {d石楠叶}? != null
        dc {r(s)}? give (:id) {d石楠叶#} {d石楠叶}
    [if] (ItemQuality) == 绿
        ($get) = false
        dc {r(s)} (w)
        ($num) = (num) + 1
        [continue]
    [if] {d太湖银鱼}? != null
        dc {r(s)}? give (:id) {d太湖银鱼#} {d太湖银鱼}
    [if] {d黄颡鱼}? != null
        dc {r(s)}? give (:id) {d黄颡鱼#} {d黄颡鱼}
    [if] {d黄金鳉}? != null
        dc {r(s)}? give (:id) {d黄金鳉#} {d黄金鳉}
    [if] {d茯苓}? != null
        dc {r(s)}? give (:id) {d茯苓#} {d茯苓}
    [if] {d沉香}? != null
        dc {r(s)}? give (:id) {d沉香#} {d沉香}
    [if] {d熟地黄}? != null
        dc {r(s)}? give (:id) {d熟地黄#} {d熟地黄}
    [if] (ItemQuality) == 蓝
        ($get) = false
        dc {r(s)} (w)
        ($num) = (num) + 1
        [continue]
    [if] {d虹鳟}? != null
        dc {r(s)}? give (:id) {d虹鳟#} {d虹鳟}
    [if] {d反天刀}? != null
        dc {r(s)}? give (:id) {d反天刀#} {d反天刀}
    [if] {d孔雀鱼}? != null
        dc {r(s)}? give (:id) {d孔雀鱼#} {d孔雀鱼}
    [if] {d冬虫夏草}? != null
        dc {r(s)}? give (:id) {d冬虫夏草#} {d冬虫夏草}
    [if] {d络石藤}? != null
        dc {r(s)}? give (:id) {d络石藤#} {d络石藤}
    [if] {d九香虫}? != null
        dc {r(s)}? give (:id) {d九香虫#} {d九香虫}
    [if] (ItemQuality) == 黄
        ($get) = false
        dc {r(s)} (w)
        ($num) = (num) + 1
        [continue]
    [if] {d罗汉鱼}? != null
        dc {r(s)}? give (:id) {d罗汉鱼#} {d罗汉鱼}
    [if] {d银龙鱼}? != null
        dc {r(s)}? give (:id) {d银龙鱼#} {d银龙鱼}
    [if] {d黑龙鱼}? != null
        dc {r(s)}? give (:id) {d黑龙鱼#} {d黑龙鱼}
    [if] {d凌霄花}? != null
        dc {r(s)}? give (:id) {d凌霄花#} {d凌霄花}
    [if] {d何首乌}? != null
        dc {r(s)}? give (:id) {d何首乌#} {d何首乌}
    [if] {d人参}? != null
        dc {r(s)}? give (:id) {d人参#} {d人参}
    [if] (ItemQuality) == 紫
        ($get) = false
        dc {r(s)} (w)
        ($num) = (num) + 1
        [continue]
    [if] {d巨骨舌鱼}? != null
        dc {r(s)}? give (:id) {d巨骨舌鱼#} {d巨骨舌鱼}
    [if] {d帝王老虎魟}? != null
        dc {r(s)}? give (:id) {d帝王老虎魟#} {d帝王老虎魟}
    [if] {d七星刀鱼}? != null
        dc {r(s)}? give (:id) {d七星刀鱼#} {d七星刀鱼}
    [if] {d灵芝}? != null
        dc {r(s)}? give (:id) {d灵芝#} {d灵芝}
    [if] {d天仙藤}? != null
        dc {r(s)}? give (:id) {d天仙藤#} {d天仙藤}
    [if] {d盘龙参}? != null
        dc {r(s)}? give (:id) {d盘龙参#} {d盘龙参}
    ($get) = false
    dc {r(s)} (w)
    ($num) = (num) + 1
($get) = false
[if] (SCdiao) != null
    ($s) = (SCdiao)
    [if] (s) == (SC_1)
        ($w) = (SCWork_1)
    [else if] (s) == (SC_2)
        ($w) = (SCWork_2)
    [else]
        ($w) = (SCWork_3)
    dc {r(s)}? stopstate;select {r(s)}?;trade {r(s)}?;
    @await 500
    give {r(s)}? {b鱼饵g#}? {b鱼饵g}?
    give {r(s)}? {b鱼饵b#}? {b鱼饵b}?
    give {r(s)}? {b鱼饵y#}? {b鱼饵y}?
    give {r(s)}? {b鱼饵p#}? {b鱼饵p}?
    give {r(s)}? {b鱼饵o#}? {b鱼饵o}?
    [if] (w) == 采药
        dc {r(s)} cai
    [else]
        dc {r(s)} diao
@tidyBag
$zdwk