($thisroom) = (:room)
$waitpfm force.tuoli
@until (:combating) == false
$to 扬州城-武庙
@liaoshang
$to (thisroom)
[if] (MPnpc) != null
    kill (MPnpc);kill (MPnpc)
[else]
    [if] (:room) == 丐帮-林间小屋
        ($id_1) = {r副帮主}?
        ($id_2) = {r副帮主}?# obj.id == "(id_1)" #
        kill (id_2);kill (id_2)
    [else if] (:room) == 武当派-后山小院
        ($id_1) = {r武当派长老}?
        ($id_2) = {r武当派长老}?# obj.id == "(id_1)" #
        kill (id_2);kill (id_2)