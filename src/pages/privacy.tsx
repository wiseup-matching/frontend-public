import { Helmet } from 'react-helmet-async';

const Privacy = () => (
  <div className="min-h-screen pt-16">
    <Helmet>
      <title>Privacy Policy</title>
      <meta
        name="description"
        content="Read the privacy policy for WiseUp. Learn how we handle your data and protect your privacy."
      />
    </Helmet>
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-primary">Privacy Policy</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        Your privacy is important to us. This privacy policy explains how WiseUp collects, uses and
        protects your personal data when you use our platform.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">1. Data We Collect</h2>
      <ul className="list-disc ml-6 mb-4 text-muted-foreground">
        <li>Personal information (name, email address, etc.) provided during registration</li>
        <li>Profile and career information you choose to share</li>
        <li>Usage data (log files, device information, cookies)</li>
        <li>Communication data (messages, support requests)</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2">2. How We Use Your Data</h2>
      <ul className="list-disc ml-6 mb-4 text-muted-foreground">
        <li>To provide and improve our services</li>
        <li>To personalize your experience</li>
        <li>To communicate with you about your account or support requests</li>
        <li>To comply with legal obligations</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2">3. Data Sharing</h2>
      <ul className="list-disc ml-6 mb-4 text-muted-foreground">
        <li>We do not sell your personal data.</li>
        <li>
          We may share data with service providers who help us operate the platform (e.g., hosting,
          analytics).
        </li>
        <li>We may disclose data if required by law or to protect our rights.</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2">4. Your Rights</h2>
      <ul className="list-disc ml-6 mb-4 text-muted-foreground">
        <li>You can access, update, or delete your personal data at any time.</li>
        <li>You can object to certain uses of your data or withdraw consent.</li>
        <li>Contact us for any privacy-related requests.</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2">5. Contact</h2>
      <p className="mb-4 text-muted-foreground">
        If you have any questions about this privacy policy or your data, please contact us at:
      </p>
      <p className="mb-2 text-muted-foreground">
        WiseUp Team
        <br />
        Email: support@wiseup.com
      </p>
      <p className="text-xs text-muted-foreground mt-8">
        This privacy policy may be updated from time to time. Please check this page regularly for
        updates.
      </p>
    </div>
  </div>
);

export default Privacy;
