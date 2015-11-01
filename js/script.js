
$(window).ready(function(){

	
	if(!$("html").hasClass("touch")){
	    /* background fix */
	    $(".parallax").css("background-attachment", "fixed");
	}

	/* set parallax background-position */
	function parallaxPosition(e){
    var heightWindow = $(window).height();
    var topWindow = $(window).scrollTop();
    var bottomWindow = topWindow + heightWindow;
    var currentWindow = (topWindow + bottomWindow) / 2;
    $(".parallax").each(function(i){
        var path = $(this);
        var height = path.height();
        var top = path.offset().top;
        var bottom = top + height;
        // only when in range
        if(bottomWindow > top && topWindow < bottom){
            var imgW = path.data("resized-imgW");
            var imgH = path.data("resized-imgH");
            // min when image touch top of window
            var min = 0;
            // max when image touch bottom of window
            var max = - imgH + heightWindow;
            // overflow changes parallax
            var overflowH = height < heightWindow ? imgH - height : imgH - heightWindow; // fix height on overflow
            top = top - overflowH;
            bottom = bottom + overflowH;
            // value with linear interpolation
            var value = min + (max - min) * (currentWindow - top) / (bottom - top);
            // set background-position
            var orizontalPosition = path.attr("data-oriz-pos");
            orizontalPosition = orizontalPosition ? orizontalPosition : "50%";
            $(this).css("background-position", orizontalPosition + " " + value + "px");
	        }
	    });
	}
	
	if(!$("html").hasClass("touch")){
	    $(window).resize(parallaxPosition);
	    //$(window).focus(parallaxPosition);
	    $(window).scroll(parallaxPosition);
	    parallaxPosition();
	}

	/*scroll trigger*/
	$(window).scroll( function() {
		
	     if ($(window).scrollTop() >=200) {
	     	//alert($(window).scrollTop());
	     	$('.navigation').addClass('animated bounceInDown active');
	     	}
	     else 
	     	$('.navigation').removeClass('animated bounceInDown active');
	 });
	 
	 /*scrollto function*/
	 
	 $(".scrollto").click(function() { 
        var scrolltarget = $(this).attr('href');
        var li = $(this).parent().parent().find('li');
        var toposition = li.index($(this).parent());
        
        if (toposition < 0) toposition = toposition*-1;

        var fromposition = li.index($(this).parent().parent().find('li.active'));
        var nbrposition = parseInt(fromposition)-parseInt(toposition);
        if (nbrposition<0) nbrposition = nbrposition*-1;

         $('html, body').animate({
            scrollTop:$(scrolltarget).offset().top
        }, nbrposition*700);
        
        return false;
    });
    
    /*google calendar event reader */
    
    $(function ($) {
       $('#events').gCalReader({
         calendarId:'e5hqsplvit187tbt2eo6522768@group.calendar.google.com', 
         apiKey:'AIzaSyAVhU0GdCZQidylxz7whIln82rWtZ4cIDQ',
         maxEvents:15,
         futureEventsOnly: false,
         sortDescending: false
        });
	 });
 });