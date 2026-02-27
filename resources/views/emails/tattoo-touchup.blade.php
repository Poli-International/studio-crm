@extends('emails.base')

@section('content')
    <h2 style="color: #0F172A; margin-top: 0;">Time for a Touch-Up?</h2>
    <p>Hi {{ $clientName }},</p>
    <p>It's been 6 months since your session with us. Now that your tattoo is fully matured, it's the perfect time to see if any areas need a minor touch-up to ensure it stays looking perfect for years to come.</p>
    <p>If you notice any light spots or uneven lines, reply to this email to schedule a quick touch-up session.</p>
    <a href="{{ config('app.url') }}" class="btn">Book Now</a>
@endsection
