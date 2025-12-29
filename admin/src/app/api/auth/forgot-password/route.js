// API Route: POST /api/auth/forgot-password
// Sends password reset code to admin email

import clientPromise, { DB_NAME } from '@/lib/mongodb';
import nodemailer from 'nodemailer';

// Generate 6-digit code
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
    try {
        const { username } = await request.json();

        if (!username) {
            return Response.json({ error: 'Username is required' }, { status: 400 });
        }

        // Check if user exists (admin email only)
        const validAdminEmails = ['admin@amrinexclusive.com'];

        // Map where to actually SEND the email
        const emailDeliveryMap = {
            'admin@amrinexclusive.com': 's.siamhossain.h@gmail.com'
        };

        const normalizedUsername = username.toLowerCase().trim();

        if (!validAdminEmails.includes(normalizedUsername)) {
            return Response.json({ error: 'Wrong username. User not found.' }, { status: 404 });
        }

        const deliveryEmail = emailDeliveryMap[normalizedUsername] || normalizedUsername;
        const resetCode = generateCode();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Store code in MongoDB
        try {
            const client = await clientPromise;
            const db = client.db(DB_NAME);
            const collection = db.collection('password_resets');

            await collection.deleteMany({ email: normalizedUsername });
            await collection.insertOne({
                email: normalizedUsername,
                code: resetCode,
                expiresAt,
                createdAt: new Date()
            });
        } catch (dbError) {
            console.error('MongoDB error:', dbError);
            // Continue without DB - code still works for single session
        }

        // Send email
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth: {
                user: 'info@amrinexclusive.com',
                pass: '8&tmAZSF^9Gz'
            }
        });

        const mailOptions = {
            from: '"Amrin Exclusive" <noreply@amrinexclusive.com>',
            to: deliveryEmail,
            subject: 'Password Reset Code - Amrin Admin',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="width: 60px; height: 60px; background: #c4a77d; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">A</div>
                        <h2 style="margin: 16px 0 0; color: #1a1a2e;">Password Reset</h2>
                    </div>
                    <p style="color: #4b5563; font-size: 15px;">Your password reset code for <strong>${normalizedUsername}</strong>:</p>
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a1a2e;">${resetCode}</span>
                    </div>
                    <p style="color: #6b7280; font-size: 13px;">This code expires in 15 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return Response.json({
            success: true,
            message: 'Reset code sent to your email',
            // For testing only - remove in production
            _testCode: resetCode
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return Response.json({ error: error.message || 'Failed to send reset code.' }, { status: 500 });
    }
}
