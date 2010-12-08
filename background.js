var startTime = new Date().getTime(); // время запуска отсчета
var lstorage; // локальное хранилище ?
var timerInt; // интервал для отсчета
var theButton; // кнопка расширения

window.addEventListener("load", function() {
    
    var toolbar = opera.contexts.toolbar;
    
    var UIItemProperties = 
    {
        title: "Time Log",
        icon: "icons/small.png",
        badge: {
    			textContent: '0',
    			backgroundColor: '#00f',
    			color: '#fff',
    			display: 'block'
    		},
    		popup: {
    			href: "popup.html",
    			width: 250,
    			height: 300
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
  		window.opera.postError('Received message: ' + event.data.event + ' ' + event.data.host);
  		var host = event.data.host;
  		
      switch (event.data.event) 
      {
  		  case 'load':
  		  	//window.opera.postError(opera.extension.tabs.getFocused() + ' ' + event.source);
        case 'focus':
  			 startTime = new Date().getTime();
  			 if (timerInt == null)
         timerInt = setInterval(timerTick, 1000);
  			 break;
  			 
  			case 'blur':
  			 var hostime = (localStorage.getItem(host) != null)? localStorage.getItem(host) : 0;
         hostime = Number(hostime) + (new Date().getTime() - startTime);
  			 localStorage.setItem(host, hostime);
  			 
  			 break;
		  }
		}
    
}, false);

function timerTick() 
{
  var seconds = Math.floor((new Date().getTime() - startTime)/1000);
  var nHour = Math.floor(seconds / 3600);
  var nMin = Math.floor((seconds - (nHour * 3600))/60);
  if (nMin < 10) nMin = '0' + nMin;
  theButton.badge.textContent = nHour + ':'+ nMin;
}
