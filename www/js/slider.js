
$(document).ready(function(){
  $("#slider").dateRangeSlider({
    bounds:{
      min: new Date("June 29, 2014"),
      max: new Date("August 31, 2014")
    },
    defaultValues:{
      min: new Date("June 29, 2014"),
      max: new Date("June 30, 2014")
    },
    formatter:function(val){
        var minutes = val.getMinutes(),
            hours   = val.getHours(),
            days    = val.getDate(),
            month   = val.getMonth() + 1,
            year    = val.getFullYear();
        return year + '-' + month + '-' + days;
    },
    step:{minutes: 60}
  });
  
  var btn = "stop";
  $("#play").click(function(){
    var state = this.innerHTML
    if (state == "Play") {
      if (btn == "stop") {
        t1 = setInterval(function(){
          $("#slider").dateRangeSlider("scrollRight", 24)
        }, 1000);
      }
      this.innerHTML = "Stop"
    } else {
      clearInterval(t1);
      btn = "stop";
      this.innerHTML = "Play"
    }
  });
  
  
  
  
})

// Function: clone;
function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}
 
function parseLink(link) {
  if (link.length > 0) {
    var pCtl = []
    var pImg = []
		var pIcn = []
    for (var i = 1; i <= link.split(';').length; i++) {
			pCtl.push('<div id="item-' + i + '" class="control-operator"></div>')
			pImg.push('<img class="item" src="' + link.split(';')[i-1] + '">')
			pIcn.push('<a href="#item-' + i + '" class="control-button">•</a>')
    }
		var x = '<div class="gallery ">' + '\n' + 
			pCtl.join('\n') + '\n' + 
			pImg.join('\n') + '\n' + '<div class="controls">' + '\n' +
			pIcn.join('\n') + '\n' + '</div>' + '\n' + '</div>' + '\n'
		return x
  } else {
		return ""
  }
}

function parseFields(x) {
  var y = [];
  for (i in x) {
    var xi = i + ':' + x[i] 
    y.push(xi)
  }
  return y.join('<br>')
}

colors = ["#FF7439", "#FFF75A", "#A3FFD0", "#B8FF18", "#AC1CFF", "#70E3FF", "#3CFF6B", "#FFFDDD", "#AD64FF", "#4099FF", "#FF9B17", "#FF5FFF", "#FFB161", "#FFDB58", "#FB18FF", "#6C76FF", "#FFC6B0", "#1931FF", "#E4B0FF", "#D3FF90", "#75FF5A", "#1AD6FF", "#54FF15", "#FFDD16", "#4B1AFF", "#FFE09B", "#5EFFCD", "#18FFCF", "#B0D4FF", "#FFBE17"]

function myCluster(col) {
  return L.markerClusterGroup({
    maxClusterRadius: 120,
    iconCreateFunction: function (cluster) {
      var markers = cluster.getAllChildMarkers();
      var n = 0;
      for (var i = 0; i < markers.length; i++) {
        //n += markers[i].number;
        n += 1;
      }
      var h = 10 + 10*Math.sqrt(n);
      return L.divIcon({
        iconSize: new L.Point(0, 0),  
        html: '<div class="count" style="background-color: '+col+'; height:' + h + 'px; width:' + h+ 'px; line-height:' + h + 'px;">' + n + '</div>'});
    },
  });
}


////////////////////////////////
$("#slider").bind("valuesChanged", function(){
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
  
  //map.fitBounds([[Math.min.apply(Math, pt_lat), Math.min.apply(Math, pt_lon)], [Math.max.apply(Math, pt_lat), Math.max.apply(Math, pt_lon)]])
  map.on('popupopen', function(e) {
      var px = map.project(e.popup._latlng);
      px.y -= e.popup._container.clientHeight/3
      map.panTo(map.unproject(px),{animate: false});
  });

})

// Select species
var t3 = setInterval(function(){
  var S = $("#species")
  if (S.length > 0) {
    $("#species").change(function(){
      if ($("#display input[type='radio']:checked").val() == "tbt") {
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
      } else {
         var trk = clone(trk140626)
        if (typeof track == 'object') {map.removeLayer(track)}
        track = L.polyline(trk, {color: 'red'}); 
        map.addLayer(track) 
        
        // Survey points
        var dat = clone(dat140626)
      }
     
       
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
      
      //map.fitBounds([[Math.min.apply(Math, pt_lat), Math.min.apply(Math, pt_lon)], [Math.max.apply(Math, pt_lat), Math.max.apply(Math, pt_lon)]])
      map.on('popupopen', function(e) {
          var px = map.project(e.popup._latlng);
          px.y -= e.popup._container.clientHeight/3
          map.panTo(map.unproject(px),{animate: false});
      });
    })
    clearInterval(t3)
  }
}, 100)

/*      
//Default
var t4 = setInterval(function(){
console.log(typeof map)
  if (typeof map == "object") {
 
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
    
    clearInterval(t4)
  }
}, 100)


/*   
  // Heatmap 
  if ($("#heatmap").is(":checked"))  {
    heatmapLayer = L.TileLayer.heatMap({
    radius: 20,
    opacity: 0.8,
    gradient: {
      0.45: "rgb(0,0,255)",
      0.55: "rgb(0,255,255)",
      0.65: "rgb(0,255,0)",
      0.95: "yellow",
      1.00: "rgb(255,0,0)"
    }
  });
  console.log(dat)
  heatmapLayer.addData(dat);
  map.addLayer(heatmapLayer);
  }  
    
  if ($("#cluster").is(":checked")) {
    pruneCluster = new PruneClusterForLeaflet();
    
    for (var i = 0; i < qinghai_s.length; i++) {
      var a = qinghai_s[i];
      var marker = new PruneCluster.Marker(a.lat, a.lon, {popupContent: a.icon, iconUrl: a.icon});
      pruneCluster.RegisterMarker(marker)
    }
    pruneCluster.PrepareLeafletMarker = function(leafletMarker, data){
      leafletMarker.setIcon(L.icon({
        iconUrl: data.iconUrl,
        iconSize:     [32, 32],
        iconAnchor:   [0, 0],
        popupAnchor:  [0, 0]
      }));
      leafletMarker.bindPopup("<img src='"+ data.popupContent + "'>");
    }     
    map.addLayer(pruneCluster);
  }
    
*/