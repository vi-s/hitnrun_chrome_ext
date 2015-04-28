chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    // console.log('content msg rcv');
    // console.log('content msg ', message);

    switch(message.type) {
        // case "colors-div":
        //     var divs = document.querySelectorAll("div");
        //     if(divs.length === 0) {
        //         alert("There are no any divs in the page.");
        //     } else {
        //         for(var i=0; i < divs.length; i++) {
        //             divs[i].style.backgroundColor = message.color;
        //         }
        //     }
        //     break;
        case "start-zap":
            var lowerb = parseFloat(message.data.lowerb),
                upperb = parseFloat(message.data.upperb);

            $(document).ready(function() {

                $('.t1 tbody').children('tr').each(function(i, e) {
                    if(i != 0) {
                        var row = $(e).children('td'),
                            gap = $(row[4]).text(),
                            gap_num = parseFloat(gap.split(' ')[0]),
                            gap_units = gap.split(' ').pop().toUpperCase(),
                            bonus_zap_btn = $(row[10]).find("[type='submit']"),
                            ulcred_zap_btn = $(row[11]).find("[type='submit']");

                        //kb units, definitely use UL credit
                        if (gap_units == 'KB') {
                            $(ulcred_zap_btn).trigger('click');
                        }
                        //gb and tb units, definitely do not use UL credit
                        else if (gap_units == 'GB' || gap_units == 'TB') {
                            $(bonus_zap_btn).trigger('click');
                        }
                        //case for mb units. must test gap_num
                        else {
                            if (gap_num <= upperb) {
                                // use UL cred
                                $(ulcred_zap_btn).trigger('click');                            
                            } else {
                                // use bonus pts
                                $(bonus_zap_btn).trigger('click');
                            }
                        }
                    }
                });

            });

            break;
        default:
            break;
    }
});


//Check jquery version
// if (typeof jQuery != 'undefined') {  
//     // jQuery is loaded => print the version
//     alert(jQuery.fn.jquery);
// }