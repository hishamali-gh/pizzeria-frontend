import { useState } from 'react';
import NavBar2 from '../../components/NavBar2';
import Footer from '../../components/Footer';
import API from '../../apiConfig';

export default function ManagementHub() {
  const [activeTab, setActiveTab] = useState('devices');
  const [loading, setLoading] = useState(false);

  const [staffData, setStaffData] = useState({
    email: '',
    role: 'viewer'
  });

  const [deviceData, setDeviceData] = useState({
    deviceId: '',
    deviceName: '',
    deviceType: 'oven'
  });

  const handleInviteStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('employees/invite-staff/', staffData);

      alert(`Access link generated for ${staffData.email}. Check the server terminal.`);

      setStaffData({ email: '', role: 'viewer' });
    } catch (err) {
      alert("Failed to send invitation.");
    } finally {
      setLoading(false);
    }
  };

  const handleProvisionDevice = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('devices/inventory/', {
        device_id: deviceData.deviceId,
        name: deviceData.deviceName,
        type: deviceData.deviceType
      });
      
      alert(`Node ${res.data.device_id} successfully provisioned in the tenant vault.`);

      setDeviceData({ deviceId: '', deviceName: '', deviceType: 'oven' });
    } catch (err) {
      console.error("Provisioning Error:", err);

      alert("Provisioning failed. Ensure Hardware ID is unique.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-orange-100">
      <NavBar2 variant="hmi" tenantName="CRUST-NY-PROVISIONING" />

      <main className="flex-1 max-w-7xl mx-auto w-full border-x border-gray-100 flex flex-col relative overflow-hidden">
        <div className="grid grid-cols-12 border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('devices')}
            className={`col-span-6 py-6 font-mono text-[11px] tracking-[0.2em] transition-colors ${activeTab === 'devices' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-50'}`}
          >
            PROVISION_NODES
          </button>
          <button 
            onClick={() => setActiveTab('staff')}
            className={`col-span-6 py-6 font-mono text-[11px] tracking-[0.2em] transition-colors ${activeTab === 'staff' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-50'}`}
          >
            AUTHORIZE_STAFF
          </button>
        </div>

        <div className="flex-1 grid grid-cols-12">
          <div className="col-span-8 p-12 border-r border-gray-100">
            <h2 className="text-6xl font-bold tracking-tighter leading-[0.8] mb-12 uppercase">
              {activeTab === 'devices' ? 'Add New Node' : 'Register Operator'}
            </h2>
            
            {activeTab === 'devices' ? (
              <form className="space-y-8 max-w-md" onSubmit={handleProvisionDevice}>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] tracking-widest text-zinc-400 uppercase">Hardware_ID</label>
                  <input 
                    required
                    className="w-full border-b border-zinc-200 py-2 outline-none focus:border-orange-500 transition-colors font-mono uppercase" 
                    placeholder="e.g. OVN-001" 
                    value={deviceData.deviceId}
                    onChange={(e) => setDeviceData({...deviceData, deviceId: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] tracking-widest text-zinc-400 uppercase">Operational_Label</label>
                  <input 
                    required
                    className="w-full border-b border-zinc-200 py-2 outline-none focus:border-orange-500 transition-colors" 
                    placeholder="e.g. Master Sauce Pump" 
                    value={deviceData.deviceName}
                    onChange={(e) => setDeviceData({...deviceData, deviceName: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] tracking-widest text-zinc-400 uppercase">Machine_Type</label>
                  <select 
                    className="w-full border-b border-zinc-200 py-2 outline-none bg-transparent font-mono"
                    value={deviceData.deviceType}
                    onChange={(e) => setDeviceData({...deviceData, deviceType: e.target.value})}
                  >
                    <option value="oven">INDUSTRIAL_OVEN</option>
                    <option value="conveyor">CONVEYOR_BELT</option>
                    <option value="pump">FLUID_PUMP</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 text-white px-8 py-4 font-mono text-xs tracking-widest hover:bg-zinc-900 transition-all disabled:bg-zinc-300"
                >
                  {loading ? 'INITIALIZING...' : 'INITIALIZE_PROVISIONING'}
                </button>
              </form>
            ) : (
              <form className="space-y-8 max-w-md" onSubmit={handleInviteStaff}>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] tracking-widest text-zinc-400 uppercase">Work_Email</label>
                  <input 
                    type="email"
                    required
                    className="w-full border-b border-zinc-200 py-2 outline-none focus:border-orange-500 transition-colors font-mono" 
                    placeholder="operator@crust.com" 
                    value={staffData.email}
                    onChange={(e) => setStaffData({...staffData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] tracking-widest text-zinc-400 uppercase">Clearance_Level</label>
                  <select 
                    className="w-full border-b border-zinc-200 py-2 outline-none bg-transparent font-mono"
                    value={staffData.role}
                    onChange={(e) => setStaffData({...staffData, role: e.target.value})}
                  >
                    <option value="viewer">L1 - MONITOR ONLY</option>
                    <option value="worker">L2 - ACTUATOR ACCESS</option>
                    <option value="admin">L3 - MAINTENANCE</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 text-white px-8 py-4 font-mono text-xs tracking-widest hover:bg-zinc-900 transition-all disabled:bg-zinc-300"
                >
                  {loading ? 'SENDING_INVITATION...' : 'AUTHORIZE_OPERATOR'}
                </button>
              </form>
            )}
          </div>

          <div className="col-span-4 bg-zinc-50/50 p-8 space-y-8">
            <div>
              <h3 className="font-bold text-xs tracking-widest uppercase mb-4 text-zinc-400">Protocols</h3>
              <p className="text-zinc-500 text-[11px] font-mono leading-relaxed">
                {activeTab === 'devices' 
                  ? "DEVICE_PROVISIONING: New nodes must be assigned a unique Hardware ID (UUID/Serial). Once registered, the backend creates a dedicated vault entry to store historical telemetry (The Historian)."
                  : "STAFF_AUTHORIZATION: Operators are invited to a specific tenant silo. Level 3 users gain access to Management and low-level overrides."}
              </p>
            </div>
            <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-green-600">System_Live</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono italic">Awaiting secure handshake for new entry...</p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
