function createLocation (locationObject) {
  var locationInfo = {
    address: locationObject.formatted_address,
    latitude: locationObject.geometry.location.lat(),
    longitude: locationObject.geometry.location.lng()
  };

  // POST /locations

  $.ajax({
    url: "/locations",
    method: "POST",
    data: JSON.stringify(locationInfo),
    dataType: "json",
    contentType: 'application/json',
    success: function(results){
      $("#location-results").attr("data-id", results.location.id);
      findAndMapPlaces(map, currentCoords);
    },
    error: function(xhr, status, error) {
      console.log("There was an error saving your location: " + error);
      $("#location-results").append("There were no results for your location.");
    }
  });
}

function createPlace (placeObject) {

  var placeResourceConversion = {
    'natural_feature':        {'types': ['water'], 'count': [30]},
    'convenience_store':      {'types': ['water', 'food'], 'count': [6, 4]},
    'grocery_or_supermarket': {'types': ['water', 'food'], 'count': [15, 10]},
    'hospital':               {'types': ['medicine'], 'count': [15]},
    'pharmacy':               {'types': ['medicine'], 'count': [15]},
    'doctor':                 {'types': ['medicine'], 'count': [5]},
    'hardware_store':         {'types': ['tools'], 'count': [5]},
    'gas_station':            {'types': ['transportation'], 'count': [2]},
    'airport':                {'types': ['transportation'], 'count': [10]},
    'parking':                {'types': ['transportation'], 'count': [10]},
    'shopping_mall':          {'types': ['other'], 'count': [5]},
    'liquor_store':           {'types': ['other'], 'count': [2]},
    'bar':                    {'types': ['other'], 'count': [2]},
    'night_club':             {'types': ['other'], 'count': [2]},
    'police':                 {'types': ['weapons'], 'count': [30]},
    'locksmith':              {'types': ['tools'], 'count': [5]}
  };

  var description;
  // Look through the place object's types and find the type that matches.
  // If the type is a natural_feature but is not a natural source of water (pond, lake, river), break from the loop
  // Else get the resource type then break
  for (var i = 0; i < placeObject.types.length; i++) {
    if (types.indexOf(placeObject.types[i]) >= 0) {
      if (placeObject.types[i] === 'natural_feature' && placeObject.name.search(/(\bpond\b|\blake\b|\briver\b)/ig) < 0) {
        break;
      } else {
        description = placeObject.types[i];
        break;
      }
    }
  };

  if (description) {
    var placeInfo = {
      name: placeObject.name,
      address: placeObject.vicinity,
      resource_type: placeResourceConversion[description],
      latitude: placeObject.geometry.location.lat(),
      longitude: placeObject.geometry.location.lng(),
      location_id: $("#location-results").data("id"),
      description: description
    };

    // POST /places
    $.ajax({
      url: "/places",
      method: "POST",
      data: JSON.stringify(placeInfo),
      contentType: "application/json",
      dataType: "json",
      success: function(results) {
        console.log("Create place record from following info: " + JSON.stringify(placeInfo));
      },
      error: function(xhr, status, error) {
        console.log("There was an error saving your place: " + error);
      }
    });

  }
}

function createGunShop (placeObject) {
  var placeInfo = {
    name: placeObject.name,
    address: placeObject.vicinity,
    resource_type: {'types': ['weapons'], 'count': [30]},
    latitude: placeObject.geometry.location.lat(),
    longitude: placeObject.geometry.location.lng(),
    location_id: $("#location-results").data("id"),
    description: 'gun_shop'
  };

  // POST /places

  $.ajax({
    url: '/places',
    method: 'POST',
    data: JSON.stringify(placeInfo),
    contentType: 'application/json',
    dataType: 'json',
    success: function(results) {
      console.log("Create place record from following info: " + JSON.stringify(placeInfo));
    },
    error: function(xhr, status, error) {
      console.log("There was an error saving your place: " + error);
    }
  });
}
