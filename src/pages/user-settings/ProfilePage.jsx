import { useState, useEffect } from 'react';

import API from '../../apiConfig';

import NavBar2 from "../../components/NavBar2";
import Footer from "../../components/Footer";


export default function ProfilePage() {
  const [profile, setProfile] = useState(null);


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
      }
    
      catch (err) {
        console.error('Session expired or unauthorized', err)
      }
    };
    
    loadPage();
  }, []);


  if (!profile) return <p>Calibrating Identity...</p>;

  return (
    <main className="min-h-screen bg-white dm-sans-regular flex flex-col">
      <NavBar2 variant="hmi" tenantName={profile.tenant.name} />

      <div className="max-w-7xl mx-auto px-8 border-x border-gray-100 flex flex-col relative overflow-hidden min-h-screen">

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

        <Footer />

      </div>
    </main>
  );
}
