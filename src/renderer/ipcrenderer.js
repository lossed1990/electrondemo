'use strict'

module.exports = (ipcRenderer, guestInstanceId) => {
    if (guestInstanceId == null) {
        ipcRenderer.on('FEIHUO_MICRO_BROWSER_WEBVIEW_WINDOW_COMMAND_RESPONE', function(event, guestInstanceId, method, ...args) {
            if (window.oncommand != null) {
                window.oncommand(guestInstanceId, method, args)
            }
        })

        //onload事件侦听函数
        function ready(ev) {
            for (let wv of document.querySelectorAll('webview')) {
                wv.addEventListener('ipc-message', (e) => {
                    if (e.channel === 'FEIHUO_MICRO_BROWSER_WEBVIEW_WINDOW_COMMAND') {
                        // Implements window.command()
                        var args = null,
                            len = e.args.length
                        if (len > 1) {
                            args = new Array(len - 1);
                            for (var i = 1; i < len; i++)
                                args[i - 1] = e.args[i];
                        }
                        var defaultPrevented = null
                        if (window.oncommand != null) {
                            if (args != null) {
                                defaultPrevented = window.oncommand(e.target.guestinstance, e.args[0], args)
                            } else {
                                defaultPrevented = window.oncommand(e.target.guestinstance, e.args[0])
                            }
                        }
                        if (!defaultPrevented) {
                            if (args != null) {
                                ipcRenderer.send(e.channel, e.target.guestinstance, e.args[0], ...args)
                            } else {
                                ipcRenderer.send(e.channel, e.target.guestinstance, e.args[0])
                            }
                        }
                    } else if (e.channel === 'FEIHUO_MICRO_BROWSER_WEBVIEW_WINDOW_RESIZETO') {
                        // Implements window.resizeTo()
                        event = document.createEvent('Event')
                        event.initEvent('resizeto', false, false)
                        event.width = e.args[0]
                        event.height = e.args[1]
                        window.dispatchEvent(event)
                    } else if (e.channel === 'FEIHUO_MICRO_BROWSER_WEBVIEW_WINDOW_RESIZEBY') {
                        // Implements window.resizeBy()
                        event = document.createEvent('Event')
                        event.initEvent('resizeby', false, false)
                        event.width = e.args[0]
                        event.height = e.args[1]
                        window.dispatchEvent(event)
                    }
                }, true)
            }
        }
        window.addEventListener('load', ready, false)
    }
}