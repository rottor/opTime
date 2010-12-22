var startTime = new Date().getTime(); 
var timerInt;
var lastTime;
var theButton;

var tabs = opera.extension.tabs;
var extwindow = opera.extension.windows.getFocused();

window.addEventListener("load", function() {
    
    var toolbar = opera.contexts.toolbar;
    
    var sites = parseInt(widget.preferences['sites']);
    
    var UIItemProperties = 
    {
        title: "Opera Time",
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
    			height: (sites)? sites*19+35 : 300
  			},
  			onclick: function() {
  			  clearInterval(timerInt);
  			  timerInt = null;
  			}
    };
    theButton = opera.contexts.toolbar.createItem(UIItemProperties);
    opera.contexts.toolbar.addItem(theButton);
    
    // Listen for messages from the UserJS. {event:'', host:''}
    opera.extension.onmessage = function(event)
    {
  		//window.opera.postError('Received message: ' + event.data.event + ' ' + event.data.host);
  		var host = event.data.host;
  		//window.opera.postError(tabs.getFocused().url + ' ' + event.source);
  		
      switch (event.data.event) 
      {
  		  case 'load':  		    
  		    if (timerInt == null) {
  		      startTime = new Date().getTime();
            timerInt = setInterval(timerTick, 1000);
            showTimerBadge(host);
          }
          break;
        case 'focus':
    			 showTimerBadge(host);
    			 if (timerInt == null) {
              startTime = new Date().getTime();
              timerInt = setInterval(timerTick, 1000);
           }
    			 break;
  			 
  			case 'blur':  			   
  			   lastTime = new Date().getTime() - startTime;
  			   setTimeout(function() { // отложенная проверка на закрытие неактивного окна
              if (extwindow.focused && tabs.getFocused() && tabs.getFocused().url.indexOf(host) != -1)
              {
                startTimeFrom(lastTime);
                showTimerBadge(host);
              }                   
           }, 500);		
  			   
    			 clearInterval(timerInt);
    			 timerInt = null;
    			 theButton.badge.display = 'none';
    			 theButton.title = 'Opera Time is waiting';
    			 if (host == '') return;
    			 var hostime = (localStorage.getItem(host) != null)? localStorage.getItem(host) : 0;
           hostime = Number(hostime) + lastTime;
    			 localStorage.setItem(host, hostime);
  			 
  			    break;
		  }
		};
    
}, false);

function startTimeFrom(back) 
{
  //window.opera.postError( 'startTimeFrom ' + tabs.getFocused().url + extwindow.focused);
  
  startTime = new Date().getTime() - back;
  if (timerInt == null) {
     timerInt = setInterval(timerTick, 1000);
  }
}

function showTimerBadge( host ) 
{
  theButton.badge.display = 'block';
  theButton.title = host || 'OpTime';
}

function timerTick() 
{
  var seconds = Math.floor((new Date().getTime() - startTime)/1000);
  var nHour = Math.floor(seconds / 3600);
  var nMin = Math.floor((seconds - (nHour * 3600))/60);
  if (nMin < 10) nMin = '0' + nMin;
  theButton.badge.textContent = nHour + ':'+ nMin;
      //window.opera.postError('- tick ' + seconds);
}
