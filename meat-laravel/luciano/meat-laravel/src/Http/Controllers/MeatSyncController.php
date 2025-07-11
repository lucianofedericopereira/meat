<?php

namespace Luciano\MeatLaravel\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Event;

class MeatSyncController extends Controller
{
    public function __invoke(Request $request)
    {
        $tx = $request->all();

        // 🚨 Basic Validation
        if (!isset($tx['tx_id'], $tx['timestamp'], $tx['data'])) {
            return response()->json(['error' => 'Invalid MEAT payload'], 422);
        }

        // 🔐 Hash was already verified in middleware, so we trust $tx['data']

        // 🎯 Optionally detect event name via header
        $eventName = $request->header('X-Meat-Event');

        if ($eventName && class_exists($eventName)) {
            Event::dispatch(new $eventName($tx['tx_id'], $tx['data']));
        }

        // 💾 Optional: Log to cache or queue for further processing
        cache()->put("meat:tx:{$tx['tx_id']}", $tx['data'], now()->addMinutes(5));

        return response()->json([
            'status' => 'committed',
            'tx_id' => $tx['tx_id']
        ]);
    }
}
