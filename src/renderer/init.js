'use strict'

const { ipcRenderer } = require('electron')

const { guestInstanceId, openerId } = process

require('./ipcrenderer')(ipcRenderer, guestInstanceId)
require('./window')(ipcRenderer, guestInstanceId, openerId)