@extends('emails.base')

@section('content')
    <h2 style="color: #0F172A; margin-top: 0;">How's Your New Tattoo Healing?</h2>
    <p>Hi {{ $clientName }},</p>
    <p>It's been 3 days since your session. Your tattoo should be entering the peeling/itching stage now.</p>
    <p>Remember: <strong>DO NOT SCRATCH OR PICK</strong> at your tattoo. This can cause pigment loss and permanent scarring. Continue keeping it clean and lightly moisturized.</p>
    <p>Is everything looking okay? Reply to this email if you have any concerns.</p>
@endsection
