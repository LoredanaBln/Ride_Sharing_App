import {useState} from "react";

export const CancelOrderPrompt = ({
                                      onSubmit,
                                      onCancel,
                                  }: {
    onSubmit: (reason: string) => void;
    onCancel: () => void;
}) => {
    const [reason, setReason] = useState("");

    return (
        <div className="cancel-order-prompt">
            <h3>Cancel Order</h3>
            <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for cancellation"
                className="cancel-reason-input"
            />
            <div className="cancel-prompt-buttons">
                <button
                    onClick={() => onSubmit(reason)}
                    disabled={!reason.trim()}
                    className="confirm-button"
                >
                    Confirm
                </button>
                <button onClick={onCancel} className="cancel-button">
                    Back
                </button>
            </div>
        </div>
    );
};
