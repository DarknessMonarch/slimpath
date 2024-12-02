"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PaypalImage from "@/public/assets/paypal.png";
import styles from "@/app/styles/paymentmethod.module.css";
import { useRouter } from "next/navigation";
import { RiSecurePaymentFill as SecurePayment } from "react-icons/ri";

const PAYMENT_CONFIG = {
  CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
  COINBASE_KEY: process.env.NEXT_PUBLIC_COINBASE_KEY,
};

export default function PaymentMethods({ params }) {
  const router = useRouter();
  const [paymentState, setPaymentState] = useState({
    result: null,
    isPaid: false,
    isCancel: false,
    status: "",
  });
  const [paypalButtonRendered, setPaypalButtonRendered] = useState(false);

  useEffect(() => {
    const loadPayPalScript = async () => {
      if (!window.paypal || paypalButtonRendered) return;

      // Clear the container to avoid multiple button renderings
      const container = document.getElementById("paypal-button-container");
      if (container) container.innerHTML = "";

      try {
        await window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: 1, // Ensures payment amount is set to $1
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              const details = await actions.order.capture();
              setPaymentState({
                result: details,
                isPaid: true,
                isCancel: false,
                status: "success", // Updates status to successful payment
              });
              toast.success("Payment successful");
            },
            onError: (err) => {
              setPaymentState({
                result: null,
                isPaid: false,
                isCancel: true,
                status: "error", // Updates status to error
              });
              toast.error("Payment failed");
              console.error("PayPal error:", err);
            },
            onCancel: () => {
              setPaymentState({
                result: null,
                isPaid: false,
                isCancel: true,
                status: "cancelled", // Updates status to cancelled
              });
              toast.error("Payment cancelled");
            },
          })
          .render("#paypal-button-container");
        setPaypalButtonRendered(true);
      } catch (error) {
        console.error("Error rendering PayPal buttons:", error);
      }
    };

    loadPayPalScript();
  }, [paypalButtonRendered]);

  return (
    <div className={styles.paymentContainer}>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${PAYMENT_CONFIG.CLIENT_ID}&currency=USD`}
        strategy="lazyOnload"
      />
      <div className={styles.sectionTitle}>
        <SecurePayment
          height={40}
          width={40}
          className={styles.overviewIcon}
          aria-label="secure icon"
        />
        <h3>Secure payment of $1</h3>
      </div>
      <div className={styles.payController} id="paypal-button-container">
        <Image
          src={PaypalImage}
          alt="paypal logo"
          width={200}
          height={100}
          className={styles.paymentPaypalImage}
        />
      </div>
    </div>
  );
}
