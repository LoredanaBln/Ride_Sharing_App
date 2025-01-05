package main.ride_sharing_app.controller;

import main.ride_sharing_app.model.GeoLocation;
import main.ride_sharing_app.model.RouteInfo;
import main.ride_sharing_app.service.LocationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestController {
    private final LocationService locationService;
    
    public TestController(LocationService locationService) {
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