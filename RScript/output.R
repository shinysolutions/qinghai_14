observe({
  if (!is.null(input$chart)) {
    if (input$chart) {
      output$fig <- renderChart({
        ## Highchart basic;
        input$species
        H <- Highcharts$new()
        H$addParams(dom = "fig")
        H$chart(type = "column", zoomType = "xy", width=1000, height = 600, spacingTop = 1)
        H$subtitle(text = " ", style = list(fontSize = "14px", color = "black"))
        H$data(rnorm(100))
        H
      })
    }
  }
})


observe({
  if (!is.null(input$mapType)) {
    
    output$myMap <- renderMap({
      m <- Leaflet$new()
      m$addParams(width="100%", height=1200, layerOpts = list(maxZoom = 18))
      
      if (input$mapType == "normal") {
        m$addParams(chinamap = "TianDiTu.Normal.Map")
      } else if (input$mapType == "satellite") {
        m$addParams(chinamap = "TianDiTu.Satellite.Map")
      } else if (input$mapType == "terrain") {
        m$addParams(chinamap = "TianDiTu.Terrain.Map")
      }
  
#       if (is.null(input$species)) {
#         dat <- qinghai
#       } else {
#         dat <- qinghai[which(qinghai$species %in% input$species), ]
#       }
  
#       Points <- as.list(rep(NA, nrow(dat)))
#       for (i in 1:nrow(dat)) {
#         Points[[i]] <-  dat[i, c("Date", "lat", "lon", "species", "count", "distance", "icon")]
#       }
#       m$addParams(points = Points)
#       
#       if (!is.null(input$heatmap)) {
#         if (input$heatmap) {
#           m$addParams(heatmap = Points)
#         }
#       }
#       if (!is.null(input$cluster)) {
#         if (input$cluster) {
#           m$addParams(cluster = Points)
#         }
#       }    
       
      m$addParams(bounds = list(c(32.97885, 92.93408), c(36.80266,101.74408)))
      
#       ## Build GeoJSON list;
#       Dat <- list()
#   
#       ## dat codes;
#       if (!is.null(input$markers)) {
#         if (input$markers) {
#           for (i in 1:nrow(dat)) {
#             geoList <- list(type = "Feature", 
#                             geometry = list(type = "Point", coordinates = c(dat$lon[i], dat$lat[i])),
#                             properties = list(color = "black", 
#                                               fillColor = "black",
#                                               fillOpacity = 1, 
#                                               radius = 3,
#                                               popup = dat$Name[i]
#                             ))
#             Dat[[length(Dat)+1L]] <- geoList
#           }
#           Dat[[length(Dat)+1L]] <- geoList
#         }
#       }
#       
#       
#       if (!is.null(Dat)) {
#         m$geoJson(Dat, style = jsStyle, 
#                   onEachFeature = jsOnEachFeature,
#                   pointToLayer =jsPointToLayer)
#       }
      m
    })
  }
})

