import React, { useRef, useState } from "react";
import Modal from "@/components/Modal";

interface DeliveryModalProps {
	isOpen: boolean;
	onClose: () => void;
	deliveryEmail: string;
	setDeliveryEmail: (email: string) => void;
	termsAccepted: boolean;
	setTermsAccepted: (accepted: boolean) => void;
	onConfirm: () => Promise<boolean>;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({
	isOpen,
	onClose,
	deliveryEmail,
	setDeliveryEmail,
	termsAccepted,
	setTermsAccepted,
	onConfirm,
}) => {
	const [loading, setLoading] = useState(false);
	const continueButtonRef = useRef<HTMLButtonElement>(null);

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Product Delivery">
			<div className="mb-4">
				<label className="label text-text" htmlFor="email">
					Email
				</label>
				<input
					type="email"
					className="input input-bordered w-full bg-transparent text-text border border-primary placeholder:text-text"
					id="email"
					placeholder="Email for invoice updates"
					value={deliveryEmail}
					onChange={(e) => setDeliveryEmail(e.target.value)}
					required
				/>
			</div>
			<div className="flex items-center mb-4">
				<input
					className="checkbox"
					type="checkbox"
					id="terms"
					checked={termsAccepted}
					onChange={(e) => setTermsAccepted(e.target.checked)}
					required
				/>
				<label className="label text-text ml-2" htmlFor="terms">
					<span>I have read and agree to saint's</span>
					<a
						href="https://shop.saint.bet/tos"
						className="link text-primary hover:text-hover ml-1"
					>
						Terms of Service
					</a>
				</label>
			</div>
			<div className="gap-3 grid items-center mt-3">
				<button
					className="btn bg-secondary hover:bg-hover text-text"
					type="button"
					onClick={onClose}
				>
					Back
				</button>
				<button
					ref={continueButtonRef}
					className="btn bg-primary hover:bg-hover text-text"
					type="button"
					onClick={async () => {
						setLoading(true);
						continueButtonRef.current!.disabled = true;
						const confirmed = await onConfirm();
						setLoading(false);
						if (confirmed) {
							onClose();
						} else {
							continueButtonRef.current!.disabled = false;
						}
					}}
				>
					{loading ? "Processing..." : "Continue"}
				</button>
			</div>
		</Modal>
	);
};

export default DeliveryModal;
