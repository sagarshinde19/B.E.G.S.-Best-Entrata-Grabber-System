'use strict';

chrome.contextMenus.create({
    id: "copy_setting_path",
    title: "🥕 Copy Setting Path",
    contexts: ["all"]
});

chrome.contextMenus.create({
    id: "copy_hypertext_path",
    title: "⚓ Copy Hypertext Path",
    contexts: ["all"]
});

chrome.contextMenus.create({
    id: "copy_setting_URL",
    title: "🔗 Copy URL",
    contexts: ["all"]
});
				
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (tab) {
        if ( [ "copy_setting_path", "copy_hypertext_path", "copy_setting_URL", "start_to_inspect", "stop_inspect" ].includes( info.menuItemId ) ){
            var code = 'copyToClipboardSetting(\'' + info.menuItemId + '\');';
            chrome.tabs.executeScript( tab.id, { code: code } );
        }
    }
});
