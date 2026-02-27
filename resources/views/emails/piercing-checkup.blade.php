@extends('emails.base')

@section('content')
    <h2 style="color: #0F172A; margin-top: 0;">2-Week Piercing Check-Up</h2>
    <p>Hi {{ $clientName }},</p>
    <p>It's been two weeks since your piercing session. How is everything healing?</p>
    <p>By now, initial swelling should have subsided. It is important to continue your cleaning routine until the piercing is fully mature. If you feel you need a shorter post (downsizing) or have any questions about the healing progress, feel free to stop by the studio!</p>
@endsection
