// raid.flow
// 使用 $('.(class)') 方式获得具体类内容，text()文本化
($class) = room-name
@js ($p) = $('.(class)').text()
@print (p)


//split获取数组指定数值，数组元素不能为数字
[while](n)<(yao_list_l)
     @js ($yao) = '(LY_yaofang)'.split(" ")[(n)]
     @wait 12000
     dc (id) lianyao2 add {d(yao)}

($LY_yaofang) = 一 二 三 四
($n) = 1
@js ($yao) = '(LY_yaofang)'.split(" ")[(n)]
@print (yao)