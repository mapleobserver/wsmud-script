// raid.flow
dc {r(arg0)} stopstate;select {r(arg0)};pack {r(arg0)}
@dialog
($cmd) = null
[if] {d芦荟}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d芦荟#} {d芦荟}
[if] {d山楂叶}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d山楂叶#} {d山楂叶}
[if] {d当归}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d当归#} {d当归}
[if] (cmd) != null
    (cmd)
($cmd) = null
[if] {d柴胡}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d柴胡#} {d柴胡}
[if] {d金银花}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d金银花#} {d金银花}
[if] {d石楠叶}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d石楠叶#} {d石楠叶}
[if] (cmd) != null
    (cmd)
($cmd) = null
[if] {d茯苓}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d茯苓#} {d茯苓}
[if] {d沉香}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d沉香#} {d沉香}
[if] {d熟地黄}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d熟地黄#} {d熟地黄}
[if] (cmd) != null
    (cmd)
($cmd) = null
[if] {d冬虫夏草}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d冬虫夏草#} {d冬虫夏草}
[if] {d络石藤}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d络石藤#} {d络石藤}
[if] {d九香虫}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d九香虫#} {d九香虫}
[if] (cmd) != null
    (cmd)
($cmd) = null
[if] {d凌霄花}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d凌霄花#} {d凌霄花}
[if] {d何首乌}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d何首乌#} {d何首乌}
[if] {d人参}? != null
    ($cmd) = (cmd);dc {r(arg0)} give (:id) {d人参#} {d人参}
[if] (cmd) != null
    (cmd)
dc {r(arg0)} cai
