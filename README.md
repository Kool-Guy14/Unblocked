# Brainrots Game Library

## Library
- Totally Normal
- Plinko
- Pick the Lock
- Brainrots

## Brainrots
Brainrots replaces the old RNG-only game and contains:
- RNG
- Fuse Machine styled after the supplied Fuse Brainrots reference
- Brainrot Track with a red carpet and weighted spawning
- Account inventory

Rarer brainrots have lower RNGWeight values and therefore spawn less often. Active global luck increases rare/secret roll weights.

## Social
- Global Chat
- Friends and requests
- Direct messages
- Trade rooms and trade chat

## Admin bookmarklet
- Global announcement: white text bar at the top for 3 seconds
- RNG luck multiplier + duration in seconds
- One-use key generator with expiration

## Render
Create a Render Web Service from this folder:
Build Command: `npm install`
Start Command: `node server.js`

Replace `https://YOUR-SERVER.example.com` in both bookmarklets with your Render HTTPS URL.

For production, move the JSON database to PostgreSQL and protect admin endpoints with real authentication. The current admin bookmarklet intentionally has no admin secret, as requested.
