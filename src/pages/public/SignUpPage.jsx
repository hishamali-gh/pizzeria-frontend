import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../apiConfig';


export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [tenantName, setTenantName] = useState('');
  const [subdomain, setSubdomain] = useState('');

  const [selectedPlan, setSelectedPlan] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');

  const navigate = useNavigate();


  const finalizeRegistration = async (paymentProof) => {
    try {
      const payload = {
        tenant: { 
          name: tenantName, 
          subdomain 
        },
        payment: {
          razorpay_order_id: paymentProof.razorpay_order_id,
          razorpay_payment_id: paymentProof.razorpay_payment_id,
          razorpay_signature: paymentProof.razorpay_signature,
          plan: selectedPlan 
        },
        user: { 
          email, 
          password, 
          confirm_password: confirmPassword 
        },
        profile: {
          full_name: fullName, 
        }
      };

      const res = await API.post('auth/register/', payload);

      if (res.status === 201) {
        const { message, data, tokens } = res.data;

        localStorage.setItem('user_info', JSON.stringify(data));

        const { protocol, hostname, port } = window.location;
        const parts = hostname.split('.');
        const isVercel = hostname.endsWith('.vercel.app');

        let baseDomain = hostname;
        if (
          (isVercel && parts.length > 3) || 
          (!isVercel && parts.length > 2 && !hostname.endsWith('localhost')) ||
          (hostname.endsWith('localhost') && parts.length > 1)
        ) {
          baseDomain = parts.slice(1).join('.');
        }

        const host = data.subdomain ? `${data.subdomain}.${baseDomain}` : baseDomain;
        const redirectPort = port ? `:${port}` : '';

        window.location.href = `${protocol}//${host}${redirectPort}/profile?access=${tokens.access}&refresh=${tokens.refresh}`;
      }
    } catch (err) {
      const backendError = err.response?.data?.payment || 
                           err.response?.data?.error || 
                           "Registration failed. Contact support.";
      setError(backendError);
      setLoading(false);
    }
  };

  const handlePaymentInitiation = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderRes = await API.post('billing/order/create/', { plan: selectedPlan });
      const { order, key_id } = orderRes.data;

      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Pizzeria",
        description: `Initializing ${selectedPlan} Tier Vault`,
        order_id: order.id,
        handler: function (response) {
          finalizeRegistration(response);
        },
        prefill: {
          name: fullName,
          email: email,
        },
        theme: { color: "#18181b" },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
    } catch (err) {
      setError("Payment interface failed to initialize.");
      setLoading(false);
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Your password inputs don\'t match');

      return;
    }
    setError('');
    setStep(2); 
  };

  return (
    <main className="min-h-screen bg-white flex">
      <section className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-900">
        <img 
          src="https://ueeshop.ly200-cdn.com/u_file/UPBE/UPBE667/2509/12/photo/RefineryDCSMonitoring.jpg?x-oss-process=image/format,webp/quality,q_100" 
          alt="Automated Pizzeria"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      </section>

      <section className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white relative">
        <div className="max-w-md w-full">

          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 uppercase">
              {step === 1 ? "Create Account" : "Select Your Tier"}
            </h2>
            <p className="text-zinc-500 text-sm mt-2">
              {step === 1 
                ? "Setup your franchise identity and admin keys."
                : `Finalize the telemetry power for ${tenantName}`}
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">
                  Franchise Name
                </label>
                <input 
                  type="text" required value={tenantName} onChange={(e) => setTenantName(e.target.value)}
                  placeholder="e.g. Crust & Co" 
                  className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">
                  Subdomain
                </label>
                <div className="flex items-center">
                  <input 
                    type="text" required value={subdomain} onChange={(e) => setSubdomain(e.target.value)}
                    placeholder="my-branch" 
                    className="flex-1 px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-l-2xl focus:outline-none focus:border-orange-500 transition-all text-sm"
                  />
                  <span className="px-5 py-3.5 bg-zinc-100 border border-l-0 border-zinc-100 rounded-r-2xl text-zinc-400 text-[10px] font-black uppercase">
                    .pizzeria.app
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-3 border-t border-zinc-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input 
                    type="text" placeholder="Full Name" required 
                    value={fullName} onChange={(e) => setFullName(e.target.value)} 
                    className="w-full px-5 py-3.5 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:border-orange-600 transition-all" 
                  />
                  <input 
                    type="email" placeholder="Admin Email" required 
                    value={email} onChange={(e) => setEmail(e.target.value)} 
                    className="w-full px-5 py-3.5 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:border-orange-600 transition-all" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input 
                    type="password" placeholder="Password" required 
                    value={password} onChange={(e) => setPassword(e.target.value)} 
                    className="w-full px-5 py-3.5 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:border-orange-600 transition-all" 
                  />
                  <input 
                    type="password" placeholder="Confirm" required 
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="w-full px-5 py-3.5 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:border-orange-600 transition-all" 
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-[10px] font-bold uppercase p-3 rounded-xl text-center border border-red-100">
                  {error}
                </div>
              )}

              <button type="submit" className="w-full py-4 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 uppercase text-xs tracking-[0.2em] mt-2">
                Proceed to Plans
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {[
                { id: 'BASE', price: '$29.99', desc: '1-5 Smart Ovens' },
                { id: 'PLUS', price: '$79.99', desc: 'Up to 20 Devices' },
                { id: 'PRO', price: '$149.99', desc: 'Unlimited Telemetry' }
              ].map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full p-6 border rounded-2xl transition-all text-left group ${
                    selectedPlan === plan.id 
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/10' 
                    : 'border-zinc-100 bg-zinc-50 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPlan === plan.id ? 'text-orange-600' : 'text-zinc-400'}`}>
                      {plan.id} Tier
                    </span>
                    <span className="text-lg font-bold text-zinc-900">{plan.price}/mo</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{plan.desc}</p>
                </button>
              ))}

              {error && (
                <div className="bg-red-50 text-red-600 text-[10px] font-bold uppercase p-3 rounded-xl text-center border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  disabled={loading}
                  className="px-6 py-5 bg-zinc-100 text-zinc-500 font-bold rounded-2xl hover:bg-zinc-200 transition-all uppercase text-[10px] tracking-widest"
                >
                  Back
                </button>
                <button 
                  onClick={handlePaymentInitiation}
                  disabled={!selectedPlan || loading}
                  className="flex-1 py-5 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-orange-600 disabled:bg-zinc-300 transition-all shadow-xl shadow-orange-100 uppercase text-xs tracking-[0.2em]"
                >
                  {loading ? "Provisioning..." : "Pay & Initialize"}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-[10px] text-zinc-400 uppercase tracking-widest mt-8">
            Already have an account? <a href="/login" className="text-orange-600 font-black hover:underline">Login here</a>
          </p>
        </div>
      </section>
    </main>
  );
}
