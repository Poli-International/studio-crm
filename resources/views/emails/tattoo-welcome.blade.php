@extends('emails.base')

@section('content')
    <h2 style="color: #0F172A; margin-top: 0;">Welcome & Aftercare Instructions</h2>
    <p>Hi {{ $clientName }},</p>
    <p>Thank you for your trust today! We hope you love your new <strong>{{ $serviceType }}</strong> by {{ $artistName }}.</p>
    <p>The first 48 hours are critical for your tattoo's health. Please follow the instructions below carefully:</p>
    <ul style="padding-left: 20px;">
        <li>Keep the bandage on for at least 2-4 hours.</li>
        <li>Wash gently with fragrance-free antibacterial soap.</li>
        <li>Pat dry with a clean paper towel.</li>
        <li>Apply a very thin layer of recommended aftercare balm.</li>
    </ul>
    <p>If you have any questions, feel free to contact us.</p>
    <a href="{{ config('app.url') }}" class="btn">Visit Studio Portal</a>
@endsection
