window.onload = function() {
    // document.getElementById("button").onclick = function() {
    //     chrome.extension.sendMessage({
    //         type: "color-divs"
    //     });
    // }

    document.getElementById("auto-zap").onclick = function() {
    	// message -> background page
		chrome.extension.sendMessage({
			type: 'zap-start',
			data: {
				lowerb: document.getElementById('ul-cred-min').value,
				upperb: document.getElementById('ul-cred-max').value		
			}
		});
    }

}
