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
                var surplus_ul_cred = $('#cU').text().match(/[0-9]+\.[0-9]{1,2}\s+[a-zA-Z]{2}/),
                    surplus_num = surplus_ul_cred.split(' ')[0],
                    surplus_units = surplus_ul_cred.split(' ').pop(),
                    surplus_mb = 0;

                // Normalize UL credit units to standard MB units
                if (surplus_units == 'KB') {
                    surplus_mb = surplus_num / 1024.0;
                } else if (surplus_units == 'MB') {
                    surplus_mb = surplus_num;
                } else if (surplus_units == 'GB') {
                    surplus_mb = surplus_num * 1024;
                } else if (surplus_units == 'TB') {
                    surplus_mb = surplus_num * 1024 * 1024;                    
                }

                var current_bonus = $('#cB').text().match(/[0-9]+\.[0-9]{1,2}/),
                    current_bonus = parseFloat(current_bonus);

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
                            surplus_mb -= gap_num / 1024;
                        }
                        //gb,tb,pb units, definitely do not use UL credit
                        else if (gap_units == 'GB' || gap_units == 'TB' || gap_units == 'PB') {
                            $(bonus_zap_btn).trigger('click');
                            current_bonus -= 50;
                        }
                        //case for mb units. must test gap_num
                        else {
                            if (gap_num <= upperb) {
                                // use UL cred
                                $(ulcred_zap_btn).trigger('click'); 
                                surplus_mb -= gap_num;
                            } else {
                                // use bonus pts
                                $(bonus_zap_btn).trigger('click');
                                current_bonus -= 50;
                            }
                        }
                    }
                });

                if (surplus_mb * 1024 < lowerb) {
                    alert('Insufficient upload credit to zap all torrents!')
                }

                if (current_bonus < 0) {
                    alert('Insufficient bonus credit to zap all torrents!')
                }
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