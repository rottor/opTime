var startTime = new Date().getTime(); 
var timerInt;
var theButton;

var tabs = opera.extension.tabs;

window.addEventListener("load", function() {
    
    var toolbar = opera.contexts.toolbar;
    
    var sites = parseInt(widget.preferences['sites']);
    
    var UIItemProperties = 
    {
        title: "Time Log",
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
  		
      switch (event.data.event) 
      {
  		  case 'load':  		    
  		    if (timerInt == null) {
  		      startTime = new Date().getTime();
            timerInt = setInterval(timerTick, 1000);
            theButton.badge.display = 'block';
          }
          break;
  		  	//window.opera.postError(tabs.getFocused() + ' ' + event.source);
        case 'focus':
    			 theButton.badge.display = 'block';
    			 if (timerInt == null) {
              startTime = new Date().getTime();
              timerInt = setInterval(timerTick, 1000);
           }
    			 break;
  			 
  			case 'blur':
    			 clearInterval(timerInt);
    			 timerInt = null;
    			 theButton.badge.display = 'none';
    			 if (host == '') return;
    			 var hostime = (localStorage.getItem(host) != null)? localStorage.getItem(host) : 0;
           hostime = Number(hostime) + (new Date().getTime() - startTime);
    			 localStorage.setItem(host, hostime);
  			 
  			    break;
		  }
		};
    
}, false);

function timerTick() 
{
  var seconds = Math.floor((new Date().getTime() - startTime)/1000);
  var nHour = Math.floor(seconds / 3600);
  var nMin = Math.floor((seconds - (nHour * 3600))/60);
  if (nMin < 10) nMin = '0' + nMin;
  theButton.badge.textContent = nHour + ':'+ nMin;
      //window.opera.postError('- tick ' + seconds);
}
