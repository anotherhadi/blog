---
title: "Nmap - Basics"
description: "Quick reference for essential Nmap commands for network reconnaissance."
category: "Network"
tags: ["nmap", "recon", "network", "scanning"]
publishDate: 2026-04-24
---

## Introduction

Nmap (Network Mapper) is the go-to tool for network discovery and security auditing. It lets you scan hosts, detect open services, and identify operating systems. For raw connections and banner grabbing, see [Netcat](/notes/netcat).

## Installation

```bash
# Debian/Ubuntu
sudo apt install nmap

# Arch Linux
sudo pacman -S nmap
```

## Core Commands

### Host Discovery

```bash
# Ping scan (no port scan)
nmap -sn 192.168.1.0/24

# Skip ping (treat host as up)
nmap -Pn 192.168.1.1
```

### Port Scanning

```bash
# 1000 most common ports (default)
nmap 192.168.1.1

# All ports (0–65535)
nmap -p- 192.168.1.1

# Specific ports
nmap -p 22,80,443 192.168.1.1

# Port range
nmap -p 1-1024 192.168.1.1
```

### Service & OS Detection

```bash
# Service version detection
nmap -sV 192.168.1.1

# OS detection
nmap -O 192.168.1.1

# Aggressive scan (OS + version + scripts + traceroute)
nmap -A 192.168.1.1
```

### Scan Types

| Flag | Type | Description |
|------|------|-------------|
| `-sS` | SYN Scan | Fast and stealthy (requires root) |
| `-sT` | TCP Connect | Full connect, no root needed |
| `-sU` | UDP Scan | For UDP services |
| `-sN` | Null Scan | No TCP flags |
| `-sF` | FIN Scan | FIN flag only |

### NSE Scripts

```bash
# Specific script
nmap --script=http-title 192.168.1.1

# Script category
nmap --script=vuln 192.168.1.1

# Default scripts
nmap -sC 192.168.1.1
```

## Useful Flags

| Flag | Description |
|------|-------------|
| `-v` / `-vv` | Verbose output |
| `-oN <file>` | Normal text output |
| `-oX <file>` | XML output |
| `-oG <file>` | Grepable output |
| `-T0` to `-T5` | Timing (0=paranoid, 5=insane) |
| `--open` | Show only open ports |

## Practical Examples

```bash
# Full network scan
nmap -sV -sC -O -p- 192.168.1.0/24 -oN scan.txt

# Slow stealthy scan to avoid IDS
nmap -sS -T1 -f 192.168.1.1

# UDP scan of common ports
nmap -sU --top-ports 100 192.168.1.1
```
