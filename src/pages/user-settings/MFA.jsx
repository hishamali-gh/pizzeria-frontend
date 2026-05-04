import { QRCodeSVG } from 'qrcode.react';

function MFASetup({ otpUri }) {
  return (
    <div className="p-4 bg-zinc-800 border border-zinc-700 rounded">
      <h3 className="text-orange-500 font-bold mb-4">SCAN SAFETY KEY</h3>
      <div className="bg-white p-2 inline-block rounded">
        <QRCodeSVG value={otpUri} size={200} />
      </div>
      <p className="text-xs mt-4 text-zinc-400">
        Scan this with Google Authenticator or Authy.
      </p>
    </div>
  );
}
