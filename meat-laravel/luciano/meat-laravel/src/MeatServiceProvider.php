<?php

namespace Luciano\MeatLaravel;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Luciano\MeatLaravel\Http\Controllers\MeatSyncController;
use Luciano\MeatLaravel\Middleware\VerifyMeatTransaction;

class MeatServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'meat-laravel');

        Blade::directive('meatHydrate', function ($expression) {
            return "<?php echo view('meat-laravel::macros.hydrate', ['state' => $expression]); ?>";
        });

        Blade::directive('meatSync', function ($expression) {
            return "<?php echo view('meat-laravel::macros.sync', ['key' => $expression]); ?>";
        });

Blade::directive('meatSyncEvent', function ($expression) {
    [$key, $eventClass] = explode(',', $expression, 2);
    $key = trim($key);
    $eventClass = trim($eventClass);

    return "<?php echo view('meat-laravel::macros.syncEvent', [
        'key' => {$key},
        'eventClass' => {$eventClass},
    ])->render(); ?>";
});

        Blade::directive('meatScripts', function () {
            return '<script src="/vendor/meat/js/meat-laravel-bridge.js"></script>';
        });

        Route::middleware(['web', VerifyMeatTransaction::class])
            ->post('/meat-sync', MeatSyncController::class)
            ->name('meat.sync');

        $this->publishes([
            __DIR__.'/../public/vendor/meat/js/meat.js' => public_path('vendor/meat/js/meat.js'),
        ], 'meat-assets');
    }

    public function register()
    {
        // You can bind services or config here later
    }
}
