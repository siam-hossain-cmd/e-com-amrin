// API Route: POST /api/email/admin-notification
// Send admin notifications using admin@amrinexclusive.com

import { createTransporter, EMAIL_FROM } from '@/lib/email';

export async function POST(request) {
    try {
        const { type, data } = await request.json();

        if (!type) {
            return Response.json({ error: 'Notification type is required' }, { status: 400 });
        }

        const transporter = createTransporter();
        const adminEmail = 'info@amrinexclusive.com'; // Send notifications to main inbox

        // Notification templates
        const notifications = {
            new_order: {
                subject: `New Order Received - #${data?.orderId}`,
                content: `
                    <h2>New Order Received!</h2>
                    <p><strong>Order ID:</strong> #${data?.orderId}</p>
                    <p><strong>Customer:</strong> ${data?.customerName} (${data?.customerEmail})</p>
                    <p><strong>Total:</strong> RM ${data?.total?.toFixed(2)}</p>
                    <p><strong>Items:</strong> ${data?.itemCount} item(s)</p>
                `
            },
            low_stock: {
                subject: `Low Stock Alert - ${data?.productName}`,
                content: `
                    <h2>Low Stock Warning</h2>
                    <p><strong>Product:</strong> ${data?.productName}</p>
                    <p><strong>Current Stock:</strong> ${data?.currentStock} units</p>
                    <p><strong>Threshold:</strong> ${data?.threshold} units</p>
                    <p style="color: #e74c3c;">Please restock soon!</p>
                `
            },
            new_customer: {
                subject: `New Customer Registered - ${data?.customerName}`,
                content: `
                    <h2>New Customer Registration</h2>
                    <p><strong>Name:</strong> ${data?.customerName}</p>
                    <p><strong>Email:</strong> ${data?.customerEmail}</p>
                    <p><strong>Registered:</strong> ${new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}</p>
                `
            },
            contact_form: {
                subject: `New Contact Message - ${data?.subject || 'General Inquiry'}`,
                content: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>From:</strong> ${data?.name} (${data?.email})</p>
                    <p><strong>Subject:</strong> ${data?.subject}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 10px;">
                        ${data?.message}
                    </div>
                `
            }
        };

        const notification = notifications[type];
        if (!notification) {
            return Response.json({ error: 'Invalid notification type' }, { status: 400 });
        }

        const mailOptions = {
            from: EMAIL_FROM.admin,
            to: adminEmail,
            subject: notification.subject,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="background: #1a1a1a; padding: 20px; text-align: center;">
            <h1 style="color: #c4a77d; margin: 0; font-size: 20px;">AMRIN ADMIN</h1>
        </div>
        <div style="padding: 30px;">
            ${notification.content}
        </div>
        <div style="background: #f9f9f9; padding: 15px; text-align: center;">
            <p style="margin: 0; color: #888; font-size: 12px;">
                This is an automated notification from Amrin Admin System
            </p>
        </div>
    </div>
</body>
</html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Admin notification sent:', type);

        return Response.json({ success: true, message: 'Admin notification sent' });
    } catch (error) {
        console.error('Error sending admin notification:', error.message);
        return Response.json({ error: 'Failed to send notification', details: error.message }, { status: 500 });
    }
}
