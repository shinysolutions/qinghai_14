var t3 = setInterval(function(){
  var H = $("#layers")
  var M = typeof map;
  if (H.length > 0 && M != undefined ) {
      
      $("#mapType1").click(function(){
      map.removeLayer(lMap);
    var lBase = L.tileLayer.chinaProvider('TianDiTu.Normal.Map',     {maxZoom:18,minZoom:4});
    var lMap  = L.layerGroup([lBase, lAnno]).addTo(map);
  })
  
    $("#mapType2").click(function(){
      map.removeLayer(lMap);
    var lBase = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map',     {maxZoom:18,minZoom:4});
    var lMap  = L.layerGroup([lBase, lAnno]).addTo(map);
  })
  
  
    $("#mapType3").click(function(){
      map.removeLayer(lMap);
    var lBase = L.tileLayer.chinaProvider('TianDiTu.Terrain.Map',     {maxZoom:18,minZoom:4});
    var lMap  = L.layerGroup([lBase, lAnno]).addTo(map);
  })
    
    
    
    
 
    clearInterval(t1)
  } 

}, 100)


