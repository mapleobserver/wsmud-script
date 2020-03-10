// ==UserScript==
// @name        wsmud_funny
// @namespace   suqing.fun
// @version     0.3.32
// @author      SuQing
// @match       http://*.wsmud.com/*
// @homepage    https://greasyfork.org/zh-CN/scripts/380709
// @description 如果你由于使用 wsmud_funny 插件而产生了任何不适，那么请即时关闭此插件即可。
// @run-at      document-start
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setClipboard
// ==/UserScript==

function say(text) {
    let url = "https://fanyi.baidu.com/gettts?lan=zh&text=" + text + "&spd=5&source=web";
    let audio = new Audio(url);
    audio.play();
  }
  unsafeWindow.say = say;
  
  (function() {
    "use strict";
    /********************变量********************/
    let isMoblie = false;
    let websocket = null;
    let fn_onmessage = null;
    let onmessage = event => {
      let message = Str2Obj(event.data);
      console.log(message);
      if (message.type === "dialog") message.type = message.dialog;
      for (let i = 0; i < listeners.length; i++) {
        let fn = listeners[i];
        if (fn === null) continue;
        if (fn(event, message) === false) return;
      }
      fn_onmessage.apply(this, [event]);
    }
    let listeners = [];//监听
    let addListener = fn => {
      let id = listeners.length;
      listeners.push(fn);
      return id;
    };
    let removeListener = id => listeners[id] = null;
  
    let title = new Proxy({ name: "RoleName", state: "<STATE>" }, {
      set: function (title, key, value) {
        title[key] = value;
        $("head title").html(title.name + title.state);
        return true;
      },
      get: function (title, key) {
        return title[key];
      }
    });
    let roles = {};
    let id = "";
    let login = false;
    let showTimeStr = false;
    let role = new Proxy({}, {
      set: function (role, key, value) {
        if (!isMoblie) {
          if (key === "name" && role.name) return true;//name不变
          $(".role_" + key).html(value);
        }
        role[key] = value;
        return true;
      },
      get: function (role, key) {
        return role[key];
      }
    });
    let skills = new Proxy({}, {
      set: function (skills, key, value) {
        skills[key] = value;
        return true;
      },
      get: function (skills, key) {
        return skills[key];
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
    let exits = {};
  
    let content = new Proxy({ qn: 0, jy: 0, nl: 0, task: "任务", lwsb: "领悟石壁" }, {
      set: function (content, key, value) {
        if ($(".remove_" + key)[0]) {
          $(".remove_" + key).remove();
        }
        content[key] = value;
        return true;
      },
      get: function (content, key) {
        return content[key];
      }
    });
  
    {//检查判断
      if (!/test/.test(GM_info.script.version)) {//根据是否测试决定是否屏蔽console.log
        console.log = target => {
          return;
        };
      }
      if (navigator.userAgent) {//判断设备是否为移动端
        let agent = navigator.userAgent.toLowerCase();
        if (/ipad|iphone|android|mobile/.test(agent)) {
          isMoblie = true;
        }
        console.log(agent);
      }
      if (WebSocket) {//检测WebSocket
        unsafeWindow.WebSocket = function (uri) {
          websocket = new WebSocket(uri);
        };
        unsafeWindow.WebSocket.prototype = {
          get url() {
            return websocket.url;
          },
          get protocol() {
            return websocket.protocol;
          },
          get readyState() {
            return websocket.readyState;
          },
          get bufferedAmount() {
            return websocket.bufferedAmount;
          },
          get extensions() {
            return websocket.extensions;
          },
          set binaryType(type) {
            websocket.binaryType = type;
          },
          get binaryType() {
            return websocket.binaryType;
          },
          set onerror(fn) {
            websocket.onerror = fn;
          },
          get onerror() {
            return websocket.onerror;
          },
          set onopen(fn) {
            websocket.onopen = fn;
            title.state = "<已连接>";
          },
          get onopen() {
            return websocket.onopen;
          },
          set onclose(fn) {
            websocket.onclose = fn;
            title.state = "<已离线>";
            //setTimeout(() => websocket.onopen(),  5000);//自动重连
          },
          get onclose() {
            return websocket.onclose;
          },
          set onmessage(fn) {
            fn_onmessage = fn;
            websocket.onmessage = onmessage;
          },
          get onmessage() {
            return websocket.onmessage;
          },
          send: command => SendCommand(command),
          close: () => websocket.close(),
        };
      } else return;//WebSocket不存在直接结束
    }//检查判断
  
    /********************监控********************/
    addListener(function (event, message) {
      if (message.type === "roles") {
        message.roles.forEach(role => {
          let id = role.id;
          let name = role.name;
          roles[id] = name;
        });
      } else if (message.type === "login") {
        id = message.id;
        title.name = roles[id];
        title.state = "<已登录>";
        role.name = roles[id];
      }
      return true;
    });//roles/login
    addListener(function (event, message) {
      if (message.type === "room") {
        room.str = message.name.replace("(副本区域)", "");
        let x = room.str.match(/(.*)-(.*)/);
        room.name1 = x[1];
        room.name2 = x[2];
        room.path = message.path;
  
        room.desc = message.desc;
        if (room.desc.includes("cmd")) {
          // 四周灰蒙蒙的不知身在何处，在你的正前方一根巨大的柱子虚空而立，柱子上雕刻着一些神秘的花纹，底下立着一块残破的<cmd cmd="look bei">石碑</cmd>，上面写着【戊申】两个大字。
          // <cmd cmd="look bei">石碑</cmd>
          console.log(room.desc);
          room.desc = room.desc.replace("<hig>椅子</hig>", "椅子");//新手教程的椅子
          room.desc = room.desc.replace("<CMD cmd='look men'>门(men)<CMD>", "<cmd cmd='look men'>门</cmd>");//兵营副本的门
          room.desc = room.desc.replace(/span/g, "cmd"); //古墓里的画和古琴是<span>标签
          room.desc = room.desc.replace(/"/g, "'"); // "" => ''
          room.desc = room.desc.replace(/\((.*?)\)/g, "");//去除括号和里面的英文单词
          console.log(room.desc);
          let cmds = room.desc.match(/<cmd cmd='([^']+)'>([^<]+)<\/cmd>/g);
          console.log(cmds);
          cmds.forEach(cmd => {
            let x = cmd.match(/<cmd cmd='(.*)'>(.*)<\/cmd>/);
            message.commands.unshift({ cmd: x[1], name: `<hic>${x[2]}</hic>` });
          });
          room.desc = room.desc.replace(/<([^<]+)>/g, "");
        }
  
        let event0 = DeepCopy(event);
        message.desc = room.desc.substr(0, 20) + "……";
        event0.data = JSON.stringify(message);
        fn_onmessage.apply(this, [event0]);
        return false;
      } else if (message.type === "exits") {
        for (const key in exits) delete exits[key];//先清空
        for (const key in message.items) {
          exits[key] = message.items[key];
          exits[message.items[key]] = "go " + key;
        }
      }
      return true;
    });//room/exits
    addListener(function (event, message) {
      if (message.type === "items") {
        room.items = [];
        message.items.forEach(item => {
          if (item === 0) {
          } else if (item.id && item.name && Object.entries(item).length === 2) {//只有id和name的是物品或者尸体
            if (!item.name.includes("尸体")) {
              SendCommand(`get ${item.id}`);//自动拾取不是尸体的物品
            }
          } else if (item.p !== 1) {//不是玩家的NPC保存起来
            room.items.push(item);
          }
        });
      }
      if (message.type === "itemadd" && message.p !== 1) {
        room.items.push(message);
      }
      if (message.type === "itemremove") {
        let index = room.items.findIndex(item => {
          return item.id === message.id;
        });
        if (index !== -1) room.items.splice(index, 1);//删除
      }
      return true;
    });//items/itemadd/itemremove
    addListener(function (event, message) {
      if (message.type === "state") {
        if (message.state) {
          title.state = `<${message.state.replace("你正在", "")}>`;
        } else title.state = `<闲逛中>`;
  
        if (message.desc instanceof Array && message.desc.length > 0) {//状态文本如果有的话就删去
          message.desc = [];
          let event0 = DeepCopy(event);
          event0.data = JSON.stringify(message);
          fn_onmessage.apply(this, [event0]);
          return false;
        }
      } else if (message.type === "combat") {
        if (message.start === 1) {
          title.state = "<战斗中>";
        } else if (message.end === 1) {
          title.state = "<闲逛中>";
        }
      }
      return true;
    });//state/combat
    addListener(function (event, message) {
      if (message.type === "text") {
        if (/重新连线|欢迎登陆/.test(message.text)) {
          message.text += `\n${GM_info.script.name} ${GM_info.script.version}\n`;
          if (GM_info.script.version.includes("test")) {
            message.text += `\n<hiw>当前测试版，如有问题可回退版本。\n</hiw>`;
          }
          if (login === false) {
            login = true;
            SendCommand(["greet master", "pack", "score2", "score"]);//自动请安师傅
            setTimeout(() => $("[command=skills]").click(), 200);
            setTimeout(() => $("[command=tasks]").click(), 400);
            if (!unsafeWindow.WG) {
              setTimeout(() => $("[command=showtool]").click(), 600);
              setTimeout(() => $("[command=showcombat]").click(), 800);
            }
            setTimeout(() => $(".dialog-close").click(), 1000);
          }
          AddContent(message.text);
          return false;
        } else if (/你获得了(.*)点经验，(.*)点潜能/.test(message.text)) {
          let x = message.text.match(/获得了(.*)点经验，(.*)点潜能/);
          content.jy += parseInt(x[1]);
          content.qn += parseInt(x[2]);
          message.text += `<span class="remove_jy">\n共计获得了${content.jy}点经验和${content.qn}点潜能。</span>\n`;
          return AddContent(message.text);
        } else if (/看起来(.*)想杀死你/.test(message.text)) {
          let x = message.text.match(/看起来(.*)想杀死你/);
          message.text = `<hir>${x[1]}开始攻击你！<hir>\n`;
          return AddContent(message.text);
        } else if (/你对著(.*)喝道/.test(message.text)) {
          let x = message.text.match(/你对著(.*)喝道/);
          message.text = `<hir>你开始攻击${x[1]}！<hir>\n`;
          return AddContent(message.text);
        } else if (/你扑向(.*)/.test(message.text)) {
          let x = message.text.match(/你扑向(.*)！/);
          message.text = `<hir>你开始攻击${x[1]}！<hir>\n`;
          return AddContent(message.text);
        } else if (/造成(.*)点/.test(message.text)) {
          let x = message.text.split(/.*造成<wht>|.*造成<hir>|<\/wht>点|<\/hir>点/);
          if (x[2]) {
            let y = x[2].split(/伤害|\(|</);
            if (y[0] === "暴击") {
              message.text = `${y[2]}受到<hir>${x[1]}</hir>点<hir>暴击伤害</hir>！\n`;
            } else {
              message.text = `${y[2]}受到<hiw>${x[1]}</hiw>点伤害！\n`;
            }
            return AddContent(message.text);
          }
        } else if (/只留下一堆玄色石头/.test(message.text) && message.text.includes("你")) {
          let x = message.text.match(/只见(.*)发出一阵白光/);
          message.text = `你分解了${x[1]}！\n`;
          return AddContent(message.text);
        } else if (/爆出一阵炽热的光芒，周身似乎有雷光环绕，连绵不绝！/.test(message.text)) {
          let x = message.text.match(/(.*)的(.*)爆出一阵炽热的光芒/);
          message.text = `${x[1]}精炼了${x[2]}！\n`;
          return AddContent(message.text);
        } else if (/发出一阵耀眼的光芒，看上去似乎变强了！/.test(message.text)) {
          let x = message.text.match(/(.*)的(.*)发出一阵耀眼的光芒/);
          message.text = `${x[1]}精炼了${x[2]}！\n`;
          return AddContent(message.text);
        } else if (/发出一阵璀璨的光芒，看上去似乎更加强大了！/.test(message.text)) {
          let x = message.text.match(/(.*)的(.*)发出一阵璀璨的光芒/);
          message.text = `${x[1]}精炼了${x[2]}！\n`;
          return AddContent(message.text);
        } else if (/你从武道秘籍中领悟到了/.test(message.text)) {
          Beep();//武道书读完的提示音
        } else if (/你身上没有挖矿工具。/.test(message.text)) {
          // SendCommand([]);//小号没有铁镐的情况
        }
      }
      return true;
    });//text
  
    addListener(function (event, message) {
      if (message.type === "text") {
        if (/你轻声吟道/.test(message.text)
          || /你用内力把玄晶炼化，小心翼翼的试图引入/.test(message.text)
          || /你的(.*)等级提升了！/.test(message.text)
        ) return false;
  
        if (/你身上东西太多了|你拿不下那么多东西。/.test(message.text)) {
          AddContent(`<hir>友情提示：请检查是否背包已满！</hir>`);
          Beep();
        }
      }
      return true;
    });//text
  
    addListener(function (event, message) {
      if (message.type === "skills") {
        if (message.items) {//所有技能数据
          role.skill_limit = message.limit;
          role.pot = message.pot;
          role.skill_count = message.items.length;
          role.skills = message.items;
          message.items.forEach(skill => {
            let color = ["/", "wht", "hig", "hic", "hiy", "hiz", "hio", "ord"];
            for (let i = 1; i < color.length; i++) {
              if (skill.name.includes(color[i])) {
                skill.color = i;
                break;
              }
            }
            skills[skill.id] = skill;
          });
        } else if (message.item) {//学会新技能
          let color = ["/", "wht", "hig", "hic", "hiy", "hiz", "hio", "ord"];
          for (let i = 1; i < color.length; i++) {
            if (message.item.name.includes(color[i])) {
              message.item.color = i;//新学的技能也要添加上颜色
              break;
            }
          }
          skills[message.item.id] = message.item;
        } else if (message.enable) {//装备上一个技能
          skills[message.id].enable_skill = message.enable;
        } else if (message.exp) {//单个技能经验变动
          let skill = skills[message.id];
          if (!skill) return true;//防错
          if (message.level) {
            skill.level = message.level;
            AddContent(`<hig>你的技能${skill.name}提升到<hiw>${skill.level}</hiw>级！</hig>\n`);
          }
  
          let limit = role.skill_limit;
          let study_per = parseInt(role.study_per);
          let lianxi_per = parseInt(role.lianxi_per);
          let int = parseInt(role.int);//悟性
          let int_add = parseInt(role.int_add);
          let level = parseInt(skill.level);
          let k = skill.color * 2.5;//系数白2.5/../橙15/红17.5
          let qn = (limit * limit - level * level) * k;
  
          if (title.state.includes("练习技能")) {
            let time = qn / (int + int_add) / (1 + lianxi_per / 100 - int / 100) / (60 / 5);
            let timeStr = time < 60 ? `${parseInt(time)}分钟` : `${parseInt(time / 60)}小时${parseInt(time % 60)}分钟`;
            //练习每一跳的消耗公式＝（先天悟性＋后天悟性）×（1＋练习效率%－先天悟性%）
            let cost = parseInt(qn / time / 12);
            role.lianxi_cost = cost;
            AddContent(`练习${skill.name}消耗了${cost}点潜能。\n`);
  
            $(".remove_lianxi").remove();
            AddContent(
              $(`<span class="remove_lianxi"></span>`).append(
                $(`<hig>悟性: ${int}＋${int_add} 效率: ${lianxi_per}% </hig>`),
                $(`<span class="span-btn"></span>`).append("刷新").click(() => SendCommand(["score2", "score"])),
                $(`<span>\n<span>`)
              )
            );
            let LEVEL = [300, 500, 800, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, limit];
            for (let i = 0; i < LEVEL.length; i++) {
              let l = LEVEL[i];
              if (skill.level < l && l <= limit) {
                let qn = (l * l - level * level) * k;
                let time = qn / (int + int_add) / (1 + lianxi_per / 100 - int / 100) / (60 / 5);
                let timeStr = time < 60 ? `${parseInt(time)}分钟` : `${parseInt(time / 60)}小时${parseInt(time % 60)}分钟`;
                AddContent(`<span class="remove_lianxi">练习到${l}级需要${timeStr}，消耗${qn}潜能。\n</span>`);
                if (l === limit) break;
              }
            }
            // AddContent(`<hic class="remove_lianxi">练习到${limit}级需要${timeStr}并消耗${qn}潜能。\n</hic>`);
            // $(".remove_lxsj").remove();
            // AddContent(`<span class="remove_lxsj">角色\n练习效率: ${lianxi_per}%\n等级上限: ${limit}级\n需要潜能: ${qn}\n需要时间: ${timeStr}\n</span>`);
          } else if (title.state.includes("学习")) {
            //学习每一跳的消耗公式＝（先天悟性＋后天悟性）×（1＋学习效率%－先天悟性%）×3
            let cost = parseInt((int + int_add) * (1 + study_per / 100 - int / 100) * 3);
            role.study_cost = cost;
            AddContent(`学习${skill.name}消耗了${cost}点潜能。\n`);
          }
        }
      }
      return true;
    });//skills
  
    addListener(function (event, message) {
      if (message.type === "items") {
        room.items.forEach(item => {
          if (item.name.includes("程药发")) {
            SendCommand([250, `select ${item.id}`]);
          } else if (item.name.includes("唐楠")) {
            SendCommand([250, `list ${item.id}`, "sell all"]);
          }
        });
      }
      return true;
    });//npc
  
    /*****内力计算*****/
    addListener(function (event, message) {
      if (message.type === "text" && /你的最大内力增加了/.test(message.text)) {
        let x = message.text.match(/你的最大内力增加了(.*)点。/);
        content.nl = parseInt(x[1]);
        let max = role.max_mp;
        let limit = role.limit_mp;
        let t = (limit - max) / (content.nl * 6);//时间/分钟
        let tStr = t < 60 ? `${parseInt(t)}分钟` : `${parseInt(t / 60)}小时${parseInt(t % 60)}分钟`;
        message.text += `\n<hic class="remove_nl">你的最大内力从${max}到${limit}还需${tStr}。\n</hic>`;
        return AddContent(message.text);
      } else if (message.type === "sc" && message.id === id) {
        role.hp = message.hp;
        role.mp = message.mp;
        role.max_hp = message.max_hp;
        role.max_mp = message.max_mp;
      }
      return true;
    });
    /*****侠客岛领悟石壁辅助*****/
    addListener(function (event, message) {
      if (message.type === "text" && /石破天对你说到：你知道(.*)是什么意思吗？/.test(message.text)) {
        let xkx = [//侠客行诗句 救赵挥金槌
          ["赵客缦胡缨", "吴钩霜雪明", "银鞍照白马", "飒沓如流星"],
          ["十步杀一人", "千里不留行", "事了拂衣去", "深藏身与名"],
          ["闲过信陵饮", "脱剑膝前横", "将炙啖朱亥", "持觞劝侯嬴"],
          ["三杯吐然诺", "五岳倒为轻", "眼花耳热后", "意气素霓生"],
          ["救赵挥金槌", "邯郸先震惊", "千秋二壮士", "煊赫大梁城"],
          ["纵死侠骨香", "不惭世上英", "谁能书阁下", "白首太玄经"],
        ];
        let go = ["go east", "go south", "go west", "go north"];
        let x = message.text.match(/石破天对你说到：你知道(.*)是什么意思吗？/);
        for (let i = 0; i < xkx.length; i++) {
          for (let j = 0; j < xkx[i].length; j++) {
            if (xkx[i][j] === x[1]) {
              AddContent(`<hig>检测到诗句<hiw>${x[1]}</hiw>，苏轻将帮你寻找石室。\n</hig>`);
              SendCommand(["stopstate", "go enter", go[j], "lingwu bi"]);
              break;
            }
          }
        }
      }
      if (message.type === "skills" && title.state === "<领悟石壁>") {
        let skill = skills[message.id];
        if (!skill) return;
        let x = skill.name.match(/<wht>基本(.*)<\/wht>/);
        content.lwsb = "是" + x[1];
        if (message.level) {
          AddContent(`<hig>领悟石壁完成，苏轻将帮你寻找石破天。\n</hig>`);
          let go = exits["山洞"];
          let say = `say ${content.lwsb}`;
          SendCommand(["stopstate", go, "go out", say, "cr"]);
          setTimeout(() => Beep(), 1000);//提示音
        }
        AddContent(`由于领悟石壁，你的技能${skill.name}提升到了<hig>${message.exp}%</hig>！\n`);
        if (message.exp < 90) {
          $(".remove_exp_90").remove();
          AddContent(`<hir class="remove_exp_90">建议将技能熟练度练习到90%以上再继续领悟石壁！\n</hir>`);
        }
      }
  
      return true;
    });
  
  
  
  
    // AddListener("items", function(event, message) {
    //     wsmud.items.forEach(item => {
    //         if (item.name === "当铺老板 唐楠") {
    //             SendCommand("sell all");
    //             SendCommand("list " + item.id);
    //         } else if (/店小二|杂货铺老板 杨永福|铁匠铺老板 铁匠|药铺老板 平一指/.test(item.name)) {
    //             SendCommand("list " + item.id);
    //         } else if (item.name === wsmud.settings.auto_sm_npc && wsmud.settings.auto_sm) {
    //             wsmud.auto_sm_cmd = "task sm " + item.id;
    //             SendCommand(wsmud.auto_sm_cmd);
    //         }
    //     });
    //     return true;
    // });
    // AddListener("list", function(event, message) {
    //     if (message.seller && message.selllist) {
    //         message.selllist.forEach(item => {
    //             if (item.name === wsmud.settings.auto_sm_item) {
    //                 SendCommand("buy 1 " + item.id + " from " + message.seller);
    //                 setTimeout(() => SendCommand(AutoSM), 3000);
    //             }
    //         });
    //     }
    //     return true;
    // });
  
    // AddListener("die", function(event, message) {
    //     if (!message.relive) {
    //         AddContent(`<hiw>若不点击原地复活，则 10 秒后自动武庙复活。</hiw>\n`);
    //         let timer = setTimeout(() => SendCommand("relive"), 10000);
    //         AddContent(
    //             $(`<div class="item-commands" timer="${timer}"><span cmd="relive locale">原地复活</span></div>`)
    //             .click(function() {
    //                 let timer = $(this).attr("timer");
    //                 clearTimeout(timer);
    //             })
    //         );
    //     }
    //     return true;
    // });
  
    // AddListener("text", function(event, message) {
    //     if (/最近师门物资紧缺|为师最近练功到了瓶颈|最近师门扩招了|你去帮我找/.test(message.text)) {
    //         SendCommand(wsmud.auto_sm_cmd);
    //     } else if (/你要是找不到/.test(message.text)) {
    //         let x = message.text.match(/我要的是(.*)，你要是找不到就换别的吧。/);
    //         wsmud.settings.auto_sm_item = x[1];
    //         console.log(x[1]);
    //     } else if (/不错，孺子可教！/.test(message.text)) {
    //         wsmud.settings.auto_sm_item = "师门完成";
    //         setTimeout(() => SendCommand(AutoSM), 2000);
    //     } else if (/辛苦了， 你先去休息一下吧/.test(message.text)) {
    //         wsmud.settings.auto_sm = false;
    //         SendCommand("tasks");
    //     }
    //     return true;
    // });
    // {type: "cmds",
    // items: [{cmd: "cr cd/wudu/damen", name: "进入副本"},
    // {cmd: "cr cd/wudu/damen 0 1", name: "扫荡一次"},
    // {cmd: "cr cd/wudu/damen 0 10", name: "扫荡十次"}]}
    // AddListener("cmds", function(event, message) {
    //     if (message.items) {
    //         message.items.forEach(item => {
    //             if (item.name.includes(wsmud.settings.auto_sm_item)) {
    //                 SendCommand(item.cmd);
    //                 return true;
    //             }
    //         });
    //         let cmd = AutoBuy(wsmud.settings.auto_sm_item);
    //         SendCommand(cmd);
    //     }
    //     return true;
    // });
    // AddListener("text", function(event, message) {
    //     } else  else if (/无数花瓣夹杂着寒气/.test(text)) {
    //         let x = text.match(/无数花瓣夹杂着寒气将(.*)围起/);
    //         AddContent(`<him>太上忘情 => ${x[1]}</him>\n`);
    // });
  
  
    addListener(function (event, message) {//type=msg
      if (message.type === "msg" && !isMoblie) {//判断是否移动端
        let uid = message.uid;
        let txt = message.content;
        let name = message.name ? message.name + "：" : "";
  
        let time = `<hik class="timeStr" ${showTimeStr ? "" : 'style="display:none"'}> ${Time2Str()}</hik>`;
        let look3 = function () {
          SendCommand(`look3 ${$(this).attr("uid")}`);
        };
        if (message.ch === "chat") {
          let levels = ["<hic>闲聊</hic>", "<hic>闲聊</hic>", "<hic>闲聊</hic>", "<hiy>宗师</hiy>", "<hiz>武圣</hiz>", "<hio>武帝</hio>", "<hir>武神</hir>"];
          $(".chat").append($(`<hic uid="${uid}">【${levels[message.lv]}】${name}${txt}${time}<br></hic>`).click(look3));
        } else if (message.ch === "fam") {
          $(".fam").append($(`<hiy uid="${uid}">【${message.fam}】${name}${txt}${time}<br></hiy>`).click(look3));
        } else if (message.ch === "pty") {
          $(".pty").append($(`<hiz uid="${uid}">【帮派】${name}${txt}${time}<br></hiz>`).click(look3));
        } else if (message.ch === "tm") {
          $(".tm").append(`<hig>【队伍】${name}${txt}${time}<br></hig>`);
        } else if (message.ch === "es") {
          $(".es").append(`<hio>【${message.server}】${name}${txt}${time}<br></hio>`);
        } else if (message.ch === "rumor") {//谣言
          if (/闭关修炼/.test(txt)) {
            let x = txt.match(/武帝(.*)闭关修炼似有所悟，你随之受益获得了(.*)经验，(.*)潜能/);
            $(".rumor").append(`<him>【谣言】武帝<hio>${x[1]}</hio>出关奖励<hio>${x[2]}</hio>点。</him><br>`);
          } else if (/战胜了/.test(txt)) {
            let x = txt.match(/听说(.*)战胜了(.*)获得了(.*)称号！/);
            $(".rumor").append("<him>【谣言】" + x[1] + "获得了" + x[3] + "称号！</him><br>");
          } else if (/郭大侠收到线报/.test(txt)) {
            $(".rumor").append("<him>【谣言】蒙古大军将会进攻襄阳！" + time + "</him><br>");
          } else if (/出现在/.test(txt)) {
            let x = txt.match(/听说(.*)出现在(.*)-(.*)一带。/);
            $(".rumor").append(`<him>【谣言】<hio>${x[1]}</hio>出现在${x[2]}${x[3]}！${time}</him><br>`);
          } else {
            $(".rumor").append(`<him>【谣言】${txt}</him><br>`);
          }
        } else if (message.ch === "sys") {//系统
          if (/欢迎登录|非法收益/.test(txt)) return true;
          else if (/挖矿技巧/.test(txt)) txt = txt.match(/(.*)捡到一本挖矿指南/)[1] + "使用了挖矿指南！";
          else if (/，望各路英雄鼎力相助/.test(txt)) txt = txt.replace("，望各路英雄鼎力相助", "");
          else if (/蒙古大军挥军南下/.test(txt)) txt = txt.replace("蒙古大军挥军南下，", "");
          else if (/蒙古大汗蒙哥出现在战场中央/.test(txt)) txt = "蒙古大汗蒙哥出现在战场中央！";
          else if (/蒙古可汗蒙哥被击杀于襄阳城下/.test(txt)) txt = txt.replace("蒙古可汗蒙哥被击杀于襄阳城下，", "");
          $(".sys").append(`<hir>【系统】${txt}${time}</hir><br>`);
          AutoScroll(".sys");
        }
        AutoScroll("." + message.ch);
        $(".channel pre").html("");
      }
      return true;
    });
    addListener(function (event, message) {//type=tasks
      if (message.type === "tasks" && message.items) {
        let fb, qa, wd1, wd2, wd3, sm1, sm2, ym1, ym2, yb1, yb2;
        message.items.forEach(task => {
          if (task.state === 2) SendCommand(`taskover ${task.id}`);//自动完成
          if (task.id === "signin") {
            // let a = task.desc.match(/师门任务：(.*)，副本：<(.*)>(.*)\/20<(.*)>/);
            // let b = task.desc.match(/(.*)武道塔(.*)，进度(.*)\/(.*)<(.*)>，<(.*)>(.*)首席请安<(.*)>/);
            // (parseInt(a[3]) < 20) ? fb = `<hig>${a[3]}</hig>` : fb = a[3];
            // (parseInt(b[3]) < parseInt(b[4])) ? wd1 = `<hig>${b[3]}</hig>` : wd1 = b[3];
            // wd2 = b[4];
            // /可以重置/.test(b[2]) ? wd3 = "<hig>可以重置</hig>" : wd3 = "已经重置";
            // /已经/.test(b[7]) ? qa = "已经请安" : qa = "<hig>尚未请安</hig>";
            const a = task.desc.match(/副本：<...>(\d+)\/20<....>/);
            if (a) {
              fb = parseInt(a[1]) < 20 ? `<hig>${a[1]}</hig>` : a[1];
            }
  
            const b = task.desc.match(/武道塔(.+)，进度(\d+)\/(\d+)<....>/);
            if (b) {
              wd1 = b[2];
              wd2 = b[3];
              if (wd1 < wd2) wd1 = `<hig>${wd1}</hig>`;
              /可以重置/.test(b[1]) ? wd3 = "<hig>可以重置</hig>" : wd3 = "已经重置";
            }
  
            const c = task.desc.match(/<.+?>(.+)首席请安<.+?>/);
            if (c) {
              /已经/.test(c[1]) ? qa = "已经请安" : qa = "<hig>尚未请安</hig>";
            }
          } else if (task.id === "sm") {
            let a = task.desc.match(/目前完成(.*)\/20个，共连续完成(.*)个。/);
            (parseInt(a[1]) < 20) ? sm1 = `<hig>${a[1]}</hig>` : sm1 = a[1];
            sm2 = a[2];
          } else if (task.id === "yamen") {
            let a = task.desc.match(/目前完成(.*)\/20个，共连续完成(.*)个。/);
            (parseInt(a[1]) < 20) ? ym1 = `<hig>${a[1]}</hig>` : ym1 = a[1];
            ym2 = a[2];
          } else if (task.id === "yunbiao") {
            let a = task.desc.match(/本周完成(.*)\/20个，共连续完成(.*)个。/);
            (parseInt(a[1]) < 20) ? yb1 = `<hig>${a[1]}</hig>` : yb1 = a[1];
            yb2 = a[2];
          }
        });
        let html = `门派请安 => ${qa}\n武道之塔 => ${wd1}/${wd2} ${wd3}\n`;
        html += `日常副本 => ${fb}/20\n师门任务 => ${sm1}/20 ${sm2}连\n`;
        html += `衙门追捕 => ${ym1}/20 ${ym2}连\n每周运镖 => ${yb1}/20 ${yb2}连\n`;
        content.task = `<span class="remove_task">${html}<span>`;
        AddContent(content.task);
      }
      return true;
    });
  
    addListener(function (event, message) {//type=score
      if (message.type === "score") {
        for (const key in message) role[key] = message[key];
      }
      return true;
    });
  
  
  
  
  
    let pack = new Proxy({ items: [], eqs: [], max: 0, moneyStr: "", }, {
      set: function (pack, key, value) {
        if (key === "moneyStr") $(".role_money").html(value);
        pack[key] = value;
        return true;
      },
      get: function (pack, key) {
        return pack[key];
      }
    });
  
    let ITEMS = [
      "师门补给包", "背包扩充石", "小箱子", "随从礼包",
      "神魂碎片", "武道</hio>", "武道残页", "元晶", "帝魄碎片", "ord", "hir",
      "玄晶", "养精丹</hig>", "养精丹", "培元丹", "玫瑰花",
      "扫荡符", "天师符", "叛师符", "洗髓丹", "<hig>喜宴", "<hic>喜宴", "<hiy>喜宴",
      "师门令牌</hig>", "师门令牌</hic>", "师门令牌</hiy>", "师门令牌</HIZ>", "师门令牌</hio>",//师门令牌排序
      "碎裂的红宝石", "碎裂的绿宝石", "碎裂的蓝宝石", "碎裂的黄宝石",//宝石排序
      "红宝石</hic>", "绿宝石</hic>", "蓝宝石</hic>", "黄宝石</hic>",
      "精致的红宝石", "精致的绿宝石", "精致的蓝宝石", "精致的黄宝石",
      "完美的红宝石", "完美的绿宝石", "完美的蓝宝石", "完美的黄宝石",
      "聚气丹</hig>", "聚气丹</hic>", "聚气丹</hiy>", "聚气丹</HIZ>", "聚气丹</hio>",//聚气丹排序
      "突破丹</hig>", "突破丹</hic>", "突破丹</hiy>", "突破丹</hiz>", "突破丹</hio>",//突破丹排序
      "残页</hio>", "残页</HIZ>", "残页</hiy>", "残页</hic>", "残页</hig>",//残页排序
      "鲤鱼", "草鱼", "鲢鱼", "鲮鱼", "鳊鱼", "鲂鱼", "黄金鳉", "黄颡鱼", "太湖银鱼", "虹鳟", "孔雀鱼", "反天刀",//鱼排序
      "银龙鱼", "黑龙鱼", "罗汉鱼", "巨骨舌鱼", "七星刀鱼", "帝王老虎魟",
      "当归", "芦荟", "山楂叶", "柴胡", "金银花", "石楠叶", "茯苓", "沉香", "熟地黄", "九香虫", "络石藤", "冬虫夏草",//药材排序
      "人参", "何首乌", "凌霄花", "灵芝", "天仙藤", "盘龙参",
      "秘籍</wht>", "秘籍",
      "四十二章经一", "四十二章经二", "四十二章经三", "四十二章经四", "四十二章经五", "四十二章经六", "四十二章经七", "四十二章经八",
    ];
  
    addListener(function (event, message) {
      function autoUse(item) {
        if (/养精丹|朱果|潜灵果|背包扩充石|随从礼包/.test(item.name)) {
          let cmd = ["stopstate"];
          let count = item.count;
          let zl = "use";
          if (/<hig>养精丹<\/hig>/.test(item.name)) count = count > 10 ? 10 : count;
          if (/小箱子|师门补给包|随从礼包/.test(item.name)) zl = "open";
          for (let i = 0; i < count; i++) {
            cmd.push(zl + " " + item.id);
            cmd.push(250);
          }
          AddContent(
            $(`<span class="span-btn">使用 ${item.name} ${count}次</span>`).click(() => SendCommand(cmd)),
          );
          AddContent(`\n`);
        }
      }
      if (message.type === "pack") {
        if (message.money) pack.moneyStr = Money2Str(message.money);
        if (message.max_item_count) pack.max = message.max_item_count;
        if (message.eqs) pack.eqs = message.eqs;
        if (message.remove) {//失去物品
          let id = message.id;
          let item = pack.items.find(item => {
            return item.id === id;
          });
          if (item) item.count -= message.remove;
        }
        if (!isMoblie && message.name && !message.name.includes("<wht>")) {//获得物品
          let id = message.id;
          let add = 0;
          let count = message.count;
          let item = pack.items.find(item => {
            return item.id === id;
          });
          if (item) {
            if (pack[id]) {
              add = count - item.count + pack[id];
              item.count = count;
              pack[id] = add;
            } else add = count - item.count;
          } else {
            add = count;
            pack[id] = add;
            pack.items.push(message);
          }
          let str = `共有${count}${message.unit}`;
          if (message.can_eq === 1) str = "";
          $(`.remove_${message.id}`).remove();
          $(".content-pickup").append(
            $(`<div class="remove_${message.id} pickup-row"></div>`).append(
              $(`<span class="pickup-add"></span>`).append(`获得${add}${message.unit}${message.name}`),
              $(`<span class="pickup-count"></span>`).append(str),
            )
          );
          AutoScroll(".content-pickup");
          autoUse(message);
        }
        if (message.items) {
          pack.items = [];
          ITEMS.forEach(name => {
            for (let i = 0; i < message.items.length; i++) {
              let item = message.items[i];
              if (item !== 0 && item.name.includes(name)) {
                pack.items.push(message.items[i]);
                message.items[i] = 0;
              }
            }
          });
          message.items.forEach(item => {
            if (item !== 0) pack.items.push(item);
          });
          pack.items.forEach(item => autoUse(item));
          message.items = pack.items;
          message.type = "dialog";
          let event0 = DeepCopy(event);
          event0.data = JSON.stringify(message);
          fn_onmessage.apply(this, [event0]);
          return false;
        }
      }
      return true;
    });//pack
  
  
  
  
  
    //苏轻自用监控
    addListener(function (event, message) {
      if (message.type === "text" && /你说：zibao/.test(message.text)) {
        AddContent(`<hir>开启自爆监控！</hir>`);
        let zibao = 0;
        zibao = addListener(function (event, message) {
          if (message.type === "die" && !message.relive) {
            SendCommand(["relive", 2000, "jh fam 3 start", "go westup", "go north", "go north", "say zbkill"]);
          }
          if (message.type === "text" && /你说：zbkill/.test(message.text)) {
            room.items.forEach(item => {
              SendCommand("kill " + item.id);
            });
          }
          if (message.type === "text" && /你说：stop/.test(message.text)) {
            removeListener(zibao);
            AddContent(`<hir>关闭自爆监控！</hir>`);
          }
        });
      }
      return true;
    });
  
  
    addListener(function (event, message) {
      if (message.type === "text" && /xy/.test(message.text)) {
        AddContent(`<hir>开启襄阳监控！</hir>`);
        let xy = addListener(function (event, message) {
          if (message.type === "itemadd") {
            room.items.forEach(item => {
              if (/夫长/.test(item.name)) {
                SendCommand("kill " + item.id);
              }
            });
          }
        });
      }
    });
    // AddListener("pack", function(event, message) {
    //     if (!funny.isMoblie) {
    //         if (message.name) {
    //             let name = message.name;
    //             if (name.includes("wht")) return true;
  
    //             let pick = wsmud.pack.pick;
    //             let count = message.count;
    //             if (pick[name]) {
    //                 if (pick[name].count < count) {
    //                     pick[name].add += (count - pick[name].count);
    //                     pick[name].count = count;
    //                 } else {
    //                     pick[name].count += count;
    //                     pick[name].add += count;
    //                 }
    //             } else {
    //                 let array = wsmud.pack.items;
    //                 let sum = 0;
    //                 for (let i = 0; i < array.length; i++) {
    //                     let item = array[i];
    //                     if (item.name === name) {
    //                         sum += item.count;
    //                     }
    //                 }
    //                 if (sum < count) {
    //                     pick[name] = {count: count, add: count - sum};
    //                 } else {
    //                     pick[name] = {count: sum + count, add: count};
    //                 }
    //             }
  
    //             let nameStr = message.name.replace(/<|>|\//g, "");
    //             let remove = "remove_pick_" + nameStr;
    //             let html = `${message.name} => 累计获得${pick[name].add}${message.unit} => 共有${pick[name].count}${message.unit}`;
    //             $("." + remove).remove();
    //             $(".channel-pick").append(`<span class="${remove}">${html}<br></span>`);
    //             AutoScroll(".channel-pick");
    //         }
    //     }
    //     return true;
    // });
    // AddListener("pack", function(event, message) {
    //     if (typeof message.eq === "number") {
    //         let index = message.eq;
    //         let itemIndex = wsmud.pack.items.findIndex(item => {
    //             return item.id === message.id;
    //         });
    //         let eq = DeepCopy(wsmud.pack.items[itemIndex]);
    //         wsmud.pack.eqs[index] = eq;
    //         wsmud.pack.items.splice(itemIndex, 1);
    //     }
    //     if (typeof message.uneq === "number") {
    //         let index = message.uneq;
    //         let item = DeepCopy(wsmud.pack.eqs[index]);
    //         item.count = 1;
    //         wsmud.pack.items.push(item);
    //         wsmud.pack.eqs[index] = null;
    //     }
    //     RefreshPack();
    //     RefreshEq();
    //     return true;
    // });
  
    // {type: "dialog", dialog: "pack", id: "c7mj3f552d3", eq: 3}
  
    let WD = {
      "道童": ["jh fam 1 start"],
      "谷虚道长": ["jh fam 1 start", "go north"],
      "宋远桥": ["jh fam 1 start", "go north"],
      "张三丰": ["jh fam 1 start", "go west", "go northup", "go north", "go west", "go northup", "go northup", "go northup", "go north", "go north", "go north", "go north", "go north", "go north"],
      "首席": ["jh fam 1 start", "go west", "go northup"],
      "门派后勤管理员": ["jh fam 1 start", "go west"]
    };
    let SL = {
      "清乐比丘": ["jh fam 2 start"],
      "道觉禅师": ["jh fam 2 start", "go north", "go north"],
      "慧合尊者": ["jh fam 2 start", "go north", "go north", "go northeast", "go northwest", "go north", "go west"],
      "澄净": ["jh fam 2 start", "go north", "go north", "go northeast", "go northwest", "go north", "go east"],
      "玄难": ["jh fam 2 start", "go north", "go north", "go northeast", "go northwest", "go north", "go north"],
      "首席": ["jh fam 2 start", "go north", "go north", "go northeast", "go northwest", "go north"],
      "门派后勤管理员": ["jh fam 2 start", "go north"]
    };
    let HS = {
      "高根明": ["jh fam 3 start"],
      "岳不群": ["jh fam 3 start", "go westup", "go north", "go north"],
      "封不平": ["jh fam 3 start", "go eastup", "go southup", "jumpdown", "go southup", "go south", "go east"],
      "风清扬": ["jh fam 3 start", "go westup", "go south", "go southup", "go southup", "break bi", "go enter", "go westup", "go westup"],
      "首席": ["jh fam 3 start", "go westup", "go north"],
      "门派后勤管理员": ["jh fam 3 start", "go westup", "go north"]
    };
    let EM = {
      "苏梦清": ["jh fam 4 start", "go west"],
      "静心": ["jh fam 4 start", "go west", "go south", "go south"],
      "周芷若": ["jh fam 4 start", "go west", "go south", "go west", "go north", "go north"],
      "灭绝": ["jh fam 4 start", "go west", "go south", "go west", "go south", "go south"],
      "首席": ["jh fam 4 start", "go west", "go south"],
      "门派后勤管理员": ["jh fam 4 start", "go west", "go south", "go west"]
    };
    let XY = {
      "薛慕华": ["jh fam 5 start", "go north", "go north"],
      "苏星河": ["jh fam 5 start"],
      "逍遥子": ["jh fam 5 start", "go down", "go down"],
      "首席": ["jh fam 5 start", "go west"],
      "门派后勤管理员": ["jh fam 5 start", "go east"]
    };
    let GB = {
      "左全": ["jh fam 6 start", "go down"],
      "门派后勤管理员": ["jh fam 6 start", "go down", "go east", "go east"],
      "首席": ["jh fam 6 start", "go down", "go east", "go east", "go east"],
      "简长老": ["jh fam 6 start", "go down", "go east", "go east", "go east", "go up"],
      "鲁有脚": ["jh fam 6 start", "go down", "go east", "go east", "go east", "go east", "go east"],
      "洪七公": ["jh fam 6 start", "go down", "go east", "go east", "go east", "go east", "go east", "go up"],
    };
    let SS = {
      "何小二": ["jh fam 7 start", "go north"],
      "门派后勤管理员": ["jh fam 7 start", "go north", "go up", "go up", "go east"],
      "李四": ["jh fam 7 start", "go north", "go up", "go up", "go up", "go up"],
      "首席": ["jh fam 7 start", "go north", "go up", "go up", "go up", "go up", "go east"],
      "雾中楼": ["jh fam 7 start", "go north", "go up", "go up", "go up", "go up", "go up", "go up", "go west"],
    };
  
    let YZC = {
      "修炼": ["stopstate", "jh fam 0 start", "go west", "go west", "go north", "go enter", "go west", "xiulian"],
      "打坐": ["stopstate", "jh fam 0 start", "go west", "go west", "go north", "go enter", "go west", "dazuo"],
      "疗伤": ["stopstate", "jh fam 0 start", "go north", "go north", "go west", "liaoshang", "dazuo"],
      "当铺": ["jh fam 0 start", "go south", "go east"],
      "衙门": ["jh fam 0 start", "go west", "go north", "go north"]
    };
    let XYC = {
      "襄阳城": ["jh fam 8 start"],
      "东城门": ["jh fam 8 start", "go east", "go east", "go east", "go east"],
      "南城门": ["jh fam 8 start", "go south", "go south", "go south", "go south"],
      "西城门": ["jh fam 8 start", "go west", "go west", "go west", "go west"],
      "北城门": ["jh fam 8 start", "go north", "go north", "go north", "go north"]
    };
    let QT = {
      "帮派练功房": ["jh fam 0 start", "go south", "go south", "go east", "go east", "go east", "go north"],
      "帮派炼丹室": ["jh fam 0 start", "go south", "go south", "go east", "go east", "go east", "go south"],
      "武道塔": ["jh fam 9 start", "go enter"],
    };
  
  
  
    /********************READY********************/
    $(document).ready(function () {
      GM_addStyle(`.content-bottom {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }`);
      GM_addStyle(`
        .span-btn { border: gray solid 1px; border-radius: 3px; display: inline-block; padding: 5px; font-size: 14px; margin: 0 5px 5px 0; }
        .span-btn { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; cursor: pointer; }
        .span-btn:hover { color: #00ff00; }
        .span-btn:active { transform: translateY(1px); }
        `);
      if (isMoblie) return;
      $(".signinfo").addClass("hide");
      $(".room_items")[0].style.maxHeight = "240px";
      $(".state-bar")[0].style.overflow = "hidden";
      $(".combat-commands")[0].style.overflow = "hidden";
      $(".dialog-content")[0].style.overflowX = "hidden";
      GM_addStyle(".channel{ display: none; }");
      GM_addStyle(".room-item > .item-name { margin-left: 14px; }");
  
      // GM_addStyle(`
      // .left-nav { flex: 0 0 auto; text-align: center; }
  
      // .left-role { flex: 0 0 auto; }
  
      // .left-skill { flex: 1 0 auto; height: auto; display: flex; flex-flow: column nowrap; }
      //     .left-skill-list { height: 480px; flex: 1 1 auto; line-height: 24px; padding: 10px 5px 0 5px; overflow: auto; border: gray solid 1px; }
      //         .skill-line { display: flex; padding: 2px 0 2px 0; border-top: #343434 solid 1px; }
      //         .skill-line-name { flex: 1 0 auto; }
      //         .skill-line-level { flex: 0 0 auto; }
      //     .left-eq { height: 245px; flex: 0 0 auto; display: flex; flex-flow: row nowrap; margin: 10px 0 10px 0; }
      //         .left-eq-list { width: 250px; flex: 0 0 auto; border: gray solid 1px; }
      //         .left-eq-change { width: 100px; flex: 1 1 auto; border: gray solid 1px; display: flex; flex-flow: column nowrap; margin-left: 10px; }
      //         .left-eq-change div { flex: 1 1 auto; text-align: center; padding-left: 5px; }
      // .left-pack { flex: 1 0 auto; height: 500px; overflow: auto; }
      //     .left-skill-list { height: 480px; flex: 1 1 auto; line-height: 24px; padding: 10px 5px 0 5px; overflow: auto; }
      //         .pack-line { display: flex; padding: 2px 0 2px 0; border-top: #343434 solid 1px; }
      //         .pack-line-name { flex: 1 0 auto; }
      //         .pack-line-count { flex: 0 0 auto; }
  
      // .left-hotkey { flex: 1 0 auto; height: 500px; display: flex; flex-flow: column nowrap; }
      //     .list-commands { flex: 0 1 auto; height: 1000px; border: gray solid 1px; padding-left: 5px; }
  
      //     .left-send { flex: 0 0 auto; height: auto; display: flex; }
  
  
      // .left-setting { }
  
      // .left table { table-layout: fixed; border-collapse: collapse; margin: 0; }
      // .left td { width: 88px; text-align: center; white-space: nowrap; border: #343434 solid 1px; }
  
  
      // `);
  
  
      /********************FN********************/
      let changeLeftRight = function () {
        let layout_left = true;
        return function () {
          $(".left")[0].style.order = layout_left ? "1" : "-1";
          $(".right")[0].style.order = layout_left ? "-1" : "1";
          layout_left = !layout_left;
        }
      }();
      let hideLeftRight = function () {
        AddContent($("<div></div>").append(
          $(`<span class="span-btn"></span>`).append("隐藏功能边栏").click(() => $(".left").hide()),
          $(`<span class="span-btn"></span>`).append("显示功能边栏").click(() => $(".left").show()),
          $(`<br>`),
          $(`<span class="span-btn"></span>`).append("隐藏聊天边栏").click(() => $(".right").hide()),
          $(`<span class="span-btn"></span>`).append("显示聊天边栏").click(() => $(".right").show()),
        ));
      };
      let clearRightMsg = function () {
        AddContent($("<div></div>").append(
          $(`<span class="span-btn"></span>`).append("世界清屏").click(() => $(".chat").html("")),
          $(`<span class="span-btn"></span>`).append("队伍清屏").click(() => $(".tm").html("")),
          $(`<span class="span-btn"></span>`).append("门派清屏").click(() => $(".fam").html("")),
          $(`<br>`),
          $(`<span class="span-btn"></span>`).append("全区清屏").click(() => $(".es").html("")),
          $(`<span class="span-btn"></span>`).append("帮派清屏").click(() => $(".pty").html("")),
          $(`<span class="span-btn"></span>`).append("系统清屏").click(() => $(".sys").html("")),
          $(`<br>`),
          $(`<span class="span-btn"></span>`).append("统计清屏").click(() => $(".content-pickup").html("")),
          $(`<span class="span-btn"></span>`).append("游戏清屏").click(() => $(".content-message pre").html("")),
          $(`<span class="span-btn"></span>`).append("<hik>显示时间戳</hik>").click(() => {
            showTimeStr = !showTimeStr;
            $(".timeStr").toggle();
          }),
        ));
      };
      let keepOnline = function () {
        AddContent($("<div></div>").append(
          $(`<hic>有掉线情况的可以试着用一下，否则不需要使用此功能。\n</hic>`),
          $(`<span class="span-btn"></span>`).append("自动队伍频道喊话防掉线").click(function () {
            AddContent(`<hir>防掉线已开启！\n</hir>`);
            setInterval(() => SendCommand(`tm ${Time2Str()}`), 30000);
            $(this).remove();
          })
        ));
      };
      let toSchoolWD = function () {
        AddContent($("<div></div>").append(
          $(`<span class="span-btn"></span>`).append("张三丰").click(() => SendCommand(WD["张三丰"])),
          $(`<span class="span-btn"></span>`).append("宋远桥").click(() => SendCommand(WD["宋远桥"])),
          $(`<span class="span-btn"></span>`).append("谷虚道长").click(() => SendCommand(WD["谷虚道长"])),
          $(`<span class="span-btn"></span>`).append("道童").click(() => SendCommand(WD["道童"])),
          $(`<br>`),
          $(`<span class="span-btn"></span>`).append("首席").click(() => SendCommand(WD["首席"])),
          $(`<span class="span-btn"></span>`).append("门派后勤管理员").click(() => SendCommand(WD["门派后勤管理员"]))
        ));
      };
      let toSchoolSL = function () {
        AddContent($("<div></div>").append(
          $(`<span class="span-btn"></span>`).append("玄难").click(() => SendCommand(SL["玄难"])),
          $(`<span class="span-btn"></span>`).append("澄净").click(() => SendCommand(SL["澄净"])),
          $(`<span class="span-btn"></span>`).append("慧合尊者").click(() => SendCommand(SL["慧合尊者"])),
          $(`<span class="span-btn"></span>`).append("道觉禅师").click(() => SendCommand(SL["道觉禅师"])),
          $(`<span class="span-btn"></span>`).append("清乐比丘").click(() => SendCommand(SL["清乐比丘"])),
          $(`<br>`),
          $(`<span class="span-btn"></span>`).append("首席").click(() => SendCommand(SL["首席"])),
          $(`<span class="span-btn"></span>`).append("门派后勤管理员").click(() => SendCommand(SL["门派后勤管理员"]))
        ));
      };
      let toSchoolHS = function () {
        AddContent($("<div></div>").append(
          $(`<span class="span-btn"></span>`).append("岳不群").click(() => SendCommand(HS["岳不群"])),
          $(`<span class="span-btn"></span>`).append("封不平").click(() => SendCommand(HS["封不平"])),
          $(`<span class="span-btn"></span>`).append("风清扬").click(() => SendCommand(HS["风清扬"])),
          $(`<span class="span-btn"></span>`).append("高根明").click(() => SendCommand(HS["高根明"])),
          $(`<br>`),
          $(`<span class="span-btn"></span>`).append("首席").click(() => SendCommand(HS["首席"])),
          $(`<span class="span-btn"></span>`).append("门派后勤管理员").click(() => SendCommand(HS["门派后勤管理员"]))
        ));
      };
      let toSchoolEM = function () {
        AddContent($("<div></div>").append(
          $(`<span class="span-btn"></span>`).append("灭绝").click(() => SendCommand(EM["灭绝"])),
          $(`<span class="span-btn"></span>`).append("周芷若").click(() => SendCommand(EM["周芷若"])),
          $(`<span class="span-btn"></span>`).append("静心").click(() => SendCommand(EM["静心"])),
          $(`<span class="span-btn"></span>`).append("苏梦清").click(() => SendCommand(EM["苏梦清"])),
          $(`<br>`),
          $(`<span class="span-btn"></span>`).append("首席").click(() => SendCommand(EM["首席"])),
          $(`<span class="span-btn"></span>`).append("门派后勤管理员").click(() => SendCommand(EM["门派后勤管理员"]))
        ));
      };
      let toSchoolXY = function () {
        AddContent($("<div></div>").append(
          $(`<span class="span-btn"></span>`).append("逍遥子").click(() => SendCommand(XY["逍遥子"])),
          $(`<span class="span-btn"></span>`).append("苏星河").click(() => SendCommand(XY["苏星河"])),
          $(`<span class="span-btn"></span>`).append("薛慕华").click(() => SendCommand(XY["薛慕华"])),
          $(`<br>`),
          $(`<span class="span-btn"></span>`).append("首席").click(() => SendCommand(XY["首席"])),
          $(`<span class="span-btn"></span>`).append("门派后勤管理员").click(() => SendCommand(XY["门派后勤管理员"]))
        ));
      };
      let toSchoolGB = function () {
        AddContent($("<div></div>").append(
          $(`<span class="span-btn"></span>`).append("洪七公").click(() => SendCommand(GB["洪七公"])),
          $(`<span class="span-btn"></span>`).append("鲁有脚").click(() => SendCommand(GB["鲁有脚"])),
          $(`<span class="span-btn"></span>`).append("简长老").click(() => SendCommand(GB["简长老"])),
          $(`<span class="span-btn"></span>`).append("左全").click(() => SendCommand(GB["左全"])),
          $(`<br>`),
          $(`<span class="span-btn"></span>`).append("首席").click(() => SendCommand(GB["首席"])),
          $(`<span class="span-btn"></span>`).append("门派后勤管理员").click(() => SendCommand(GB["门派后勤管理员"]))
        ));
      };
      let toSchoolSS = function () {
        AddContent($("<div></div>").append(
          $(`<span class="span-btn"></span>`).append("雾中楼").click(() => SendCommand(SS["雾中楼"])),
          $(`<span class="span-btn"></span>`).append("李四").click(() => SendCommand(SS["李四"])),
          $(`<span class="span-btn"></span>`).append("何小二").click(() => SendCommand(SS["何小二"])),
          $(`<br>`),
          $(`<span class="span-btn"></span>`).append("首席").click(() => SendCommand(SS["首席"])),
          $(`<span class="span-btn"></span>`).append("门派后勤管理员").click(() => SendCommand(SS["门派后勤管理员"]))
        ));
      };
      let toQiTa = function () {
        AddContent($("<div></div>").append(
          $(`<span class="span-btn"></span>`).append("武道塔").click(() => SendCommand(QT["武道塔"])),
          $(`<br>`),
          $(`<span class="span-btn"></span>`).append("襄阳城").click(() => SendCommand(XYC["襄阳城"])),
          $(`<span class="span-btn"></span>`).append("东城门").click(() => SendCommand(XYC["东城门"])),
          $(`<span class="span-btn"></span>`).append("南城门").click(() => SendCommand(XYC["南城门"])),
          $(`<span class="span-btn"></span>`).append("西城门").click(() => SendCommand(XYC["西城门"])),
          $(`<span class="span-btn"></span>`).append("北城门").click(() => SendCommand(XYC["北城门"])),
          $(`<br>`),
          $(`<span class="span-btn"></span>`).append("帮派练功房").click(() => SendCommand(QT["帮派练功房"])),
          $(`<span class="span-btn"></span>`).append("帮派炼丹室").click(() => SendCommand(QT["帮派炼丹室"])),
          $(`<br>`),
          $(`<span class="span-btn"></span>`).append("小树林快速进退20次").click(() => xsl20()),
        ));
      };
  
  
      let toQingAn = function () {
        let schoolNames = ["无门无派", "武当派", "少林派", "华山派", "峨眉派", "逍遥派", "丐帮", "杀手楼"];
        let goTo = [0, WD["首席"], SL["首席"], HS["首席"], EM["首席"], XY["首席"], GB["首席"], SS["首席"]];
        let index = schoolNames.findIndex(schoolName => {
          return schoolName === role.family;
        });
        if (index === 0) {
          AddContent("<hir>无门无派无法请安！\n</hir>");
          return;
        } else {
          AddContent(`请安目标：<hir>${schoolNames[index]}</hir>！！！\n`);
          SendCommand("stopstate");
        }
        SendCommand(goTo[index]);
        let tag_qa = null;
        tag_qa = addListener(function (event, message) {
          if (message.type === "items") {
            room.items.forEach(item => {
              if (/金牌杀手|首席弟子|大师姐|大师兄/.test(item.name)) {
                SendCommand("ask2 " + item.id);
                removeListener(tag_qa);
              }
            });
          }
        });
      };
  
      function xsl20() {
        let cmd = ["tasks"];
        for (let i = 0; i < 20; i++) {
          cmd.push("cr yz/lw/shangu");
          cmd.push(250);
          cmd.push("cr over");
          cmd.push(250);
        }
        cmd.push("tasks");
        SendCommand(cmd);
      }
  
  
  
  
      /********************BODY********************/
      GM_addStyle(`
        body { width: 100%; display: flex; flex-flow: row nowrap; }
        .container, .login-content { width: 370px; flex: 1 0 auto; margin: 0; }
        .left, .right { width:370px; height:100%; flex: 0 0 auto; margin: 0 10px; }
  
        `);
      $("body").append(
        $(`<div class="left"></div>`),
        $(`<div class="right"></div>`),
        $(`<audio id="beep" preload="auto"></audio>`).append(`<source src="http://47.102.126.255/wav/complete.wav">`)
      );
      /********************RIGHT********************/
      {
        GM_addStyle(`
        .right{ order: 1; display: flex; flex-direction: column; flex-wrap: nowrap; }
        .msg { height: auto; overflow: auto; flex: 0 0 auto; font-size: 14px; line-height: 16px; max-height: 160px; }
        .chat { flex: 1 1 auto; max-height: 100%; }
        `);
        $(".right").append(
          $(`<div class="msg chat"></div>`),
          $(`<div class="msg tm"></div>`),
          $(`<div class="msg fam"></div>`),
          $(`<div class="msg pty"></div>`),
          $(`<div class="msg es"></div>`),
          $(`<div class="msg sys rumor"></div>`),
          $(`<div class="msg pickup"></div>`),
          $(`<div class="msg tool"></div>`)
        );
      }
      /********************LEFT********************/
      GM_addStyle(`
        .left { order: -1; display: flex; flex-direction: column; flex-wrap: nowrap; }
        .left-content { width: 100%; height: auto; flex: 1 1 auto; }
  
        .left-hotkeys { width: 100%; height: calc(4 * 37px); flex: 0 0 auto; padding-left: 5px; }
        .left-console { width: 100%; min-height: 150px; flex: 0 0 auto; }
        `);
      $(".left").append(
        $(`<div class="left-content"></div>`),
        $(`<div class="left-hotkeys"></div>`),
        $(`<div class="left-console"></div>`),
      );
      {
        $(".left-hotkeys").append(
          $("<div></div>").append(
            $(`<span class="span-btn"></span>`).append("信息").click(clickInfo),
            $(`<span class="span-btn"></span>`).append("技能").click(clickSkill),
            $(`<span class="span-btn"></span>`).append("背包").click(clickPack),
            $(`<span class="span-btn"></span>`).append("任务").click(() => { SendCommand("tasks") }),
            $(`<span class="span-btn"></span>`).append("预配").click(saveEq),
            $(`<span class="span-btn" eq="1"></span>`).append("<hik>换壹</hik>").click(loadEq),
            $(`<span class="span-btn" eq="2"></span>`).append("<hik>换贰</hik>").click(loadEq),
            $(`<span class="span-btn" eq="3"></span>`).append("<hik>换叁</hik>").click(loadEq)
          ),
          $("<div></div>").append(
            $(`<span class="span-btn"></span>`).append("交换").click(changeLeftRight),
            $(`<span class="span-btn"></span>`).append("隐藏").click(hideLeftRight),
            $(`<span class="span-btn"></span>`).append("清屏").click(clearRightMsg),
            $(`<span class="span-btn"></span>`).append("退队").click(() => SendCommand("team out")),
            $(`<span class="span-btn"></span>`).append("退本").click(() => SendCommand("cr over")),
            $(`<span class="span-btn"></span>`).append("重置").click(() => SendCommand("lingwu reset")),
            $(`<span class="span-btn"></span>`).append("防掉").click(keepOnline),
            $(`<span class="span-btn"></span>`).append("提示").click(() => Beep())
          ),
          $("<div></div>").append(
            $(`<span class="span-btn"></span>`).append("修炼").click(() => SendCommand(YZC["修炼"])),
            $(`<span class="span-btn"></span>`).append("打坐").click(() => SendCommand(YZC["打坐"])),
            $(`<span class="span-btn"></span>`).append("疗伤").click(() => SendCommand(YZC["疗伤"])),
            $(`<span class="span-btn"></span>`).append("挖矿").click(() => SendCommand("wakuang")),
            $(`<span class="span-btn"></span>`).append("衙门").click(() => SendCommand(YZC["衙门"])),
            $(`<span class="span-btn"></span>`).append("当铺").click(() => SendCommand(YZC["当铺"])),
            $(`<span class="span-btn"></span>`).append("请安").click(toQingAn),
            $(`<span class="span-btn"></span>`).append("送花").click(() => SendCommand("greet 99")),
          ),
          $("<div></div>").append(
            $(`<span class="span-btn"></span>`).append("武当").click(toSchoolWD),
            $(`<span class="span-btn"></span>`).append("少林").click(toSchoolSL),
            $(`<span class="span-btn"></span>`).append("华山").click(toSchoolHS),
            $(`<span class="span-btn"></span>`).append("峨眉").click(toSchoolEM),
            $(`<span class="span-btn"></span>`).append("逍遥").click(toSchoolXY),
            $(`<span class="span-btn"></span>`).append("丐帮").click(toSchoolGB),
            $(`<span class="span-btn"></span>`).append("杀手").click(toSchoolSS),
            $(`<span class="span-btn"></span>`).append("其他").click(toQiTa),
          ),
        );
      }
      {
        $(".left-console").append(
          $(`<div class="left-console-show"></div>`),
          $(`<div class="left-console-send"></div>`).append(
            $(`<input type="text" readonly onfocus="this.removeAttribute('readonly');" id="send-input">`),
            $(`<div class="item-commands"></div>`).append(`<span id="send-btn">发送</span>`))
        ); GM_addStyle(`
        .left-console { display: flex; flex-direction: column; flex-wrap: nowrap; }
        .left-console-show { height:150px; flex: 0 0 auto; overflow: auto; border: gray solid 1px; border-radius: 3px; }
        .left-console-send { height: 40px; flex: 0 0 auto; }
        .left-console-send { display: flex; flex-direction: row; flex-wrap: nowrap; }
        #send-input { flex: 1 0 auto; background-color: gray; color: white; font-size: 14px; height: 20px; margin: 7px 0; }
        #send-btn { flex: 0 0 auto; font-size: 12px; margin: 8px 0 0 7px; }
        `);
      }//指令区域
      $("#send-input").keypress(function (key) {
        if (key.which == 13) $("#send-btn").click();
      });//指令输入框
      $("#send-btn").click(function () {
        let cmd = $("#send-input").val();
        if (!cmd) return;
        $(".left-console-show").append(
          $("<div></div>").append(
            $(`<hiy></hiy>`).append(">> "),
            $(`<span class="span-btn"><hiy>${cmd}</hiy></span>`).click(() => SendCommand(cmd))));
        websocket.send(cmd);
        AutoScroll(".left-console-show");
        $("#send-input").val("");
      });//指令发送键
      /********************LEFT-CONTENT********************/
      {
        GM_addStyle(`
        .left-content { margin: 5px 0; font-size: 16px; overflow: auto; }
        .left-content { display: flex; flex-direction: column; flex-wrap: nowrap; }
        .content-title { flex: 0 0 auto; border: gray solid 1px; border-radius: 3px; display: flex; }
        .title-tag { dispaly: inline-block; text-align: right; flex: 1 0 auto; }
  
        .content-box { flex: 0 1 auto; border: gray solid 1px; border-radius: 3px; margin-top: 5px; overflow: auto; }
        .content-pickup { min-height: 50px; max-height: 190px; flex: 1 1 auto; }
        .pickup-row { display: flex; }
        .pickup-add { flex: 0 0 auto; }
        .pickup-count { flex: 0 1 999px; dispaly: inline-block; text-align: right; }
        .info-row { display: flex; }
        .info-item { flex: 0 1 999px; dispaly: inline-block; text-align: center; }
        .info-title { flex: 0 0 65px; dispaly: inline-block; text-align: center; }
        .skill-row { display: flex; }
        .skill-name { cursor: pointer; }
        .skill-eq {}
        .skill-level { dispaly: inline-block; text-align: right; flex: 1 0 auto; }
  
        .item-row { display: flex; border-bottom: gray dotted 0.5px; }
        .item-name { cursor: pointer; }
        .item-count { dispaly: inline-block; text-align: right; flex: 1 0 auto; }
        `);
        $(".left-content").append(
          $(`<div class="content-title"></div>`),
          $(`<div class="content-box content-info"></div>`),
          $(`<div class="content-box content-pickup"></div>`),
          $(`<div class="content-box content-pack"></div>`),
          $(`<div class="content-box content-skill"></div>`),
          $(`<div class="content-box content-setting"></div>`),
        );
        $(".content-box").hide();
        $(".content-info").show();
        $(".content-pickup").show();
        $(".content-title").append(
          $(`<span> </span>`), $(`<span class="role_level">LEVEL</span>`), $(`<span>　</span>`),
          $(`<span class="role_name">NAME</span>`), $(`<span>　</span>`),
          $(`<ord class="role_id">ID</ord>`),
          $(`<hiy class="title-tag">wsmud_funny</hiy>`)
        );
      }
      {
        $(".content-info").append(
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">性别<span>`),
            $(`<span class="info-item role_gender">？<span>`),
            $(`<span class="info-title">年龄<span>`),
            $(`<span class="info-item role_age">九十九岁<span>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">门派<span>`),
            $(`<span class="info-item role_family">无门无派<span>`),
            $(`<span class="info-title">功绩<span>`),
            $(`<span class="info-item role_gongji">999999<span>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">经验<span>`),
            $(`<span class="info-item role_exp">999999<span>`),
            $(`<span class="info-title">潜能<span>`),
            $(`<span class="info-item role_pot">999999<span>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">气血<span>`),
            $(`<span class="info-item"><span class="role_hp">0</span>/<hig class="role_max_hp">999999</hig><span>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">内力<span>`),
            $(`<span class="info-item"><span class="role_mp">0</span>/<hig class="role_max_mp">999999</hig>/<hic class="role_limit_mp">999999<hic><span>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">臂力<span>`),
            $(`<span class="info-item"><hiy class="role_str">15</hiy>＋<span class="role_str_add">999</span><span>`),
            $(`<span class="info-title">根骨<span>`),
            $(`<span class="info-item"><hiy class="role_con">15</hiy>＋<span class="role_con_add">999</span><span>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">身法<span>`),
            $(`<span class="info-item"><hiy class="role_dex">15</hiy>＋<span class="role_dex_add">999</span><span>`),
            $(`<span class="info-title">悟性<span>`),
            $(`<span class="info-item"><hiy class="role_int">15</hiy>＋<span class="role_int_add">999</span><span>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">攻击<span>`),
            $(`<hig class="info-item role_gj">99999<hig>`),
            $(`<span class="info-title">防御<span>`),
            $(`<hig class="info-item role_fy">99999<hig>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">命中<span>`),
            $(`<hig class="info-item role_mz">99999<hig>`),
            $(`<span class="info-title">招架<span>`),
            $(`<hig class="info-item role_zj">99999<hig>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">暴击<span>`),
            $(`<hig class="info-item role_bj">100%<hig>`),
            $(`<span class="info-title">躲闪<span>`),
            $(`<hig class="info-item role_ds">99999<hig>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">终伤<span>`),
            $(`<hig class="info-item role_add_sh">100%<hig>`),
            $(`<span class="info-title">攻速<span>`),
            $(`<hig class="info-item role_gjsd">99999<hig>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">忽视防御<span>`),
            $(`<span class="info-item role_diff_fy">99%<span>`),
            $(`<span class="info-title">伤害减免<span>`),
            $(`<span class="info-item role_diff_sh">99%<span>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">暴击伤害<span>`),
            $(`<span class="info-item role_add_bj">99%<span>`),
            $(`<span class="info-title">暴击抵抗<span>`),
            $(`<span class="info-item role_diff_bj">99%<span>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">增加忙乱<span>`),
            $(`<span class="info-item role_busy">0秒+0%<span>`),
            $(`<span class="info-title">忽视忙乱<span>`),
            $(`<span class="info-item role_diff_busy">0秒+0%<span>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">释放速度<span>`),
            $(`<span class="info-item role_releasetime">0秒+0%<span>`),
            $(`<span class="info-title">冷却速度<span>`),
            $(`<span class="info-item role_distime">0秒+0%<span>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">打坐效率<span>`),
            $(`<span class="info-item role_dazuo_per">99%<span>`),
            $(`<span class="info-title">内力减耗<span>`),
            $(`<span class="info-item role_expend_mp">0秒+0%<span>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">练习效率<span>`),
            $(`<span class="info-item role_lianxi_per">99%<span>`),
            $(`<span class="info-title">学习效率<span>`),
            $(`<span class="info-item role_study_per">99%<span>`),
          ),
          $(`<div class="info-row"></div>`).append(
            $(`<span class="info-title">财产<span>`),
            $(`<span class="info-item role_money">999999两<hiy>黄金</hiy><span>`),
          ),
        );
      }//info
      // ;
  
  
  
  
  
      function saveEq() {
        AddContent(
          $(`<div></div>`).append(
            $(`<hic>建议刷新技能和背包之后再保存！\n</hic>`),
            $(`<span class="span-btn" eq="1">保存到配置壹</span>`).click(save),
            $(`<span class="span-btn" eq="2">保存到配置贰</span>`).click(save),
            $(`<span class="span-btn" eq="3">保存到配置叁</span>`).click(save)
          )
        );
        function save() {
          let index = $(this).attr("eq");
          let key = `${id}.eq.${index}`;
          let cmd = [];
          let name = ["0", "配置壹", "配置贰", "配置叁"];
          let str = `<hir>以下配置被保存到<hiw>${name[index]}</hiw>！</hio>\n`;
  
          let base = ["unarmed", "force", "parry", "dodge", "sword", "blade", "club", "staff", "whip", "throwing"];
          base.forEach(skid => {
            if (skills[skid] && skills[skid].enable_skill) {
              cmd.push(`enable ${skid} ${skills[skid].enable_skill}`);
              str += skills[skills[skid].enable_skill].name + "\n";
            }
          });
          cmd.push(1000);
          pack.eqs.forEach(eq => {
            if (eq && eq.id) {
              cmd.unshift("eq " + eq.id);
              str += eq.name + "\n";
            }
          });
          AddContent(str);
          let value = JSON.stringify(cmd);
          localStorage.setItem(key, value);
        }
      }
      function loadEq() {
        let index = $(this).attr("eq");
        let name = ["0", "配置壹", "配置贰", "配置叁"];
        AddContent(`<hir>正在加载<hiw>${name[index]}</hiw>！</hir>\n`);
        let key = `${id}.eq.${index}`;
        let value = localStorage.getItem(key);
        let cmd = JSON.parse(value);
        SendCommand(cmd);
      }
  
  
      /****************************************/
  
  
  
      // $(".left-pack").append(`<div class="left-pack-list"></div>`);//背包
  
  
      // $(`<div class="msg "></div>`).append(
      //     $(`<small>扬州城</small>`), $(`<br>`),
      //     $(``).click(() => SendCommand(commands["修炼"])),
      // )
      // $(".left-hotkey").append(`
      // <div class="list-commands"></div>
      // <div class="left-console console"></div>
      // <div class="left-send item-commands"></div>
      // `);//指令
  
  
      // for (const name in commands) {
      //     $(".list-commands").append(`<div class="item-commands ${name}"><small>${name}</small><br></div>`);
      //     for (const key in commands[name]) {
      //         $(`.${name}`).append(
      //             $(`<span>${key}</span>`).click(() => SendCommand(commands[name][key]))
      //         );
      //     }
      // }
      function clickInfo() {
        $(".content-box").hide();
        $(".content-info").show();
        $(".content-pickup").show();
        SendCommand(["score2", "score"]);
        setTimeout(() => $(".dialog-close").click(), 500);
      }
      function clickSkill() {
        $(".content-box").hide();
        $(".content-skill").show();
        SendCommand("cha");
        setTimeout(() => {
          $(".content-skill").html("");//clear
          let base = ["unarmed", "force", "parry", "dodge", "sword", "blade", "club", "staff", "whip", "throwing",
            "literate", "lianyao", "bite"];
          base.forEach(id => {
            if (skills[id]) {
              let name = skills[id].name;
              let level = skills[id].level;
              let exp = skills[id].exp < 10 ? `0${skills[id].exp}%` : `${skills[id].exp}%`;
              let enable = skills[id].enable_skill ? "已装备：" + skills[skills[id].enable_skill].name : "";
              $(".content-skill").append(
                $(`<div class="skill-row"><div>`).append(
                  $(`<span class="skill-name">${name}　</span>`),
                  $(`<span class="skill-eq">${enable}</span>`),
                  $(`<span class="skill-level">${id} ${level}级${exp}</span>`),
                )
              );
            }
          });
  
          let skillArray = [];
          for (const id in skills) if (!base.includes(id)) skillArray.push(skills[id]);
          skillArray.sort((a, b) => {
            if (b.level === a.level) return b.color - a.color;
            else return b.level - a.level;
          });
  
          skillArray.forEach(skill => {
            let enables = skill.can_enables;
            let str = "enable";
            enables.forEach(enable => str = str + "," + enable);
            let exp = skill.exp < 10 ? `0${skill.exp}%` : `${skill.exp}%`;
  
            $(".content-skill").append(
              $(`<div class="skill-row" enable="${str}"><div>`).append(
                $(`<span class="skill-name">${skill.name}</span>`),
                $(`<span class="skill-level">${skill.id} ${skill.level}级${exp}</span>`)
              ).click(function () {
                let enables = $(this).attr("enable");
                let x = enables.split(",");
                x.splice(0, 1);
                AddContent($(`<span>${skill.name}\n</span>`));
                x.forEach(enable => {
                  AddContent($(`<span class="span-btn">装备${skills[enable].name}</span>`)
                    .click(() => SendCommand(`enable ${enable} ${skill.id}`)));
                });
                AddContent($(`<span class="span-btn">练习</span>`).click(() => SendCommand(`lianxi ${skill.id}`)));
                AddContent(`\n`);
              })
            );
          });
          AddContent(`<hic>技能数据已刷新！\n</hic>`);
        }, 1000);
      };
      function clickPack() {
        $(".content-box").hide();
        $(".content-pack").show();
        SendCommand("pack");
        setTimeout(() => {
          $(".content-pack").html("");
          pack.items.forEach(item => {
            let value = Money2Str(item.value);
            value = (value === 0) ? "" : `每${item.unit}${value}`;
            value = `<span style="font-size:0.8em">${value} </span>`;
            $(".content-pack").append(
              $(`<div class="item-row"></div>`).append(
                $(`<span class="item-name"></span>`).append(item.name),
                $(`<span class="item-count"></span>`).append(`${value}共${item.count}${item.unit}`)
              )
            );
          });
          AddContent(`<hic>背包数据已刷新！\n</hic>`);
        }, 1000);
  
      };
    });
  
    // function RefreshRole() {
    //     for (const key in funny.role) {
    //         $(".role_" + key).html(wsmud.role[key]);
    //     }
    // }
    // function RefreshSkill() {
    //     $(".left-skill-list").html(""); //Clear
    //
    //     let skills = wsmud.skills;
    //     base.forEach(id => {
    //         if (skills[id]) {
    //
    //         }
    //     });
  
    //
  
  
    //     RefreshEq();
    // }
    // function RefreshPack() {
    //     // $(".left-pack-list");
    //     let itemArray = wsmud.pack.items;
    //     $(".left-pack-list").html("");
    //     itemArray.forEach(item => {
    //         let id = item.id;
    //         let name = item.name;
    //         let unit = item.unit;
    //         let count = item.count;
    //         let value = Money2Str(item.value);
    //         if (value === 0) value = "<small>不可出售</small>";
    //         else value = `<small>每${unit}价值${value}</small>`;
  
    //         $(".left-pack-list").append(
    //             $(`<div class="pack-line">
    //             <span class="pack-line-name">${name}</span>
    //             <span class="pack-line-count">${value} 共${count}${unit}</span>
    //             </div>`)
    //         );
    //     });
    // }
    // function RefreshEq() {
    //     let eqArray = wsmud.pack.eqs;
    //     let nameArray = ["武器", "衣服", "鞋子", "头饰", "披风", "戒指", "项链", "饰品", "护腕", "腰带", "暗器"];
    //     $(".left-eq-list").html("");
    //     for (let i = 0; i < nameArray.length; i++) {
    //         let html = nameArray[i] + "：";
    //         if (eqArray[i] && eqArray[i].name) {
    //             html += eqArray[i].name;
    //         }
    //         $(".left-eq-list").append(
    //             $(`<div class="eq-line">${html}</div>`)
    //         );
    //     }
    // }
    // function SendCommand(command) {
    //     if (typeof command === "string") {
    //         wsmud.send(command);
    //     } else if (command instanceof Array) {
    //         let sum = 0, ms = 250;
    //         let wait = () => {return sum += ms};
    //         command.forEach(cmd => setTimeout(function() {
    //             wsmud.send(cmd);
    //         }, wait()));
    //     } else if (command instanceof Function) {
    //         SendCommand(command());
    //     }
    // }
  
    // let wsmud = {
    //     name: 0,
    //     isMoblie: false,
    //     state: {},
  
    //     id: null,
    //     title: {name: "武神传说", state: " Mud"},
    //     roles: {},
    //     room: {name: "a-b(c)", map: "a", room: "n", path: ""},
    //     items: [], //房间的玩家/NPC/尸体/物品
    //     skills: {},
  
    //     role: {},
    //     pack: {"items": [], "pick": {}, "eqs": [], "money": "", max: 0},
  
    //     settings: {
    //         layout_left_right: true,
    //         needTimeStr: false,
    //         auto_sm: false,
    //         auto_sm_cmd: "Command",
    //         auto_sm_npc: "NPC_Name",
    //         auto_sm_item: "Item_Name",
    //     },
  
    //     onmessage: function(event) {
    //         let message = Str2Obj(event.data);
    //         let type = message.type || "";
    //         if (type === "dialog") {
    //             type = message.dialog || "";
    //         }
    //         if (type !== "msg" && type !== "time") console.log(message);
  
  
    //         let listeners = wsmud.listener[type];
    //         if (listeners instanceof Array && listeners.length > 0) {
    //             for (let i = 0; i < listeners.length; i++) {
    //                 let fn = listeners[i];
    //                 if (fn(event, message)) {
    //                     if (i < listeners.length - 1) continue;
    //                     wsmud.fn_onmessage.apply(this, arguments);
    //                 } else {
    //                     break;
    //                 }
    //             }
    //             // listeners.forEach(fn => { // });
    //         } else {
    //             wsmud.fn_onmessage.apply(this, arguments);
    //         }
    //     },
    //     listener: {"": [], "send": []}
    // };
  
    // let AutoSM = function() {
    //     let schoolName = wsmud.role.family;
    //     let schoolNames = ["无门无派", "武当派", "少林派", "华山派", "峨眉派", "逍遥派", "丐帮", "杀手楼"];
    //     let schoolPath = [
    //         ["jh fam 0 start", "go south", "go south", "go west"],
    //         ["jh fam 1 start", "go north"],
    //         ["jh fam 2 start"],
    //         ["jh fam 3 start"],
    //         ["jh fam 4 start", "go west"],
    //         ["jh fam 5 start"],
    //         ["jh fam 6 start", "go down"],
    //         ["jh fam 7 start", "go north"]
    //     ];
    //     let schoolNPC = ["武馆教习", "武当派第二代弟子 武当首侠 宋远桥", "少林寺第四十代弟子 清乐比丘",
    //     "市井豪杰 高根明", "峨眉派第五代弟子 苏梦清", "聪辩老人 苏星河", "丐帮七袋弟子 左全", "杀手教习 何小二"];
    //     let index = schoolNames.indexOf(schoolName);
    //     wsmud.settings.auto_sm = true;
    //     wsmud.settings.auto_sm_npc = schoolNPC[index];
    //     console.log(schoolPath[index]);
    //     return schoolPath[index];
    // };
    // let AutoBuy = function(itemName) {
    //     let list = [
    //         ["米饭", "包子", "鸡腿", "面条", "扬州炒饭", "米酒", "花雕酒", "女儿红", "醉仙酿", "神仙醉"],
    //         ["布衣", "钢刀", "木棍", "英雄巾", "布鞋", "铁戒指", "簪子", "长鞭", "钓鱼竿", "鱼饵"],
    //         ["铁剑", "钢刀", "铁棍", "铁杖", "铁镐", "飞镖"],
    //         ["<hig>金创药</hig>", "<hig>引气丹</hig>", "<hig>养精丹</hig>"]
    //     ];
    //     let shop = [
    //         ["店小二", ["jh fam 0 start", "go north", "go north", "go east"]],
    //         ["杂货铺老板 杨永福", ["jh fam 0 start", "go east", "go south"]],
    //         ["铁匠铺老板 铁匠", ["jh fam 0 start", "go east", "go east", "go south"]],
    //         ["药铺老板 平一指", ["jh fam 0 start", "go east", "go east", "go north"]]
    //     ];
    //     for (let i = 0; i < list.length; i++) {
    //         for (let j = 0; j < list[i].length; j++) {
    //             if (itemName.includes(list[i][j])) {
    //                 console.log(shop[i][1]);
    //                 return shop[i][1];
    //             }
    //         }
    //     }
    //     return 0;
    // };
  
    // let commands = {
    //     "快捷": {
    //         "修炼": ["stopstate", "jh fam 0 start", "go west", "go west", "go north", "go enter", "go west", "xiulian"],
    //         "打坐": ["stopstate", "jh fam 0 start", "go west", "go west", "go north", "go enter", "go west", "dazuo"],
    //         "疗伤": ["stopstate", "jh fam 0 start", "go north", "go north", "go west", "liaoshang"],
    //         "挖矿": ["stopstate", "wakuang"],
    //         "当铺": ["stopstate", "jh fam 0 start", "go south", "go east", "sell"],
    //     },
    //     "小号": {
    //         "配偶送花": ["greet 99"],
    //         "师傅请安": ["greet master"],
    //     },
    //     "其他": {
    //         "退出副本": ["cr over"],
    //         "退出组队": ["team out"],
    //         "重置武道": ["lingwu reset"],
    //     },
    //     "实验性指令": {
    //         "自动师门": AutoSM,
    //         "小树林秒退 20 次": function() {
    //
    //         }(),
    //     }
    // };
  
    // function AddListener(type, fn) {
    //     wsmud.listener[type] = wsmud.listener[type] || [];
    //     wsmud.listener[type].push(fn);
    // }
  
  
  
    /********************全局可用的方法********************/
    function Str2Obj(str) {
      if (str[0] === "{") {
        return (new Function("return " + str))();
      } else {
        return { "type": "text", "text": str };
      }
    }
    function Time2Str() {
      let date = new Date();
      let str = date.toString().substr(16, 5);
      return str;
    }
    function Money2Str(number) {
      if (number == 0 || isNaN(number)) return 0;
      let str = "" + number;
      let c = str.substring(str.length - 2, str.length);
      if (c && c !== "00") {
        c = parseInt(c) + "个<yel>铜板</yel>";
      } else c = "";
      let b = str.substring(str.length - 4, str.length - 2);
      if (b && b !== "00") {
        b = parseInt(b) + "两<wht>白银</wht>";
      } else b = "";
      let a = str.substring(0, str.length - 4);
      if (a) a = a + "两<hiy>黄金</hiy>";
      return a + b + c;
    }
    function AutoScroll(name) {
      if (name) {
        let scrollTop = $(name)[0].scrollTop;
        let scrollHeight = $(name)[0].scrollHeight;
        let height = Math.ceil($(name).height());
        if (scrollTop < scrollHeight - height) {
          let add = (scrollHeight - height < 120) ? 1 : Math.ceil((scrollHeight - height) / 120);
          $(name)[0].scrollTop = scrollTop + add;
          setTimeout(function () {
            AutoScroll(name);
          }, 1000 / 120);
        }
      }
    }//滚动
    function DeepCopy(object) {
      let result = {};
      for (const key in object) {
        result[key] = (typeof object[key] === "object") ? DeepCopy(object[key]) : object[key];
      }
      return result;
    }//拷贝
    function SendCommand(command) {
      if (command instanceof Array) {
        if (command.length === 0) return;
        let cmd1 = command[0];
        let cmd2 = command.slice(1);
        if (typeof cmd1 === "number") {
          setTimeout(() => SendCommand(cmd2), cmd1);
        } else if (cmd1) {
          SendCommand(cmd1);
          SendCommand(cmd2);
        }
      } else if (typeof command === "string") {
        websocket.send(command);
        if (!isMoblie) {
          $(".left-console-show").append(`<div> >> ${command}</div>`);
          AutoScroll(".left-console-show");
        }
      }
    }//发送
    function AddContent(element) {
      $(".content-message pre").append(element);
      AutoScroll(".content-message");
      return false;
    }
    function Beep() {//提示音
      document.getElementById("beep").play();
      AddContent(
        $(`<span></span>`).append(
          $(`<span class="span-btn"><提示音><span>`).click(function () {
            AddContent(
              $(`<span></span>`).append(
                $(`<hiy>如无声音，请检查音源地址是否可以正常访问。\n</hiy>`),
                $(`<hiy>http://47.102.126.255/wav/complete.wav\n</hiy>`),
                $(`<hic>反正有VPN的肯定会响，如遇特殊情况，请自行调低音量。\n</hic>`),
                $(`<span>Safari浏览器需要修改此网站设置为允许自动播放媒体。\n</span>`)
              )
            );
          }),
          $(`<span>\n</span>`)
        )
      );
    }
  
    /********************暴露********************/
    unsafeWindow.funny = {
      role: role,
      skills: skills,
      pack: pack,
      title: title,
      room: room,
      exits: exits,
  
      SendCommand: SendCommand,
      Beep: Beep,
    };
  })();