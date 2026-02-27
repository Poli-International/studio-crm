@extends('emails.base')

@section('content')
    <h2 style="color: #0F172A; margin-top: 0;">Piercing Care Instructions</h2>
    <p>Hi {{ $clientName }},</p>
    <p>Thank you for choosing us for your new piercing! Proper aftercare is essential for a healthy healing process.</p>
    <ul style="padding-left: 20px;">
        <li>Clean twice a day with sterile saline solution.</li>
        <li><strong>DO NOT</strong> use alcohol, peroxide, or harsh soaps.</li>
        <li>Avoid moving, twisting, or rotating the jewelry.</li>
        <li>Do not sleep on the new piercing.</li>
    </ul>
    <p>If you experience extreme swelling, redness, or heat, please contact us immediately.</p>
@endsection
