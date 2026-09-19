import { useState } from 'react';
import { User, Buyer, CropDiagnosis, Request } from './data';

// Public pages
import PublicHeader from './components/PublicHeader';
import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

// Farmer pages
import FarmerDashboard from './pages/farmer/Dashboard';
import CropDiagnosisPage from './pages/farmer/Diagnosis';
import TreatmentPage from './pages/farmer/Treatment';
import MarketPage from './pages/farmer/Market';
import BuyersPage from './pages/farmer/Buyers';
import BuyerDetailPage from './pages/farmer/BuyerDetail';
import StoragePage from './pages/farmer/Storage';
import LogisticsPage from './pages/farmer/Logistics';
import RequestsPage from './pages/farmer/Requests';
import FarmerProfilePage from './pages/farmer/Profile';

// Buyer pages
import BuyerDashboard from './pages/buyer/Dashboard';
import BuyerProfilePage from './pages/buyer/Profile';
import RequirementsPage from './pages/buyer/Requirements';
import FarmerRequestsPage from './pages/buyer/FarmerRequests';

type PublicPage = 'home' | 'about' | 'login' | 'register';
type FarmerPage = 'farmer-dashboard' | 'diagnosis' | 'treatment' | 'market' | 'buyers' | 'buyer-detail' | 'storage' | 'logistics' | 'requests' | 'farmer-profile';
type BuyerPage = 'buyer-dashboard' | 'buyer-profile' | 'requirements' | 'farmer-requests';
type AppPage = FarmerPage | BuyerPage;

export default function App() {
  const [publicPage, setPublicPage] = useState<PublicPage>('home');
  const [appPage, setAppPage] = useState<AppPage>('farmer-dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState('English');

  // Farmer state
  const [diagnosis, setDiagnosis] = useState<CropDiagnosis | null>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  // Seed with the demo request so buyers can accept/reject it
  const [requests, setRequests] = useState<Request[]>([
    { id: 100, buyerId: 1, buyerName: 'FreshFarm Produce', crop: 'Tomato', quantity: 500, price: 2700, location: 'Tenali', message: 'I would like to sell my tomato produce.', status: 'Pending', date: '19 Sep 2026' },
  ]);

  function handleLogin(u: User) {
    setUser(u);
    setAppPage(u.role === 'farmer' ? 'farmer-dashboard' : 'buyer-dashboard');
  }

  function handleLogout() {
    setUser(null);
    setPublicPage('home');
  }

  function sendRequest(req: Omit<Request, 'id' | 'date'>) {
    setRequests(prev => [...prev, { ...req, id: Date.now(), date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }]);
    setAppPage('requests');
  }

  function updateRequestStatus(id: number, status: 'Accepted' | 'Rejected') {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  // Not logged in → public pages
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFAF5]">
        <PublicHeader
          current={publicPage}
          onNav={setPublicPage}
          language={language}
          onLanguage={setLanguage}
        />
        {publicPage === 'home' && (
          <Home
            onGetStarted={() => setPublicPage('register')}
            onExplore={() => setPublicPage('about')}
            onAbout={() => setPublicPage('about')}
          />
        )}
        {publicPage === 'about' && <About onRegister={() => setPublicPage('register')} />}
        {publicPage === 'login' && <Login onLogin={handleLogin} onRegister={() => setPublicPage('register')} />}
        {publicPage === 'register' && <Register onSuccess={() => setPublicPage('login')} onLogin={() => setPublicPage('login')} />}
      </div>
    );
  }

  // Logged in → app pages
  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <AppHeader
        user={user}
        language={language}
        onLanguage={setLanguage}
        onNav={p => setAppPage(p as AppPage)}
        onLogout={handleLogout}
        current={appPage}
      />

      {/* Farmer pages */}
      {user.role === 'farmer' && (
        <>
          {appPage === 'farmer-dashboard' && (
            <FarmerDashboard user={user} onNav={p => setAppPage(p as FarmerPage)} />
          )}
          {appPage === 'diagnosis' && (
            <CropDiagnosisPage
              onTreatment={d => { setDiagnosis(d); setAppPage('treatment'); }}
            />
          )}
          {appPage === 'treatment' && (
            <TreatmentPage
              diagnosis={diagnosis}
              onMarket={() => setAppPage('market')}
              onDiagnosis={() => setAppPage('diagnosis')}
            />
          )}
          {appPage === 'market' && <MarketPage />}
          {appPage === 'buyers' && (
            <BuyersPage onViewBuyer={b => { setSelectedBuyer(b); setAppPage('buyer-detail'); }} />
          )}
          {appPage === 'buyer-detail' && (
            <BuyerDetailPage
              buyer={selectedBuyer}
              onSendRequest={sendRequest}
              onBack={() => setAppPage('buyers')}
            />
          )}
          {appPage === 'storage' && <StoragePage />}
          {appPage === 'logistics' && <LogisticsPage />}
          {appPage === 'requests' && <RequestsPage requests={requests} />}
          {appPage === 'farmer-profile' && (
            <FarmerProfilePage user={user} onUpdate={setUser} />
          )}
        </>
      )}

      {/* Buyer pages */}
      {user.role === 'buyer' && (
        <>
          {appPage === 'buyer-dashboard' && (
            <BuyerDashboard
              user={user}
              pendingCount={requests.filter(r => r.status === 'Pending').length}
              onNav={p => setAppPage(p as BuyerPage)}
            />
          )}
          {appPage === 'buyer-profile' && (
            <BuyerProfilePage user={user} onUpdate={setUser} />
          )}
          {appPage === 'requirements' && <RequirementsPage />}
          {appPage === 'farmer-requests' && (
            <FarmerRequestsPage requests={requests} onUpdateStatus={updateRequestStatus} />
          )}
        </>
      )}
    </div>
  );
}
