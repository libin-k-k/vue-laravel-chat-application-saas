<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3f4f6;padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;width:100%;">
                    <tr>
                        <td align="center" style="padding-bottom:24px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="background-color:#12b543;border-radius:12px;padding:10px 14px;">
                                        <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">{{ config('app.name') }}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td height="4" style="background:linear-gradient(90deg,#0f9a39 0%,#12b543 50%,#3fcc6f 100%);font-size:0;line-height:0;">&nbsp;</td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="padding:36px 32px 28px;">
                                        <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;line-height:1.3;letter-spacing:-0.3px;">
                                            Reset your password
                                        </h1>
                                        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4b5563;">
                                            Hi {{ $user->name }}, we received a request to reset the password for your {{ config('app.name') }} account. Tap the button below to choose a new password.
                                        </p>

                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td align="center" style="padding:4px 0 28px;">
                                                    <a href="{{ $resetUrl }}"
                                                       target="_blank"
                                                       style="display:inline-block;background-color:#12b543;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:10px;line-height:1.2;">
                                                        Reset password
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#e8f9ed;border-radius:10px;border:1px solid #c5f0d3;">
                                            <tr>
                                                <td style="padding:14px 16px;">
                                                    <p style="margin:0;font-size:13px;line-height:1.5;color:#0c7d2f;">
                                                        <strong style="color:#096025;">⏱ Link expires in {{ $expireMinutes }} minutes.</strong>
                                                        If you did not request a password reset, you can safely ignore this email.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>

                                        <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#9ca3af;">
                                            If the button doesn't work, copy and paste this URL into your browser:
                                        </p>
                                        <p style="margin:8px 0 0;font-size:12px;line-height:1.5;word-break:break-all;">
                                            <a href="{{ $resetUrl }}" style="color:#12b543;text-decoration:underline;">{{ $resetUrl }}</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding:24px 16px 0;">
                            <p style="margin:0 0 6px;font-size:12px;line-height:1.5;color:#9ca3af;">
                                You received this email because a password reset was requested for this address on {{ config('app.name') }}.
                            </p>
                            <p style="margin:0;font-size:12px;color:#9ca3af;">
                                &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
