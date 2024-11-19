package model;

public enum OrderStatus {
    COMPLETED("completed"), CANCELED("cancelled");

    private String displayStatus;

    OrderStatus(String displayStatus) {
        this.displayStatus = displayStatus;
    }

    public String getDisplayStatus() {
        return displayStatus;
    }
}
