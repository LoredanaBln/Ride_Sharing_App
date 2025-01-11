package main.ride_sharing_app.model.location;

import lombok.Data;

@Data
public class OSRMResponse {
    private Route[] routes;
}

