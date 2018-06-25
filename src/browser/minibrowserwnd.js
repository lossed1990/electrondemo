'use strict';
const { app, BrowserWindow, Tray, Menu, shell } = require('electron');
const path = require('path');

let mainWindow = null;
let appTray = null;

function createWnd(homeurl) {
    const options = {
        width: 824,
        height: 768,
        minWidth: 530,
        minHeight: 600,
        useContentSize: true,
        transparent: true,
        frame: false,
        thickFrame: true,
        autoHideMenuBar: true,
        hasShadow: true,
        resizable: true,
        maximizable: false,
        show: false,
        title: '急速浏览器',
        webPreferences: {
            nodeIntegrationInWorker: true,
            preload: path.join(__dirname, '../pages/minibrowser/scripts/init.js')
        }
    };
    options.icon = path.join(__dirname, '../assets/app-icon/win/logobrowser.ico');
    mainWindow = new BrowserWindow(options);

    if (process.platform !== 'darwin') {
        //创建托盘图标
        appTray = new Tray(options.icon);
        const contextMenu = Menu.buildFromTemplate([
            { label: '显示', click() { mainWindow.show(); } },
            { label: '退出', click() { app.quit(); } }
        ]);

        // Call this again for Linux because we modified the context menu
        appTray.setContextMenu(contextMenu);
        appTray.setToolTip(mainWindow.getTitle());
        mainWindow.on('page-title-updated', (event, title) => {
            appTray.setToolTip(title);
        });
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
        appTray = null;
    });

    mainWindow.webContents.on('dom-ready', () => {
        // mainWindow.webContents.openDevTools();
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.on('will-attach-webview', (event, webPreferences, params) => {
        if (homeurl) {
            params.src = homeurl;
            params.preload = 'file://' + path.join(__dirname, '../pages/minibrowser/scripts/init.js');
            webPreferences.preloadURL = params.preload;
        }
    });

    var html = 'file://' + path.join(__dirname, '../pages/minibrowser/minibrowser.html');
    mainWindow.loadURL(html);
};

exports.createWnd = (homeurl) => {
    createWnd(homeurl);
};