package main.ride_sharing_app.controller;

import com.stripe.exception.StripeException;
import main.ride_sharing_app.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payment/driver")
public class DriverPaymentController {

    private final PaymentService paymentService;

    public DriverPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/setupConnect/{driverId}")
    public ResponseEntity<String> setupConnectAccount(@PathVariable Long driverId) {
        try {
            String accountId = paymentService.getOrCreateStripeConnectAccount(driverId);
            return ResponseEntity.ok(accountId);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/attachBankAccount")
    public ResponseEntity<String> attachBankAccount(@RequestBody BankAccountRequest request) {
        try {
            String bankAccountId = paymentService.attachBankAccount(
                request.getAccountNumber(),
                request.getRoutingNumber(),
                request.getAccountHolderName(),
                request.getConnectAccountId()
            );
            return ResponseEntity.ok(bankAccountId);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/bankAccounts/{connectAccountId}")
    public ResponseEntity<List<Map<String, String>>> getBankAccounts(
        @PathVariable String connectAccountId
    ) {
        try {
            List<Map<String, String>> accounts = paymentService.getBankAccounts(connectAccountId);
            return ResponseEntity.ok(accounts);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/bankAccount/{bankAccountId}")
    public ResponseEntity<String> deleteBankAccount(
        @PathVariable String bankAccountId,
        @RequestParam String connectAccountId
    ) {
        try {
            paymentService.deleteBankAccount(bankAccountId, connectAccountId);
            return ResponseEntity.ok().build();
        } catch (StripeException e) {
            e.printStackTrace();
            if (e.getMessage().contains("default external account")) {
                return ResponseEntity.badRequest().body("Cannot delete the default bank account. Please add another bank account and set it as default first.");
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public static class BankAccountRequest {
        private String accountNumber;
        private String routingNumber;
        private String accountHolderName;
        private String connectAccountId;

        // Getters and setters
        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
        
        public String getRoutingNumber() { return routingNumber; }
        public void setRoutingNumber(String routingNumber) { this.routingNumber = routingNumber; }
        
        public String getAccountHolderName() { return accountHolderName; }
        public void setAccountHolderName(String accountHolderName) { this.accountHolderName = accountHolderName; }
        
        public String getConnectAccountId() { return connectAccountId; }
        public void setConnectAccountId(String connectAccountId) { this.connectAccountId = connectAccountId; }
    }
} 