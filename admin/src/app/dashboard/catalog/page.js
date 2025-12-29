'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';

// Icons
const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const FabricIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16v16H4z" />
        <path d="M4 9h16M4 14h16M9 4v16M14 4v16" strokeOpacity="0.3" />
    </svg>
);

const CategoryIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
);

const ColorIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3" />
    </svg>
);

const LoadingSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
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

export default function CatalogPage() {
    const [activeTab, setActiveTab] = useState('fabrics');
    const [fabrics, setFabrics] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Category specific states
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newSubcategory, setNewSubcategory] = useState('');

    // Fetch catalog data from API
    useEffect(() => {
        fetchCatalog();
    }, []);

    const fetchCatalog = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/catalog');
            if (res.ok) {
                const data = await res.json();
                setFabrics(data.fabrics || []);
                setCategories(data.categories || []);
                setColors(data.colors || []);
                setSizes(data.sizes || []);
            }
        } catch (error) {
            console.error('Failed to fetch catalog:', error);
        } finally {
            setLoading(false);
        }
    };

    // Save to API
    const saveCatalog = async (updates) => {
        try {
            setSaving(true);
            const res = await fetch('/api/catalog', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (!res.ok) throw new Error('Failed to save');
            return true;
        } catch (error) {
            console.error('Failed to save catalog:', error);
            alert('Failed to save changes. Please try again.');
            return false;
        } finally {
            setSaving(false);
        }
    };

    // Add item handlers
    const handleAddFabric = async () => {
        if (newItem.trim() && !fabrics.includes(newItem.trim())) {
            const newFabrics = [...fabrics, newItem.trim()];
            if (await saveCatalog({ fabrics: newFabrics })) {
                setFabrics(newFabrics);
                setNewItem('');
            }
        }
    };

    const handleAddColor = async () => {
        if (newItem.trim() && !colors.includes(newItem.trim())) {
            const newColors = [...colors, newItem.trim()];
            if (await saveCatalog({ colors: newColors })) {
                setColors(newColors);
                setNewItem('');
            }
        }
    };

    const handleAddSize = async () => {
        if (newItem.trim() && !sizes.includes(newItem.trim())) {
            const newSizes = [...sizes, newItem.trim()];
            if (await saveCatalog({ sizes: newSizes })) {
                setSizes(newSizes);
                setNewItem('');
            }
        }
    };

    const handleAddCategory = async () => {
        if (newCategoryName.trim()) {
            const newCat = {
                id: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-'),
                name: newCategoryName.trim(),
                slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-'),
                showInNav: true,
                order: categories.length + 1,
                subcategories: []
            };
            if (!categories.find(c => c.id === newCat.id)) {
                const newCategories = [...categories, newCat];
                if (await saveCatalog({ categories: newCategories })) {
                    setCategories(newCategories);
                    setNewCategoryName('');
                }
            }
        }
    };

    const handleAddSubcategory = async (categoryId) => {
        if (newSubcategory.trim()) {
            const updatedCategories = categories.map(cat => {
                if (cat.id === categoryId && !cat.subcategories.includes(newSubcategory.trim())) {
                    return { ...cat, subcategories: [...cat.subcategories, newSubcategory.trim()] };
                }
                return cat;
            });
            if (await saveCatalog({ categories: updatedCategories })) {
                setCategories(updatedCategories);
                setNewSubcategory('');
            }
        }
    };

    // Delete handlers
    const handleDeleteFabric = async (fabric) => {
        if (confirm(`Delete "${fabric}" fabric?`)) {
            const newFabrics = fabrics.filter(f => f !== fabric);
            if (await saveCatalog({ fabrics: newFabrics })) {
                setFabrics(newFabrics);
            }
        }
    };

    const handleDeleteColor = async (color) => {
        if (confirm(`Delete "${color}" color?`)) {
            const newColors = colors.filter(c => c !== color);
            if (await saveCatalog({ colors: newColors })) {
                setColors(newColors);
            }
        }
    };

    const handleDeleteSize = async (size) => {
        if (confirm(`Delete "${size}" size?`)) {
            const newSizes = sizes.filter(s => s !== size);
            if (await saveCatalog({ sizes: newSizes })) {
                setSizes(newSizes);
            }
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        const cat = categories.find(c => c.id === categoryId);
        if (confirm(`Delete "${cat.name}" category and all its subcategories?`)) {
            const newCategories = categories.filter(c => c.id !== categoryId);
            if (await saveCatalog({ categories: newCategories })) {
                setCategories(newCategories);
                if (selectedCategory === categoryId) setSelectedCategory(null);
            }
        }
    };

    const handleDeleteSubcategory = async (categoryId, subcategory) => {
        if (confirm(`Delete "${subcategory}" subcategory?`)) {
            const updatedCategories = categories.map(cat => {
                if (cat.id === categoryId) {
                    return { ...cat, subcategories: cat.subcategories.filter(s => s !== subcategory) };
                }
                return cat;
            });
            if (await saveCatalog({ categories: updatedCategories })) {
                setCategories(updatedCategories);
            }
        }
    };

    // Toggle show in navigation
    const handleToggleShowInNav = async (categoryId) => {
        const updatedCategories = categories.map(cat => {
            if (cat.id === categoryId) {
                return { ...cat, showInNav: !cat.showInNav };
            }
            return cat;
        });
        if (await saveCatalog({ categories: updatedCategories })) {
            setCategories(updatedCategories);
        }
    };

    // Edit handlers
    const startEditing = (item, type) => {
        setEditingItem({ item, type });
        setEditValue(item);
    };

    const handleEdit = async () => {
        if (!editValue.trim() || !editingItem) return;

        const { item, type } = editingItem;
        let success = false;

        switch (type) {
            case 'fabric':
                const newFabrics = fabrics.map(f => f === item ? editValue.trim() : f);
                success = await saveCatalog({ fabrics: newFabrics });
                if (success) setFabrics(newFabrics);
                break;
            case 'color':
                const newColors = colors.map(c => c === item ? editValue.trim() : c);
                success = await saveCatalog({ colors: newColors });
                if (success) setColors(newColors);
                break;
            case 'size':
                const newSizes = sizes.map(s => s === item ? editValue.trim() : s);
                success = await saveCatalog({ sizes: newSizes });
                if (success) setSizes(newSizes);
                break;
        }

        if (success) {
            setEditingItem(null);
            setEditValue('');
        }
    };

    // Reset to defaults
    const handleReset = async () => {
        if (confirm('Reset all catalog data to defaults? This cannot be undone.')) {
            try {
                setSaving(true);
                const res = await fetch('/api/catalog', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'reset' })
                });
                if (res.ok) {
                    const data = await res.json();
                    setFabrics(data.fabrics);
                    setCategories(data.categories);
                    setColors(data.colors);
                    setSizes(data.sizes);
                }
            } catch (error) {
                console.error('Failed to reset catalog:', error);
                alert('Failed to reset. Please try again.');
            } finally {
                setSaving(false);
            }
        }
    };

    const tabs = [
        { id: 'fabrics', label: 'Fabrics', icon: <FabricIcon />, count: fabrics.length },
        { id: 'categories', label: 'Categories', icon: <CategoryIcon />, count: categories.length },
        { id: 'colors', label: 'Colors', icon: <ColorIcon />, count: colors.length },
        { id: 'sizes', label: 'Sizes', icon: <CategoryIcon />, count: sizes.length }
    ];

    if (loading) {
        return (
            <>
                <Header
                    title="Catalog Management"
                    subtitle="Manage fabrics, categories, colors and sizes"
                />
                <div className="page-content">
                    <LoadingSpinner />
                </div>
            </>
        );
    }

    return (
        <>
            <Header
                title="Catalog Management"
                subtitle="Manage fabrics, categories, colors and sizes"
            />

            <div className="page-content">
                {/* Saving indicator */}
                {saving && (
                    <div style={{
                        position: 'fixed',
                        top: '80px',
                        right: '24px',
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: 'white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        Saving...
                    </div>
                )}

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '24px',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '16px',
                    flexWrap: 'wrap'
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                border: 'none',
                                borderRadius: '8px',
                                background: activeTab === tab.id ? 'var(--primary)' : 'var(--bg-secondary)',
                                color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                            <span style={{
                                background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-main)',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '12px'
                            }}>
                                {tab.count}
                            </span>
                        </button>
                    ))}

                    <button
                        onClick={handleReset}
                        disabled={saving}
                        style={{
                            marginLeft: 'auto',
                            padding: '12px 20px',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            background: 'white',
                            color: 'var(--danger)',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            opacity: saving ? 0.6 : 1
                        }}
                    >
                        Reset to Defaults
                    </button>
                </div>

                {/* Fabrics Tab */}
                {activeTab === 'fabrics' && (
                    <div className="card">
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="card-title">Fabric Types</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Add new fabric..."
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddFabric()}
                                    style={{ width: '200px' }}
                                    disabled={saving}
                                />
                                <button className="btn btn-primary" onClick={handleAddFabric} disabled={saving}>
                                    <PlusIcon /> Add
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {fabrics.map(fabric => (
                                    <div
                                        key={fabric}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px 16px',
                                            background: 'var(--bg-secondary)',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <span>{fabric}</span>
                                        <button
                                            onClick={() => startEditing(fabric, 'fabric')}
                                            disabled={saving}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: saving ? 'not-allowed' : 'pointer',
                                                color: 'var(--text-secondary)',
                                                padding: '4px'
                                            }}
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFabric(fabric)}
                                            disabled={saving}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: saving ? 'not-allowed' : 'pointer',
                                                color: 'var(--danger)',
                                                padding: '4px'
                                            }}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        {/* Categories List */}
                        <div className="card">
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 className="card-title">Categories</h3>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="New category..."
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                                        style={{ width: '150px' }}
                                        disabled={saving}
                                    />
                                    <button className="btn btn-primary" onClick={handleAddCategory} disabled={saving}>
                                        <PlusIcon />
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {categories.map(category => (
                                        <div
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '12px 16px',
                                                background: selectedCategory === category.id ? 'var(--primary)' : 'var(--bg-secondary)',
                                                color: selectedCategory === category.id ? 'white' : 'var(--text-primary)',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontWeight: '500' }}>{category.name}</span>
                                                    {category.showInNav !== false && (
                                                        <span style={{
                                                            fontSize: '10px',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            background: selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : 'var(--success)',
                                                            color: selectedCategory === category.id ? 'white' : 'white'
                                                        }}>NAV</span>
                                                    )}
                                                </div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    opacity: 0.7,
                                                    marginTop: '2px'
                                                }}>
                                                    {category.subcategories?.length || 0} subcategories
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {/* Show in Nav Toggle */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleShowInNav(category.id);
                                                    }}
                                                    disabled={saving}
                                                    title={category.showInNav !== false ? 'Hide from navigation' : 'Show in navigation'}
                                                    style={{
                                                        background: category.showInNav !== false ? 'var(--success)' : 'var(--bg-main)',
                                                        border: '1px solid ' + (category.showInNav !== false ? 'var(--success)' : 'var(--border)'),
                                                        borderRadius: '12px',
                                                        width: '40px',
                                                        height: '22px',
                                                        cursor: saving ? 'not-allowed' : 'pointer',
                                                        position: 'relative',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: '2px',
                                                        left: category.showInNav !== false ? '20px' : '2px',
                                                        width: '16px',
                                                        height: '16px',
                                                        background: 'white',
                                                        borderRadius: '50%',
                                                        transition: 'all 0.2s',
                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                                    }} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteCategory(category.id);
                                                    }}
                                                    disabled={saving}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: saving ? 'not-allowed' : 'pointer',
                                                        color: selectedCategory === category.id ? 'white' : 'var(--danger)',
                                                        padding: '4px'
                                                    }}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Subcategories */}
                        <div className="card">
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 className="card-title">
                                    {selectedCategory
                                        ? `${categories.find(c => c.id === selectedCategory)?.name} Subcategories`
                                        : 'Select a Category'
                                    }
                                </h3>
                                {selectedCategory && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="New subcategory..."
                                            value={newSubcategory}
                                            onChange={(e) => setNewSubcategory(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddSubcategory(selectedCategory)}
                                            style={{ width: '150px' }}
                                            disabled={saving}
                                        />
                                        <button className="btn btn-primary" onClick={() => handleAddSubcategory(selectedCategory)} disabled={saving}>
                                            <PlusIcon />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="card-body">
                                {selectedCategory ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        {categories.find(c => c.id === selectedCategory)?.subcategories.map(sub => (
                                            <div
                                                key={sub}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '10px 16px',
                                                    background: 'var(--bg-secondary)',
                                                    borderRadius: '8px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <span>{sub}</span>
                                                <button
                                                    onClick={() => handleDeleteSubcategory(selectedCategory, sub)}
                                                    disabled={saving}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: saving ? 'not-allowed' : 'pointer',
                                                        color: 'var(--danger)',
                                                        padding: '4px'
                                                    }}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        ))}
                                        {categories.find(c => c.id === selectedCategory)?.subcategories.length === 0 && (
                                            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                                No subcategories yet. Add one above.
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                        Click on a category to manage its subcategories
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Colors Tab */}
                {activeTab === 'colors' && (
                    <div className="card">
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="card-title">Color Options</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Add new color..."
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddColor()}
                                    style={{ width: '200px' }}
                                    disabled={saving}
                                />
                                <button className="btn btn-primary" onClick={handleAddColor} disabled={saving}>
                                    <PlusIcon /> Add
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {colors.map(color => (
                                    <div
                                        key={color}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px 16px',
                                            background: 'var(--bg-secondary)',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <span>{color}</span>
                                        <button
                                            onClick={() => startEditing(color, 'color')}
                                            disabled={saving}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: saving ? 'not-allowed' : 'pointer',
                                                color: 'var(--text-secondary)',
                                                padding: '4px'
                                            }}
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteColor(color)}
                                            disabled={saving}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: saving ? 'not-allowed' : 'pointer',
                                                color: 'var(--danger)',
                                                padding: '4px'
                                            }}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Sizes Tab */}
                {activeTab === 'sizes' && (
                    <div className="card">
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="card-title">Size Options</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Add new size..."
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddSize()}
                                    style={{ width: '200px' }}
                                    disabled={saving}
                                />
                                <button className="btn btn-primary" onClick={handleAddSize} disabled={saving}>
                                    <PlusIcon /> Add
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {sizes.map(size => (
                                    <div
                                        key={size}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px 16px',
                                            background: 'var(--bg-secondary)',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <span>{size}</span>
                                        <button
                                            onClick={() => startEditing(size, 'size')}
                                            disabled={saving}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: saving ? 'not-allowed' : 'pointer',
                                                color: 'var(--text-secondary)',
                                                padding: '4px'
                                            }}
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSize(size)}
                                            disabled={saving}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: saving ? 'not-allowed' : 'pointer',
                                                color: 'var(--danger)',
                                                padding: '4px'
                                            }}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {editingItem && (
                    <div className="modal-overlay" onClick={() => setEditingItem(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                            <div className="modal-header">
                                <h3 className="modal-title">Edit {editingItem.type}</h3>
                                <button className="modal-close" onClick={() => setEditingItem(null)}>×</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
                                        autoFocus
                                        disabled={saving}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setEditingItem(null)} disabled={saving}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleEdit} disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
