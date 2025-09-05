import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Footer from '@/components/custom/Footer';
import {
  Users,
  Brain,
  Clock,
  Target,
  Shield,
  Star,
  ArrowRight,
  Building2,
  Handshake,
} from 'lucide-react';

const ForStartups = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const benefits = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: 'Experienced Expertise',
      description:
        'Access decades of industry experience and specialized knowledge that only seasoned retirees can provide.',
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: 'Flexible Availability',
      description:
        'Work with retirees who can manage their time flexibly and focus entirely on your project.',
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: 'Targeted Consulting',
      description:
        'Receive strategic advice from retirees who have successfully overcome similar challenges.',
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Risk Mitigation',
      description: 'Reduce risks through proven methods and practical experience from the field.',
    },
  ];

  const features = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: 'Intelligent Matching',
      description:
        'Our algorithm automatically connects you with the most suitable retirees based on your requirements.',
    },
    {
      icon: <Building2 className="h-6 w-6 text-primary" />,
      title: 'Startup Profiles',
      description:
        'Present your startup professionally and find retirees who align with your vision.',
    },
    {
      icon: <Handshake className="h-6 w-6 text-primary" />,
      title: 'Direct Communication',
      description: 'Communicate directly with retirees and arrange flexible cooperation models.',
    },
    {
      icon: <Star className="h-6 w-6 text-primary" />,
      title: 'Flexible Pricing',
      description:
        'Choose between monthly or yearly plans. Free, Silver, and Gold tiers available. Book extra connections as needed.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Müller',
      role: 'CEO, TechStart GmbH',
      content:
        'Thanks to WiseUp, we found an experienced CTO who supports us in building our technical infrastructure. His expertise was invaluable.',
      rating: 5,
    },
    {
      name: 'Michael Weber',
      role: 'Founder, GreenTech Solutions',
      content:
        'The consulting from an experienced market expert helped us optimize our market entry strategy. Highly recommended!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>For Startups</title>
        <meta
          name="description"
          content="Discover how WiseUp connects your startup with experienced retirees and accelerates your growth."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Accelerate Your Startup with
              <span className="text-primary block">Experienced Expertise</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect with experienced retirees who support your startup with their knowledge and
              experience. From strategic consulting to practical implementation - at WiseUp you'll
              find the right retirees.
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                className="text-sm px-4 py-2 rounded-full border border-1 transition-shadow transition-colors cursor-pointer bg-primary border-primary text-primary-foreground shadow-md transform transition-transform duration-200 ease-out hover:scale-[1.05] hover:bg-primary group"
                onClick={() => {
                  navigate('/signup?type=startup');
                }}
              >
                Start for free now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why WiseUp for Your Startup?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn how experienced retirees can take your startup to the next level
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <Card
                key={benefit.title}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">{benefit.icon}</div>
                  <CardTitle className="text-xl font-semibold">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 backdrop-filter backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides you with all the tools to successfully collaborate with retirees
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              In just three steps to your perfect retiree support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Create Profile & Job Postings
              </h3>
              <p className="text-muted-foreground">
                Create your startup profile and describe your challenges and goals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Find Retirees</h3>
              <p className="text-muted-foreground">
                Our matching algorithm shows you the most suitable retirees for your requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Collaborate</h3>
              <p className="text-muted-foreground">
                Contact retirees directly and start your successful collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Customer Startups Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Success stories from startups that have grown with and through WiseUp
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }, (_, idx) => idx + 1).map((star) => (
                      <Star
                        key={`${testimonial.name}-star-${String(star)}`}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-primary backdrop-filter backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Accelerate Your Startup?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of startups that already benefit from the expertise of experienced
            retirees.
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="px-4 py-2 text-primary rounded-full border border-1 transition-shadow transition-colors cursor-pointer font-medium border border-[rgba(255,255,255,0.3)] bg-white/40 bg-clip-padding backdrop-filter backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:text-primary hover:border-primary hover:bg-transparent hover:shadow-lg transform transition-transform duration-200 hover:scale-[1.05] ease-out group"
              onClick={() => {
                navigate('/signup?type=startup');
              }}
            >
              Start for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForStartups;
