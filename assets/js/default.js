$(function() {

	var options = {
		chart: {
			renderTo: 'container',
			type: 'spline'
		},
		series: [{}]
	};

	function convertToTimestamp(date) {
		return new Date( date ).getTime() / 1000;
	}

	function makeArray( arr ) {
		var result = [], date;

		for (var i = arr.length - 1; i >= 0; i--) {
			date = new Date(arr[i].timestamp);
			date.setHours(date.getHours() + 2);
			result[i] = [];
			result[i][0] = Date.parse(date);
			result[i][1] = arr[i].value / 100;
		}

		return result;
	}

	// always return given number with two digits
	function twoDigits(n){
		return n > 9 ? "" + n: "0" + n;
	}

	var url =  "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/PASSAU%20DONAU/W/measurements.json";

	$.getJSON(url, function(data) {

		$("p").hide();

		var currentWaterLevel = data[data.length - 1].value/100,
			currentHour = twoDigits(new Date(data[data.length - 1].timestamp).getHours()),
			currentMinute = twoDigits(new Date(data[data.length - 1].timestamp).getMinutes());

		Highcharts.setOptions({
			lang : {
				decimalPoint: ',',
				thousandsSep: '.',
				months : ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
				shortMonths : ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
				weekdays : ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]
			}
		});

		$('#container').highcharts('StockChart', {

			credits: {
				text: 'Datenquelle: Wasser- und Schifffahrtsverwaltung des Bundes (WSV)',
				href: 'http://www.pegelonline.wsv.de/'
			},
			rangeSelector : {
				buttons: [{
					type: 'day',
					count: 1,
					text: '1T'
				}, {
					type: 'day',
					count: 3,
					text: '3T'
				}, {
					type: 'day',
					count: 5,
					text: '5T'
				}, {
					type: 'day',
					count: 10,
					text: '10T'
				}],
				selected : 0
			},

			series : [{
				name : 'AAPL',
				data : makeArray(data),
				id: 'dataseries',
				tooltip: {
					valueDecimals: 2
				},
				type: 'spline'
			}],

			subtitle : {
				text: 'Aktuellster Wert: <b>' + Highcharts.numberFormat(currentWaterLevel, 2, ',') + ' m</b> um <b>' + currentHour + ':' + currentMinute + ' Uhr</b>',
				y: 35
			},

			title : {
				text : 'Donau-Wasserpegel in Passau'
			},

			tooltip : {
				formatter :  function() {
					var s = '';
					s += '<b>' + Highcharts.numberFormat(this.y, 2, ',') + ' m</b><br>';
					s += Highcharts.dateFormat('%A, %d.%m.%Y, %H:%M Uhr', this.x);
					return s;
				}
			},

			yAxis : {
				labels : {
					formatter: function() {
						return this.value +' m';
					},
					step : 0
				}
			}


		});

	});

});
