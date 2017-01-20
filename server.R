library(shiny)
library(rCharts)
library(RJSONIO)

qinghai <- read.csv("Data/QH140626//GPS_2014June_all.csv", sep = ";", stringsAsFactors = FALSE, dec = ",")
# qinghai$Date <- as.character(as.POSIXct(gsub("/Waypoints", "", qinghai$Date)))
# qinghai$icon <- sample(paste("icon/png/", list.files("www/icon/png"), sep = ""), nrow(qinghai), replace = TRUE)


# Define server logic required to summarize and view the selected dataset
shinyServer(function(input, output, session) {
  observe({write(input$log, "www/log.txt", append = TRUE)})
  ## Source input and output;
  source("RScript/input.R",  local = TRUE)
  source("RScript/jsFun.R", local = TRUE)
  source("RScript/output.R", local = TRUE)
  
})
