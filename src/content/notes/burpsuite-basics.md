---
title: "Burp Suite - Basics"
description: "Intercept, inspect and modify HTTP traffic with Burp Suite."
category: "Web"
tags: ["burpsuite", "web", "proxy", "http"]
publishDate: 2026-04-24
---

Burp Suite is the standard proxy for web app pentesting.

## Setup

1. Launch Burp → Proxy → Options → listener on `127.0.0.1:8080`
2. Configure browser to use proxy `127.0.0.1:8080`
3. Install Burp's CA cert to intercept HTTPS

## Key Tabs

| Tab | Use |
|-----|-----|
| Proxy | Intercept and forward requests |
| Repeater | Replay and modify requests manually |
| Intruder | Fuzzing and brute force |
| Scanner | Automated vulnerability scan (Pro) |
| Decoder | Encode/decode data |

## Useful Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+R` | Send to Repeater |
| `Ctrl+I` | Send to Intruder |
| `Ctrl+F` | Forward intercepted request |

## Intercept a Request

1. Enable intercept → browse the target
2. Request appears in Proxy tab
3. Modify → Forward
