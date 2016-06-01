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

      var locationAddress = "<strong>Your location:</strong> " + results.location.address + "<br>";
      var locationSeeMoreLink = "<a href='' id='more-location-info'>See more</a>";

      $("#location-address").append(locationAddress);
      $("#location-results-container").append(locationSeeMoreLink);

      locationClickCallback();
    },
    fail: function(error) {
      console.log("There was an error saving your location: " + error);
      $("#location-results").append("There were no results for your location.");
    }
  });
}

function createPlace (placeObject) {

  var placeResourceConversion = {
    'natural_feature':        {'types': ['water'], 'count': [30]},
    'convenience_store':      {'types': ['food', 'water'], 'count': [4, 6]},
    'grocery_or_supermarket': {'types': ['food', 'water'], 'count': [10, 15]},
    'hospital':               {'types': ['medicine'], 'count': [10]},
    'pharmacy':               {'types': ['medicine'], 'count': [10]},
    'doctor':                 {'types': ['medicine'], 'count': [5]},
    'hardware_store':         {'types': ['tools'], 'count': [5]},
    'gas_station':            {'types': ['transportation'], 'count': [2]},
    'airport':                {'types': ['transportation'], 'count': [5]},
    'parking':                {'types': ['transportation'], 'count': [5]},
    'shopping_mall':          {'types': ['other'], 'count': [5]},
    'liquor_store':           {'types': ['other'], 'count': [2]},
    'bar':                    {'types': ['other'], 'count': [2]},
    'night_club':             {'types': ['other'], 'count': [2]},
    'police':                 {'types': ['weapons'], 'count': [30]},
    'locksmith':              {'types': ['tools'], 'count': [5]}
  };

  var resourceType;
  // Look through the place object's types and find the type that matches.
  // If the type is a natural_feature but is not a natural source of water (pond, lake, river), break from the loop
  // Else get the resource type then break
  for (var i = 0; i < placeObject.types.length; i++) {
    if (types.indexOf(placeObject.types[i]) >= 0) {
      if (placeObject.types[i] === 'natural_feature' && placeObject.name.search(/(\bpond\b|\blake\b|\briver\b)/ig) < 0) {
        break;
      } else {
        resourceType = placeObject.types[i];
        break;
      }
    }
  };

  if (resourceType) {
    var placeInfo = {
      name: placeObject.name,
      address: placeObject.vicinity,
      resource_type: placeResourceConversion[resourceType],
      latitude: placeObject.geometry.location.lat(),
      longitude: placeObject.geometry.location.lng(),
      location_id: $("#location-results").data("id")
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
      fail: function(error) {
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
    location_id: $("#location-results").data("id")
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
    fail: function(error) {
      console.log("There was an error saving your place: " + error);
    }
  });
}
