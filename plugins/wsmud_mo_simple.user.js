// ==UserScript==
// @name        wsmud_mo_simple
// @namespace   mos
// @version     0.1.2.2
// @author      sq, 白三三
// @match       http://*.wsmud.com/*
// @homepage    https://greasyfork.org/zh-CN/scripts/394530-wsmud-mo-simple
// @description 基于 wsmud_funny_mobile 修改
// @run-at      document-start
// @require     https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';
    let funny = {
        version: GM_info.script.version,
        data: {},
        role: {},
        data_skill_limit: 0,
        data_login: 0,
        data_id: "12345678910",
        state: "data.state",
        data_autokill_xy: true,
        layout_left: true,
        // Beep: function() {
        //     document.getElementById("beep").play();
        // },
    };
    unsafeWindow.funny = funny;
    let fn = {
        send: function(message) {
            if (typeof message === "string") {
                sendmessage(message);
            } else if (message instanceof Array) {
                action(message);
                async function action(message) {
                    for (const m of message) (typeof m === "number") ? (await fn.sleep(m)) : sendmessage(m);
                }
            }
            function sendmessage(message) {
                $("#sendmessage").attr("cmd") ? $("#sendmessage").attr("cmd", message) : $(".container").append($(`<span id="sendmessage" cmd="${message}"><span>`));
                $("#sendmessage").click();
            }
        },
        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        scroll: function(name) {
            if (name === undefined) return;
            let a = $(name)[0].scrollTop,
                b = $(name)[0].scrollHeight,
                h = Math.ceil($(name).height()); // 向上取整
                // console.log(`fn.scroll => a=${a} b=${b} h=${h}`);
            if (a < b - h) {
                let add = (b - h < 120) ? 1 : Math.ceil((b - h) / 120);
                $(name)[0].scrollTop = a + add;
                setTimeout(`fn.scroll("${name}")`, 1000/120);
            }
        },
        deepCopy: function (object) {
            let result = {};
            for (const key in object) {
                result[key] = typeof object[key] === "object" ? fn.deepCopy(object[key]) : object[key];
            }
            return result;
        },
        getTime: function() {
            let date = new Date();
            let h = parseInt(date.getHours());
            let m = parseInt(date.getMinutes());
            h = h < 10 ? `0${h}` : `${h}`;
            m = m < 10 ? `0${m}` : `${m}`;
            return `${h}:${m}`;
        },
        addContent: function(element) {
            $(".content-message pre").append(element);
            fn.scroll(".content-message");
            return false;
        },
        // beep: function() {
        //     document.getElementById("beep").play();
        // },
    };
    unsafeWindow.fn = fn;
    let listener = {
        onmessage: function(message) {
            let data = message.data;
            if (/{(.*)}/.test(data)) data = (new Function(`return ${data};`))();
            if (typeof data === "string") {
                listener.extends.text.forEach(fn => fn(message));
                return;
            } else if (typeof data === "object") {
                switch (data.type) {
                    case "roles":
                        funny.data.roles = data;
                        break;
                    case "login":
                        funny.data.id = data.id;
                        break;
                    case "dialog":
                        listener.extends.dialog.forEach(fn => fn(data));
                        break;
                    case "msg":
                        funny.onmessage_fn.apply(this, arguments);
                        return;
                    case "room":
                        listener.extends.room.forEach(fn => fn(message, data));
                        return;
                    case "exits":
                        break;
                    case "item":
                        break;
                    case "items":
                        break;
                    case "itemadd":
                        listener.extends.itemadd.forEach(fn => fn(data));
                        break;
                    case "itemremove":
                        break;
                    case "actions":
                        break;
                    case "addAction":
                        break;
                    case "state":
                        funny.state = data.state;
                        listener.extends.state.forEach(fn => fn(message, data));
                        return;
                    case "perform":
                        break;
                    case "status":
                        break;
                    case "combat":
                        break;
                    case "dispfm":
                        break;
                    case "sc":
                        break;
                    case "time":
                        break;
                    case "disobj":
                        break;
                    default:
                        console.log(data);
                        break;
                }
            }
            funny.onmessage_fn.apply(this, arguments);
        },
        sendmessage: function(message) {
            funny.webSocket.send(message);
        },
        extends: {
            text: [],
            dialog: [],
            msg: [],
            room: [],
            state: [],
            itemadd: [],
        },
        addListener: function(type, fn) {
            listener.extends[type].push(fn);
        },
    };
    unsafeWindow.listener = listener;
    listener.addListener("text", function(message) {
        let data = message.data;
        if (/重新连线|欢迎登陆/.test(data)) {
            funny.data_login += 1;
            $(".content-message pre").append(`${data}\n`);
            if (funny.data_login === 1) {
                $(".content-message pre").append(`wsmud_mo_simple ${funny.version}(基于funny修改)\n`);
                getScore();
            }
            async function getScore() {
                $("[command=score]").click();
                await fn.sleep(100);
                $("[for=1]").click();
                await fn.sleep(100);
                $("[for=0]").click();
                await fn.sleep(100);
                $("[command=skills]").click();
                await fn.sleep(100);
                $("[command=pack]").click();
                await fn.sleep(100);
                $("[command=tasks]").click();
                await fn.sleep(100);
                $("[command=showcombat]").click(); // 点击动作
                await fn.sleep(100);
                $("[command=showtool]").click();   // 点击菜单
                await fn.sleep(1000);
                $(".dialog-close").click();
            };
        } else if (/只留下一堆玄色石头/.test(data) && data.includes("你")) {
            let a = data.match(/只见(.*)发出一阵白光/);
            $(".content-message pre").append(`你分解了 => ${a[1]}\n`)
        // } else if (/你身上东西太多了|你拿不下那么多东西。/.test(data)) {
        //     $(".content-message pre").append(`<hir>友情提示：请检查是否背包已满！</hir>`);
        //     fn.send(`tm 友情提示：请检查是否背包已满！`);
        //     fn.beep();
        } else if (/你身上没有挖矿工具。/.test(data)) {
            // SendCommand([]);//小号没有铁镐的情况
        } else if (/你的最大内力增加了/.test(data)) {
            funny.onmessage_fn.apply(this, arguments);
            let a = data.match(/你的最大内力增加了(.*)点。/);
            let n = parseInt(a[1]),
              max = parseInt(funny.role.max_mp),
            limit = parseInt(funny.role.limit_mp);
            let time = (limit - max) / (n * 6); // X分钟 => X小时X分钟
            let timeString = time < 60 ? `${parseInt(time)}分钟` : `${parseInt(time / 60)}小时${parseInt(time % 60)}分钟`;
            $(".remove_dzsj").remove();
            $(".content-message pre").append(`<span class="remove_dzsj">当前内力: ${max}\n上限内力: ${limit}\n需要时间: ${timeString}\n</span>`);
        } else {
            funny.onmessage_fn.apply(this, arguments);
        }
        fn.scroll(".content-message");
    });

    // tasks
    listener.addListener("dialog", function(data) {
        if (data.dialog === "tasks" && data.items) {
            let fb, qa, wd, wd1, wd2, wd3, xy, mpb, boss, wdtz, sm1, sm2, ym1, ym2, yb1, yb2;
            data.items.forEach(item => {
                if (item.state === 2) fn.send(`taskover ${item.id}`); // 自动完成
                if (item.id === "signin") {
                    let a = item.desc.match(/师门任务：(.*)，副本：<(.*)>(.*)\/20<(.*)>/);
                    let b = item.desc.match(/(.*)武道塔(.*)，进度(\d+)\/(\d+)<(.*)/);
                    let c = item.desc.match(/<.+?>(.+)首席请安<.+?>/);
                    let d = item.desc.match(/尚未协助襄阳守城/);
                    let e = item.desc.match(/尚未挑战门派BOSS/);
                    let f = item.desc.match(/挑战武神BOSS(\d+)次/);
                    let g = item.desc.match(/尚未挑战武道塔塔主/);
                    (parseInt(a[3]) < 20) ? fb = `<hig>${a[3]}</hig>` : fb = a[3];
                    if (b) {
                        (parseInt(b[3]) < parseInt(b[4])) ? wd1 = `<hig>${b[3]}</hig>` : wd1 = b[3];
                        wd2 = b[4];
                        /可以重置/.test(b[2]) ? wd3 = "<hig>可以重置</hig>" : wd3 = "已经重置";
                        wd = wd1+"/"+wd2+" "+wd3
                    }else {wd = "只打塔主"}
                    if (c) {
                        /已经/.test(c[1]) ? qa = "已经请安" : qa = "<hig>尚未请安</hig>";
                    }else {qa = "无需请安"}
                    (d) ? xy = `<hig>0</hig>` : xy = 1;
                    (e) ? mpb = `<hig>0</hig>` : mpb = 1;
                    if (f) {
                        boss = 5 - parseInt(f[1]);
                        boss = `<hig>${boss}</hig>`;
                    }else{
                        if (G.level && G.level.indexOf('武神') >= 0) boss = 5;
                    }
                    (g) ? wdtz = `<hig>0</hig>/1` : wdtz = `已打或未解锁`;
                } else if (item.id === "sm") {
                    let a = item.desc.match(/目前完成(.*)\/20个，共连续完成(.*)个。/);
                    (parseInt(a[1]) < 20) ? sm1 = `<hig>${a[1]}</hig>` : sm1 = a[1];
                    sm2 = a[2];
                } else if (item.id === "yamen") {
                    let a = item.desc.match(/目前完成(.*)\/20个，共连续完成(.*)个。/);
                    (parseInt(a[1]) < 20) ? ym1 = `<hig>${a[1]}</hig>` : ym1 = a[1];
                    ym2 = a[2];
                } else if (item.id === "yunbiao") {
                    let a = item.desc.match(/本周完成(.*)\/20个，共连续完成(.*)个。/);
                    (parseInt(a[1]) < 20) ? yb1 = `<hig>${a[1]}</hig>` : yb1 = a[1];
                    yb2 = a[2];
                }
            });
            let html = `门派请安 => ${qa}\n武道之塔 => ${wd}\n`;
            html += `日常副本 => ${fb}/20\n师门任务 => ${sm1}/20 ${sm2}连\n`;
            html += `衙门追捕 => ${ym1}/20 ${ym2}连\n每周运镖 => ${yb1}/20 ${yb2}连\n`;
            html += `襄阳守城 => ${xy}/1 门派BOSS => ${mpb}/1\n`
            html += `武道塔主 => ${wdtz}\n`;
            if (boss) html += `武神BOSS => ${boss}/5\n`;
            $(".remove_tasks").remove();
            $(".content-message pre").append($(`<span class="remove_tasks"><span>`).html(html));
            fn.scroll(".content-message");
        }
    });

    // score
    listener.addListener("dialog", function(data) {
        if (data.dialog === "score") {
            for (const key in data) funny.role[key] = data[key];
        }
    });

    // skills
    listener.addListener("dialog", function(data) {
        if (data.dialog === "skills") {
            funny.skills = data.items || funny.skills || [];
            if (data.items) {
                funny.data_skill_limit = parseInt(data.limit);
            } else if (data.id && data.exp) {
                if (data.level) {
                    for (const skill of funny.skills) {
                        if (skill.id === data.id) {
                            skill.level = data.level;
                            break;
                        }
                    }
                }
                let name = "", k = 0, level = 0;
                let djsx = funny.data_skill_limit; // 上限
                let xxxl = parseInt(funny.role.study_per);   // 学习效率
                let lxxl = parseInt(funny.role.lianxi_per);  // 练习效率
                let xtwx = parseInt(funny.role.int);         // 先天悟性
                let htwx = parseInt(funny.role.int_add);     // 后天悟性
                if (funny.skills) {
                    for (const skill of funny.skills) {
                        if (skill.id === data.id) {
                            name = skill.name;
                            level = parseInt(skill.level);
                            if (/<wht>.*/.test(name)) k = 1; // 白
                            if (/<hig>.*/.test(name)) k = 2;
                            if (/<hic>.*/.test(name)) k = 3;
                            if (/<hiy>.*/.test(name)) k = 4;
                            if (/<hiz>.*/.test(name)) k = 5;
                            if (/<hio>.*/.test(name)) k = 6; // 橙
                            if (/<ord>.*/.test(name)) k = 7; // 红
                            break;
                        }
                    }
                }
                let qianneng = (djsx * djsx - level * level) * 2.5 * k;
                //if (funny.state === "你正在练习技能") {
                if (funny.state.indexOf("练习") != -1) {
                    let time = qianneng / (xtwx + htwx) / (1 + lxxl / 100 - xtwx / 100) / 12;
                    let timeString = time < 60 ? `${parseInt(time)}分钟` : `${parseInt(time / 60)}小时${parseInt(time % 60)}分钟`;
                    $(".remove_lx").remove();
                    // 练习每一跳的消耗公式＝（先天悟性＋后天悟性）×（1＋练习效率%－先天悟性%）
                    $(".content-message pre").append(`练习${name}消耗了${parseInt(qianneng / time / 12)}点潜能。\n`);
                    $(".content-message pre").append(`<span class="remove_lx">悟性: ${xtwx}＋${htwx} 效率: ${lxxl}%\n等级上限: ${djsx}级\n需要潜能: ${qianneng}\n需要时间: ${timeString}\n</span>`);
                    fn.scroll(".content-message");
                // } else if (funny.state.search(/读书|学习/) != -1) {
                //     // 学习每一跳的消耗公式＝（先天悟性＋后天悟性）×（1＋学习效率%－先天悟性%）×3
                //     let cost = (xtwx + htwx) * (1 +  xxxl / 100 - xtwx / 100) * 3;
                //     $(".content-message pre").append(`学习${name}消耗了${parseInt(cost)}点潜能。\n`);
                //     let time = qianneng / cost / 12;
                //     let timeString = time < 60 ? `${parseInt(time)}分钟` : `${parseInt(time / 60)}小时${parseInt(time % 60)}分钟`;
                //     $(".content-message pre").append(`<span class="remove_xx">练满时间 => ${timeString}\n</span>`);
                //     fn.scroll(".content-message");
                }
            }
        }
    });
    // pack
    listener.addListener("dialog", function(data) {
        if (data.dialog === "pack") {

            if (data.can_use == 1 && /养精丹|朱果|潜灵果|背包扩充石|小箱子|师门补给包|随从礼包/.test(data.name)) {
                let cmd = ["stopstate"];
                let count = data.count;
                let zl = "use";
                if (/<hig>养精丹<\/hig>/.test(data.name)) count = count > 10 ? 10 : count;
                if (/小箱子|师门补给包|随从礼包/.test(data.name)) zl = "open";
                for (let i = 0; i < count; i ++) {
                    cmd.push(zl + " " + data.id);
                    cmd.push(500);
                }
                $(".content-message pre").append(
                    $(`<div class="item-commands"></div>`).append(
                        $(`<span>快捷使用${count}次 => ${data.name}</span>`).click(() => {
                            fn.send(cmd);
                        }),
                    ),
                );
            }

            // if (data.name) {
            //     if (/<hig>大宋(.*)<\/hig>|<hig>蒙古(.*)<\/hig>|<hig>笠子帽<\/hig>|<hic>大宋(.*)<\/hic>|<hic>蒙古(.*)<\/hic>|<hic>笠子帽<\/hic>|<hiy>大宋(.*)<\/hiy>|<hiy>蒙古(.*)<\/hiy>|<hiy>笠子帽<\/hiy>/.test(data.name)) {
            //         fn.send(`fenjie ${data.id}`);
            //     }
            // }

            // if (data.jldesc) {
            //     let jl = data.jldesc.match(/<hio>(.*)<\/hio><br\/>精炼<(hig|hic|hiy|hiz|hio|ord)>＋(.*)\s</i);
            //     if (jl) {
            //         let n = "<hio>" + jl[1] + "</hio>";
            //         let j = parseInt(jl[3]);
            //         let c = 13 - j;
            //         let cmd = [];
            //         for (let i = 0; i < c; i ++) {
            //             cmd.push(`jinglian ${data.id} ok`);
            //             cmd.push(500);
            //         }
            //         $(".content-message pre").append(
            //             $(`<div class="item-commands"></div>`).append(
            //                 $(`<span>精炼6星 => ${n}</span>`).click(() => {
            //                     fn.send(cmd);
            //                 }),
            //             ),
            //         );
            //         fn.scroll(".content-message");
            //     }
            // }
        }
    });

    let room = new Proxy({ str: "a-b", name1: "a", name2: "b", path: "a/b/c", items: [] }, {
        set: function (room, key, value) {
          room[key] = value;
          return true;
        },
        get: function (room, key) {
          return room[key];
        }
    });
    listener.addListener("room", function(message, data) {
        room.str = data.name.replace("(副本区域)", "");
        let x = room.str.match(/(.*)-(.*)/);
        room.name1 = x[1];
        room.name2 = x[2];
        room.path = data.path;
        room.desc = data.desc;
        if (room.desc.length > 20) {
            let desc0 = room.desc.replace(/<([^<]+)>/g, "");
            let desc1 = desc0.substr(0, 20);
            let desc2 = desc0.substr(20);
            data.desc = `${desc1}<span id="show"> <hic>»»»</hic></span><span id="more" style="display:none">${desc2}</span><span id="hide" style="display:none"> <hic>«««</hic></span>`;
        }
        if (room.desc.includes("cmd")) {
            room.desc = room.desc.replace("<hig>椅子</hig>", "椅子");
            room.desc = room.desc.replace("<CMD cmd='look men'>门(men)<CMD>", "<cmd cmd='look men'>门</cmd>");//兵营副本的门
            room.desc = room.desc.replace(/span/g, "cmd");//房间描述中<span>标签的命令改为<cmd>
            room.desc = room.desc.replace(/"/g, "'"); // "" => ''
            room.desc = room.desc.replace(/\((.*?)\)/g, "");//去除括号和里面的英文单词
            //console.log(room.desc);
            // let c = `◆`;
            let cmds = room.desc.match(/<cmd cmd='([^']+)'>([^<]+)<\/cmd>/g);
            //console.log(cmds);
            cmds.forEach(cmd => {
                let x = cmd.match(/<cmd cmd='(.*)'>(.*)<\/cmd>/);
                data.commands.unshift({ cmd: x[1], name: `<hic>${x[2]}</hic>` });
            });
            //room.desc = room.desc.replace(/<([^<]+)>/g, "");
            cmds.forEach(desc => data.desc = `<hic>${desc}</hic>　${data.desc}`);
        }
        let mask = fn.deepCopy(message);
        mask.data = JSON.stringify(data);
        funny.onmessage_fn.apply(this, [mask]);
        $("#show").click(() => {
            $("#more").show();
            $("#show").hide();
            $("#hide").show();
        });
        $("#hide").click(() => {
            $("#more").hide();
            $("#show").show();
            $("#hide").hide();
        });
    });
    listener.addListener("state", function(message, data) {
        if (data.desc && data.desc.length > 0) {
            data.desc = [];
            let mask = fn.deepCopy(message);
            mask.data = JSON.stringify(data);
            funny.onmessage_fn.apply(this, [mask]);
        } else {
            funny.onmessage_fn.apply(this, [message]);
        }
    });

    /* listener.addListener("itemadd", function(data) {
        if (/蒙古兵|十夫长|百夫长|千夫长|万夫长/.test(data.name)) {
            if (data.id) fn.send(`kill ${data.id}`);
        }
    }); */



    if (WebSocket) {
        unsafeWindow.WebSocket = function(url) {
            funny.webSocket = new WebSocket(url);
        };
        unsafeWindow.WebSocket.prototype = {
            get url() {
                return funny.webSocket.url;
            },
            get protocol() {
                return funny.webSocket.protocol;
            },
            get readyState() {
                return funny.webSocket.readyState;
            },
            get bufferedAmount() {
                return funny.webSocket.bufferedAmount;
            },
            get extensions() {
                return funny.webSocket.extensions;
            },
            get binaryType() {
                return funny.webSocket.binaryType;
            },
            set binaryType(type) {
                funny.webSocket.binaryType = type;
            },
            get onerror() {
                return funny.webSocket.onerror;
            },
            set onerror(fn) {
                funny.webSocket.onerror = fn;
            },
            get onopen() {
                return funny.webSocket.onopen;
            },
            set onopen(fn) {
                funny.webSocket.onopen = fn;
            },
            get onclose() {
                return funny.webSocket.onclose;
            },
            set onclose(fn) {
                funny.webSocket.onclose = fn;
            },
            close: function () {
                funny.webSocket.close();
            },
            get onmessage() {
                return funny.webSocket.onmessage;
            },
            set onmessage(fn) {
                funny.onmessage_fn = fn;
                funny.webSocket.onmessage = listener.onmessage;
            },
            send: function (message) {
                listener.sendmessage(message);
            },
        };
    };

    $(document).ready(function() {
        //GM_addStyle(`.room_desc{overflow:hidden;white-space:nowrap;}`);
        GM_addStyle(`.content-bottom{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;}`);
        // $("body").append(
        //     $(`<audio id="beep" preload="auto"></audio>`).append(`<source src="http://47.102.126.255/wav/complete.wav">`)
        // );
    });
})();