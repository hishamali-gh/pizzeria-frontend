import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../../apiConfig';

export default function Onboarding() {
    const [status, setStatus] = useState('verifying'); // verifying, active, expired, success
    const [password, setPassword] = useState('');

    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');

    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            try {
                await API.get(`employees/invite-staff/?token=${token}`);

                setStatus('active');
            } catch (err) {
                setStatus('expired');
            }
        };

        if (token) checkToken();
    }, [token]);

    const handleSetup = async (e) => {
        e.preventDefault();

        try {
            await API.post('employees/claim-invite/', { token, password });

            setStatus('success');

            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            alert("Account activation failed.");
        }
    };

    if (status === 'verifying') return <div className="p-20 font-mono">HANDSHAKE_IN_PROGRESS...</div>;
    if (status === 'expired') return <div className="p-20 font-mono text-red-500">INVALID_OR_EXPIRED_HANDSHAKE</div>;

    return (
        <div className="min-h-screen flex items-center justify-center p-8 selection:bg-orange-100">
            <div className="max-w-md w-full space-y-8">
                <h2 className="text-5xl font-bold tracking-tighter italic">Identity_Init</h2>
                <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                    Secure tunnel open. Create your master credentials for this node.
                </p>

                {status === 'success' ? (
                    <div className="p-4 bg-green-50 text-green-700 font-mono text-xs">PROFILE_ACTIVATED. REDIRECTING...</div>
                ) : (
                    <form onSubmit={handleSetup} className="space-y-6">
                        <input
                            type="password"
                            placeholder="SET_PASSWORD"
                            className="w-full border-b border-zinc-200 py-3 outline-none focus:border-orange-500 font-mono"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button className="bg-orange-500 text-white px-8 py-4 font-mono text-xs tracking-widest hover:bg-zinc-900 transition-all w-full">
                            ACTIVATE_OPERATOR
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
