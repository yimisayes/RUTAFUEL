import { useState } from 'react';
import { X, FolderOpen, Download, File, HardDrive } from 'lucide-react';

interface SaveFileDialogProps {
  defaultFileName: string;
  onSave: (fileName: string, location: string) => void;
  onCancel: () => void;
}

export function SaveFileDialog({ defaultFileName, onSave, onCancel }: SaveFileDialogProps) {
  const [fileName, setFileName] = useState(defaultFileName);
  const [selectedLocation, setSelectedLocation] = useState('Descargas');

  const locations = [
    { id: 'desktop', name: 'Escritorio', icon: '🖥️', path: 'C:\\Users\\Usuario\\Desktop' },
    { id: 'documents', name: 'Documentos', icon: '📁', path: 'C:\\Users\\Usuario\\Documents' },
    { id: 'downloads', name: 'Descargas', icon: '📥', path: 'C:\\Users\\Usuario\\Downloads' },
  ];

  const selectedLocationData = locations.find(loc => loc.name === selectedLocation) || locations[2];

  const handleSave = () => {
    onSave(fileName, `${selectedLocationData.path}\\${fileName}`);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[110] backdrop-blur-sm">
      {/* Windows-style Save Dialog */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-300">
        {/* Title Bar - Windows Style */}
        <div className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-300 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="size-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-800">Guardar como</h3>
          </div>
          <button
            onClick={onCancel}
            className="size-7 hover:bg-red-500 hover:text-white flex items-center justify-center rounded transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Dialog Content */}
        <div className="p-4">
          {/* Location Selector */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Guardar en:
            </label>
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-3 py-2">
              <FolderOpen className="size-4 text-gray-500" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 cursor-pointer"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.name}>
                    {loc.icon} {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File Explorer Preview */}
          <div className="mb-4 border border-gray-300 rounded bg-gray-50 p-3 min-h-[180px]">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 mb-3">
              <HardDrive className="size-3.5 text-gray-500" />
              <span className="text-xs text-gray-600 font-mono">{selectedLocationData.path}</span>
            </div>
            
            {/* Simulated folder contents */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 rounded cursor-pointer">
                <File className="size-4 text-red-500" />
                <span className="text-xs text-gray-600">Reporte_Caja_2026-02-18.pdf</span>
                <span className="text-xs text-gray-400 ml-auto">245 KB</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 rounded cursor-pointer">
                <File className="size-4 text-red-500" />
                <span className="text-xs text-gray-600">Reporte_Caja_2026-02-17.pdf</span>
                <span className="text-xs text-gray-400 ml-auto">198 KB</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 rounded cursor-pointer">
                <File className="size-4 text-red-500" />
                <span className="text-xs text-gray-600">Reporte_Caja_2026-02-15.pdf</span>
                <span className="text-xs text-gray-400 ml-auto">210 KB</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 bg-blue-100 border border-blue-300 rounded">
                <File className="size-4 text-red-600" />
                <span className="text-xs text-gray-900 font-semibold">{fileName}</span>
                <span className="text-xs text-blue-600 ml-auto font-medium">Nuevo</span>
              </div>
            </div>
          </div>

          {/* File Name Input */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Nombre del archivo:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-2 rounded border border-gray-300">
                PDF
              </span>
            </div>
          </div>

          {/* Full Path Display */}
          <div className="mb-5 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <p className="text-xs text-blue-600 mb-1 font-semibold">Ruta completa:</p>
            <p className="text-xs text-blue-800 font-mono break-all">
              {selectedLocationData.path}\{fileName}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-5 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!fileName.trim()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded transition-colors flex items-center gap-2"
            >
              <Download className="size-4" />
              Guardar
            </button>
          </div>
        </div>

        {/* Bottom Status Bar - Windows Style */}
        <div className="bg-gray-100 border-t border-gray-300 px-4 py-1.5">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Tipo: Documento PDF (*.pdf)</span>
            <span>Tamaño estimado: ~180 KB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
