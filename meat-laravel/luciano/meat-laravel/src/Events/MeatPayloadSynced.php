<?php

namespace Luciano\MeatLaravel\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MeatPayloadSynced
{
    use Dispatchable, SerializesModels;

    public string $tx_id;
    public array $data;

    /**
     * Create a new event instance.
     *
     * @param string $tx_id
     * @param array $data
     */
    public function __construct(string $tx_id, array $data)
    {
        $this->tx_id = $tx_id;
        $this->data = $data;
    }
}
