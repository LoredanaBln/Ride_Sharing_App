package main.ride_sharing_app.service;

import main.ride_sharing_app.model.location.GeoLocation;
import main.ride_sharing_app.model.location.RouteInfo;
import main.ride_sharing_app.model.location.NominatimResponse;
import main.ride_sharing_app.model.location.OSRMResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.util.concurrent.RateLimiter;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;
import main.ride_sharing_app.model.location.Route;

@Service
public class LocationService {
    private static final String NOMINATIM_API = "https://nominatim.openstreetmap.org";
    private static final String OSRM_API = "https://router.project-osrm.org/route/v1/driving";
    
    private final RestTemplate restTemplate;
    private final Cache<String, GeoLocation> locationCache;
    private final Cache<String, RouteInfo> routeCache;
    private final RateLimiter nominatimLimiter;
    
    public LocationService() {
        this.restTemplate = new RestTemplate();
        this.nominatimLimiter = RateLimiter.create(1.0);
        
        this.locationCache = CacheBuilder.newBuilder()
            .expireAfterWrite(24, TimeUnit.HOURS)
            .build();
            
        this.routeCache = CacheBuilder.newBuilder()
            .expireAfterWrite(1, TimeUnit.HOURS)
            .build();
            
        restTemplate.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().set("User-Agent", "RideSharingApp/1.0");
            return execution.execute(request, body);
        });
    }
    
    public GeoLocation getCoordinates(String address) {
        String cacheKey = "loc:" + address;
        GeoLocation cached = locationCache.getIfPresent(cacheKey);
        if (cached != null) {
            return cached;
        }

        nominatimLimiter.acquire();
        
        String url = String.format("%s/search?q=%s&format=json", 
            NOMINATIM_API, 
            URLEncoder.encode(address, StandardCharsets.UTF_8)
        );
        
        ResponseEntity<NominatimResponse[]> response = restTemplate.getForEntity(
            url, 
            NominatimResponse[].class
        );
        
        if (response.getBody() != null && response.getBody().length > 0) {
            NominatimResponse location = response.getBody()[0];
            GeoLocation result = new GeoLocation(
                Double.parseDouble(location.getLat()),
                Double.parseDouble(location.getLon())
            );
            
            locationCache.put(cacheKey, result);
            return result;
        }
        
        throw new RuntimeException("Location not found");
    }
    
    public RouteInfo getRoute(GeoLocation start, GeoLocation end) {
        String cacheKey = String.format("route:%f,%f-%f,%f", 
            start.getLatitude(), start.getLongitude(),
            end.getLatitude(), end.getLongitude()
        );
        
        RouteInfo cached = routeCache.getIfPresent(cacheKey);
        if (cached != null) {
            return cached;
        }
        
        String url = String.format("%s/%f,%f;%f,%f?overview=full",
            OSRM_API,
            start.getLongitude(), start.getLatitude(),
            end.getLongitude(), end.getLatitude()
        );
        
        ResponseEntity<OSRMResponse> response = restTemplate.getForEntity(
            url, 
            OSRMResponse.class
        );
        
        if (response.getBody() != null && response.getBody().getRoutes().length > 0) {
            Route route = response.getBody().getRoutes()[0];
            RouteInfo result = new RouteInfo(
                route.getDistance(), 
                route.getDuration(),
                route.getGeometry()
            );
            routeCache.put(cacheKey, result);
            return result;
        }
        
        throw new RuntimeException("Could not calculate route");
    }
} 