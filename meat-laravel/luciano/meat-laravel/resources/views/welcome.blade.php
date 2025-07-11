<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MEAT Demo</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>

    <h1>MEAT Laravel Test</h1>

    <input id="message" value="Hello Luciano">
    <button onclick="document.getElementById('message').value += ' 💥'">Update Message</button>

    @meatHydrate(['message' => 'Hello Luciano'])
    @meatSync('message')
    @meatSyncEvent('message', \Luciano\MeatLaravel\Events\MeatPayloadSynced::class)
    @meatScripts

</body>
</html>
