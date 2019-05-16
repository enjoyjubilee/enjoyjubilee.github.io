// Project Description

// This project is a follow-up of the miderm project. In the slide show users can
// get a better idea of the commercial airport transporation effect and knowledge-
// spillover effect of high-growth business companies in Pennsylvania

// Slide 1: Inc5000 companies Users can search around
// Slide 2: Zoom in and see Inc500 companies in Philadelphia
// Slide 3: Browse the commercial airports


// There will be a top side bar for instructions of the 5 slides


//Global variable

// var slideContent = [
// 	`<h1 id='title1'>${"Inc5000 Companies in Pennsylvania"}</h1>`,
// 	`<h1 id='title2'>${"Find companies in Philadelphia"}</h1>`,
// 	`<h1 id='title3'>${"Zoom In to Explore"}</h1>`,
// 	`<h1 id='title4'>${"Airport"}</h1>`,
// 	`<h1 id='title5'>${"University",}</h1>`,
// ]

( function () {
	// Display the data and details of Inc companies and airport effect area in PA

	// Set up map
	var mapOpts = {
		center: [ 41.203323, -77.194527 ],
		zoom: 8
	};
	var map = L.map( 'map', mapOpts );
	var tileOpts = {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		subdomains: 'abcd',
		minZoom: 0,
		maxZoom: 20,
		ext: 'png'
	};
	var Stamen_TonerLite = L.tileLayer( 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', tileOpts )
		.addTo( map );

	// Define icon
	var selectIcon = L.icon( {
		iconUrl: 'icon.svg',
		iconSize: [ 38, 38 ],
		iconAnchor: [ 1, 1 ],
		popupAnchor: [ -3, -76 ]
	} )

	var airportIcon = L.icon( {
		iconUrl: 'airport.svg',
		iconSize: [ 38, 38 ],
		iconAnchor: [ 1, 1 ],
		popupAnchor: [ -3, -76 ]
	} )


	// Hide all the components
	$( '#slide0' ).hide();
	$( '#slide1' ).hide();
	$( '#slide2' ).hide();
	// Create the array of slides
	var slides = [
		{
			title: "Inc5000 Companies in Pennsylvania",
			text: "Here you can see the high growth companies in the Inc5000 ranking from 2009 to 2016 in Pennsylvania. Click to see the industries and cities!",
			url: 'https://raw.githubusercontent.com/enjoyjubilee/Midterm_JavaScript_InteractiveMap/master/comp_map.geojson',
			zoom: 6,
			coordinates: [ 41.203323, -77.194527 ],
   },
		{
			title: "Find companies in Philadelphia",
			text: "You can search for high-growth companies by the year it gain rapid growth! (Remember to click 'Clear' whenever you leave the page)",
			url: 'https://raw.githubusercontent.com/enjoyjubilee/Midterm_JavaScript_InteractiveMap/master/comp_map.geojson',
			zoom: 10,
			coordinates: [ 39.952583, -75.165222 ],
   },
		{
			title: "Airport",
			text: "Here you can see all the commercial airports in Pennsylvania.Click to see the address and number of enplanements.",
			url: "https://raw.githubusercontent.com/enjoyjubilee/Find-the-way-for-high-growth-companies-to-airport-and-universities/master/PA_commercialAirports.geojson",
			zoom: 7,
			coordinates: [ 41.203323, -77.194527 ],
   },
 ];
	console.log( slides );

	var currentSlide = 0;
	console.log( currentSlide );
	// Build Main tab by clicking button on the top bar
	$( "#main" )
		.click( () => {
			console.log( "main tab activated" )
			currentSlide = 0;
			buildSlide( slides[ currentSlide ] );
			//	 displayButton( currentSlide );
			displayLeftBar( currentSlide )
		} );

	// Build Search tab by clicking button on the top bar
	$( "#search" )
		.click( () => {
			console.log( "search tab activated" )
			currentSlide = 1;
			buildSlide( slides[ currentSlide ] );
			search();
			displayLeftBar( currentSlide )
		} );

	$( "#airport" )
		.click( () => {
			console.log( "airport tab activated" )
			currentSlide = 2;
			buildSlide( slides[ currentSlide ] );
			// displayButton( currentSlide );
			displayLeftBar( currentSlide )
		} );

	// Come to the next page by clicking "Next"
	$( "#nextPage" )
		.click( () => {
			currentSlide = 1;
			buildSlide( slides[ currentSlide ] );
			displayLeftBar( currentSlide )
		} );

	// Come back to the front page by clicking "Home"
	$( "#homePage" )
		.click( () => {
			currentSlide = 0;
			buildSlide( slides[ currentSlide ] );
			displayLeftBar( currentSlide )
		} );



	// Define function
	var addTitle = ( title ) => {
		$( '.sidebar' )
			.append( `<h1 id='title'>${title}</h1>` )
	}
	var addText = ( text ) => {
		$( '.sidebar' )
			.append( `<h1 id='text'>${text}</h1>` )
	}
	var cleanup = () => {
		$( '#title' )
			.remove()
		$( '#text' )
			.remove()
	}
	var displayLeftBar = ( currentSlide ) => {
		if ( currentSlide == 0 ) {
			$( '#slide0' ).show();
			$( '#slide1' ).hide();
			$( '#slide2' ).hide();
			console.log( "slide 0" );
		} else if ( currentSlide == 1 ) {
			$( '#slide0' ).hide();
			$( '#slide1' ).show();
			$( '#slide2' ).hide();
			console.log( "slide 1" )
		} else {
			$( '#slide0' ).hide();
			$( '#slide1' ).hide();
			$( '#slide2' ).show();
			console.log( "slide 2" )
		}
	}
	var displayTopBar = ( currentSlide ) => {
		$( '#main' ).show();
		$( '#serach' ).show();
		$( '#route' ).show();
		$( '#backToFrontPage' ).show();
	}
	var geoJSONLayer;
	var getAndParseData = ( data ) => {
		if ( currentSlide == 0 ) {
			// For the first slide we need to get two datasets,url1 links to companies
			$.ajax( data.url )
				.done( function ( res ) {
					parsed = JSON.parse( res );
					if ( geoJSONLayer )
						map.removeLayer( geoJSONLayer );
					geoJSONLayer = L.geoJSON( parsed, {
						onEachFeature: ( feature, layer ) => {
							//		console.log( feature )
							layer.bindPopup( "Name: " + feature.properties.company +
								",   City: " + feature.properties.city + ",  Number of years on Inc5000: " +
								feature.properties.yrs_on_list );
						}
					} );
					geoJSONLayer.addTo( map );
				} );
		} else if ( currentSlide == 1 ) {
			$.ajax( data.url )
				.done( function ( res ) {
					parsed = JSON.parse( res );
					if ( geoJSONLayer )
						map.removeLayer( geoJSONLayer );
					geoJSONLayer = L.geoJSON( parsed, {
						onEachFeature: ( feature, layer ) => {
							layer.bindPopup( "Name: " + feature.properties.company +
								"  City: " + feature.properties.city + " Number of years on Inc5000: " +
								feature.properties.yrs_on_list );
						}
					} );
					geoJSONLayer.addTo( map );
					search();
				} )
		} else if ( currentSlide == 2 ) {
			$.ajax( data.url )
				.done( function ( res ) {
					parsed = JSON.parse( res );
					if ( geoJSONLayer )
						map.removeLayer( geoJSONLayer );
					geoJSONLayer = L.geoJSON( parsed, {
						pointToLayer: ( feature, latlng ) => {
							return L.marker( latlng, { icon: airportIcon } );
						},
						onEachFeature: ( feature, layer ) => {
							layer.bindPopup( "Name: " + feature.properties[ "Airport Name" ] +
								",  2016 enplanements " +
								feature.properties[ "CY 16 Enplanements" ] )
						}
					} );
					geoJSONLayer.addTo( map );

				} );
		} else {
			console.log( "Oops!" )
		}
	}
	var buildSlide = ( slideObject ) => {
		displayTopBar( slideObject )
		cleanup( slideObject )
		addTitle( slideObject.title )
		addText( slideObject.text )
		getAndParseData( slideObject )
		map.setView( slideObject.coordinates, slideObject.zoom )
	}
	var search = function () {
		var comp = 'https://raw.githubusercontent.com/enjoyjubilee/Midterm_JavaScript_InteractiveMap/master/comp_map.geojson';
		var LFilterOne;
		var LocationFilter1 = [];
		var remove = function ( data ) {
			_.each( data._layers, function ( markers ) {
				map.removeLayer( markers );
			} );
		};
		var reremove = function ( data ) {
			_.each( data, function ( layer ) {
				map.removeLayer( layer );
			} );
		};

		$( '#search1' ).click( function () {
			year = $( '#year' ).val();
			console.log( year );
			remove( geoJSONLayer );
			if ( year.length !== 0 ) {
				$( document ).ready( function () {
					$.ajax( comp ).done( function ( data ) {
						var parsedData = JSON.parse( data );
						LFilterOne = L.geoJson( parsedData, {
							pointToLayer: function ( feature, latlng ) {
								return L.marker( latlng, { icon: selectIcon } );
							}
						} );
						console.log( LFilterOne );
						LFilterOne.addTo( map );
						LocationFilter1.push( LFilterOne );
					} );
				} );
			}

		} );

		$( '#clear1' ).click( function () {
			reremove( LocationFilter1 );
			remove( LFilterOne );
			console.log( LocationFilter1 );
		} );
	}



	// Build the current page
	buildSlide( slides[ currentSlide ] )
	// displayButton( currentSlide )
	displayLeftBar( currentSlide )

} )();
