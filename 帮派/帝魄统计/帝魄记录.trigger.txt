// raid.flow
// 四区白三三
// 新提示信息
// 关键字：的尸体里拿出来 一块帝魄
@js ($dpName) = '(text)'.match('([^%]+)从.*的尸体')[1]
[if] (DPList) != null
    ($DPList) = (DPList),'(dpName)'
[else]
    ($DPList) = '(dpName)'
@print (DPList)