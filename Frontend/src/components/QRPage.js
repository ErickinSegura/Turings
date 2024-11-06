import React, { useState } from 'react';
import QRCode from 'react-qr-code';

const QRPage = () => {
  // You can set a default value or use state to manage the QR code value
  const [qrValue, setQrValue] = useState('https://example.com');

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-64">
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={qrValue}
          viewBox="0 0 256 256"
        />
      </div>
      
      {/* Optional: Add an input to change the QR code value */}
      <input 
        type="text"
        value={qrValue}
        onChange={(e) => setQrValue(e.target.value)}
        className="mt-4 p-2 border rounded"
        placeholder="Enter URL or text for QR code"
      />
    </div>
  );
};

export default QRPage;