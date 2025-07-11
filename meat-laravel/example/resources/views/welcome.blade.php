<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MEAT Demo</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>

    <h1>👋 Hello from MEAT Laravel!</h1>

    <input id="message" value="Hello Luciano" />

    <button onclick="document.getElementById('message').value += ' 💥'">
        Explode Message
    </button>

    @meatHydrate(['message' => 'Hello Luciano'])

    @meatSync('message')

    @meatSyncEvent('message', \Luciano\MeatLaravel\Events\MeatPayloadSynced::class)

    @meatScripts

</body>
</html>
