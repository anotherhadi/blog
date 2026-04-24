---
title: "Recon Checklist"
description: "Structured approach to reconnaissance before an engagement."
category: "Methodology"
tags: ["recon", "methodology", "checklist"]
publishDate: 2026-04-24
---

A quick checklist to follow before diving into exploitation.

## Network

- [ ] Discover live hosts — [Nmap](/notes/nmap-basics)
- [ ] Identify open ports and services — [Nmap](/notes/nmap-basics)
- [ ] Banner grab with [Netcat](/notes/netcat)
- [ ] Check for wireless networks — [Wifi Recon](/notes/wifi-recon)

## Web

- [ ] Spider the target
- [ ] Intercept traffic — [Burp Suite](/notes/burpsuite-basics)
- [ ] Check for common vulns (SQLi, XSS, LFI)
- [ ] Review JS files for endpoints and secrets

## Notes

- Document everything as you go
- Screenshot evidence
- Note service versions for CVE lookups
