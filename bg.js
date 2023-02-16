'use strict';

chrome.contextMenus.create({
    id: "copy_setting_path",
    title: "Copy Setting Path",
    contexts: ["page"]
});

chrome.contextMenus.create({
    id: "copy_hypertext_path",
    title: "Copy Hypertext Path",
    contexts: ["page"]
});

chrome.contextMenus.create({
    id: "copy_setting_URL",
    title: "Copy Plain URL",
    contexts: ["page"]
});

chrome.contextMenus.create({
    id: "start_to_inspect",
    title: "Start to Copy",
    contexts: ["page"]
});

chrome.contextMenus.create({
    id: "stop_inspect",
    title: "Stop Copying",
    contexts: ["page"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (tab) {
        if ( [ "copy_setting_path", "copy_hypertext_path", "copy_setting_URL", "start_to_inspect", "stop_inspect" ].includes( info.menuItemId ) ){
            var code = 'copyToClipboardSetting(\'' + info.menuItemId + '\');';
            chrome.tabs.executeScript( tab.id, { code: code } );
        }
    }
});
