package model;

import java.io.Serializable;

public enum PaymentType implements Serializable {
    CASH("Cash"), CREDIT_CARD("Credit Card"), PAYPAL("Paypal");

    private String displayPaymentType;

    PaymentType(String displayType) {
        this.displayPaymentType = displayType;
    }

    public String getDisplayPaymentType() {
        return displayPaymentType;
    }
}
