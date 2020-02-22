//raid.flow
//四区白三三
//世界频道关键字：33
[if] (SSstatus) == false || (SSstatus) == null
    ($SSinfo) = (content)
    ($SSname) = (name)
    @js ($SSContent) = var ssStart='(content)'.match('^33');if(ssStart!=null){'(content)'.substr([2]).trim()}
    [if] (SSContent) == null
        ($SSstatus) = true
        @call 随机说话
    [else]
        ($SSstatus) = true
        @call 资料查询