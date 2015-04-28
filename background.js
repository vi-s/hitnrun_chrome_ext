// listening for an event / one-time requests
// coming from the popup
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "zap-start":
        	start_zap(request.data.lowerb, request.data.upperb);
        	break;
        // case "color-divs":
        //     colorDivs();
        //    	break;
        default:
        	break;
    }
    return true;
});

// send a message to the content script

function start_zap(lowerb, upperb) {
    chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, {
        	type: "start-zap",
        	data: {
        		lowerb: lowerb,
        		upperb: upperb
        	}
        });
        // setting a badge
        chrome.browserAction.setBadgeText({text: "zap'd!"});
    });	
}

// var colorDivs = function() {
//     chrome.tabs.getSelected(null, function(tab){
//         chrome.tabs.sendMessage(tab.id, {type: "colors-div", color: "#F00"});
//         // setting a badge
//         chrome.browserAction.setBadgeText({text: "red!"});
//     });
// }
//  