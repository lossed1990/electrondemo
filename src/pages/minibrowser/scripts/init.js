require('../../../renderer/init.js');
const electron = require('electron');
const clipboard = electron.clipboard;
const remote = electron.remote;
const app = remote.app;
const currentWindow = remote.getCurrentWindow();
const service = remote.getGlobal('g_service');
var theWebView = null;
var bFlagMax = false;
var bNewUrl = false;

//onload事件侦听函数
function addLoadEvent(event) {
    window.addEventListener('load', event, false);
}

window.onRefresh = function() {
    if (theWebView != null)
        theWebView.reload();
}

window.onMinimize = function() {
    currentWindow.minimize();
}

window.onMaximize = function() {
    if (bFlagMax) {
        currentWindow.unmaximize();
        bFlagMax = false;
    } else {
        currentWindow.maximize();
        bFlagMax = true;
    }
}

window.onClose = function() {
    window.close();
}

window.onChangeTitle = function(txt, url) {
    if (bNewUrl) {
        theHeater.addTab(txt, url);
    } else {
        theHeater.changeTab(txt, url);
    }
}

window.getCurrentUrl = function() {
    if (theWebView)
        return theWebView.getURL();

    return '';
}

window.loadUrl = function(url) {
    if (theWebView)
        theWebView.loadURL(url);
}

window.reload = function() {
    if (theWebView)
        theWebView.reload();
}

window.goBack = function() {
    if (theWebView) {
        if (theWebView.canGoBack()) {
            theWebView.goBack();
        }
    }
}

window.copyLink = function() {
    clipboard.writeText(window.getCurrentUrl());
}

window.getHomeUrl = function() {
    return service.getHomeUrl();
}

function ready(ev) {
    for (let wv of document.querySelectorAll('webview')) {
        if (wv.id === "webview") {
            theWebView = wv;
            wv.addEventListener('page-title-updated', (e) => {
                onChangeTitle(e.title, theWebView.getURL());
                bNewUrl = false;
            });

            wv.addEventListener('new-window', (e) => {
                const protocol = require('url').parse(e.url).protocol;
                if (protocol === 'http:' || protocol === 'https:') {
                    bNewUrl = true;
                    window.loadUrl(e.url);
                }
            });
            // wv.addEventListener('dom-ready', () => {
            //     wv.openDevTools();
            // })
        }
        wv.addEventListener('new-window', (e) => {
            window.open(e.url);
        })
    }
}
addLoadEvent(ready);

var MouseStatus = {
    mousenone: 0x000,
    mousedown: 0x001,
    mousemove: 0x002,
    mouseup: 0x004
};

var caption_mouse_status = MouseStatus.mousenone;
var caption_left_button_pos = { x: 0, y: 0 };

window.addEventListener("mousemove", function(e) {
    if (caption_mouse_status == MouseStatus.mousedown) {
        if (e.x != caption_left_button_pos.x || e.y != caption_left_button_pos.y) {
            caption_mouse_status |= MouseStatus.mousemove;
            currentWindow.setIgnoreMouseEvents(false, { "caption": true });
        }
    } else {
        caption_mouse_status = MouseStatus.mousenone;
    }
});

window.addEventListener("mousedown", function(e) {
    if (e.target.className === "captionbar-top" || e.target.className === "captionbar" || e.target.className === "el-tabs__nav-scroll" || e.target.className === "nav-tabs") {
        caption_left_button_pos.x = e.x;
        caption_left_button_pos.y = e.y;
        caption_mouse_status = MouseStatus.mousedown;
    }
});

window.addEventListener("mouseup", function(e) {
    if (e.target.className === "captionbar-top" || e.target.className === "captionbar" || e.target.className === "el-tabs__nav-scroll" || e.target.className === "nav-tabs") {
        caption_mouse_status = MouseStatus.mouseup;
    } else {
        caption_mouse_status = MouseStatus.mousenone;
    }
});