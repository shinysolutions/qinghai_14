library(rCharts)
shinyUI(bootstrapPage(
  # Add custom CSS & Javascript;
  tagList(
    tags$head(
      tags$style("hr {margin: 2px 0; opacity:0;}"),
      tags$style(".leaflet-div-icon {border: 0px solid #666;}"),
      tags$script(type="text/javascript", src = "js/jquery-ui.js"),
      tags$script(type="text/javascript", src = "js/jQAllRangeSliders-min.js"),
      tags$script(type="text/javascript", src = "js/md5.js"),
      tags$script(type="text/javascript", src = "js/passwdInputBinding.js"),
      tags$link(rel="stylesheet", type="text/css", href="css/style.css"),
      tags$link(rel="stylesheet", type="text/css", href="css/gallery.prefixed.css"),
      tags$link(rel="stylesheet", type="text/css", href="css/iThing.css")
     
    )
  ),
  ## Language;
  
  # img(id = "layers",  src = "icon/layers.png"),
#   img(id = "control", src = "icon/control.png"),
  
  HTML('<div id="Style" style="width:90%; position:absolute; bottom:10px; margin-left:20px; z-index:1000;">
      <button id="play" style="float:left; width:50px;">Play</button>
      <div id="slider" style = "margin-left: 60px;"> </div>
    </div>'),
  textInput(inputId = "log", label = "", value = ""),
  div(class = "control", 
      uiOutput("uiSpecies"),
#       uiOutput("uiDisplay"),
      uiOutput("uiLegend")
#       HTML("<hr></hr>"),
#       uiOutput("uiChart"),
#       HTML("<hr></hr>"),
#       uiOutput("uiCluster"),
#       uiOutput("uiHeatmap"),
#       HTML("<hr></hr>"),
      ),
  
  div(class = "layers", uiOutput("uiMapType")),
  div(class = "Output", 
      HTML("<div class='drag'></div>"),
      chartOutput("fig", lib = "highcharts")),
  
  showOutput("myMap", "leaflet"),
  
  tagList(
    tags$body(
      tags$script(src="json/trk140626.json"),
      tags$script(src="json/dat140626.json"),
      tags$script(src="js/leaflet.markercluster-src.js"),
      tags$script(src="js/leaflet.ChineseTmsProviders.js"),
      tags$script(src="js/app.js"),
      tags$script(src="js/slider.js")
    )
  )
  
))
