// raid.flow
stopstate
@await 500
$to 扬州城-药铺
select {r平一指}
list {r平一指}
@dialog
($count) = {b养精丹g#}?
[if] (count) == null
    ($count) = 10
[else]
    ($count) = 10 - (count)
buy (count) {d养精丹g} from {r平一指}
use {养精丹g}[10]
[if]{b养精丹b}? != null
    use {b养精丹b}[{b养精丹b#}]
[if]{b朱果g}? != null
    use {b朱果g}[{b朱果g#}]
[if]{b潜能果g}? != null
    use {b潜能果g}[{b潜能果g#}]