// Email configuration and transporter for Hostinger Business Email
import nodemailer from 'nodemailer';

// Email addresses for different purposes
export const EMAIL_FROM = {
    info: '"Amrin Exclusive" <info@amrinexclusive.com>',
    support: '"Amrin Support" <support@amrinexclusive.com>',
    admin: '"Amrin Admin" <admin@amrinexclusive.com>',
    noreply: '"Amrin Exclusive" <noreply@amrinexclusive.com>',
};

// Create reusable transporter
export function createTransporter() {
    return nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.HOSTINGER_EMAIL_USER,
            pass: process.env.HOSTINGER_EMAIL_PASS
        }
    });
}

// Email templates
export const emailTemplates = {
    // Header template
    header: (title) => `
        <div style="background: linear-gradient(135deg, #c4a77d, #a08460); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 4px;">AMRIN</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px;">${title}</p>
        </div>
    `,

    // Footer template
    footer: () => `
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
                © 2025 Amrin Exclusive. All rights reserved.
            </p>
            <p style="color: #666; font-size: 11px; margin: 10px 0 0;">
                Kuala Lumpur, Malaysia
            </p>
        </div>
    `,

    // Button template
    button: (text, url) => `
        <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" 
               style="display: inline-block; background: linear-gradient(135deg, #c4a77d, #a08460); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                ${text}
            </a>
        </div>
    `
};
