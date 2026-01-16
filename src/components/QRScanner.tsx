import { useState } from 'react';
import QrScanner from 'react-qr-scanner';

interface QRCodeScannerProps {
    onScan: (data: string | null) => void;
    onError: (error: any) => void;
}

export default function QRCodeScanner({ onScan, onError }: QRCodeScannerProps) {
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

    const handleScan = (data: any) => {
        if (data) {
            onScan(data?.text || data);
        }
    };

    const handleError = (err: any) => {
        console.error(err);
        onError(err);
    };

    const previewStyle = {
        height: 320,
        width: '100%',
        borderRadius: '16px',
        objectFit: 'cover'
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl">
                <QrScanner
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={previewStyle}
                    constraints={{
                        video: { facingMode }
                    }}
                />
                <div className="absolute inset-0 border-2 border-white/30 rounded-2xl pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-emerald-400 rounded-lg shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>
                </div>
            </div>

            <button
                onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                className="text-slate-400 text-sm hover:text-white transition flex items-center gap-2"
            >
                🔄 Cambiar Cámara
            </button>

            <p className="text-slate-500 text-xs text-center">
                Apunta la cámara al código QR del turista
            </p>
        </div>
    );
}
