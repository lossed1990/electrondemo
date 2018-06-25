'use strict';
require('./ipcmain.js');

var homeUrl = 'https://www.so.com/?src=lm&ls=sm2119891&lm_extend=ctype:31';

function miniBrowserApp() {}

miniBrowserApp.prototype.loadApp = function(param) {
    const miniBrowserWnd = require('./minibrowserwnd');
    if (param.url) {
        homeUrl = param.url;
    }
    miniBrowserWnd.createWnd(homeUrl);
};

miniBrowserApp.prototype.getHomeUrl = function() {
    return homeUrl;
};

module.exports = new miniBrowserApp();