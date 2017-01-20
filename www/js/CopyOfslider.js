
$(document).ready(function(){
  $("#slider").dateRangeSlider({
    bounds:{
      min: new Date(2014, 5, 24),
      max: new Date(2014, 6, 8)
    },
    defaultValues:{
      min: new Date(2014, 5, 24),
      max: new Date(2014, 5, 25)
    },
    step:{days: 1}
  });
  
  var btn = "stop";
  $("#play").click(function(){
    var state = this.innerHTML
    if (state == "Play") {
      if (btn == "stop") {
        t1 = setInterval(function(){
          $("#slider").dateRangeSlider("scrollRight", 1)
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
 
    
var t3 = setInterval(function(){
  if (spec != undefined) {
    

    var qinghai = clone(spec.points);    
    
    // Markers
      if ($("#cluster").is(":checked")) {
        pruneCluster = new PruneClusterForLeaflet();
        
        for (var i = 0; i < qinghai.length; i++) {
          var a = qinghai[i];
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
          //leafletMarker.bindPopup("<img src='"+ data.popupContent + "'>");
          leafletMarker.bindPopup('<div class="gallery "><div id="item-1" class="control-operator"></div><div id="item-2" class="control-operator"></div><div id="item-3" class="control-operator"></div><div id="item-4" class="control-operator"></div><img class="item" src="img/test1.jpg"><img class="item" src="img/test2.jpg"><img class="item" src="img/test3.jpg"><img class="item" src="img/test4.jpg"><div class="controls"><a href="#item-1" class="control-button">•</a><a href="#item-2" class="control-button">•</a><a href="#item-3" class="control-button">•</a><a href="#item-4" class="control-button">•</a></div></div>');
        }     
        map.addLayer(pruneCluster);
      }
    
    var A = [];
    for (var i = 0; i < qinghai.length; i++) {
      var ll = {"lat": qinghai[i].lat, "lng": qinghai[i].lon};
      A.push(ll)
    }
    pl = L.polyline(A, {color: 'red'}); 
    map.addLayer(pl)  
    
    
    $("#slider").bind("valuesChanged", function(){
      var date1 = $("#slider").dateRangeSlider("values").min.getTime();
      var date2 = $("#slider").dateRangeSlider("values").max.getTime();
      
      map.removeLayer(pl)
      
      if (pruneCluster != undefined) map.removeLayer(pruneCluster)
      //markers.clearLayers();
      
      
      var qinghai_c = clone(spec.points);
      var qinghai_s = qinghai_c.filter(function(element, index) { 
        var x = new Date(element.Date)
        return date1 <= x && x <= date2
      });
      
      var gps = qinghai_c.filter(function(element, index) { 
        var x = new Date(element.Date)
        return date1 <= x && x <= date2
      });
      
      var A = [];
      for (var i = 0; i < gps.length; i++) {
        var ll = {"lat": gps[i].lat, "lng": gps[i].lon};
        A.push(ll)
      }
      pl = L.polyline(A, {color: 'red'}); pl.addTo(map)
      
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
      
    })
    
    map.on('popupopen', function(e) {
          var px = map.project(e.popup._latlng);
          px.y -= e.popup._container.clientHeight/2
          map.panTo(map.unproject(px),{animate: false});
      });
      
    clearInterval(t3)
  }
}, 100)

