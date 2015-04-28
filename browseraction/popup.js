window.onload = function() {
  // document.getElementById("button").onclick = function() {
  //   chrome.extension.sendMessage({
  //     type: "color-divs"
  //   });
  // }

  document.getElementById("auto-zap").onclick = function() {
    var lowerb = document.getElementById('ul-cred-min').value,
        upperb = document.getElementById('ul-cred-max').value;

    // validate input
    if(!isNumber(lowerb) || !isNumber(upperb)) {
       alert('Invalid integer');
       return;
    }

    // message -> background page
    chrome.extension.sendMessage({
      type: 'zap-start',
      data: {
        lowerb: lowerb,
        upperb: upperb    
      }
    });
  }

}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}