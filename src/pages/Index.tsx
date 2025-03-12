
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/PageTransition';
import NavBar from '@/components/NavBar';
import WaterJar from '@/components/WaterJar';
import Logo from '@/components/Logo';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users based on their role
    if (user) {
      if (user.role === 'customer') {
        navigate('/products');
      } else if (user.role === 'distributor' || user.role === 'worker') {
        navigate('/orders');
      }
    }
  }, [user, navigate]);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        
        <main className="flex-grow">
          <section className="py-20 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-aqua-100/40 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-aqua-200/30 rounded-full blur-3xl" />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-aqua-600 to-aqua-800">
                    Pure Water Delivered<br />to Your Doorstep
                  </h1>
                  
                  <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
                    Get fresh, clean water delivered right to your home or office with our easy-to-use water jar delivery service.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <button 
                      className="water-btn text-lg px-8 py-4"
                      onClick={() => navigate('/register')}
                    >
                      <span className="relative">Get Started</span>
                    </button>
                    
                    <button 
                      className="px-8 py-4 rounded-lg border border-aqua-200 text-aqua-700 hover:bg-aqua-50 transition-colors text-lg"
                      onClick={() => navigate('/login')}
                    >
                      <span>Login</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 flex justify-center md:justify-end animate-float">
                  <div className="relative h-72 w-72">
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-full" />
                    <div className="relative h-full flex items-center justify-center">
                      <WaterJar size="lg" filled={85} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section className="py-20 bg-aqua-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: 'Order Online',
                    description: 'Browse our selection of water jars and place your order with just a few clicks.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                    )
                  },
                  {
                    title: 'Fast Delivery',
                    description: 'Our distributors assign workers to deliver water jars to your location promptly.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                    )
                  },
                  {
                    title: 'Track Orders',
                    description: 'Monitor your delivery status in real-time and receive updates every step of the way.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                      </svg>
                    )
                  }
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center text-center card-hover"
                  >
                    <div className="bg-aqua-100 text-aqua-600 p-4 rounded-full mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Why Choose AquaJar?</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We're dedicated to providing clean, safe water with exceptional service.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Pure Quality',
                    description: 'Our water undergoes rigorous purification processes to ensure the highest quality.'
                  },
                  {
                    title: 'Eco-friendly',
                    description: 'We use sustainable practices and recyclable materials to minimize environmental impact.'
                  },
                  {
                    title: 'Reliable Service',
                    description: 'Count on our efficient distribution network for consistent, on-time deliveries.'
                  },
                  {
                    title: 'Easy Management',
                    description: 'Our platform makes ordering, tracking, and managing your water supply effortless.'
                  }
                ].map((feature, i) => (
                  <div 
                    key={i} 
                    className="bg-gradient-to-br from-white to-aqua-50 p-6 rounded-xl shadow-sm border border-aqua-100"
                  >
                    <h3 className="text-lg font-semibold mb-2 text-aqua-800">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        
        <footer className="bg-aqua-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-8 md:mb-0">
                <Logo textOnly className="text-white mb-4" />
                <p className="text-aqua-100">
                  Delivering pure water, one jar at a time.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-aqua-200">COMPANY</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-aqua-100 hover:text-white transition-colors">About Us</a></li>
                    <li><a href="#" className="text-aqua-100 hover:text-white transition-colors">Careers</a></li>
                    <li><a href="#" className="text-aqua-100 hover:text-white transition-colors">Contact</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-aqua-200">SERVICES</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-aqua-100 hover:text-white transition-colors">Home Delivery</a></li>
                    <li><a href="#" className="text-aqua-100 hover:text-white transition-colors">Office Supply</a></li>
                    <li><a href="#" className="text-aqua-100 hover:text-white transition-colors">Bulk Orders</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-aqua-200">SUPPORT</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-aqua-100 hover:text-white transition-colors">FAQ</a></li>
                    <li><a href="#" className="text-aqua-100 hover:text-white transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="text-aqua-100 hover:text-white transition-colors">Privacy Policy</a></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-t border-aqua-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-aqua-200 text-sm">
                &copy; {new Date().getFullYear()} AquaJar. All rights reserved.
              </p>
              
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-aqua-200 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-aqua-200 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-aqua-200 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Index;
