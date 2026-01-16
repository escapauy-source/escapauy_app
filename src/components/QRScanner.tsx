import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRCodeScannerProps {
    onScan: (data: string | null) => void;
    onError: (error: any) => void;
}

export default function QRCodeScanner({ onScan, onError }: QRCodeScannerProps) {
    useEffect(() => {
        const scannerId = "html5qr-code-full-region";

        // Configuración básica
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        };

        const scanner = new Html5QrcodeScanner(scannerId, config, false);

        scanner.render(
            (decodedText) => {
                onScan(decodedText);
                // Opcional: Pausar o limpiar después del éxito si se desea
            },
            (errorMessage) => {
                // Errores de escaneo continuo son normales, solo reportar si es crítico
                // onError(errorMessage); 
            }
        );

        // Cleanup function
        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []); // Empty dependency array ensures run once on mount

    return (
        <div className="flex flex-col items-center space-y-4 w-full max-w-sm mx-auto">
            <div
                id="html5qr-code-full-region"
                className="w-full bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl"
            />
            <p className="text-slate-500 text-xs text-center">
                Apunta la cámara al código QR del turista
            </p>
        </div>
    );
}
