$("img").click(function(event){
  var I = 0;
  var t4 = setInterval(function(){
    if ($("#theTarget").length > 0) {
      $("#theTarget").skippr({
        transition: 'fade',
        speed: 500,
        easing: 'easeOutQuart',
        navType: 'bubble',
        childrenElementType: 'img',
      });
      I = I + 1;
      console.log(I)
      if (I > 200) clearInterval(t4)
    }
  }, 10)
});