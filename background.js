function ThresholdState(lowerb, upperb) {
	this.lowerb = lowerb;
	this.upperb = upperb;
}

var thresh_state = new ThresholdState(0, 0)

// listening for an event / one-time requests
// coming from the popup
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('bg msg rcv');
	console.log(request)
    switch(request.type) {
        case "color-divs":
            colorDivs();
           	break;
        case "update-thresh":
        	console.log('lb: ', request.lowerb, ' ub: ', request.upperb);
        	break;
        default:
        	break;
    }
    return true;
});

// send a message to the content script
var colorDivs = function() {
    chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, {type: "colors-div", color: "#F00"});
        // setting a badge
        chrome.browserAction.setBadgeText({text: "red!"});
    });
}
 