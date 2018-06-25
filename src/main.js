'use strict';

const { app } = require('electron');
const path = require('path');

let apptype = 'ball';
let appparam = {};
let theapp = null;

// Parse command line options.
const argv = process.argv.slice(1);
const appFile = null;
const bound = { x: -1, y: -1, width: 0, height: 0 };
const titl = '';
var userData = null;
for (let i = 0; i < argv.length; i++) {
    if (argv[i].match(/^--app=/)) {
        var temp = argv[i].split('=')[1].split('::');
        apptype = temp[0];
        appparam.url = temp[1];
    } else if (argv[i].match(/^--pos=/)) {
        var pos = argv[i].split('=')[1].split(':');
        bound.x = pos[0];
        bound.y = pos[1];
    } else if (argv[i].match(/^--user-data-dir=/)) {
        userData = argv[i].split('=')[1];
    } else if (argv[i].match(/^--title=/)) {
        appparam.title = argv[i].split('=')[1];
    } else if (argv[i].match(/^--url=/)) {
        appparam.url = argv[i].split('=')[1];
    } else if (argv[i].match(/^--width=/)) {
        appparam.width = argv[i].split('=')[1];
    } else if (argv[i].match(/^--height=/)) {
        appparam.height = argv[i].split('=')[1];
    } else if (argv[i].match(/^--clientid=/)) {
        appparam.clientid = argv[i].split('=')[1];
    } else if (argv[i][0] === '-') {
        continue;
    } else {
        //appFile = argv[i]
        //break;
    }
}

switch (apptype) {
    case 'minibrowser': //迷你浏览器应用
        theapp = require('./browser/minibrowserapp');
        global.g_service = theapp;
        break;

    default: 
        theapp = require('./browser/minibrowserapp');
        global.g_service = theapp;
        break;
}

app.commandLine.appendSwitch('process=per-site');
app.commandLine.appendSwitch('lang', 'zh-CN');
if (userData != null) {
    app.setPath("userData", userData);
    app.setPath("userCache", userData);
    app.setPath("logs", path.join(userData, 'logs'));
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('ready', () => {
    if (theapp != null) {
        theapp.loadApp(appparam);
    }
})

app.on('activate', () => {
    if (theapp != null) {
        theapp.loadApp(appparam);
    }
})