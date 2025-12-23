'use client';

import { useState } from 'react';
import Header from '@/components/Header';

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

// Hijab & Scarf Products Data
const initialProducts = [
    {
        id: 1,
        name: 'Premium Chiffon Hijab',
        brand: 'Amrin Essentials',
        category: 'Hijabs',
        basePrice: 45,
        image: null,
        variants: [
            { sku: 'PCH-STD-BLK-001', size: 'Standard', color: 'Black', stock: 25, price: 45 },
            { sku: 'PCH-STD-WHT-002', size: 'Standard', color: 'White', stock: 30, price: 45 },
            { sku: 'PCH-STD-NDE-003', size: 'Standard', color: 'Nude', stock: 20, price: 45 },
        ],
        status: 'active'
    },
    {
        id: 2,
        name: 'Luxury Satin Silk Shawl',
        brand: 'Amrin Luxe',
        category: 'Scarves',
        basePrice: 89,
        image: null,
        variants: [
            { sku: 'LSS-STD-BLU-001', size: 'Standard', color: 'Navy Blue', stock: 15, price: 89 },
            { sku: 'LSS-STD-MRN-002', size: 'Standard', color: 'Maroon', stock: 12, price: 89 },
            { sku: 'LSS-STD-EMR-003', size: 'Standard', color: 'Emerald', stock: 10, price: 89 },
        ],
        status: 'active'
    },
    {
        id: 3,
        name: 'Jersey Instant Hijab',
        brand: 'Amrin Easy Wear',
        category: 'Instant Hijabs',
        basePrice: 35,
        image: null,
        variants: [
            { sku: 'JIH-STD-BLK-001', size: 'Standard', color: 'Black', stock: 40, price: 35 },
            { sku: 'JIH-STD-GRY-002', size: 'Standard', color: 'Grey', stock: 35, price: 35 },
            { sku: 'JIH-STD-NVY-003', size: 'Standard', color: 'Navy', stock: 0, price: 35 },
        ],
        status: 'active'
    },
    {
        id: 4,
        name: 'Modal Cotton Underscarf',
        brand: 'Amrin Basics',
        category: 'Underscarves',
        basePrice: 18,
        image: null,
        variants: [
            { sku: 'MCU-STD-BLK-001', size: 'Standard', color: 'Black', stock: 50, price: 18 },
            { sku: 'MCU-STD-WHT-002', size: 'Standard', color: 'White', stock: 45, price: 18 },
            { sku: 'MCU-STD-NDE-003', size: 'Standard', color: 'Nude', stock: 38, price: 18 },
        ],
        status: 'active'
    },
    {
        id: 5,
        name: 'Crepe Premium Hijab',
        brand: 'Amrin Luxe',
        category: 'Hijabs',
        basePrice: 65,
        image: null,
        variants: [
            { sku: 'CPH-STD-DST-001', size: 'Standard', color: 'Dusty Pink', stock: 18, price: 65 },
            { sku: 'CPH-STD-SGE-002', size: 'Standard', color: 'Sage Green', stock: 15, price: 65 },
        ],
        status: 'active'
    }
];

const categories = ['Hijabs', 'Scarves', 'Instant Hijabs', 'Underscarves', 'Shawls', 'Accessories'];
const sizes = ['Standard', '45x45', '50x50', '55x55', '70x70'];
const colors = ['Black', 'White', 'Nude', 'Grey', 'Navy', 'Navy Blue', 'Maroon', 'Emerald', 'Dusty Pink', 'Sage Green', 'Cream', 'Brown', 'Burgundy'];

export default function ProductsPage() {
    const [products, setProducts] = useState(initialProducts);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        basePrice: '',
        description: '',
        variants: [{ size: '', color: '', stock: '', price: '' }]
    });

    const getTotalStock = (variants) => {
        return variants.reduce((sum, v) => sum + v.stock, 0);
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            brand: '',
            category: '',
            basePrice: '',
            description: '',
            variants: [{ size: '', color: '', stock: '', price: '' }]
        });
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            brand: product.brand,
            category: product.category,
            basePrice: product.basePrice.toString(),
            description: product.description || '',
            variants: product.variants.map(v => ({
                size: v.size,
                color: v.color,
                stock: v.stock.toString(),
                price: v.price.toString()
            }))
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
            variants: [...prev.variants, { size: '', color: '', stock: '', price: formData.basePrice }]
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
        const sizeCode = size.toUpperCase();
        const colorCode = color.substring(0, 3).toUpperCase();
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        return `${prefix}-${sizeCode}-${colorCode}-${random}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const productData = {
            id: editingProduct ? editingProduct.id : Date.now(),
            name: formData.name,
            brand: formData.brand,
            category: formData.category,
            basePrice: parseInt(formData.basePrice),
            description: formData.description,
            image: null,
            variants: formData.variants.map(v => ({
                sku: generateSKU(formData.name, v.size, v.color),
                size: v.size,
                color: v.color,
                stock: parseInt(v.stock) || 0,
                price: parseInt(v.price) || parseInt(formData.basePrice)
            })),
            status: 'active'
        };

        if (editingProduct) {
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? productData : p));
        } else {
            setProducts(prev => [...prev, productData]);
        }

        closeModal();
    };

    const deleteProduct = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

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
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="product-card-image">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} />
                                ) : (
                                    <span style={{ color: 'var(--text-light)', fontSize: '14px' }}>No Image</span>
                                )}
                            </div>
                            <div className="product-card-body">
                                <div className="product-card-brand">{product.brand}</div>
                                <div className="product-card-title">{product.name}</div>
                                <div className="product-card-price">RM {product.basePrice.toLocaleString()}</div>
                                <div className="product-card-stock">
                                    <span className={`badge ${getTotalStock(product.variants) < 10 ? 'badge-warning' : 'badge-success'}`}>
                                        {getTotalStock(product.variants)} in stock
                                    </span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-secondary btn-icon" onClick={() => openEditModal(product)}>
                                            <EditIcon />
                                        </button>
                                        <button className="btn btn-secondary btn-icon" onClick={() => deleteProduct(product.id)} style={{ color: 'var(--danger)' }}>
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

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
                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Product Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-input"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Classic White T-Shirt"
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
                                                placeholder="e.g., Amrin Basics"
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
                                            <label className="form-label">Base Price (RM) *</label>
                                            <input
                                                type="number"
                                                name="basePrice"
                                                className="form-input"
                                                value={formData.basePrice}
                                                onChange={handleInputChange}
                                                placeholder="1200"
                                                required
                                            />
                                        </div>
                                    </div>

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
                                                gridTemplateColumns: '1fr 1fr 100px 120px auto',
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
                                                    required
                                                />
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={variant.price || formData.basePrice}
                                                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                    placeholder="Price"
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
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingProduct ? 'Update Product' : 'Add Product'}
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
