// API Route: POST /api/email/order-confirmation
// Send order confirmation email using support@amrinexclusive.com

import { createTransporter, EMAIL_FROM, emailTemplates } from '@/lib/email';

export async function POST(request) {
    try {
        const { email, name, orderId, orderItems, total, shippingAddress } = await request.json();

        if (!email || !orderId) {
            return Response.json({ error: 'Email and orderId are required' }, { status: 400 });
        }

        const transporter = createTransporter();
        const userName = name || email.split('@')[0];

        // Format order items
        const itemsHtml = orderItems?.map(item => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <strong>${item.name}</strong>
                    ${item.variant ? `<br><span style="color: #888; font-size: 13px;">${item.variant}</span>` : ''}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">RM ${item.price?.toFixed(2)}</td>
            </tr>
        `).join('') || '';

        const mailOptions = {
            from: EMAIL_FROM.support,
            to: email,
            subject: `Order Confirmed - #${orderId}`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        ${emailTemplates.header('ORDER CONFIRMATION')}
        
        <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin: 0 0 20px; font-size: 24px;">Thank you, ${userName}! 🎉</h2>
            
            <p style="color: #4a4a4a; line-height: 1.6; margin: 0 0 20px;">
                Your order has been confirmed and is being processed.
            </p>
            
            <div style="background-color: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <p style="margin: 0; color: #888; font-size: 13px;">Order Number</p>
                <p style="margin: 5px 0 0; color: #1a1a1a; font-size: 20px; font-weight: 600;">#${orderId}</p>
            </div>
            
            ${orderItems?.length > 0 ? `
            <h3 style="color: #1a1a1a; margin: 25px 0 15px; font-size: 16px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f9f9f9;">
                        <th style="padding: 12px; text-align: left; font-size: 13px; color: #888;">Item</th>
                        <th style="padding: 12px; text-align: center; font-size: 13px; color: #888;">Qty</th>
                        <th style="padding: 12px; text-align: right; font-size: 13px; color: #888;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" style="padding: 15px 12px; text-align: right; font-weight: 600;">Total:</td>
                        <td style="padding: 15px 12px; text-align: right; font-weight: 600; font-size: 18px; color: #c4a77d;">RM ${total?.toFixed(2) || '0.00'}</td>
                    </tr>
                </tfoot>
            </table>
            ` : ''}
            
            ${shippingAddress ? `
            <h3 style="color: #1a1a1a; margin: 25px 0 15px; font-size: 16px;">Shipping Address</h3>
            <div style="background-color: #f9f9f9; border-radius: 12px; padding: 20px;">
                <p style="margin: 0; color: #4a4a4a; line-height: 1.6;">
                    ${shippingAddress.name || ''}<br>
                    ${shippingAddress.address || ''}<br>
                    ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.postcode || ''}<br>
                    ${shippingAddress.phone || ''}
                </p>
            </div>
            ` : ''}
            
            <p style="color: #4a4a4a; line-height: 1.6; margin: 30px 0 0;">
                We'll send you another email when your order ships. If you have any questions, just reply to this email!
            </p>
        </div>
        
        ${emailTemplates.footer()}
    </div>
</body>
</html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent to:', email);

        return Response.json({ success: true, message: 'Order confirmation email sent' });
    } catch (error) {
        console.error('Error sending order confirmation email:', error.message);
        return Response.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
    }
}
