import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import Footer from '@/components/custom/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Building2, ArrowRight, Star, CheckCircle } from 'lucide-react';

const founders = [
  {
    name: 'Sophie',
    img: '/landing-page/FounderImage2.png',
    speech: 'Sophie hired 5 experts for',
    logo: '/startup-logos/recap.png',
    logoAlt: 'recap',
    style: { top: '8%', left: '8%' },
  },
  {
    name: 'Marc',
    img: '/landing-page/FounderImage1.png',
    speech: 'Marc hired 3 experts for',
    logo: '/startup-logos/pacta.png',
    logoAlt: 'pacta',
    style: { top: '25%', left: '55%' },
  },
  {
    name: 'Clara',
    img: '/landing-page/FounderImage3.png',
    speech: 'Clara hired 2 experts for',
    logo: '/startup-logos/corbado.png',
    logoAlt: 'corbado',
    style: { top: '65%', left: '35%' },
  },
];

const retirees = [
  {
    name: 'Retiree1',
    img: '/landing-page/RetireeImage7.png',
    speech: 'I got hired at',
    logo: '/startup-logos/vestigas.png',
    logoAlt: 'vestigas',
    style: { top: '5%', right: '8%' },
  },
  {
    name: 'Retiree2',
    img: '/landing-page/RetireeImage8.png',
    speech: 'I got hired at',
    logo: '/startup-logos/personio.png',
    logoAlt: 'personio',
    style: { top: '15%', right: '38%' },
  },
  {
    name: 'Retiree3',
    img: '/landing-page/RetireeImage9.png',
    speech: 'I got hired at',
    logo: '/startup-logos/demodesk.png',
    logoAlt: 'demodesk',
    style: { top: '60%', right: '55%' },
  },
];

