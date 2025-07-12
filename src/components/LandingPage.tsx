import React from 'react';
import { Users, MessageCircle, Star, Shield, ArrowRight, CheckCircle, Zap, Globe } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Users,
      title: "Find Skilled People",
      description: "Connect with talented individuals in your community who want to exchange knowledge"
    },
    {
      icon: MessageCircle,
      title: "Real-time Communication",
      description: "Chat directly with your skill swap partners to coordinate learning sessions"
    },
    {
      icon: Star,
      title: "Rating System",
      description: "Build trust through our comprehensive feedback and rating system"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Safe and moderated environment for all your skill exchange activities"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "50,000+", label: "Skills Exchanged" },
    { number: "98%", label: "Success Rate" },
    { number: "150+", label: "Countries" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Graphic Designer",
      content: "SkillSwap helped me learn web development while teaching design. The community is amazing!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Marketing Specialist",
      content: "I've learned photography and video editing through skill swaps. It's been an incredible journey.",
      rating: 5
    },
    {
      name: "Alex Rodriguez",
      role: "Software Developer",
      content: "Teaching programming while learning business skills has opened new career opportunities for me.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navigation */}
      <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                SkillSwap
              </h1>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/25"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
              Exchange Skills,
              <br />
              Grow Together
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Connect with talented people worldwide. Teach what you know, learn what you need.
              Build meaningful relationships through skill exchange.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:scale-105 flex items-center justify-center space-x-2 text-lg font-semibold"
              >
                <span>Start Swapping Skills</span>
                <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800/50 transition-all duration-300 text-lg font-semibold">
                Watch Demo
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose SkillSwap?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform makes skill exchange simple, secure, and rewarding for everyone involved.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4 border border-cyan-500/30">
                  <feature.icon className="text-cyan-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started with skill swapping in just a few simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "List the skills you can teach and what you want to learn. Add your availability and preferences."
              },
              {
                step: "02",
                title: "Find Your Match",
                description: "Browse through our community of skilled individuals and send swap requests to people you'd like to learn from."
              },
              {
                step: "03",
                title: "Start Learning",
                description: "Connect with your swap partner, schedule sessions, and begin your skill exchange journey together."
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-800/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their skills through our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={16} />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl p-12 text-center border border-cyan-500/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our community today and discover the power of skill exchange. 
              Your next learning adventure is just one click away.
            </p>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:scale-105 flex items-center justify-center space-x-2 text-lg font-semibold mx-auto"
            >
              <span>Get Started Now</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  SkillSwap
                </h3>
              </div>
              <p className="text-gray-400">
                Connecting people through skill exchange and fostering a global learning community.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Community Guidelines</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700/50 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SkillSwap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;