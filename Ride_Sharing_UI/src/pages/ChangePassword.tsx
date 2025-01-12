  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import "../styles/changePassword.css";
  import {requestPasswordReset} from "../api/requestPassengerResetPassword.ts";
  import {confirmPasswordReset} from "../api/confirmPassengerResetPassword.ts";

  const ChangePassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [step, setStep] = useState<"request" | "confirm">("request");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRequestReset = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const message = await requestPasswordReset(email);
        setSuccess("Check your email! We've sent you a reset token.");
        setStep("confirm");
        console.log("Reset request response:", message);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      }
    };

    const handleConfirmReset = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await confirmPasswordReset(token, newPassword);
        setSuccess("Password has been reset successfully");
        setTimeout(() => navigate("/"), 2000);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      }
    };
    return (
      <div className="change-password-container">
        <div className="change-password-box">
          <h1>{step === "request" ? "Reset Password" : "Enter New Password"}</h1>

          {step === "request" ? (
            <form onSubmit={handleRequestReset}>
              <div className="input-container">
                <input
                  type="email"
                  value={email}
                  autoComplete={"email"}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Send Token
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirmReset}>
              <div className="input-container">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter reset token"
                  required
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Reset Password
              </button>
            </form>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

        </div>
      </div>
    );
  };

  export default ChangePassword;
