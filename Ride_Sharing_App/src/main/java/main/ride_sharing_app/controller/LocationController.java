package main.ride_sharing_app.controller;

import main.ride_sharing_app.model.location.GeoLocation;
import main.ride_sharing_app.model.location.RouteInfo;
import main.ride_sharing_app.service.LocationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/location")
public class LocationController {
    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/geocode")
    public GeoLocation geocode(@RequestParam String address) {
        return locationService.getCoordinates(address);
    }

    @GetMapping("/route")
    public RouteInfo route(
            @RequestParam Double startLat,
            @RequestParam Double startLon,
            @RequestParam Double endLat,
            @RequestParam Double endLon
    ) {
        return locationService.getRoute(
                new GeoLocation(startLat, startLon),
                new GeoLocation(endLat, endLon)
        );
    }}
