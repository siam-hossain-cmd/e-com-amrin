// Send Newsletter Email API
import { NextResponse } from 'next/server';
import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';
import nodemailer from 'nodemailer';

// Email template generator
function generateEmailHTML(content, subject, templateStyle) {
    const { headerBg, headerColor, accentColor } = templateStyle;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: ${headerBg}; padding: 30px 40px; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 4px; color: ${headerColor};">
                                AMRIN EXCLUSIVE
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; font-size: 22px; color: #1a1a1a;">
                                ${subject}
                            </h2>
                            <div style="font-size: 16px; line-height: 1.7; color: #444444; white-space: pre-wrap;">
${content}
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 0 40px 40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="background-color: ${accentColor}; border-radius: 4px;">
                                        <a href="https://amrinexclusive.com" style="display: inline-block; padding: 14px 30px; font-size: 14px; font-weight: 600; color: ${headerColor}; text-decoration: none; letter-spacing: 1px;">
                                            SHOP NOW
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9f9f9; padding: 30px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                                <strong>ARS MULTIGROUP SDN BHD (1286095-V)</strong>
                            </p>
                            <p style="margin: 0 0 15px; font-size: 13px; color: #888888;">
                                Unit 5-18, Plaza Prima, Old Jalan Klang Lama<br>
                                Kuala Lumpur 58200, Malaysia<br>
                                Tel: 03-7972 6456
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
                                You received this email because you subscribed to our newsletter.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

export async function POST(request) {
    try {
        const { subject, content, template, templateStyle } = await request.json();

        if (!subject || !content) {
            return NextResponse.json(
                { error: 'Subject and content are required' },
                { status: 400 }
            );
        }

        // Get all active subscribers
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const subscribersCollection = db.collection(COLLECTIONS.SUBSCRIBERS);

        const subscribers = await subscribersCollection
            .find({ status: 'active' })
            .toArray();

        if (subscribers.length === 0) {
            return NextResponse.json(
                { error: 'No active subscribers to send to' },
                { status: 400 }
            );
        }

        // Generate HTML email
        const htmlContent = generateEmailHTML(content, subject, templateStyle);

        // Hostinger SMTP Configuration
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.HOSTINGER_EMAIL_USER,
                pass: process.env.HOSTINGER_EMAIL_PASS
            }
        });

        // Send to all subscribers
        let sentCount = 0;
        const errors = [];

        for (const subscriber of subscribers) {
            try {
                await transporter.sendMail({
                    from: `"AMRIN EXCLUSIVE" <${process.env.HOSTINGER_EMAIL_USER}>`,
                    to: subscriber.email,
                    subject: subject,
                    html: htmlContent
                });
                sentCount++;
            } catch (err) {
                console.error(`Failed to send to ${subscriber.email}:`, err.message);
                errors.push({ email: subscriber.email, error: err.message });
            }
        }

        // Log the campaign
        const campaignsCollection = db.collection('email_campaigns');
        await campaignsCollection.insertOne({
            subject,
            content,
            template,
            sentCount,
            totalRecipients: subscribers.length,
            errors: errors.length > 0 ? errors : null,
            sentAt: new Date()
        });

        return NextResponse.json({
            message: `Email sent successfully to ${sentCount} subscribers!`,
            sentCount,
            totalRecipients: subscribers.length,
            errors: errors.length > 0 ? errors : null
        });
    } catch (error) {
        console.error('Failed to send newsletter:', error);
        return NextResponse.json(
            { error: 'Failed to send newsletter: ' + error.message },
            { status: 500 }
        );
    }
}
