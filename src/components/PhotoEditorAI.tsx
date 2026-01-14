import { useState } from 'react';
import { Upload, Square, RectangleVertical, ImageMinus, Smile, Shirt, RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';

// 🔒 CONFIGURACIÓN SEGURA
const API_KEY = import.meta.env.VITE_GOOGLE_AI_KEY; // Usar variables de entorno
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

interface EditorProps {
  onClose?: () => void;
}

type ToolType = 'square' | 'vertical' | 'white-bg' | 'smile' | 'try-on';

const SYSTEM_PROMPT = `
# ROL Y OBJETIVO
Eres "E-com Stylist", un asistente de IA experto en edición fotográfica para moda y comercio electrónico...
(mantener el prompt original completo)
`;

export default function PhotoEditorAI({ onClose }: EditorProps) {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastTool, setLastTool] = useState<{ type: ToolType; prompt?: string } | null>(null);

  // 🛡️ VALIDACIÓN DE ARCHIVOS
  const validateImage = (file: File): boolean => {
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error('Formato no válido. Usa PNG, JPEG o WEBP');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('Imagen muy pesada. Máximo 5MB');
      return false;
    }

    return true;
  };

  // 📤 CARGA DE IMAGEN PRINCIPAL
  const handlePersonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateImage(file)) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPersonImage(event.target?.result as string);
      setEditedImage(null);
    };
    reader.readAsDataURL(file);
  };

  // 👔 CARGA DE PRENDA
  const handleGarmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateImage(file)) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setGarmentImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 🤖 LLAMADA A LA API (CON RETRY BACKOFF)
  const callAPI = async (prompt: string, images: string[]) => {
    if (!API_KEY || API_KEY === 'TU_API_KEY_AQUI') {
      toast.error('API Key no configurada. Contacta al administrador.');
      return;
    }

    setLoading(true);
    setEditedImage(null);

    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          ...images.map(img => ({
            inlineData: { 
              mimeType: "image/png", 
              data: img.split(',')[1] 
            }
          }))
        ]
      }],
      generationConfig: { responseModalities: ['IMAGE'] },
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
    };

    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
      try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          if (response.status === 429 || response.status >= 500) {
            await new Promise(r => setTimeout(r, delay));
            delay *= 2;
            retries--;
            continue;
          }
          throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();
        const imageData = result?.candidates?.[0]?.content?.parts?.find(
          (p: any) => p.inlineData
        )?.inlineData?.data;

        if (imageData) {
          setEditedImage(`data:image/png;base64,${imageData}`);
          toast.success('¡Imagen generada!');
        } else {
          throw new Error('No se generó imagen');
        }

        break;
      } catch (error: any) {
        if (retries === 1) {
          console.error('Error en API:', error);
          toast.error(`Error: ${error.message}`);
        }
        retries--;
      }
    }

    setLoading(false);
  };

  // 🛠️ HERRAMIENTAS
  const runTool = (type: ToolType, prompt: string) => {
    if (!personImage) {
      toast.error('Carga primero la imagen de la persona');
      return;
    }

    setLastTool({ type, prompt });

    if (type === 'try-on') {
      if (!garmentImage) {
        toast.error('Carga primero la prenda');
        return;
      }
      callAPI('virtual try-on: Coloca la prenda de la segunda imagen en la persona de la primera imagen.', [personImage, garmentImage]);
    } else {
      callAPI(prompt, [personImage]);
    }
  };

  const retry = () => {
    if (!lastTool) return;
    runTool(lastTool.type, lastTool.prompt || '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">E-com Stylist AI</h1>
          <p className="text-white/60">Edición fotográfica con Inteligencia Artificial</p>
        </div>

        {/* PASO 1: CARGAR IMAGEN */}
        <div className="mb-8">
          <label className="block text-white font-bold mb-3">
            📷 Paso 1: Carga tu imagen (Persona)
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handlePersonUpload}
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
          />
        </div>

        {/* PASO 2: HERRAMIENTAS */}
        <div className="mb-8">
          <label className="block text-white font-bold mb-3">
            🛠️ Paso 2: Elige una herramienta
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            <button
              onClick={() => runTool('square', 'cuadrado 500x500')}
              disabled={!personImage || loading}
              className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-3"
            >
              <Square size={32} />
              <span className="text-sm font-bold">Cuadrado 1:1</span>
            </button>

            <button
              onClick={() => runTool('vertical', 'vertical instagram')}
              disabled={!personImage || loading}
              className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-3"
            >
              <RectangleVertical size={32} />
              <span className="text-sm font-bold">Vertical 4:5</span>
            </button>

            <button
              onClick={() => runTool('white-bg', 'fondo blanco')}
              disabled={!personImage || loading}
              className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-3"
            >
              <ImageMinus size={32} />
              <span className="text-sm font-bold">Fondo Blanco</span>
            </button>

            <button
              onClick={() => runTool('smile', 'hacer sonreír')}
              disabled={!personImage || loading}
              className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-3"
            >
              <Smile size={32} />
              <span className="text-sm font-bold">Hacer Sonreír</span>
            </button>

            {/* VIRTUAL TRY-ON */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white">
              <span className="text-xs font-bold block mb-3 text-center">Virtual Try-On</span>
              <img 
                src={garmentImage || "https://placehold.co/100x100/4f46e5/ffffff?text=Prenda"} 
                alt="Prenda" 
                className="w-16 h-16 object-contain mx-auto mb-3 rounded-lg border border-white/20"
              />
              <label className="block mb-2">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleGarmentUpload}
                  className="hidden"
                />
                <span className="block text-xs bg-indigo-600 hover:bg-indigo-700 py-2 px-3 rounded-lg text-center cursor-pointer">
                  <Upload className="inline w-4 h-4 mr-1" />
                  Cargar Prenda
                </span>
              </label>
              <button
                onClick={() => runTool('try-on', '')}
                disabled={!personImage || !garmentImage || loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shirt className="inline w-4 h-4 mr-1" />
                Poner Ropa
              </button>
            </div>

          </div>
        </div>

        {/* PASO 3: RESULTADOS */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* ORIGINAL */}
          <div>
            <h3 className="text-white font-bold mb-3 text-center">Original</h3>
            <div className="w-full aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10">
              <img
                src={personImage || "https://placehold.co/500x500/1e293b/94a3b8?text=Carga+tu+imagen"}
                alt="Original"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* EDITADA */}
          <div>
            <h3 className="text-white font-bold mb-3 text-center">Editada</h3>
            <div className="w-full aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10">
              {loading ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-t-indigo-600 border-white/20 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white/60 text-sm">Procesando con IA...</p>
                </div>
              ) : (
                <img
                  src={editedImage || "https://placehold.co/500x500/1e293b/94a3b8?text=Tu+resultado+IA"}
                  alt="Editada"
                  className="max-w-full max-h-full object-contain rounded-2xl"
                />
              )}
            </div>

            {/* ACCIONES */}
            {editedImage && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <a
                  href={editedImage}
                  download="edited-image.png"
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-colors"
                >
                  <Download size={18} />
                  Descargar
                </a>
                <button
                  onClick={retry}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors"
                >
                  <RefreshCw size={18} />
                  Reintentar
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}