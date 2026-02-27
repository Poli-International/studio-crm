@extends('emails.base')

@section('content')
    <h2 style="color: #0F172A; margin-top: 0;">One Week Aftercare Reminder</h2>
    <p>Hi {{ $clientName }},</p>
    <p>Your tattoo should be well on its way to healing! Most of the peeling should be complete by now.</p>
    <p>The skin might still look a bit shiny or "milky" — this is normal and is part of the new skin forming over the pigment. Keep applying a fragrance-free lotion once or twice a day.</p>
    <p>Protect your investment: <strong>Avoid direct sunlight and tanning beds</strong> for at least another 2 weeks.</p>
@endsection
