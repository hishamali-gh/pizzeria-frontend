import useTelemetry from '../hooks/useTelemetry.jsx';

export default function DeviceCard({ deviceId, deviceName, type }) {
  const telemetry = useTelemetry(deviceId);

  const unit =
    type === 'oven'
      ? '°F'
      : type === 'pump'
      ? 'L/m'
      : '%';

  const statusColor = telemetry.status
    ? 'bg-green-500'
    : 'bg-zinc-300';

  return (
    <div className="p-8 border-r border-b border-gray-100 bg-white">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold text-zinc-400 uppercase">
          {deviceName}
        </span>

        <div
          className={`w-1.5 h-1.5 rounded-full ${statusColor} ${
            telemetry.status ? 'animate-pulse' : ''
          }`}
        />
      </div>

      <div className="text-4xl font-bold tracking-tighter leading-none text-zinc-900">
        {telemetry.value}
        <span className="text-sm font-mono text-zinc-400 ml-2">
          {unit}
        </span>
      </div>

      <div className="mt-4 h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
        <div className="h-full bg-zinc-300 w-2/3" />
      </div>
    </div>
  );
}
