// ==UserScript==
// @name time-log
// @author UK  
// @version 0.1
// @description  logs time for each site
// @ujs:category general: enhancements
// @ujs:modified 2010-10-29 23:01
// ==/UserScript==

window.addEventListener('load', onLoad, false);

var storageUjs;

var time = 0;
var ujglobal;



(function(opera, storage)
  {	
	
  	if (typeof storage == 'undefined') return;
  	
  	var host = window.location.hostname;
    var cur = storage[host] || 0;
  	storage[host] = Number(cur) + 1;
  	storage["t_"+host] = storage["t_"+host] || 0;
  	time = new Date().getTime();
  	
  	window.opera.postError('main func ' + host);
  
  	storageUjs = storage; // сохраняем в глобальную
  	
  	window.addEventListener('focus', onFocus, false);     
    window.addEventListener('blur', onBlur, false);
    
  }
)(window.opera, window.opera.scriptStorage);



function onFocus (e) 
{
  //window.opera.postError('focus ');
  time = new Date().getTime();
  opera.extension.postMessage( {event:'focus', host: window.location.hostname} );
}


function onBlur (e) 
{
  var sitetime = storageUjs[window.location.hostname] || '0';
	storageUjs[window.location.hostname] = Number(sitetime) + (new Date().getTime() - time);
  //window.opera.postError('blur');
  opera.extension.postMessage( {event:'blur', host: window.location.hostname} );
}


function onLoad (e) 
{
  //window.opera.postError('TimeLog onLoad');
    // if (e.event.target instanceof Document) e.preventDefault(); 
}



