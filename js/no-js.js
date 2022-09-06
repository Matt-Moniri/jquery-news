/*
      F o r      w h e n      J a v a s c r i p t      i s      d i s a b l e d
  
  In the html inside <body> we have 2 divs. 
  The first is the div that is shown when js is disabled.
  The second div is the whole elemnts that is shown when js is enabled.
  In css we hide the second div. 
  So when the page loads, the first div is showing 
  but the main content which is inside the second div is hidden.
  If javascript is enabled the code below loads.
  And then it removes the class of the second div so it automatically bocomes shown.
  also it hides the first div which is the alert.  

 */

$("body>div").removeClass("shownWhenJs");
$noJS = $(".shownWhenNoJs").hide();


