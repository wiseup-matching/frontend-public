import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Footer from '@/components/custom/Footer';
import {
  Users,
  Clock,
  Target,
  Star,
  ArrowRight,
  Handshake,
  Heart,
  TrendingUp,
  Briefcase,
} from 'lucide-react';

const ForRetirees = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const benefits = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: 'Meaningful Engagement',
      description: 'Use your valuable experience to support startups and make a real difference.',
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: 'Time Management',
      description:
        'Work when and how much you want - whether hourly, project-based, or as a consultant.',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: 'Additional Income',
      description:
        'Earn money with your expertise and experience without being tied to fixed working hours.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'New Connections',
      description:
        'Network with young entrepreneurs and stay connected with the current business world.',
    },
  ];

  const features = [
    {
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      title: 'Retiree Profile',
      description:
        'Present your experience and expertise in an attractive profile for interested startups.',
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: 'Matching Opportunities',
      description:
        'Receive inquiries from startups that perfectly match your skills and interests.',
    },
    {
      icon: <Handshake className="h-6 w-6 text-primary" />,
      title: 'Direct Communication',
      description: 'Communicate directly with startups and arrange flexible cooperation models.',
    },
    {
      icon: <Star className="h-6 w-6 text-primary" />,
      title: 'Free to Use',
      description: 'WiseUp is 100% free for retirees. No paywalls, no hidden costs, no fees.',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Hans Weber',
      role: 'Former CTO, 30 years IT experience',
      content:
        'Through WiseUp, I can meaningfully apply my experience and support young startups. The flexible time management is perfect for me.',
      rating: 5,
    },
    {
      name: 'Maria Schmidt',
      role: 'Former Marketing Director, 25 years industry experience',
      content:
        'It gives me great joy to pass on my knowledge and see how startups benefit from it. A very fulfilling activity!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>For Retirees</title>
        <meta
          name="description"
          content="Use your experience and support startups with your valuable expertise."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Use Your Experience for
              <span className="text-primary block">Startups</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect with startups that want to benefit from your valuable expertise and years of
              experience. Support the next generation of entrepreneurs and stay active in active
              retirement.
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                className="text-sm px-4 py-2 rounded-full border border-1 transition-shadow transition-colors cursor-pointer bg-primary border-primary text-primary-foreground shadow-md transform transition-transform duration-200 ease-out hover:scale-[1.05] hover:bg-primary group"
                onClick={() => {
                  navigate('/signup?type=retiree');
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
              Why WiseUp for You?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the benefits that WiseUp offers you as an experienced retiree
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it easy for you to offer your expertise
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              In Three Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From registration to first collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Create Profile</h3>
              <p className="text-muted-foreground">
                Create your retiree profile with your skills, experiences and areas of interest.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Receive Inquiries</h3>
              <p className="text-muted-foreground">
                Startups contact you directly when they need your experience.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Collaborate</h3>
              <p className="text-muted-foreground">
                Arrange flexible cooperation models and support startups with your knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Retirees Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Success stories from experienced retirees who are active with WiseUp
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Share Your Experience?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of experienced retirees who already support startups with their knowledge.
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="px-4 py-2 text-primary rounded-full border border-1 transition-shadow transition-colors cursor-pointer font-medium border border-[rgba(255,255,255,0.3)] bg-white/40 bg-clip-padding backdrop-filter backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:text-primary hover:border-primary hover:bg-transparent hover:shadow-lg transform transition-transform duration-200 hover:scale-[1.05] ease-out group"
              onClick={() => {
                navigate('/signup?type=retiree');
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

export default ForRetirees;
