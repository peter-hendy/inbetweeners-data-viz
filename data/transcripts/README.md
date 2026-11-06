# Inbetweeners transcript dataset

All 18 episodes of the original UK television series, series 1-3. Snapshot: `reconciled-v1-13dccc2a1ad389ca`.

- `normalized/S01E01.json` through `S03E06.json`: 18 episode files.
- `manifest.json`: SHA-256 checksums, source coverage and verification limits.
- Coverage: 7,800 collected source segments; 371,713 source characters.

Segments retain source text and source URLs. Turn `start`/`end` offsets address that original text. `speakers` supports multiple simultaneous speakers; `speakerId` is a shorthand for a single speaker. Speech, narration and non-dialogue have separate kinds. Original review metadata and subsequent resolution history are preserved.

Anonymous groups are not identified people: `individualIdentified:false` and `eligibleForNamedCharacterGraph:false` exclude them from named-character networks. Four short ranges remain unknown; another passage retains contested speaker evidence.

The corpus includes contextual model-draft labels alongside human reviews and evidence-backed corrections. It is not fully human-checked or audio-verified. Checks establish coverage of the collected online transcripts, not every aired word. See manifest flags before treating labels as verified ground truth.
