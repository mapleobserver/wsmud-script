// raid.flow
// 绿大还丹：石楠叶、金银花、金银花、金银花、当归
($content) = yf 大还丹 绿
@js ($yfName) = '(content)'.split(' ')[1]
@js ($yfColor) = '(content)'.split(' ')[2]
@print (yfName)
@print (yfColor)
[if] (yfColor) == null
    [if] (yfColor) 