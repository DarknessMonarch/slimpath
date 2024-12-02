"use client";

import styles from "@/app/styles/about.module.css";

export default function TermInfo() {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutWrapper}>
        
        <div className={styles.aboutContainerInner}>
          <h1>Terms of Use</h1>
          <p>
            Welcome to Slimpath! By using our website, you agree to these terms and conditions. 
            Slimpath aims to support your weight management journey with helpful tracking tools, but 
            please remember that our platform is for general guidance only and does not replace 
            professional medical advice.
          </p>
          <p>
            <strong>Personal Responsibility:</strong> You acknowledge that the results from calorie 
            tracking and weight management may vary for each individual. We encourage consulting a healthcare 
            professional before making significant changes to your diet or exercise routines.
          </p>
          <p>
            <strong>Respectful Use:</strong> We aim to create a positive experience for all users. Please use our tools 
            respectfully, and avoid any misuse or disruptive behavior on the platform.
          </p>
          <p>
            <strong>Acceptance of Risks:</strong> Engaging with Slimpath&apos;s content and tools is voluntary, and you assume any 
            associated risks. Slimpath does not guarantee specific outcomes or results.
          </p>
        </div>

        <div className={styles.aboutContainerInner}>
          <h1>Privacy Policy</h1>
          <p>
            We value your privacy and strive to protect your personal information. This Privacy Policy explains 
            how we handle data collection, use, and protection.
          </p>
          <p>
            <strong>Information Collection:</strong> Slimpath collects data to improve your experience, including 
            information you provide (such as email) and usage data (like pages visited).
          </p>
          <p>
            <strong>Use of Data:</strong> We use this data to personalize content, respond to inquiries, and enhance our services.
          </p>
          <p>
            <strong>Third-Party Links:</strong> Slimpath may link to third-party sites for additional resources. We are 
            not responsible for their privacy practices, so please review their policies.
          </p>
          <p>
            <strong>Security:</strong> While we implement measures to protect your information, please note that 
            no method of online data transmission is completely secure.
          </p>
          <p>
            <strong>Your Rights:</strong> You have the right to access, update, or delete your personal data, manage cookies, 
            and opt out of promotional communications.
          </p>
          <p>
            <strong>Updates:</strong> We may update our Privacy Policy periodically. Significant changes will be shared on our website.
          </p>
        </div>

        <div className={styles.aboutContainerInner}>
          <h1>Refund Policy</h1>
          <p>
            At Slimpath, we offer subscription-based access to advanced tools and resources. Here’s our approach 
            to refunds:
          </p>
          <p>
            <strong>No Refunds:</strong> Payments for our services are non-refundable. Once a subscription begins, 
            users are granted full access to Slimpath&apos;s features for the duration of their subscription.
          </p>
          <p>
            <strong>Subscription Cancellation:</strong> You can cancel your subscription at any time. Your access 
            will remain active until the end of the current billing period, but no partial refunds will be issued.
          </p>
          <p>
            <strong>Technical Assistance:</strong> If you encounter technical issues, please contact us for assistance. 
            However, technical issues do not qualify for refunds due to the nature of our service.
          </p>
          <p>
            <strong>Contact:</strong> For any inquiries or support, reach out to us at <a href="mailto:support@Slimpath.com">support@Slimpath.com</a>.
          </p>
        </div>

      </div>
    </div>
  );
}
