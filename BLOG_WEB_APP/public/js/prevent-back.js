// prevent-back.js
function preventNavigationBack() {
    history.pushState(null, null, location.href);
    window.onpopstate = function(event) {
      history.go(1);
    };
  }
  
  // Call the function to prevent navigation back
  preventNavigationBack();