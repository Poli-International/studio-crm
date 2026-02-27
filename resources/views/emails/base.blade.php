<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0F172A; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { color: #3B82F6; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
        .content { background: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-top: none; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #94A3B8; }
        .btn { display: inline-block; padding: 12px 24px; background: #3B82F6; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>STUDIO CRM</h1>
        </div>
        <div class="content">
            @yield('content')
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Poli International Ltd. All rights reserved.</p>
            <p>You received this because you are a valued client of our studio.</p>
        </div>
    </div>
</body>
</html>
