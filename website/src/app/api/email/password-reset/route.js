// API Route: POST /api/email/password-reset
// Send password reset email using noreply@amrinexclusive.com

import { createTransporter, EMAIL_FROM, emailTemplates } from '@/lib/email';

export async function POST(request) {
    try {
        const { email, name, resetLink } = await request.json();

        if (!email || !resetLink) {
            return Response.json({ error: 'Email and resetLink are required' }, { status: 400 });
        }

        const transporter = createTransporter();
        const userName = name || email.split('@')[0];

        const mailOptions = {
            from: EMAIL_FROM.noreply,
            to: email,
            subject: 'Reset Your Password - Amrin',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        ${emailTemplates.header('PASSWORD RESET')}
        
        <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin: 0 0 20px; font-size: 24px;">Hi ${userName},</h2>
            
            <p style="color: #4a4a4a; line-height: 1.6; margin: 0 0 20px;">
                We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            ${emailTemplates.button('Reset Password →', resetLink)}
            
            <div style="background-color: #fff8e1; border-radius: 12px; padding: 20px; margin: 25px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                    ⚠️ This link will expire in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.
                </p>
            </div>
            
            <p style="color: #888; font-size: 13px; margin: 25px 0 0;">
                If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #c4a77d; font-size: 13px; word-break: break-all; margin: 5px 0 0;">
                ${resetLink}
            </p>
        </div>
        
        ${emailTemplates.footer()}
    </div>
</body>
</html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', email);

        return Response.json({ success: true, message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error sending password reset email:', error.message);
        return Response.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
    }
}
