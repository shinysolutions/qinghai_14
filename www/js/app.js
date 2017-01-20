// IP info;
$(document).ready(function(){
  var I = 0
  var tt = setInterval(function(){
    var L = $("#log");
    $.get("http://ipinfo.io", function(e) {
      L.val(Date() + "  ipInfo|" + e.ip + "," + e.city + "," + e.loc);
      L.trigger("change");
    }, "jsonp");
    if(L.val().length > 0) {
      clearInterval(tt)
    }
  }, 100)
});


$(document).ready(function(){
  $("img#layers").mouseover(function(){
    $("div.layers").attr("style", "visibility: visible;");
    $("img#layers").attr("style", "visibility: hidden;");
  });
  $('div.layers').mouseleave(function(){
    $("div.layers").attr("style", "visibility: hidden;");
    $("img#layers").attr("style", "visibility: visible;");
  });
})

/*
$(document).ready(function(){
  $("img#control").mouseover(function(){
    $("div.control").attr("style", "visibility: visible;");
    $("img#control").attr("style", "visibility: hidden;");
  });
  $('div.control').mouseleave(function(){
    $("div.control").attr("style", "visibility: hidden;");
    $("img#control").attr("style", "visibility: visible;");
  });
})
*/



$(function() {
  $(".Input, .Output").draggable({handle: ".drag", containment: "parent"});
});
  
/*
var t1 = setInterval(function(){
  var H = $(".highcharts-container")
  if (H.length > 0) {
    $("#fig").hover(function(){
      $(".highcharts-container").resize(function(){
        var h = $(".highcharts-container").height();
        var w = $(".highcharts-container").width();
        var chart = $("#fig").highcharts();
        chart.setSize(w, h);
      })
    })
    clearInterval(t1)
  } 
}, 100)

var t3 = setInterval(function(){
  var S = $("#species")
  if (S.length > 0) {
    $("#species").change(function(){
     console.log($("#species").val())
    })
    clearInterval(t3)
  } 
}, 100)
*/

var t1 = setInterval(function(){
  var H = $("#chart")
  if (H.length > 0) {
    $("#chart").click(function(){
      if ($("#chart").is(":checked")) {
        $(".Output").show()
      } else {
        $(".Output").hide()
      }
    })
 
    clearInterval(t1)
  } 
}, 100)


// Function: clone;
function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

