// raid.flow
// 自动出售聚气丹、培元丹、混天黄紫装
// 紫装只出售没精炼过的
$to 扬州城-杂货铺
// 卖聚气丹
[if] {b聚气丹g#}? != null
    sell {b聚气丹g#}? {b聚气丹g}? to {r杨永福}?
[if] {b聚气丹b#}? != null
    sell {b聚气丹b#}? {b聚气丹b}? to {r杨永福}?
[if] {b聚气丹y#}? != null
    sell {b聚气丹y#}? {b聚气丹y}? to {r杨永福}?
[if] {b聚气丹p#}? != null
    sell {b聚气丹p#}? {b聚气丹p}? to {r杨永福}?
// 卖培元丹
[if] {b培元丹o#}? != null
    sell {b培元丹o#}? {b培元丹o}? to {r杨永福}?
// 卖混天装
[while] true
    [if] {b混天y#}? != null
        sell 1 {b混天y}? to {r杨永福}?
    [else if] {b混天棍p%#}? != null
        sell 1 {b混天棍p%}? to {r杨永福}?
    [else if] {b混天冠p%#}? != null
        sell 1 {b混天冠p%}? to {r杨永福}?
    [else if] {b混天蓑衣p%#}? != null
        sell 1 {b混天蓑衣p%}? to {r杨永福}?
    [else if] {b混天麻鞋p%#}? != null
        sell 1 {b混天麻鞋p%}? to {r杨永福}?
    [else if] {b混天护腕p%#}? != null
        sell 1 {b混天护腕p%}? to {r杨永福}?
    [else if] {b混天腰带p%#}? != null
        sell 1 {b混天腰带p%}? to {r杨永福}?
    [else]
        [break]