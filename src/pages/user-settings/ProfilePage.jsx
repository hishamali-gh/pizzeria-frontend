import { QRCodeCanvas } from 'qrcode.react';

import { useState, useEffect } from 'react';

import API from '../../apiConfig';

import NavBar2 from "../../components/NavBar2";
import Footer from "../../components/Footer";


export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);
  const [MFAData, setMFAData] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');


  useEffect(() => {
    const loadPage = async () => {
      const params = new URLSearchParams(window.location.search);
      const urlAccess = params.get('access');
      const urlRefresh = params.get('refresh');

      if (urlAccess && urlRefresh) {
          localStorage.setItem('access', urlAccess);
          localStorage.setItem('refresh', urlRefresh);

          window.history.replaceState({}, document.title, window.location.pathname);
          
          console.log("Credentials stored. Session active.");
        }

      try {
        const res = await API.get('auth/profile/')
    
        setProfile(res.data)

        setIsMFAEnabled(res.data.other.is_mfa_enabled);


        // Hydrate localStorage with backend-resolved tenant name and role

        const existingUserInfo = JSON.parse(localStorage.getItem('user_info')) || {};

        localStorage.setItem('user_info', JSON.stringify({
          ...existingUserInfo,
          role: res.data.other.role,
          tenant: res.data.tenant.name
        }));
      }
    
      catch (err) {
        console.error('Session expired or unauthorized', err);
        window.location.href = '/login';
      }
    };
    
    loadPage();
  }, []);


  const handleEnableMFA = async () => {
    try {
      const res = await API.get('user/mfa/setup/');

      setMFAData(res.data);
    }

    catch (err) {
      console.error('Failed to fetch MFA secret', err);
    }
  };

  const handleVerifyMFASetup = async () => {
    try {
      const res = await API.post('user/mfa/verify-setup/', { code: verificationCode });
  
      if (res.status == 200) {
        setIsMFAEnabled(true);
  
        setMFAData(null);
  
        alert('MFA successfully enabled');
      }
    }

    catch (err) {
      alert('Invalid code');
    }
  }


  if (!profile) return <p>Calibrating Identity...</p>;

  return (
    <main className="min-h-screen bg-white dm-sans-regular flex flex-col">
      <NavBar2 variant="hmi" tenantName={profile.tenant.name} />

      <div className="max-w-7xl mx-auto px-8 border-x border-gray-100 flex flex-col relative overflow-hidden min-h-screen">

        <div className="border-t border-gray-100 -mx-8 grid grid-cols-12">
          <div className="col-span-12 p-8 bg-zinc-50/30">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-1">
                  Administrative_Access
                </p>
                <h3 className="text-2xl font-bold tracking-tighter uppercase">
                  System Management Hub
                </h3>
              </div>

              {(profile.other.role === 'admin' || profile.other.role === 'superadmin') && (
                <a 
                  href="/management-hub" 
                  className="group flex items-center gap-4 bg-zinc-900 text-white px-6 py-3 transition-all hover:bg-orange-500"
                >
                  <span className="font-mono text-[11px] tracking-widest uppercase">
                    Enter_Provisioning_Mode
                  </span>
                  <svg 
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              )}
            </div>

            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8">
                <p className="text-sm text-zinc-500 leading-relaxed max-w-xl">
                  Authorized for <span className="text-zinc-900 font-medium italic">Level 4 Personnel</span>. 
                  Use this portal to register new automated nodes to the factory grid or provision 
                  security credentials for incoming shift operators.
                </p>
              </div>
              <div className="col-span-4 flex flex-col justify-end border-l border-gray-200 pl-8">
                <div className="flex items-center gap-2 opacity-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  <span className="font-mono text-[9px] tracking-widest uppercase text-zinc-400">
                    Provisioning_Tunnel_Standby
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="-mx-8 p-8 border-b border-gray-100">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-600 mb-8">
            Operator Identity // Access Protocol [cite: 551]
          </h3>
          <div className="flex justify-between items-end">
            <h1 className="text-6xl font-bold tracking-tighter leading-none text-zinc-900">
              {profile.identity.full_name}
            </h1>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Clearance</span>
              <span className="text-2xl font-mono font-bold leading-none bg-zinc-900 text-white px-2 py-1">
                F14
              </span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-12 -mx-8 border-b border-gray-100 flex-1">

          <section className="col-span-8 border-r border-gray-100 p-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-8">
              System Metadata / Credentials
            </h3>
            <div className="grid grid-cols-2 gap-y-12">
              {[
                { label: "Network ID", val: profile.identity.email, style: "font-mono" },
                { label: "Franchise Node", val: profile.tenant.name, style: "font-bold" },
                { label: "Provisioned", val: profile.other.created_at, style: "font-mono" },
                { label: "Auth Protocol", val: "MFA-OAUTH-V2", style: "font-mono" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                    {item.label}
                  </span>
                  <span className={`text-sm text-zinc-900 ${item.style}`}>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <aside className="col-span-4 p-8 bg-zinc-50/30">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-8">
              Safety Interlock // MFA [cite: 718]
            </h3>
            <div className="p-6 bg-white border border-gray-100 shadow-sm relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-900">MFA Status</span>
                <div className={`w-2 h-2 rounded-full ${profile.other.is_mfa_enabled ? 'bg-green-500' : 'bg-red-500 animate-ping'}`} />
              </div>
              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mb-8">
                Industrial safety requires active Multi-Factor Authentication for all Level 3/4 engineering overrides[cite: 559, 719].
              </p>
              <button className="w-full py-4 border border-zinc-900 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all duration-300">
                Update MFA Secrets
              </button>
            </div>
          </aside>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-bold uppercase tracking-tighter">Security Settings</h3>
          
          {!isMFAEnabled ? (
            <div className="mt-4 p-6 border border-orange-100 rounded-2xl bg-orange-50/30">
              <p className="text-sm text-zinc-600 mb-4">
                Protect your industrial controls. Enable Multi-Factor Authentication.
              </p>
              
              {!MFAData ? (
                <button 
                  onClick={handleEnableMFA}
                  className="px-6 py-2 bg-zinc-900 text-white text-xs font-bold uppercase rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Setup MFA
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white p-4 inline-block rounded-xl border border-zinc-200">
                    <QRCodeCanvas value={MFAData.otp_uri} size={180} />
                  </div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">
                    Scan this with Google Authenticator, then enter the code below:
                  </p>
                  <input 
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="000 000"
                    className="block w-48 px-4 py-2 border rounded-lg text-center font-mono text-xl"
                  />
                  <button 
                    onClick={handleVerifyMFASetup}
                    className="px-6 py-2 bg-orange-600 text-white text-xs font-bold uppercase rounded-lg"
                  >
                    Verify & Enable
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 p-4 border border-green-100 rounded-2xl bg-green-50 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-green-700 uppercase tracking-widest">
                MFA Protection Active
              </span>
            </div>
          )}
        </div>

        <Footer />

      </div>
    </main>
  );
}
