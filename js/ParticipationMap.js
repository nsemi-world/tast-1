function createMap(id, series) {
    var mapViewId = id;
    var dataset = getDataset(series);
    var fills = getFills();
    var template = getTemplate();
    var bubbles = getBubbles(series);
    var bubblesTemplate = getBubblesTemplate();
    getDataMap(mapViewId, dataset, fills, template, bubbles, bubblesTemplate);
}

function replaceMap(id, series) {
    getMapView(id).empty();
    createMap(id, series);
}

function getMapView(id) {
    return $('#' + id);
}

function getDataset(series) {
    var dataset = {};
    // We need to colorize every country based on "numberOfWhatever"
    // colors should be uniq for every value.
    // For this purpose we create palette(using min/max series-value)
    var onlyValues = series.map(function (obj) {
        return obj.embarked;
    });

    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

    // create color palette function
    // color can be whatever you wish
    var paletteScale = d3.scale.linear()
        .domain([0, maxValue])
        .range(["rgba(255,0,0,.1)", "rgba(255,0,0,1)"]); // blue color
        //.interpolator(d3.interpolateRainbow);

    // fill dataset in appropriate format
    series.forEach(function (item) { //
        // item example value ["USA", 70]
        var iso = item.iso3;
        var value = item.embarked;
        dataset[iso] = {
            numberOfThings: value,
            fillColor: paletteScale(value)
        };
    });
    
    return dataset;
};

function getFills() {
    return {
        GBR: 'blue',
        PRT: 'green',
        FRA: 'red',
        ESP: 'yellow',
        NLD: 'pink',
        DNK: 'white',
        USA: 'cadetblue',
        BRA: 'yellowgreen',
        defaultFill: 'transparent'
    }
};

function getTemplate() {
    return (
        function (geo, data) {
            // don't show tooltip if country don't present in dataset
            if (!data || data.numberOfThings == 0) {
                return;
            }
            // tooltip content
            return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Count: <strong>', data.numberOfThings.toLocaleString('en'), '</strong>',
                    '</div>'].join('');
        }
    );
};

/*
    A = PI * r^2
    r = SQRT(A/PI)
*/
function getBubbles(series) {
    var bubbles = [];
    var i = 0;

    $.each(series, function (key, value) {
        if (value.iso3 != '') {
            bubbles[i++] = {
                centered: value.iso3,
                country: value.name,
                fillKey: value.iso3,
                radius: Math.sqrt(value.embarked / Math.PI) / 10,
                embarked: value.embarked,
                disembarked: value.disembarked,
                died: value.died,
                borderColor: 'gray'
            }
        }
    });
    return bubbles;
};

function getBubblesTemplate() {
    return (
        function (geo, data) {
            return '<div class="hoverinfo">Country:' + data.country + '<hr>Embarked: ' + data.embarked + '</br>Disembarked: ' + data.disembarked + '</br>Died: ' + data.died + '';
        });
}

function updateDatamapBubbles(series) {
    $.each(series, function (key, value) {
        if (value.iso3 != '') {
            updateCircle(value);
        }
    });
};

function updateCircle(value) {
    var circles = document.getElementsByTagName('circle');
    //alert(circles.length);
    $.each(circles, function(key, circle) {
        if(circle.getAttribute('data-info').centered == value.iso3) {
           circle.setAttribute('r', Math.sqrt(value.embarked / Math.PI) / 10); 
        }
    });
}

function getCountriesSeriesMax(series) {
    var max = 0;
    for (var i = 0; i < series.length; i++) {
        if (series[i][3] > max) {
            max = series[i][3];
        }
    }
    return max;
};

function height(value, series) {
    var max = series[0][3];
    var maxHeight = 500;
    return value * maxHeight / max;
};

function getDataMap(mapViewId, dataset, fills, template, bubbles, bubblesTemplate) {
    var options = getOptions(mapViewId, dataset, fills, template);
    var datamap = new Datamap(options);
    
    /*datamap.bubbles(bubbles, {
        popupTemplate: bubblesTemplate
    });*/
    datamap.graticule();
}

function getOptions(mapViewId, dataset, fills, template) {
    var options = {
        width: 200,
        height: 200,
        element: document.getElementById(mapViewId),
        setProjection: function (element, options) {
            var projection, path;
            projection = d3.geo.equirectangular()
                .center([-60, 30])
                .scale(element.offsetWidth/5);
            path = d3.geo.path().projection(projection);
            return {
                path: path,
                projection: projection
            };
        },
        responsive: true,
        fills: fills,
        data: dataset,
        geographyConfig: {
            borderColor: 'gray',
            background: 'black',
            highlightBorderWidth: 2,
            // don't change color on mouse hover
            highlightFillColor: function (geo) {
                return geo['fillColor'] || '#F5F5F5';
            },
            // only change border
            highlightBorderColor: '#B7B7B7',
            // show desired information in tooltip
            popupTemplate: template
        }
    };

    return options;
}




