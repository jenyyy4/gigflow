import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Briefcase, Users, Shield, Sparkles } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <nav className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-400 to-primary-500">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-dark-900">
              Gig<span className="text-primary-500">Flow</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-dark-600 hover:text-dark-900 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link to="/register" className="btn-primary py-2 px-4">
              Get Started
            </Link>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 border border-primary-200 text-primary-600 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            The Future of Freelancing
          </div>
          
          <h1 className="font-display font-bold text-5xl md:text-7xl text-dark-900 mb-6 leading-tight">
            Connect. Collaborate.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Create Impact.
            </span>
          </h1>
          
          <p className="text-xl text-dark-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            GigFlow is the modern freelance marketplace where talent meets opportunity. 
            Post gigs, submit bids, and build amazing projects together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="btn-secondary text-lg px-8 py-4"
            >
              I Already Have an Account
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-32">
          {[
            {
              icon: Briefcase,
              title: 'Post & Find Gigs',
              description: 'Create job listings in seconds or browse opportunities that match your skills.',
            },
            {
              icon: Users,
              title: 'Seamless Collaboration',
              description: 'Connect with talented freelancers and clients through our intuitive platform.',
            },
            {
              icon: Shield,
              title: 'Secure & Reliable',
              description: 'Built with enterprise-grade security and real-time notifications.',
            },
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10 text-center group hover:border-primary-300 transition-all"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-display font-semibold text-lg text-dark-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-dark-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-32 text-center">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: '10K+', label: 'Active Gigs' },
              { value: '50K+', label: 'Freelancers' },
              { value: '99%', label: 'Success Rate' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="font-display font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                  {stat.value}
                </div>
                <div className="text-dark-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-dark-200 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-dark-500 text-sm">
          © 2026 GigFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
