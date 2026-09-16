# Glyphbound: Neon Wilds — v2 Overhaul

This is a full replacement for the original prototype.

## Major changes

- Real walkable top-down overworld
- Five connected maps: Relay Town, Circuit Meadow, Rustwater Docks, Nightglass Arcade, Crown Relay
- On-screen iPhone D-pad and interaction controls
- Wild encounter terrain
- NPCs, healing terminals, shops, hidden/field caches
- 12 trainer/Warden encounters with multi-monster teams
- Persistent monster HP between battles
- Team switching during combat
- Fixed level curves rather than scaling everything to the player
- Badge gates between regions
- Harder capture rules
- 21 authored monster forms with individually drawn 32×32 pixel sprites
- Branching starter evolution based on actual battle behavior
- 20 technique cards
- 16-card deck building
- Type strengths/resistances
- XP, levels, Bond, capture, evolution, codex and campaign completion

## Updating the existing GitHub repository

Delete or overwrite the previous game files, then upload these files to the repository root:

- index.html
- style.css
- data.js
- maps.js
- game.js
- manifest.webmanifest
- sw.js
- icon-180.png
- icon-512.png
- README.md

GitHub Pages settings do not need to change.

Because this is a major rebuild, v2 uses a new save key and starts a new campaign. The old v1 browser save is left untouched.

## iPhone

Once GitHub Pages deploys the update, the installed Home Screen PWA should refresh itself. If iOS holds the old cache unusually long, closing and reopening the app while online normally resolves it.
