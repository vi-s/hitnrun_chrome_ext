'use strict'

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
      // min ul credit required to remain
      var lowerb = parseFloat(message.data.lowerb), 
          // max UL credit required to zap torrent
          upperb = parseFloat(message.data.upperb);

      var zapr = new Zapper(lowerb, upperb);
      zapr.init_zap();
      break;
    default:
      break;
  }
});

// Zapper class
function Zapper(lowerb, upperb) {
  this.lowerb = lowerb;
  this.upperb = upperb;
}

// Zapper prototype methods
Zapper.prototype = {
  // Init user data values, and start zap event chain
  init_zap: function() {
    var _this = this;
    $(document).ready(function() {
      var ud = _this.grab_user_data();
      this.current_bonus = ud.current_bonus;
      this.surplus_mb = ud.surplus_mb;
      this.lowerb_exceeded = false;

      console.log('Pre Zap Stats --')
      console.log('Current Bonus:', this.current_bonus, 
        'Surplus MB:', this.surplus_mb);
      // Start zap event chain
      _this.process_hnrs();
      // callback not necessary for post stats, since there is no
      // async activity.
      console.log('Post Zap Stats --')
      var post_ud = _this.grab_user_data();
      console.log('Current Bonus:', post_ud.current_bonus, 
        'Surplus MB:', post_ud.surplus_mb);
    });    
  },
  // Parse and click all the Hit and Run warnings intelligently
  // according to user inputs.
  process_hnrs: function() {
    var _this = this;

    $('.t1 tbody').children('tr').each(function(i, e) {
      // process all non-header rows
      if(i != 0) {
        // grab row data and button elements
        var row = $(e).children('td'),
            gap = $(row[4]).text(),
            //the gap num is how much we actually pay to remove the hit'n'run
            gap_num = parseFloat(gap.split(' ')[0]),
            gap_units = gap.split(' ').pop().toUpperCase(),
            bonus_zap_btn = $(row[10]).find("[type='submit']"),
            ulcred_zap_btn = $(row[11]).find("[type='submit']");

        // check for exceeding lowerb
        if (_this.surplus_mb / 1000 < _this.lowerb) {
          _this.lowerb_exceeded = true;
        }

        _this.intelligently_click(gap_num, gap_units, 
          bonus_zap_btn, ulcred_zap_btn);
      }
    });
    // we are okay calling this here since the .each() above will not be async
    _this.check_and_display_warnings();
  },
  intelligently_click: function(gap_num, gap_units, bonus_zap_btn, ulcred_zap_btn) {
    var _this = this;
    //kb units, definitely use UL credit
    if (gap_units == 'KB') {
      _this.click_ulcred_btn(ulcred_zap_btn, gap_num / 1000)
    }
    //gb,tb,pb units, definitely do not use UL credit
    else if (gap_units == 'GB' || gap_units == 'TB' || gap_units == 'PB') {
      _this.click_bonus_btn(bonus_zap_btn);
    }
    //case for mb units. must test gap_num
    else {
      // use UL cred
      if (gap_num <= _this.upperb) {
        _this.click_ulcred_btn(ulcred_zap_btn, gap_num);
      } else {
        // use bonus pts
        _this.click_bonus_btn(bonus_zap_btn);
      }
    }
  },
  click_ulcred_btn: function (ulcred_zap_btn, dec_amt) {
    if (!this.lowerb_exceeded) {
      $(ulcred_zap_btn).trigger('click'); 
      this.surplus_mb -= dec_amt;            
    }
  },
  click_bonus_btn: function (bonus_zap_btn) {
    if (this.current_bonus >= 50) {
      $(bonus_zap_btn).trigger('click');
      this.current_bonus -= 50;
    }
  },
  // WARNINGS in case we overran bonus amt or UL lower bounds
  check_and_display_warnings: function () {
    if (this.surplus_mb / 1000 < this.lowerb) {
      alert('Upload credit below lower bound! Insufficient upload credit to zap all torrents.')
    }

    if (this.current_bonus < 0) {
      alert('Insufficient bonus credit to zap all torrents!')
    }
  },
  grab_user_data: function () {
    return {
      current_bonus: this.grab_bonus(),
      surplus_mb: this.grab_surplus_ul()
    }
  },
  grab_bonus: function () {
    var current_bonus = $('#cB').text().match(/[0-9]+\.[0-9]{1,2}/)[0],
        current_bonus = parseFloat(current_bonus);

    return current_bonus;
  },
  grab_surplus_ul: function () {
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
  }
};

//Check jquery version
// if (typeof jQuery != 'undefined') {  
//   // jQuery is loaded => print the version
//   alert(jQuery.fn.jquery);
// }
