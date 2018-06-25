'use strict';
const { app, ipcMain } = require('electron');
// Implements window.command()
ipcMain.on('FEIHUO_MICRO_BROWSER_WEBVIEW_WINDOW_COMMAND', function(event, guestInstanceId, method, ...args) {
    app.emit('command', event, guestInstanceId, method, ...args);
    if (!event.defaultPrevented && event.sendGuest != null) {
        event.sendGuest.webContents.send('FEIHUO_MICRO_BROWSER_WEBVIEW_WINDOW_COMMAND_RESPONE', guestInstanceId, method, ...args);
    }
});