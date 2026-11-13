# Oddillion

Oddillion is a daily sports-market intuition game. Players receive seven frozen in-game scenarios and guess the implied probability that the market assigned to each prop.

This first prototype is a buildless static site. Its seven scenarios and community distribution use seeded demonstration data so the complete interaction can be tested before the historical Polymarket ingestion pipeline is connected.

## Run locally

Serve the repository root with any static file server and open `dist/index.html`, or open the file directly in a browser.

## Prototype features

- Seven-round daily game loop
- In-game context and relevant player statistics
- Percentage slider with immediate market reveal
- Transparent distance-based scoring, up to 700 points
- Seeded community score distribution and percentile
- Local progress persistence and shareable result text
