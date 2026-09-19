import { useEffect, useState } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

import FarmerDashboard from './pages/farmer/Dashboard';
import Diagnosis from './pages/farmer/Diagnosis';
import Treatment from './pages/farmer/Treatment';
import Market from './pages/farmer/Market';
import Buyers from './pages/farmer/Buyers';
import BuyerDetail from './pages/farmer/BuyerDetail';
import Storage from './pages/farmer/Storage';
import Logistics from './pages/farmer/Logistics';
import RequestsPage from './pages/farmer/Requests';
import FarmerProfile from './pages/farmer/Profile';

import BuyerDashboard from './pages/buyer/Dashboard';
import BuyerProfile from './pages/buyer/Profile';
import Requirements from './pages/buyer/Requirements';
import FarmerRequests from './pages/buyer/FarmerRequests';

import StorageOwnerDashboard from './pages/storage_owner/Dashboard';

import PublicHeader from './components/PublicHeader';
import AppHeader from './components/AppHeader';

import { User, CropDiagnosis } from './data';

type Page =
  | 'home'
  | 'about'
  | 'login'
  | 'register'
  | 'farmer-dashboard'
  | 'diagnosis'
  | 'treatment'
  | 'market'
  | 'buyers'
  | 'buyer-detail'
  | 'storage'
  | 'logistics'
  | 'requests'
  | 'farmer-profile'
  | 'buyer-dashboard'
  | 'buyer-profile'
  | 'requirements'
  | 'farmer-requests'
  | 'storage-owner-dashboard';

function normalizeRole(role: string): User['role'] {
  const value = role
    .trim()
    .toLowerCase()
    .replace(/-/g, '_')
    .replace(/\s+/g, '_');

  if (value === 'buyer') {
    return 'buyer';
  }

  if (
    value === 'storage_owner' ||
    value === 'storageowner'
  ) {
    return 'storage_owner';
  }

  return 'farmer';
}

function normalizeLanguage(
  language: string | undefined
): User['preferredLanguage'] {
  if (language === 'Telugu') {
    return 'Telugu';
  }

  if (language === 'Hindi') {
    return 'Hindi';
  }

  return 'English';
}

