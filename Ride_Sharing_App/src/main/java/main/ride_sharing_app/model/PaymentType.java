package main.ride_sharing_app.model;

public enum PaymentType{
    CASH("Cash"), CREDIT_CARD("Credit Card"), PAYPAL("Paypal");

    private String displayPaymentType;

    PaymentType(String displayType) {
        this.displayPaymentType = displayType;
    }

    public String getDisplayPaymentType() {
        return displayPaymentType;
    }
}