'use strict'

module.exports = (ipcRenderer, guestInstanceId, openerId) => {
    if (guestInstanceId != null) {
        window.command = (method, ...args) => {
            return ipcRenderer.sendToHost('FEIHUO_MICRO_BROWSER_WEBVIEW_WINDOW_COMMAND', method, ...args)
        }
        window.resizeTo = (width, height) => {
            return ipcRenderer.sendToHost('FEIHUO_MICRO_BROWSER_WEBVIEW_WINDOW_RESIZETO', width, height)
        }

        window.resizeBy = (width, height) => {
            return ipcRenderer.sendToHost('FEIHUO_MICRO_BROWSER_WEBVIEW_WINDOW_RESIZEBY', width, height)
        }
    } else {
        window.command = (method, ...args) => {
            return ipcRenderer.sendSync('FEIHUO_MICRO_BROWSER_WEBVIEW_WINDOW_COMMAND', guestInstanceId, method, ...args)
        }
    }

    //禁止拖入
    window.ondragover = (e) => {
        e.preventDefault()
        return false
    }
    window.ondrop = (e) => {
        e.preventDefault()
        return false
    }

    //禁止拖动、选择、复制、粘贴、剪切
    document.ondragstart = (e) => {
        e.preventDefault()
        return false
    }
    document.onselectstart = (e) => {
        e.preventDefault()
        return false
    }
    document.onselect = (e) => {
        e.preventDefault()
        document.selection.empty()
    }

    document.oncopy = (e) => {
        e.preventDefault()
        return false
    }
    document.onpaste = (e) => {
        e.preventDefault()
        return false
    }
    document.oncut = (e) => {
        e.preventDefault()
        return false
    }

    window.top.ffwpcweb = (method, ...args) => {
        window.command(method, ...args);
    }
}