function SpeechBubble({
  text,
  logo,
  logoAlt,
  className = '',
  isPacta = false,
}: {
  text: string;
  logo: string;
  logoAlt: string;
  className?: string;
  isPacta?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col items-center ${className}`}
      style={{ minWidth: isPacta ? 280 : 220 }}
    >
      <div className="bg-white border-2 border-primary text-primary rounded-xl px-4 py-2 text-base font-semibold flex items-center shadow whitespace-nowrap">
        {text} <img src={logo} alt={logoAlt} className={`ml-2 ${isPacta ? 'h-4' : 'h-6'}`} />
      </div>
      <div className="w-4 h-4 bg-white border-l-2 border-b-2 border-primary rotate-45 -mt-2"></div>
    </div>
  );
}

const Landing = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>WiseUp</title>
        <meta
          name="description"
          content="Connect experienced retirees with innovative startups. Your expertise, their growth - together we build the future."
        />
      </Helmet>
      <main className="flex-1 flex items-center justify-center px-2 py-8">
        {/* Hero Mobile */}
        <div className="lg:hidden w-full">
          <div className="relative w-full rounded-3xl shadow-xl overflow-hidden mb-8 sm:bg-[linear-gradient(100deg,_#2f27ce_0%_50%,_white_50%_100%)] bg-[linear-gradient(170deg,_#2f27ce_0%_50%,_white_50%_100%)]">
            <div className="flex sm:flex-row flex-col justify-evenly pt-6 pb-12 px-4">
              {/* Founder Side */}
              <div className="flex flex-col items-center mb-8">
                <SpeechBubble
                  text={founders[0].speech}
                  logo={founders[0].logo}
                  logoAlt={founders[0].logoAlt}
                />
                <img
                  src={founders[0].img}
                  alt={founders[0].name}
                  className="w-28 h-28 object-cover rounded-2xl border-4 border-white shadow-lg mt-2"
                />

                <div className="text-white text-2xl font-bold mt-4 text-center">Your Growth</div>
                <button
                  type="button"
                  className="cursor-pointer bg-white text-primary text-lg font-semibold rounded-full px-6 py-2 mt-4 shadow border-2 border-primary transition-transform duration-200 ease-out hover:scale-[1.05]"
                  onClick={() => {
                    navigate('/signup?type=startup');
                  }}
                >
                  Sign Up as a Startup
                </button>
              </div>

              {/* Retiree Side */}
              <div className="flex flex-col items-center">
                <SpeechBubble
                  text={retirees[0].speech}
                  logo={retirees[0].logo}
                  logoAlt={retirees[0].logoAlt}
                />
                <img
                  src={retirees[0].img}
                  alt={retirees[0].name}
                  className="w-28 h-28 object-cover rounded-2xl border-4 border-white shadow-lg mt-2"
                />
                <div className="text-primary text-2xl font-bold mt-4 text-center">
                  Your Expertise
                </div>
                <button
                  type="button"
                  className="cursor-pointer bg-primary text-white text-lg font-semibold rounded-full px-6 py-2 mt-4 shadow border-2 border-primary transition-transform duration-200 ease-out hover:scale-[1.05]"
                  onClick={() => {
                    navigate('/signup?type=retiree');
                  }}
                >
                  Sign Up as a Retiree
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Hero Desktop */}
        <div
          className="relative w-full max-w-7xl h-[700px] rounded-3xl shadow-2xl overflow-hidden hidden lg:flex"
          style={{ background: 'linear-gradient(120deg, #2f27ce 0% 52%, #fff 52% 100%)' }}
        >
          <div className="flex-1 relative">
            {founders.map((f) => (
              <div
                key={f.name}
                className="absolute flex flex-col items-center"
                style={{ ...f.style, zIndex: 2 }}
              >
                <SpeechBubble
                  text={f.speech}
                  logo={f.logo}
                  logoAlt={f.logoAlt}
                  isPacta={f.logoAlt === 'pacta'}
                />
                <img
                  src={f.img}
                  alt={f.name}
                  className={`object-cover rounded-2xl border-4 border-white shadow-lg mt-2 ${
                    f.logoAlt === 'recap' || f.logoAlt === 'corbado' ? 'w-36 h-36' : 'w-32 h-32'
                  }`}
                />
              </div>
            ))}
            <div
              className="absolute left-1/4 top-1/2 -translate-y-1/2 text-white text-5xl font-bold text-center drop-shadow-lg select-none"
              style={{ zIndex: 1 }}
            >
              Your
              <br />
              Growth
            </div>
            <button
              type="button"
              className="cursor-pointer absolute left-10 bottom-10 bg-white text-primary text-xl font-semibold rounded-full px-12 py-4 shadow border-2 border-primary hover:bg-primary hover:text-white hover:border-white transition cursor-pointer"
              onClick={() => {
                navigate('/signup?type=startup');
              }}
            >
              Sign Up
              <br />
              as a Startup
            </button>
          </div>
          <div className="flex-1 relative">
            {retirees.map((r) => (
              <div
                key={r.name}
                className="absolute flex flex-col items-center"
                style={{ ...r.style, zIndex: 2 }}
              >
                <SpeechBubble text={r.speech} logo={r.logo} logoAlt={r.logoAlt} />
                <img
                  src={r.img}
                  alt={r.name}
                  className={`object-cover rounded-2xl border-4 border-white shadow-lg mt-2 ${
                    r.logoAlt === 'vestigas' || r.logoAlt === 'demodesk' ? 'w-36 h-36' : 'w-32 h-32'
                  }`}
                />
              </div>
            ))}
            <div
              className="absolute right-1/4 top-1/2 -translate-y-1/2 text-primary text-5xl font-bold text-center drop-shadow-lg select-none"
              style={{ zIndex: 1 }}
            >
              Your
              <br />
              Expertise
            </div>
            <button
              type="button"
              className="cursor-pointer absolute right-10 bottom-10 bg-primary text-white text-xl font-semibold rounded-full px-12 py-4 shadow border-2 border-primary hover:bg-white hover:text-primary transition"
              onClick={() => {
                navigate('/signup?type=retiree');
              }}
            >
              Sign Up
              <br />
              as a Retiree
            </button>
          </div>
        </div>
      </main>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Bridging Experience and Innovation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Where seasoned expertise meets fresh perspectives - creating powerful partnerships
              that drive success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full border border-primary border-2 flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">For Retirees</h3>
              <div className="space-y-4 text-center max-w-sm mx-auto">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-muted-foreground text-left">
                    Share your valuable experience with the next generation
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-muted-foreground text-left">
                    Flexible work arrangements that fit your lifestyle
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-muted-foreground text-left">
                    Stay connected and relevant in today's business world
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-muted-foreground text-left">
                    Earn additional income while making a meaningful impact
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full border border-primary border-2 flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">For Startups</h3>
              <div className="space-y-4 text-center max-w-sm mx-auto">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-muted-foreground text-left">
                    Access proven expertise without full-time commitments
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-muted-foreground text-left">
                    Accelerate growth with strategic guidance and mentorship
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-muted-foreground text-left">
                    Reduce risks through experienced decision-making
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-muted-foreground text-left">
                    Build stronger foundations with industry veterans
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 backdrop-filter backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How WiseUp Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, secure and effective - connecting experience with opportunity in just three
              steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Set up your profile highlighting your experience, skills and what you're looking
                for.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Smart Matching</h3>
              <p className="text-muted-foreground">
                Our intelligent algorithm connects you with the most suitable partners based on your
                needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Start Collaborating</h3>
              <p className="text-muted-foreground">
                Connect directly, discuss terms and begin your successful partnership journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real connections, real results - see how WiseUp is transforming the way experience
              meets opportunity
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }, (_, idx) => idx + 1).map((star) => (
                    <Star
                      key={`hans-weber-star-${String(star)}`}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "After 30 years in IT, I wanted to stay active and share my knowledge. WiseUp
                  connected me with a fintech startup that needed my expertise. Now I'm helping them
                  build a robust technical foundation while working on my own schedule."
                </p>
                <div>
                  <p className="font-semibold text-foreground">Dr. Hans Weber</p>
                  <p className="text-sm text-muted-foreground">
                    Former CTO, 30 years IT experience
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }, (_, idx) => idx + 1).map((star) => (
                    <Star
                      key={`sarah-muller-star-${String(star)}`}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "We were struggling with our market entry strategy until we found an experienced
                  marketing director through WiseUp. Her insights helped us avoid costly mistakes
                  and position ourselves correctly. The ROI was incredible."
                </p>
                <div>
                  <p className="font-semibold text-foreground">Sarah Müller</p>
                  <p className="text-sm text-muted-foreground">CEO, TechStart GmbH</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-primary backdrop-filter backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Connect?</h2>
          <p className="text-xl mb-8 opacity-90">
            Whether you're looking to share your expertise or seeking experienced guidance, WiseUp
            is your bridge to meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="px-4 py-2 text-primary rounded-full border border-1 transition-shadow transition-colors cursor-pointer font-medium border border-[rgba(255,255,255,0.3)] bg-white/40 bg-clip-padding backdrop-filter backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:text-primary hover:border-primary hover:bg-transparent hover:shadow-lg transform transition-transform duration-200 hover:scale-[1.05] ease-out group cursor-pointer"
              onClick={() => {
                navigate('/signup?type=startup');
              }}
            >
              Join as Startup
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              className="text-sm px-4 py-2 rounded-full border border-1 transition-shadow transition-colors cursor-pointer bg-primary border-primary text-primary-foreground shadow-md transform transition-transform duration-200 ease-out hover:scale-[1.05] hover:bg-primary group cursor-pointer"
              onClick={() => {
                navigate('/signup?type=retiree');
              }}
            >
              Join as Retiree
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
