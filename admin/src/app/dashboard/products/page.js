'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';

// Icons
const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const LoadingSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px' }}>
        <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

const categories = ['Hijabs', 'Scarves', 'Instant Hijabs', 'Underscarves', 'Shawls', 'Accessories'];
const fabrics = ['Chiffon', 'Jersey', 'Satin', 'Satin Silk', 'Modal', 'Cotton', 'Silk', 'Crepe', 'Voile', 'Cashmere', 'Wool'];
const sizes = ['Standard', '45x45', '50x50', '55x55', '70x70'];
const colors = ['Black', 'White', 'Nude', 'Grey', 'Navy', 'Navy Blue', 'Maroon', 'Emerald', 'Dusty Pink', 'Sage Green', 'Cream', 'Brown', 'Burgundy'];

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        fabric: '',
        basePrice: '',
        originalPrice: '',
        description: '',
        image: null,
        variants: [{ size: '', color: '', stock: '', price: '', minStock: '10' }]
    });

    // Fetch products on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            } else {
                console.error('API returned error status');
                setProducts([]); // Set empty array on error
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const getTotalStock = (variants) => {
        if (!variants || !Array.isArray(variants)) return 0;
        return variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0);
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            brand: '',
            category: '',
            fabric: '',
            basePrice: '',
            originalPrice: '',
            description: '',
            image: null,
            variants: [{ size: '', color: '', stock: '', price: '', minStock: '10' }]
        });
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            brand: product.brand,
            category: product.category,
            fabric: product.fabric || '',
            basePrice: product.basePrice?.toString() || '',
            originalPrice: product.originalPrice?.toString() || '',
            description: product.description || '',
            image: product.image || null,
            variants: product.variants?.map(v => ({
                size: v.size,
                color: v.color,
                stock: v.stock?.toString() || '',
                price: v.price?.toString() || '',
                minStock: v.minStock?.toString() || '10'
            })) || [{ size: '', color: '', stock: '', price: '', minStock: '10' }]
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = value;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { size: '', color: '', stock: '', price: formData.basePrice, minStock: '10' }]
        }));
    };

    const removeVariant = (index) => {
        if (formData.variants.length > 1) {
            setFormData(prev => ({
                ...prev,
                variants: prev.variants.filter((_, i) => i !== index)
            }));
        }
    };

    const generateSKU = (productName, size, color) => {
        const prefix = productName.substring(0, 3).toUpperCase();
        const sizeCode = size.substring(0, 3).toUpperCase();
        const colorCode = color.substring(0, 3).toUpperCase();
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        return `${prefix}-${sizeCode}-${colorCode}-${random}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const productData = {
                name: formData.name,
                brand: formData.brand,
                category: formData.category,
                fabric: formData.fabric,
                basePrice: parseInt(formData.basePrice),
                originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
                description: formData.description,
                image: formData.image,
                variants: formData.variants.map(v => ({
                    sku: generateSKU(formData.name, v.size, v.color),
                    size: v.size,
                    color: v.color,
                    stock: parseInt(v.stock) || 0,
                    price: parseInt(v.price) || parseInt(formData.basePrice),
                    minStock: parseInt(v.minStock) || 10
                })),
                status: 'active'
            };

            if (editingProduct) {
                // Update existing product
                const res = await fetch('/api/products', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ _id: editingProduct._id, ...productData })
                });

                if (res.ok) {
                    setProducts(prev => prev.map(p =>
                        p._id === editingProduct._id ? { ...p, ...productData } : p
                    ));
                }
            } else {
                // Create new product
                const res = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });

                if (res.ok) {
                    const newProduct = await res.json();
                    setProducts(prev => [newProduct, ...prev]);
                }
            }

            closeModal();
        } catch (error) {
            console.error('Failed to save product:', error);
            alert('Failed to save product. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const deleteProduct = async (product) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch('/api/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: product._id, image: product.image })
            });

            if (res.ok) {
                setProducts(prev => prev.filter(p => p._id !== product._id));
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Failed to delete product. Please try again.');
        }
    };

    if (loading) {
        return (
            <>
                <Header title="Products" subtitle="Manage your product catalog" />
                <div className="page-content">
                    <LoadingSpinner />
                </div>
            </>
        );
    }

    return (
        <>
            <Header
                title="Products"
                subtitle="Manage your product catalog"
            />

            <div className="page-content">
                {/* Actions Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <select className="form-select" style={{ width: '160px' }}>
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select className="form-select" style={{ width: '140px' }}>
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={openAddModal}>
                        <PlusIcon /> Add Product
                    </button>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px'
                    }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                            No products yet. Add your first product to get started.
                        </p>
                        <button className="btn btn-primary" onClick={openAddModal}>
                            <PlusIcon /> Add Product
                        </button>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map(product => (
                            <div key={product._id} className="product-card">
                                <div className="product-card-image">
                                    {product.image?.url ? (
                                        <img src={product.image.url} alt={product.name} />
                                    ) : (
                                        <span style={{ color: 'var(--text-light)', fontSize: '14px' }}>No Image</span>
                                    )}
                                </div>
                                <div className="product-card-body">
                                    <div className="product-card-brand">{product.brand}</div>
                                    <div className="product-card-title">{product.name}</div>
                                    <div className="product-card-price">RM {product.basePrice?.toLocaleString()}</div>
                                    <div className="product-card-stock">
                                        <span className={`badge ${getTotalStock(product.variants) < 10 ? 'badge-warning' : 'badge-success'}`}>
                                            {getTotalStock(product.variants)} in stock
                                        </span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn btn-secondary btn-icon" onClick={() => openEditModal(product)}>
                                                <EditIcon />
                                            </button>
                                            <button className="btn btn-secondary btn-icon" onClick={() => deleteProduct(product)} style={{ color: 'var(--danger)' }}>
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                            <div className="modal-header">
                                <h3 className="modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                <button className="modal-close" onClick={closeModal}>
                                    <CloseIcon />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {/* Image Upload */}
                                    <ImageUpload
                                        value={formData.image}
                                        onChange={(img) => setFormData(prev => ({ ...prev, image: img }))}
                                        folder="products"
                                        label="Product Image"
                                    />

                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Product Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-input"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Premium Chiffon Hijab"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Brand *</label>
                                            <input
                                                type="text"
                                                name="brand"
                                                className="form-input"
                                                value={formData.brand}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Amrin Essentials"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Category *</label>
                                            <select
                                                name="category"
                                                className="form-select"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Fabric</label>
                                            <select
                                                name="fabric"
                                                className="form-select"
                                                value={formData.fabric}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Fabric</option>
                                                {fabrics.map(fab => (
                                                    <option key={fab} value={fab}>{fab}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Sale Price (RM) *</label>
                                            <input
                                                type="number"
                                                name="basePrice"
                                                className="form-input"
                                                value={formData.basePrice}
                                                onChange={handleInputChange}
                                                placeholder="45"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Original Price (RM) <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>- for discount</span></label>
                                            <input
                                                type="number"
                                                name="originalPrice"
                                                className="form-input"
                                                value={formData.originalPrice}
                                                onChange={handleInputChange}
                                                placeholder="Leave empty if no discount"
                                            />
                                        </div>
                                    </div>

                                    {formData.originalPrice && parseInt(formData.originalPrice) > parseInt(formData.basePrice) && (
                                        <div style={{
                                            padding: '12px 16px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            borderRadius: '8px',
                                            marginBottom: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <span style={{ fontSize: '20px' }}>🏷️</span>
                                            <span style={{ color: '#dc2626', fontWeight: '600' }}>
                                                {Math.round((1 - parseInt(formData.basePrice) / parseInt(formData.originalPrice)) * 100)}% OFF
                                            </span>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                                (RM {formData.originalPrice} → RM {formData.basePrice})
                                            </span>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            name="description"
                                            className="form-textarea"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Product description..."
                                            rows={3}
                                        />
                                    </div>

                                    {/* Variants Section */}
                                    <div style={{ marginTop: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <label className="form-label" style={{ margin: 0 }}>Product Variants</label>
                                            <button type="button" className="btn btn-secondary btn-sm" onClick={addVariant}>
                                                + Add Variant
                                            </button>
                                        </div>

                                        {formData.variants.map((variant, index) => (
                                            <div key={index} style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr 80px 80px 100px auto',
                                                gap: '12px',
                                                marginBottom: '12px',
                                                padding: '16px',
                                                background: 'var(--bg-main)',
                                                borderRadius: 'var(--radius-sm)'
                                            }}>
                                                <select
                                                    className="form-select"
                                                    value={variant.size}
                                                    onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Size</option>
                                                    {sizes.map(size => (
                                                        <option key={size} value={size}>{size}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    className="form-select"
                                                    value={variant.color}
                                                    onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Color</option>
                                                    {colors.map(color => (
                                                        <option key={color} value={color}>{color}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={variant.stock}
                                                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                    placeholder="Stock"
                                                    title="Current Stock"
                                                    required
                                                />
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={variant.minStock || '10'}
                                                    onChange={(e) => handleVariantChange(index, 'minStock', e.target.value)}
                                                    placeholder="Min"
                                                    title="Minimum Stock (for low stock alert)"
                                                />
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={variant.price || formData.basePrice}
                                                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                    placeholder="Price"
                                                    title="Variant Price"
                                                />
                                                {formData.variants.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-icon"
                                                        onClick={() => removeVariant(index)}
                                                        style={{ color: 'var(--danger)' }}
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={saving}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
