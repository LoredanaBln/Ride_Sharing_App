package main.ride_sharing_app.controller;

import main.ride_sharing_app.model.location.GeoLocation;
import main.ride_sharing_app.model.location.RouteInfo;
import main.ride_sharing_app.service.LocationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/testMap")
public class TestMapController {
    private final LocationService locationService;
    
    public TestMapController(LocationService locationService) {
        this.locationService = locationService;
    }
    
    @GetMapping("/geocode")
    public GeoLocation testGeocode(@RequestParam String address) {
        return locationService.getCoordinates(address);
    }
    
    @GetMapping("/route")
    public RouteInfo testRoute(
        @RequestParam Double startLat,
        @RequestParam Double startLon,
        @RequestParam Double endLat,
        @RequestParam Double endLon
    ) {
        return locationService.getRoute(
            new GeoLocation(startLat, startLon),
            new GeoLocation(endLat, endLon)
        );
    }
} 