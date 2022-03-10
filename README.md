# leaflet-challenge

The USGS provides earthquake data in a number of different formats, updated every 5 minutes. The USGS GeoJSON Feed page (https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) has various links to pick the data set in a JSON format. In this challenge, the data for earthquakes with a magnitude of 4.5+ in the past 7 days was picked.

To visualize the data, API from Mapbox is required. To get the key, sign up for an account at https://www.mapbox.com/ and create an API key. Create a config.js file in the static/js/ directory and create the variable: var API_KEY = "insert your API key here";

Only with the API key, the webpage will load with the earthquakes on the map.
