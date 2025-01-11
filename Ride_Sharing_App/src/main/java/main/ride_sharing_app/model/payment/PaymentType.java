package main.ride_sharing_app.model.payment;

import lombok.Getter;

@Getter
public enum PaymentType{
    CASH("Cash"), CREDIT_CARD("Credit Card"), PAYPAL("Paypal");

    private final String displayPaymentType;

    PaymentType(String displayType) {
        this.displayPaymentType = displayType;
    }

}