setwd("/srv//xh/q14/")
library(RJSONIO) # For saving data.frame to JSON;
source("RScript/readGPX.R")



header <- system(paste("identify -verbose", '/srv/xh/q14/www/img/animal/NEW_0443.jpg'), intern=TRUE)
print( header[grepl("DateTimeOriginal", header, ignore.case = TRUE)])





#################
## Survey data ##
#################
# ## Load original data;
# Dat <- read.table("Data/QH140626//SurveyData.txt", sep = "\t", header = TRUE, row.name = NULL, stringsAsFactors = FALSE)
# Dat <- Dat[, 1:3]
# names(Dat) <- c("ID", "Species", "count")
# Dat$count[which(Dat$count == c("", "0"))] <- 1
# ## Waypoints;
# WPT <- NULL
# for (f in list.files("Data/QH140626/Meta/WPT/", full.names=TRUE)) {
#   wpt <- readGPX(f)$waypoints[, 1:5]
#   WPT <- rbind(WPT, wpt)
# }
# ## Match waypoints with survey data by "ID" and "name";
# Dat <- merge(Dat, WPT, by.x = "ID", by.y = "name", all.x = TRUE)
# ## Delete points that missing geo-info;
# Dat <- Dat[-which(is.na(Dat$lon)), ]
# ## Add 8 hours to the time variable recorded by Gamin GPS;
# Dat$time <- as.character(as.POSIXlt(gsub("Z|T", " ", Dat$time))+8*60*60)
# ## Rename longitude filed name for leaflet.js;
# names(Dat)[which(names(Dat) == "lon")] <- "lng"

# icon_ls <- list.files("www/icon/", full.names=TRUE)
# for (i in seq(nrow(sce))) {
#   sp_cn <- sce$species[i]
#   sp_en <- sce$name_sci[i]
#   id <- which(gsub('.jpeg', '', gsub('www/icon//', '', icon_ls, fixed = TRUE), fixed = TRUE) == sp_cn)
#   file.rename(icon_ls[id], gsub(sp_cn, sp_en, icon_ls[id]))
# }
# 


sce <- read.table("Data/QH140626//Animal_cn_en.txt", header = TRUE, stringsAsFactors = FALSE)
sce$name_sci <- gsub(" ", "_", sce$name_sci)

Dat <- read.csv("Data/QH140626//GPS_2014June_all.csv", sep = ";", stringsAsFactors = FALSE, dec = ",")
Dat <- merge(Dat, sce, all.x = TRUE)
Dat$time <- as.character(as.POSIXlt(gsub("Z|T", " ", Dat$time_ori))+8*60*60) 
PIC <- list.files("www/img/Q140626/")
pId <- sapply(regmatches(PIC, regexec("(^.*?)[-_]", PIC)), "[[", 2)
Dat$img <- ""
for (i in 1:nrow(Dat)) {
  id <- Dat$name[i]
  pic <- PIC[which(pId %in% id)]
  if (length(pic)>0) {
    Dat$img[i] <- paste(paste("img/Q140626/", pic, sep = ""), collapse = ";")
  }
}
print(paste(length(which(Dat$img != "")), "points have pictures."))

Dat_ls <- as.list(rep(NA, nrow(Dat)))
for (i in 1:nrow(Dat)) {
  Dat_ls[[i]] <- as.list(Dat[i,])
}
write(paste("var dat140626 =", toJSON(Dat_ls)), "www/json/dat140626.json")



#################
## Routes data ##
#################
TRK_1 <- NULL
for (f in list.files("Data/QH140626/Meta/TRK/", full.names=TRUE)) {
# for (f in list.files("Data/QH140626/GPX/", full.names=TRUE)) {
  trk <- readGPX(f)$tracks
  for (i in 1:length(trk)) {
    TRK_1 <- rbind(TRK_1, trk[[i]][[1]])
  }
}
TRK_2 <- NULL
for (f in rev(list.files("Data/QH140626/GPX/", full.names=TRUE))[1:4]) {
  trk <- readGPX(f)$tracks
  if (!is.null(trk)) {
    for (i in 1:length(trk[[1]])) {
      TRK_2 <- rbind(TRK_2, trk[[1]][[i]])
    }
  }
}

TRK <- rbind(TRK_1, TRK_2)
## Add 8 hours to the time variable recorded by Gamin GPS;
TRK$time <- as.character(as.POSIXlt(gsub("Z|T", " ", TRK$time))+8*60*60)
## Survey start from 2014-06-26;
TRK <- TRK[which(TRK$time >= "2014-06-26 00:00:01"), ]

## GPS data resampling;
TRK$time <- gsub("[[:digit:]]{2}$", "00", TRK$time)
Trk <- NULL
for (i in sort(unique(TRK$time))) {
  trk <- TRK[which(TRK$time == i), ]
  Trk <- rbind(Trk, trk[1, ])
}
## Show routes
with(Trk, plot(lon, lat))
## Rename longitude filed name for leaflet.js;
names(Trk)[which(names(Trk) == "lon")] <- "lng"

#########################
## Export to JSON data ##
#########################

Trk_ls <- as.list(rep(NA, nrow(Trk)))
for (i in 1:nrow(Trk)) {
  Trk_ls[[i]] <- as.list(Trk[i,])
}
write(paste("var trk140626 =", toJSON(Trk_ls)), "www/json/trk140626.json")



