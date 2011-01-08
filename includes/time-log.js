// ==UserScript==
// @name OpTime
// @author Yuri K.  
// @version 1.03
// @description  logs time for each site (host)
// @ujs:category general: tools
// @ujs:modified 2010-12-27 23:20
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


function onLoad (e) 
{
  try { if (window.top.location.hostname != window.location.hostname) return;
        opera.extension.postMessage( {event:'load', host: window.location.hostname} );
   } 
  catch (e) {  window.opera.postError('- ' + e + ' ' + window.location.hostname); }
  
}



