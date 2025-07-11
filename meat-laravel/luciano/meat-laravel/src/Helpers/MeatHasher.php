<?php

namespace Luciano\MeatLaravel\Helpers;

class MeatHasher
{
    /**
     * Generate HMAC-SHA256 hash for a given payload using MEAT_SECRET.
     *
     * @param array $payload
     * @return string
     */
    public static function hash(array $payload): string
    {
        $key = env('MEAT_SECRET', 'default_meat_secret');

        // JSON encode with stable formatting
        $json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG);

        return hash_hmac('sha256', $json, $key);
    }

    /**
     * Verify hash against a given payload.
     *
     * @param array $payload
     * @param string $clientHash
     * @return bool
     */
    public static function verify(array $payload, string $clientHash): bool
    {
        return hash_equals(self::hash($payload), $clientHash);
    }
}
