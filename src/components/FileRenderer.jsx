import React from 'react';

// Simple check to determine if the string is likely a public Supabase URL
const isFileUrl = (str) => {
    return str && (str.startsWith('http') || str.startsWith('https://')) && str.includes('supabase.co/storage/v1/object/public/');
};

const getFileType = (url) => {
    if (!url) return 'text';
    // Clean URL query parameters before checking extension
    const urlWithoutQuery = url.split('?')[0]; 
    const ext = urlWithoutQuery.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    return 'generic';
};

export default function FileRenderer({ content, title }) {
    if (!content) return <p>(No content provided)</p>;

    const url = content.trim();

    if (!isFileUrl(url)) {
        // Render as text (for standard text-based QB entry)
        return <pre style={{whiteSpace:'pre-wrap', background: '#f5f5f5', color: '#111827', padding: '12px', borderRadius: '6px', fontSize: '14px', margin: '10px 0'}}>{content}</pre>;
    }
    
    // Render as file/link (for file-based QB or Assignments)
    const fileType = getFileType(url);

    if (fileType === 'image') {
        return (
            <div style={{ marginTop: '10px' }}>
                <img src={url} alt={title || "Uploaded Image"} style={{maxWidth: '100%', height: 'auto', display: 'block', margin: '8px 0', border: '1px solid #ddd', borderRadius: '4px'}} />
                <a href={url} target="_blank" rel="noopener noreferrer">View Original File ({title})</a>
            </div>
        );
    } 
    
    return (
        <p style={{ marginTop: '10px' }}>
            <a href={url} target="_blank" rel="noopener noreferrer">
                {fileType === 'pdf' ? '📥 Download/View PDF' : '📦 Download File'}: {title || 'File Link'}
            </a>
        </p>
    );
}