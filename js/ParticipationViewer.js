var periodChart = null;

function createParticipationViewer(parent, title, data) {
    createTitle(title);
    createPlayer();

    createMap('period-map', data['period'][1866 - 1514].countries);
    createTable('period-table', data['period'][1866 - 1514].countries);
    createChart('period-chart', data['period'][1866 - 1514].countries);

    //createMap('year-map', data['year'][0].countries);
}

function updateParticipationViewer(data) {
    if(data.countries) {
        updatePlayerYear(data.last_voyage_date);

        replaceMap('period-map', data.countries);
        replaceTable('period-table', data.countries);
        updateChart('period-chart', data.countries);
    }
}


function createTitle(title) {
    var $title = $('<h3></h3>')
        .addClass("h3 display-5 py-3 text-center text-light")
        .text(title);

    $('#ptitle').append($title);
}

function createPlayer() {
    $('#ppause').hide();

    $('#pplay').on('click', function (event) {
        event.preventDefault();
        $('#pplay, #ppause, #prefresh').toggle();
        play();
    });
    $('#ppause').on('click', function (event) {
        event.preventDefault();
        $('#pplay, #prefresh, #ppause').toggle();
        pause();
    });
    $('#prefresh').on('click', function (event) {
        event.preventDefault();
        refresh();
    });
}


function createTable(selector, data) {
    var tableData = getTableDataForCriteria(data);

    periodTable = $('#' + selector).DataTable({
        data: tableData.data,
        columns: tableData.columns,
        "columnDefs": [{
            "searchable": false,
            "orderable": false,
            "targets": 0
        }],
        "order": [[1, 'desc']],
        "paging": false,
        "ordering": true,
        "info": false,
        "searching": false,
        responsive: false,
        fixedColumns: true
    });
}

function getTableDataForCriteria(data) {
    var criteria = $('option:selected').val();
    
    if (criteria == '#Embarked') {
        return {
            data: data.map(function (obj) {
                return [obj.name, obj.embarked];
            }),
            columns: [{
                title: 'name'
            }, {
                title: 'Value'
            }]
        };
    } 
    else if (criteria == '#Disembarked') {
        return {
            data: data.map(function (obj) {
                return [obj.name, obj.disembarked];
            }),
            columns: [{
                title: 'name'
            }, {
                title: 'Value'
            }]
        };
    } 
    else if (criteria == '#Died') {
        return {
            data: data.map(function (obj) {
                    return [obj.name, obj.died];
            }),
            columns: [{
                title: 'name'
            }, {
                title: 'Value'
            }]
        };
    } 
    else if (criteria == '#Voyages') {
        return {
            data: data.map(function (obj) {
                return [obj.name, obj.nvoyages];
            }),
            columns: [{
                title: 'name'
            }, {
                title: 'Value'
            }]
        };
    } 
    else if (criteria == 'Duration') {
        return {
            data: data.map(function (obj) {
                return [obj.name, (getPlayerYearValue() - obj.fdate) + 1];
            }),
            columns: [{
                title: 'name'
            }, {
                title: 'Value'
            }]
        };
    } 
    else {
        alert('Unknown criteria: ' + criteria);
        return [];
    }
}

function replaceTable(selector, data) {
    var tableData = getTableDataForCriteria(data);

    periodTable.clear();
    periodTable.rows.add(tableData.data);
    periodTable.draw();
}


function createChart(selector, data) {
    data = data.sort(compareDesc);
    var datasets = getChartDataForCriteria(data);

    var onlyValues = data.map(function (obj) {
        return getObjectValueForCriteria(obj, $('option:selected').val());
    });

    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);
    
    var chart = $('#period-chart').empty();
    periodChart = new Chart(chart, {
        type: 'bar',
        data: {
            labels: data.map(function (obj) {
                return obj.iso2;
            }),
            datasets: datasets
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        labels: data.map(function (obj) {
                            return obj.name;
                        })
                    }
                }],
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: maxValue
                    }
                }]
            }
        }
    });
}

function getChartDataForCriteria(data) {
    var data = data.sort(compareDescForCriteria);
    var criteria = $('option:selected').val();
    

    if (criteria == '#Embarked') {
        return [{
            label: '#Embarked',
            data: data.map(function (obj) {
                return obj.embarked;
            }),
            backgroundColor: getCriteriaRange2(criteria)[1]
        }];
    } else if (criteria == '#Disembarked') {
        return [{
            label: '#Disembarked',
            data: data.map(function (obj) {
                return obj.disembarked;
            }),
            backgroundColor: getCriteriaRange2(criteria)[1]
        }];
    } else if (criteria == '#Died') {
        return [{
            label: '#Died',
            data: data.map(function (obj) {
                return obj.died;
            }),
            backgroundColor: getCriteriaRange2(criteria)[1]
        }];
    } else if (criteria == '#Voyages') {
        return [{
            label: '#Voyages',
            data: data.map(function (obj) {
                return obj.nvoyages;
            }),
            backgroundColor: getCriteriaRange2(criteria)[1]
        }];
    } else if (criteria == 'Duration') {
        return [{
            label: 'Duration (years)',
            data: data.map(function (obj) {
                return getPlayerYearValue() - obj.fdate + 1;
            }),
            backgroundColor: getCriteriaRange2(criteria)[1]
        }];
    }
    else return undefined;

}

function getCriteriaRange2(criteria) {
    
    if(criteria=='#Embarked') {
        return ["rgba(255,0,0,.1)", "rgba(255,0,0,1)"];
    } else if(criteria == '#Disembarked') {
        return ["rgba(255,255,0,.1)", "rgba(255,255,0,1)"];
    } else if(criteria == '#Died') {
        return ["rgba(255,0,255,.1)", "rgba(255,0,255,1)"];
    } else if(criteria == '#Voyages') {
        return ["rgba(0,0,255,.1)", "rgba(0,0,255,1)"];
    } else if(criteria=='Duration') {
        return ["rgba(200,100,0,.1)", "rgba(200,100,0,1)"];
    }
    else return undefined; 
}


function updateChart(selector, data) {
    var cdata = data.sort(compareDesc);
    var datasets = getChartDataForCriteria(cdata);
    
    var onlyValues = data.map(function (obj) {
        return getObjectValueForCriteria(obj, $('option:selected').val());
    });

    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

    periodChart.data = {
        labels: cdata.map(function (obj) {
            return obj.iso2;
        }),
        datasets: datasets,
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        labels: data.map(function (obj) {
                            return obj.iso2;
                        })
                    }
                }],
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: maxValue
                    }
                }]
            }
        }
    };

    periodChart.update(0);

}

function compareDesc2(a, b) {
    if (a.name > b.name) {
        return 1;
    } else if (a.name < b.name) {
        return -1;
    } else {
        return 0;
    }
}

function compareDesc(a, b) {
    if (parseInt(a) < parseInt(b)) {
        return 1;
    } else if (parseInt(a) > parseInt(b)) {
        return -1;
    } else {
        return 0;
    }
}

function compareDescForCriteria(a, b) {
    var criteria = $('option:selected').val();

    if (criteria == '#Embarked') {
        return compareDesc(a.embarked, b.embarked);
    } else if (criteria == '#Disembarked') {
        return compareDesc(a.disembarked, b.disembarked);
    } else if (criteria == '#Died') {
        return compareDesc(a.died, b.died);
    } else if (criteria == '#Voyages') {
        return compareDesc(a.nvoyages, b.nvoyages);
    } else if (criteria == 'Duration') {
        return compareDesc(a.ldate-a.fdate+1, b.ldate-b.fdate+1);
    }    
    else return undefined;
}
