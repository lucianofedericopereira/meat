<?php

namespace Luciano\MeatLaravel\Blade;

use Illuminate\Support\Facades\Blade;

class MeatDirectives
{
    public static function register()
    {
        Blade::directive('meatSyncEvent', function ($expression) {
            // Parse the expression: expected format `'message', SomeClass::class`
            [$key, $eventClass] = explode(',', $expression, 2);

            // Trim any whitespace
            $key = trim($key);
            $eventClass = trim($eventClass);

            return "<?php echo view('macros.syncEvent', [
                'key' => {$key},
                'eventClass' => {$eventClass},
            ])->render(); ?>";
        });
    }
}
