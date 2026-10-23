import React, { useMemo, useState } from 'react';
import JSZip from 'jszip';
import shopifyIgnoreRaw from '../../gridium/.shopifyignore?raw';
import themeCheckRaw from '../../gridium/.theme-check.yml?raw';

const globFiles = import.meta.glob('../../gridium/**/*', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function getAllThemeFiles(): Record<string, string> {
  const map: Record<string, string> = {
    '.shopifyignore': shopifyIgnoreRaw,
    '.theme-check.yml': themeCheckRaw,
  };
  for (const [k, content] of Object.entries(globFiles)) {
    const clean = k.replace('../../gridium/', '');
    map[clean] = content;
  }
  return map;
}

interface ThemeStudioModalProps {
  open: boolean;
  onClose: () => void;
}

export const ThemeStudioModal: React.FC<ThemeStudioModalProps> = ({ open, onClose }) => {
  const filesMap = useMemo(() => getAllThemeFiles(), []);
  const filePaths = useMemo(() => Object.keys(filesMap).sort(), [filesMap]);
  const [selectedPath, setSelectedPath] = useState<string>('layout/theme.liquid');
  const [filterText, setFilterText] = useState('');
  const [copied, setCopied] = useState(false);
  const [zipping, setZipping] = useState(false);

  if (!open) return null;

  const filteredPaths = filePaths.filter((p) => p.toLowerCase().includes(filterText.toLowerCase()));
  const activeContent = filesMap[selectedPath] ?? '';

  const handleDownloadShopifyZip = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      for (const [path, content] of Object.entries(filesMap)) {
        // Shopify Admin "Upload zip file" expects only theme directories at root
        if (
          path.startsWith('assets/') ||
          path.startsWith('config/') ||
          path.startsWith('layout/') ||
          path.startsWith('locales/') ||
          path.startsWith('sections/') ||
          path.startsWith('snippets/') ||
          path.startsWith('templates/')
        ) {
          zip.file(path, content);
        }
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gridium-shopify-theme-v1.3.0.zip';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setZipping(false);
    }
  };

  const handleDownloadWorkspaceZip = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      for (const [path, content] of Object.entries(filesMap)) {
        zip.file(`gridium/${path}`, content);
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gridium-full-workspace-v1.3.0.zip';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setZipping(false);
    }
  };

  const handleDownloadCsv = () => {
    const csv = filesMap['demo/products_import.csv'] || '';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_import.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyFile = () => {
    navigator.clipboard?.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className="modal-overlay"
      aria-hidden="false"
      role="dialog"
      aria-modal="true"
      aria-label="Gridium OS 2.0 Theme Source & Exporter"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel" style={{ maxWidth: '1140px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div>
            <span className="mono-label">ONLINE STORE 2.0 PACKAGE · {filePaths.length} FILES VERIFIED</span>
            <h2 className="h3" style={{ marginTop: 4 }}>Gridium v1.3.0 — Complete Shopify Theme Files</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <button type="button" className="button button--sm" onClick={handleDownloadShopifyZip} disabled={zipping}>
              {zipping ? 'Packaging...' : 'Download Shopify Upload .ZIP'}
            </button>
            <button type="button" className="button button--secondary button--sm" onClick={handleDownloadWorkspaceZip} disabled={zipping}>
              Full Repo .ZIP (+README & CSV)
            </button>
            <button type="button" className="button button--secondary button--sm" onClick={handleDownloadCsv}>
              Demo Shirts .CSV
            </button>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <input
            type="search"
            className="field__input"
            style={{ maxWidth: 320, minHeight: 38, padding: '6px 12px', fontSize: '0.8125rem' }}
            placeholder={`Filter ${filePaths.length} files (e.g. about, settings, csv)...`}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="mono-label" style={{ color: 'var(--color-text)' }}>gridium/{selectedPath}</span>
            <button type="button" className="button button--secondary button--sm" onClick={handleCopyFile}>
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>
        </div>

        <div className="code-explorer">
          <div className="code-explorer__tree">
            {filteredPaths.map((p) => (
              <button
                key={p}
                type="button"
                className={`code-explorer__file${p === selectedPath ? ' is-active' : ''}`}
                onClick={() => setSelectedPath(p)}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p}</span>
              </button>
            ))}
          </div>
          <pre className="code-explorer__viewer" style={{ margin: 0 }}>
            <code>{activeContent}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
