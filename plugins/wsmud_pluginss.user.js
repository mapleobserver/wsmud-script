// ==UserScript==
// @name         wsmud_pluginss
// @namespace    cqv1
// @version      0.0.32.87
// @date         01/07/2018
// @modified     02/05/2020
// @homepage     https://greasyfork.org/zh-CN/scripts/371372
// @description  武神传说 MUD 武神脚本 武神传说 脚本 qq群367657589
// @author       fjcqv(源程序) & zhzhwcn(提供websocket监听)& knva(做了一些微小的贡献) &Bob.cn(raid.js作者)
// @match        http://*.wsmud.com/*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/vue/dist/vue.js
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.js
// @require      https://cdn.staticfile.org/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard

// ==/UserScript==

(function () {
    'use strict';

    Array.prototype.baoremove = function (dx) {
        if (isNaN(dx) || dx > this.length) {
            return false;
        }
        this.splice(dx, 1);
    };
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    String.prototype.replaceAll = function (s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    };
    var copyToClipboard = function (text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();

        document.execCommand("Copy");
        textarea.parentNode.removeChild(textarea);
    };
    if (WebSocket) {
        console.log('插件可正常运行,Plugins can run normally');

        function show_msg(msg) {
            ws_on_message({
                type: "text",
                data: msg
            });
        }
        var _ws = WebSocket,
            ws, ws_on_message;
        unsafeWindow.WebSocket = function (uri) {
            ws = new _ws(uri);
            document.getElementsByClassName("signinfo")[0].innerHTML = "<HIR>武神传说SS插件正常运行！ QQ群 367657589</HIR>"
            $('.signinfo').on('click', function () {
                ProConsole.init();
            });
        };
        unsafeWindow.WebSocket.prototype = {
            CONNECTING: _ws.CONNECTING,
            OPEN: _ws.OPEN,
            CLOSING: _ws.CLOSING,
            CLOSED: _ws.CLOSED,
            get url() {
                return ws.url;
            },
            get protocol() {
                return ws.protocol;
            },
            get readyState() {
                return ws.readyState;
            },
            get bufferedAmount() {
                return ws.bufferedAmount;
            },
            get extensions() {
                return ws.extensions;
            },
            get binaryType() {
                return ws.binaryType;
            },
            set binaryType(t) {
                ws.binaryType = t;
            },
            get onopen() {
                return ws.onopen;
            },
            set onopen(fn) {
                ws.onopen = fn;
            },
            get onmessage() {
                return ws.onmessage;
            },
            set onmessage(fn) {
                ws_on_message = fn;
                ws.onmessage = WG.receive_message;
            },
            get onclose() {
                return ws.onclose;
            },
            set onclose(fn) {
                ws.onclose = (e)=>{
                    auto_relogin = GM_getValue(role + "_auto_relogin", auto_relogin);
                    fn(e);
                    if(auto_relogin == "开"){
                        setTimeout(() => {
                            console.log(new Date());
                            KEY.do_command("score");
                        }, 10000);
                    }
                }

            },
            get onerror() {
                return ws.onerror;
            },
            set onerror(fn) {
                ws.onerror = fn;
            },
            send: function (text) {
                if (G.cmd_echo) {
                    show_msg('<hiy>' + text + '</hiy>');
                }
                if (text[0] == "$") {
                    WG.SendCmd(text);
                    return;
                }
                if (text[0] == '@') {
                    if (unsafeWindow && unsafeWindow.ToRaid) {
                        ToRaid.perform(text);
                        return;
                    } else {
                        messageAppend("插件未安装,请访问 https://greasyfork.org/zh-CN/scripts/375851-wsmud-raid 下载并安装");
                        window.open("https://greasyfork.org/zh-CN/scripts/375851-wsmud-raid ", '_blank').location;
                    }
                }
                if (text.indexOf('drop') == 0) {
                    var itemids = text.split(' ');
                    var itemid = itemids[itemids.length - 1];
                    WG.getItemNameByid(itemid, function (name) {
                        if (lock_list.indexOf(name) >= 0) {
                            messageAppend(`已锁物品${name}，无法丢弃，请解锁后重试`);
                            return;
                        } else {
                            ws.send(text);
                        }
                    })
                    return;
                }
                if (text.indexOf('jh ') == 0 || text.indexOf("go ") == 0){
                    if(auto_rewardgoto=="开"){
                        WG.Send("tm " + text);
                    }
                }

                switch (text) {
                    case 'sm':
                        T.sm();
                        break;
                    case 'wk':
                        WG.zdwk();
                        break;
                    case 'backup':
                        WG.make_config();
                        break;
                    case 'load':
                        WG.load_config();
                        break;
                    default:
                        ws.send(text);
                        break;
                }
            },
            close: function () {
                ws.close();
            }
        };

        var cmd_queue = [],
            cmd_busy = false,
            echo = false;
        var _send_cmd = function () {
            if (!ws || ws.readyState != 1) {
                cmd_busy = false;
                cmd_queue = []
            } else if (cmd_queue.length > 0) {
                cmd_busy = true;
                var t = new Date().getTime();
                for (var i = 0; i < cmd_queue.length; i++) {
                    if (!cmd_queue[i].timestamp || cmd_queue[i].timestamp >= t - 1300) {
                        cmd_queue.splice(0, i);
                        break
                    }
                }
                for (i = 0; i < Math.min(cmd_queue.length, 5); i++) {
                    if (!cmd_queue[i].timestamp) {
                        try {
                            ws.send(cmd_queue[i].cmd);
                            cmd_queue[i].timestamp = t
                        } catch (e) {
                            cmd_busy = false;
                            cmd_queue = [];
                            return
                        }
                    }
                }
                if (!cmd_queue[cmd_queue.length - 1].timestamp) {
                    setTimeout(_send_cmd, 100)
                } else {
                    cmd_busy = false
                }
            } else {
                cmd_busy = false
            }
        };
        var send_cmd = function (cmd, no_queue) {
            if (ws && ws.readyState == 1) {
                cmd = cmd instanceof Array ? cmd : cmd.split(';');
                if (no_queue) {
                    for (var i = 0; i < cmd.length; i++) {
                        if (G.cmd_echo) {
                            show_msg('<hiy>' + cmd[i] + '</hiy>')
                        }
                        ws.send(cmd[i])
                    }
                } else {
                    for (i = 0; i < cmd.length; i++) {
                        cmd_queue.push({
                            cmd: cmd[i],
                            timestamp: 0
                        })
                    }
                    if (!cmd_busy) {
                        _send_cmd()
                    }
                }
            }
        };

    } else {
        console.log("插件不可运行,请打开'https://greasyfork.org/zh-CN/forum/discussion/41547/x'");
        document.getElementsByClassName("signinfo")[0].innerHTML = "<HIR>武神传说SS插件没有正常运行！请使用CTRL+F5刷新 QQ群 367657589</HIR>"

    }
    var L = {
        msg: function (msg) {
            if (layer) {
                layer.msg(msg, {
                    offset: '50%',
                    shift: 5
                })
            } else {
                messageAppend(msg);
            }
        },
        isMobile: function () {
            var ua = navigator.userAgent;
            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
                isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
                isAndroid = ua.match(/(Android)\s+([\d.]+)/),
                isMobile = isIphone || isAndroid;
            return isMobile;
        }
    };

    var roomItemSelectIndex = -1;
    var timer = 0;
    var cnt = 0;
    var zb_npc;
    var zb_place;
    var next = 0;
    var roomData = [];
    var packData = [];
    var eqData = [];
    var store_list = [];
    var lock_list = [];
    var needfind = {
        "武当派-林间小径": ["go south"],
        "峨眉派-走廊": ["go north", "go south;go south", "go north;go east;go east"],
        "丐帮-暗道": ["go east", "go east;go east", "go east"],
        "逍遥派-林间小道": ["go west;go north", "go south;go south", "go north;go west"],
        "少林派-竹林": ["go north"],
        "逍遥派-地下石室": ["go up"],
        "逍遥派-木屋": ["go south;go south;go south;go south"]
    };
    var goods = {
        "米饭": {
            "id": null,
            "type": "wht",
            "sales": "店小二",
            "place": "扬州城-醉仙楼"
        },
        "包子": {
            "id": null,
            "type": "wht",
            "sales": "店小二",
            "place": "扬州城-醉仙楼"
        },
        "鸡腿": {
            "id": null,
            "type": "wht",
            "sales": "店小二",
            "place": "扬州城-醉仙楼"
        },
        "面条": {
            "id": null,
            "type": "wht",
            "sales": "店小二",
            "place": "扬州城-醉仙楼"
        },
        "扬州炒饭": {
            "id": null,
            "type": "wht",
            "sales": "店小二",
            "place": "扬州城-醉仙楼"
        },
        "米酒": {
            "id": null,
            "type": "wht",
            "sales": "店小二",
            "place": "扬州城-醉仙楼"
        },
        "花雕酒": {
            "id": null,
            "type": "wht",
            "sales": "店小二",
            "place": "扬州城-醉仙楼"
        },
        "女儿红": {
            "id": null,
            "type": "wht",
            "sales": "店小二",
            "place": "扬州城-醉仙楼"
        },
        "醉仙酿": {
            "id": null,
            "type": "hig",
            "sales": "店小二",
            "place": "扬州城-醉仙楼"
        },
        "神仙醉": {
            "id": null,
            "type": "hiy",
            "sales": "店小二",
            "place": "扬州城-醉仙楼"
        },
        "布衣": {
            "id": null,
            "type": "wht",
            "sales": "杂货铺老板 杨永福",
            "place": "扬州城-杂货铺"
        },
        "钢刀": {
            "id": null,
            "type": "wht",
            "sales": "杂货铺老板 杨永福",
            "place": "扬州城-杂货铺"
        },
        "木棍": {
            "id": null,
            "type": "wht",
            "sales": "杂货铺老板 杨永福",
            "place": "扬州城-杂货铺"
        },
        "英雄巾": {
            "id": null,
            "type": "wht",
            "sales": "杂货铺老板 杨永福",
            "place": "扬州城-杂货铺"
        },
        "布鞋": {
            "id": null,
            "type": "wht",
            "sales": "杂货铺老板 杨永福",
            "place": "扬州城-杂货铺"
        },
        "铁戒指": {
            "id": null,
            "type": "wht",
            "sales": "杂货铺老板 杨永福",
            "place": "扬州城-杂货铺"
        },
        "簪子": {
            "id": null,
            "type": "wht",
            "sales": "杂货铺老板 杨永福",
            "place": "扬州城-杂货铺"
        },
        "长鞭": {
            "id": null,
            "type": "wht",
            "sales": "杂货铺老板 杨永福",
            "place": "扬州城-杂货铺"
        },
        "钓鱼竿": {
            "id": null,
            "type": "wht",
            "sales": "杂货铺老板 杨永福",
            "place": "扬州城-杂货铺"
        },
        "鱼饵": {
            "id": null,
            "type": "wht",
            "sales": "杂货铺老板 杨永福",
            "place": "扬州城-杂货铺"
        },
        "铁剑": {
            "id": null,
            "type": "wht",
            "sales": "铁匠铺老板 铁匠",
            "place": "扬州城-打铁铺"
        },
        "钢刀": {
            "id": null,
            "type": "wht",
            "sales": "铁匠铺老板 铁匠",
            "place": "扬州城-打铁铺"
        },
        "铁棍": {
            "id": null,
            "type": "wht",
            "sales": "铁匠铺老板 铁匠",
            "place": "扬州城-打铁铺"
        },
        "铁杖": {
            "id": null,
            "type": "wht",
            "sales": "铁匠铺老板 铁匠",
            "place": "扬州城-打铁铺"
        },
        "铁镐": {
            "id": null,
            "type": "wht",
            "sales": "铁匠铺老板 铁匠",
            "place": "扬州城-打铁铺"
        },
        "飞镖": {
            "id": null,
            "type": "wht",
            "sales": "铁匠铺老板 铁匠",
            "place": "扬州城-打铁铺"
        },
        "金创药": {
            "id": null,
            "type": "hig",
            "sales": "药铺老板 平一指",
            "place": "扬州城-药铺"
        },
        "引气丹": {
            "id": null,
            "type": "hig",
            "sales": "药铺老板 平一指",
            "place": "扬州城-药铺"
        },
        "养精丹": {
            "id": null,
            "type": "hig",
            "sales": "药铺老板 平一指",
            "place": "扬州城-药铺"
        },
    };
    var equip = {
        "铁镐": 0,
    };
    var npcs = {
        "店小二": 0,
        "铁匠铺老板 铁匠": 0,
        "药铺老板 平一指": 0,
        "杂货铺老板 杨永福": 0
    };
    var place = {
        "住房": "jh fam 0 start;go west;go west;go north;go enter",
        "住房-卧室": "jh fam 0 start;go west;go west;go north;go enter;go north",
        "住房-小花园": "jh fam 0 start;go west;go west;go north;go enter;go northeast",
        "住房-炼药房": "jh fam 0 start;go west;go west;go north;go enter;go east",
        "住房-练功房": "jh fam 0 start;go west;go west;go north;go enter;go west",
        "扬州城-钱庄": "jh fam 0 start;go north;go west;store",
        "扬州城-广场": "jh fam 0 start",
        "扬州城-醉仙楼": "jh fam 0 start;go north;go north;go east",
        "扬州城-杂货铺": "jh fam 0 start;go east;go south",
        "扬州城-打铁铺": "jh fam 0 start;go east;go east;go south",
        "扬州城-药铺": "jh fam 0 start;go east;go east;go north",
        "扬州城-衙门正厅": "jh fam 0 start;go west;go north;go north",
        "扬州城-镖局正厅": "jh fam 0 start;go west;go west;go south;go south",
        "扬州城-矿山": "jh fam 0 start;go west;go west;go west;go west",
        "扬州城-喜宴": "jh fam 0 start;go north;go north;go east;go up",
        "扬州城-擂台": "jh fam 0 start;go west;go south",
        "扬州城-当铺": "jh fam 0 start;go south;go east",
        "扬州城-帮派": "jh fam 0 start;go south;go south;go east",
        "扬州城-有间客栈": "jh fam 0 start;go north;go east",
        "扬州城-赌场": "jh fam 0 start;go south;go west",
        "帮会-大门": "jh fam 0 start;go south;go south;go east;go east",
        "帮会-大院": "jh fam 0 start;go south;go south;go east;go east;go east",
        "帮会-练功房": "jh fam 0 start;go south;go south;go east;go east;go east;go north",
        "帮会-聚义堂": "jh fam 0 start;go south;go south;go east;go east;go east;go east",
        "帮会-仓库": "jh fam 0 start;go south;go south;go east;go east;go east;go east;go north",
        "帮会-炼药房": "jh fam 0 start;go south;go south;go east;go east;go east;go south",
        "扬州城-扬州武馆": "jh fam 0 start;go south;go south;go west",
        "扬州城-武庙": "jh fam 0 start;go north;go north;go west",
        "武当派-广场": "jh fam 1 start;",
        "武当派-三清殿": "jh fam 1 start;go north",
        "武当派-石阶": "jh fam 1 start;go west",
        "武当派-练功房": "jh fam 1 start;go west;go west",
        "武当派-太子岩": "jh fam 1 start;go west;go northup",
        "武当派-桃园小路": "jh fam 1 start;go west;go northup;go north",
        "武当派-舍身崖": "jh fam 1 start;go west;go northup;go north;go east",
        "武当派-南岩峰": "jh fam 1 start;go west;go northup;go north;go west",
        "武当派-乌鸦岭": "jh fam 1 start;go west;go northup;go north;go west;go northup",
        "武当派-五老峰": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup",
        "武当派-虎头岩": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup",
        "武当派-朝天宫": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north",
        "武当派-三天门": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north",
        "武当派-紫金城": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north;go north",
        "武当派-林间小径": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north;go north;go north;go north",
        "武当派-后山小院": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north;go north;go north;go north;go north",
        "少林派-广场": "jh fam 2 start;",
        "少林派-山门殿": "jh fam 2 start;go north",
        "少林派-东侧殿": "jh fam 2 start;go north;go east",
        "少林派-西侧殿": "jh fam 2 start;go north;go west",
        "少林派-天王殿": "jh fam 2 start;go north;go north",
        "少林派-大雄宝殿": "jh fam 2 start;go north;go north;go northup",
        "少林派-钟楼": "jh fam 2 start;go north;go north;go northeast",
        "少林派-鼓楼": "jh fam 2 start;go north;go north;go northwest",
        "少林派-后殿": "jh fam 2 start;go north;go north;go northwest;go northeast",
        "少林派-练武场": "jh fam 2 start;go north;go north;go northwest;go northeast;go north",
        "少林派-罗汉堂": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go east",
        "少林派-般若堂": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go west",
        "少林派-方丈楼": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north",
        "少林派-戒律院": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go east",
        "少林派-达摩院": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go west",
        "少林派-竹林": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go north",
        "少林派-藏经阁": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go north;go west",
        "少林派-达摩洞": "jh fam 2 start;go north;go north;go northwest;go northeast;go north;go north;go north;go north;go north",
        "华山派-镇岳宫": "jh fam 3 start;",
        "华山派-苍龙岭": "jh fam 3 start;go eastup",
        "华山派-舍身崖": "jh fam 3 start;go eastup;go southup",
        "华山派-峭壁": "jh fam 3 start;go eastup;go southup;jumpdown",
        "华山派-山谷": "jh fam 3 start;go eastup;go southup;jumpdown;go southup",
        "华山派-山间平地": "jh fam 3 start;go eastup;go southup;jumpdown;go southup;go south",
        "华山派-林间小屋": "jh fam 3 start;go eastup;go southup;jumpdown;go southup;go south;go east",
        "华山派-玉女峰": "jh fam 3 start;go westup",
        "华山派-玉女祠": "jh fam 3 start;go westup;go west",
        "华山派-练武场": "jh fam 3 start;go westup;go north",
        "华山派-练功房": "jh fam 3 start;go westup;go north;go east",
        "华山派-客厅": "jh fam 3 start;go westup;go north;go north",
        "华山派-偏厅": "jh fam 3 start;go westup;go north;go north;go east",
        "华山派-寝室": "jh fam 3 start;go westup;go north;go north;go north",
        "华山派-玉女峰山路": "jh fam 3 start;go westup;go south",
        "华山派-玉女峰小径": "jh fam 3 start;go westup;go south;go southup",
        "华山派-思过崖": "jh fam 3 start;go westup;go south;go southup;go southup",
        "华山派-山洞": "jh fam 3 start;go westup;go south;go southup;go southup;break bi;go enter",
        "华山派-长空栈道": "jh fam 3 start;go westup;go south;go southup;go southup;break bi;go enter;go westup",
        "华山派-落雁峰": "jh fam 3 start;go westup;go south;go southup;go southup;break bi;go enter;go westup;go westup",
        "华山派-华山绝顶": "jh fam 3 start;go westup;go south;go southup;go southup;break bi;go enter;go westup;go westup;jumpup",
        "峨眉派-金顶": "jh fam 4 start",
        "峨眉派-庙门": "jh fam 4 start;go west",
        "峨眉派-广场": "jh fam 4 start;go west;go south",
        "峨眉派-走廊": "jh fam 4 start;go west;go south;go west",
        "峨眉派-休息室": "jh fam 4 start;go west;go south;go east;go south",
        "峨眉派-厨房": "jh fam 4 start;go west;go south;go east;go east",
        "峨眉派-练功房": "jh fam 4 start;go west;go south;go west;go west",
        "峨眉派-小屋": "jh fam 4 start;go west;go south;go west;go north;go north",
        "峨眉派-清修洞": "jh fam 4 start;go west;go south;go west;go south;go south",
        "峨眉派-大殿": "jh fam 4 start;go west;go south;go south",
        "峨眉派-睹光台": "jh fam 4 start;go northup",
        "峨眉派-华藏庵": "jh fam 4 start;go northup;go east",
        "逍遥派-青草坪": "jh fam 5 start",
        "逍遥派-林间小道": "jh fam 5 start;go east",
        "逍遥派-练功房": "jh fam 5 start;go east;go north",
        "逍遥派-木板路": "jh fam 5 start;go east;go south",
        "逍遥派-工匠屋": "jh fam 5 start;go east;go south;go south",
        "逍遥派-休息室": "jh fam 5 start;go west;go south",
        "逍遥派-木屋": "jh fam 5 start;go north;go north",
        "逍遥派-地下石室": "jh fam 5 start;go down;go down",
        "丐帮-树洞内部": "jh fam 6 start",
        "丐帮-树洞下": "jh fam 6 start;go down",
        "丐帮-暗道": "jh fam 6 start;go down;go east",
        "丐帮-破庙密室": "jh fam 6 start;go down;go east;go east;go east",
        "丐帮-土地庙": "jh fam 6 start;go down;go east;go east;go east;go up",
        "丐帮-林间小屋": "jh fam 6 start;go down;go east;go east;go east;go east;go east;go up",
        "杀手楼-大门": "jh fam 7 start",
        "杀手楼-大厅": "jh fam 7 start;go north",
        "杀手楼-暗阁": "jh fam 7 start;go north;go up",
        "杀手楼-铜楼": "jh fam 7 start;go north;go up;go up",
        "杀手楼-休息室": "jh fam 7 start;go north;go up;go up;go east",
        "杀手楼-银楼": "jh fam 7 start;go north;go up;go up;go up;go up",
        "杀手楼-练功房": "jh fam 7 start;go north;go up;go up;go up;go up;go east",
        "杀手楼-金楼": "jh fam 7 start;go north;go up;go up;go up;go up;go up;go up",
        "杀手楼-书房": "jh fam 7 start;go north;go up;go up;go up;go up;go up;go up;go west",
        "杀手楼-平台": "jh fam 7 start;go north;go up;go up;go up;go up;go up;go up;go up",
        "襄阳城-广场": "jh fam 8 start",
        "武道塔": "jh fam 9 start"
    };
    var mpz_path = {
        "武当派": "jh fam 1 start;go west;go northup;go north;go west;go northup;go northup;go northup;go north;go north;go north;go north;go north",
        "华山派": "jh fam 3 start;go westup;go north",
        "少林派": "jh fam 2 start;go north;go north;go northwest;go northeast;go north",
        "峨眉派": "jh fam 4 start;go west;go south;go west;go south",
        "逍遥派": "jh fam 5 start;go west;go east;go down",
        "丐帮": "jh fam 6 start;go down;go east;go east;go east;go east;go east",
    };
    var td_path = {
        "缥缈峰": "cr lingjiu/shanjiao 1 0;cr over;",
        "光明顶": "",
        "天龙寺": "",
        "血刀门": "",
        "古墓派": "",
        "华山论剑": "",
        "侠客岛": "",
        "净念禅宗": "",

    };
    var fb_path = [];
    var drop_list = [];
    var fenjie_list = [];
    //boss黑名单
    var blacklist = "";
    //pfm黑名单
    var blackpfm = [];
    //角色
    var role;
    //门派
    var family = null;
    //师门自动放弃
    var sm_loser = "开";
    //师门自动牌子
    var sm_price = null;
    //师门自动取
    var sm_getstore = null;
    //
    var wudao_pfm = "1";
    //boss战斗前等待(ms)
    var ks_pfm = "2000";
    //boss等待时间(s)
    var ks_wait = "120";
    //自动婚宴
    var automarry = null;
    //自动boss
    var autoKsBoss = null;
    //系列自动
    var stopauto = false;
    //获得物品战士
    var getitemShow = null;
    //自命令展示方式
    var zmlshowsetting = 0;
    //停止后动作
    var auto_command = null;
    //装备列表
    var eqlist = {
        1: [],
        2: [],
        3: []
    };
    //{'unarmed':'','force':'','dodge':'','sword':'','blade':'','club':'','staff':'','whip':'','parry':''}
    var skilllist = {
        1: {},
        2: {},
        3: {}
    };
    //自动施法黑名单
    var unauto_pfm = '';
    //自动施法开关
    var auto_pfmswitch = "开";
    //自动转发路径
    var auto_rewardgoto = "关";
    //自动更新仓库数据
    var auto_updateStore = "关";
    //自动重连
    var auto_relogin = "关";
    var autoeq = 0;
    //自命令数组  type 0 原生 1 自命令 2js
    //[{"name":"name","zmlRun":"zzzz","zmlShow":"1","zmlType":"0"}]
    var zml = [];
    //自定义存取
    var zdy_item_store = '';
    //自定义存取
    var zdy_item_store2 = '';
    //自定义锁
    var zdy_item_lock = '';
    //自定义丢弃
    var zdy_item_drop = '';
    //自定义分解
    var zdy_item_fenjie = '';
    //状态监控 type 类型  ishave  0 =其他任何人 1= 本人  2 仅npc  send 命令数组
    //[{"name":"","type":"status","action":"remove","keyword":"busy","ishave":"0","send":"","isactive":"1","maxcount":10,"pname":"宋远桥","istip":"1"}]
    var ztjk_item = [];
    //  自定义技能开关
    var zdyskills = "关";
    var zdyskilllist = "";
    //欢迎语
    var welcome = '';
    //屏蔽开关
    var shieldswitch = "开"
    //屏蔽列表
    var shield = '';
    //屏蔽关键字列表
    var shieldkey = '';
    //当你学习，练习，打坐中断后，自动去挖矿或以下操作
    var statehml = '';
    //背景图片
    var backimageurl = '';
    //登录后执行
    var loginhml = '';
    //定时任务
    //名称   类型 一次 1 每天 0 发送命令  触发时间 24小时制
    //[{"name":"","type":"0","send":"","h":"","s":"","m":""}]
    var timequestion = [];
    //安静模式
    var silence = '开';
    //dps统计信息
    var pfmnum = 0;
    var pfmdps = 0;
    var dpssakada = '开'
    //funny计算
    var funnycalc = '关'
    //自定义btn
    //[{"name":名称,"send":""},]
    var inzdy_btn = false;
    var zdy_btnlist = [];
    //自动购买
    var auto_buylist = "";
    //快捷键功能
    var exit1 = undefined;
    var exit2 = undefined;
    var exit3 = undefined;
    var KEY = {
        keys: [],
        roomItemSelectIndex: -1,
        init: function () {
            //添加快捷键说明
            $("span[command=stopstate] span:eq(0)").html("S");
            $("span[command=showcombat] span:eq(0)").html("A");
            $("span[command=showtool] span:eq(0)").html("C");
            $("span[command=pack] span:eq(0)").html("B");
            $("span[command=tasks] span:eq(0)").html("L");
            $("span[command=score] span:eq(0)").html("O");
            $("span[command=jh] span:eq(0)").html("J");
            $("span[command=skills] span:eq(0)").html("K");
            $("span[command=message] span:eq(0)").html("U");
            $("span[command=shop] span:eq(0)").html("P");
            $("span[command=stats] span:eq(0)").html("I");
            $("span[command=setting] span:eq(0)").html(",");

            $(document).on("keydown", this.e);
            this.add(27, function () {
                KEY.dialog_close();
            });
            this.add(192, function () {
                $(".map-icon").click();
            });
            this.add(32, function () {
                KEY.dialog_confirm();
            });
            this.add(83, function () {
                KEY.do_command("stopstate");
            });
            this.add(13, function () {
                KEY.do_command("showchat");
            });
            this.add(65, function () {
                KEY.do_command("showcombat");
            });
            this.add(67, function () {
                KEY.do_command("showtool");
            });
            this.add(66, function () {
                KEY.do_command("pack");
            });
            this.add(76, function () {
                KEY.do_command("tasks");
            });
            this.add(79, function () {
                KEY.do_command("score");
            });
            this.add(74, function () {
                KEY.do_command("jh");
            });
            this.add(75, function () {
                KEY.do_command("skills");
            });
            this.add(73, function () {
                KEY.do_command("stats");
            });
            this.add(85, function () {
                KEY.do_command("message");
            });
            this.add(80, function () {
                KEY.do_command("shop");
            });
            this.add(188, function () {
                KEY.do_command("setting");
            });
            this.add(81, function () {
                inzdy_btn ? WG.zdybtnfunc(0) : WG.sm_button();
            });
            this.add(87, function () {
                inzdy_btn ? WG.zdybtnfunc(1) : WG.go_yamen_task();
            });
            this.add(69, function () {
                inzdy_btn ? WG.zdybtnfunc(2) : WG.kill_all();
            });
            this.add(82, function () {
                inzdy_btn ? WG.zdybtnfunc(3) : WG.get_all();
            });
            this.add(84, function () {
                inzdy_btn ? WG.zdybtnfunc(4) : WG.sell_all();
            });
            this.add(89, function () {
                inzdy_btn ? WG.zdybtnfunc(5) : WG.zdwk();
            });
            this.add(9, function () {
                KEY.onRoomItemSelect();
                return false;
            });
            //方向
            this.add(102, function () {
                // NumPad 6 等同于→
                exit1 = G.exits.get("east");
                exit2 = G.exits.get("eastup");
                exit3 = G.exits.get("eastdown");
                if (exit1) {
                    WG.Send("go east")
                } else if (exit2) {
                    {
                        WG.Send("go eastup")
                    }
                } else if (exit3) {
                    {
                        WG.Send("go eastdown")
                    }
                }
                KEY.onChangeRoom();
            });
            this.add(39, function () {
                exit1 = G.exits.get("east");
                exit2 = G.exits.get("eastup");
                exit3 = G.exits.get("eastdown");
                if (exit1) {
                    WG.Send("go east")
                } else if (exit2) {
                    {
                        WG.Send("go eastup")
                    }
                } else if (exit3) {
                    {
                        WG.Send("go eastdown")
                    }
                }
                KEY.onChangeRoom();
            });
            this.add(100, function () {
                exit1 = G.exits.get("west");
                exit2 = G.exits.get("westup");
                exit3 = G.exits.get("westdown");
                if (exit1) {
                    WG.Send("go west")
                } else if (exit2) {
                    {
                        WG.Send("go westup")
                    }
                } else if (exit3) {
                    {
                        WG.Send("go westdown")
                    }
                }
                KEY.onChangeRoom();
            });
            this.add(37, function () {
                exit1 = G.exits.get("west");
                exit2 = G.exits.get("westup");
                exit3 = G.exits.get("westdown");
                if (exit1) {
                    WG.Send("go west")
                } else if (exit2) {
                    {
                        WG.Send("go westup")
                    }
                } else if (exit3) {
                    {
                        WG.Send("go westdown")
                    }
                }
                KEY.onChangeRoom();
            });
            this.add(98, function () {
                // NumPad 2 等同于↓
                exit1 = G.exits.get("south");
                exit2 = G.exits.get("southup");
                exit3 = G.exits.get("southdown");
                if (exit1) {
                    WG.Send("go south")
                } else if (exit2) {
                    {
                        WG.Send("go southup")
                    }
                } else if (exit3) {
                    {
                        WG.Send("go southdown")
                    }
                }
                KEY.onChangeRoom();
            });
            this.add(40, function () {
                // Down Arrow↓
                exit1 = G.exits.get("south");
                exit2 = G.exits.get("southup");
                exit3 = G.exits.get("southdown");
                if (exit1) {
                    WG.Send("go south")
                } else if (exit2) {
                    {
                        WG.Send("go southup")
                    }
                } else if (exit3) {
                    {
                        WG.Send("go southdown")
                    }
                }
                KEY.onChangeRoom();
            });
            this.add(101, function () {
                // NumPad 3 控制down,按住alt时为up
                WG.Send("go down");
            });
            this.add(101 + 512, function () {
                // NumPad 3 控制down,按住alt时为up
                WG.Send("go up");
            });
            this.add(104, function () {
                exit1 = G.exits.get("north");
                exit2 = G.exits.get("northup");
                exit3 = G.exits.get("northdown");
                if (exit1) {
                    WG.Send("go north")
                } else if (exit2) {
                    {
                        WG.Send("go northup")
                    }
                } else if (exit3) {
                    {
                        WG.Send("go northdown")
                    }
                }
                KEY.onChangeRoom();
            });
            this.add(38, function () {
                exit1 = G.exits.get("north");
                exit2 = G.exits.get("northup");
                exit3 = G.exits.get("northdown");
                if (exit1) {
                    WG.Send("go north")
                } else if (exit2) {
                    {
                        WG.Send("go northup")
                    }
                } else if (exit3) {
                    {
                        WG.Send("go northdown")
                    }
                }
                KEY.onChangeRoom();
            });
            this.add(99, function () {
                WG.Send("go southeast");
                KEY.onChangeRoom();
            });
            this.add(97, function () {
                WG.Send("go southwest");
                KEY.onChangeRoom();
            });
            this.add(105, function () {
                WG.Send("go northeast");
                KEY.onChangeRoom();
            });
            this.add(103, function () {
                WG.Send("go northwest");
                KEY.onChangeRoom();
            });

            this.add(49, function () {
                KEY.combat_commands(0);
            });
            this.add(50, function () {
                KEY.combat_commands(1);
            });
            this.add(51, function () {
                KEY.combat_commands(2);
            });
            this.add(52, function () {
                KEY.combat_commands(3);
            });
            this.add(53, function () {
                KEY.combat_commands(4);
            });
            this.add(54, function () {
                KEY.combat_commands(5);
            });
            this.add(55, function () {//7
                KEY.combat_commands(6);
            });
            this.add(56, function () {//8
                KEY.combat_commands(7);
            });
            this.add(57, function () {//9
                KEY.combat_commands(8);
            });
            this.add(48, function () {//0
                KEY.combat_commands(9);
            });
            this.add(45, function () {//-
                KEY.combat_commands(10);
            });
            this.add(61, function () {//=
                KEY.combat_commands(11);
            });

            //alt
            this.add(49 + 512, function () {
                KEY.onRoomItemAction(0);
            });
            this.add(50 + 512, function () {
                KEY.onRoomItemAction(1);
            });
            this.add(51 + 512, function () {
                KEY.onRoomItemAction(2);
            });
            this.add(52 + 512, function () {
                KEY.onRoomItemAction(3);
            });
            this.add(53 + 512, function () {
                KEY.onRoomItemAction(4);
            });
            this.add(54 + 512, function () {
                KEY.onRoomItemAction(5);
            });
            //ctrl
            this.add(49 + 1024, function () {
                KEY.room_commands(0);
            });
            this.add(50 + 1024, function () {
                KEY.room_commands(1);
            });
            this.add(51 + 1024, function () {
                KEY.room_commands(2);
            });
            this.add(52 + 1024, function () {
                KEY.room_commands(3);
            });
            this.add(53 + 1024, function () {
                KEY.room_commands(4);
            });
            this.add(54 + 1024, function () {
                KEY.room_commands(5);
            });
        },
        add: function (k, c) {
            var tmp = {
                key: k,
                callback: c,
            };
            this.keys.push(tmp);
        },
        e: function (event) {
            if ($(".channel-box").is(":visible")) {
                KEY.chatModeKeyEvent(event);
                return;
            }
            if ($(".dialog-confirm").is(":visible") &&
                ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)))
                return;
            if ($('input').is(':focus') || $('textarea').is(':focus')) {
                return;
            }
            var kk = (event.ctrlKey || event.metaKey ? 1024 : 0) + (event.altKey ? 512 : 0) + event.keyCode;
            for (var k of KEY.keys) {
                if (k.key == kk)
                    return k.callback();
            }
        },
        dialog_close: function () {
            $(".dialog-close").click();
        },
        dialog_confirm: function () {
            $(".dialog-btn.btn-ok").click();
        },
        do_command: function (name) {
            $("span[command=" + name + "]").click();
        },
        room_commands: function (index) {
            $("div.combat-panel div.room-commands span:eq(" + index + ")").click();
        },
        combat_commands: function (index) {
            $("div.combat-panel div.combat-commands span.pfm-item:eq(" + index + ")").click();
        },
        chatModeKeyEvent: function (event) {
            if (event.keyCode == 27) {
                KEY.dialog_close();
            } else if (event.keyCode == 13) {
                if ($(".sender-box").val().length) $(".sender-btn").click();
                else KEY.dialog_close();
            }
        },
        onChangeRoom: function () {
            KEY.roomItemSelectIndex = -1;
        },
        onRoomItemSelect: function () {
            if (KEY.roomItemSelectIndex != -1) {
                $(".room_items div.room-item:eq(" + KEY.roomItemSelectIndex + ")").css("background", "#000");
            }
            KEY.roomItemSelectIndex = (KEY.roomItemSelectIndex + 1) % $(".room_items div.room-item").length;
            var curItem = $(".room_items div.room-item:eq(" + KEY.roomItemSelectIndex + ")");
            curItem.css("background", "#444");
            curItem.click();
        },
        onRoomItemAction: function (index) {
            //NPC下方按键
            $(".room_items .item-commands span:eq(" + index + ")").click();
        },
    }

    function messageClear() {
        $(".WG_log pre").html("");
    }
    var log_line = 0;

    function messageAppend(m, t = 0, area = 0) {
        if (area) {
            var ap = m + "\n";
            if (t == 1) {
                ap = "<hiy>" + ap + "</hiy>";
            } else if (t == 2) {
                ap = "<hig>" + ap + "</hig>";
            } else if (t == 3) {
                ap = "<hiw>" + ap + "</hiw>";
            }
            $('.content-message pre').append(ap)
        } else {
            100 < log_line && (log_line = 0, $(".WG_log pre").empty());
            var ap = m + "\n";
            if (t == 1) {
                ap = "<hiy>" + ap + "</hiy>";
            } else if (t == 2) {
                ap = "<hig>" + ap + "</hig>";
            } else if (t == 3) {
                ap = "<hiw>" + ap + "</hiw>";
            }
            $(".WG_log pre").append(ap);
            log_line++;
            $(".WG_log")[0].scrollTop = 99999;
        }
    }
    var sm_array = {
        '武当': {
            "place": "武当派-三清殿",
            "npc": "武当派第二代弟子 武当首侠 宋远桥",
            "sxplace": "武当派-太子岩",
            "sx": "首席弟子"
        },
        '华山': {
            "place": "华山派-镇岳宫",
            "npc": "市井豪杰 高根明",
            "sxplace": "华山派-练武场",
            "sx": "首席弟子"
        },
        '少林': {
            "place": "少林派-天王殿",
            "npc": "少林寺第三十九代弟子 道觉禅师",
            "sxplace": "少林派-练武场",
            "sx": "大师兄"
        },
        '逍遥': {
            "place": "逍遥派-青草坪",
            "npc": "聪辩老人 苏星河",
            "sxplace": "-jh fam 5 start;go west",
            "sx": "首席弟子"
        },
        '丐帮': {
            "place": "丐帮-树洞下",
            "npc": "丐帮七袋弟子 左全",
            "sxplace": "丐帮-破庙密室",
            "sx": "首席弟子"
        },
        '峨眉': {
            "place": "峨眉派-大殿",
            "npc": "峨眉派第四代弟子 静心",
            "sxplace": "峨眉派-广场",
            "sx": "大师姐"
        },
        '武馆': {
            "place": "扬州城-扬州武馆",
            "npc": "武馆教习",
            "sxplace": "扬州城-扬州武馆"
        },
        '杀手楼': {
            "place": "杀手楼-大厅",
            "npc": "杀手教习 何小二",
            "sxplace": "杀手楼-练功房",
            "sx": "金牌杀手"
        },
    };
    var WG = {
        sm_state: -1,
        sm_item: null,
        sm_store: null,
        init: function () {
            $("li[command=SelectRole]").on("click", function () {
                WG.login();
            });
        },
        inArray: function (val, arr) {
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                if (item[0] == "<") {
                    if (item == val) return true;

                } else {
                    if (item != "") {
                        if (val.indexOf(item) >= 0) return true;
                    }
                }
            }
            return false;
        },
        login: function () {
            role = $('.role-list .select').text().split(/[\s\n]/).pop();
            $(".bottom-bar").append("<span class='item-commands' style='display:none'><span WG='WG' cmd=''></span></span>"); //命令行模块
            var html = UI.wgui();
            $(".content-message").after(html);
            $('.content-bottom').after("<div class='zdy-commands'></div>");
            var css = `.zdy-item{
                display: inline-block;border: solid 1px gray;color: gray;background-color: black;
                text-align: center;cursor: pointer;border-radius: 0.25em;min-width: 2.5em;margin-right: 0em;
                margin-left: 0.4em;position: relative;padding-left: 0.4em;padding-right: 0.4em;line-height: 24px;}
                .WG_log{flex: 1;overflow-y: auto;border: 1px solid #404000;max-height: 15em;width: calc(100% - 40px);}
                .WG_log > pre{margin: 0px; white-space: pre-line;}
                .WG_button { width: calc(100% - 40px);}
                .item-plushp{display: inline-block;float: right;width: 100px;}
                .item-dps{display: inline-block;float: right;width: 100px;}
                .settingbox {margin-left: 0.625 em;border: 1px solid gray;background-color: transparent;color: unset;resize: none;width: 80% ;height: 3rem;}
                .runtest textarea{display:block;width:300px;height:160px;border:10px solid #F8F8F8;border-top-width:0;padding:10px;line-height:20px;overflow:auto;background-color:#3F3F3F;color:#eee;font-size:12px;font-family:Courier New}
                .runtest a{position:absolute;right:20px;bottom:20px}
                .layui-btn,.layui-input,.layui-select,.layui-textarea,.layui-upload-button{outline:0;-webkit-appearance:none;transition:all .3s;-webkit-transition:all .3s;box-sizing:border-box}
                .layui-btn{display:inline-block;height:38px;line-height:38px;padding:0 18px;background-color:#009688;color:#fff;white-space:nowrap;text-align:center;font-size:14px;border:none;border-radius:2px;cursor:pointer}
                .layui-btn-normal{background-color:#1E9FFF}
                .layui-layer-moves{background-color:transparent}
                .switch2 {display: inline-block;position: relative;height: 1.25em;width: 3.125em;line-height: 1.25em;
                border-radius: 0.875em;background: #dedede;cursor: pointer;-ms-user-select: none;-moz-user-select: none;
                -webkit-user-select: none;user-select: none;vertical-align: middle;text-align: center;}
                .switch2 > .switch-button {position: absolute;left: 0px;height: 1.25em;width: 1.25em;
                border-radius: 0.875em;background: #fff;box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                transition: 0.3s;-webkit-transition: 0.3s;left: 0px;}
                .switch2 > .switch-text {color:#898989;margin-left: 0.625em;}
                .on>.switch-button {right:0px;left:auto;}
                .on>.switch-text {color:#ffffff;margin-right: 0.625em;    margin-left: 0px;}
                .on {background-color:#008000;}
                .crit{
                    height:24px;
                    position:relative;
                    animation:myfirst 1s;
                    -webkit-animation:myfirst 0.4s; /* Safari and Chrome */
                }
                    @keyframes myfirst
                {
                    0%   {background:red; left:0px; top:0px;}
                    33% {background:red; left:0px; top:-14px;}
                    66% {background:red; left:0px; top:14px;}
                    100% {background:red; left:0px; top:0px;}
                }

                @-webkit-keyframes myfirst /* Safari and Chrome */
                {
                    0%   {background:red; left:0px; top:0px;}
                    33% {background:red; left:0px; top:-30px;}
                    100% {background:red; left:0px; top:0px;}
                }
            `;
            GM_addStyle(css);
            npcs = GM_getValue("npcs", npcs);
            goods = GM_getValue("goods", goods);
            equip = GM_getValue(role + "_equip", equip);
            //初始化角色配置
            GI.configInit();
            if (backimageurl != '') {
                GM_addStyle(`body{background-color:rgb(0,0,0,.25)}
                div{ opacity:1;}
                html{background:rgba(255,255,255,0.25);
                background-image:url('${backimageurl}');
                background-repeat:no-repeat;
                background-size:100% 100%;
                -moz-background-size:100% 100%;} `);
            }


            setTimeout(() => {
                role = role;
                var logintext = '';
                document.title = role + "-MUD游戏-武神传说";
                L.msg(`欢迎使用 ${welcome} 版本号${GM_info.script.version}`);
                KEY.do_command("showtool");
                KEY.do_command("pack");
                KEY.do_command("score");
                WG.SendCmd("score2");
                setTimeout(() => {
                    //bind settingbox
                    KEY.do_command("score");
                    var rolep = role;
                    if (G.level) {
                        rolep = G.level + role;
                        if (G.level.indexOf('武帝') >= 0||G.level.indexOf('武神') >= 0) {
                            $('.zdy-item.zdwk').html("修炼(Y)");
                        }
                    }
                    rolep = welcome + "" + rolep;
                    if (WebSocket) {
                        if (shieldswitch == "开" || silence == '开') {
                            messageAppend('已注入屏蔽系统', 0, 1);
                        }
                        if (npcs['店小二'] == 0) {
                            logintext = `
                                <hiy>欢迎${rolep},插件已加载！第一次使用,请在设置中,初始化ID,并且设置一下是否自动婚宴,自动传送boss
                                插件版本: ${GM_info.script.version}
                                </hiy>`;
                        } else {
                                   $.get("https://wsmud.ii74.com/hello/"+role, (result)=>{

                                       let tmp  = `
                                <hiy>欢迎${rolep},插件已加载！
                                插件版本: ${GM_info.script.version}
                                更新日志: ${result}
                                </hiy>`;
                                        messageAppend(tmp);
                                   });
                        }
                        WG.ztjk_func();
                        WG.zml_showp();
                        WG.dsj_func();
                    } else {
                        logintext = `
                            <hiy>欢迎${role},插件未正常加载！
                            当前浏览器不支持自动喜宴自动boss,请使用火狐浏览器
                            谷歌系浏览器,请在network中勾选disable cache,多刷新几次,直至提示已加载!
                            多次刷新无法仍然出现本提示，请打开tampermonkey 插件设置
                            开启高级设置，在最下方实验 设置 “注入模式：即时”“严格模式：禁用”
                            插件版本: ${GM_info.script.version}
                            </hiy>`;
                    }
                    messageAppend(logintext);
                }, 500);
                KEY.do_command("showcombat");
                //执行记忆面板
                var closeBorad = localStorage.getItem("closeBorad");
                if (closeBorad==="true"){
                    WG.showhideborad()
                }
                WG.runLoginhml();
                //开启定时器
                var systime = setInterval(() => {
                    var myDate = new Date();
                    let timeTips = {
                        data: JSON.stringify({
                            type: "time",
                            h: myDate.getHours(),
                            m: myDate.getMinutes(),
                            s: myDate.getSeconds(),
                            time: myDate.toTimeString()
                        })
                    };
                    WG.receive_message(timeTips);
                }, 1000);
            }, 1000);
        },
        update_goods_id: function () {
            var lists = $(".dialog-list > .obj-list:first");
            var id;
            var name;
            if (lists.length) {
                messageAppend("检测到商品清单");
                for (var a of lists.children()) {
                    a = $(a);
                    id = a.attr("obj");
                    name = $(a.children()[0]).html();
                    goods[name].id = id;
                    messageAppend(name + ":" + id);
                }
                GM_setValue("goods", goods);
                return true;
            } else {
                messageAppend("未检测到商品清单");
                return false;
            }
        },
        update_npc_id: function () {
            var lists = $(".room_items .room-item");

            for (var npc of lists) {
                if (npc.lastElementChild.innerText.indexOf("[") >= 0) {
                    if (npc.lastElementChild.lastElementChild.lastElementChild.lastElementChild == null) {
                        if (npc.lastElementChild.firstChild.nodeType == 3 &&
                            npc.lastElementChild.firstChild.nextSibling.tagName == "SPAN") {
                            npcs[npc.lastElementChild.innerText.split('[')[0]] = $(npc).attr("itemid");
                            messageAppend(npc.lastElementChild.innerText.split('[')[0] + " 的ID:" + $(npc).attr("itemid"));
                        }
                    }
                } else {
                    if (npc.lastElementChild.lastElementChild == null) {
                        npcs[npc.lastElementChild.innerText] = $(npc).attr("itemid");
                        messageAppend(npc.lastElementChild.innerText + " 的ID:" + $(npc).attr("itemid"));
                    }
                }
            }
            GM_setValue("npcs", npcs);
        },
        update_id_all: function () {
            var t = [];
            Object.keys(goods).forEach(function (key) {
                if (t[goods[key].place] == undefined)
                    t[goods[key].place] = goods[key].sales;
            });
            var keys = Object.keys(t);
            var i = 0;
            var state = 0;
            var place, sales;
            //获取
            var timer = setInterval(() => {

                switch (state) {
                    case 0:
                        if (i >= keys.length) {
                            messageAppend("初始化完成");
                            WG.go("武当派-广场");
                            clearInterval(timer);
                            return;
                        }
                        place = keys[i];
                        sales = t[place];
                        WG.go(place);
                        state = 1;
                        break;
                    case 1:
                        WG.update_npc_id();
                        var id = npcs[sales];
                        WG.Send("list " + id);
                        state = 2;
                        break;
                    case 2:
                        if (WG.update_goods_id()) {
                            state = 0;
                            i++;
                        } else
                            state = 1;
                        break;
                }
            }, 1000);
        },
        update_store_hook: undefined,
        update_store: async function () {
            WG.update_store_hook = WG.add_hook(['dialog', 'text'], (data) => {
                if (data.dialog == 'list' && data.max_store_count) {
                    messageAppend("<hio>仓库信息获取</hio>开始");
                    var stores = data.stores;
                    store_list = [];
                    for (let store of stores) {
                        store_list.push(store.name.toLowerCase());
                    }
                    zdy_item_store = store_list.join(',');
                    $('#store_info').val(zdy_item_store);
                    GM_setValue(role + "_zdy_item_store", zdy_item_store);
                } else if (data.type == 'text' && data.msg == '没有这个玩家。') {
                    messageAppend("<hio>仓库信息获取</hio>完成");

                    $('.dialog-close').click();
                    WG.remove_hook(WG.update_store_hook);
                    WG.update_store_hook = undefined;
                }
            });
            WG.SendCmd("$to 扬州城-广场;$to 扬州城-钱庄;look3 1");
        },
        clean_dps: function () {
            pfmdps = 0;
            pfmnum = 0;
        },
        Send: async function (cmd) {
            if (WebSocket) {
                send_cmd(cmd, true);
            } else {
                if (cmd) {
                    cmd = cmd instanceof Array ? cmd : cmd.split(';');
                    for (var c of cmd) {
                        $("span[WG='WG']").attr("cmd", c).click();
                    };
                }
            }
        },
        SendStep: async function (cmd) {
            if (cmd) {
                cmd = cmd instanceof Array ? cmd : cmd.split(';');
                for (var c of cmd) {
                    WG.SendCmd(c);
                    await WG.sleep(12000);
                };
            }
        },
        SendCmd: async function (cmd) {
            if (cmd) {
                if (cmd.indexOf(",") >= 0) {
                    if (cmd instanceof Array) {
                        cmd = cmd;
                    } else {
                        if (cmd.indexOf(";") >= 0) {
                            cmd = cmd.split(";");
                        } else {
                            cmd = cmd.split(",");
                        }
                    }
                } else {
                    cmd = cmd instanceof Array ? cmd : cmd.split(';');
                }
                let idx = 0;
                let cmds = '';
                for (var c of cmd) {
                    if (c.indexOf("$") >= 0) {
                        if (c[0] == "$") {
                            c = c.replace("$", "");
                            let p0 = c.split(" ")[0];
                            let p1 = c.split(" ")[1];
                            cmds = cmd.join(";");
                            eval("T." + p0 + "(" + idx + ",'" + p1 + "','" + cmds + "')");
                            return;
                        } else {
                            var p_c = c.split(" ");
                            p_c = p_c[p_c.length - 1];
                            // buy $sitem from $snpc
                            if (p_c) {
                                if (p_c[0] == "$") {
                                    p_c = p_c.replace("$", "");
                                    let patt = new RegExp(/\".*?\"/);
                                    let result = patt.exec(p_c)[0];
                                    cmds = cmd.join(";");
                                    eval("T." + p_c.split('(')[0] + "(" + idx + "," + result + ",'" + cmds + "')");
                                    return;
                                } else {
                                    p_c = c.split(" ");
                                    if (p_c[1].indexOf('$') >= 0) {
                                        p_c = p_c[1].replace("$", "");
                                        let patt = new RegExp(/\".*?\"/);
                                        let result = patt.exec(p_c)[0];
                                        cmds = cmd.join(";");
                                        eval("T." + p_c.split('(')[0] + "(" + idx + "," + result + ",'" + cmds + "')");
                                        return;
                                    }
                                }
                            } else {

                                return;
                            }
                        }
                    }
                    //npc id解析
                    if (c.indexOf("%") >= 0) {
                        var rep = c.match("\%([^%]+)\%");
                        if (npcs[rep[1]] != undefined) {
                            var subStr = new RegExp('\%([^%]+)\%'); //创建正则表达式对象
                            c = c.replace(subStr, npcs[rep[1]]);
                        } else {
                            for (let item of roomData) {
                                if (item != 0) {
                                    if (item.name.indexOf(rep[1]) >= 0) {
                                        var subStr = new RegExp('\%([^%]+)\%');
                                        c = c.replace(subStr, item.id);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    //商店 id解析
                    if (c.indexOf("*") >= 0) {
                        var rep = c.match("\\*([^%]+)\\*");
                        if (goods[rep[1]] != undefined) {
                            var subStr = new RegExp('\\*([^%]+)\\*');
                            c = c.replace(subStr, goods[rep[1]].id);
                        }
                    }

                    WG.Send(c);
                    idx = idx + 1;
                };
            }
        },
        sleep: function (time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        },
        stopAllAuto: function () {
            stopauto = true;
        },
        reSetAllAuto: function () {
            stopauto = false;
        },
        go: async function (p) {
            if (needfind[p] == undefined) {
                if (WG.at(p)) {
                    return;
                }
            }
            if (place[p] != undefined) {
                G.ingo = true;
                await WG.SendCmd(place[p]);
                G.ingo = false;
            }
        },
        at: function (p) {
            var w = $(".room-name").html();
            return w.indexOf(p) == -1 ? false : true;
        },

        getIdByName: function (n) {
            for (let i = 0; i < roomData.length; i++) {
                if (roomData[i].name && roomData[i].name.indexOf(n) >= 0) {
                    return roomData[i].id;
                }
            }
            return null;
        },
        smhook: undefined,
        ungetStore: false,
        sm: function () {
            if (!WG.smhook) {
                WG.smhook = WG.add_hook('text', function (data) {
                    if (data.msg.indexOf("辛苦了， 你先去休息") >= 0 ||
                        data.msg.indexOf("和本门毫无瓜葛") >= 0 ||
                        data.msg.indexOf("你没有") >= 0
                    ) {
                        WG.Send("taskover signin");
                        WG.sm_state = -1;
                        $(".sm_button").text("师门(Q)");
                        WG.remove_hook(WG.smhook);
                        WG.smhook = undefined;
                    }
                });
            }
            switch (WG.sm_state) {
                case 0:
                    //前往师门接收任务
                    WG.go(sm_array[family].place);
                    WG.sm_state = 1;
                    setTimeout(WG.sm, 500);
                    break;
                case 1:
                    //接受任务
                    var lists = $(".room_items .room-item");
                    var id = null;
                    for (var npc of lists) {
                        if (npc.lastElementChild.innerText.indexOf("[") >= 0) {
                            if (npc.lastElementChild.lastElementChild.lastElementChild.lastElementChild == null) {
                                if (npc.lastElementChild.firstChild.nodeType == 3 &&
                                    npc.lastElementChild.firstChild.nextSibling.tagName == "SPAN") {
                                    if (npc.lastElementChild.innerText.split('[')[0] == sm_array[family].npc)
                                        id = $(npc).attr("itemid");
                                }
                            }
                        } else {
                            if (npc.lastElementChild.lastElementChild == null) {
                                if (npc.lastElementChild.innerText == sm_array[family].npc) {
                                    id = $(npc).attr("itemid");
                                }
                            }
                        }
                    }
                    if (id != undefined) {
                        WG.Send("task sm " + id);
                        WG.Send("task sm " + id);
                        WG.sm_state = 2;
                    } else {
                        WG.update_npc_id();
                        WG.sm_state = 0;
                    }
                    setTimeout(WG.sm, 500);
                    break;
                case 2:
                    var mysm_loser = GM_getValue(role + "_sm_loser", sm_loser);
                    //获取师门任务物品
                    var item = $("span[cmd$='giveup']:last").parent().prev();
                    if (item.length == 0) {
                        WG.sm_state = 0;
                        setTimeout(WG.sm, 500);
                        return;
                    };
                    var itemName = item.html();
                    item = item[0].outerHTML;
                    if (WG.ungetStore) {
                        if (mysm_loser == "开") {
                            $("span[cmd$='giveup']:last").click();
                            messageAppend("放弃任务");
                            WG.ungetStore = false;
                            WG.sm_state = 0;
                            setTimeout(WG.sm, 150);
                            return;
                        } else if (mysm_loser == "关") {
                            WG.sm_state = -1;
                            $(".sm_button").text("师门(Q)");
                        }
                    }
                    //能上交直接上交
                    var tmpObj = $("span[cmd$='giveup']:last").prev();
                    for (let i = 0; i < 6; i++) {
                        if (tmpObj.children().html()) {
                            if (tmpObj.html().indexOf(item) >= 0) {
                                tmpObj.click();
                                messageAppend("自动上交" + item);
                                WG.sm_state = 0;
                                setTimeout(WG.sm, 500);
                                return;
                            }
                            tmpObj = tmpObj.prev();
                        }
                    }
                    //不能上交自动购买
                    WG.sm_item = goods[itemName];
                    if (item != undefined && WG.inArray(item, store_list) && sm_getstore == "开") {
                        if (item.indexOf("hiz") >= 0 || item.indexOf("hio") >= 0) {
                            var a = window.confirm("您确定要交稀有物品吗");
                            if (a) {
                                messageAppend("自动仓库取" + item);
                                WG.sm_store = item;
                                WG.sm_state = 4;
                                setTimeout(WG.sm, 500);
                                return;
                            }
                        } else {
                            messageAppend("自动仓库取" + item);
                            WG.sm_store = item;
                            WG.sm_state = 4;
                            setTimeout(WG.sm, 500);
                            return;
                        }
                    }
                    if (WG.sm_item != undefined && item.indexOf(WG.sm_item.type) >= 0) {
                        WG.go(WG.sm_item.place);
                        messageAppend("自动购买" + item);
                        WG.sm_state = 3;
                        setTimeout(WG.sm, 500);
                    } else {
                        if (sm_price == "开") {
                            let pz = [{}, {}, {}, {}, {}]
                            tmpObj = $("span[cmd$='giveup']:last").prev();
                            for (let i = 0; i < 6; i++) {
                                if (tmpObj.children().html()) {
                                    if (tmpObj.html().indexOf('放弃') == -1 &&
                                        tmpObj.html().indexOf('令牌') >= 0) {
                                        if (tmpObj.html().indexOf('hig') >= 0) {
                                            pz[0] = tmpObj;
                                        }
                                        if (tmpObj.html().indexOf('hic') >= 0) {
                                            pz[1] = tmpObj;
                                        }
                                        if (tmpObj.html().indexOf('hiy') >= 0) {
                                            pz[2] = tmpObj;
                                        }
                                        if (tmpObj.html().indexOf('hiz') >= 0) {
                                            pz[3] = tmpObj;
                                        }
                                        if (tmpObj.html().indexOf('hio') >= 0) {
                                            pz[4] = tmpObj;
                                        }
                                    }
                                }
                                tmpObj = tmpObj.prev();
                            }
                            let _p = false;
                            for (let p of pz) {
                                if (p.html != undefined) {
                                    p.click();
                                    messageAppend("自动上交牌子");
                                    WG.sm_state = 0;
                                    _p = true;
                                    setTimeout(WG.sm, 500);
                                    return;
                                }
                            }
                            if (!_p) {
                                messageAppend("没有牌子并且无法购买" + item);
                                if (mysm_loser == "关") {
                                    WG.sm_state = -1;
                                    $(".sm_button").text("师门(Q)");
                                } else if (mysm_loser == "开") {
                                    $("span[cmd$='giveup']:last").click();
                                    messageAppend("放弃任务");
                                    WG.sm_state = 0;
                                    setTimeout(WG.sm, 500);
                                    return;
                                }
                            }
                        } else {
                            messageAppend("无法购买" + item);
                            if (mysm_loser == "关") {
                                WG.sm_state = -1;
                                $(".sm_button").text("师门(Q)");
                            } else if (mysm_loser == "开") {
                                $("span[cmd$='giveup']:last").click();
                                messageAppend("放弃任务");
                                WG.sm_state = 0;
                                setTimeout(WG.sm, 500);
                                return;
                            }
                        }
                    }
                    break;
                case 3:
                    WG.go(WG.sm_item.place);
                    if (WG.buy(WG.sm_item)) {
                        WG.sm_state = 0;
                    }
                    setTimeout(WG.sm, 500);
                    break;
                case 4:
                    var mysm_loser = GM_getValue(role + "_sm_loser", sm_loser);
                    WG.go("扬州城-钱庄");
                    WG.qu(WG.sm_store, (res) => {
                        if (res) {
                            WG.sm_state = 0;
                            setTimeout(WG.sm, 500);
                        } else {
                            messageAppend("无法取" + WG.sm_store);
                            if (WG.sm_item != undefined && WG.sm_store.indexOf(WG.sm_item.type) >= 0) {
                                WG.go(WG.sm_item.place);
                                messageAppend("自动购买" + WG.sm_store);
                                WG.sm_state = 3;
                                setTimeout(WG.sm, 500);
                                return;
                            } else {
                                if (mysm_loser == "关") {
                                    WG.sm_state = -1;
                                    $(".sm_button").text("师门(Q)");
                                } else if (mysm_loser == "开") {
                                    WG.ungetStore = true;
                                    WG.sm_state = 0;
                                    setTimeout(WG.sm, 500);
                                }
                            }
                        }
                    });
                    break;
                default:
                    break;
            }
        },
        sm_button: function () {
            if (WG.sm_state >= 0) {
                WG.sm_state = -1;
                $(".sm_button").text("师门(Q)");
            } else {
                WG.sm_state = 0;
                $(".sm_button").text("停止(Q)");
                setTimeout(WG.sm, 50);
            }
        },
        buy: function (good) {
            var tmp = npcs[good.sales];
            if (tmp == undefined) {
                WG.update_npc_id();
                return false;
            }
            WG.Send("list " + tmp);
            WG.Send("buy 1 " + good.id + " from " + tmp);
            return true;
        },
        qu: function (good, callback) {
            setTimeout(() => {
                let storestatus = false;
                $(".obj-item").each(function () {
                    if ($(this).html().toLowerCase().indexOf(good) != -1) {
                        storestatus = true;
                        var id = $(this).attr("obj")
                        WG.Send("qu 1 " + id);
                        return;
                    }
                })
                callback(storestatus);
            }, 1000);

        },
        Give: function (items) {
            var tmp = npcs["店小二"];
            if (tmp == undefined) {
                WG.update_npc_id();
                return false;
            }
            WG.Send("give " + tmp + " " + items);
            return true;
        },
        eq: function (e) {
            WG.Send("eq " + equip[e]);
        },
        ask: function (npc, i) {
            npc = npcs[npc];
            npc != undefined ? WG.Send("ask" + i + " " + npc) : WG.update_npc_id();
        },
        yamen_lister: undefined,
        go_yamen_task: async function () {
            if (!WG.yamen_lister) {
                WG.yamen_lister = WG.add_hook('text', function (data) {
                    if (data.msg.indexOf("最近没有在逃的逃犯了，你先休息下吧。") >= 0) {
                        clearInterval(WG.check_yamen_task);
                        WG.check_yamen_task = 'over';
                        WG.remove_hook(WG.yamen_lister);
                        WG.yamen_lister = undefined;
                    } else if (data.msg.indexOf("没有这个人") >= 0) {
                        WG.update_npc_id();
                    }
                });
            }
            WG.go("扬州城-衙门正厅");
            await WG.sleep(200);
            WG.update_npc_id();
            WG.ask("扬州知府 程药发", 1);
            if (WG.check_yamen_task == 'over') {
                return;
            }
            window.setTimeout(WG.check_yamen_task, 1000);
        },
        check_yamen_task: function () {
            if (WG.check_yamen_task == 'over') {
                return;
            }
            messageAppend("查找任务中");
            var task = $(".task-desc:eq(-2)").text();
            if (task.indexOf("扬州知府") == -1) {
                task = $(".task-desc:eq(-3)").text();
            }
            if (task.length == 0) {
                KEY.do_command("tasks");
                window.setTimeout(WG.check_yamen_task, 1000);
                return;
            }
            try {
                zb_npc = task.match("犯：([^%]+)，据")[1];
                zb_place = task.match("在([^%]+)出")[1];
                messageAppend("追捕任务：" + zb_npc + "   地点：" + zb_place);
                KEY.do_command("score");
                WG.go(zb_place);
                window.setTimeout(WG.check_zb_npc, 1000);
            } catch (error) {
                messageAppend("查找衙门追捕失败");
                window.setTimeout(WG.check_yamen_task, 1000);
            }
        },
        zb_next: 0,
        check_zb_npc: function () {
            var lists = $(".room_items .room-item");
            var found = false;

            for (var npc of lists) {
                if (npc.innerText.indexOf(zb_npc) != -1) {
                    found = true;
                    WG.Send("kill " + $(npc).attr("itemid"));
                    messageAppend("找到" + zb_npc + "，自动击杀！！！");
                    WG.zb_next = 0;
                    return;
                }
            }
            var fj = needfind[zb_place];
            if (!found && needfind[zb_place] != undefined && WG.zb_next < fj.length) {
                messageAppend("寻找附近");
                WG.Send(fj[WG.zb_next]);
                WG.zb_next++;
            }
            if (!found) {
                window.setTimeout(WG.check_zb_npc, 1000);
            }
        },
        kill_all: function () {
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                if ($(npc).html().indexOf("尸体") == -1) {
                    WG.Send("kill " + $(npc).attr("itemid"));
                }
            }
        },
        get_all: function () {
            var lists = $(".room_items .room-item");
            for (var npc of lists) {
                WG.Send("get all from " + $(npc).attr("itemid"));
            }
        },
        clean_all: function () {
            WG.go("扬州城-打铁铺");
            WG.Send("sell all");
        },
        sort_hook: undefined,
        sort_all: function () {

            var storeset = [
            ];
            if (WG.sort_hook) {
                messageAppend("<hio>仓库排序</hio>运行中");
                messageAppend("<hio>仓库排序</hio>手动结束");
                WG.remove_hook(WG.sort_hook);
                WG.sort_hook = undefined;
                return;
            }
            var sortCmd = "";
            var getandstore = function (set) {

                var cmds = [];
                for (let s of set) {
                    cmds.push("qu " + s.count + " " + s.id + ";$wait 350;");
                }
                set = set.sort(function (a, b) {
                    return a.name.length - b.name.length;
                })
                for (let s of set) {
                    cmds.push("store " + s.count + " " + s.id + ";$wait 350;");
                }
                return cmds.join("");
            }
            WG.sort_hook = WG.add_hook(['dialog', 'text'], (data) => {
                if (data.type == 'dialog' && data.dialog == 'list') {
                    if (data.stores == undefined) {
                        return;
                    }
                const colorSet = ['wht','hig','hic','hiy','hiz','hio','red','hir','ord'];

                    for (let store of data.stores) {
                        let num = 0;
                        for (let cx of colorSet){
                            if (store.name.toLocaleLowerCase().indexOf(cx) >= 0) {
                                if(storeset[num]){
                                    storeset[num].push(store);
                                }else{
                                    storeset[num] = [store];
                                }
                            }
                            num++;
                        }

                    }
                    for (let item of storeset) {
                        if(item){
                            sortCmd += getandstore(item);
                         }
                    }
                    sortCmd += "look3 1";
                    WG.SendCmd(sortCmd);
                } else if (data.type == 'text' && data.msg == '没有这个玩家。') {
                    messageAppend("<hio>仓库排序</hio>完成");
                    WG.remove_hook(WG.sort_hook);
                    WG.sort_hook = undefined;
                }

            });
            messageAppend("<hio>仓库排序</hio>开始");
            if (WG.at("扬州城-钱庄")) {
                WG.Send("store");
            } else {
                WG.go("扬州城-钱庄");
            }
        },
        sort_all_bag: function () {

            var storeset = [
            ];
            if (WG.sort_hook) {
                messageAppend("<hio>背包排序</hio>运行中");
                messageAppend("<hio>背包排序</hio>手动结束");
                WG.remove_hook(WG.sort_hook);
                WG.sort_hook = undefined;
                return;
            }
            var sortCmd = "";
            var getandstore = function (set) {

                var cmds = [];
                for (let s of set) {
                    cmds.push("store " + s.count + " " + s.id + ";$wait 350;");
                }
                set = set.sort(function (a, b) {
                    return a.name.length - b.name.length;
                })
                for (let s of set) {
                    cmds.push("qu " + s.count + " " + s.id + ";$wait 350;");
                }
                return cmds.join("");
            }
            WG.sort_hook = WG.add_hook(['dialog', 'text'], (data) => {
                if (data.type == 'dialog' && data.dialog == 'pack') {
                    if (data.items == undefined) {
                        return;
                    }
                    const colorSet = ['wht','hig','hic','hiy','hiz','hio','red','hir','ord'];

                    for (let store of data.items) {
                        let num = 0;
                        for (let cx of colorSet){
                            if (store.name.toLocaleLowerCase().indexOf(cx) >= 0) {
                                if(storeset[num]){
                                    storeset[num].push(store);
                                }else{
                                    storeset[num] = [store];
                                }
                            }
                            num++;
                        }
                    }
                    for (let item of storeset) {
                        if(item){
                           sortCmd += getandstore(item);
                        }
                    }
                    sortCmd += "look3 1";
                    WG.SendCmd(sortCmd);
                } else if (data.type == 'text' && data.msg == '没有这个玩家。') {
                    messageAppend("<hio>背包排序</hio>完成,执行后请刷新并重新登录");
                    WG.remove_hook(WG.sort_hook);
                    WG.sort_hook = undefined;
                }

            });
            messageAppend("<hio>背包排序</hio>开始");
            if (WG.at("扬州城-钱庄")) {
                WG.Send("pack");
                KEY.dialog_close();
                //WG.Send("store");
            } else {
                WG.go("扬州城-钱庄");
            }
        },
        packup_listener: null,
        sell_all: function (store = 1, fenjie = 1, drop = 1) {
            if (WG.packup_listener) {
                messageAppend("<hio>包裹整理</hio>运行中");
                messageAppend("<hio>包裹整理</hio>手动结束");
                WG.remove_hook(WG.packup_listener);
                WG.packup_listener = undefined;
                return;
            }
            let stores = [];
            WG.packup_listener = WG.add_hook(["dialog", "text"], (data) => {
                if (data.type == "dialog" && data.dialog == "list") {
                    if (data.stores == undefined) {
                        return;
                    }
                    stores = [];
                    //去重
                    for (let i = 0; i < data.stores.length; i++) {
                        let s = null;
                        for (let j = 0; j < stores.length; j++) {
                            if (stores[j].name == data.stores[i].name.toLowerCase()) {
                                s = stores[j];
                                break;
                            }
                        }
                        if (s != null) {
                            s.count += data.stores[i].count;
                        } else {
                            stores.push(data.stores[i]);
                        }
                    }
                } else if (data.type == "dialog" && data.dialog == "pack") {
                    let cmds = [];
                    let dropcmds = [];
                    if (data.items == undefined) {
                        return;
                    }
                    for (var i = 0; i < data.items.length; i++) {
                        //仓库
                        if (store_list.length != 0) {
                            if (WG.inArray(data.items[i].name.toLowerCase(), store_list) && store) {
                                if (data.items[i].can_eq) {
                                    //装备物品，不能叠加，计算总数
                                    let store = null;
                                    for (let j = 0; j < stores.length; j++) {
                                        if (stores[j].name == data.items[i].name.toLowerCase()) {
                                            store = stores[j];
                                            break;
                                        }
                                    }
                                    if (store != null) {
                                        if (store.count < 4) {
                                            store.count += data.items[i].count;
                                            cmds.push("store " + data.items[i].count + " " + data.items[i].id);
                                            cmds.push("$wait 200");
                                            messageAppend("<hio>包裹整理</hio>" + data.items[i].name + "储存到仓库");
                                        } else {
                                            messageAppend("<hio>包裹整理</hio>" + data.items[i].name + "超过设置的储存上限");
                                        }
                                    } else {
                                        stores.push(data.items[i]);
                                        cmds.push("store " + data.items[i].count + " " + data.items[i].id);
                                        cmds.push("$wait 200");
                                        messageAppend("<hio>包裹整理</hio>" + data.items[i].name + "储存到仓库");
                                    }
                                } else {
                                    cmds.push("store " + data.items[i].count + " " + data.items[i].id);
                                    cmds.push("$wait 200");
                                    messageAppend("<hio>包裹整理</hio>" + data.items[i].name + "储存到仓库");
                                }
                            }
                        }
                        //丢弃
                        if (WG.inArray(data.items[i].name.toLowerCase(), drop_list) && drop && (data.items[i].name.indexOf("★") == -1 || data.items[i].name.indexOf("☆") == -1)) {
                            if (lock_list.indexOf(data.items[i].name.toLowerCase()) >= 0) { continue; }
                            if (data.items[i].count == 1) {
                                dropcmds.push("drop " + data.items[i].id);
                                dropcmds.push("$wait 200");
                            } else {
                                dropcmds.push("drop " + data.items[i].count + " " + data.items[i].id);
                                dropcmds.push("$wait 200");
                            }

                            messageAppend("<hio>包裹整理</hio>" + data.items[i].name + "丢弃");

                        }
                        //分解
                        if (fenjie_list.length && WG.inArray(data.items[i].name.toLowerCase(), fenjie_list) && data.items[i].name.indexOf("★") == -1 && fenjie) {
                            cmds.push("fenjie " + data.items[i].id);
                            cmds.push("$wait 200");
                            messageAppend("<hio>包裹整理</hio>" + data.items[i].name + "分解");

                        }
                    }
                    cmds.push("$to 扬州城-杂货铺");
                    cmds.push("sell all");
                    cmds.push("$wait 1000");
                    cmds = cmds.concat(dropcmds);
                    cmds.push("look3 1");
                    if (cmds.length > 0) {
                        WG.SendCmd(cmds);
                    }
                } else if (data.type == 'text' && data.msg == '没有这个玩家。') {
                    messageAppend("<hio>包裹整理</hio>完成");
                    WG.remove_hook(WG.packup_listener);
                    WG.packup_listener = undefined;
                }
            });

            messageAppend("<hio>包裹整理</hio>开始");
            WG.go("扬州城-钱庄");
            WG.Send("store;pack");
        },
        cmd_echo_button: function () {
            if (G.cmd_echo) {
                G.cmd_echo = false;
                messageAppend("<hio>命令代码关闭</hio>");
            } else {
                G.cmd_echo = true;
                ProConsole.init();
                messageAppend("<hio>命令代码显示</hio>");
            }
        },
        getItemNameByid: (id, callback) => {
            packData.forEach(function (item) {
                if (item != 0) {
                    if (item.id == id) {
                        callback(item.name);
                        return;
                    }
                }
            })
        },
        addstore: (itemname) => {
            if (zdy_item_store2 == "") {
                zdy_item_store2 = itemname;
            } else {
                zdy_item_store2 = zdy_item_store2 + "," + itemname;
            }
            GM_setValue(role + "_zdy_item_store2", zdy_item_store2);

            $('#store_info2').val(zdy_item_store2);

            if (zdy_item_store2) {
                store_list = zdy_item_store2.split(",");
            }

            messageAppend("添加存仓成功" + itemname);
        },
        addlock: (itemname) => {
            if (zdy_item_lock == "") {
                zdy_item_lock = itemname;
            } else {
                zdy_item_lock = zdy_item_lock + "," + itemname;
            }
            GM_setValue(role + "_zdy_item_lock", zdy_item_lock);

            $('#lock_info').val(zdy_item_lock);

            if (zdy_item_lock) {
                lock_list = zdy_item_lock.split(",");
            }

            messageAppend("添加物品锁成功" + itemname);
        },
        dellock: (itemname) => {
            lock_list.remove(itemname);
            zdy_item_lock = lock_list.join(',');
            GM_setValue(role + "_zdy_item_lock", zdy_item_lock);

            $('#lock_info').val(zdy_item_lock);

            messageAppend("解锁物品锁成功" + itemname);
        },
        addfenjieid: (itemname) => {
            if (zdy_item_fenjie == "") {
                zdy_item_fenjie = itemname;
            } else {
                zdy_item_fenjie = zdy_item_fenjie + "," + itemname;
            }
            GM_setValue(role + "_zdy_item_fenjie", zdy_item_fenjie);


            if (zdy_item_fenjie) {
                fenjie_list = zdy_item_fenjie.split(",");
            }
            messageAppend("添加分解成功" + itemname);

            $('#store_fenjie_info').val(zdy_item_fenjie);
        },
        adddrop: (itemname) => {
            if (itemname.indexOf("hio") >= 0 || itemname.indexOf("hir") >= 0 || itemname.indexOf("ord") >= 0) {
                messageAppend("高级物品,不添加整理时丢弃" + itemname);
                return;
            }
            if (zdy_item_drop == "") {
                zdy_item_drop = itemname;
            } else {
                zdy_item_drop = zdy_item_drop + "," + itemname;
            }
            GM_setValue(role + "_zdy_item_drop", zdy_item_drop);
            if (zdy_item_drop) {
                drop_list = zdy_item_drop.split(",");
            }
            messageAppend("添加丢弃成功" + itemname);

            $('#store_drop_info').val(zdy_item_drop);
        },

        zdwk: function (v,x=true) {
            if(x){
                if (G.level) {
                    if (G.level.indexOf('武帝') >= 0||G.level.indexOf('武神') >= 0) {
                        WG.go("住房-练功房");
                        WG.Send("xiulian");
                        return;
                    }
                }
            }
            if (WebSocket) {
                if (v == "remove") {
                    if (G.wk_listener) {
                        WG.remove_hook(G.wk_listener);
                        G.wk_listener = undefined;
                    }
                    return;
                }
                if (G.wk_listener) return;
                let tiejiang_id;
                let wk_busy = false;
                G.wk_listener = WG.add_hook(["dialog", "text"], function (data) {
                    if (data.type == "dialog" && data.dialog == "pack") {
                        //检查是否装备铁镐
                        let tiegao_id;
                        if (data.name) {
                            if (data.name == "<wht>铁镐</wht>") {
                                WG.Send("eq " + data.id);
                                WG.go("扬州城-矿山");
                                WG.Send("wa");
                                return;
                            }
                        } else if (data.items) {
                            if (data.eqs[0] && data.eqs[0].name.indexOf("铁镐") > -1) {
                                WG.go("扬州城-矿山");
                                WG.Send("wa");
                                return;
                            } else {
                                for (let i = 0; i < data.items.length; i++) {
                                    let item = data.items[i];
                                    if (item.name.indexOf("铁镐") > -1) {
                                        tiegao_id = item.id;
                                        break;
                                    }
                                }
                                if (tiegao_id) {
                                    WG.Send("eq " + tiegao_id);
                                    WG.go("扬州城-矿山");
                                    WG.Send("wa");
                                    WG.zdwk("remove");
                                    return;
                                } else {
                                    WG.go("扬州城-打铁铺");
                                    WG.Send("look 1");
                                }
                            }
                        }
                    }
                    if (data.type == 'text' && data.msg == '你要看什么？') {
                        let id = WG.getIdByName('铁匠');
                        if (id) {
                            tiejiang_id = id;
                            WG.Send('list ' + id);
                        } else {
                            messageAppend("<hio>自动挖矿</hio>未发现铁匠");
                            WG.zdwk("remove");
                        }
                    } else if (data.type == 'text') {
                        if (data.msg == '你挥着铁镐开始认真挖矿。') WG.zdwk("remove");
                        else if ((data.msg == "你现在正忙。" || data.msg == "你正在战斗，待会再说。" || data.msg.indexOf("不要急") >= 0 || data.msg.indexOf("这个方向没有出路") >= 0) && wk_busy == false) {
                            wk_busy = true;
                            messageAppend('卡顿,五秒后再次尝试操作', 0, 1);
                            setTimeout(() => {
                                wk_busy = false;
                                WG.Send("stopstate;pack");
                            }, 5000);
                        }
                    }
                    if (data.type == 'dialog' && data.dialog == 'list' && data.seller == tiejiang_id) {
                        let item_id;
                        for (let i = 0; i < data.selllist.length; i++) {
                            let item = data.selllist[i];
                            if (item.name == "<wht>铁镐</wht>") {
                                item_id = item.id;
                                break;
                            }
                        }
                        if (item_id) {
                            WG.Send('buy 1 ' + item_id + ' from ' + tiejiang_id);
                        } else {
                            messageAppend("<hio>自动挖矿</hio>无法购买<wht>铁镐</wht>");
                            WG.zdwk("remove");
                        }
                    }
                });
                WG.Send("stopstate;pack");

            } else {
                var t = $(".room_items .room-item:first .item-name").text();
                t = t.indexOf("<挖矿");

                if (t == -1) {
                    messageAppend("当前不在挖矿状态");
                    if (timer == 0) {
                        console.log(timer);
                        WG.go("扬州城-矿山");
                        WG.eq("铁镐");
                        WG.Send("wa");
                        timer = setInterval(WG.zdwk, 5000);
                    }
                } else {
                    WG.timer_close();
                }

                if (WG.at("扬州城-矿山") && t == -1) {
                    //不能挖矿，自动买铁镐
                    WG.go("扬州城-打铁铺");
                    WG.buy(goods["铁镐"]);
                    //买完等待下一次检查
                    messageAppend("自动买铁镐");
                    return;
                }
                if (WG.at("扬州城-打铁铺")) {
                    var lists = $(".dialog-list > .obj-list:eq(1)");
                    var id;
                    var name;
                    if (lists.length) {
                        messageAppend("查找铁镐ID");
                        for (var a of lists.children()) {
                            a = $(a);
                            id = a.attr("obj");
                            name = $(a.children()[0]).html();
                            if (name == "铁镐") {
                                equip["铁镐"] = id;
                                WG.eq("铁镐");
                                break;
                            }
                        }
                        GM_setValue(role + "_equip", equip);
                        WG.go("扬州城-矿山");
                        WG.Send("wa");
                    }
                    return;
                }
            }
        },
        timer_close: function () {
            if (timer) {
                clearInterval(timer);
                timer = 0;
            }
        },
        wudao_hook: undefined,
        wudao_auto: function () {
            //创建定时器
            if (timer == 0) {
                timer = setInterval(WG.wudao_auto, 2000);
            }
            if (!WG.at("武道塔")) {
                //进入武道塔 对于武神塔不知道咋操作
                if (WebSocket) {
                    if (!WG.wudao_hook) {
                        WG.wudao_hook = WG.add_hook("dialog", (data) => {
                            var item = data.items
                            for (var ii of item) {
                                if (ii.id == "signin") {
                                    WG.go("武道塔");
                                    //var pattern = "/-?[1-9]\d*/-?[1-9]\d*/", str = ii.desc;//写不来正则
                                    var reg = new RegExp("进度([^%]+)，<");
                                    var wudaojindu = (ii.desc.match(reg))[1];
                                    if (wudaojindu != null) {
                                        messageAppend("爬塔 : " + wudaojindu);
                                        var index = wudaojindu.indexOf('<');
                                        var wudao = wudaojindu.substring(0, index).split('/')
                                        var wudaocongz = ii.desc.indexOf("武道塔可以重置") != -1;
                                        // messageAppend("测试结果 : "+wudaocongz+"__" + wudao [0]+ "__" + wudao [1] );
                                        if (wudao[0] == wudao[1]) {
                                            messageAppend("爬塔完成! ");
                                            if (wudaocongz) { //重置
                                                WG.ask("守门人", 1);
                                                messageAppend("爬塔重置完成! ");
                                                WG.Send("go enter");
                                            } else {
                                                messageAppend("爬塔已经重置过了!");
                                                WG.timer_close();
                                            }
                                        } else { //没爬完
                                            messageAppend("爬塔未完成!");
                                            WG.Send("go enter");
                                        }
                                        //messageAppend(" ii  "+ wudaojindu +" ____" + wudaocongz);
                                    } else {
                                        messageAppend("获取爬塔信息失败 : " + ii.desc);
                                    }
                                    break;
                                }
                            }
                            WG.remove_hook(WG.wudao_hook);
                            WG.wudao_hook = undefined;
                        })
                    }
                    WG.Send("tasks");
                } else {
                    WG.go("武道塔");
                    WG.ask("守门人", 1);
                    WG.Send("go enter");
                }
            } else {
                //武道塔内处理
                //messageAppend("武道塔");
                var w = $(".room_items .room-item:last");
                var t = w.text();
                if (t.indexOf("守护者") != -1) {
                    WG.Send("kill " + w.attr("itemid"));
                    WG.wudao_autopfm();
                } else {
                    WG.Send("go up");
                }
            }
        },
        wudao_autopfm: function () {
            var pfm = wudao_pfm.split(',');
            for (var p of pfm) {
                if ($("div.combat-panel div.combat-commands span.pfm-item:eq(" + p + ") span").css("left") == "0px")
                    $("div.combat-panel div.combat-commands span.pfm-item:eq(" + p + ") ").click();
            }
        },
        xue_auto: function () {
            var t = $(".room_items .room-item:first .item-name").text();
            t = t.indexOf("<打坐") != -1 || t.indexOf("<学习") != -1 || t.indexOf("<练习") != -1;
            //创建定时器
            if (timer == 0) {
                if (t == false) {
                    messageAppend("当前不在打坐或学技能");
                    return;
                }
                timer = setInterval(WG.xue_auto, 1000);
            }
            if (t == false) {
                //学习状态中止，自动去挖矿
                WG.timer_close();
                WG.zdwk();
            } else {
                messageAppend("自动打坐学技能");
            }
        },
        fbnum: 0,
        needGrove: 0,
        oncegrove: function () {
            this.fbnum += 1;
            messageAppend("第" + this.fbnum + "次");
            WG.Send("cr yz/lw/shangu;cr over");
            if (this.needGrove <= this.fbnum) {
                WG.Send("taskover signin");
                messageAppend("<hiy>" + this.fbnum + "次副本小树林秒进秒退已完成</hiy>");
                WG.remove_hook(WG.daily_hook);
                WG.daily_hook = undefined;
                this.timer_close();
                //WG.zdwk();
                this.needGrove = 0;
                this.fbnum = 0;
            }
        },
        grove_ask_info: function () {
            return prompt("请输入需要秒进秒退的副本次数", "");
        },
        grove_auto: function (needG = null) {
            if (timer == 0) {
                if (needG == null) {
                    this.needGrove = this.grove_ask_info();
                } else {
                    this.needGrove = needG;
                }
                if (this.needGrove) //如果返回的有内容
                {
                    if (parseFloat(this.needGrove).toString() == "NaN") {
                        messageAppend("请输入数字");
                        return;
                    }
                    messageAppend("开始秒进秒退小树林" + this.needGrove + "次");

                    timer = setInterval(() => {
                        this.oncegrove()
                    }, 1000);
                }
            }
        },
        showhideborad: function () {
            if ($('.WG_log').css('display') == 'none') {
                window.localStorage.setItem("closeBorad","false")
                $('.WG_log').show();
            } else {
                window.localStorage.setItem("closeBorad", "true")
                $('.WG_log').hide();
            }
        },
        calc: function () {
            messageClear();
            var html = UI.jsquivue;
            messageAppend(html);
            const jsqset = new Vue({
                el: '.JsqVueUI',
                data: {
                    status: 1
                },
                methods: {
                    qnjs_btn: function () {
                        WG.qnjs();
                    },
                    lxjs_btn: function () {
                        WG.lxjs();
                    },
                    khjs_btn: function () {
                        WG.khjs();
                    },
                    getskilljson: function () {
                        WG.getPlayerSkill();
                    },
                    onekeydaily: function () {
                        WG.SendCmd("$daily");
                    },
                    onekeypk: function () {
                        WG.auto_fight();
                    },
                    onekeysansan: function () {
                        let mlh=`// 导入三三懒人包流程，方便后续导入操作
                        // 自命令类型选 Raidjs流程
                        // 四区白三三
                        ($f_ss)={"name":"三三懒人包","source":"http://wsmud-cdn.if404.com/三三懒人包.flow.txt","finder":"根文件夹"}
                        @js var f=(f_ss);var n=f["name"];var s=f["source"];var fd=f["finder"];WorkflowConfig.removeWorkflow({"name":n,"type":"flow","finder":fd});$.get(s,function(data,status){WorkflowConfig.createWorkflow(n,data,fd);});
                        @awiat 2000
                        tm 【三三懒人包】流程已导入，如果曾用早期版本的懒人包导入过流程，请先删除这些流程后再使用。`;
                        
                        if (unsafeWindow && unsafeWindow.ToRaid) {
                            ToRaid.perform(mlh);
                        }else{
                            messageAppend("请先安装Raid.js");
                        }
                    },
                    onekeystore: function () {
                        WG.SendCmd("$store")
                    },
                    onekeysell: function () {
                        WG.SendCmd("$drop")
                    },
                    onekeyfenjie: function () {
                        WG.SendCmd("$fenjie")
                    },
                    updatestore: function () {
                        WG.update_store();
                    },
                    cleandps: function () {
                        WG.clean_dps();
                    },
                    sortstore: function () {
                        WG.sort_all();
                    },
                    sortbag: function () {
                        WG.sort_all_bag();
                    },
                    dsrw: function () {
                        WG.dsj();
                    },
                    zdybtnset: function () {
                        WG.zdy_btnset();
                    }
                }
            })

        },
        dsj_hook: undefined,
        dsj_func: function () {
            if (WG.dsj_hook) {
                WG.remove_hook(WG.dsj_hook);
            }
            messageAppend("已注入定时任务", 0, 1);
            timequestion = GM_getValue(role + "_timequestion", timequestion);
            WG.dsj_hook = WG.add_hook("time", (data) => {
                if (data.type == 'time') {
                    let i = 0;
                    for (let p of timequestion) {
                        if ((p.h == data.h && p.m == data.m && p.s == data.s) ||
                            (p.h == "" && p.m == data.m && p.s == data.s) ||
                            (p.h == "" && p.m == "" && p.s == data.s)) {
                            messageAppend("已触发计划" + p.name, 1, 0);
                            WG.SendCmd(p.send);
                            if (p.type == 1) {
                                messageAppend("一次性任务,已移除" + p.name, 1, 0);
                                timequestion.baoremove(i);
                                GM_setValue(role + "_timequestion", timequestion);
                            }
                        }
                        i = i + 1;
                    }
                }
            })
        },
        dsj: function () {
            WG.dsj_func();
            messageClear();
            var html = UI.timeoutui;
            messageAppend(html);
            $(".startQuest").off('click');
            $(".removeQuest").off('click');
            //[{"name":"","type":"0","send":"","h":"","s":"","m":""}]
            timequestion = GM_getValue(role + "_timequestion", timequestion);
            for (let q of timequestion) {
                let phtml = `<span class='addrun${q.name}'>编辑${q.name}</span>
                <span class='stoprun${q.name}'>删除${q.name}</span>
             <br/>
                `
                $('.questlist').append(phtml);
                $("." + `addrun${q.name}`).on("click", () => {
                    $("#questname").val(q.name);
                    $("#rtype").val(q.type);
                    $("#ht").val(q.h);
                    $("#mt").val(q.m);
                    $("#st").val(q.s);
                    $("#zml_info").val(q.send);
                });
                $("." + `stoprun${q.name}`).on("click", () => {
                    let questname = q.name;
                    let i = 0
                    for (let p of timequestion) {
                        if (p.name == questname) {
                            timequestion.baoremove(i);
                        }
                        i = i + 1;
                    }
                    GM_setValue(role + "_timequestion", timequestion);
                    WG.dsj();
                });
            }
            $(".startQuest").on("click", () => {
                let questname = $("#questname").val();
                let type = $("#rtype").val();
                let h = $("#ht").val();
                let m = $("#mt").val();
                let s = $("#st").val();
                let send = $("#zml_info").val();
                let item = {
                    "name": questname,
                    "type": type,
                    "send": send,
                    "h": h,
                    "m": m,
                    "s": s
                };
                let i = 0;
                for (let p of timequestion) {
                    if (questname == p.name) {
                        timequestion[i] = item;
                        GM_setValue(role + "_timequestion", timequestion);
                        WG.dsj();
                        return;
                    }
                    i = i + 1;
                }

                timequestion.push(item);
                GM_setValue(role + "_timequestion", timequestion);
                WG.dsj();
            });
            $(".removeQuest").on("click", () => {
                let questname = $("#questname").val();
                let i = 0
                for (let p of timequestion) {
                    if (p.name == questname) {
                        timequestion.baoremove(i);
                        return;
                    }
                    i = i + 1;
                }
                GM_setValue(role + "_timequestion", timequestion);
                WG.dsj();
            });


        },
        qnjs: function () {
            messageClear();
            var html = UI.qnjsui;
            messageAppend(html);
            const qnvue = new Vue({
                el: ".QianNengCalc",
                data: {
                    qnsx: {
                        m: 0,
                        c: 0,
                        color: 0
                    }
                },
                methods: {
                    qnjscalc: function () {
                        $.each(this.qnsx, (key, value) => {
                            this.qnsx[key] = Number(value);
                        })
                        messageAppend("需要潜能:" + WG.dian(this.qnsx.c,this.qnsx.m,this.qnsx.color));
                    }
                }
            })

        },
        lxjs: function () {
            messageClear();
            var html = UI.lxjsui;
            messageAppend(html);
            const lxjsvue = new Vue({
                el: ".StudyTimeCalc",
                data: {
                    jsqsx: {
                        xtwx: 0,
                        htwx: 0,
                        lxxl: 0,
                        clevel: 0,
                        mlevel: 0,
                        color: 0
                    }
                },
                created() {
                    this.jsqsx.xtwx = G.score.int;
                    this.jsqsx.htwx = G.score.int_add;
                    this.jsqsx.lxxl = parseInt(G.score2.lianxi_per.replaceAll("%", ""));
                },
                methods: {
                    lxjscalc: function () {
                        $.each(this.jsqsx, (key, value) => {
                            this.jsqsx[key] = Number(value);
                        })
                        const lxObj = WG.lx(this.jsqsx.xtwx, this.jsqsx.htwx, this.jsqsx.lxxl,
                            this.jsqsx.clevel, this.jsqsx.mlevel, this.jsqsx.color);
                        messageAppend("需要潜能:" + lxObj.qianneng + "     所需时间:" + lxObj.time);
                    }
                }
            })
        },
        khjs: function () {
            messageClear();
            var html = UI.khjsui;
            messageAppend(html);
            const khvue = new Vue({
                el: ".KaihuaCalc",
                data: {
                    khsx: {
                        nl: 0,
                        xg: 0,
                        hg: 0
                    }
                },
                created() {
                    this.khsx.nl = G.score.max_mp;
                    this.khsx.xg = G.score.con;
                    this.khsx.hg = G.score.con_add;
                },
                methods: {
                    khjscalc: function () {
                        $.each(this.khsx, (key, value) => {
                            this.khsx[key] = Number(value);
                        })
                        messageAppend("你的分值:" + WG.gen(this.khsx.nl, this.khsx.xg, this.khsx.hg));
                    }
                }
            })
        },
        switchReversal: function (e) {
            let p = e.hasClass("on");
            if (!p) {
                return "开";
            }
            return "关";
        },

        auto_preform_switch: function () {

            if (G.auto_preform) {
                G.auto_preform = false;
                messageAppend("<hio>自动施法</hio>关闭");
                WG.auto_preform("stop");
            } else {
                G.auto_preform = true;
                messageAppend("<hio>自动施法</hio>开启");
                WG.auto_preform();
            }
        },
        auto_preform: function (v) {
            if (v == "stop") {
                if (G.preform_timer) {
                    clearInterval(G.preform_timer);
                    G.preform_timer = undefined;
                    $(".auto_perform").css("background", "");
                }
                return;
            }
            if (G.preform_timer || G.auto_preform == false) return;
            $(".auto_perform").css("background", "#3E0000");
            G.preform_timer = setInterval(() => {
                //出招时重新获取黑名单
                unauto_pfm = GM_getValue(role + "_unauto_pfm", unauto_pfm);
                var unpfm = unauto_pfm.split(',');
                for (var pfmname of unpfm) {
                    if (!WG.inArray(pfmname, blackpfm))
                        blackpfm.push(pfmname);
                }
                if (G.in_fight == false) WG.auto_preform("stop");
                for (var skill of G.skills) {
                    if (family.indexOf("逍遥") >= 0) {
                        if (skill.id == "force.duo") {
                            continue;
                        }
                    }
                    if (WG.inArray(skill.id, blackpfm)) {
                        continue;
                    }
                    if (!G.gcd && !G.cds.get(skill.id)) {
                        WG.Send("perform " + skill.id);
                        break;
                    }
                }
            }, 350);
        },

        formatCurrencyTenThou: function (num) {
            num = num.toString().replace(/\$|\,/g, '');
            if (isNaN(num)) num = "0";
            var sign = (num == (num = Math.abs(num)));
            num = Math.floor(num * 10 + 0.50000000001); //cents = num%10;
            num = Math.floor(num / 10).toString();
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
                num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
            }
            return (((sign) ? '' : '-') + num);
        },
        gen: function (nl, xg, hg) {
            var jg = nl / 100 + xg * hg / 10;
            var sd = this.formatCurrencyTenThou(jg);
            return sd;
        },
        dian: function (c, m, se) {
            var j = c + m;
            var jj = m - c;
            var jjc = jj / 2;
            var z = j * jjc * se * 5;
            var sd = this.formatCurrencyTenThou(z);
            return sd;
        },
        lx: function (xtwx, htwx, lxxl, dqdj, mbdj, k) {
            var qianneng = (mbdj * mbdj - dqdj * dqdj) * 2.5 * k;
            var time = qianneng / (xtwx + htwx) / (1 + lxxl / 100 - xtwx / 100) / 12;
            var timeString = time < 60 ? `${parseInt(time)}分钟` : `${parseInt(time / 60)}小时${parseInt(time % 60)}分钟`;
            return { qianneng: qianneng, time: timeString };
        },
        //找boss,boss不在,-1,
        findboss: function (data, bossname, callback) {
            for (let i = 0; i < data.items.length; i++) {
                if (data.items[i] != 0) {
                    if (data.items[i].name.indexOf(bossname) >= 0) {
                        callback(data.items[i].id);
                    }
                }
            }
            callback(-1);
        },
        ksboss: undefined,
        kksBoss: function (data) {
            var boss_place = data.content.match("出现在([^%]+)一带。")[1];
            var boss_name = data.content.match("听说([^%]+)出现在")[1];
            if (boss_name == null || boss_place == null) {
                return;
            }
            blacklist = GM_getValue(role + "_blacklist", blacklist);
            blacklist = blacklist instanceof Array ? blacklist : blacklist.split(",");
            if (WG.inArray(boss_name.replace("/<(.*?)>/g", ""), blacklist)) {
                messageAppend("黑名单boss,忽略!");
                return;
            }
            autoKsBoss = GM_getValue(role + "_autoKsBoss", autoKsBoss);
            ks_pfm = GM_getValue(role + "_ks_pfm", ks_pfm);
            ks_wait = GM_getValue(role + "_ks_wait", ks_wait);
            autoeq = GM_getValue(role + "_auto_eq", autoeq);
            console.log("boss");
            console.log(boss_place);
            var c = "<div class=\"item-commands\"><span id = 'closeauto'>关闭自动执行后命令</span></div>";
            messageAppend("自动前往BOSS地点 " + c);
            $('#closeauto').off('click');
            $('#closeauto').on('click', () => {
                if (timer != 0) {
                    WG.timer_close();
                    messageAppend("已停止后命令");
                } else {
                    messageAppend("已经停止");
                }
            });

            WG.Send("stopstate");
            WG.go(boss_place);
            WG.ksboss = WG.add_hook(["items", "itemadd", "die", "room"], function (data) {
                if (data.type == "items") {
                    if (!WG.at(boss_place)) {
                        return;
                    }
                    WG.findboss(data, boss_name, function (bid) {
                        if (bid != -1) {
                            next = 999;
                            WG.eqhelper(autoeq);
                            setTimeout(() => {
                                WG.Send("kill " + bid);
                                //WG.Send("select " + bid);
                                next = 0;
                            }, Number(ks_pfm));
                        } else {
                            if (next == 999) {
                                console.log('found');
                                return;
                            }
                            let lj = needfind[boss_place];
                            if (needfind[boss_place] != undefined && next < lj.length) {
                                setTimeout(() => {
                                    console.log(lj[next]);
                                    WG.Send(lj[next]);
                                    next++;
                                }, 1000);
                            } else {
                                console.log("not found");
                            }
                        }
                    });
                }
                if (data.type == "itemadd") {
                    if (data.name.indexOf(boss_name) >= 0) {
                        next = 0;
                        WG.Send("get all from " + data.id);
                        WG.remove_hook(this.index);
                    }
                }
                if (data.type == "die") {
                    next = 0;
                    WG.Send('relive');
                    WG.remove_hook(this.index);
                }
                if (data.type == 'room') {
                    if (next == 999) {
                        next = 0;
                    }
                }
            });
            timer = setTimeout(() => {
                console.log("复活挖矿");
                WG.Send('relive');
                WG.remove_hook(this.ksboss);
                auto_command = GM_getValue(role + "_auto_command", auto_command);
                if (auto_command && auto_command != null && auto_command != "" && auto_command != "null") {
                    WG.SendCmd(auto_command);
                } else {
                    WG.zdwk();
                }
                next = 0;
                WG.timer_close();
            }, 1000 * ks_wait);

        },
        marryhy: undefined,
        xiyan: async function () {

            var c = "<div class=\"item-commands\"><span id = 'closeauto'>关闭自动执行后命令</span></div>";
            messageAppend("自动喜宴 " + c);
            $('#closeauto').off('click');
            $('#closeauto').on('click', () => {
                if (timer != 0) {
                    WG.timer_close();
                    messageAppend("已停止后命令");
                } else {
                    messageAppend("已经停止");
                }
            });
            WG.Send("stopstate");
            WG.go("扬州城-喜宴");
            WG.marryhy = WG.add_hook(['items', 'cmds', 'text', 'msg'], function (data) {
                if (data.type == 'items') {
                    for (let idx = 0; idx < data.items.length; idx++) {
                        if (data.items[idx] != 0) {
                            if (data.items[idx].name.indexOf(">婚宴礼桌<") >= 0) {
                                console.log("拾取");
                                WG.Send('get all from ' + data.items[idx].id);
                                console.log("xy" + WG.marryhy);
                                WG.remove_hook(WG.marryhy);
                                break;
                            }
                        }
                    }
                } else if (data.type == 'text') {
                    if (data.msg == "你要给谁东西？") {
                        console.log("没人");
                    }
                    if (/^店小二拦住你说道：怎么又是你，每次都跑这么快，等下再进去。$/.test(data.msg)) {
                        console.log("cd");
                        messageAppend("<hiy>你太勤快了, 1秒后回去挖矿</hiy>")
                    }
                    if (/^店小二拦住你说道：这位(.+)，不好意思，婚宴宾客已经太多了。$/.test(data.msg)) {
                        console.log("客满");
                        messageAppend("<hiy>你来太晚了, 1秒后回去挖矿</hiy>")

                    }
                } else if (data.type == 'cmds') {
                    for (let idx = 0; idx < data.items.length; idx++) {
                        if (data.items[idx].name == '1金贺礼') {
                            WG.SendCmd(data.items[idx].cmd + ';go up;$wait 2000;go down;go up');
                            console.log("交钱");
                            break;
                        }
                    }
                }
            });
            timer = setTimeout(() => {
                console.log("挖矿");
                WG.remove_hook(this.marryhy);
                if (auto_command && auto_command != null && auto_command != "" && auto_command != "null") {
                    WG.SendCmd(auto_command);
                } else {
                    WG.zdwk();
                }
                next = 0;
                WG.timer_close();
            }, 30000);
        },

        saveRoomstate(data) {
            roomData = data.items;
        },
        haspack: function (name, callback) {
            WG.Send('pack');
            for (let item of packData) {
                if (item.name.indexOf(name) >= 0) {
                    callback(item.id);
                    return;
                }
            }
            callback('');
        },
        eqx: null,
        eqhelper(type, enaskill = 0) {
            if (type == undefined || type == 0 || type > eqlist.length) {
                return;
            }
            if (eqlist == null || eqlist[type] == "") {
                messageAppend("套装未保存,保存当前装备作为套装" + type + "!", 1);
                WG.eqx = WG.add_hook("dialog", (data) => {
                    if (data.dialog == "pack" && data.eqs != undefined) {
                        eqlist[type] = data.eqs;
                        GM_setValue(role + "_eqlist", eqlist);
                        messageAppend("套装" + type + "保存成功!", 1);
                        WG.remove_hook(WG.eqx);
                    }
                    if (data.dialog == 'skills' && data.items != null) {
                        var nowskill = { 'throwing': '', 'unarmed': '', 'force': '', 'dodge': '', 'sword': '', 'blade': '', 'club': '', 'staff': '', 'whip': '', 'parry': '' };
                        for (let item of data.items) {
                            if (nowskill[item.id] != null) {
                                if (item.enable_skill == null) {
                                    nowskill[item.id] = 'none';
                                } else {
                                    nowskill[item.id] = item.enable_skill;
                                }
                            }
                        }
                        skilllist[type] = nowskill;
                        GM_setValue(role + "_skilllist", skilllist);
                        messageAppend("技能" + type + "保存成功!", 1);
                    }
                });
                WG.Send("cha");
                WG.Send("pack");
            } else {
                if (WG.eqx != null) {
                    WG.remove_hook(WG.eqx);
                    WG.eqx = null;
                }
                eqlist = GM_getValue(role + "_eqlist", eqlist);
                skilllist = GM_getValue(role + "_skilllist", skilllist);
                var p_cmds = "";
                if (enaskill === 0) {
                    for (let i = 1; i < eqlist[type].length; i++) {
                        if (eqlist[type][i] != null) {
                            p_cmds += ("$wait 20;eq " + eqlist[type][i].id + ";");
                        }
                    }
                    if (eqlist[type][0] != null) {
                        p_cmds += ("$wait 40;eq " + eqlist[type][0].id + ";");
                    }
                }
                if (enaskill === 1) {
                    for (var key in skilllist[type]) {
                        p_cmds += (`$wait 40;enable ${key} ${skilllist[type][key]};`);
                    }
                }
                p_cmds = p_cmds + '$wait 40;look3 1';

                WG.eqx = WG.add_hook('text', function (data) {
                    if (data.type == 'text') {

                        if (data.msg.indexOf('没有这个玩家') >= 0) {
                            messageAppend("套装或技能装备成功" + type + "!", 1);
                            WG.remove_hook(WG.eqx);
                        }
                    }
                });
                WG.SendCmd(p_cmds);
            }
        },
        eqhelperdel: function (type) {
            eqlist = GM_getValue(role + "_eqlist", eqlist);
            skilllist = GM_getValue(role + "_skilllist", skilllist);
            eqlist[type] = [];
            skilllist[type] = {};
            GM_setValue(role + "_eqlist", eqlist);
            GM_setValue(role + "_skilllist", skilllist);
            messageAppend("清除套装 技能" + type + "设置成功!", 1);
        },
        uneqall: function () {
            this.eqx = WG.add_hook("dialog", (data) => {
                if (data.dialog == "pack" && data.eqs != undefined) {
                    for (let i = 0; i < data.eqs.length; i++) {
                        if (data.eqs[i] != null) {
                            WG.Send("uneq " + data.eqs[i].id);
                        }
                    }
                    WG.remove_hook(this.eqx);
                }
            });
            WG.Send("pack");
            messageAppend("取消所有装备成功!", 1);
        },

        fight_listener: undefined,
        auto_fight: function () {

            if (WG.fight_listener) {
                messageAppend("<hio>自动比试</hio>结束");
                WG.remove_hook(WG.fight_listener);
                WG.fight_listener = undefined;
                return;
            }
            let name = prompt("请输入NPC名称,例如:\"高根明\"");
            let id = WG.find_item(name);

            if (id == null) return;
            WG.fight_listener = WG.add_hook(["text", "sc", "combat"], async function (data) {
                if (data.type == "combat" && data.end) {
                    let item = G.items.get(G.id);
                    if (item.mp / item.max_mp < 0.8) {
                        WG.SendCmd("dazuo");
                    }
                    WG.SendCmd("liaoshang");
                } else if (data.type == "sc" && data.id == id) {
                    let item = G.items.get(id);
                    if (item.hp >= item.max_hp) {
                        WG.Send("stopstate;fight " + id);
                    }
                } else if (data.type == 'sc' && data.id == G.id) {
                    if (data.hp >= data.max_hp) {
                        WG.Send("stopstate;fight " + id);
                    }
                } else if (data.type == 'text') {
                    if (data.msg.indexOf("你先调整好自己的状态再来找别人比试吧") >= 0) {
                        WG.SendCmd("liaoshang");
                    }
                    if (data.msg.indexOf("你想趁人之危吗") >= 0) {
                        WG.SendCmd("dazuo");
                    }
                    if (data.msg.indexOf(">你疗伤完毕，深深吸了口气") >= 0) {
                        WG.Send("stopstate;fight " + id);
                    }
                }

            });
            WG.Send("stopstate;fight " + id);
            messageAppend("<hio>自动比试</hio>开始");
        },
        find_item: function (name) {
            for (let [k, v] of G.items) {
                if (v.name == name) {
                    return k;
                }
            }
            return null;
        },
        recover: function (hp, mp, cd, callback) {
            //返回定时器
            if (hp == 0) {
                if (WG.recover_timer) {
                    clearTimeout(WG.recover_timer);
                    WG.recover_timer = undefined;
                }
                return;
            }
            WG.Send("dazuo");
            WG.recover_timer = setInterval(function () {
                //检查状态
                let item = G.items.get(G.id);
                if (item.mp / item.max_mp < mp) { //内力控制
                    if (item.state != "打坐") {
                        WG.Send("stopstate;dazuo");
                    }
                    return;
                }
                if (item.hp / item.max_hp < hp) {
                    //血满
                    if (item.state != "疗伤") {
                        WG.Send("stopstate;liaoshang");
                    }
                    return;
                }
                if (item.state) WG.Send("stopstate");
                if (cd) {
                    for (let [k, v] of G.cds) {
                        if (k == "force.tu") continue;
                        if (v) return;
                    }
                }
                clearInterval(WG.recover_timer);
                callback();
            }, 1000);
        },
        useitem_hook: undefined,
        auto_useitem: async function () {
            var useflag = true;
            if (!WG.useitem_hook) {
                WG.useitem_hook = WG.add_hook("text", function (data) {
                    if (data.msg.indexOf("你身上没有这个东西") >= 0 || data.msg.indexOf("太多") >= 0 || data.msg.indexOf("不能使用") >= 0) {
                        useflag = false;
                        WG.remove_hook(WG.useitem_hook);
                        WG.useitem_hook = undefined;
                    }
                })
            }
            let name = prompt("请输入物品id,在背包中点击查看物品,即可在提示窗口看到物品id输出");
            if (!name) {
                WG.remove_hook(WG.useitem_hook);
                WG.useitem_hook = undefined;
                return;
            }
            let num = prompt("请输入物品使用次数,例如:\"10\"", '10');
            if (name) {
                if (name.length != 11) {
                    L.msg('id不合法');
                    WG.remove_hook(WG.useitem_hook);
                    WG.useitem_hook = undefined;
                    return;
                }
                for (var i = 0; i < num; i++) {
                    if (useflag) {
                        WG.Send('use ' + name);
                        await WG.sleep(1000);
                    } else {
                        WG.remove_hook(WG.useitem_hook);
                        WG.useitem_hook = undefined;
                        return;
                    }
                }
            }
            WG.remove_hook(WG.useitem_hook);
            WG.useitem_hook = undefined;
        },

        auto_Development_medicine: function () {
            messageClear();
            var a = UI.lyui;
            messageAppend(a);
            const lianyaovue = new Vue({
                el:"#LianYao",
                data:{
                    level:0,
                    num:1,
                    info:""
                },
                created(){
                    this.info = GM_getValue("lastmed", $('#medicint_info').val());
                    this.level = GM_getValue("lastmedlevel", $('#medicine_level').val());
                },
                methods:{
                    startDev:function(){
                        if (WG.at('住房-炼药房') || WG.at('帮会-炼药房')) {
                            WG.auto_start_dev_med(this.info.replace(" ", ""),this.level,this.num);
                        } else {
                            L.msg("请先前往炼药房");
                        }
                    },
                    stopDev:function(){
                        WG.Send("stopstate");
                    }
                }
            });
        },
        findMedItems_hook: undefined,
        auto_start_dev_med: function (med_item, level, num) {
            GM_setValue("lastmed", med_item);
            GM_setValue("lastmedlevel", level);
            if (med_item) {
                if (med_item.split(",").length < 2) {
                    L.msg("素材不足");
                    return;
                }
            } else {
                L.msg("素材不足");
                return;
            }
            var tmpitme = med_item.split('|');
            var med_items = [];
            for (let pitem of tmpitme) {
                med_items.push(pitem.split(","));
            }

            WG.findMedItems_hook = WG.add_hook("dialog", function (data) {
                if (data.dialog == "pack" && data.items != undefined && data.items.length >= 0) {
                    let med_items_ids = [];

                    let med_haves = [];

                    for (let item of med_items) {
                        let med_items_id = [];
                        let med_have = [];
                        for (let med_item of item) {
                            if (JSON.stringify(data.items).indexOf(med_item) >= 0) {
                                for (let pitem of data.items) {
                                    if (pitem.name.indexOf(med_item) >= 0) {
                                        med_items_id.push(pitem.id);
                                        med_have.push(med_item);
                                    }
                                }
                            }
                        }
                        med_haves.push(med_have);
                        med_items_ids.push(med_items_id);
                    }
                    let idx = 0;
                    for (let med_items_id of med_items_ids) {
                        if (med_items_id.length != med_items[idx].length) {
                            var temp = [];
                            var temparray = [];
                            for (var i = 0; i < med_haves[idx].length; i++) {
                                temp[med_haves[idx][i]] = typeof med_haves[idx][i];;
                            }
                            for (var i = 0; i < med_items[idx].length; i++) {
                                var type = typeof med_items[idx][i];
                                if (!temp[med_items[idx][i]]) {
                                    temparray.push(med_items[idx][i]);
                                } else if (temp[med_items[idx][i]].indexOf(type) < 0) {
                                    temparray.push(med_items[idx][i]);
                                }
                            }
                            let arr = [];
                            for (const item of new Set(temparray)) {
                                arr.push(item)
                            }

                            L.msg("素材不足,请检查背包是否存在" + arr.join('.'));
                            WG.remove_hook(WG.findMedItems_hook);
                            WG.findMedItems_hook = null;
                            return;
                        }
                        idx = idx + 1;
                    }
                    var p_Cmd = WG.make_med_cmd(med_items_ids, level, num);
                    console.log(p_Cmd);
                    WG.SendStep(p_Cmd);
                    WG.remove_hook(WG.findMedItems_hook);
                }
            });
            WG.Send('pack');

        },
        make_med_cmd: function (medItem_ids, level, num) {
            let result = "";
            for (let medItem_id of medItem_ids) {
                for (let i = 0; i < parseInt(num); i++) {
                    let startCmd = "lianyao2 start " + level + ";";
                    let endCmd = "lianyao2 stop;";
                    let midCmd = "lianyao2 add ";
                    for (let medid of medItem_id) {
                        result += startCmd + midCmd + medid + ";"
                    }
                    result += endCmd;
                }
            }
            return result + "$syso 炼制完成;";
        },
        zmlfire: async function (zml) {
            if (zml) {

                messageAppend("运行" + zml.name, 2);
                if (zml.zmlType == 0 || zml.zmlType == "" || zml.zmlType == undefined) {
                    await WG.SendCmd(zml.zmlRun);
                } else if (zml.zmlType == 1) {
                    if (unsafeWindow && unsafeWindow.ToRaid) {
                        ToRaid.perform(zml.zmlRun);
                    }
                } else if (zml.zmlType == 2) {
                    eval(zml.zmlRun);
                }

            }
        },
        zmlztjk: function () {
            zml = GM_getValue(role + "_zml", zml);
            if (! typeof zml instanceof Array) {
                zml = [];
            }
            messageClear();
            var a = UI.zmlandztjkui;
            messageAppend(a);
            const zmlvue = new Vue({
                el:"#zmlandztjk",
                data:{
                },
                created(){
                    this.zmldata = zml;
                },
                methods: {
                    run:function(v){
                        WG.zmlfire(v);
                    },
                    zml:function(){
                        WG.zml_edit();
                    },
                    ztjk:function(){
                        WG.ztjk_edit();
                    },
                    startjk:function () {
                        WG.ztjk_func();
                    },
                    stopjk:function () {
                        if (WG.ztjk_hook) {
                            WG.remove_hook(WG.ztjk_hook);
                            WG.ztjk_hook = undefined;
                            messageAppend("已取消注入", 2);
                            return;
                        }
                        messageAppend("未注入", 2);
                    }

                }
            })
        },
        zml_edit: function () {
            zml = GM_getValue(role + "_zml", zml);
            if(! typeof zml instanceof Array){
                zml = [];
            }
            messageClear();
            var edithtml = UI.zmlsetting;
            messageAppend(edithtml);
            const zmlvue = new Vue({
                el: "#zmldialog",
                data: {
                    singnalzml: {
                        name :"",
                        zmlType: "0",
                        zmlRun: ""
                    },
                    zmldata: zml
                },
                created() {
                    this.zmldata = zml;
                },
                methods: {
                    add: function () {
                        let zmljson = {
                            "name": this.singnalzml.name,
                            "zmlRun": this.singnalzml.zmlRun,
                            "zmlShow": 0,
                            "zmlType": this.singnalzml.zmlType
                        };
                        let _flag = true;
                        for(let item of this.zmldata){
                            if (item.name == zmljson.name) {
                                zmljson.zmlShow = item.zmlShow;
                                item = zmljson;
                                _flag = false;
                            }
                        }

                        if (_flag) {
                            this.zmldata.push(zmljson);
                        }
                        GM_setValue(role + "_zml", this.zmldata);
                        L.msg("保存成功");
                    },
                    del:function(){
                        this.zmldata.forEach( (v, k)=> {
                            if (v.name == this.singnalzml.name) {
                                this.zmldata.baoremove(k);
                                GM_setValue(role + "_zml", this.zmldata);
                                L.msg("删除成功");
                            }
                        });
                    },
                    getShare:function(){
                        var id = prompt("请输入分享码");
                        S.getShareJson(id, (res) => {
                            let v = JSON.parse(res.json);
                            if (v.zmlRun != undefined) {
                                this.singnalzml = v;
                            } else {
                                L.msg("不合法")
                            }
                        });
                    },
                    edit:function(v){
                        this.singnalzml = v;
                    },
                    showp: function (v) {
                        zmlshowsetting = GM_getValue(role + "_zmlshowsetting", zmlshowsetting);
                        //<span class="zdy-item act-item-zdy" zml="use j8ea35f34ce">大还丹</span>
                        let a = $(".room-commands");

                        if (zmlshowsetting == 1) {
                            a = $(".zdy-commands");
                        }

                        for (let item of a.children()) {
                            if (item.textContent == v.name) {
                                item.remove();
                                v.zmlShow = 0;
                                GM_setValue(role + "_zml", zml);
                                messageAppend("删除快速使用" + v.name, 1);
                                return;
                            }
                        }
                        a.append("<span class=\"zdy-item act-item-zdy\">" + v.name + "</span>")
                        v.zmlShow = 1;
                        GM_setValue(role + "_zml", zml);
                        messageAppend("设置快速使用" + v.name, 0, 1);
                        //绑定事件
                        $('.act-item-zdy').off('click');
                        $(".act-item-zdy").on('click', function () {
                            T.usezml(0, this.textContent, "");
                        });
                    },
                    share:function(v){
                        S.shareJson(G.id, v);
                    }
                }
            })

        },
        isseted: false,
        zml_showp: function () {
            $(".zdy-commands").empty();
            $('.act-item-zdy').remove();
            zmlshowsetting = GM_getValue(role + "_zmlshowsetting", zmlshowsetting);
            for (let zmlitem of zml) {
                let a = $(".room-commands");
                if (zmlshowsetting == 1) {
                    for (let item of a.children()) {
                        if (item.textContent == zmlitem.name) {
                            item.remove();
                        }
                    }
                    a = $(".zdy-commands");
                    if (!WG.isseted) {
                        let px = $('.tool-bar.right-bar').css("bottom");
                        px.replace("px", "");
                        px = parseInt(px);
                        px = px + 24;
                        $('.tool-bar.right-bar').css("bottom", px + "px");
                        WG.isseted = true;
                    }

                } else {
                    for (let item of $(".zdy-commands").children()) {
                        if (item.textContent == zmlitem.name) {
                            item.remove();
                        }
                    }
                }

                if (zmlitem.zmlShow == 1) {

                    a.append("<span class=\"zdy-item act-item-zdy\">" + zmlitem.name + "</span>")
                    messageAppend("设置快速使用" + zmlitem.name, 0, 1);
                    //绑定事件
                    $('.act-item-zdy').off('click');
                    $(".act-item-zdy").on('click', function () {
                        T.usezml(0, this.textContent, "");
                    });
                }
            }
        },
        ztjk_edit: function () {

            //[{"name":"","type":"state","action":"remove","keyword":"busy","ishave":"0","send":""}]
            ztjk_item = GM_getValue(role + "_ztjk", ztjk_item);
            messageClear();
            var edithtml = UI.ztjksetting;
            messageAppend(edithtml);
            $(".ztjk_sharedfind").on('click', () => {
                var id = prompt("请输入分享码");
                S.getShareJson(id, (res) => {
                    let v = JSON.parse(res.json);
                    if (v.type != undefined) {
                        $('#ztjk_name').val(v.name);
                        $('#ztjk_type').val(v.type);
                        $('#ztjk_action').val(v.action);
                        $('#ztjk_keyword').val(v.keyword);
                        $('#ztjk_ishave').val(v.ishave);
                        $('#ztjk_send').val(v.send);
                        $('#ztjk_senduser').val(v.senduser);
                        $("#ztjk_maxcount").val(v.maxcount);
                        $("#ztjk_istip").val(v.istip);
                    } else {
                        L.msg("不合法")
                    }
                });
            });
            $('.ztjk_editadd').on("click", function () {
                var ztjk = {
                    name: $('#ztjk_name').val(),
                    type: $('#ztjk_type').val(),
                    action: $('#ztjk_action').val(),
                    keyword: $('#ztjk_keyword').val(),
                    ishave: $('#ztjk_ishave').val(),
                    send: $('#ztjk_send').val(),
                    senduser: $('#ztjk_senduser').val(),
                    isactive: 1,
                    maxcount: $('#ztjk_maxcount').val(),
                    istip: $('#ztjk_istip').val()
                };
                let _flag = true;
                ztjk_item.forEach(function (v, k) {
                    if (v.name == $('#ztjk_name').val()) {
                        ztjk_item[k] = ztjk;
                        _flag = false;
                    }
                });
                if (_flag) {
                    ztjk_item.push(ztjk);
                }
                GM_setValue(role + "_ztjk", ztjk_item);

                WG.ztjk_edit();
                messageAppend("保存成功", 2);
                WG.ztjk_func();
            });
            $(".ztjk_editdel").on('click', function () {
                let name = $('#ztjk_name').val();
                ztjk_item.forEach(function (v, k) {
                    if (v.name == name) {
                        ztjk_item.baoremove(k);
                        GM_setValue(role + "_ztjk", ztjk_item);
                        WG.ztjk_edit();
                        messageAppend("删除成功", 2);
                        WG.ztjk_func();
                    }
                });
            })
            ztjk_item.forEach(function (v, k) {
                var btn = "<span class='addrun" + k + "'>编辑" + v.name + "</span>";
                $('#ztjk_show').append(btn);
                var tmptext = "注入";
                if (v.isactive && v.isactive == 1) {
                    tmptext = "暂停";
                }
                var setbtn = "<span class='setaction" + k + "'>" + tmptext + v.name + "</span>";
                $('#ztjk_set').append(setbtn);
                var btn3 = "<span class='shareztjk" + k + "'>分享" + v.name + "</span>";
                $('#ztjk_show').append(btn3);
            });
            ztjk_item.forEach(function (v, k) {
                $(".addrun" + k).on("click", function () {
                    $('#ztjk_name').val(v.name);
                    $('#ztjk_type').val(v.type);
                    $('#ztjk_action').val(v.action);
                    $('#ztjk_keyword').val(v.keyword);
                    $('#ztjk_ishave').val(v.ishave);
                    $('#ztjk_send').val(v.send);
                    $('#ztjk_senduser').val(v.senduser);
                    $("#ztjk_maxcount").val(v.maxcount);
                    if (v.istip == null) {
                        $("#ztjk_istip").val(1);
                    } else {

                    } $("#ztjk_istip").val(v.istip);
                });
                $('.setaction' + k).on('click', function () {
                    if (this.textContent.indexOf("暂停") >= 0) {
                        ztjk_item[k].isactive = 0;
                    } else {
                        ztjk_item[k].isactive = 1;
                    }
                    GM_setValue(role + "_ztjk", ztjk_item);
                    WG.ztjk_func();
                    WG.ztjk_edit();
                });
                $('.shareztjk' + k).on('click', function () {
                    S.shareJson(G.id, v);
                });
            });

        },
        ztjk_hook: undefined,
        ztjk_func: function () {
            if (WG.ztjk_hook) {
                WG.remove_hook(WG.ztjk_hook);
            }
            WG.ztjk_hook = undefined;
            ztjk_item = GM_getValue(role + "_ztjk", ztjk_item);
            WG.ztjk_hook = WG.add_hook(["dispfm", "enapfm", "dialog", "room", "itemadd", "itemremove", "status", "text", "msg", "die", "combat", "sc"], function (data) {
                ztjk_item.forEach(function (v, k) {
                    if (v.isactive != 1) {
                        return;
                    }
                    if (data.type == v.type) {
                        let keywords = v.keyword.split("|");
                        switch (v.type) {
                            case "status":
                                if (!data.name) {
                                    if (v.action == data.action) {
                                        for (var keyworditem of keywords) {
                                            if (data.sid.indexOf(keyworditem) >= 0) {
                                                if (v.ishave == "0" && data.id != G.id) {
                                                    if (v.istip == "1") {
                                                        messageAppend("已触发" + v.name, 1);
                                                    }
                                                    if (data.id) {
                                                        let p = v.send.replace("{id}", data.id);
                                                        WG.SendCmd(p);
                                                    } else {
                                                        WG.SendCmd(v.send);
                                                    }
                                                } else if (v.ishave == "1" && data.id == G.id) {
                                                    if (data.count != undefined && v.maxcount) {
                                                        if (parseInt(data.count) < parseInt(v.maxcount)) {
                                                            if (v.istip != "0") {
                                                                messageAppend("已触发" + v.name, 1);
                                                            }
                                                            if (data.id) {
                                                                let p = v.send.replace("{id}", data.id);
                                                                WG.SendCmd(p);
                                                            } else {
                                                                WG.SendCmd(v.send);
                                                            }
                                                        }
                                                    } else {
                                                        if (v.istip != "0") {
                                                            messageAppend("已触发" + v.name, 1);
                                                        }
                                                        if (data.id) {
                                                            let p = v.send.replace("{id}", data.id);
                                                            WG.SendCmd(p);
                                                        } else {
                                                            WG.SendCmd(v.send);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (v.action == data.action) {
                                        for (var keyworditem of keywords) {
                                            if (data.sid.indexOf(keyworditem) >= 0 || data.name.indexOf(keyworditem) >= 0) {
                                                if (v.ishave == "0" && data.id != G.id) {
                                                    if (v.istip != "0") {
                                                        messageAppend("已触发" + v.name, 1);
                                                    }
                                                    if (data.id) {
                                                        let p = v.send.replace("{id}", data.id);
                                                        WG.SendCmd(p);
                                                    } else {
                                                        WG.SendCmd(v.send);
                                                    }
                                                } else if (v.ishave == "1" && data.id == G.id) {
                                                    if (data.count != undefined && v.maxcount) {
                                                        if (parseInt(data.count) < parseInt(v.maxcount)) {
                                                            messageAppend("当前层数" + data.count + ",已触发" + v.name, 1);
                                                            if (data.id) {
                                                                let p = v.send.replace("{id}", data.id);
                                                                WG.SendCmd(p);
                                                            } else {
                                                                WG.SendCmd(v.send);
                                                            }
                                                        }
                                                    } else {
                                                        if (v.istip != "0") {
                                                            messageAppend("已触发" + v.name, 1);
                                                        }
                                                        if (data.id) {
                                                            let p = v.send.replace("{id}", data.id);
                                                            WG.SendCmd(p);
                                                        } else {
                                                            WG.SendCmd(v.send);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                break;
                            case "text":
                                for (var keyworditem of keywords) {
                                    if (data.msg.indexOf(keyworditem) >= 0) {
                                        if (v.istip != "0") {
                                            messageAppend("已触发" + v.name, 1);
                                        }
                                        if (data.msg) {
                                            let p = v.send.replace("{content}", data.msg.replaceAll("\n", "").replaceAll(",", "").replaceAll(";", ""));
                                            WG.SendCmd(p);
                                        } else {
                                            WG.SendCmd(v.send);
                                        }
                                    }
                                }
                                break;
                            case "msg":
                                if (!v.senduser || v.senduser == "" || v.senduser == null) {
                                    for (var keyworditem of keywords) {
                                        if (data.content.indexOf(keyworditem) >= 0) {
                                            if (v.istip != "0") {
                                                messageAppend("已触发" + v.name, 1);
                                            }
                                            if (data.content) {
                                                let p = v.send.replace("{content}", data.content.replaceAll("\n", "").replaceAll(",", "").replaceAll(";", ""));
                                                WG.SendCmd(p);
                                            } else {
                                                WG.SendCmd(v.send);
                                            }
                                        }
                                    }
                                    return;
                                }
                                let sendusers = v.senduser.split("|");
                                for (let item of sendusers) {
                                    if (data.name == item) {
                                        for (var keyworditem of keywords) {
                                            if (data.content.indexOf(keyworditem) >= 0) {
                                                if (v.istip != "0") {
                                                    messageAppend("已触发" + v.name, 1);
                                                }
                                                if (data.content) {
                                                    let p = v.send.replace("{content}", data.content);
                                                    WG.SendCmd(p);
                                                } else {
                                                    WG.SendCmd(v.send);
                                                }
                                            }
                                        }
                                    } else if ((item == "谣言" && data.ch == "rumor") ||
                                        (item == "系统" && data.ch == 'sys') ||
                                        (item == "门派" && data.ch == 'fam') ||
                                        (item == "帮派" && data.ch == 'pty')) {
                                        for (var keyworditem of keywords) {
                                            if (data.content.indexOf(keyworditem) >= 0) {
                                                if (v.istip != "0") {
                                                    messageAppend("已触发" + v.name, 1);
                                                }
                                                if (data.content) {
                                                    let p = v.send.replace("{content}", data.content);
                                                    WG.SendCmd(p);
                                                } else {
                                                    WG.SendCmd(v.send);
                                                }
                                            }
                                        }
                                    }
                                    // else if (item == "系统" && data.ch == 'sys') {
                                    //     for (var keyworditem of keywords) {
                                    //         if (data.content.indexOf(keyworditem) >= 0) {
                                    //             messageAppend("已触发" + v.name, 1);
                                    //             WG.SendCmd(v.send);
                                    //         }
                                    //     }
                                    // }
                                }
                                break;

                            case "die":
                                if (data.commands != null) {
                                    if (v.istip != "0") {
                                        messageAppend("已触发" + v.name, 1);
                                    }
                                    WG.SendCmd(v.send);
                                }
                                break;
                            case "itemadd":
                                for (var keyworditem of keywords) {

                                    if (data.name.indexOf(keyworditem) >= 0) {
                                        if (v.ishave == 2) {
                                            if (data.p != null) {
                                                break
                                            }
                                        }
                                        if (v.istip != "0") {
                                            messageAppend("已触发" + v.name, 1);
                                        }
                                        if (data.id) {
                                            let p = v.send.replace("{id}", data.id);
                                            WG.SendCmd(p);
                                        } else {
                                            WG.SendCmd(v.send);
                                        }
                                    }
                                }
                                break;
                            case "room":
                                for (var keyworditem of keywords) {
                                    if (data.name.indexOf(keyworditem) >= 0) {
                                        if (v.istip != "0") {
                                            messageAppend("已触发" + v.name, 1);
                                        }
                                        let p = v.send.replace("{name}", data.name);
                                        WG.SendCmd(p);
                                        return;
                                    }
                                    for (let roomItem of roomData) {
                                        if (roomItem == 0) { return; }
                                        if (roomItem.name.indexOf(keyworditem) >= 0 && roomItem.p == undefined) {
                                            if (v.istip != "0") {
                                                messageAppend("已触发" + v.name, 1);
                                            }
                                            let p = v.send.replace("{name}", data.name);
                                            WG.SendCmd(p);
                                            return;
                                        }
                                    }
                                }
                                break;
                            case "dialog":
                                if (data.dialog && data.dialog == "pack") {
                                    for (var keyworditem of keywords) {
                                        if (data.name && data.name.indexOf(keyworditem) >= 0) {
                                            if (v.istip != "0") {
                                                messageAppend("已触发" + v.name, 1);
                                            }
                                            let p = v.send.replace("{id}", data.id);
                                            WG.SendCmd(p);
                                        }
                                    }
                                }
                                break;
                            case "combat":
                                for (var keyworditem of keywords) {
                                    if (keyworditem == "start" && data.start == 1) {
                                        if (v.istip != "0") {
                                            messageAppend("已触发" + v.name, 1);
                                        }
                                        WG.SendCmd(v.send);
                                    } else if (keyworditem == "end" && data.end == 1) {
                                        if (v.istip != "0") {
                                            messageAppend("已触发" + v.name, 1);
                                        }
                                        WG.SendCmd(v.send);
                                    }
                                }
                                break;
                            case "sc":
                                let item = G.items.get(G.id);
                                if (v.ishave == "0") {
                                    //查找id
                                    if (!v.senduser) { }
                                    let pid = WG.find_item(v.senduser);
                                    item = G.items.get(pid);
                                }
                                if (item && item.hp) {
                                    if ((item.hp / item.max_hp) * 100 < (parseInt(keywords[0]))) {
                                        if (v.istip != "0") {
                                            messageAppend("已触发" + v.name, 1);
                                        }
                                        WG.SendCmd(v.send);
                                    }
                                }
                                if (item && item.mp) {
                                    if ((item.mp / item.max_mp) * 100 < (parseInt(keywords[1]))) {
                                        if (v.istip != "0") {
                                            messageAppend("已触发" + v.name, 1);
                                        }
                                        WG.SendCmd(v.send);
                                    }
                                }
                                break;
                            case "enapfm":
                                for (let item of keywords) {
                                    if (item == data.id) {
                                        if (v.istip != "0") {
                                            messageAppend("已触发" + v.name, 1);
                                        }
                                        WG.SendCmd(v.send);
                                    }
                                }
                                break;
                            case "dispfm":
                                for (let item of keywords) {
                                    if (item == data.id) {
                                        if (v.istip != "0") {
                                            messageAppend("已触发" + v.name, 1);
                                        }
                                        WG.SendCmd(v.send);
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    }

                });

            });
            messageAppend("已重新注入自动监控", 0, 1);
        },
        daily_hook: undefined,
        oneKeyDaily: async function () {
            messageAppend("本脚本会自动执行师门及自动进退小树林,请确保精力足够再执行,请不要点击任务菜单", 1);
            var fbnums = 0;
            WG.daily_hook = WG.add_hook("dialog", async function (data) {
                if (data.dialog == "tasks") {
                    if (data.items) {
                        let dailylog ="";
                        let dailystate="";
                        for(let item of data.items){
                            if(item.id == "signin"){
                                dailylog = item.desc;
                                dailystate = item.state;
                            }
                        }
                        if (dailystate == 3) {
                            messageAppend("日常已完成", 1);
                            //WG.zdwk();
                            setTimeout(() => {
                                WG.remove_hook(WG.daily_hook);
                                WG.daily_hook = undefined;
                            }, 1);

                            return;
                        } else {
                            let str = dailylog;
                            str = str.replace(/<(?!\/?p\b)[^>]+>/ig, '');
                            let str1 = str.split("副本");

                            let n = str1[0].match("：([^%]+)/20")[1];
                            let n1 = str1[1].match("：([^%]+)/20")[1];
                            n = 20 - parseInt(n);
                            fbnums = 20 - parseInt(n1);
                            messageAppend("还需要" + n + "次师门任务," + fbnums + "次副本,才可签到");
                            if (n != 0) {
                                //$(".sm_button").click();
                                $(".sm_button").text("停止(Q)");
                                WG.sm_state = 0;
                                setTimeout(WG.sm, 200);
                            } else {
                                WG.sm_state = -1;
                            }

                            //WG.remove_hook(WG.daily_hook);
                            //WG.daily_hook = undefined;
                        }

                    }
                }
            });
            WG.SendCmd("tasks");

            await WG.sleep(2000);
            while (WG.sm_state >= 0) {
                await WG.sleep(2000);
            }
            if (fbnums <= 0) {
                WG.Send("taskover signin");
                messageAppend("<hiy>任务完成</hiy>");
                WG.remove_hook(WG.daily_hook);
                WG.daily_hook = undefined;
                this.timer_close();
                //WG.zdwk();
                this.needGrove = 0;
                this.fbnum = 0;
            } else {
                WG.grove_auto(fbnums);
            }

            // var sxplace = sm_array[family].sxplace;
            // var sx = sm_array[family].sx;
            // if (sxplace.indexOf("-") == 0) {
            //     WG.Send(sxplace.replace('-', ''));
            // } else {
            //     WG.go(sxplace);
            // }
            // await WG.sleep(1000);
            // WG.SendCmd("ask2 $findPlayerByName(\"" + sx + "\")");
            // await WG.sleep(1000);

        },
        oneKeyQA: async function () {
            WG.Send("stopstate");
            WG.sm_state = -1;
            var sxplace = sm_array[family].sxplace;
            var sx = sm_array[family].sx;
            if (sxplace.indexOf("-") == 0) {
                WG.Send(sxplace.replace('-', ''));
            } else {
                WG.go(sxplace);
            }
            await WG.sleep(2000);
            WG.SendCmd("select $findPlayerByName(\"" + sx + "\");$wait 200;ask2 $findPlayerByName(\"" + sx + "\")");
            await WG.sleep(1000);

        },
        sd_hook: undefined,
        oneKeySD: function () {
            var n = 0;
            messageAppend("本脚本自动执行购买扫荡符,进行追捕扫荡,请确保元宝足够，请不要点击任务菜单\n注意! 超过上限会自动放弃", 1);
            WG.sd_hook = WG.add_hook(["dialog", "text"], async function (data) {
                var id = 0;
                var loop = 2;
                if (data.type == 'text' && data.msg) {
                    id = WG.getIdByName("程药发");
                    if (data.msg.indexOf("无法快速完") >= 0) {
                        WG.Send("select " + id);
                        await WG.sleep(200);
                        WG.Send("ask1 " + id);
                        await WG.sleep(200);
                        WG.Send("ask2 " + id);
                        await WG.sleep(200);
                        while (loop) {
                            loop--;
                            console.log("ask3 " + id);

                            WG.Send("ask3 " + id);
                            await WG.sleep(1000);
                        }

                        //messageAppend("追捕已完成", 1);
                        //WG.Send("ask3 " + id);
                        //WG.zdwk();
                        //WG.remove_hook(WG.sd_hook);
                        //WG.sd_hook = undefined;
                    }
                    //<hig>你的追捕任务完成了，目前完成20/20个，已连续完成40个。</hig>
                    if (data.msg.indexOf("追捕任务完成了") >= 0) {
                        let str = data.msg;
                        str = str.replace(/<(?!\/?p\b)[^>]+>/ig, '');
                        n = str.match("目前完成([^%]+)/20")[1];
                        if (n == "20") {
                            messageAppend("追捕已完成", 1);
                            await WG.sleep(2000);
                            WG.remove_hook(WG.sd_hook);
                            WG.sd_hook = undefined;
                        }
                    }
                    if (data.msg.indexOf("多历练一番") >= 0 || data.msg.indexOf("没有那么多元宝") >= 0) {
                        messageAppend("等级太低无法接取追捕,自动取消", 1);
                        WG.remove_hook(WG.sd_hook);
                        WG.sd_hook = undefined;
                    }
                    if (data.msg.indexOf("你的追捕任务已经完成了") >= 0) {
                        messageAppend("追捕已完成", 1);
                        WG.remove_hook(WG.sd_hook);
                        WG.sd_hook = undefined;
                    }
                    if (data.msg.indexOf("你的扫荡符不够。") >= 0) {
                        id = WG.getIdByName("程药发");

                        messageAppend("还需要" + n + "次扫荡,自动购入" + n + "张扫荡符");
                        WG.Send("shop 0 " + n);
                        await WG.sleep(1000);
                        while (loop) {
                            loop--;
                            console.log("ask3 " + id);
                            WG.Send("ask3 " + id);
                            await WG.sleep(1000);
                        }

                    }
                }
                if (data.dialog == "tasks") {
                    if (data.items) {
                        let dailylog = "";
                        for(let item of data.items){
                            if(item.id == "yamen"){
                                dailylog = item.desc;
                            }
                        }
                        let str = dailylog;
                        str = str.replace(/<(?!\/?p\b)[^>]+>/ig, '');

                        n = str.match("完成([^%]+)/20")[1];
                        n = 20 - parseInt(n);
                        if (n == 0) {
                            messageAppend("追捕已完成", 1);
                            //WG.zdwk();
                            WG.remove_hook(WG.sd_hook);
                            WG.sd_hook = undefined;
                            return;
                        } else {
                            do {
                                WG.go("扬州城-衙门正厅");
                                await WG.sleep(1000);
                            }
                            while (!WG.getIdByName("程药发"))
                            WG.SendCmd("ask3 $pname(\"程药发\")");
                        }

                    }
                }
            });
            WG.Send("stopstate");
            WG.SendCmd("tasks");
        },
        yj_hook: undefined,
        oneKeyyj: async function () {
            WG.SendCmd("stopstate;$to 扬州城-药铺;$wait 1000;list %药铺老板 平一指%;$wait 1000;buy 10 *养精丹* from %药铺老板 平一指%;$wait 1000");
            await WG.sleep(4000);
            let lyj = '';
            let byj = '';
            WG.yj_hook = WG.add_hook("dialog", function (data) {
                if (data.items) {
                    for (let item of data.items) {
                        if (item.name == '<hic>养精丹</hic>') {
                            byj = item.id;
                        }
                        if (item.name == "<hig>养精丹</hig>") {
                            lyj = item.id;
                        }
                    }
                    let send = '';
                    for (let i = 0; i < 10; i++) {
                        send += "$wait 500;use " + lyj + ";";
                        if (byj != '') {
                            send += "$wait 500;use " + byj + ";";
                        }
                    }
                    WG.SendCmd(send);
                }
                WG.remove_hook(WG.yj_hook);
            });
            WG.Send("pack");
            await WG.sleep(20000);
        },
        gpSkill_hook: undefined,
        getPlayerSkill: async function () {
            WG.gpSkill_hook = WG.add_hook("dialog", (data) => {
                if ((data.dialog && data.dialog == 'skills') && data.items && data.items != null) {
                    var html = `<div class="item-commands ">
                <span class = "copycha" data-clipboard-target = ".target1" >
                        技能详情复制到剪贴板 </span></div> `;
                    messageAppend(html);
                    $(".copycha").on('click', () => {
                        var dd = G.level.replace(/<\/?.+?>/g, "");
                        var dds = dd.replace(/ /g, "");
                        var copydata = {
                            player: role,
                            level: dds,
                            family: G.pfamily,
                            items: data.items
                        };
                        copyToClipboard(JSON.stringify(copydata));
                        messageAppend("复制成功");
                    });
                    WG.remove_hook(WG.gpSkill_hook);
                    WG.gpSkill_hook = undefined;
                }
            });
            KEY.do_command("skills");
            KEY.do_command("skills");
            WG.Send("cha");
        },
        make_config: async function () {
            let _config = {};
            _config.family = GM_getValue(role + "_family", family);
            _config.automarry = GM_getValue(role + "_automarry", automarry);
            _config.autoKsBoss = GM_getValue(role + "_autoKsBoss", autoKsBoss);
            _config.ks_pfm = GM_getValue(role + "_ks_pfm", ks_pfm);
            _config.ks_wait = GM_getValue(role + "_ks_wait", ks_wait);
            _config.eqlist = GM_getValue(role + "_eqlist", eqlist);
            _config.skilllist = GM_getValue(role + "_skilllist", skilllist);
            _config.autoeq = GM_getValue(role + "_auto_eq", autoeq);
            _config.wudao_pfm = GM_getValue(role + "_wudao_pfm", wudao_pfm);
            _config.sm_loser = GM_getValue(role + "_sm_loser", sm_loser);
            _config.sm_price = GM_getValue(role + "_sm_price", sm_price);
            _config.sm_getstore = GM_getValue(role + "_sm_getstore", sm_getstore);
            _config.unauto_pfm = GM_getValue(role + "_unauto_pfm", unauto_pfm);
            _config.auto_pfmswitch = GM_getValue(role + "_auto_pfmswitch", auto_pfmswitch);
            _config.auto_rewardgoto = GM_getValue(role + "_auto_rewardgoto", auto_rewardgoto);
            _config.auto_updateStore = GM_getValue(role + "_auto_updateStore", auto_updateStore);
            _config.auto_relogin = GM_getValue(role + "_auto_relogin", auto_relogin);
            _config.zmlshowsetting = GM_getValue(role + "_zmlshowsetting", zmlshowsetting);
            _config.blacklist = GM_getValue(role + "_blacklist", blacklist);
            _config.getitemShow = GM_getValue(role + "_getitemShow", getitemShow);
            _config.zml = GM_getValue(role + "_zml", zml);
            _config.zdy_item_store = GM_getValue(role + "_zdy_item_store", zdy_item_store);
            _config.zdy_item_store2 = GM_getValue(role + "_zdy_item_store2", zdy_item_store2);
            _config.zdy_item_lock = GM_getValue(role + "_zdy_item_lock", zdy_item_lock);
            _config.zdy_item_drop = GM_getValue(role + "_zdy_item_drop", zdy_item_drop);
            _config.zdy_item_fenjie = GM_getValue(role + "_zdy_item_fenjie", zdy_item_fenjie);
            _config.ztjk_item = GM_getValue(role + "_ztjk", ztjk_item);
            _config.auto_command = GM_getValue(role + "_auto_command", auto_command);
            _config.welcome = GM_getValue(role + "_welcome", welcome);
            _config.shieldswitch = GM_getValue("_shieldswitch", shieldswitch);
            _config.shield = GM_getValue("_shield", shield);
            _config.shieldkey = GM_getValue("_shieldkey", shieldkey);
            _config.statehml = GM_getValue(role + "_statehml", statehml);
            _config.backimageurl = GM_getValue(role + "_backimageurl", backimageurl);
            _config.loginhml = GM_getValue(role + "_loginhml", loginhml);
            _config.timequestion = GM_getValue(role + "_timequestion", timequestion);
            _config.silence = GM_getValue(role + "_silence", silence);
            _config.dpssakada = GM_getValue(role + "_dpssakada", dpssakada);
            _config.funnycalc = GM_getValue(role + "_funnycalc", funnycalc);

            _config.zdy_btnlist = GM_getValue(role + "_zdy_btnlist", zdy_btnlist);
            _config.auto_buylist = GM_getValue(role + "_auto_buylist", auto_buylist);



            _config.zdyskills = GM_getValue(role + "_zdyskills", zdyskills);

            _config.zdyskilllist = GM_getValue(role + "_zdyskilllist", zdyskilllist);
            S.uploadUserConfig(G.id, _config, (res) => {
                if (res == "true") {
                    L.msg("已成功上传");
                }
            });
        },
        load_config: async function () {
            S.getUserConfig(G.id, (res) => {
                if (res != "") {
                    let _config = JSON.parse(res);
                    GM_setValue(role + "_family", _config.family);
                    GM_setValue(role + "_automarry", _config.automarry);
                    GM_setValue(role + "_autoKsBoss", _config.autoKsBoss);
                    GM_setValue(role + "_ks_pfm", _config.ks_pfm);
                    GM_setValue(role + "_ks_wait", _config.ks_wait);
                    GM_setValue(role + "_eqlist", _config.eqlist);
                    GM_setValue(role + "_skilllist", _config.skilllist);
                    GM_setValue(role + "_auto_eq", _config.autoeq);
                    GM_setValue(role + "_wudao_pfm", _config.wudao_pfm);
                    GM_setValue(role + "_sm_loser", _config.sm_loser);
                    GM_setValue(role + "_sm_price", _config.sm_price);
                    GM_setValue(role + "_sm_getstore", _config.sm_getstore);
                    GM_setValue(role + "_unauto_pfm", _config.unauto_pfm);
                    GM_setValue(role + "_auto_pfmswitch", _config.auto_pfmswitch);
                    GM_setValue(role + "_auto_rewardgoto", _config.auto_rewardgoto);
                    GM_setValue(role + "_auto_updateStore", _config.auto_updateStore);
                    GM_setValue(role + "_auto_relogin", _config.auto_relogin);
                    GM_setValue(role + "_zmlshowsetting", _config.zmlshowsetting);
                    GM_setValue(role + "_blacklist", _config.blacklist);
                    GM_setValue(role + "_getitemShow", _config.getitemShow);
                    GM_setValue(role + "_zml", _config.zml);
                    GM_setValue(role + "_zdy_item_store", _config.zdy_item_store);
                    GM_setValue(role + "_zdy_item_store2", _config.zdy_item_store2);
                    GM_setValue(role + "_zdy_item_lock", _config.zdy_item_lock);
                    GM_setValue(role + "_zdy_item_drop", _config.zdy_item_drop);
                    GM_setValue(role + "_zdy_item_fenjie", _config.zdy_item_fenjie);
                    GM_setValue(role + "_ztjk", _config.ztjk_item);
                    GM_setValue(role + "_auto_command", _config.auto_command);
                    GM_setValue(role + "_welcome", _config.welcome);
                    GM_setValue("_shieldswitch", _config.shieldswitch);
                    GM_setValue("_shield", _config.shield);
                    GM_setValue("_shieldkey", _config.shieldkey);
                    GM_setValue(role + "_statehml", _config.statehml);
                    GM_setValue(role + "_backimageurl", _config.backimageurl);
                    GM_setValue(role + "_loginhml", _config.loginhml);
                    GM_setValue(role + "_timequestion", _config.timequestion);
                    GM_setValue(role + "_silence", _config.silence);
                    GM_setValue(role + "_dpssakada", _config.dpssakada);
                    GM_setValue(role + "_funnycalc", _config.funnycalc);
                    GM_setValue(role + "_zdyskills", _config.zdyskills);
                    GM_setValue(role + "_zdyskilllist", _config.zdyskilllist);
                    if (_config.zdy_btnlist) {
                        GM_setValue(role + "_zdy_btnlist", _config.zdy_btnlist);
                    }
                    if (_config.auto_buylist) {
                        GM_setValue(role + "_auto_buylist", _config.auto_buylist);
                    }
                    GI.configInit();

                    WG.setting();
                    WG.ztjk_func();
                    WG.zml_showp();
                    WG.dsj_func();
                    L.msg("已成功加载");
                }
            });
        }, //设置
        setting: function () {
            KEY.do_command("setting");

            $('.footer-item')[$('.footer-item').length - 1].click();
            GI.configInit();
            if ($('.dialog-custom .zdy_dialog').length == 0) {
                var a = UI.syssetting();
                $(".dialog-custom").on("click", ".switch2", UI.switchClick);
                $(".dialog-custom").prepend(a);
                $("#family").change(function () {
                    family = $("#family").val();
                    GM_setValue(role + "_family", family);
                });
                $('#wudao_pfm').focusout(function () {
                    wudao_pfm = $('#wudao_pfm').val();
                    GM_setValue(role + "_wudao_pfm", wudao_pfm);
                });
                $('#sm_loser').click(function () {
                    sm_loser = WG.switchReversal($(this));
                    GM_setValue(role + "_sm_loser", sm_loser);
                });
                $('#sm_price').click(function () {
                    sm_price = WG.switchReversal($(this));
                    GM_setValue(role + "_sm_price", sm_price);
                });
                $('#sm_getstore').click(function () {
                    sm_getstore = WG.switchReversal($(this));
                    GM_setValue(role + "_sm_getstore", sm_getstore);
                });
                $('#ks_pfm').focusout(function () {
                    ks_pfm = $('#ks_pfm').val();
                    GM_setValue(role + "_ks_pfm", ks_pfm);
                });
                $('#ks_wait').focusout(function () {
                    ks_wait = $('#ks_wait').val();
                    GM_setValue(role + "_ks_wait", ks_wait);
                });
                $('#marry_kiss').click(function () {
                    automarry = WG.switchReversal($(this));
                    GM_setValue(role + "_automarry", automarry);
                });
                $('#ks_Boss').click(function () {
                    autoKsBoss = WG.switchReversal($(this));
                    GM_setValue(role + "_autoKsBoss", autoKsBoss);
                });
                $('#auto_eq').change(function () {
                    autoeq = $('#auto_eq').val();
                    GM_setValue(role + "_auto_eq", autoeq);

                });
                $('#autopfmswitch').click(function () {
                    auto_pfmswitch = WG.switchReversal($(this));
                    GM_setValue(role + "_auto_pfmswitch", auto_pfmswitch);
                    if (auto_pfmswitch == "开") {
                        G.auto_preform = true;
                    } else {
                        G.auto_preform = false;
                    }
                });
                $('#autorewardgoto').click(function () {
                    auto_rewardgoto = WG.switchReversal($(this));
                    GM_setValue(role + "_auto_rewardgoto", auto_rewardgoto);
                });

                $('#autoupdateStore').click(function () {
                    auto_updateStore = WG.switchReversal($(this));
                    GM_setValue(role + "_auto_updateStore", auto_updateStore);
                });
                $('#autorelogin').click(function () {
                    auto_relogin = WG.switchReversal($(this));
                    GM_setValue(role + "_auto_relogin", auto_relogin);
                });
                $("#zmlshowsetting").change(function () {
                    zmlshowsetting = $('#zmlshowsetting').val();
                    GM_setValue(role + "_zmlshowsetting", zmlshowsetting);
                    WG.zml_showp();
                });
                $('#getitemShow').click(function () {
                    getitemShow = WG.switchReversal($(this));
                    GM_setValue(role + "_getitemShow", getitemShow);

                    if (getitemShow == "开") {
                        G.getitemShow = true;
                    } else {
                        G.getitemShow = false;
                    }
                });
                $('#unauto_pfm').change(function () {
                    unauto_pfm = $('#unauto_pfm').val();
                    GM_setValue(role + "_unauto_pfm", unauto_pfm);
                    var unpfm = unauto_pfm.split(',');
                    blackpfm = [];
                    for (var pfmname of unpfm) {
                        if (pfmname)
                            blackpfm.push(pfmname);
                    }
                });
                $('#store_info').change(function () {
                    zdy_item_store = $('#store_info').val();
                    GM_setValue(role + "_zdy_item_store", zdy_item_store);
                    store_list = zdy_item_store.split(",");
                    store_list = store_list.concat(zdy_item_store2.split(","));
                });
                $('#store_info2').change(function () {
                    zdy_item_store2 = $('#store_info2').val();
                    GM_setValue(role + "_zdy_item_store2", zdy_item_store2);
                    store_list = zdy_item_store2.split(",");
                    store_list = store_list.concat(zdy_item_store.split(","));
                });
                $('#lock_info').change(function () {
                    zdy_item_lock = $('#lock_info').val();
                    GM_setValue(role + "_zdy_item_lock", zdy_item_lock);
                    lock_list = zdy_item_lock.split(",");
                });
                $('#store_drop_info').change(function () {
                    zdy_item_drop = $('#store_drop_info').val();
                    GM_setValue(role + "_zdy_item_drop", zdy_item_drop);
                    drop_list = zdy_item_drop.split(",");
                });
                $('#store_fenjie_info').change(function () {
                    zdy_item_fenjie = $('#store_fenjie_info').val();
                    GM_setValue(role + "_zdy_item_fenjie", zdy_item_fenjie);
                    fenjie_list = zdy_item_fenjie.split(",");
                });
                $('#auto_command').change(function () {
                    auto_command = $('#auto_command').val();
                    GM_setValue(role + "_auto_command", auto_command);
                });
                $('#blacklist').change(function () {
                    blacklist = $('#blacklist').val();
                    GM_setValue(role + "_blacklist", blacklist);
                });
                $('#welcome').focusout(function () {
                    welcome = $('#welcome').val();
                    GM_setValue(role + "_welcome", welcome);
                });

                $('#shieldswitch').click(function () {

                    shieldswitch = WG.switchReversal($(this));
                    GM_setValue("_shieldswitch", shieldswitch);
                    if (shieldswitch == "开") {
                        messageAppend('已注入屏蔽系统', 0, 1);
                    }
                });
                $('#zdyskillsswitch').click(function () {

                    zdyskills = WG.switchReversal($(this));
                    GM_setValue(role + "_zdyskills", zdyskills);
                    if (zdyskills == "开") {
                        messageAppend('已开启自定义技能顺序，填写顺序后，请刷新游戏生效', 0, 1);
                    }
                });

                $('#zdyskilllist').change(function () {

                    let x = JSON.parse($("#zdyskilllist").val());
                    if(!typeof x instanceof Array){
                        alert("无效的输入")
                        return false;
                    }else{
                    zdyskilllist = $("#zdyskilllist").val();
                        GM_setValue(role + "_zdyskilllist", zdyskilllist);
                    }
                });
                $('#silence').click(function () {

                    silence = WG.switchReversal($(this));
                    GM_setValue(role + "_silence", silence);
                    if (silence == "开") {
                        messageAppend('已开启安静模式', 0, 1);
                    }
                });
                $('#dpssakada').click(function () {

                    dpssakada = WG.switchReversal($(this));
                    GM_setValue(role + "_dpssakada", dpssakada);
                    if (dpssakada == "开") {
                        messageAppend('已开启战斗统计', 0, 1);
                    }
                });
                $('#funnycalc').click(function () {

                    funnycalc = WG.switchReversal($(this));
                    GM_setValue(role + "_funnycalc", funnycalc);
                    if (funnycalc == "开") {
                        messageAppend('已开启FUNNY计算', 0, 1);
                    }
                });
                $('#shield').focusout(function () {
                    shield = $('#shield').val();
                    GM_setValue("_shield", shield);
                });
                $('#shieldkey').focusout(function () {
                    shieldkey = $('#shieldkey').val();
                    GM_setValue("_shieldkey", shieldkey);
                });

                $('#statehml').change(function () {
                    statehml = $('#statehml').val();
                    GM_setValue(role + "_statehml", statehml);
                });
                $('#backimageurl').change(function () {
                    backimageurl = $('#backimageurl').val();
                    GM_setValue(role + "_backimageurl", backimageurl);
                    if (backimageurl != '') {
                        WG.SendCmd("setting backcolor none");
                        GM_addStyle(`body{
              background-color:rgb(0,0,0,.25)
                }
                div{
                    opacity:1;
                }
                html{
                background:rgba(255,255,255,0.25);
                background-image:url('${backimageurl}');
                background-repeat:no-repeat;
                background-size:100% 100%;
                -moz-background-size:100% 100%;
            }
            `);
                    }
                });
                $('#loginhml').change(function () {
                    loginhml = $('#loginhml').val();
                    GM_setValue(role + "_loginhml", loginhml);
                });
                $('#autobuy').change(function () {
                    auto_buylist = $('#autobuy').val();
                    GM_setValue(role + "_auto_buylist", auto_buylist);
                });
                $(".update_id_all").on("click", WG.update_id_all);
                $(".update_store").on("click", WG.update_store);
                $('.backup_btn').on('click', WG.make_config);
                $('.load_btn').on('click', WG.load_config);
                $('.clean_dps').on('click', WG.clean_dps);

                $('.clear_skillJson').on('click', ()=>{
                    zdyskilllist == "";
                    messageAppend("已关闭自定义，请刷新重新获取技能数据!");
                    zdyskills = "关";
                    GM_setValue(role +"_zdyskilllist","");
                    GM_setValue(role + "_zdyskills", zdyskills);
                });


                $(".savebtn").on("click", function () {
                    let tmp = [];
                    for (let item of keyitem) {
                        let zdybtnitem = {
                            name: '无',
                            send: ''
                        };
                        let pname = $(`#name${item}`).val();
                        let psend = $(`#send${item}`).val();
                        if (pname != '') {
                            zdybtnitem.name = pname;
                            zdybtnitem.send = psend;
                        }

                        tmp.push(zdybtnitem);
                    }
                    zdy_btnlist = tmp;
                    GM_setValue(role + "_zdy_btnlist", zdy_btnlist);
                    messageAppend("保存自定义按钮成功");
                    WG.zdy_btnListInit();
                });
            }

            $('#family').val(family);
            $('#wudao_pfm').val(wudao_pfm);
            $('#sm_loser').val(sm_loser);
            $('#sm_price').val(sm_price);
            $('#sm_getstore').val(sm_getstore);
            $('#ks_pfm').val(ks_pfm);
            $("#ks_wait").val(ks_wait);
            $('#marry_kiss').val(automarry);
            $('#ks_Boss').val(autoKsBoss);
            $('#auto_eq').val(autoeq);
            $('#autopfmswitch').val(auto_pfmswitch);
            $('#autorewardgoto').val(auto_rewardgoto);
            $('#autoupdateStore').val(auto_updateStore);
            $('#autorelogin').val(auto_relogin);
            $("#zmlshowsetting").val(zmlshowsetting);
            $('#getitemShow').val(getitemShow);
            $('#unauto_pfm').val(unauto_pfm);
            $('#store_info').val(zdy_item_store);
            $('#store_info2').val(zdy_item_store2);

            $('#lock_info').val(zdy_item_lock);
            $('#store_drop_info').val(zdy_item_drop);
            $('#store_fenjie_info').val(zdy_item_fenjie);
            $('#auto_command').val(auto_command);
            $("#blacklist").val(blacklist);
            $('#welcome').val(welcome);
            $('#shieldswitch').val(shieldswitch);
            $('#silence').val(silence);
            $('#dpssakada').val(dpssakada);
            $('#funnycalc').val(funnycalc);
            $('#shield').val(shield);
            $('#shieldkey').val(shieldkey);
            $('#statehml').val(statehml);
            $("#backimageurl").val(backimageurl);
            $("#loginhml").val(loginhml);
            $("#autobuy").val(auto_buylist);

            $("#zdyskillsswitch").val(zdyskills);
            $("#zdyskilllist").val(zdyskilllist);
            //自定义按钮刷新
            var keyitem = ["Q", "W", "E", "R", "T", "Y"];
            let zdybtni = 0;
            for (let item of keyitem) {
                $(`#name${item}`).val(zdy_btnlist[zdybtni].name);
                $(`#send${item}`).val(zdy_btnlist[zdybtni].send);
                zdybtni = zdybtni + 1;
            }
            for (let w = $(".setting>.setting-item2"), t = 0; t < w.length; t++) {
                var s = $(w[t]),
                    i = s.attr("for");
                if (i) {
                    var n = eval(i);
                    switch (i) {
                        default:
                            "开" == n && (s.find(".switch2").addClass("on"), s.find(".switch-text").html("开"))
                    }
                }
            }
        },
        zdybtnfunc: function (type) {
            WG.SendCmd(zdy_btnlist[type].send);
        },
        zdy_btnset: function () {
            zdy_btnlist = GM_getValue(role + "_zdy_btnlist", zdy_btnlist);
            messageClear();
            let html = UI.zdyBtnsetui();
            messageAppend(html);
            var keyitem = ["Q", "W", "E", "R", "T", "Y"];
            let i = 0;
            for (let item of keyitem) {
                $(`#name${item}`).val(zdy_btnlist[i].name);
                $(`#send${item}`).val(zdy_btnlist[i].send);
                i = i + 1;
            }
            $(".savebtn").off('click');
            $(".savebtn").on("click", function () {
                let tmp = [];
                for (let item of keyitem) {
                    let zdybtnitem = {
                        name: '无',
                        send: ''
                    };
                    let pname = $(`#name${item}`).val();
                    let psend = $(`#send${item}`).val();
                    if (pname != '') {
                        zdybtnitem.name = pname;
                        zdybtnitem.send = psend;
                    }

                    tmp.push(zdybtnitem);
                }
                zdy_btnlist = tmp;
                GM_setValue(role + "_zdy_btnlist", zdy_btnlist);
                messageAppend("保存成功");
                WG.zdy_btnListInit();
            });
        },
        zdy_btnListInit: function () {
            zdy_btnlist = GM_getValue(role + "_zdy_btnlist", zdy_btnlist);
            inzdy_btn = GM_getValue(role + "_inzdy_btn", inzdy_btn);
            if (zdy_btnlist.length == 0) {
                for (var i = 0; i < 6; i++) {
                    zdy_btnlist.push({
                        "name": "无",
                        "send": ""
                    });
                }
                GM_setValue(role + "_zdy_btnlist", zdy_btnlist);
            }
            if (inzdy_btn) {
                WG.zdy_btnshow();
            } else {
                WG.zdy_btnshow('off');
            }
        },
        zdy_btnshow: function (type = 'on') {
            if (type == 'on') {
                inzdy_btn = true;
                var html = UI.zdybtnui();
                $('.WG_button').remove();
                $(".WG_log").after(html);
                let keyitem = ["Q", "W", "E", "R", "T", "Y"];

                for (let i = 0; i < keyitem.length; i++) {
                    $(`#keyin${keyitem[i]}`).on('click', function () {
                        WG.zdybtnfunc(i);
                    });
                }
                $(".auto_perform").on("click", WG.auto_preform_switch);
                $(".cmd_echo").on("click", WG.cmd_echo_button);
            } else if (type == 'off') {
                inzdy_btn = false;

                var html = UI.btnui();
                $('.WG_button').remove();

                $(".WG_log").after(html);
                $(".sm_button").on("click", WG.sm_button);
                $(".go_yamen_task").on("click", WG.go_yamen_task);
                $(".kill_all").on("click", WG.kill_all);
                $(".get_all").on("click", WG.get_all);
                $(".sell_all").on("click", WG.clean_all);
                $(".zdwk").on("click", WG.zdwk);
                $(".auto_perform").on("click", WG.auto_preform_switch);
                $(".cmd_echo").on("click", WG.cmd_echo_button);
                if (G.level != null && (G.level.indexOf('武帝') >= 0||G.level.indexOf('武神') >= 0)) {
                    $('.zdy-item.zdwk').html("修炼(Y)");
                }
            }

            GM_setValue(role + "_inzdy_btn", inzdy_btn);
        },
        runLoginhml: function () {
            WG.SendCmd(loginhml);
        },
        tnBuy_hook: null,
        tnBuy: function () {
            WG.tnBuy_hook = WG.add_hook(["dialog", "text"], (data) => {
                let _seller;
                let _itemids = new Map();
                let _sendcmd = ""
                if (data.type == 'dialog' && data.title != null && data.title.indexOf("唐楠正在贩卖") >= 0) {
                    _seller = data.seller;
                    for (let item of data.selllist) {
                        if (WG.inArray(item.name, auto_buylist.split(","))) {
                            _itemids.set(item.id, item.count);
                        }
                    }
                    _itemids.forEach((val, key, map) => {
                        _sendcmd = _sendcmd + "buy " + val + " " + key + " from " + _seller + ";";
                        _sendcmd = _sendcmd + "$wait 500;";
                    });
                    _sendcmd = _sendcmd + "look3 1;"
                    WG.SendCmd(_sendcmd);
                }
                if (data.type == "text" && data.msg.indexOf("没有这个玩家") >= 0) {
                    messageAppend("执行结束");
                    WG.remove_hook(WG.tnBuy_hook);
                }

            });

            WG.SendCmd("$to 扬州城-广场;$wait 100;$to 扬州城-当铺;$wait 200;list %唐楠%");

        },
        hooks: [],
        hook_index: 0,
        add_hook: function (types, fn) {
            var hook = {
                'index': WG.hook_index++,
                'types': types,
                'fn': fn
            };
            WG.hooks.push(hook);
            return hook.index;
        },
        remove_hook: function (hookindex) {
            var that = this;
            for (var i = 0; i < that.hooks.length; i++) {
                if (that.hooks[i].index == hookindex) {
                    that.hooks.baoremove(i);
                }
            }
        },
        run_hook: function (type, data) {
            //console.log(data);
            for (var i = 0; i < this.hooks.length; i++) {
                // if (this.hooks[i] !== undefined && this.hooks[i].type == type) {
                //     this.hooks[i].fn(data);
                // }
                var listener = this.hooks[i];
                if (listener.types == data.type || (listener.types instanceof Array && $
                    .inArray(data.type, listener.types) >= 0)) {
                    listener.fn(data);
                }
            }
        },
        receive_message: function (msg) {
            if (!msg || !msg.data) return;
            var data;
            var deepCopy = function (source) {
                var result = {};
                for (var key in source) {
                    result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
                }
                return result;
            }
            if (msg.data[0] == '{' || msg.data[0] == '[') {
                var func = new Function("return " + msg.data + ";");
                data = func();
            } else {
                data = {
                    type: 'text',
                    msg: msg.data
                };
            }
            if (G.cmd_echo && data.type != 'time') {
                console.log(data);
            }

            if (silence == "开") {
                if (data.type == 'state') {
                    if (data.silence == undefined) {
                        if (data.desc != []) {
                            data.desc = [];
                            data.silence = 1;
                            let p = deepCopy(msg);
                            p.data = JSON.stringify(data);
                            WG.run_hook(data.type, data);
                            ws_on_message.apply(this, [p]);
                            return;
                        }
                    }
                }
                if (data.type == 'text') {
                    let pdata = data.msg;
                    let a = pdata.split(/.*造成<wht>|.*造成<hir>|<\/wht>点|<\/hir>点/);
                    if (a[2]) {
                        let b = a[2].split(/伤害|\(|</);
                        messageAppend(`${b[2]}受到<wht>${a[1]}</wht>点<hir>${b[0]}</hir>伤害！`, 0, 1);
                        WG.run_hook(data.type, data);
                        return;
                    }
                }
            }
            if (data.type == 'msg') {
                if (shieldswitch == '开') {
                    if (shield != undefined &&
                        (shield.indexOf(data.name) >= 0 ||
                            shield.indexOf(data.uid) >= 0))
                        return;
                    var skey = shieldkey.split(",");
                    for (let keyword of skey) {
                        if (keyword != "" && data.content.indexOf(keyword) >= 0) {
                            return;
                        }
                    }
                }
            }


            if (data.type == 'dialog' && data.t == 'fam' && data.k == undefined) {
                if (UI.toui[data.index] != undefined) {
                    data.desc += "\n";
                    data.desc += UI.toui[data.index];
                    data.k = 'knva';
                    let p = deepCopy(msg);
                    p.data = JSON.stringify(data);
                    WG.run_hook(data.type, data);
                    ws_on_message.apply(this, [p]);
                    return;
                }
            }
            if (data.type == 'dialog' && data.t == 'fb' && data.k == undefined) {
                data.desc += "\n";
                data.desc += UI.fbui(fb_path[data.index], data.is_multi, data.is_diffi)
                data.k = 'knva';
                let p = deepCopy(msg);
                p.data = JSON.stringify(data);
                WG.run_hook(data.type, data);
                ws_on_message.apply(this, [p]);
                return;
            }
            if (data.type == 'dialog' && data.dialog == 'pack' && data.from == 'item' && data.k == undefined) {
                let itemname = data.desc.split("\n")[0];
                data.desc += "\n";
                data.desc += UI.itemui(itemname);
                data.k = 'knva';
                let p = deepCopy(msg);
                p.data = JSON.stringify(data);
                WG.run_hook(data.type, data);
                ws_on_message.apply(this, [p]);
                return;
            }
            if (data.type == "perform"){
                if(zdyskills == "开"){
                    zdyskilllist = GM_getValue(role+"_zdyskilllist", zdyskilllist);
                    data.skills = JSON.parse(zdyskilllist);
                    let p = deepCopy(msg);
                    p.data = JSON.stringify(data);
                    WG.run_hook(data.type, data);
                    ws_on_message.apply(this, [p]);
                    return;
                }
            }
            WG.run_hook(data.type, data);

            ws_on_message.apply(this, arguments);
        },

    };
    //助手函数
    var T = {
        //private
        _recmd: function (cmds) {
            if (cmds) {
                cmds = cmds instanceof Array ? cmds : cmds.split(';');
                cmds.baoremove(0);
                cmds = cmds.join(";");
                return cmds;
            } else {
                return "";
            }
        },
        recmd: function (idx, cmds) {
            for (let i = 0; i < idx + 1; i++) {
                cmds = T._recmd(cmds);
            }
            return cmds;
        },
        findhook: undefined,
        _findItem: async function (itemname, callback) {
            console.log("finditem" + itemname);
            T.findhook = WG.add_hook("dialog", async function (data) {
                if (data.items) {
                    for (let item of data.items) {
                        if (item.name == itemname) {
                            callback(item.id);
                            WG.remove_hook(T.findhook);
                        }
                    }
                    callback("");
                }
                WG.remove_hook(T.findhook);
            });

            WG.Send("pack");
        },
        //public
        pname: function (idx = 0, n, cmds) {
            T.findPlayerByName(idx, n, cmds);
        },
        findPlayerByName: function (idx = 0, n, cmds) {
            cmds = T.recmd(idx - 1, cmds);
            if (cmds.indexOf(",") >= 0) {
                cmds = cmds.split(",");
            } else {
                cmds = cmds.split(";");
            }
            let p = cmds[0].split("$")[0];
            cmds = T.recmd(0, cmds);
            p = p.replaceAll("-", " ");
            if (p[p.length - 1] == " ") {

                p = p.substring(0, p.length - 1)
            }
            console.log("findPlayerByName" + n);

            for (let i = 0; i < roomData.length; i++) {
                if (roomData[i].name && roomData[i].name.indexOf(n) >= 0) {
                    WG.Send(p + " " + roomData[i].id);
                }
            }
            WG.SendCmd(cmds);
        },
        findItem: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx - 1, cmds);
            if (cmds.indexOf(",") >= 0) {
                cmds = cmds.split(",");
            } else {
                cmds = cmds.split(";");
            }
            let p = cmds[0].split(" ")[0];
            cmds = T.recmd(0, cmds);
            console.log("finditem" + n);

            WG.Send("pack");
            // console.log(packData)
            for (let item of packData) {
                if (item.name == n) {
                    if (p == "fenjie" || p == "drop") {
                        if (item.name.indexOf("★") >= 0) {
                            messageAppend("高级物品 ,不分解");
                            continue;
                        }
                    }
                    WG.SendCmd(p + " " + item.id);
                }
            }

            WG.SendCmd(cmds);
        },
        wait: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            console.log("延时:" + n + "ms,延时触发:" + cmds);
            await WG.sleep(parseInt(n));
            WG.SendCmd(cmds);
        },
        killall: async function (idx = 0, n = null, cmds) {
            cmds = T.recmd(idx, cmds);
            console.log("叫杀");
            WG.kill_all();
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        getall: async function (idx = 0, n = null, cmds) {
            cmds = T.recmd(idx, cmds);
            console.log("拾取");
            WG.get_all();
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        cleanall: async function (idx = 0, n = null, cmds) {
            cmds = T.recmd(idx, cmds);
            console.log("清包");
            WG.clean_all();
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        to: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.go(n);
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        eq: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            if (n == "0") {
                WG.uneqall();
            } else {
                WG.eqhelper(n);
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        eqskill: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            if (n == "0") {
                WG.uneqall();
            } else {
                WG.eqhelper(n, 1);
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        zdwk: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.zdwk();
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        rzdwk: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.zdwk("",false);
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        killhook: undefined,
        killw: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            var killid = "";
            for (let i = 0; i < roomData.length; i++) {
                if (roomData[i].name && roomData[i].name.indexOf(n) >= 0) {
                    killid = roomData[i].id;
                }
            }
            T.killhook = WG.add_hook('itemremove', function (data) {
                if (data.id == killid) {
                    WG.SendCmd(cmds);
                    WG.remove_hook(T.killhook);
                    T.killhook = undefined;
                }
            });
            WG.SendCmd("kill " + killid);
        },
        eqhook: undefined,
        eqw: async function (idx = 0, n, cmds) {
            var pcmds = T.recmd(idx, cmds);
            if (n.indexOf("<") >= 0) {
                T._findItem(n, async function (id) {
                    let p_itemid = id;
                    let p_flag = true;
                    if (p_itemid == "") {
                        p_flag = false;
                        WG.SendCmd(pcmds);
                        return;
                    }
                    T.eqhook = WG.add_hook('dialog', function (data) {
                        if (data.eq == 0 && data.id == p_itemid) {
                            p_flag = false;
                            WG.SendCmd(pcmds);
                            WG.remove_hook(T.eqhook);
                            T.eqhook = undefined;
                        }
                    });
                    while (p_flag) {
                        WG.Send("pack");
                        WG.SendCmd('eq ' + p_itemid);
                        await WG.sleep(1000);
                    }

                });
            } else {
                let p_itemid = n;
                let p_flag = true;
                if (p_itemid == "") {
                    p_flag = false;
                    WG.SendCmd(pcmds);
                    return;
                }
                T.eqhook = WG.add_hook(['text', 'dialog'], function (data) {
                    if (data.type == 'dialog') {
                        if (data.eq == 0 && data.id == p_itemid) {
                            p_flag = false;
                            WG.SendCmd(pcmds);
                            WG.remove_hook(T.eqhook);
                            T.eqhook = undefined;
                        }
                    }
                    if (data.type == 'text') {
                        if (data.msg.indexOf("你要装备什么") >= 0) {
                            p_flag = false;
                            WG.SendCmd(pcmds);
                            WG.remove_hook(T.eqhook);
                            T.eqhook = undefined;
                        }
                    }
                });
                while (p_flag) {
                    WG.Send("pack");
                    WG.SendCmd('eq ' + p_itemid);
                    await WG.sleep(1000);
                }
            }
        },
        usezml: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            zml = GM_getValue(role + "_zml", zml);
            for (var zmlitem of zml) {
                if (zmlitem.name == n) {
                    await WG.zmlfire(zmlitem);
                }
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        waitpfm: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            let _flag = true;
            let pfmnum = 0;

            while (_flag) {
                if (!G.gcd && !G.cds.get(n)) {
                    WG.Send("perform " + n);
                    pfmnum++;
                    if (G.cds.get(n) && _flag) {
                        _flag = false;
                        WG.SendCmd(cmds);
                    }
                    if (!G.in_fight && _flag) {
                        _flag = false;
                        WG.SendCmd(cmds);
                    }
                    if (pfmnum >= 1 && _flag) {
                        _flag = false;
                        WG.SendCmd(cmds);
                    }
                }
                pfmnum++;
                await WG.sleep(350);
            }

        },
        startjk: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            ztjk_item = GM_getValue(role + "_ztjk", ztjk_item);
            for (var item of ztjk_item) {
                if (item.name == n) {
                    item.isactive = 1;
                    GM_setValue(role + "_ztjk", ztjk_item);
                    WG.ztjk_func();
                    messageAppend("已注入" + item.name, 0, 1);
                    break;
                }
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        stopjk: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            ztjk_item = GM_getValue(role + "_ztjk", ztjk_item);
            for (var item of ztjk_item) {
                if (item.name == n) {
                    item.isactive = 0;
                    GM_setValue(role + "_ztjk", ztjk_item);
                    WG.ztjk_func();
                    messageAppend("已暂停" + item.name);
                    break;
                }
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        sm: async function (idx = 0, n = 0, cmds = '') {
            cmds = T.recmd(idx, cmds);
            WG.sm_button();

            while ($('.sm_button').text().indexOf("停止") >= 0) {
                await WG.sleep(1000);
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        daily: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            KEY.do_command("tasks");
            await WG.oneKeyyj();
            messageAppend("执行请安.", 1);
            await WG.oneKeyQA();
            WG.oneKeyDaily();
            await WG.sleep(2000);
            while (WG.daily_hook != undefined) {
                await WG.sleep(1000);
            }
            WG.Send('tasks');
            await WG.sleep(1000);
            WG.oneKeySD();
            while (WG.sd_hook) {
                await WG.sleep(1000);
            }

            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        xiyan: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.xiyan();
            await WG.sleep(1000);
            while (WG.marryhy) {
                await WG.sleep(1000);
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        yamen: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.go_yamen_task();
            await WG.sleep(1000);
            while (WG.yamen_lister) {
                await WG.sleep(1000);
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        wudao: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.wudao_auto();
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        boss: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.kksBoss({
                content: "听说xxx出现在逍遥派-青草坪一带。"
            });
            await WG.sleep(1000);
            while (WG.ksboss) {
                await WG.sleep(1000);
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        stoppfm: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            if (G.auto_preform) {
                G.auto_preform = false;
                messageAppend("<hio>自动施法</hio>关闭");
                WG.auto_preform("stop");
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        startpfm: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            if (!G.auto_preform) {
                G.auto_preform = true;
                messageAppend("<hio>自动施法</hio>开启");
                WG.auto_preform();
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        stopautopfm: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            var dellist = n.split(",");
            for (let p of dellist) {
                if (!WG.inArray(p, blackpfm)) {
                    blackpfm.push(p);
                }
            }
            console.log("当前自动施法黑名单为:" + blackpfm);
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        startautopfm: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            let dellist = n.split(",");
            for (var i = 0; i < blackpfm.length; i++) {
                for (var item of dellist) {
                    if (item == blackpfm[i]) {
                        blackpfm.baoremove(i);
                    }
                }
            }
            console.log("当前自动施法黑名单为:" + blackpfm);
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        store: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            await WG.sell_all(1, 0, 0);
            while (WG.packup_listener) {
                await WG.sleep(200);
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        fenjie: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            await WG.sell_all(0, 1, 0);
            while (WG.packup_listener) {
                await WG.sleep(200);
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        drop: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            await WG.sell_all(0, 0, 1);
            while (WG.packup_listener) {
                await WG.sleep(200);
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        sellall: async function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            await WG.sell_all(1, 1, 1);
            while (WG.packup_listener) {
                await WG.sleep(200);
            }
            await WG.sleep(100);
            WG.SendCmd(cmds);
        },
        callcontextMenu: function (idx = 0, n, cmds) {
            $('.container').contextMenu({
                x: 1,
                y: 1
            })
        },
        stopallauto: function (idx = 0, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.stopAllAuto();
            messageAppend("暂停自动喜宴及自动BOSS", 0, 1);
            WG.SendCmd(cmds);
        },
        startallauto: function (idx, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.reSetAllAuto();
            messageAppend("恢复自动喜宴及自动BOSS", 0, 1);
            WG.SendCmd(cmds);
        },
        roll: function (idx, n, cmds) {
            cmds = T.recmd(idx, cmds);
            if (n == 1) {
                WG.SendCmd("pty " + Math.random() * 100);
            } else if (n == 2) {

                WG.SendCmd("chat " + Math.random() * 100);
            } else if (n == 3) {

                WG.SendCmd("say " + Math.random() * 100);
            }
            WG.SendCmd(cmds);
        },
        addstore: function (idx, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.addstore(n);
            WG.SendCmd(cmds);
        }, addlock: function (idx, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.addlock(n);
            WG.SendCmd(cmds);
        }, dellock: function (idx, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.dellock(n);
            WG.SendCmd(cmds);
        }, tnbuy: function (idx, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.tnBuy();
            WG.SendCmd(cmds);
        },
        addfenjieid: function (idx, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.addfenjieid(n);
            WG.SendCmd(cmds);
        },
        adddrop: function (idx, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.adddrop(n);
            WG.SendCmd(cmds);
        },
        clsSakada: function (idx, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.clean_dps();
            WG.SendCmd(cmds);
        },
        cls: function (idx, n, cmds) {
            cmds = T.recmd(idx, cmds);
            messageClear();
            WG.SendCmd(cmds);
        },
        syso: function (idx, n, cmds) {
            cmds = T.recmd(idx, cmds);
            messageAppend(n);
            WG.SendCmd(cmds);
        },
        stop: function (idx, n, cmds) {
            cmds = T.recmd(idx, cmds);
            WG.timer_close();
            WG.SendCmd(cmds);
        },
        tts: function (idx, n, cmds) {
            cmds = T.recmd(idx, cmds);
            FakerTTS.playtts(n);
            WG.SendCmd(cmds);
        },
        music: function (idx, n, cmds) {
            cmds = T.recmd(idx, cmds);
            var music = new MusicBox({
                loop: false, // 循环播放
                musicText: '3· 2· 3· 6 - 6 6 6 5· 2· - 2· 2· - - 3· 2· 3· 5 - 5 5 3 5 5· - 2· - 2· 2·',  // 绿色
                autoplay: 4, // 自动弹奏速度
                type: 'square',  // 音色类型  sine|square|triangle|sawtooth
                duration: 3  // 键音延长时间
            });
            WG.SendCmd(cmds);
        }


    };
    var ProConsole = {
        init: function () {
            //判断
            if (!L.isMobile()) {
                layer.open({
                    type: 1,
                    title: "运行命令",
                    shade: false,
                    offset: "rb",
                    zIndex: 961024,
                    success: function (layero, index) {
                        layer.style(index, {
                            marginLeft: -220,
                        });
                    },
                    content: $(".runtest")
                });
                var lastrun = GM_getValue("_lastrun", "");
                if (lastrun != "") {
                    $("#testmain").val(lastrun);
                }
                $("#runtesta").off("click");
                $("#runtesta").on('click', function () {
                    if ($('#testmain').val().split("\n")[0].indexOf("//") >= 0) {
                        if (unsafeWindow && unsafeWindow.ToRaid) {
                            ToRaid.perform($('#testmain').val());
                        }
                    } else if ($('#testmain').val().split("\n")[0].indexOf("#js") >= 0) {
                        var jscode = $('#testmain').val().split("\n");
                        jscode.baoremove(0)
                        eval(jscode.join(""));
                    } else {
                        WG.SendCmd($('#testmain').val());
                    }

                });
                $("#testmain").focusout(function () {
                    GM_setValue("_lastrun", $('#testmain').val());
                })
            }

        },
        close: function () {
            layer.close();
        }

    }
    //UI
    var UI = {
        codeInput: `<div class="runtest layui-layer-wrap" style="display: none;"> <textarea class="site-demo-text" id="testmain" data-enpassusermodified="yes">//<-第一行输入双斜杠即可运行流程命令 ,第一行输入#js 即可运行JS\n</textarea> <a class="layui-btn layui-btn-normal" id="runtesta" >立即运行</a> </div>`,
        zdybtnui: function () {
            let ui = `<div class='WG_button'>`;
            let keyitem = ["Q", "W", "E", "R", "T", "Y"];
            let i = 0;
            for (let item of zdy_btnlist) {
                ui = ui + ` <span class='zdy-item' id = 'keyin${keyitem[i]}'>${item.name}(${keyitem[i]})</span>`;
                i = i + 1;
            }
            return ui + `<span class="zdy-item auto_perform" style="float:right;"> 自动攻击 </span>
                <span class="zdy-item cmd_echo" style="float:right;">代码</span> </div>`;
        },
        btnui: function () {
            return `<div class='WG_button'><span class='zdy-item sm_button'>师门(Q)</span>
            <span class='zdy-item go_yamen_task'>追捕(W)</span>
            <span class='zdy-item kill_all'>击杀(E)</span>
            <span class='zdy-item get_all'>拾取(R)</span>
            <span class='zdy-item sell_all'>清包(T)</span>
            <span class='zdy-item zdwk'>挖矿(Y)</span>
            <span class="zdy-item auto_perform" style="float:right;"> 自动攻击 </span>
                <span class="zdy-item cmd_echo" style="float:right;">代码</span> </div>`
        },
        wgui: function () {
            let p;
            if (inzdy_btn) {
                p = UI.zdybtnui();
            } else {
                p = UI.btnui();
            }
            return ` <div class='WG_log'>
                    <pre></pre>
                </div>` +
                p;
        },
        zdyBtnsetui: function () {
            let ui = '';

            let keyitem = ["Q", "W", "E", "R", "T", "Y"];
            for (let item of keyitem) {
                ui = ui + `<div class="setting-item setting-item2 ">
                 <div style='width:10%'>${item}:</div><span>名称:<input style='width:20%' id='name${item}' /></span> <span style='margin-left:5px'>命令:<input id='send${item}'/></span>
                </div>`
            }
            ui = ui + `
                         <div class="setting-item" >
                <div class="item-commands"><span class="savebtn">保存自定义按钮设置</span></div>
                        </div>
            `;
            return ui;
        },
        html_lninput: function (prop, title) {
            return `
              <div class="setting-item" >
                <span><label for="${prop}">${title}</label><input id="${prop}" name="${prop}" type="text" style="width:80px" value>
                </span>        </div> `;
        },
        html_input: function (prop, title) {
            return `
                 <div class="setting-item" >
                <span><label for="${prop}"> ${title}</label> </span>
              </div>
              <textarea class="settingbox hide zdy-box" id="${prop}" name="${prop}" style="display: inline-block;">  </textarea>
            `;
        },
        html_switch: function (prop, title, pfor) {
            return `<div class="setting-item setting-item2 " for="${pfor}" style='display: inline-block;'>
                <span class="title"> ${title}</span>
                <span class="switch2" id="${prop}" >
                <span class="switch-button"></span>
                <span class="switch-text">关</span>
                </span>
                </div>
                `;
        },
        switchClick: function (e) {
            let t = $(this),
                s = t.parent().attr("for");
            if (t.is(".on")) {
                t.removeClass("on");
                t.find(".switch-text").html("关")
            } else {
                t.addClass("on");
                t.find(".switch-text").html("开");
            }
        },
        syssetting: function () {
            return `<h3>插件</h3>
                    <div class="setting-item zdy_dialog" >
                有空的话请点个star,您的支持是我最大的动力<a href="https://github.com/knva/wsmud_plugins" target="_blank">https://github.com/knva/wsmud_plugins</a>
                </div> `+
                UI.html_lninput("welcome", "欢迎语： ") + `
                <div class="setting-item" >
                <span><label for="family">门派选择：</label><select id="family" style="width:80px">
                        <option value="武当">武当</option>
                        <option value="华山">华山</option>
                        <option value="少林">少林</option>
                        <option value="峨眉">峨眉</option>
                        <option value="逍遥">逍遥</option>
                        <option value="丐帮">丐帮</option>
                        <option value="武馆">武馆</option>
                        <option value="杀手楼">杀手楼</option>
                    </select>
                </span>
                    </div>`

                + UI.html_switch('autorelogin', '自动重连: ', 'auto_relogin')
                + UI.html_switch('shieldswitch', '聊天频道屏蔽开关: ', 'shieldswitch')
                + UI.html_switch('silence', '安静模式:', 'silence')
                + UI.html_switch('dpssakada', '战斗统计:', 'dpssakada')
                + UI.html_switch('funnycalc', 'funny计算:', 'funnycalc')
                + UI.html_lninput("shield", "屏蔽人物名(用半角逗号分隔)：")
                + UI.html_lninput("shieldkey", "屏蔽关键字(用半角逗号分隔)：")
                + UI.html_switch('sm_loser', '师门自动放弃：', "sm_loser")
                + UI.html_switch('sm_price', '师门自动牌子：', 'sm_price')
                + UI.html_switch('sm_getstore', '师门自动仓库取：', "sm_getstore") + `
                <div class="setting-item" >
                <span> <label for="zmlshowsetting"> 自命令显示位置： </label><select id="zmlshowsetting" style="width:80px">
                    <option value="0"> 物品栏 </option>
                    <option value="1"> 技能栏下方 </option>
                </select>
                </span></div> `
                + UI.html_lninput("wudao_pfm", "武道自动攻击(用半角逗号分隔)：")
                + UI.html_switch('getitemShow', '显示获得物品：', 'getitemShow')
                + UI.html_switch('marry_kiss', '自动喜宴：', "automarry")
                + UI.html_switch('ks_Boss', '自动传到boss：', "autoKsBoss") + `
                <div class="setting-item" >
                <span><label for="auto_eq">BOSS击杀时自动换装： </label><select id="auto_eq" style="width:80px">
                        <option value="0">关</option>
                        <option value="1">套装1</option>
                        <option value="2">套装2</option>
                        <option value="3">套装3</option>
                    </select>
                </span> </div> `
                + UI.html_lninput("ks_pfm", "BOSS叫杀延时(ms)： ")
                + UI.html_lninput("ks_wait", "BOSS击杀等待延迟(s)： ")
                + UI.html_switch('autopfmswitch', '自动施法开关：', 'auto_pfmswitch')
                + UI.html_switch('autorewardgoto', '开启转发路径：', 'auto_rewardgoto')
                + UI.html_input("unauto_pfm", "自动施法黑名单(填技能代码，使用半角逗号分隔)：")

                + UI.html_switch('autoupdateStore', '自动更新仓库数据：', 'auto_updateStore')
                + UI.html_input("store_info", "自动存储的物品名称（自动获得的物品信息,随仓库内容更新）：")
                + UI.html_input("store_info2", "手动添加的自动存仓物品信息（不会随仓库内容更新，使用半角逗号分隔）：")
                + UI.html_input("lock_info", "已锁物品名称(锁定物品不会自动丢弃,使用半角逗号分隔)：")
                + UI.html_input("store_drop_info", "输入自动丢弃的物品名称(使用半角逗号分隔)：")
                + UI.html_input("store_fenjie_info", "输入自动分解的物品名称(使用半角逗号分隔)：")
                + UI.html_input("auto_command", "输入喜宴及boss后命令(留空为自动挖矿或修炼)：")
                + UI.html_input("blacklist", "输入黑名单boss名称(黑名单boss不会去打,中文,用半角逗号分隔)：")
                + UI.html_input("statehml", "当你各种状态中断后，自动以下操作(部分地点不执行)：")
                + UI.html_input("backimageurl", "背景图片url(建议使用1920*1080分辨率图片)：")
                + UI.html_input("loginhml", "登录后执行命令：")
                + UI.html_input("autobuy", "自动当铺购买清单：(用半角逗号分隔)")

                + UI.html_switch('zdyskillsswitch', '自定义技能顺序开关：', 'zdyskills')

                + UI.html_input("zdyskilllist", "自定义技能顺序json数组：")
                +` <div class="setting-item" ><div class="item-commands"><span class="clear_skillJson">清空技能json数组</span></div></div>`
                +`

                <div class="setting-item" >
                <div class="item-commands"><span class="update_id_all">初始化ID</span></div>
                        </div>
                <div class="setting-item" >
                <div class="item-commands"><span class="update_store">更新存仓数据(覆盖)</span><span class="clean_dps">重置伤害统计</span></div>
                    </div>
                <div class="setting-item" >
                <div class="item-commands"><span class="backup_btn">备份到云</span><span class="load_btn">加载云配置</span></div>
            </div>

            <h3>自定义按钮</h3>`
                + UI.zdyBtnsetui() +
                ` <h3>系统</h3>
            `
        },
        zmlsetting: `<div class='zdy_dialog' style='text-align:right;width:280px' id="zmldialog">
    <div class="setting-item"><span><label for="zml_name"> 输入自定义命令名称:</label></span><span><input id="zml_name"
                style='width:80px' type="text" name="zml_name" value="" v-model="singnalzml.name"></span></div>
    <div class="setting-item"> <label for="zml_type"> 自命令类型： </label><select id="zml_type" style="width:80px"
            v-model="singnalzml.zmlType">
            <option value="0"> 插件原生 </option>
            <option value="1"> Raidjs流程 </option>
            <option value="2"> JS原生 </option>
        </select> </div>
    <div class="setting-item"> <label for="zml_info"> 输入自定义命令(用半角分号(;)分隔):</label></div>
    <div class="setting-item"><textarea class="settingbox hide zdy-box" style="display: inline-block;" id='zml_info'
            v-model="singnalzml.zmlRun"></textarea></div>
    <div class="item-commands"><span class="getSharezml" @click="getShare"> 查询分享 </span> <span class="editadd"
            @click="add"> 保存 </span> <span class="editdel" @click="del"> 删除 </span> </div>
    <div class="item-commands" id="zml_show">
        <span v-for="(item, index) in zmldata" @click="edit(item)">
            编辑{{item.name}}
        </span>
        <br />
        <span v-for="(item, index) in zmldata" @click="showp(item)">
             <label v-if="item.zmlShow == '1'">取消快速使用</label><label v-else>快速使用</label>{{item.name}}
        </span>
        <br />
        <span v-for="(item, index) in zmldata" @click="share(item)">
            分享{{item.name}}
        </span>
        <br />
    </div>
</div> `,




        zmlandztjkui: `<div class='zdy_dialog' style='text-align:right;width:280px' id="zmlandztjk">
     <div class="item-commands"> <span class="editzml" @click="zml"> 编辑自命令 </span> </div>
     <div class="item-commands"> <span class="editztjk" @click="ztjk"> 编辑自定义监控 </span>
         <div class="item-commands"> <span class="startzdjk" @click="startjk"> 注入所有监控 </span> <span class="stopzdjk"
                 @click="stopjk"> 暂停所有监控
             </span>
         </div>
     </div>
     <div class="item-commands" id="zml_show">
                 <span v-for="(item, index) in zmldata" @click="run(item)">
                     {{item.name}}
                 </span>
     </div>
 </div>`,        ztjksetting: `<div class='zdy_dialog' style='text-align:right;width:280px'>
    <div class="setting-item"> <label> 请打开插件首页,查看文档及例子,本人血量状态监控 请按如下规则输入关键字 90|90 这样监控的是hp 90% mp 90% 以下触发</label></div>
    <div class="setting-item"> <label for="ztjk_name"> 名称:</label><input id="ztjk_name" style='width:80px' type="text"
            name="ztjk_name" value=""></div>
    <div class="setting-item"><label for="ztjk_type"> 类型(type):</label><select style='width:80px' id="ztjk_type">
            <option value="status"> 状态(status) </option>
            <option value="text"> 文本(text) </option>
            <option value="msg"> 聊天(msg) </option>
            <option value="die"> 死亡(die) </option>
            <option value="itemadd"> 人物刷新(itemadd) </option>
            <option value="room"> 地图名与房间人物(room) </option>
            <option value="dialog"> 背包监控(dialog) </option>
            <option value="combat"> 战斗状态(combat) </option>
            <option value="sc"> 血量状态(sc) </option>
            <option value="enapfm"> 技能监控(enapfm) </option>
            <option value="dispfm"> 技能监控(dispfm) </option>
        </select></div>
    <div class="setting-item"><span id='actionp' style='display:block'><label for="ztjk_action">
                动作(action):</label><input id="ztjk_action" style='width:80px' type="text" name="ztjk_action"
                value=""></span></div>
    <div class="setting-item"><span><label for="ztjk_keyword"> 关键字(使用半角 | 分割):</label><input id="ztjk_keyword"
                style='width:80px' type="text" name="ztjk_keyword" value=""></span></div>
    <div class="setting-item"><span><label for="ztjk_ishave"> 触发对象: </label><select style='width:80px' id="ztjk_ishave">
                <option value="0"> 其他人 </option>
                <option value="1"> 本人 </option>
                <option value="2"> 仅NPC </option>
            </select></span></div>
    <div class="setting-item"> <span id='senduserp' style='display:block'><label for="ztjk_senduser"> MSG/其他人名称(使用半角 |
                分割):</label><input id="ztjk_senduser" style="width:80px;" type="text" name="ztjk_senduser"
                value=""></span></div>
    <div class="setting-item"> <span style='display:block'><label> Buff层数:</label><input id="ztjk_maxcount"
                style="width:80px;" type="text" name="ztjk_maxcount" value=""></span></div>
    <div class="setting-item"> <span style='display:block'><label> 状态监控提示:</label><select style='width:80px'
                id="ztjk_istip">
                <option value="1"> 提示 </option>
                <option value="0"> 不提示 </option>
            </select></span></div>
    <div class="setting-item"><span><label for="ztjk_send"> 输入自定义命令(用半角分号(;)分隔):</label></span></div>
    <div class="setting-item"> <textarea class="settingbox hide zdy-box" style="display: inline-block;"
            id='ztjk_send'></textarea></div>
    <div class="item-commands"><span class="ztjk_sharedfind"> 查询分享 </span> <span class="ztjk_editadd"> 保存 </span> <span
            class="ztjk_editdel"> 删除 </span></div>
    <div class="item-commands" id="ztjk_show"></div>
    <div class="item-commands" id="ztjk_set"></div>
</div> `,
        jsquivue: `
                    <div class="JsqVueUI">
                    <div class="item-commands">
                <span @click='qnjs_btn'>潜能计算</span>
                <span @click='lxjs_btn'>练习时间及潜能计算</span>
                <span @click='khjs_btn'>开花计算</span>
                <span  @click='getskilljson'>提取技能属性(可用于苏轻模拟器)</span>
            </div>
            <div class="item-commands">
                <span  @click='onekeydaily'>一键日常</span>
                <span  @click='onekeypk'>自动比试</span>
                <span  @click='onekeysansan'>导入白三三懒人包（依赖raid.js）</span>
            </div>
            <div class="item-commands">
                <span  @click="onekeystore">存仓及贩卖</span>
                <span  @click='onekeysell'>丢弃及贩卖</span>
                <span  @click='onekeyfenjie'>分解及贩卖</span>
            </div>
            <div class="item-commands">
                <span @click='updatestore'>更新仓库数据(覆盖)</span>
                <span @click='sortstore'>排序仓库</span>
                <span @click='sortbag'>排序背包</span>
                <span @click='dsrw'>定时任务</span>
                <span @click='cleandps'>清空伤害</span>
            </div></div>`,
        lxjsui: `
                       <div style="width:50%;float:left" class='StudyTimeCalc'>
     <div class="setting-item"> <span>练习时间计算器</span></div>
     <div class="setting-item">先天悟性:<input type="number"  placeholder="先天悟性" style="width:50%"
             class="mui-input-speech" v-model=jsqsx.xtwx></div>
     <div class="setting-item">后天悟性:<input type="number"  placeholder="后天悟性" style="width:50%"
             class="mui-input-speech" v-model=jsqsx.htwx></div>
     <div class="setting-item">练习效率:<input type="number"  placeholder="练习效率" style="width:50%"
             class="mui-input-speech" v-model=jsqsx.lxxl></div>
     <div class="setting-item">初始等级:<input type="number" placeholder="初始等级" style="width:50%"
             class="mui-input-speech" v-model=jsqsx.clevel></div>
     <div class="setting-item"> 目标等级:<input type="number" placeholder="目标等级" style="width:50%"
             v-model=jsqsx.mlevel></div>
     <div class="setting-item">技能颜色: <select style="width:50%" v-model=jsqsx.color>
             <option value='0'>选择技能颜色</option>
             <option value='1' style="color: #c0c0c0;">白色</option>
             <option value='2' style="color:#00ff00;">绿色</option>
             <option value='3' style="color:#00ffff;">蓝色</option>
             <option value='4' style="color:#ffff00;">黄色</option>
             <option value='5' style="color:#912cee;">紫色</option>
             <option value='6' style="color: #ffa600;">橙色</option>
             <option value='7' style="color: #CC0000;">红色</option>
         </select></div>
                <div class="setting-item">
        <div class="item-commands"><span @click="lxjscalc">计算</span></div>
             </div>
    </div>`,
        qnjsui: ` <div style="width:50%;float:left" class="QianNengCalc">
    <div class="setting-item"> <span>潜能计算器</span></div>
    <div class="setting-item">初始等级:<input type="number" placeholder="初始等级" style="width:50%"
            class="mui-input-speech" v-model='qnsx.c'>
    </div>
    <div class="setting-item"> 目标等级:<input type="number" v-model='qnsx.m' placeholder="目标等级" style="width:50%">
    </div>
    <div class="setting-item"> 技能颜色:<select id="se" style="width:50%" v-model='qnsx.color'>
            <option value='0'>选择技能颜色</option>
            <option value='1' style="color: #c0c0c0;">白色</option>
            <option value='2' style="color:#00ff00;">绿色</option>
            <option value='3' style="color:#00ffff;">蓝色</option>
            <option value='4' style="color:#ffff00;">黄色</option>
            <option value='5' style="color:#912cee;">紫色</option>
            <option value='6' style="color: #ffa600;">橙色</option>
        </select>
        </div>
        <div class="setting-item">
        <div class="item-commands"><span @click="qnjscalc">计算</span></div>
             </div>

</div>`,
        khjsui: `<div style="width:50%;float:left" class="KaihuaCalc">
    <div class="setting-item"><span>开花计算器</span></div>
    <div class="setting-item"> 当前内力:<input type="number" placeholder="当前内力" style="width:50%"
            class="mui-input-speech" v-model="khsx.nl"></div>
    <div class="setting-item"> 先天根骨:<input type="number" placeholder="先天根骨" style="width:50%"
        v-model="khsx.xg"></div>
    <div class="setting-item"> 后天根骨:<input type="number" placeholder="后天根骨" style="width:50%"
        v-model="khsx.hg"></div>
    <div class="setting-item">      <div class="item-commands"><span @click="khjscalc" >计算</span></div></div>
    <div class="setting-item"> <label>人花分值：5000 地花分值：6500 天花分值：8000</label></div>
</div>`,
        lyui: `<div class='zdy_dialog' id="LianYao" style='text-align:right;width:280px'> 有空的话请点个star,您的支持是我最大的动力 <a target="_blank"
        href="https://github.com/knva/wsmud_plugins">https://github.com/knva/wsmud_plugins</a> 药方链接:<a target="_blank"
        href="https://emeisuqing.github.io/wsmud.old/yaofang/">https://emeisuqing.github.io/wsmud.old/yaofang/</a>
    <div class="setting-item"> <span> <label for="medicine_level"> 级别选择： </label><select style='width:80px'
                id="medicine_level" v-model="level">
                <option value="1">绿色</option>
                <option value="2">蓝色</option>
                <option value="3">黄色</option>
                <option value="4">紫色</option>
                <option value="5">橙色</option>
            </select></span></div>
    <div class="setting-item"> 数量:<span><input id="mednum" v-model="num" style="width:80px;" type="number" name="mednum" value="1">
        </span></div>
    <div class="setting-item"> <span><label for="medicint_info"> 输入使用的顺序(使用半角逗号分隔,多配方使用 | 分割):</label></span></div>
    <div class="setting-item"><textarea v-model="info"  class="settingbox hide zdy-box" style="display: inline-block;"
            id='medicint_info'>石楠叶,金银花,金银花,金银花,当归</textarea></div>
    <div class="item-commands"> <span class="startDev" @click="startDev"> 开始 </span><span class="stopDev" @click="stopDev"> 停止 </span> </div>
</div>`,
        timeoutui: `<div class='zdy_dialog' style='text-align:right;width:280px'> 注意,可以留空的时或者分,这样就是每分钟/小时 的x秒触发任务,秒为必填项目 <div class="setting-item">    <span>任务名:<input type="text" id="questname" placeholder="任务名" style="width:50%"></span></div> <div class="setting-item">     <label for = "rtype"> 运行次数 </label><select style='width:80px' id="rtype"></div> <option value="1">一次</option> <option value="2">每天</option> </select></span></div> <div class="setting-item">  <span>时:<input type="number" id="ht" placeholder="时" style="width:50%"></span></div> <div class="setting-item">   <span>分:<input type="number" id="mt" placeholder="分" style="width:50%"></span></div> <div class="setting-item">  <span>秒:<input type="number" id="st" placeholder="秒" style="width:50%"></span></div> <div class="setting-item">  <span><label for="zml_info"> 输入自定义命令(用半角分号(;)分隔):</label></span></div> <div class="setting-item">   <textarea class = "settingbox hide zdy-box"style = "display: inline-block;"id = 'zml_info'></textarea></div> <div class = "item-commands"> <span class = "startQuest"> 开始 </span><span class = "removeQuest"> 删除 </span>  </div> <div class='questlist item-commands'></div> </div>`,
        toui: [
            `<div class='item-commands'><span cmd = "$to 扬州城-衙门正厅" > 衙门 </span>
            <span cmd = "$to 扬州城-当铺" > 当铺 </span>
            <span cmd = "$to 扬州城-醉仙楼" > 醉仙楼 </span>
            <span cmd = "$to 扬州城-杂货铺" > 杂货铺 </span>
            <span cmd = "$to 扬州城-打铁铺" > 打铁铺 </span>
            <span cmd = "$to 扬州城-钱庄" > 钱庄 </span>
            <span cmd = "$to 扬州城-药铺" > 药铺 </span>
            <span cmd = "$to 扬州城-扬州武馆" > 武馆 </span>
            <span cmd = "$to 扬州城-镖局正厅" > 镖局 </span>
            <span cmd = "$to 住房" > 住房 </span>
            <span cmd = "$to 扬州城-武庙" > 武庙 </span>
            <span cmd = "$to 帮会-大院" > 帮派 </span>
            <span cmd = "$to 扬州城-赌场" > 赌场 </span>
            <span cmd = "$to 扬州城-有间客栈" > 客栈 </span>
            <span cmd = "$to 扬州城-矿山" > 矿山 </span></div>`,
            `<div class='item-commands'><span cmd = "$to 武当派-后山小院" >掌门</span>
             <span cmd = "$to 武当派-石阶" >后勤</span>
             <span cmd = "$to 武当派-三清殿" >三清殿</span></div>`,
            `<div class='item-commands'><span cmd = "$to 少林派-方丈楼" >掌门</span>
             <span cmd = "$to 少林派-山门殿" >后勤</span>
             <span cmd = "$to 少林派-天王殿" >天王殿</span></div>`,
            `<div class='item-commands'><span cmd = "$to 华山派-客厅" >掌门</span>
             <span cmd = "$to 华山派-练武场" >后勤</span>
             <span cmd = "$to 华山派-落雁峰" >落雁峰</span></div>`,
            `<div class='item-commands'><span cmd = "$to 峨眉派-清修洞" >掌门</span>
            <span cmd = "$to 峨眉派-走廊" >后勤</span>
            <span cmd = "$to 峨眉派-小屋" >周芷若</span>
            <span cmd = "$to 峨眉派-大殿" >静心</span></div>`,
            `<div class='item-commands'><span cmd = "$to 逍遥派-地下石室" >掌门</span>
             <span cmd = "$to 逍遥派-林间小道" >后勤</span>
             <span cmd = "$to 逍遥派-木屋" >薛慕华</span></div>`,
            `<div class='item-commands'><span cmd = "$to 丐帮-林间小屋" >掌门</span>
             <span cmd = "$to 丐帮-暗道;go east;" >后勤</span>
             <span cmd = "$to 丐帮-土地庙" >土地庙</span></div>`,
            `<div class='item-commands'><span cmd = "$to 杀手楼-书房" >掌门</span>
             <span cmd = "$to 杀手楼-休息室;" >后勤</span></div>`,
            `<div class='item-commands'><span cmd = "@call 自动襄阳" >自动襄阳</span></div>`,
            `<div class='item-commands'><span cmd = "@call 自动武道塔" >自动武道塔</span></div>`
        ],
        fbui: function (name, mulit, diffi) {
            let ui = `<div class='item-commands'>`;
            if (unsafeWindow && unsafeWindow.ToRaid) {
                if (ToRaid.existAutoDungeon(`${name} 0`)) {
                    ui = ui + `<span cmd = "@fb ${name} 0" >自动副本-${name}</span>`;
                }
                if (diffi) {
                    if (ToRaid.existAutoDungeon(`${name} 1`)) {
                        ui += `<span cmd = "@fb ${name} 1" >自动副本-${name}-困难</span>`;
                    }
                }
                if (mulit) {
                    if (ToRaid.existAutoDungeon(`${name} 2`)) {
                        ui += `<span cmd = "@fb ${name} 2" >自动副本-${name}-组队</span>`;
                    }
                }
            } else {
                ui += `未安装Raid.js插件`;
            }
            if (ui == `<div class='item-commands'>`) {
                return `<div>暂无自动副本脚本,欢迎共享。</div>`
            } else {
                return ui + `</div>`;
            }

        },
        itemui: function (itemname) {
            itemname = itemname.toLowerCase();
            let ui = `<div class="item-commands ">
            <span class = "addstore" cmd='$addstore ${itemname}'> 添加到存仓 </span>`;
            if (lock_list.indexOf(itemname) >= 0) {
                ui = ui + `<span class = "dellock" cmd='$dellock ${itemname}'> 移除物品锁 </span>`;
            } else {
                ui = ui + `<span class = "addlock" cmd='$addlock ${itemname}'> 添加物品锁 </span>`;
            }
            if (itemname.indexOf("★") >= 0 || itemname.indexOf("☆") >= 0 || itemname.indexOf("hio") >= 0 || itemname.indexOf("hir") >= 0 || itemname.indexOf("ord") >= 0) {
                ui = ui + `</div>`;

            } else {
                ui = ui + `<span class = "addfenjieid"  cmd='$addfenjieid ${itemname}'> 添加到分解 </span>`;
                if (lock_list.indexOf(itemname) == -1) {
                    ui = ui + `<span class = "adddrop" cmd='$adddrop ${itemname}'> 添加到丢弃 </span>`;
                }
                ui = ui + `</div>`;
            }
            return ui;
        },

    }

    //全局变量
    var G = {
        id: undefined,
        state: undefined,
        room_name: undefined,
        family: undefined,
        items: new Map(),
        stat_boss_success: 0,
        stat_boss_find: 0,
        stat_xiyan_success: 0,
        stat_xiyan_find: 0,
        cds: new Map(),
        in_fight: false,
        auto_preform: false,
        can_auto: false,
        level: undefined,
        getitemShow: undefined,
        wk_listener: undefined,
        status: new Map(),
        score: undefined,
        jy: 0,
        qn: 0
    };

    //GlobalInit
    var GI = {
        init: function () {
            WG.add_hook("items", function (data) {
                WG.saveRoomstate(data);
            });
            WG.add_hook("dialog", function (data) {
                if (data.dialog == "pack" && data.items != undefined) {
                    packData = data.items;
                    eqData = data.eqs;
                }
                if (data.dialog =="skills"){
                    if (data.enable != null &&zdyskills == "开"){
                        zdyskilllist == "";
                        messageAppend("检测到更换技能,请刷新重新获取技能数据!");
                        zdyskills = "关";
                        GM_setValue(role +"_zdyskilllist","");
                        GM_setValue(role + "_zdyskills", zdyskills);
                    }
                }

                 auto_updateStore = GM_getValue(role + "_auto_updateStore", auto_updateStore);
                if(data.dialog == "list" && G.room_name.indexOf("钱庄")&&WG.sort_hook==null && auto_updateStore=="开"){
                    if(data.id!=null&&data.store!=null){
                        WG.SendCmd("store")
                    }

                    var stores = data.stores;
                    if(stores!=null){
                        store_list = [];
                        for (let store of stores) {
                            store_list.push(store.name.toLowerCase());
                        }
                        zdy_item_store = store_list.join(',');
                        $('#store_info').val(zdy_item_store);
                        GM_setValue(role + "_zdy_item_store", zdy_item_store);

                        store_list = store_list.concat(zdy_item_store2.split(","));
                    }

                }
            });
            WG.add_hook(["status", "login", "exits", "room", "items", "itemadd", "itemremove", "sc", "text", "state", "msg", "perform", "dispfm", "combat"], function (data) {
                if (data.type == "login") {
                    G.id = data.id;
                } else if (data.type == "exits") {
                    G.exits = new Map();
                    if (data.items["north"]) {
                        G.exits.set("north", {
                            exits: data.items["north"]
                        });
                    }
                    if (data.items["south"]) {
                        G.exits.set("south", {
                            exits: data.items["south"]
                        });
                    }
                    if (data.items["east"]) {
                        G.exits.set("east", {
                            exits: data.items["east"]
                        });
                    }
                    if (data.items["west"]) {
                        G.exits.set("west", {
                            exits: data.items["west"]
                        });
                    }
                    if (data.items["northup"]) {
                        G.exits.set("northup", {
                            exits: data.items["northup"]
                        });
                    }
                    if (data.items["southup"]) {
                        G.exits.set("southup", {
                            exits: data.items["southup"]
                        });
                    }
                    if (data.items["eastup"]) {
                        G.exits.set("eastup", {
                            exits: data.items["eastup"]
                        });
                    }
                    if (data.items["westup"]) {
                        G.exits.set("westup", {
                            exits: data.items["westup"]
                        });
                    }
                    if (data.items["northdown"]) {
                        G.exits.set("northdown", {
                            exits: data.items["northdown"]
                        });
                    }
                    if (data.items["southdown"]) {
                        G.exits.set("southdown", {
                            exits: data.items["southdown"]
                        });
                    }
                    if (data.items["eastdown"]) {
                        G.exits.set("eastdown", {
                            exits: data.items["eastdown"]
                        });
                    }
                    if (data.items["westdown"]) {
                        G.exits.set("westdown", {
                            exits: data.items["westdown"]
                        });
                    }
                    if (data.items["up"]) {
                        G.exits.set("up", {
                            exits: data.items["up"]
                        });
                    }
                    if (data.items["down"]) {
                        G.exits.set("down", {
                            exits: data.items["down"]
                        });
                    }
                    if (data.items["enter"]) {
                        G.exits.set("enter", {
                            exits: data.items["enter"]
                        });
                    }
                    if (data.items["out"]) {
                        G.exits.set("out", {
                            exits: data.items["out"]
                        });
                    }

                } else if (data.type == "room") {
                    let tmp = data.path.split("/");
                    G.map = tmp[0];
                    G.room = tmp[1];
                    if (G.map == 'home' || G.room == 'kuang')
                        G.can_auto = true;
                    else
                        G.can_auto = false;

                    G.room_name = data.name;
                    //强制结束pfm
                    if (G.in_fight) {
                        G.in_fight = false;
                        WG.auto_preform("stop");
                    }


                } else if (data.type == "items") {
                    G.items = new Map();
                    for (var i = 0; i < data.items.length; i++) {
                        let item = data.items[i];
                        if (item.id) {
                            let n = $.trim($('<body>' + item.name + '</body>').text());
                            let i = n.lastIndexOf(' ');
                            let j = n.lastIndexOf('<');
                            let t = "";
                            let s = "";
                            if (j >= 0) {
                                s = n.substr(j + 1, 2);
                            }
                            if (i >= 0) {
                                t = n.substr(0, i);
                                n = n.substr(i + 1).replace(/<.*>/g, '');
                            }

                            G.items.set(item.id, {
                                name: n,
                                title: t,
                                state: s,
                                max_hp: item.max_hp,
                                max_mp: item.max_mp,
                                hp: item.hp,
                                mp: item.mp,
                                p: item.p,
                                damage: 0
                            });
                        }

                    }
                } else if (data.type == "itemadd") {
                    if (data.id) {
                        let n = $.trim($('<body>' + data.name + '</body>').text());
                        let i = n.lastIndexOf(' ');
                        let j = n.lastIndexOf('<');
                        let t = "";
                        let s = "";
                        if (i >= 0) {
                            t = n.substr(0, i);
                            if (j >= 0) {
                                s = n.substr(j + 1, 2);
                            }
                            n = n.substr(i + 1).replace(/<.*>/g, '');
                        }
                        G.items.set(data.id, {
                            name: n,
                            title: t,
                            state: s,
                            max_hp: data.max_hp,
                            max_mp: data.max_mp,
                            hp: data.hp,
                            mp: data.mp,
                            p: data.p,
                            damage: 0
                        });
                    }
                } else if (data.type == "itemremove") {
                    G.items.delete(data.id);
                } else if (data.type == "sc") {
                    let item = G.items.get(data.id);
                    if (data.hp !== undefined) {
                        item.hp = data.hp;
                        if (data.id != G.id) {
                            G.scid = data.id; //伤害统计需要
                        }
                        // WG.showallhp();
                    }
                    if (data.mp !== undefined) {
                        item.mp = data.mp;
                    }
                } else if (data.type == "perform") {
                    G.skills = data.skills;
                    if (zdyskilllist == ""){
                        zdyskilllist = JSON.stringify(data.skills);
                        GM_setValue(role + "_zdyskilllist", zdyskilllist);
                    }
                } else if (data.type == 'dispfm') {
                    if (data.id) {
                        if (data.distime) { }
                        G.cds.set(data.id, true);
                        var _id = data.id;
                        setTimeout(function () {
                            G.cds.set(_id, false);
                            //技能cd时间到
                            let pfmtimeTips = {
                                data: JSON.stringify({
                                    type: "enapfm",
                                    id: _id
                                })
                            };
                            WG.receive_message(pfmtimeTips);
                        }, data.distime);
                    }
                    if (data.rtime) {
                        G.gcd = true;
                        setTimeout(function () {
                            G.gcd = false;
                        }, data.rtime);
                    } else {
                        G.gcd = false;
                    }
                } else if (data.type == "combat") {
                    if (data.start) {
                        G.in_fight = true;
                        WG.auto_preform();
                    }
                    if (data.end) {
                        G.in_fight = false;
                        WG.auto_preform("stop");
                    }
                } else if (data.type == "status") {
                    if (data.count != undefined) {
                        G.status.set(data.id, {
                            "sid": data.sid,
                            "count": data.count
                        });
                    }
                }
            });
            WG.add_hook("state", function (data) {
                console.dir(data);
                if (data.type == 'state' && data.state == undefined) {
                    if (G.room_name.indexOf('副本') >= 0 || G.room_name.indexOf('襄阳') >= 0 ||
                        G.room_name.indexOf('矿山') >= 0 || G.room_name.indexOf('练功房') >= 0) {
                        return;
                    }
                    statehml = GM_getValue(role + '_statehml', statehml);
                    WG.SendCmd(statehml);
                }
            });
            WG.add_hook("dialog", function (data) {
                //console.dir(data);
                if (data.dialog == "pack" && data.items != undefined && data.items.length >= 0) {
                    //equip =
                    for (var i = 0; i < data.items.length; i++) {
                        if (data.items[i].name.indexOf("铁镐") >= 0) {
                            equip["铁镐"] = data.items[i].id;
                            //messageAppend("铁镐ID:" + data.items[i].id);
                        }
                    }
                    for (var j = 0; j < data.eqs.length; j++) {
                        if (data.eqs[j] != null && data.eqs[j].name.indexOf("铁镐") >= 0) {
                            equip["铁镐"] = data.eqs[j].id;
                            //messageAppend("铁镐ID:" + data.eqs[j].id);
                        }
                    }

                } else if (data.dialog == 'pack' && data.desc != undefined) {
                    messageClear();
                    var itemname = data.desc.split("\n")[0];
                    var htmla = `<div class="item-commands ">
                <span class = "copyid" data-clipboard-target = ".target1" > ` + itemname + ":" + data.id +
                        `复制到剪贴板 </span></div>
                         `;
                    messageAppend(htmla);
                    $(".copyid").off("click");
                    $(".copyid").on('click', () => {
                        var copydata = data.id;
                        GM_setClipboard(copydata);
                        messageAppend("复制成功");
                    });


                } else if (data.dialog == 'pack' && data.name != null) {
                    let item = {
                        id: data.id,
                        name: data.name,
                        count: data.count
                    }
                    packData.push(item)
                }
                if (data.dialog == 'score') {
                    if (!G.level && (data.level != null)) {
                        G.level = data.level;
                        console.log("欢迎" + G.level);
                    }
                    if (!G.family && (data.family != null)) {
                        G.pfamily = data.family;
                        G.family = data.family.replaceAll('派', '');
                        console.log(G.family);
                        if (G.family == "无门无") {
                            G.family = "武馆";
                        }
                        family = G.family;
                        G.score = data;
                        GM_setValue(role + "_family", G.family);
                    } else if (data.study_per != null) {
                        G.score2 = data;
                    }
                }
            });
            //师门id自动刷新
            WG.add_hook(["dialog", "items"], (data) => {
                if (data.type == 'dialog') {
                    if (data.selllist) {
                        for (let item of data.selllist) {
                            let realname = item.name.replace(/<[^>]+>/g, ""); //去尖括号
                            if (goods[realname] != undefined) {
                                goods[realname].id = item.id;
                            }
                        }
                        GM_setValue("goods", goods);
                    }
                } else if (data.type == 'items') {
                    if (WG.at("扬州城-醉仙楼")) {
                        for (let item of data.items) {
                            if (item.name == '店小二') {
                                npcs['店小二'] = item.id;
                                GM_setValue("npcs", npcs);
                                return;
                            }
                        }
                    } else {
                        for (let item of data.items) {
                            if (item.name == '店小二') return;
                            if (npcs[item.name] != undefined) {
                                npcs[item.name] = item.id;

                                GM_setValue("npcs", npcs);
                                return;
                            }
                        }
                    }
                }
            });
            WG.add_hook("msg", function (data) {

                if (data.ch == "sys") {
                    var automarry = GM_getValue(role + "_automarry", automarry);
                    if (data.content.indexOf("，婚礼将在一分钟后开始。") >= 0) {
                        console.dir(data);
                        if (automarry == "开" && G.in_fight == false) {
                            if (stopauto || WG.at('副本')) {
                                let b = "<div class=\"item-commands\"><span  id = 'onekeyjh'>参加喜宴</span></div>"
                                messageClear();
                                messageAppend("<hiy>点击参加喜宴</hiy>");
                                messageAppend(b);
                                $('#onekeyjh').on('click', function () {
                                    WG.xiyan();
                                });
                            } else {
                                console.log("xiyan");
                                WG.xiyan();
                            }
                        } else if (automarry == "关" || G.in_fight == true) {
                            let b = "<div class=\"item-commands\"><span  id = 'onekeyjh'>参加喜宴</span></div>"
                            messageClear();
                            messageAppend("<hiy>点击参加喜宴,由于未开启自动传送,或者在战斗中,需要手动传送</hiy>");
                            messageAppend(b);
                            $('#onekeyjh').on('click', function () {
                                WG.xiyan();
                            });
                        }
                    }
                } else if (data.ch == "rumor") {
                    if (data.content.indexOf("听说") >= 0 &&
                        data.content.indexOf("出现在") >= 0 &&
                        data.content.indexOf("一带。") >= 0) {
                        console.dir(data);
                        if (autoKsBoss == "开" && G.in_fight == false) {
                            if (stopauto || WG.at('副本')) {
                                var c = "<div class=\"item-commands\"><span id = 'onekeyKsboss'>传送到boss</span></div>";
                                messageClear();
                                messageAppend("boss已出现");
                                messageAppend(c);
                                $('#onekeyKsboss').on('click', function () {
                                    WG.kksBoss(data);
                                });
                            } else {
                                WG.kksBoss(data);
                            }
                        } else if (autoKsBoss == "关" || G.in_fight == true) {
                            var c = "<div class=\"item-commands\"><span id = 'onekeyKsboss'>传送到boss</span></div>";
                            messageClear();
                            messageAppend("<hiy>boss已出现,由于未开启自动传送,或者在战斗中,需要手动传送</hiy>");
                            messageAppend(c);
                            $('#onekeyKsboss').on('click', function () {
                                WG.kksBoss(data);
                            });
                        }
                    }
                }

            });
            WG.add_hook('text', function (data) {
                if (G.getitemShow) {
                    if (data.msg.indexOf("恭喜你得到") >= 0 ||
                        (data.msg.indexOf("获得") >= 0 &&
                            data.msg.indexOf("经验") == -1) ||
                        data.msg.indexOf("你找到") == 0 ||
                        data.msg.indexOf("你从") == 0 ||
                        data.msg.indexOf("得到") >= 0) {
                        messageAppend(data.msg);
                    }
                }
                if (data.msg.indexOf("还没准备好") >= 0) {
                    WG.auto_preform('stop');
                    setTimeout(() => {
                        WG.auto_preform();
                    }, 200);
                }
                if (data.msg.indexOf("只能在战斗中使用。") >= 0) {
                    if (G.in_fight) {
                        G.in_fight = false;
                        WG.auto_preform("stop");
                    }
                }
                if (data.msg.indexOf("加油，加油！！") >= 0) {
                    if (G.in_fight == false) {
                        G.in_fight = true;
                        WG.auto_preform();
                    }
                }
                if (data.type == 'text') {
                    if (data.msg.indexOf("长得") >= 0 && data.msg.indexOf("看起来") >= 0) {
                        let s = data.msg.split("\n")[0].split(" ");
                        let name = s[s.length - 1];
                        if (name.indexOf("<") >= 0) {
                            name = name.split("<")[0];
                        }
                        let t = new Date().getMilliseconds();
                        let shieldhtml = `<div class="item-commands"><span id="addshield${t}">屏蔽 ${name}</span></div>`
                        messageAppend(shieldhtml, 0, 0);
                        $(`#addshield${t}`).on('click', function () {
                            shield = GM_getValue('_shield', shield);
                            if (shield != "") {
                                shield = shield + "," + name;
                            } else {
                                shield = name;
                            }
                            GM_setValue('_shield', shield);
                            $('#shield').val(shield);
                            messageAppend("已屏蔽", 1, 1);
                        });
                    }
                    if (dpssakada == '开') {

                        if (/.*造成<.*>.*<\/.*>点.*/.test(data.msg)) {
                            let pdata = data.msg;
                            let a = pdata.split(/.*造成<wht>|.*造成<hir>|<\/wht>点|<\/hir>点/);
                            let b = a[2].split(/伤害|\(|</);
                            if (b[2] != '你') {
                                pfmdps = pfmdps + parseInt(a[1]);
                                pfmnum = pfmnum + 1;
                                messageAppend(`你造成了${pfmdps}伤害,共计${pfmnum}次。`, 1, 1);
                            }
                        }
                    }
                }
            });
            WG.add_hook('dialog', function (data) {
                if (data.dialog == 'jh') {
                    if (data.fbs) {
                        fb_path = data.fbs;
                    }
                }
            });
            WG.add_hook(['text', 'sc'], function (message) {
                if (funnycalc == '关') return;
                if (message.type === "text" && /你的最大内力增加了/.test(message.msg)) {
                    //if中已经判断了内力相关
                    let x = message.msg.replace(/[^0-9]/ig, "");
                    let item = G.score;
                    let max = item.max_mp;
                    let limit = item.limit_mp;
                    let t = (limit - max) / (x * 6);//时间/分钟
                    let tStr = t < 60 ? `${parseInt(t)}分钟` : `${parseInt(t / 60)}小时${parseInt(t % 60)}分钟`;
                    let html = `<hic class="remove_nl">你的最大内力从${max}到${limit}还需${tStr}。\n</hic>`;
                    messageAppend(html, 0, 1);
                } else if (message.type == 'sc' && message.id == G.id) {
                    if (message.max_mp != null && message.mp != null) {
                        G.score.max_mp = message.max_mp;
                        G.score.mp = message.mp;
                    }
                } else if (message.type == 'text') {
                    if (/你获得了(.*)点经验，(.*)点潜能/.test(message.msg)) {
                        let x = message.msg.match(/获得了(.*)点经验，(.*)点潜能/);
                        G.jy += parseInt(x[1]);
                        G.qn += parseInt(x[2]);
                        let mss = `共计获得了${G.jy}点经验和${G.qn}点潜能。`;
                        messageAppend(mss, 0, 1);
                    }
                }
            });
        },
        configInit: function () {
            family = GM_getValue(role + "_family", family);
            automarry = GM_getValue(role + "_automarry", automarry);
            autoKsBoss = GM_getValue(role + "_autoKsBoss", autoKsBoss);
            ks_pfm = GM_getValue(role + "_ks_pfm", ks_pfm);
            ks_wait = GM_getValue(role + "_ks_wait", ks_wait);
            eqlist = GM_getValue(role + "_eqlist", eqlist);
            skilllist = GM_getValue(role + "_skilllist", skilllist);
            autoeq = GM_getValue(role + "_auto_eq", autoeq);
            if (family == null) {
                family = $('.role-list .select').text().substr(0, 2)
            }
            wudao_pfm = GM_getValue(role + "_wudao_pfm", wudao_pfm);
            sm_loser = GM_getValue(role + "_sm_loser", sm_loser);
            sm_price = GM_getValue(role + "_sm_price", sm_price);
            sm_getstore = GM_getValue(role + "_sm_getstore", sm_getstore);
            unauto_pfm = GM_getValue(role + "_unauto_pfm", unauto_pfm);
            auto_pfmswitch = GM_getValue(role + "_auto_pfmswitch", auto_pfmswitch);
            auto_rewardgoto = GM_getValue(role + "_auto_rewardgoto", auto_rewardgoto);
            auto_updateStore = GM_getValue(role + "_auto_updateStore", auto_updateStore);
            auto_relogin = GM_getValue(role + "_auto_relogin", auto_relogin);
            blacklist = GM_getValue(role + "_blacklist", blacklist);
            if (!blacklist instanceof Array) {
                blacklist = blacklist.split(",")
            }
            getitemShow = GM_getValue(role + "_getitemShow", getitemShow);
            if (getitemShow == "开") {
                G.getitemShow = true
            } else {
                G.getitemShow = false
            }
            zml = GM_getValue(role + "_zml", zml);
            zdy_item_store = GM_getValue(role + "_zdy_item_store", zdy_item_store);
            zdy_item_store2 = GM_getValue(role + "_zdy_item_store2", zdy_item_store2);
            zdy_item_lock = GM_getValue(role + "_zdy_item_lock", zdy_item_lock);
            zdy_item_drop = GM_getValue(role + "_zdy_item_drop", zdy_item_drop);
            zdy_item_fenjie = GM_getValue(role + "_zdy_item_fenjie", zdy_item_fenjie);
            if (zdy_item_store) {
                store_list = store_list.concat(zdy_item_store.split(","))
            }
            if (zdy_item_store2) {
                store_list = store_list.concat(zdy_item_store2.split(","))
            }
            if (zdy_item_lock) {
                lock_list = lock_list.concat(zdy_item_lock.split(","))
            }
            if (zdy_item_drop) {
                drop_list = drop_list.concat(zdy_item_drop.split(","))
            }
            if (zdy_item_fenjie) {
                fenjie_list = fenjie_list.concat(zdy_item_fenjie.split(","))
            }
            ztjk_item = GM_getValue(role + "_ztjk", ztjk_item);
            if (auto_pfmswitch == "开") {
                G.auto_preform = true
            }
            auto_command = GM_getValue(role + "_auto_command", auto_command);
            var unpfm = unauto_pfm.split(',');
            for (var pfmname of unpfm) {
                if (pfmname) blackpfm.push(pfmname)
            }
            welcome = GM_getValue(role + "_welcome", welcome);
            shieldswitch = GM_getValue("_shieldswitch", shieldswitch);
            shield = GM_getValue("_shield", shield);
            shieldkey = GM_getValue("_shieldkey", shieldkey);
            statehml = GM_getValue(role + "_statehml", statehml);
            backimageurl = GM_getValue(role + "_backimageurl", backimageurl);
            loginhml = GM_getValue(role + "_loginhml", loginhml);
            timequestion = GM_getValue(role + "_timequestion", timequestion);
            silence = GM_getValue(role + "_silence", silence);
            dpssakada = GM_getValue(role + "_dpssakada", dpssakada);
            funnycalc = GM_getValue(role + "_funnycalc", funnycalc);

            auto_buylist = GM_getValue(role + "_auto_buylist", auto_buylist);

            zdyskilllist = GM_getValue(role + "_zdyskilllist", zdyskilllist);
            zdyskills = GM_getValue(role + "_zdyskills", zdyskills);
            WG.zdy_btnListInit();

        }
    };

    var S = {
        serverUrl: "https://wsmud.ii74.com",
        GetJson: function (path, data) {
            let res = '';
            $.post(S.serverUrl + path, data, (data) => {
                res = data;
            });
            return res;
        },
        shareJson: function (usernaem, json) {
            $.post(S.serverUrl + "/sharejk", {
                username: usernaem,
                json: JSON.stringify(json)
            }, (res) => {
                if (res && res.code == 0) {
                    GM_setClipboard(res.shareid);
                    messageAppend("复制成功" + res.msg + ":" + res.shareid);
                } else {
                    messageAppend("失败了" + res.msg);
                }
            })
        },
        getShareJson: function (id, callback) {
            $.post(S.serverUrl + "/getjk", {
                shareid: id
            }, (res) => {
                if (res && res.code == 0) {
                    callback(res);
                } else {
                    messageAppend("失败了" + res.msg);
                }
            });
        },
        getUserConfig: function (id, callback) {
            $.get(S.serverUrl + "/User/Load?id=" + id, (res) => {
                if (res && res != "") {
                    callback(res);
                } else {
                    messageAppend("失败了");
                }
            });
        },
        uploadUserConfig: function (id, data, callback) {
            $.post(S.serverUrl + "/User/Backup", {
                id: id,
                data: JSON.stringify(data)
            }, (res) => {
                if (res && res == "true") {
                    callback(res);
                } else {
                    messageAppend("失败了,或配置已存在");
                }
            });
        }

    };
    var FakerTTS = {

        playurl: function (url) {
            var audio = new Audio(url);
            audio.play();
        },
        playtts: function (text) {
            let url = `https://fanyi.baidu.com/gettts?lan=zh&text=${text}&spd=5&source=web`;
            FakerTTS.playurl(url);
        }

    }
    class MusicBox {
        constructor(options) {
            let defaults = {
                loop: false,
                musicText: '',
                autoplay: false,
                type: 'sine',
                duration: 2
            };
            this.arrFrequency = [262, 294, 330, 349, 392, 440, 494, 523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319, 1397, 1568, 1760, 1967];
            this.arrNotes = ['·1', '·2', '·3', '·4', '·5', '·6', '·7', '1', '2', '3', '4', '5', '6', '7', '1·', '2·', '3·', '4·', '5·', '6·', '7·'];
            this.opts = Object.assign(defaults, options);
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.opts.autoplay && this.playMusic(this.opts.musicText, this.opts.autoplay)
        }
        createSound(freq) {
            let oscillator = this.audioCtx.createOscillator();
            let gainNode = this.audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);
            oscillator.type = this.opts.type;
            oscillator.frequency.value = freq;
            gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(1, this.audioCtx.currentTime + 0.01);
            oscillator.start(this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + this.opts.duration);
            oscillator.stop(this.audioCtx.currentTime + this.opts.duration)
        }
        createMusic(note) {
            let index = this.arrNotes.indexOf(note);
            if (index !== -1) {
                this.createSound(this.arrFrequency[index])
            }
        }
        pressBtn(i) {
            this.createSound(this.arrFrequency[i])
        }
        playMusic(musicText, speed = 2) {
            let i = 0,
                musicArr = musicText.split(' ');
            let timer = setInterval(() => {
                try {
                    let n = this.arrNotes.indexOf(musicArr[i]);
                    if (musicArr[i] !== '-' && musicArr[i] !== '0') {
                        this.pressBtn(n)
                    }
                    i++;
                    if (i >= musicArr.length) {
                        this.opts.loop ? i = 0 : clearInterval(timer)
                    }
                } catch (e) {
                    alert('请输入正确的乐谱！');
                    clearInterval(timer)
                }
            }, 1000 / speed);
            return timer
        }
    };

    $(document).ready(function () {
        $('head').append('<link href="https://cdn.staticfile.org/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.css" rel="stylesheet">');
        $('head').append('<link href="https://cdn.staticfile.org/layer/2.3/skin/layer.css" rel="stylesheet">');
        $('body').append(UI.codeInput);

        setTimeout(() => {
            var server = document.createElement('script');
            server.setAttribute('src', 'https://cdn.staticfile.org/layer/2.3/layer.js');
            document.head.appendChild(server);
            console.log("layer 加载完毕!");
            setInterval(() => {
                var h = '';
                if (parseInt(Math.random() * 10) < 3) {
                    h = "<hir>【插件】有任何问题欢迎加入 武神传说-仙界 367657589 进行技术交流，脚本讨论。\n<hir>"
                } else if (parseInt(Math.random() * 10) < 6) {
                    h = "<hir>【插件】欢迎登录 http://wsmud.bobcn.me 进行流程及触发器技术交流，脚本讨论。\n<hir>";
                } else if (parseInt(Math.random() * 10) < 10) {
                    h = "<hir>【插件】欢迎访问 https://emeisuqing.github.io/wsmud.old/ 苏轻 助你武神之路上更加轻松愉快。\n<hir>";
                }
                parseInt(Math.random() * 10) < 2 ? $('.channel pre').append(h) : console.log("");
                $(".channel")[0].scrollTop = 99999;
            }, 320 * 1000);
        }, 2000);

        KEY.init();
        WG.init();
        GI.init();
        unsafeWindow.WG = WG;
        unsafeWindow.T = T;
        unsafeWindow.L = L;
        unsafeWindow.messageClear = messageClear;
        unsafeWindow.messageAppend = messageAppend;
        unsafeWindow.send_cmd = send_cmd;
        unsafeWindow.roomData = roomData;
        unsafeWindow.MusicBox = MusicBox;
        unsafeWindow.FakerTTS = FakerTTS;
        window.addEventListener("message", receiveMessage, false);
        function receiveMessage(event) {
            var origin = event.origin;
            var data = event.data;
            try {
                if(JSON.parse(data) instanceof Object){
                    return;
                }
            } catch (error) {
                console.log("Run at message");
            }
            
            if (data === '挖矿' || data === '修炼') {
                WG.zdwk();
            } else if (data === '日常') {
                WG.SendCmd("$daily");
            } else if (data === '挂机') {
                WG.SendCmd("stopstate");
            } else {
                if (data.split("\n")[0].indexOf("//") >= 0) {
                    if (unsafeWindow && unsafeWindow.ToRaid) {
                        ToRaid.perform(data);
                    }
                } else if (data.split("\n")[0].indexOf("#js") >= 0) {
                    var jscode = data.split("\n");
                    jscode.baoremove(0)
                    eval(jscode.join(""));
                } else {
                    WG.SendCmd(data);
                }
            }
        }
        $('.room-name').on('click', (e) => {
            e.preventDefault();
            $('.container').contextMenu({
                x: 1,
                y: 1
            });
        });
        $.contextMenu({
            selector: '.container',
            items: {
                "关闭自动": {
                    name: "关闭自动",
                    visible: function (key, opt) {
                        return timer != 0;
                    },
                    callback: function (key, opt) {
                        WG.timer_close();
                    },
                },
                "自动": {
                    name: "自动",
                    visible: function (key, opt) {
                        return timer == 0;
                    },
                    "items": {
                        "自动武道": {
                            name: "自动武道",
                            callback: function (key, opt) {
                                WG.wudao_auto();
                            },
                        },
                        "自动小树林": {
                            name: "自动小树林",
                            callback: function (key, opt) {
                                WG.grove_auto();
                            }
                        },
                        "自动整理并清包": {
                            name: "自动整理并清包",
                            callback: function (key, opt) {
                                WG.sell_all();
                            }
                        },
                        "自动比试": {
                            name: "自动比试",
                            visible: function (key, opt) {
                                return WG.fight_listener == undefined;
                            },
                            callback: function (key, opt) {
                                WG.auto_fight();
                            },
                        },
                        "关闭比试": {
                            name: "关闭比试",
                            visible: function (key, opt) {
                                return WG.fight_listener != undefined;
                            },
                            callback: function (key, opt) {
                                WG.auto_fight();
                            },
                        },
                        "自动使用道具": {
                            name: "自动使用道具",
                            callback: function (key, opt) {
                                WG.auto_useitem();
                            },
                        },
                        "自动研药": {
                            name: "自动研药",
                            callback: function (key, opt) {
                                WG.auto_Development_medicine();
                            },
                        },
                        "一键日常": {
                            name: "一键日常",
                            callback: function (key, opt) {
                                WG.oneKeyDaily();
                            },
                        },
                        "一键请安": {
                            name: "一键请安",
                            callback: function (key, opt) {
                                WG.oneKeyQA();
                            },
                        },
                        "一键扫荡": {
                            name: "一键扫荡",
                            callback: function (key, opt) {
                                WG.oneKeySD();
                            },
                        },

                        "一键当铺购买": {
                            name: "一键当铺购买",
                            callback: function (key, opt) {
                                WG.tnBuy();
                            },
                        },
                    },
                },
                "换装设置": {
                    name: "换装设置",
                    "items": {
                        "xx0": {
                            name: "套装1设或装",
                            callback: function (key, opt) {
                                WG.eqhelper(1);
                            },
                        },
                        "xxx0": {
                            name: "技能1设或装",
                            callback: function (key, opt) {
                                WG.eqhelper(1, 1);
                            },
                        },
                        "xx1": {
                            name: "清除套装1设置",
                            callback: function (key, opt) {
                                WG.eqhelperdel(1);
                            },
                        },
                        "yy0": {
                            name: "套装2设或装",
                            callback: function (key, opt) {
                                WG.eqhelper(2);
                            },
                        }, "yyy1": {
                            name: "技能2设或装",
                            callback: function (key, opt) {
                                WG.eqhelper(2, 1);
                            },
                        },
                        "yy1": {
                            name: "清除套装2设置",
                            callback: function (key, opt) {
                                WG.eqhelperdel(2);
                            },
                        },
                        "zz0": {
                            name: "套装3设或备",
                            callback: function (key, opt) {
                                WG.eqhelper(3);
                            },
                        }, "zzz1": {
                            name: "技能3设或装",
                            callback: function (key, opt) {
                                WG.eqhelper(3, 1);
                            },
                        },
                        "zz1": {
                            name: "清除套装3设置",
                            callback: function (key, opt) {
                                WG.eqhelperdel(3);
                            },
                        },
                        "uneq": {
                            name: "取消所有装备",
                            callback: function (key, opt) {
                                WG.uneqall();
                            },
                        },
                    }
                },
                "自命令,自定监控": {
                    name: "自命令,自定监控",
                    callback: function (key, opt) {
                        WG.zmlztjk();
                    },
                },
                "手动喜宴": {
                    name: "手动喜宴",
                    callback: function (key, opt) {
                        console.log("当前自动状态:" + stopauto);
                        WG.xiyan();
                    },
                },
                "快捷传送": {
                    name: "常用地点",
                    "items": {
                        "mp0": {
                            name: "豪宅",
                            callback: function (key, opt) {
                                WG.go("住房");
                            },
                        },
                        "mp11": {
                            name: "衙门",
                            callback: function (key, opt) {
                                WG.go("扬州城-衙门正厅");
                            },
                        },
                        "mp12": {
                            name: "镖局",
                            callback: function (key, opt) {
                                WG.go("扬州城-镖局正厅");
                            },
                        },
                        "mp1": {
                            name: "当铺",
                            callback: function (key, opt) {
                                WG.go("扬州城-当铺");
                            },
                        },
                        "mp2": {
                            name: "擂台",
                            callback: function (key, opt) {
                                WG.go("扬州城-擂台");
                            },
                        },
                        "mp6": {
                            name: "药铺",
                            callback: function (key, opt) {
                                WG.go("扬州城-药铺");
                            },
                        },
                        "mp7": {
                            name: "武庙疗伤",
                            callback: function (key, opt) {
                                WG.go("扬州城-武庙");
                                WG.Send("liaoshang");
                            },
                        }

                    },
                },
                "门派传送": {
                    name: "门派传送",
                    "items": {
                        "mp0": {
                            name: "武当",
                            callback: function (key, opt) {
                                let myDate = new Date();
                                if (myDate.getHours() >= 17) {
                                    WG.go("武当派-后山小院");
                                } else {
                                    WG.go("武当派-广场");
                                }
                            },
                        },
                        "mp1": {
                            name: "少林",
                            callback: function (key, opt) {
                                let myDate = new Date();
                                if (myDate.getHours() >= 17) {
                                    WG.go("少林派-方丈楼");
                                } else {
                                    WG.go("少林派-广场");
                                }
                            },
                        },
                        "mp2": {
                            name: "华山",
                            callback: function (key, opt) {
                                let myDate = new Date();
                                if (myDate.getHours() >= 17) {
                                    WG.go("华山派-客厅");
                                } else {
                                    WG.go("华山派-镇岳宫");
                                }
                            },
                        },
                        "mp3": {
                            name: "峨眉",
                            callback: function (key, opt) {
                                let myDate = new Date();
                                if (myDate.getHours() >= 17) {
                                    WG.go("峨眉派-清修洞");
                                } else {
                                    WG.go("峨眉派-金顶")
                                }
                            },
                        },
                        "mp4": {
                            name: "逍遥",
                            callback: function (key, opt) {
                                let myDate = new Date();
                                if (myDate.getHours() >= 17) {
                                    WG.go("逍遥派-地下石室");
                                } else {
                                    WG.go("逍遥派-青草坪");
                                }
                            },
                        },
                        "mp5": {
                            name: "丐帮",
                            callback: function (key, opt) {
                                let myDate = new Date();
                                if (myDate.getHours() >= 17) {
                                    WG.go("丐帮-林间小屋");
                                } else {
                                    WG.go("丐帮-树洞内部");
                                }
                            },
                        },
                        "mp6": {
                            name: "武馆",
                            callback: function (key, opt) {
                                WG.go("扬州城-扬州武馆");
                            },
                        },
                        "mp7": {
                            name: "杀手楼",
                            callback: function (key, opt) {
                                WG.go("杀手楼-大门");
                            },
                        }
                    },
                },
                "打开仓库": {
                    name: "打开仓库",
                    callback: function (key, opt) {
                        if (WG.at("扬州城-钱庄")) {
                            WG.Send("store");
                        } else {
                            WG.go("扬州城-钱庄");
                        }
                    },
                },
                "切换菜单": {
                    name: "切换菜单",
                    callback: function (key, opt) {
                        let p = 'on'
                        if (inzdy_btn) {
                            p = 'off'
                        }
                        WG.zdy_btnshow(p);
                    },
                },
                "简单工具": {
                    name: "简单工具",
                    callback: function (key, opt) {
                        WG.calc();
                    },
                },
                "调试BOSS": {
                    name: "调试BOSS",
                    visible: false,
                    callback: function (key, opt) {
                        WG.kksBoss({
                            content: "听说呼符出现在逍遥派-地下石室一带。"
                        });
                    },
                },
                "流程菜单Raid.js": {
                    name: "流程菜单Raid.js",
                    callback: function (key, opt) {
                        if (unsafeWindow && unsafeWindow.ToRaid) {
                            unsafeWindow.ToRaid.menu();
                        } else {
                            messageAppend("插件未安装,请访问 https://greasyfork.org/zh-CN/scripts/375851-wsmud-raid 下载并安装");
                            window.open("https://greasyfork.org/zh-CN/scripts/375851-wsmud-raid ", '_blank').location;
                        }
                    }
                },
                "设置": {
                    name: "设置",
                    callback: function (key, opt) {
                        WG.setting();
                    },
                },
                "打开面板": {
                    name: "打开面板",
                    visible: function (key, opt) {
                        return $('.WG_log').css('display') == 'none';
                    },
                    callback: function (key, opt) {
                        WG.showhideborad();
                    },
                },
                "关闭面板": {
                    name: "关闭面板",
                    visible: function (key, opt) {
                        return $('.WG_log').css('display') != 'none';
                    },
                    callback: function (key, opt) {
                        WG.showhideborad();
                    },
                }
            }
        });
    });
})();
