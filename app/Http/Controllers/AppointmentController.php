<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * List appointments.
     */
    public function index(Request $request)
    {
        $query = Appointment::with(['client', 'staff']);

        if ($request->has('staff_id')) {
            $query->where('staff_id', $request->staff_id);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('datetime', [$request->start_date, $request->end_date]);
        }

        return response()->json($query->get());
    }

    /**
     * Create appointment.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'staff_id' => 'required|exists:staff,id',
            'datetime' => 'required|date',
            'service_type' => 'required|in:tattoo,piercing,consultation,touchup,removal',
            'duration_minutes' => 'required|integer',
            'deposit_amount' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ]);

        // Check for conflicts
        $start = Carbon::parse($validated['datetime']);
        $end = $start->copy()->addMinutes($validated['duration_minutes']);

        $conflicts = Appointment::where('staff_id', $validated['staff_id'])
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($start, $end) {
                $q->whereBetween('datetime', [$start, $end])
                  ->orWhereRaw('DATE_ADD(datetime, INTERVAL duration_minutes MINUTE) BETWEEN ? AND ?', [$start, $end]);
            })->exists();

        if ($conflicts) {
            return response()->json(['error' => 'Time slot conflict for this artist'], 409);
        }

        $appointment = Appointment::create($validated);

        // TODO: Send confirmation email via EmailEngine

        return response()->json($appointment, 201);
    }

    /**
     * Get events for FullCalendar.
     */
    public function events(Request $request)
    {
        $start = $request->query('start');
        $end = $request->query('end');

        $appointments = Appointment::with(['client', 'staff'])
            ->whereBetween('datetime', [$start, $end])
            ->where('status', '!=', 'cancelled')
            ->get();

        $events = $appointments->map(function ($apt) {
            return [
                'id' => $apt->id,
                'title' => $apt->client->name . ' - ' . ucfirst($apt->service_type),
                'start' => $apt->datetime->toIso8601String(),
                'end' => Carbon::parse($apt->datetime)->addMinutes($apt->duration_minutes)->toIso8601String(),
                'resourceId' => $apt->staff_id,
                'backgroundColor' => $apt->status === 'confirmed' ? '#3B82F6' : '#F59E0B',
            ];
        });

        return response()->json($events);
    }

    /**
     * Update appointment status.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled,noshow'
        ]);

        $appointment = Appointment::findOrFail($id);
        $appointment->update(['status' => $request->status]);

        return response()->json($appointment);
    }
}
