import { Helmet } from 'react-helmet-async';

const Imprint = () => (
  <div className="min-h-screen pt-16">
    <Helmet>
      <title>Imprint</title>
      <meta name="description" content="Legal notice and company information for WiseUp." />
    </Helmet>
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-primary">Imprint / Legal Notice</h1>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Provider</h2>
      <p className="mb-4 text-muted-foreground">
        WiseUp
        <br />
        Example Street 1<br />
        12345 Example City
        <br />
        Country: Germany
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Contact</h2>
      <p className="mb-4 text-muted-foreground">
        Email: support@wiseup.com
        <br />
        Phone: +49 123 4567890
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Represented by</h2>
      <p className="mb-4 text-muted-foreground">John Doe (Managing Director)</p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">VAT ID</h2>
      <p className="mb-4 text-muted-foreground">DE123456789</p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Disclaimer</h2>
      <p className="mb-4 text-muted-foreground">
        Despite careful content control, we assume no liability for the content of external links.
        The operators of the linked pages are solely responsible for their content.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Copyright</h2>
      <p className="mb-4 text-muted-foreground">
        All content and works on these pages created by WiseUp are subject to copyright. Any
        duplication, processing, distribution, or any form of commercialization beyond the scope of
        copyright law shall require the prior written consent of the respective author or creator.
      </p>
    </div>
  </div>
);

export default Imprint;
