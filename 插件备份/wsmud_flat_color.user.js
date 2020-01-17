// ==UserScript==
// @name wsmud_flat_color
// @description 武神传说(wsmud)配色
// @author mapleo
// @namespace https://raw.githubusercontent.com/mapleobserver/wsmud-script/master/%E6%8F%92%E4%BB%B6%E5%A4%87%E4%BB%BD/wsmud_flat_color_stylus.css
// @version 1.0.1
// @grant GM_addStyle
// @run-at document-start
// @include http://wsmud.com/*
// @include https://wsmud.com/*
// @include http://*.wsmud.com/*
// @include https://*.wsmud.com/*
// ==/UserScript==

(function() {
    let css = `
    html, body {
        font-family: "PingFang SC",'Noto', 'Noto Sans CJK SC', 'Noto Sans CJK', 'Source Han Sans', source-han-sans-simplified-c, sans-serif,"Microsoft YaHei",微软雅黑;
    }
    pre{
        font-size: 1.1em;
        font-family: "PingFang SC",'Noto', 'Noto Sans CJK SC', 'Noto Sans CJK', 'Source Han Sans', source-han-sans-simplified-c, sans-serif,"Microsoft YaHei",微软雅黑;
    }
    .tool-bar{
        font-family: "PingFang SC",'Noto', 'Noto Sans CJK SC', 'Noto Sans CJK', 'Source Han Sans', source-han-sans-simplified-c, sans-serif,"Microsoft YaHei",微软雅黑;
    }
    .dialog{
        font-family: "PingFang SC",'Noto', 'Noto Sans CJK SC', 'Noto Sans CJK', 'Source Han Sans', source-han-sans-simplified-c, sans-serif,"Microsoft YaHei",微软雅黑;
    }
    .container, .login-content, .left, .right{
        color: rgb(0,178,0);
        background-color: #212121;
    }
    .room-item > .item-name {
        margin-left: 1em;
    }
    .room_items {
        max-height: 120px;
    }
    .item-status-bar > .status-item {
        font-size: 0.8em;
        font-weight: lighter;
    }
    .hp > .progress-bar {
        background-color: #c0392b;
    }
    .mp > .progress-bar {
        background-color: #2980b9;
    }
    HIG {
        color: #2ecc71;
    }
    HIC {
        color: #2980b9;
    }
    HIY {
        color: #f1c40f;
    }
    HIZ {
        color: #8e44ad;
    }
    HIO {
        color: #e67e22;
    }
    HIR {
        color: #c0392b;
    }
    HIM {
        color: #e84393;
    }
    
    /* left right */
    .left, .right {
        width: 350px;
    }
    .left-content {
        font-size: 13px;
    }
    .span-btn {
        font-size: 13px;
    }
    /* pluggis */
    .layui-layer-content {
        font-size: 13px;
    }
    `;
    if (typeof GM_addStyle !== "undefined") {
      GM_addStyle(css);
    } else {
      let styleNode = document.createElement("style");
      styleNode.appendChild(document.createTextNode(css));
      (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
    })();
    