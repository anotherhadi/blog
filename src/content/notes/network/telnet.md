---
title: "Telnet"
description: "Enumeration, exploitation and post-exploitation techniques for Telnet servers."
tags: ["telnet", "network", "service"]
publishDate: 2026-05-04
---

## Overview

Telnet runs on **port 23** and transmits all data (including credentials) in **cleartext**.
Common on embedded devices, legacy systems, routers, and IoT equipment.

## Enumeration

### Banner grabbing

```bash
nc -nv $IP 23
telnet $IP
```

The banner often reveals the OS, hostname, or device type.

### Nmap

```bash
nmap -sV -p 23 $IP
nmap -p 23 --script telnet-* $IP
```

Key scripts:

- `telnet-ntlm-info`: extracts NTLM info (Windows targets)
- `telnet-brute`: brute-force credentials

## Connect

```bash
telnet $IP
telnet $IP 23
```

Login with `user` / `password`. Session is fully interactive once authenticated.

## Brute Force

```bash
hydra -l $user -P /usr/share/wordlists/rockyou.txt telnet://$IP
medusa -h $IP -u $user -P /usr/share/wordlists/rockyou.txt -M telnet
```

Try default credentials first. Routers and embedded devices commonly ship with `admin:admin`, `root:root`, or blank passwords.
