---
title: "Wifi Recon"
description: "Passive and active reconnaissance on wireless networks."
category: "Wifi"
tags: ["wifi", "recon", "aircrack", "monitor-mode"]
publishDate: 2026-04-24
---

Before attacking a wifi network, map the environment. Combine with [Nmap](/notes/nmap-basics) once connected.

## Enable Monitor Mode

```bash
sudo airmon-ng check kill
sudo airmon-ng start wlan0
# Interface becomes wlan0mon
```

## Scan Networks

```bash
# Passive scan — all channels
sudo airodump-ng wlan0mon

# Target a specific AP
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon
```

## Key Fields

| Field | Description |
|-------|-------------|
| BSSID | AP MAC address |
| PWR | Signal strength |
| #Data | Data frames (useful for WEP) |
| ENC | Encryption type |
| ESSID | Network name |

## Disable Monitor Mode

```bash
sudo airmon-ng stop wlan0mon
sudo systemctl restart NetworkManager
```
