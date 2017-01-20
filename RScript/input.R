output$uiSpecies <- renderUI({
  Items <- sort(unique(qinghai$species))
  selectInput(inputId = "species", 
              label   = "显示下列物种：", 
              choices = Items, 
              multiple = TRUE,
#               selectize= FALSE,
              selected= c("藏野驴", "藏原羚", "藏羚羊"))
})

Cols = c("#FF7439", "#FFF75A", "#A3FFD0", "#B8FF18", "#AC1CFF", "#70E3FF", "#3CFF6B", "#FFFDDD", "#AD64FF", "#4099FF", "#FF9B17", "#FF5FFF", "#FFB161", "#FFDB58", "#FB18FF", "#6C76FF", "#FFC6B0", "#1931FF", "#E4B0FF", "#D3FF90", "#75FF5A", "#1AD6FF", "#54FF15", "#FFDD16", "#4B1AFF", "#FFE09B", "#5EFFCD", "#18FFCF", "#B0D4FF", "#FFBE17")

output$uiLegend <- renderUI({
  if (!is.null(input$species)) {
    inn <- "<div id='legend'>"
    for (i in 1:length(input$species)) {
      inn = paste(inn,  "<li><span style='background:" , Cols[i] , ";'></span>" , input$species[i] , "</li><hr>")
    }
    inn <- paste(inn, "</div>")
    HTML(inn)
  }
})
    
# output$uiChart <- renderUI({
#   checkboxInput(inputId = "chart", 
#                 label   = "Statistics", 
#                 value   = FALSE)
# })

# 
# 
# output$uiCluster <- renderUI({
#   checkboxInput(inputId = "cluster",
#                 label   = "Markers cluster",
#                 value   = FALSE)
# })
# 
# output$uiMarkers <- renderUI({
#   checkboxInput(inputId = "markers",
#                 label   = "Markers",
#                 value   = TRUE)
# })
# 
# output$uiHeatmap <- renderUI({
#   checkboxInput(inputId = "heatmap",
#                 label   = "Heat map",
#                 value   = FALSE)
# })


output$uiDisplay <- renderUI({
  radioButtons(inputId = "display", 
               label   = "",
               c("选择日期" = "tbt",
                 "所有日期"    = "all"))
})

# output$uiSlider <- renderUI({
#   sliderInput(inputId = "slider", 
#                label   = "",
#                min = 1, max = 20, value=1, step = 1, animate = TRUE)
# })



output$uiMapType <- renderUI({
  radioButtons(inputId = "mapType", 
               label   = "",
               c("地图" = "normal", 
                 "卫星" = "satellite", 
                 "地形" = "terrain"),
               selected = "satellite")
})
   


