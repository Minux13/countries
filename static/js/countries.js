var colorsGame = {
    areasColor : "#aab",
    outlineColor : "#FFF",
    areaHover : "#449",
    areaClick: "rgba(0,0,0,0)",
    unlistedAreasColor : "rgba(200,200,200,0)",
    unlistedAreasOutlineColor : "rgba(200,200,200,0)",
    areaCorrect : "#8ac",
    areaIncorrect : "#c55",
    tooltipColor: "#ccc",
    tooltipBackground: "#668"
};

AmCharts.theme = AmCharts.themes.black;
var map;
AmCharts.ready(function() {
    map = AmCharts.makeChart( "mapdiv", {
        "type": "map",
        "theme": "black",
        "language" : "es",
        "mouseWheelZoomEnabled" : true,
	"listeners": [{
            "event": "clickMapObject",
            "method": function(event) {
		var areaClick = event.mapObject;
	        if( game.countryCodeAsk == areaClick.id ){
	            areaClick.color = colorsGame.areaCorrect;
	            areaClick.colorReal = areaClick.color;
	            //areaClick.mouseEnabled = false;
	            game.numberCorrects = game.numberCorrects + 1;
                    areaClick.baseSettings.selectedColor = areaClick.color;
	            areaClick.validate();
	            game.correct();
	        }else{
	            var area = map.getObjectById(game.countryCodeAsk);
	            area.color = colorsGame.areaIncorrect;
	            area.colorReal = area.color;
                    area.baseSettings.selectedColor = area.color;
	            //area.mouseEnabled = false;
                    event.chart.selectObject();//Deselecciona pero reajusta el zoom del mapa
                    //areaClick.baseSettings.selectedColor = colorsGame.areaHover;
	            //areaClick.validate();
		    map.zoomToGroup( [ area ] );
	            area.validate();
	            game.inCorrect();
	        }
             }
        }],
	"zoomControl": {
	    "zoomFactor": 1.8
	},
        "balloon": {
            "enabled": false,
            "fontSize" : 18,
            "adjustBorderColor": true,
            "color": colorsGame.tooltipColor,
            "cornerRadius": 5,
            "verticalPadding" : 8,
            "horizontalPadding" : 18,
            "fillAlpha" : 1,
	    "borderThickness" : 0,
            "fillColor": colorsGame.tooltipBackground
        },
        "dataProvider": {            
            "map": "worldHigh",
            //"getAreasFromMap": true, 
            "zoomLevel": valuesContinent.zoom,
            "zoomLongitude": valuesContinent.longitude,
            "zoomLatitude": valuesContinent.latitude,
            "areas": valuesContinent.codesCountries,
        },    
        "areasSettings": {
	    "color" : colorsGame.areasColor,
            "outlineColor" : colorsGame.outlineColor,
            "selectedColor" : colorsGame.areaClick,
            "selectable": true,
            "rollOverOutlineColor": "#FFFFFF",
            "rollOverColor": colorsGame.areaHover,
            "alpha": 0.8,
            "unlistedAreasAlpha": 1,
            "unlistedAreasOutlineAlpha": 1,
	    "unlistedAreasColor" : colorsGame.unlistedAreasColor,
            "unlistedAreasOutlineColor" : colorsGame.unlistedAreasOutlineColor
        }    	
    });

    game = {
        countryCodeAsk : "",	
        codes : valuesContinent.codesCountriesArray,
        setRandomCountryCode : function(){
    	    var numCountrys = this.codes.length;
    	    if( numCountrys > 0 ){
    	        var randomCodeNum = Math.floor(Math.random() * numCountrys); 
    	        game.countryCodeAsk = game.codes[randomCodeNum];
                this.codes.splice(randomCodeNum, 1);
    	        this.changeAsk();
    	    }else{
    	        document.getElementById('ask').innerHTML = "Correctos " + game.numberCorrects +" de "+ game.numberAreas +" paises";
    	        map.clickMapObject = function(){;}
    	        map.balloon.enabled = true;
    	    }
        },
        numberAreas : 0,
        numberCorrects: 0,
        timer : "",
        setTimer: function(){
    	    clearTimeout(this.timer);
            this.timer = setTimeout(function(){
    	        document.getElementById("iscorrect").className = "hidealert";
		map.goHome();
    	    }, 1500);   
        },
        correct: function(){
    	    var checkElement = document.getElementById("iscorrect");
    	    checkElement.innerHTML = "<span style='margin: auto;vertical-align: -30px;color: #fff; font-size: 28px;'>  &#x2713; Correcto </span>";
	    checkElement.style.background = "#3630d4";
    	    checkElement.className = "showalert";
    	    this.setRandomCountryCode();
    	    this.setTimer();
        },
        inCorrect: function(){
            var checkElement = document.getElementById("iscorrect");
    	    checkElement.innerHTML = "<span style='margin: auto;vertical-align: -30px;color: #fff; font-size: 28px;'> &#x2717 Incorrecto </span>";
	    checkElement.style.background = "#d66";
    	    checkElement.className = "showalert";
    	    this.setRandomCountryCode();
    	    this.setTimer();
        },
        changeAsk: function(){
	    var spanishAreaName = map.getObjectById(game.countryCodeAsk).titleTr;
	    if( !spanishAreaName ){
		spanishAreaName = map.getObjectById(game.countryCodeAsk).title;	    
	    }
            document.getElementById('ask').innerHTML = '¿Dónde se encuentra '+ spanishAreaName +'?';
        }
    }

    game.numberAreas = game.codes.length;
    game.setRandomCountryCode();

});
