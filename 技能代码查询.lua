// raid.flow
// 四区：白三三
//匹配jn后面的内容，如果null则输出命令使用说明，否则匹配技能名字，给出对应技能代码
//输出格式：震字诀（拳脚）：unarmed.zhen 震字诀（招架）：parry.zhen
@js ($jnName) = '(content)'.substr([2]).trim()
@print (jnName)
[if] (jnName) != null
    ($jnList) = '震字诀（拳脚）：unarmed.zhen','参合之殇：unarmed.zhen','赤血爪：unarmed.zhen','太祖八式：unarmed.zhen','惊魔一指：unarmed.zhen','三阴毒爪：unarmed.san','阳关三叠：unarmed.san','追魂爪：unarmed.zhui','催心：unarmed.cui','掌心雷：unarmed.chuan','无相（未进阶拳脚）：unarmed.duo','夺魄：unarmed.duo','无我（未进阶拳脚）：unarmed.wuwo','生死符：unarmed.zhong','白虹掌力：unarmed.po','破玉：unarmed.po','佛光普照：unarmed.po','无影掌：unarmed.chan','化骨：unarmed.hua','风卷残云：unarmed.juan','无形剑气：unarmed.qi','六脉纵横：unarmed.liu','弹指惊雷：unarmed.zhi','一指乾坤：unarmed.zhi','点穴：unarmed.dian','真武除邪（已进阶）：force.chu','真武除邪（未进阶）：force.tu','枯木逢春：force.tu','一气化三清：force.san','九阳护体：force.power','唯我独尊：force.power','斩杀：force.power','不死神龙：force.power','神游太虚：force.power','明玉：force.power','白云：force.power','九阳真焰：force.qi','不老长春：force.xi','蛤蟆吸气：force.xi','紫气东来：force.xi','鹤翔庄：force.xi','蛤蟆冲击：force.chong','隐杀：force.tuoli','无相（已进阶内功）：force.duo','无我（已进阶内功）：force.wuwo','鲲字诀：force.huifu','游龙庄：force.huifu','太上忘情：force.wang','佛光守护：force.foguang','狮子吼：force.roar','金刚罩：force.zhao','追魂：force.zhui','逆转九阴：force.cui','金蛇游身：dodge.snake','踏歌行：dodge.power','无痕：dodge.power','凌波：dodge.lingbo','神行：dodge.chan','万佛化身：dodge.zhen','震字诀（招架）：parry.zhen','大挪移：parry.yi','星移：parry.yi','移花：parry.yi','倒转乾坤：parry.dao','斗转：parry.dou','五神赋：parry.wu','唱仙法：parry.chang','吼仙法：parry.hou','空手入白刃：parry.duo','破字诀：parry.pojian','护体真焰：parry.hu','缠字诀（剑法）：sword.chan','连字诀：sword.lian','随字：sword.sui','五神剑：sword.jiang','神龙天降：sword.jiang','三连环：sword.jiang','躺尸：sword.wu','云龙三现：sword.wu','无招：sword.wu','金蛇狂舞：sword.wu','无相（未进阶剑法）：sword.duo','金蛇追魂：sword.duo','无我（未进阶剑法）：sword.wuwo','破气诀：sword.poqi','夺命连环：sword.duoming','倚天剑诀：sword.yi','号令天下：sword.hao','灭剑：sword.mie','绝剑：sword.jue','八方藏刀：blade.chan','断字诀：blade.chan','无相（未进阶刀法）：blade.duo','无我（未进阶刀法）：blade.wuwo','狂风二十一式：blade.kuang','突击：club.lian','连刺：club.lian','回马枪：club.hui','八卦八打：club.wu','绝棍闷打：club.wu','灵蛇出洞：staff.chang','缠字诀(鞭法)：whip.chan','隔空点穴：whip.chan','千蛇出洞：throwing.jiang','又见飞刀：throwing.jiang','落花：throwing.luo','定影：throwing.wu'
    ($jnText) = null
    @js ($jnCount) = [(jnList)].length
    ($num)=0
    [while](num) < (jnCount)
        @js ($jnCheck) = [(jnList)][(num)]
        @js ($jnYes) = '(jnCheck)'.indexOf('(jnName)')
        [if] (jnYes) != -1
            @js ($jnGet) = [(jnList)][(num)]
            [if] (jnText) == null
                ($jnText) = 查询结果：(jnGet) 
            [else]
                ($jnText) = (jnText)、(jnGet)
        ($num) = (num) + 1
    [if] (jnText) != null
        chat (jnText)
    [else]
        chat 没有相关信息，可能技能不存在或者暂未添加。
[else]
    chat jn 技能名称，查询技能对应代码。