// API Route: POST /api/email/welcome
// Send welcome email to new users using Brevo SMTP

import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const { email, name } = await request.json();

        if (!email) {
            return Response.json({ error: 'Email is required' }, { status: 400 });
        }

        // Create transporter - for Brevo, user is your Brevo SMTP login
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false,
            auth: {
                user: '9ec411001@smtp-brevo.com', // Brevo SMTP login
                pass: process.env.BREVO_SMTP_KEY
            }
        });

        const userName = name || email.split('@')[0];

        const mailOptions = {
            from: '"Amrin Exclusive" <reemresort2.0@gmail.com>',
            to: email,
            subject: '🎉 Welcome to Amrin - Your Fashion Journey Begins!',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #c4a77d, #a08460); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 4px;">AMRIN</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px;">EXCLUSIVE</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin: 0 0 20px; font-size: 24px;">Welcome, ${userName}! 🎉</h2>
            
            <p style="color: #4a4a4a; line-height: 1.6; margin: 0 0 20px;">
                Thank you for joining the Amrin family! We're thrilled to have you with us.
            </p>
            
            <p style="color: #4a4a4a; line-height: 1.6; margin: 0 0 30px;">
                Get ready to discover our curated collection of premium hijabs, scarves, and accessories designed for the modern Muslimah.
            </p>
            
            <!-- Benefits -->
            <div style="background-color: #f9f9f9; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #1a1a1a; margin: 0 0 15px; font-size: 16px;">As a member, you'll enjoy:</h3>
                <ul style="color: #4a4a4a; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>Exclusive member-only discounts</li>
                    <li>Early access to new collections</li>
                    <li>Free shipping on orders over RM80</li>
                    <li>Easy 7-day returns</li>
                </ul>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3001/products" 
                   style="display: inline-block; background: linear-gradient(135deg, #c4a77d, #a08460); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                    Start Shopping →
                </a>
            </div>
            
            <p style="color: #4a4a4a; line-height: 1.6; margin: 30px 0 0;">
                If you have any questions, feel free to reply to this email. We're here to help!
            </p>
            
            <p style="color: #4a4a4a; line-height: 1.6; margin: 20px 0 0;">
                With love,<br>
                <strong>The Amrin Team</strong>
            </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
                © 2025 Amrin. All rights reserved.
            </p>
            <p style="color: #666; font-size: 11px; margin: 10px 0 0;">
                You received this email because you created an account on Amrin.
            </p>
        </div>
    </div>
</body>
</html>
            `
        };

        console.log('Sending email to:', email);
        console.log('Using SMTP key:', process.env.BREVO_SMTP_KEY ? 'Key present' : 'KEY MISSING!');

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', email);

        return Response.json({ success: true, message: 'Welcome email sent' });
    } catch (error) {
        console.error('Error sending welcome email:', error.message);
        console.error('Full error:', error);
        return Response.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
    }
}
