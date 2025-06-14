import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserCheck, Stethoscope, FileText, Heart, Shield, ChevronRight, Activity, Pill, History, Upload, TestTube, AlertCircle } from 'lucide-react';
import heroanimation from "../assets/dashbaord_animation.json";

const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const lottieRef = useRef(null);
  const animationRef = useRef(null); // Store animation instance

  // Initialize Lottie animation
  useEffect(() => {
    const loadLottie = async () => {
      try {
        const lottie = await import('lottie-web');
        
        // Clear any existing animation first
        if (animationRef.current) {
          animationRef.current.destroy();
          animationRef.current = null;
        }
        
        if (lottieRef.current) {
          // Clear the container
          lottieRef.current.innerHTML = '';
          
          animationRef.current = lottie.default.loadAnimation({
            container: lottieRef.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: heroanimation,
          });
        }
      } catch (error) {
        console.log('Lottie not available, skipping animation');
      }
    };
    
    loadLottie();
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, []); // Empty dependency array to run only once

  const handleDoctorLogin = () => {
    navigate('/doctor-login');
  };

  const handlePatientLogin = () => {
    navigate('/patient-login');
  };

  const handleMouseMove = (e, cardType) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 px-6 py-4 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent hover:from-blue-600 hover:to-indigo-600 transition-all duration-300">
                SahYog
              </h1>
              <p className="text-sm text-gray-600">Healthcare at your fingertips</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full hover:bg-green-100 transition-colors duration-300">
              <Activity className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-medium">System Online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Section with Animation */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-500 hover:to-indigo-500 transition-all duration-300">
                MediConnect
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Bridging the gap between doctors and patients with secure, efficient, and comprehensive healthcare management
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">24/7 Available</span>
              </div>
            </div>
          </div>
          
          {/* Lottie Animation Container */}
          <div className="flex justify-center lg:justify-end">
            <div 
              ref={lottieRef} 
              className="w-96 h-96 hover:scale-105 transition-transform duration-500 relative"
              style={{ 
                filter: 'drop-shadow(0 25px 50px rgba(59, 130, 246, 0.15))',
                overflow: 'hidden' // Prevent any overflow duplication
              }}
            />
          </div>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Doctor Card */}
          <div
            className={`relative group cursor-pointer transition-all duration-700 transform-gpu ${
              hoveredCard === 'doctor' ? 'scale-105 -rotate-1' : 'hover:scale-102'
            }`}
            onMouseEnter={() => setHoveredCard('doctor')}
            onMouseLeave={() => setHoveredCard(null)}
            onMouseMove={(e) => handleMouseMove(e, 'doctor')}
            onClick={handleDoctorLogin}
            style={{
              transform: hoveredCard === 'doctor' 
                ? `perspective(1000px) rotateX(${(mousePosition.y - 200) * 0.05}deg) rotateY(${(mousePosition.x - 200) * 0.05}deg) scale(1.05)` 
                : 'none'
            }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 border border-blue-100 hover:border-blue-300 relative overflow-hidden">
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-3xl transition-opacity duration-500 ${hoveredCard === 'doctor' ? 'opacity-100' : 'opacity-0'}`} />
              
              {/* Animated Border */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ${hoveredCard === 'doctor' ? 'opacity-20 animate-pulse' : 'opacity-0'}`} style={{ padding: '2px' }}>
                <div className="w-full h-full bg-white rounded-3xl" />
              </div>

              <div className="relative z-10">
                {/* Doctor Icon */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-lg group-hover:shadow-xl">
                    <UserCheck className="h-12 w-12 text-white group-hover:rotate-12 transition-transform duration-500" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-center text-gray-900 mb-4 group-hover:text-blue-800 transition-colors duration-300">
                  Doctor Portal
                </h3>
                <p className="text-gray-600 text-center mb-8 leading-relaxed">
                  Access patient records, manage prescriptions, and provide comprehensive care
                </p>

                {/* Doctor Features */}
                <div className="space-y-4">
                  {[
                    { icon: History, text: "View Patient History" },
                    { icon: Upload, text: "Upload Prescriptions" },
                    { icon: FileText, text: "Manage Previous Prescriptions" },
                    { icon: Stethoscope, text: "Patient Consultations" }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-all duration-300 hover:translate-x-2 hover:shadow-md"
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <feature.icon className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-500 flex items-center justify-center space-x-2 group-hover:shadow-xl transform group-hover:scale-105">
                  <span>Enter Doctor Portal</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Patient Card */}
          <div
            className={`relative group cursor-pointer transition-all duration-700 transform-gpu ${
              hoveredCard === 'patient' ? 'scale-105 rotate-1' : 'hover:scale-102'
            }`}
            onMouseEnter={() => setHoveredCard('patient')}
            onMouseLeave={() => setHoveredCard(null)}
            onMouseMove={(e) => handleMouseMove(e, 'patient')}
            onClick={handlePatientLogin}
            style={{
              transform: hoveredCard === 'patient' 
                ? `perspective(1000px) rotateX(${(mousePosition.y - 200) * 0.05}deg) rotateY(${(mousePosition.x - 200) * 0.05}deg) scale(1.05)` 
                : 'none'
            }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 border border-red-100 hover:border-red-300 relative overflow-hidden">
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 rounded-3xl transition-opacity duration-500 ${hoveredCard === 'patient' ? 'opacity-100' : 'opacity-0'}`} />
              
              {/* Animated Border */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500 ${hoveredCard === 'patient' ? 'opacity-20 animate-pulse' : 'opacity-0'}`} style={{ padding: '2px' }}>
                <div className="w-full h-full bg-white rounded-3xl" />
              </div>

              <div className="relative z-10">
                {/* Patient Icon */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-lg group-hover:shadow-xl">
                    <User className="h-12 w-12 text-white group-hover:-rotate-12 transition-transform duration-500" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-center text-gray-900 mb-4 group-hover:text-red-800 transition-colors duration-300">
                  Patient Portal
                </h3>
                <p className="text-gray-600 text-center mb-8 leading-relaxed">
                  Access your health records, prescriptions, and health assessment tools
                </p>

                {/* Patient Features */}
                <div className="space-y-4">
                  {[
                    { icon: Pill, text: "View Prescriptions" },
                    { icon: TestTube, text: "Take Health Tests" },
                    { icon: AlertCircle, text: "Disease Risk Assessment" },
                    { icon: Heart, text: "Health Solutions" }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-red-50 group-hover:bg-red-100 transition-all duration-300 hover:translate-x-2 hover:shadow-md"
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <feature.icon className="h-5 w-5 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-8 bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-2xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-500 flex items-center justify-center space-x-2 group-hover:shadow-xl transform group-hover:scale-105">
                  <span>Enter Patient Portal</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 hover:text-blue-800 transition-colors duration-300">
            Why Choose MediConnect?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, color: 'green', title: 'Secure & Private', desc: 'End-to-end encryption ensures your medical data stays confidential' },
              { icon: Activity, color: 'purple', title: 'Real-time Access', desc: 'Instant access to health records and prescriptions anytime, anywhere' },
              { icon: Heart, color: 'blue', title: 'Comprehensive Care', desc: 'Complete healthcare management from diagnosis to treatment' }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-500 hover:bg-white/50 rounded-2xl"
              >
                <div className={`bg-${feature.color}-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 group-hover:shadow-lg`}>
                  <feature.icon className={`h-8 w-8 text-${feature.color}-600 group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors duration-300">{feature.title}</h4>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-blue-100 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600 hover:text-gray-800 transition-colors duration-300">
            <p>&copy; 2025 MediConnect. Empowering healthcare through technology.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;