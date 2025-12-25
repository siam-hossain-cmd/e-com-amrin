'use client';

import { useState, useRef } from 'react';

// Icons
const UploadIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

export default function ImageUpload({
    value,
    onChange,
    folder = 'products',
    multiple = false,
    maxFiles = 5,
    label = 'Upload Image'
}) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    // Convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Handle file selection
    const handleFiles = async (files) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file =>
            file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB max
        );

        if (validFiles.length === 0) {
            setError('Please select valid image files (max 10MB each)');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const base64Images = await Promise.all(validFiles.map(fileToBase64));

            if (multiple) {
                // Upload multiple images
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ images: base64Images, folder })
                });

                if (!res.ok) throw new Error('Upload failed');

                const data = await res.json();
                const currentImages = Array.isArray(value) ? value : [];
                const newImages = [...currentImages, ...data.images].slice(0, maxFiles);
                onChange(newImages);
            } else {
                // Upload single image
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64Images[0], folder })
                });

                if (!res.ok) throw new Error('Upload failed');

                const data = await res.json();
                onChange({ url: data.url, publicId: data.publicId });
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    };

    // Remove image
    const removeImage = async (index) => {
        if (multiple) {
            const images = [...value];
            const removed = images.splice(index, 1)[0];
            onChange(images);

            // Delete from Cloudinary
            if (removed?.publicId) {
                try {
                    await fetch('/api/upload', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ publicId: removed.publicId })
                    });
                } catch (err) {
                    console.error('Failed to delete from Cloudinary:', err);
                }
            }
        } else {
            if (value?.publicId) {
                try {
                    await fetch('/api/upload', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ publicId: value.publicId })
                    });
                } catch (err) {
                    console.error('Failed to delete from Cloudinary:', err);
                }
            }
            onChange(null);
        }
    };

    const hasImage = multiple
        ? Array.isArray(value) && value.length > 0
        : value && value.url;

    return (
        <div style={{ marginBottom: '16px' }}>
            <label className="form-label">{label}</label>

            {/* Upload Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                style={{
                    border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: uploading ? 'wait' : 'pointer',
                    background: dragActive ? 'rgba(var(--primary-rgb), 0.05)' : 'var(--bg-secondary)',
                    transition: 'all 0.2s',
                    opacity: uploading ? 0.7 : 1
                }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    onChange={(e) => handleFiles(e.target.files)}
                    style={{ display: 'none' }}
                    disabled={uploading}
                />

                {uploading ? (
                    <div>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            border: '3px solid var(--border)',
                            borderTopColor: 'var(--primary)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 12px'
                        }} />
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Uploading...</p>
                    </div>
                ) : (
                    <>
                        <UploadIcon />
                        <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0', fontSize: '14px' }}>
                            Drag and drop or click to upload
                        </p>
                        <p style={{ color: 'var(--text-light)', margin: '4px 0 0', fontSize: '12px' }}>
                            {multiple ? `Up to ${maxFiles} images, ` : ''}Max 10MB per file
                        </p>
                    </>
                )}
            </div>

            {/* Error message */}
            {error && (
                <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '8px' }}>{error}</p>
            )}

            {/* Image Preview */}
            {hasImage && (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginTop: '16px'
                }}>
                    {multiple ? (
                        value.map((img, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                                <img
                                    src={img.url}
                                    alt={`Upload ${index + 1}`}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: 'var(--danger)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div style={{ position: 'relative' }}>
                            <img
                                src={value.url}
                                alt="Upload preview"
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)'
                                }}
                            />
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: 'var(--danger)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
