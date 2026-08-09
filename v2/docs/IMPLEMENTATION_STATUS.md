# DG Afrique V2.0 — implementation status

## Started

The V2 implementation starts in an isolated branch and nested `v2/` application so the current Next.js production remains untouched.

### Implemented in this first slice

- Laravel 13 / Inertia / React project manifest and bootstrap skeleton.
- Shared App Shell with desktop rail + mobile bottom tabs.
- First upgraded visual tokens: deeper ink, stronger gold, more generous typography, larger radii and calmer surfaces.
- Public portal home foundation.
- Authenticated home foundation based on next useful action rather than metrics.
- Four initial productive poles exposed from the server.
- ZUMRA entry redesigned so the product can grow into a genuine social network of action: activity feed, messaging, comments and sharing are explicitly reserved as social capabilities, while membership and identity remain separate.

## Not migrated yet

- GAMAD Core session bridge.
- Existing ZUMRA database and GeniusPay flows.
- Profile-capability persistence.
- Projects and opportunities backend modules.
- Real recommendation engine.
- Production deployment.

## Rule

The V1 remains the source of truth for currently working production flows until each V2 capability is migrated and verified.
