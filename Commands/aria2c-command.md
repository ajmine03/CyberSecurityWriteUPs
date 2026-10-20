---
title: aria2c
---

# aria2c Fast Download Command

High-speed multi-connection download command reference.

## Command

```bash
aria2c -x 16 -s 16 -k 1M ""
```

## Options Breakdown

| Flag | Description |
|---|---|
| `-x 16` | Maximum number of connections per server (up to 16) |
| `-s 16` | Download a file using N connections / split into 16 parts |
| `-k 1M` | Minimum split size (1 Megabyte) |
