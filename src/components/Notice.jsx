import React from 'react';

export default function Notice({ type = 'info', message, onClose }) {
    if (!message) return null;
    const styles = {
        container: {
            margin: '12px 0',
            padding: '12px 14px',
            borderRadius: '8px',
            border: `1px solid ${type === 'error' ? '#f5c6cb' : type === 'success' ? '#c6f6d5' : '#d1d5db'}`,
            background: type === 'error' ? '#f8d7da' : type === 'success' ? '#def7ec' : '#ffffff',
            color: type === 'error' ? '#721c24' : type === 'success' ? '#03543f' : '#1f2937'
        },
        row: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        close: {
            background: 'transparent',
            color: 'inherit',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
        }
    };

    return (
        <div role="status" style={styles.container}>
            <div style={styles.row}>
                <span>{message}</span>
                {onClose && (
                    <button type="button" onClick={onClose} style={styles.close}>×</button>
                )}
            </div>
        </div>
    );
}


