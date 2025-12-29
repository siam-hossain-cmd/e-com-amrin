'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const faqData = [
    {
        category: 'Orders & Payment',
        questions: [
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit/debit cards (Visa, Mastercard, American Express), online banking (FPX), and e-wallets including GrabPay, Touch\'n Go eWallet, and Boost. All payments are processed securely.'
            },
            {
                question: 'Can I modify or cancel my order?',
                answer: 'You can modify or cancel your order within 2 hours of placing it. After that, we begin processing orders and cannot guarantee changes. Please contact us at info@amrinexclussive.com immediately if you need to make changes.'
            },
            {
                question: 'How do I track my order?',
                answer: 'Once your order ships, you\'ll receive an email with a tracking number. You can also track your order by logging into your account and viewing your order history.'
            },
            {
                question: 'Do you offer gift wrapping?',
                answer: 'Yes! You can add gift wrapping for RM 5 during checkout. Your order will be beautifully wrapped with a personalized message card.'
            }
        ]
    },
    {
        category: 'Shipping & Delivery',
        questions: [
            {
                question: 'How long does shipping take?',
                answer: 'Standard shipping within Peninsular Malaysia takes 3-5 business days. Express shipping is available for 1-2 day delivery. For East Malaysia (Sabah & Sarawak), please allow an additional 2-3 days.'
            },
            {
                question: 'Do you ship internationally?',
                answer: 'Yes! We ship to over 50 countries worldwide. International shipping typically takes 7-14 business days depending on the destination. Shipping costs and times vary by location.'
            },
            {
                question: 'Is free shipping available?',
                answer: 'Yes! We offer free standard shipping on orders over RM 80 within Malaysia. Free express shipping is available for orders over RM 150.'
            }
        ]
    },
    {
        category: 'Returns & Exchanges',
        questions: [
            {
                question: 'What is your return policy?',
                answer: 'We accept returns within 14 days of delivery for items in original condition with tags attached. Items must be unworn, unwashed, and in original packaging. Some items like underscarves are final sale for hygiene reasons.'
            },
            {
                question: 'How do I exchange an item?',
                answer: 'Log into your account, go to "My Orders", select the item you wish to exchange, and click "Request Exchange". Choose your preferred size/color and we\'ll send you a prepaid shipping label. The new item ships once we receive your return.'
            },
            {
                question: 'How long do refunds take?',
                answer: 'Refunds are processed within 5-7 business days after we receive your return. The time for the refund to appear in your account depends on your payment method - e-wallets are fastest (1-3 days), while credit cards may take up to 7 days.'
            }
        ]
    },
    {
        category: 'Products & Care',
        questions: [
            {
                question: 'What materials are your hijabs made of?',
                answer: 'We use premium fabrics including cotton voile, chiffon, satin silk, jersey, and modal blends. Each product listing includes detailed fabric information and care instructions.'
            },
            {
                question: 'How do I care for my hijabs?',
                answer: 'Most of our hijabs can be machine washed on a gentle cycle with cold water. We recommend using a laundry bag and avoiding harsh detergents. Iron on low heat or steam for best results. Check individual product labels for specific care instructions.'
            },
            {
                question: 'Are your products Muslimah-friendly?',
                answer: 'Absolutely! AMRIN is designed by and for Muslimahs. All our hijabs provide full coverage and are made with opaque, high-quality fabrics that maintain modesty without compromising on style.'
            },
            {
                question: 'Do you have physical stores?',
                answer: 'We are currently an online-only store, which allows us to offer premium quality at better prices. However, we occasionally participate in pop-up events and bazaars. Follow us on social media to stay updated!'
            }
        ]
    }
];

const ChevronIcon = ({ isOpen }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}
    >
        <polyline points="6,9 12,15 18,9" />
    </svg>
);

export default function FAQPage() {
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <>
            <Navbar />
            <main className="help-page">
                <div className="container">
                    {/* Hero Section */}
                    <div className="help-hero">
                        <h1>Frequently Asked Questions</h1>
                        <p>Find answers to common questions about orders, shipping, and more</p>
                    </div>

                    {/* FAQ Content */}
                    <div className="faq-content">
                        {faqData.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="faq-category">
                                <h2 className="faq-category-title">{category.category}</h2>
                                <div className="faq-list">
                                    {category.questions.map((item, questionIndex) => {
                                        const key = `${categoryIndex}-${questionIndex}`;
                                        const isOpen = openItems[key];

                                        return (
                                            <div
                                                key={questionIndex}
                                                className={`faq-item ${isOpen ? 'open' : ''}`}
                                            >
                                                <button
                                                    className="faq-question"
                                                    onClick={() => toggleItem(categoryIndex, questionIndex)}
                                                >
                                                    <span>{item.question}</span>
                                                    <ChevronIcon isOpen={isOpen} />
                                                </button>
                                                <div className="faq-answer">
                                                    <p>{item.answer}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="help-cta">
                        <h3>Still Have Questions?</h3>
                        <p>Can't find what you're looking for? Our team is here to help!</p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="mailto:info@amrinexclussive.com" className="btn btn-primary">Email Us</a>
                            <a href="https://wa.me/60123456789" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
