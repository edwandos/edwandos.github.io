(function($) {

  $.fn.gCalReader = function(options) {
    var $div = $(this);

    var defaults = $.extend({
        calendarId: 'e5hqsplvit187tbt2eo6522768@group.calendar.google.com',
        apiKey: 'Public_API_Key',
        dateFormat: 'LongDate+shortTime',
        errorMsg: 'No events in calendar',
        maxEvents: 100,
        futureEventsOnly: true,
        sortDescending: true
      },
      options);

    var s = '';
    var feedUrl = 'https://www.googleapis.com/calendar/v3/calendars/' +
      encodeURIComponent(defaults.calendarId.trim()) +'/events?key=' + defaults.apiKey +
      '&orderBy=startTime&singleEvents=true';
      if(defaults.futureEventsOnly) {
        feedUrl+='&timeMin='+ new Date().toISOString();
      }

    $.ajax({
      url: feedUrl,
      dataType: 'json',
      success: function(data) {

        if(defaults.sortDescending){
          data.items = data.items.reverse();
        }
        data.items = data.items.slice(0, defaults.maxEvents + 1);
        
        /*oude shows array declareren*/
        var oldEventDates = [];

        $.each(data.items, function(e, item) {

          var eventdate = item.start.dateTime || item.start.date ||'';
          var summary = item.summary || '';
					var description = item.description;
					var location = item.location;
					var eventDate = formatDate(eventdate, defaults.dateFormat.trim());
					
					/*als het een oud optreden is in array steken, anders tonen */
					if(eventdate < new Date().toISOString()){
						oldEventDates.push(item);
					}
					else{
						
						/*als er in description een link is --> title clickable maken naar link*/
						/*check voor link in description*/
						if(description){
							if(description.indexOf('http') != -1){
								/* rond de http tag <a> element zetten */
								var parts = description.split('http');
								s = '<div class="eventtitle"><a href=http' + parts[1] + ' target="_blank">'+ summary +'</a></div>';
							}
							else s ='<div class="eventtitle">'+ summary +'</div>';
						}
						else s ='<div class="eventtitle">'+ summary +'</div>';
						
						
						
						s +='<div class="eventdate"> When: ' + eventDate +'</div>';
						
						if(location) {
							s +='<div class="location">Where: '+ location +'</div>';
						}
						
						if(description) { 
							if(description.indexOf('http') != -1){
								/* checken als er http instaat --> link niet tonen  */
								var parts = description.split('http');
								if(parts.length = 1) s += '<div class="description">' + parts[0] + '</div>';
							}
							/* geen http -> zowiezo tonen */
							else s += '<div class="description">' + description + '</div>';
						}
						
						s +='<div>&nbsp;</div>';
						$($div).append('<li>' + s + '</li>');
					}
        });
        
        /*oude optredens in array checken en onderaan tonen*/
        if(oldEventDates.length > 0){
        /*volgorde van events omkeren voor ordering*/
        		/*oldEventDates.sort();*/
        	oldEventDates.reverse();
        	var maxCounter = 0;
        	
        	$.each(oldEventDates, function(e, item) {
        		
        		//aantal oude evenementen bijhouden, als de teller boven 5 gaat moeten de li elementen een hidden class krijgen
        		maxCounter++;
        		/*enkel de eerste keer de titel toevoegen */
				if (e == 0){
					$($div).append('<div class="title">Previous Shows<br/><br/></div>');
					}
				/* Oude event tonen */
				var eventdate = item.start.dateTime || item.start.date ||'';
				var summary = item.summary || '';
				var description = item.description;
				var location = item.location;
				var eventDate = formatDate(eventdate, defaults.dateFormat.trim());
				
				if(description){
						if(description.indexOf('http') != -1){
							/* rond de http tag <a> element zetten */
							var parts = description.split('http');
							s = '<div class="eventtitle previous"><a href=http' + parts[1] + ' target="_blank">'+ summary +'</a></div>';
						}
						else s ='<div class="eventtitle previous">'+ summary +'</div>';
					}
					else s ='<div class="eventtitle previous">'+ summary +'</div>';
					
					/* s +='<div class="eventdate"> When: ' + eventDate +'</div>'; */
					
					/*
if(location) {
						s +='<div class="location">Where: '+ location +'</div>';
					}
					
					if(description) { 
						if(description.indexOf('http') != -1){
							/* checken als er http instaat --> link niet tonen  */
							/* var parts = description.split('http'); */
							/*
if(parts.length = 1) s += '<div class="description">' + parts[0] + '</div>';
						}
*/
						/* geen http -> zowiezo tonen */
					/*
	else s += '<div class="description">' + description + '</div>';
					}*/


					
					/* s +='<div>&nbsp;</div>'; */
					
  					if(maxCounter > '5'){
  						if(maxCounter == '6'){
                if($(window).width() > 900){
  							 $($div).append('<div>&nbsp;</div><div id="toggle_container"><div id="toggle_left"><hr class="toggle_line"></div><div id="toggle_button"><i class="fa fa-chevron-down fa-2x"></i></div><div id="toggle_right"><hr class="toggle_line"></div></div>');

                 $('#toggle_button').css('cursor','pointer').click(function(){
      
                    if ($('.toggle_event').css('display') != 'block'){
                      $('#toggle_container').css('padding-bottom','10px');
                      $('.toggle_event').css('display','block');
                      $('#toggle_button').html('<i class="fa fa-chevron-up fa-2x"></i>');
                    }
                    else{
                    $('#toggle_container').css('padding-bottom','20px');
                      $('.toggle_event').css('display','none');
                      $('#toggle_button').html('<i class="fa fa-chevron-down fa-2x"></i>');
                    }
                     
                   });
  						  }
              }
  						$($div).append('<li class="toggle_event">' + s + '</li>');
  					}
  					else $($div).append('<li>' + s + '</li>');
          
					

			});
		}
        
      },
      error: function(xhr, status) {
        $($div).append('<p>' + status +' : '+ defaults.errorMsg +'</p>');
      }
    });

    function formatDate(strDate, strFormat) {
      var fd, arrDate, am, time;
      var calendar = {
        months: {
          full: ['', 'January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September', 'October',
            'November', 'December'
          ],
          short: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
            'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ]
        },
        days: {
          full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
            'Friday', 'Saturday', 'Sunday'
          ],
          short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
            'Sun'
          ]
        }
      };

      if (strDate.length > 10) {
        arrDate = /(\d+)\-(\d+)\-(\d+)T(\d+)\:(\d+)/.exec(strDate);

        am = (arrDate[4] < 12);
        time = am ? (parseInt(arrDate[4]) + ':' + arrDate[5] + ' AM') : (
          arrDate[4] - 12 + ':' + arrDate[5] + ' PM');

        if (time.indexOf('0') === 0) {
          if (time.indexOf(':00') === 1) {
            if (time.indexOf('AM') === 5) {
              time = 'MIDNIGHT';
            } else {
              time = 'NOON';
            }
          } else {
            time = time.replace('0:', '12:');
          }
        }

      } else {
        arrDate = /(\d+)\-(\d+)\-(\d+)/.exec(strDate);
        time = 'Time not present in feed.';
      }

      var year = parseInt(arrDate[1]);
      var month = parseInt(arrDate[2]);
      var dayNum = parseInt(arrDate[3]);

      var d = new Date(year, month - 1, dayNum);

      switch (strFormat) {
        case 'ShortTime':
          fd = time;
          break;
        case 'ShortDate':
          fd = month + '/' + dayNum + '/' + year;
          break;
        case 'LongDate':
          fd = calendar.days.full[d.getDay()] + ' ' + calendar.months.full[
            month] + ' ' + dayNum + ', ' + year;
          break;
        case 'LongDate+ShortTime':
          fd = calendar.days.full[d.getDay()] + ' ' + calendar.months.full[
            month] + ' ' + dayNum + ', ' + year + ' ' + time;
          break;
        case 'ShortDate+ShortTime':
          fd = month + '/' + dayNum + '/' + year + ' ' + time;
          break;
        case 'DayMonth':
          fd = calendar.days.short[d.getDay()] + ', ' + calendar.months.full[
            month] + ' ' + dayNum;
          break;
        case 'MonthDay':
          fd = calendar.months.full[month] + ' ' + dayNum;
          break;
        case 'YearMonth':
          fd = calendar.months.full[month] + ' ' + year;
          break;
        default:
          fd = calendar.days.full[d.getDay()] + ' ' + calendar.months.short[
            month] + ' ' + dayNum + ', ' + year + ' ' + time;
      }

      return fd;
    }
  };

}(jQuery));
