var startTime = new Date().getTime();
var sessStartTime = startTime;
var lastTime;
var timerInt;
var theButton;

var tabs = opera.extension.tabs;
var extwindow = opera.extension.windows.getFocused();

window.addEventListener("load", function() 
{
    if (localStorage['ext:firstTime'] == undefined) localStorage['ext:firstTime'] = startTime;
    
    var toolbar = opera.contexts.toolbar;    
    var sites = parseInt(widget.preferences['sites']);
    
    var UIItemProperties = 
    {
        title: "OpTime",
        icon: "icons/icon22.png",
        badge: {
    			textContent: '',
    			backgroundColor: '#d00',
    			color: '#fff',
    			display: 'block'
    		},
    		popup: {
    			href: "popup.html",
    			width: 250,
    			height: (sites)? sites*19+55 : 300
  			},
  			onclick: function() {
  			  clearInterval(timerInt);
  			  timerInt = null;
  			}
    };
    theButton = opera.contexts.toolbar.createItem(UIItemProperties);
    opera.contexts.toolbar.addItem(theButton);
    
    // connecting to popup
    opera.extension.onconnect = function(event){
      event.source.postMessage("bg_connect");
    }
    
    // Listen for messages from the UserJS. {event:'', host:''}
    opera.extension.onmessage = function(event)
    {
  		//window.opera.postError('Received message: ' + event.data.event + ' ' + event.data.host);
  		var host = event.data.host;
  		
      switch (event.data.event) 
      {
  		  case 'load':  		    
  		    if (timerInt == null) {
  		      startTime = new Date().getTime();
  		      sessStartTime = startTime - Number(sessionStorage.getItem(host));
            timerInt = setInterval(timerTick, 1000);
            showTimerBadge(host);
          }
          break;
        case 'focus':
    			 showTimerBadge(host);    			 
           startTimeFrom(0);
           sessStartTime = startTime - Number(sessionStorage.getItem(host));    			 
    			 break;
  			 
  			case 'blur':  			   
  			   lastTime = new Date().getTime() - startTime;
  			   setTimeout(function() { // отложенная проверка на закрытие неактивного окна
              if (extwindow.focused && tabs.getFocused() && tabs.getFocused().url.indexOf(host) != -1)
              {
                if (timerInt == null) startTimeFrom(lastTime);
                showTimerBadge(host);
              }                   
           }, 1000);		
  			   
    			 clearInterval(timerInt);
    			 timerInt = null;
    			 theButton.badge.display = 'none';
    			 theButton.title = 'OpTime is waiting';
    			 
           if (host == '') return;
           saveStorage(sessionStorage, host);
    			 saveStorage(localStorage, host);    			 
  			   break;
  			   
  			case 'clearAll':
  			  
  			   localStorage.clear();
  			   sessionStorage.clear();
  			   event.source.postMessage('refresh');
  			   break;
		  }
		};    
}, false);

function startTimeFrom(back) 
{
  //window.opera.postError( 'startTimeFrom ' + ' ' + back);//tabs.getFocused().url + extwindow.focused);
  
  startTime = new Date().getTime() - back;
  if (timerInt == null) {
     timerInt = setInterval(timerTick, 1000);
  }
}

function saveStorage(storage, host) 
{
  var hostime = (storage.getItem(host) != null)? storage.getItem(host) : 0;
  hostime = Number(hostime) + lastTime;
  storage.setItem(host, hostime);
  //window.opera.postError( 'save ' + host + ': ' + storage.getItem(host) );
}


function showTimerBadge( host ) 
{
  theButton.badge.display = 'block';
  theButton.title = host || 'OpTime';
}

function timerTick() 
{
  var timePast = (widget.preferences['timerFor'] == 'tab')? startTime : sessStartTime ;
  
  var seconds = Math.floor((new Date().getTime() - timePast)/1000);
  var nHour = Math.floor(seconds / 3600);
  var nMin = Math.floor((seconds - (nHour * 3600))/60);
  if (nMin < 10) nMin = '0' + nMin;
  theButton.badge.textContent = nHour + ':'+ nMin;
      //window.opera.postError('- tick ' + seconds);
}
