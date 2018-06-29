#Onstar H5调用源生loading页面

1.加载附件中的WebViewJavascriptBridge.js

2.JS调用Demo:

##Android
###显示loadingView
           window.WebViewJavascriptBridge.callHandler(
              'showLoading', {
                  'param': 'showLoading'
              },
              function(responseData) {}
           );
           
###关闭loadingView
           window.WebViewJavascriptBridge.callHandler(
              'closeLoading', {
                  'param': 'closeLoading'
              },
              function(responseData) {}
           );


##iOS
###显示loadingView
           requestAnimationFrame(function() {
              if(window.webkit && window.webkit.messageHandlers) {
                  window.webkit.messageHandlers.showLoading.postMessage();
              } else {
                  try {
                     showLoading();
                  } catch(err) {
                     //onstar.topTips("call ios app loading fail");
                     console.log("showAppLoading fail");
                  }
 
              }
           });

###关闭loadingView

           requestAnimationFrame(function() {
              if(window.webkit && window.webkit.messageHandlers) {
                  window.webkit.messageHandlers.closeLoading.postMessage();
              } else {
                  try {
                     closeLoading();
                  } catch(err) {
                     console.log("closeAppLoading fail");
                  }
 
              }
           });

