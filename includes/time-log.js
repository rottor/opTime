// ==UserScript==
// @name Opera Time
// @author Yuri K.  
// @version 1.01
// @description  logs time for each site (host)
// @ujs:category general: enhancements
// @ujs:modified 2010-12-21 02:21
// ==/UserScript==

window.addEventListener('load', onLoad, false);
window.addEventListener('focus', onFocus, false);     
window.addEventListener('blur', onBlur, false);
window.addEventListener('unload', onUnload, false);



function onFocus (e) 
{
  opera.extension.postMessage( {event:'focus', host: window.location.hostname} );
}


function onBlur (e) 
{
  try { if (window.top.location.hostname != window.location.hostname) return;
       opera.extension.postMessage( {event:'blur', host: window.location.hostname} );
   } 
  catch (e) {  window.opera.postError('- ' + e + ' ' + window.location.hostname); }
  
}

function onUnload (e) 
{
  try { if (window.top.location.hostname != window.location.hostname) return;
       opera.extension.postMessage( {event:'unload', host: window.location.hostname} );
   } 
  catch (e) {  window.opera.postError('- ' + e + ' ' + window.location.hostname); }
  
}

function trace (e) 
{
  opera.extension.postMessage( {event:e.type, host: window.location.hostname} );
}


function onLoad (e) 
{
  try { if (window.top.location.hostname != window.location.hostname) return;
        opera.extension.postMessage( {event:'load', host: window.location.hostname} );
   } 
  catch (e) {  window.opera.postError('- ' + e + ' ' + window.location.hostname); }
  
}