var t2 = setInterval(function(){
  var H = $("#display")
  if (H.length > 0) {
    $("#display1").click(function(){
      $("#Style").show();
        var date1 = $("#slider").dateRangeSlider("values").min.getTime();
        var date2 = $("#slider").dateRangeSlider("values").max.getTime();
        
        // Track line;
        var trk = trk140626.filter(function(element) {
          var x = new Date(element.time); 
          return  date1 <= x && x <= date2;
        })
        if (typeof track == 'object') {map.removeLayer(track)}
        track = L.polyline(trk, {color: 'red'}); 
        map.addLayer(track) 
        
        // Survey points
        var dat = dat140626.filter(function(element) {
          var x = new Date(element.time); 
          return  date1 <= x && x <= date2;
        })
         
        var list = $("#species").val();
        dat = dat.filter(function(element) {
          return  list.indexOf(element.species) > -1;
        })
        
        
        if (typeof mLayer == 'object') {map.removeLayer(mLayer)}
        mLayer = L.layerGroup()
        
        for (var m = 0; m < list.length; m++) {
          var dat2 = dat.filter(function(element) {
            return  element.species == list[m];
          })
          eval('var x'+m+'=myCluster("'+colors[m] + '")')
          for (var i = 0; i < dat2.length; i++) {
            if(dat2[i].img != "") {
              var HTML = '<img class="icon" style="border: 2px solid '+colors[m]+'" src="icon/' + dat2[i].name_sci + 
              '.jpg"> <p class="marker" style="background-color: green;">' + dat2[i].count + '</p>'
            } else {
              var HTML = '<img class="icon" style="border: 2px solid '+colors[m]+'" src="icon/' + dat2[i].name_sci + 
              '.jpg"> <p class="marker" style="background-color: gray;  ">' + dat2[i].count + '</p>'
            }
            var greenIcon = L.divIcon({
              iconSize: new L.Point(0, 0), 
              html: HTML
            });
      
            var popup = parseLink(dat2[i].img)
            if (popup != "") {
              var marker = L.marker([dat2[i].lat, dat2[i].lon], {icon: greenIcon}).bindPopup(popup);
            } else {
              var marker = L.marker([dat2[i].lat, dat2[i].lon], {icon: greenIcon}).bindPopup(parseFields(dat2[i]));
            }
            eval('x'+m+'.addLayer(marker)')
          }
          eval('mLayer.addLayer(x'+m+')')
        }
      
        map.addLayer(mLayer);
      
        //map.panTo(new L.LatLng(dat[dat.length-1].lat, dat[dat.length-1].lon));
        var pt_lat = []
        var pt_lon = []
        for (var i = 0; i < dat.length; i++) {
          pt_lat.push(dat[i].lat);
          pt_lon.push(dat[i].lon);
        }
        
        map.fitBounds([[Math.min.apply(Math, pt_lat), Math.min.apply(Math, pt_lon)], [Math.max.apply(Math, pt_lat), Math.max.apply(Math, pt_lon)]])
        map.on('popupopen', function(e) {
            var px = map.project(e.popup._latlng);
            px.y -= e.popup._container.clientHeight/3
            map.panTo(map.unproject(px),{animate: false});
        });
    
    })
    $("#display2").click(function(){
      $("#Style").hide()
      
      // Track line;
      var trk = clone(trk140626)
      if (typeof track == 'object') {map.removeLayer(track)}
      track = L.polyline(trk, {color: 'red'}); 
      map.addLayer(track) 
      
      // Survey points
      var dat = clone(dat140626)
       
      var list = $("#species").val();
      dat = dat.filter(function(element) {
        return  list.indexOf(element.species) > -1;
      })
      
      
      if (typeof mLayer == 'object') {map.removeLayer(mLayer)}
      mLayer = L.layerGroup()
      
      for (var m = 0; m < list.length; m++) {
        var dat2 = dat.filter(function(element) {
          return  element.species == list[m];
        })
        eval('var x'+m+'=myCluster("'+colors[m] + '")')
        for (var i = 0; i < dat2.length; i++) {
          if(dat2[i].img != "") {
            var HTML = '<img class="icon" style="border: 2px solid '+colors[m]+'" src="icon/' + dat2[i].name_sci + 
            '.jpg"> <p class="marker" style="background-color: green;">' + dat2[i].count + '</p>'
          } else {
            var HTML = '<img class="icon" style="border: 2px solid '+colors[m]+'" src="icon/' + dat2[i].name_sci + 
            '.jpg"> <p class="marker" style="background-color: gray;  ">' + dat2[i].count + '</p>'
          }
          var greenIcon = L.divIcon({
            iconSize: new L.Point(0, 0), 
            html: HTML
          });
    
          var popup = parseLink(dat2[i].img)
          if (popup != "") {
            var marker = L.marker([dat2[i].lat, dat2[i].lon], {icon: greenIcon}).bindPopup(popup);
          } else {
            var marker = L.marker([dat2[i].lat, dat2[i].lon], {icon: greenIcon}).bindPopup(parseFields(dat2[i]));
          }
          eval('x'+m+'.addLayer(marker)')
        }
        eval('mLayer.addLayer(x'+m+')')
      }
    
      map.addLayer(mLayer);
    
      //map.panTo(new L.LatLng(dat[dat.length-1].lat, dat[dat.length-1].lon));
      var pt_lat = []
      var pt_lon = []
      for (var i = 0; i < dat.length; i++) {
        pt_lat.push(dat[i].lat);
        pt_lon.push(dat[i].lon);
      }
      
      map.fitBounds([[Math.min.apply(Math, pt_lat), Math.min.apply(Math, pt_lon)], [Math.max.apply(Math, pt_lat), Math.max.apply(Math, pt_lon)]])
      map.on('popupopen', function(e) {
          var px = map.project(e.popup._latlng);
          px.y -= e.popup._container.clientHeight/3
          map.panTo(map.unproject(px),{animate: false});
      });     
      
    })
    clearInterval(t2)
  } 
}, 100)
