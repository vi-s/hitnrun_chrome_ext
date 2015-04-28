chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    console.log('content msg rcv');
    switch(message.type) {
        case "colors-div":
            var divs = document.querySelectorAll("div");
            if(divs.length === 0) {
                alert("There are no any divs in the page.");
            } else {
                for(var i=0; i < divs.length; i++) {
                    divs[i].style.backgroundColor = message.color;
                }
            }
        break;
    }
});

//Check jquery version
// if (typeof jQuery != 'undefined') {  
//     // jQuery is loaded => print the version
//     alert(jQuery.fn.jquery);
// }