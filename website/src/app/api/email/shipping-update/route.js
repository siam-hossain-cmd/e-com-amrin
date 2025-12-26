// API Route: POST /api/email/shipping-update
// Send shipping update email using noreply@amrinexclusive.com

import { createTransporter, EMAIL_FROM, emailTemplates } from '@/lib/email';

export async function POST(request) {
    try {
        const { email, name, orderId, status, trackingNumber, trackingUrl, estimatedDelivery } = await request.json();

        if (!email || !orderId || !status) {
            return Response.json({ error: 'Email, orderId, and status are required' }, { status: 400 });
        }

        const transporter = createTransporter();
        const userName = name || email.split('@')[0];

        // Status-specific content
        const statusContent = {
            processing: {
                title: 'Order Processing',
                message: 'Your order is being prepared for shipment.',
                color: '#2196F3'
            },
            shipped: {
                title: 'Order Shipped',
                message: 'Your order is on its way to you.',
                color: '#4CAF50'
            },
            out_for_delivery: {
                title: 'Out for Delivery',
                message: 'Your order will arrive today!',
                color: '#FF9800'
            },
            delivered: {
                title: 'Delivered',
                message: 'Your order has been delivered. Enjoy your purchase!',
                color: '#4CAF50'
            }
        };

        const currentStatus = statusContent[status] || statusContent.processing;

        const mailOptions = {
            from: EMAIL_FROM.noreply,
            to: email,
            subject: `${currentStatus.title} - Order #${orderId}`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        ${emailTemplates.header('SHIPPING UPDATE')}
        
        <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin: 0 0 20px; font-size: 24px;">Hi ${userName},</h2>
            
            <div style="background-color: ${currentStatus.color}15; border-left: 4px solid ${currentStatus.color}; padding: 20px; margin-bottom: 25px; border-radius: 0 12px 12px 0;">
                <h3 style="margin: 0 0 5px; color: ${currentStatus.color}; font-size: 18px;">${currentStatus.title}</h3>
                <p style="margin: 0; color: #4a4a4a;">${currentStatus.message}</p>
            </div>
            
            <div style="background-color: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <p style="margin: 0; color: #888; font-size: 13px;">Order Number</p>
                <p style="margin: 5px 0 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">#${orderId}</p>
            </div>
            
            ${trackingNumber ? `
            <div style="background-color: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <p style="margin: 0; color: #888; font-size: 13px;">Tracking Number</p>
                <p style="margin: 5px 0 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">${trackingNumber}</p>
            </div>
            ` : ''}
            
            ${estimatedDelivery ? `
            <div style="background-color: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <p style="margin: 0; color: #888; font-size: 13px;">Estimated Delivery</p>
                <p style="margin: 5px 0 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">${estimatedDelivery}</p>
            </div>
            ` : ''}
            
            ${trackingUrl ? emailTemplates.button('Track Your Order →', trackingUrl) : ''}
            
            <p style="color: #4a4a4a; line-height: 1.6; margin: 30px 0 0;">
                If you have any questions about your delivery, please contact us at <a href="mailto:support@amrinexclusive.com" style="color: #c4a77d;">support@amrinexclusive.com</a>
            </p>
        </div>
        
        ${emailTemplates.footer()}
    </div>
</body>
</html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Shipping update email sent to:', email);

        return Response.json({ success: true, message: 'Shipping update email sent' });
    } catch (error) {
        console.error('Error sending shipping update email:', error.message);
        return Response.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
    }
}