function getStoredUser(): User | null {
  try {
    const storedUser =
      localStorage.getItem('kisansetu_user');

    if (!storedUser) {
      return null;
    }

    const parsed = JSON.parse(storedUser);

    return {
      username: parsed.username || '',
      email: parsed.email || '',
      role: normalizeRole(
        parsed.role || 'FARMER'
      ),
      name:
        parsed.name ||
        parsed.username ||
        '',
      phone: parsed.phone || '',
      location: parsed.location || '',
      preferredLanguage:
        normalizeLanguage(
          parsed.preferredLanguage
        ),
      cropsGrown:
        parsed.cropsGrown || '',
      businessName:
        parsed.businessName || '',
      buyerType:
        parsed.buyerType || '',
      profileImage:
        parsed.profileImage || '',
    };
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] =
    useState<User | null>(
      getStoredUser
    );

  const [page, setPage] =
    useState<Page>(
      user
        ? user.role === 'farmer'
          ? 'farmer-dashboard'
          : user.role === 'buyer'
          ? 'buyer-dashboard'
          : 'storage-owner-dashboard'
        : 'home'
    );

  const [selectedBuyer, setSelectedBuyer] =
    useState<any>(null);

  const [diagnosis, setDiagnosis] =
    useState<CropDiagnosis | null>(null);

  const [requests, setRequests] =
    useState<any[]>([]);

  useEffect(() => {
    const storedUser =
      getStoredUser();

    if (storedUser) {
      setUser(storedUser);

      if (storedUser.role === 'farmer') {
        setPage('farmer-dashboard');
      } else if (
        storedUser.role === 'buyer'
      ) {
        setPage('buyer-dashboard');
      } else {
        setPage(
          'storage-owner-dashboard'
        );
      }
    }
  }, []);

  function handleLogin(
    loggedInUser: User
  ) {
    const normalizedUser: User = {
      ...loggedInUser,
      role: normalizeRole(
        String(loggedInUser.role)
      ),
      preferredLanguage:
        normalizeLanguage(
          loggedInUser.preferredLanguage
        ),
    };

    setUser(normalizedUser);

    localStorage.setItem(
      'kisansetu_user',
      JSON.stringify(normalizedUser)
    );

    localStorage.setItem(
      'kisansetu_language',
      normalizedUser.preferredLanguage
    );

    if (
      normalizedUser.role === 'farmer'
    ) {
      setPage('farmer-dashboard');
    } else if (
      normalizedUser.role === 'buyer'
    ) {
      setPage('buyer-dashboard');
    } else {
      setPage(
        'storage-owner-dashboard'
      );
    }
  }

  function handleRegister() {
    setPage('login');
  }

  function handleLogout() {
    localStorage.removeItem(
      'kisansetu_user'
    );

    setUser(null);
    setSelectedBuyer(null);
    setDiagnosis(null);
    setRequests([]);
    setPage('home');
  }

  function navigate(nextPage: string) {
    setPage(nextPage as Page);
  }

  function openBuyerDetail(
    buyer: any
  ) {
    setSelectedBuyer(buyer);
    setPage('buyer-detail');
  }

  function addRequest(
    request: any
  ) {
    setRequests(prev => [
      ...prev,
      request,
    ]);
  }

  function updateRequestStatus(
    id: number,
    status:
      | 'Accepted'
      | 'Rejected'
  ) {
    setRequests(prev =>
      prev.map(request =>
        request.id === id
          ? {
              ...request,
              status,
            }
          : request
      )
    );
  }

  function renderPublicPage() {
    if (page === 'home') {
      return (
        <>
          <PublicHeader
            current={page}
            onNav={navigate}
            language="English"
            onLanguage={() => {}}
          />

          <Home
            onGetStarted={() =>
              navigate('register')
            }
            onExplore={() =>
              navigate('about')
            }
            onAbout={() =>
              navigate('about')
            }
          />
        </>
      );
    }

    if (page === 'about') {
      return (
        <>
          <PublicHeader
            current={page}
            onNav={navigate}
            language="English"
            onLanguage={() => {}}
          />

          <About
            onRegister={() =>
              navigate('register')
            }
          />
        </>
      );
    }

    if (page === 'login') {
      return (
        <>
          <PublicHeader
            current={page}
            onNav={navigate}
            language="English"
            onLanguage={() => {}}
          />

          <Login
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        </>
      );
    }

    if (page === 'register') {
      return (
        <>
          <PublicHeader
            current={page}
            onNav={navigate}
            language="English"
            onLanguage={() => {}}
          />

          <Register
            onSuccess={handleLogin}
            onLogin={() =>
              navigate('login')
            }
          />
        </>
      );
    }

    return null;
  }

  if (
    page === 'home' ||
    page === 'about' ||
    page === 'login' ||
    page === 'register'
  ) {
    return renderPublicPage();
  }

  if (!user) {
    return (
      <>
        <PublicHeader
          current={page}
          onNav={navigate}
          language="English"
          onLanguage={() => {}}
        />

        <Login
          onLogin={handleLogin}
          onRegister={() =>
            navigate('register')
          }
        />
      </>
    );
  }

  if (user.role === 'farmer') {
    return (
      <div className="min-h-screen bg-[#F7FAF5]">

        <AppHeader
          user={user}
          current={page}
          onNav={navigate}
          onLogout={handleLogout}
        />

        {page === 'farmer-dashboard' && (
          <FarmerDashboard
            user={user}
            onNav={navigate}
          />
        )}

        {page === 'diagnosis' && (
          <Diagnosis
            onTreatment={nextDiagnosis => {
              setDiagnosis(
                nextDiagnosis
              );
              setPage('treatment');
            }}
          />
        )}

        {page === 'treatment' && (
          <Treatment
            diagnosis={diagnosis}
            onMarket={() =>
              setPage('market')
            }
            onDiagnosis={() =>
              setPage('diagnosis')
            }
          />
        )}

        {page === 'market' && (
          <Market
            user={user}
          />
        )}

        {page === 'buyers' && (
          <Buyers
            onViewBuyer={
              openBuyerDetail
            }
          />
        )}

        {page === 'buyer-detail' && (
          <BuyerDetail
            buyer={selectedBuyer}
            onBack={() =>
              navigate('buyers')
            }
            onSendRequest={
              addRequest
            }
          />
        )}

        {page === 'storage' && (
          <Storage />
        )}

        {page === 'logistics' && (
          <Logistics />
        )}

        {page === 'requests' && (
          <RequestsPage
            requests={requests}
            username={user.username}
          />
        )}

        {page === 'farmer-profile' && (
          <FarmerProfile
            user={user}
            onUpdate={updatedUser => {
              setUser(updatedUser);

              localStorage.setItem(
                'kisansetu_user',
                JSON.stringify(
                  updatedUser
                )
              );

              localStorage.setItem(
                'kisansetu_language',
                updatedUser.preferredLanguage
              );
            }}
          />
        )}

      </div>
    );
  }

  if (user.role === 'buyer') {
    return (
      <div className="min-h-screen bg-[#F7FAF5]">

        <AppHeader
          user={user}
          current={page}
          onNav={navigate}
          onLogout={handleLogout}
        />

        {page === 'buyer-dashboard' && (
          <BuyerDashboard
            user={user}
            pendingCount={
              requests.length
            }
            onNav={navigate}
          />
        )}

        {page === 'buyer-profile' && (
          <BuyerProfile
            user={user}
            onUpdate={updatedUser => {
              setUser(updatedUser);

              localStorage.setItem(
                'kisansetu_user',
                JSON.stringify(
                  updatedUser
                )
              );

              localStorage.setItem(
                'kisansetu_language',
                updatedUser.preferredLanguage
              );
            }}
          />
        )}

        {page === 'requirements' && (
          <Requirements
            user={user}
          />
        )}

        {page === 'farmer-requests' && (
          <FarmerRequests
            requests={requests}
            onUpdateStatus={
              updateRequestStatus
            }
            user={user}
          />
        )}

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAF5]">

      <AppHeader
        user={user}
        current={page}
        onNav={navigate}
        onLogout={handleLogout}
      />

      {page === 'storage-owner-dashboard' && (
        <StorageOwnerDashboard
          username={user.username}
        />
      )}

    </div>
  );
}