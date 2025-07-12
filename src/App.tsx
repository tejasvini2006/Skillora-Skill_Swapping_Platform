@@ .. @@
 import React, { useState } from 'react';
 import { AuthProvider, useAuth } from './contexts/AuthContext';
 import { DataProvider } from './contexts/DataContext';
+import LandingPage from './components/LandingPage';
 import Header from './components/Header';
 import LoginForm from './components/LoginForm';
 import SignUpForm from './components/SignUpForm';
 import Dashboard from './components/Dashboard';
 import BrowseUsers from './components/BrowseUsers';
 import Profile from './components/Profile';
 import SwapRequests from './components/SwapRequests';
 import AdminPanel from './components/AdminPanel';
 import SwapAcceptedLanding from './components/SwapAcceptedLanding';
 import UserChat from './components/ChatBot';
 
 type Page = 'dashboard' | 'browse' | 'profile' | 'swaps' | 'admin';
 
 function AppContent() {
   const { user } = useAuth();
   const [currentPage, setCurrentPage] = useState<Page>('dashboard');
-  const [showLogin, setShowLogin] = useState(true);
+  const [showLogin, setShowLogin] = useState(false);
+  const [showLanding, setShowLanding] = useState(true);
   const [showSwapAcceptedLanding, setShowSwapAcceptedLanding] = useState(false);
   const [acceptedSwap, setAcceptedSwap] = useState<any>(null);
   const [showChat, setShowChat] = useState(false);
 
   const handleSwapAccepted = (swap: any) => {
     setAcceptedSwap(swap);
     setShowSwapAcceptedLanding(true);
   };
 
   const handleStartChat = () => {
     setShowSwapAcceptedLanding(false);
     setShowChat(true);
   };
+
+  const handleGetStarted = () => {
+    setShowLanding(false);
+    setShowLogin(true);
+  };
+
+  if (showLanding && !user) {
+    return <LandingPage onGetStarted={handleGetStarted} />;
+  }
+
   if (!user) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
         <div className="container mx-auto px-4 py-8">
+          <div className="mb-4">
+            <button
+              onClick={() => setShowLanding(true)}
+              className="text-cyan-400 hover:text-cyan-300 transition-colors"
+            >
+              ← Back to Home
+            </button>
+          </div>
+          
           <div className="text-center mb-8">
             <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 tracking-tight">
               SkillSwap
             </h1>
             <p className="text-gray-300 text-xl font-light">
               Exchange skills, grow together
             </p>
             <div className="mt-6 flex justify-center space-x-8 text-gray-400">
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                 <span className="text-sm">AI-Powered Matching</span>
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                 <span className="text-sm">Real-time Chat</span>
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                 <span className="text-sm">Secure Platform</span>
               </div>
             </div>
           </div>
 
           <div className="max-w-md mx-auto">
             <div className="flex mb-6 bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 border border-gray-700/50">
               <button
                 onClick={() => setShowLogin(true)}
                 className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${
                   showLogin
                     ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                     : 'text-gray-400 hover:text-gray-200'
                 }`}
               >
                 Login
               </button>
               <button
                 onClick={() => setShowLogin(false)}
                 className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${
                   !showLogin
                     ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                     : 'text-gray-400 hover:text-gray-200'
                 }`}
               >
                 Sign Up
               </button>
             </div>
 
             {showLogin ? <LoginForm /> : <SignUpForm />}
           </div>
         </div>
       </div>
     );
   }