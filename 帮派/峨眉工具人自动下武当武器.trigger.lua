// raid.flow
// 帮派频道：即刻起开始进攻武当
// 四区白三三
stopstate
@await 500
$stoppfm;enable sword wudugoufa;enable staff shedaoqigong;enable throwing jinshezhui;enable blade kuangfengkuaidao;enable unarmed jiuyinbaiguzhao2;enable dodge anyingfuxiang;enable parry yihuajiemu;$eq 1
@await 3000
@renew
@off 明玉夺魄
@on 无缝明玉
@off 无缝太上
@on 帮战翻车
$to 武当派-后山小院
@until (:room) == 武当派-后山小院
($id_1) = {r武当派长老}?
($id_2) = {r武当派长老}?# obj.id == "(id_1)" #
($id_bang) = {r张三丰}?
($id_fight) = (id_2)
[while] true
    ($succes) = null
    //$stoppfm
    @liaoshang
    fight (id_fight)
    @perform parry.yi,force.power,unarmed.duo,sword.suo
    @tip 当啷一声($succes)地上|手中并($succes)兵器|早有准备|你向后退了几步|这场比试算我输了|承让
    @print 已释放
    [while] true
        go south
        [if] (:room) != 武当派-后山小院
            [break]
    @until (:combating) == false
    go north
    [if] (succes) != null
        [if] (id_fight) == (id_2)
            ($id_fight) = (id_1)
        [else if] (id_fight) == (id_1)
            ($id_fight) = (id_bang)
        [else]
            [break]
    [else]
        $to 扬州城-武庙
    @liaoshang
    $to 武当派-后山小院
    @cd sword.suo,unarmed.duo
pty 武器已下
@liaoshang
$usezml 参合
@cd
$killall
$waitpfm parry.yi,force.power