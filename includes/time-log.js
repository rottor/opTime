// ==UserScript==
// @name opTimer
// @author UK  
// @version 0.2
// @description  logs time for each site (host)
// @ujs:category general: enhancements
// @ujs:modified 2010-12-09 02:21
// ==/UserScript==

window.addEventListener('load', onLoad, false);
window.addEventListener('focus', onFocus, false);     
window.addEventListener('blur', onBlur, false);
window.addEventListener('unload', onBlur, false);



function onFocus (e) 
{
  //window.opera.postError('focus ');
  time = new Date().getTime();
  opera.extension.postMessage( {event:'focus', host: window.location.hostname} );
}


function onBlur (e) 
{
  //window.opera.postError('blur');
  opera.extension.postMessage( {event:'blur', host: window.location.hostname} );
}


function onLoad (e) 
{
  //window.opera.postError('TimeLog onLoad');
  opera.extension.postMessage( {event:'load', host: window.location.hostname} );
}



