import { Helmet } from 'react-helmet-async';

const Terms = () => (
  <div className="min-h-screen pt-16">
    <Helmet>
      <title>Terms of Service</title>
      <meta
        name="description"
        content="Read the terms of service for WiseUp. Learn about the rules and conditions for using our platform."
      />
    </Helmet>
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-primary">Terms of Service</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        These terms of service govern your use of the WiseUp platform. By using our service, you
        agree to these terms.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">1. Acceptance of Terms</h2>
      <p className="mb-4 text-muted-foreground">
        By accessing and using WiseUp, you accept and agree to be bound by the terms and provision
        of this agreement. If you do not agree to abide by the above, please do not use this
        service.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">2. Description of Service</h2>
      <p className="mb-4 text-muted-foreground">
        WiseUp is a platform that connects experienced retirees with startups seeking expertise. We
        facilitate matching, communication and collaboration between these parties.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">3. User Responsibilities</h2>
      <ul className="list-disc ml-6 mb-4 text-muted-foreground">
        <li>Provide accurate and truthful information in your profile</li>
        <li>Maintain the confidentiality of your account credentials</li>
        <li>Use the platform for lawful purposes only</li>
        <li>Respect the privacy and rights of other users</li>
        <li>Not engage in spam, harassment, or fraudulent activities</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">4. Startup Responsibilities</h2>
      <ul className="list-disc ml-6 mb-4 text-muted-foreground">
        <li>Provide clear and accurate project requirements</li>
        <li>Communicate professionally with retirees</li>
        <li>Honor agreed-upon terms and compensation</li>
        <li>Provide feedback and ratings in good faith</li>
        <li>Not misrepresent your company or project needs</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">5. Retiree Responsibilities</h2>
      <ul className="list-disc ml-6 mb-4 text-muted-foreground">
        <li>Provide accurate information about your expertise and experience</li>
        <li>Respond to inquiries in a timely manner</li>
        <li>Deliver services as agreed upon</li>
        <li>Maintain professional conduct and confidentiality</li>
        <li>Not misrepresent your qualifications or capabilities</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">6. Payment and Fees</h2>
      <p className="mb-4 text-muted-foreground">
        WiseUp may charge fees for certain premium features or services. All fees are clearly
        disclosed before purchase. Payment terms and conditions will be specified for each service.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">7. Intellectual Property</h2>
      <p className="mb-4 text-muted-foreground">
        Users retain ownership of their content and intellectual property. By using WiseUp, you
        grant us a limited license to display and distribute your content as necessary to provide
        our services.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">8. Privacy and Data Protection</h2>
      <p className="mb-4 text-muted-foreground">
        Your privacy is important to us. Our collection and use of personal information is governed
        by our Privacy Policy, which is incorporated into these terms by reference.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">9. Limitation of Liability</h2>
      <p className="mb-4 text-muted-foreground">
        WiseUp acts as a facilitator and is not responsible for the quality of services provided by
        retirees or the outcomes of collaborations. We are not liable for any damages arising from
        the use of our platform.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">10. Dispute Resolution</h2>
      <p className="mb-4 text-muted-foreground">
        Users are encouraged to resolve disputes directly. WiseUp may assist in mediation but is not
        responsible for resolving conflicts between users.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">11. Termination</h2>
      <p className="mb-4 text-muted-foreground">
        We reserve the right to terminate or suspend accounts that violate these terms. Users may
        also terminate their accounts at any time through their account settings.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">12. Changes to Terms</h2>
      <p className="mb-4 text-muted-foreground">
        We may update these terms from time to time. Users will be notified of significant changes,
        and continued use of the platform constitutes acceptance of updated terms.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">13. Governing Law</h2>
      <p className="mb-4 text-muted-foreground">
        These terms are governed by the laws of Germany. Any disputes shall be resolved in the
        courts of Germany.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">14. Contact Information</h2>
      <p className="mb-4 text-muted-foreground">
        If you have any questions about these terms of service, please contact us at:
      </p>
      <p className="mb-2 text-muted-foreground">
        WiseUp Team
        <br />
        Email: support@wiseup.com
      </p>

      <p className="text-xs text-muted-foreground mt-8">
        These terms of service were last updated on July 19, 2025. Please check this page regularly
        for updates.
      </p>
    </div>
  </div>
);

export default Terms;
