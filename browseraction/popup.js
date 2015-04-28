window.onload = function() {
    document.getElementById("button").onclick = function() {
        chrome.extension.sendMessage({
            type: "color-divs"
        });
    }

    document.getElementById("auto-zap").onclick = function() {
    	// update_thresholds();
		chrome.extension.sendMessage({
			type: 'update-thresh'
		});
    }

}

function update_thresholds() {
    // message -> background page
	chrome.extension.sendMessage({
		type: 'update-thresh',
		lowerb: document.getElementById('ul-cred-min'),
		upperb: document.getElementById('ul-cred-max')
	});
};