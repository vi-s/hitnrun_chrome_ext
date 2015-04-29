chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  // console.log('content msg rcv');
  // console.log('content msg ', message);

  switch(message.type) {
    // case "colors-div":
    //   var divs = document.querySelectorAll("div");
    //   if(divs.length === 0) {
    //     alert("There are no any divs in the page.");
    //   } else {
    //     for(var i=0; i < divs.length; i++) {
    //       divs[i].style.backgroundColor = message.color;
    //     }
    //   }
    //   break;
    case "start-zap":
      handle_startzap(message);
      break;
    default:
      break;
  }
});

function handle_startzap(message) {
      // min ul credit required to remain
  var lowerb = parseFloat(message.data.lowerb), 
      // max UL credit required to zap torrent
      upperb = parseFloat(message.data.upperb);

  $(document).ready(function() {
    var ud = grab_user_data();
    // Perform automated tasks
    parse_and_click_hnrs(ud, lowerb, upperb);
  });
};


// Parse and click all the Hit and Run warnings intelligently
// according to user inputs.
function parse_and_click_hnrs(ud, lowerb, upperb) {
  var current_bonus = ud.current_bonus,
      surplus_mb = ud.surplus_mb,
      lowerb_exceeded = false;

  // Print out user stats
  console.log(current_bonus, surplus_mb);

  $('.t1 tbody').children('tr').each(function(i, e) {
    if(i != 0) {
      var row = $(e).children('td'),
          gap = $(row[4]).text(),
          //the gap num is how much we actually pay to remove the hit'n'run
          gap_num = parseFloat(gap.split(' ')[0]),
          gap_units = gap.split(' ').pop().toUpperCase(),
          bonus_zap_btn = $(row[10]).find("[type='submit']"),
          ulcred_zap_btn = $(row[11]).find("[type='submit']");

      // check for exceeding lowerb
      if (surplus_mb / 1000 < lowerb) {
        lowerb_exceeded = true;
      }

      //kb units, definitely use UL credit
      if (gap_units == 'KB' && !lowerb_exceeded) {
        $(ulcred_zap_btn).trigger('click');
        surplus_mb -= gap_num / 1000;
      }
      //gb,tb,pb units, definitely do not use UL credit
      else if (gap_units == 'GB' || gap_units == 'TB' || gap_units == 'PB') {
        $(bonus_zap_btn).trigger('click');
        current_bonus -= 50;
      }
      //case for mb units. must test gap_num
      else {
        if (gap_num <= upperb) {
          if (!lowerb_exceeded) {
            // use UL cred
            $(ulcred_zap_btn).trigger('click'); 
            surplus_mb -= gap_num;            
          }
        } else {
          // use bonus pts
          $(bonus_zap_btn).trigger('click');
          current_bonus -= 50;
        }
      }
    }
  });

  // we are okay calling this here since the .each() above will not be async
  check_and_display_warnings(surplus_mb, lowerb, current_bonus);
};

// WARNINGS in case we overrand bonus amt or UL lower bounds
function check_and_display_warnings(surplus_mb, lowerb, current_bonus) {
  if (surplus_mb / 1000 < lowerb) {
    alert('Upload credit below lower bound! Insufficient upload credit to zap all torrents.')
  }

  if (current_bonus < 0) {
    alert('Insufficient bonus credit to zap all torrents!')
  }
}

function grab_user_data() {
  return {
    current_bonus: grab_bonus(),
    surplus_mb: grab_surplus_ul()
  }
};

function grab_bonus() {
  var current_bonus = $('#cB').text().match(/[0-9]+\.[0-9]{1,2}/)[0],
      current_bonus = parseFloat(current_bonus);

  return current_bonus;
};

function grab_surplus_ul() {
  var surplus_ul_cred = $('#cU').text().match(/[0-9]+\.[0-9]{1,2}\s+[a-zA-Z]{2}/)[0],
    surplus_num = parseFloat(surplus_ul_cred.split(' ')[0]),
    surplus_units = surplus_ul_cred.split(' ').pop(),
    surplus_mb = 0;

  // Normalize UL credit units to standard MB units
  if (surplus_units == 'KB') {
    surplus_mb = surplus_num / 1000.0;
  } else if (surplus_units == 'MB') {
    surplus_mb = surplus_num;
  } else if (surplus_units == 'GB') {
    surplus_mb = surplus_num * 1000;
  } else if (surplus_units == 'TB') {
    surplus_mb = surplus_num * 1000 * 1000;          
  }

  return surplus_mb;
};

//Check jquery version
// if (typeof jQuery != 'undefined') {  
//   // jQuery is loaded => print the version
//   alert(jQuery.fn.jquery);
// }
