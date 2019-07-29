// raid.flow
// 频道：帮派
// 关键字：roll
@js ($onlyroll) = '(content)'.match('^roll$')
[if] (onlyroll) != null
    @js ($rollNum) = Math.floor(Math.random()*100+1)
    @print (name)点数：(rollNum)