/**
 * Email Service using Resend API
 * Resend is free for up to 100 emails/day, 3000 emails/month
 * Sign up at: https://resend.com
 */

export interface EmailConfig {
  apiKey: string;
  fromEmail: string;
  fromName?: string;
}

export async function sendResetCodeEmail(
  config: EmailConfig,
  toEmail: string,
  resetCode: string,
  displayName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: config.fromName 
          ? `${config.fromName} <${config.fromEmail}>` 
          : config.fromEmail,
        to: toEmail,
        subject: '🔐 Mã Xác Thực Reset Mật Khẩu - AI Học Tập',
        html: generateResetEmailHTML(resetCode, displayName || toEmail)
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Email send error:', result);
      return { success: false, error: result.message || 'Failed to send email' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
}

function generateResetEmailHTML(resetCode: string, recipientName: string): string {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Mật Khẩu</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                🔐 Reset Mật Khẩu
              </h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                AI Học Tập - Công Nghệ Lớp 6-12
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Xin chào <strong style="color: #667eea;">${recipientName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; color: #6b7280; font-size: 15px; line-height: 1.6;">
                Bạn đã yêu cầu reset mật khẩu cho tài khoản của mình. Vui lòng sử dụng mã xác thực bên dưới để hoàn tất quá trình:
              </p>

              <!-- Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border: 2px dashed #667eea; border-radius: 12px; padding: 30px; text-align: center;">
                    <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                      Mã Xác Thực
                    </p>
                    <p style="margin: 0; color: #667eea; font-size: 42px; font-weight: 800; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${resetCode}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Warning Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 25px;">
                <tr>
                  <td style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 16px 20px;">
                    <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.5;">
                      ⏰ <strong>Lưu ý:</strong> Mã này có hiệu lực trong <strong>15 phút</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 15px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Nếu bạn <strong>không yêu cầu</strong> reset mật khẩu, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.
              </p>

              <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                💡 <em>Để bảo mật tài khoản, không chia sẻ mã này với bất kỳ ai.</em>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px;">
                Trân trọng,<br>
                <strong style="color: #667eea;">Đội ngũ AI Học Tập</strong>
              </p>
              <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px;">
                © 2025 Long Nguyễn 204 | Powered by Gemini 2.0 Flash
              </p>
            </td>
          </tr>

        </table>

        <!-- Footer note -->
        <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px; text-align: center; max-width: 600px;">
          Email này được gửi tự động. Vui lòng không trả lời email này.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Alternative: Send email using Gmail API (more complex, requires OAuth)
 * For production with high volume, consider:
 * - SendGrid: https://sendgrid.com
 * - Mailgun: https://mailgun.com
 * - AWS SES: https://aws.amazon.com/ses/
 */
