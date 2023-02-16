'use strict';
console.log('core.js called');
// when mouse up, send message to background.js with this position
// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;
var settingCopied = false;

// Created clipboard div to copy hypertexted entrata settings.
var clipboardDiv = null;
clipboardDiv = document.createElement('div');
clipboardDiv.style.fontSize = '12pt'; // Prevent zooming on iOS

// Reset box model
clipboardDiv.style.border = '0';
clipboardDiv.style.padding = '0';
clipboardDiv.style.margin = '0';

// Move element out of screen 
clipboardDiv.style.position = 'fixed';
clipboardDiv.style['right'] = '-9999px';
clipboardDiv.style.top = (window.pageYOffset || document.documentElement.scrollTop) + 'px';

// more hiding
clipboardDiv.setAttribute('readonly', '');
clipboardDiv.style.opacity = 0;
clipboardDiv.style.pointerEvents = 'none';
clipboardDiv.style.zIndex = -1;
clipboardDiv.setAttribute('tabindex', '0'); // so it can be focused
clipboardDiv.innerHTML = '';
document.body.appendChild(clipboardDiv);

// Mouse listener for any move event on the current document.

document.addEventListener('mousemove', function (e) {
	if( settingCopied ) return true;
	var srcElement = e.srcElement;
	//console.log(srcElement);

	var strTarget = e.target;
	//console.log(strTarget + '>> ' + srcElement.nodeName);

	// Lets check if our underlying element is a DIV.
	if (  srcElement.nodeName == 'DIV' && 100 < srcElement.offsetWidth ) {

	// For NPE checking, we check safely. We need to remove the class name
	// Since we will be styling the new one after.

	if (prevDOM != null) {
	  prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
	}

	// Add a visited class name to the element. So we can style it.
	srcElement.classList.add(MOUSE_VISITED_CLASSNAME);

	// The current element is now the previous. So we can remove the class
	// during the next iteration.		
	prevDOM = srcElement;


	}
}, false);

document.addEventListener('click', function(e) {
	if( settingCopied ) return true;
	e.preventDefault();		
	onClickCursorAnimation( e );	
	copyHtmlToClipboard( '<a href="' + window.location.href + '" > ' + loadSelectedDOMPath() + ' </a>' );
	stopInspctingElements();
});

// On click cursor animation
function onClickCursorAnimation(e){
	var eleDiv = document.createElement("div");
	eleDiv.className = "clickEffect";
	eleDiv.style.top = e.clientY+"px";eleDiv.style.left=e.clientX+"px";
	document.body.appendChild( eleDiv );
	eleDiv.addEventListener( 'animationend',function(){ eleDiv.parentElement.removeChild(eleDiv); }.bind(this) );
}

// Copy html hyperlinked data to clipboard.
function copyHtmlToClipboard(html) {
	clipboardDiv.innerHTML=html;

	var focused=document.activeElement;
	clipboardDiv.focus();

	window.getSelection().removeAllRanges();  
	var range = document.createRange(); 
	range.setStartBefore(clipboardDiv.firstChild);
	range.setEndAfter(clipboardDiv.lastChild);
	window.getSelection().addRange(range);  

	var ok=false;
	try {
	if (document.execCommand('copy')) ok=true; else console.log('execCommand returned false !');
	} catch (err) {
		console.log('execCommand failed ! exception '+err);
	}

	focused.focus();
}
	
function copyToClipboardSetting( selectedMenu ) {
	if( settingCopied && "start_to_inspect" == selectedMenu ) {
		settingCopied = false;
	} else if( !settingCopied && "stop_inspect" == selectedMenu ) {
		settingCopied = true;
	}
	
	if( "copy_setting_path" == selectedMenu ) {
		var menuPath = loadSelectedDOMPath();
		navigator.clipboard.writeText(menuPath);
		stopInspctingElements();
	}
	
	if( "copy_setting_URL" == selectedMenu ) {
		navigator.clipboard.writeText( window.location.href );
		stopInspctingElements();
	}
	
	if( "copy_hypertext_path" == selectedMenu ) {
		copyHtmlToClipboard( '<a href="' + window.location.href + '" > ' + loadSelectedDOMPath() + ' </a>' );
		stopInspctingElements();
	}
	
	return true;
}

function stopInspctingElements() {
	if( prevDOM ) {
		prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
		settingCopied = true;
	}
}

function loadSelectedDOMPath() {
	var menuPath = '';
	var propertyMenu = document.getElementById( "settings_navigation_content" );
	if( propertyMenu && propertyMenu.querySelectorAll('.selected') ) {
		propertyMenu.querySelectorAll('.selected').forEach(function (selectedMenu) {
			menuPath += selectedMenu.textContent.replace(/(?:\r\n|\r|\n)/g, '') + ' >> ';
		});
	}
	if( prevDOM ) {
		menuPath += prevDOM.textContent.replace(/(?:\r\n|\r|\n)/g, '');
	}
	
	return menuPath;
}