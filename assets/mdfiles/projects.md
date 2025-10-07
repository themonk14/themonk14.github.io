---
layout: page
title: Projects
permalink: /projects/
---

## Security Labs and Automation Work

### 1) Proxmox Cyber Lab (portable DFIR + adversary-emulation environment)
**Goal:** Reproducible, laptop-hosted lab for DFIR, threat detection, and control validation.

**Host & Network**
- Proxmox VE on Dell laptop; bridges: `vmbr0` (NAT), optional isolated VLANs.
- Static IPs per VM/LXC; separate segments for “Corp,” “DMZ,” and “OT-sim” where needed.

**Compute Topology**
- VMs: Ubuntu Server, Debian, Kali, Windows 10/11, CAINE.
- LXCs: lightweight Ubuntu/Debian services for logging, capture, and control planes.

**Automation**
- Bash/Ansible to idempotently stand up nodes (`pct create`, `pveam` templates, cloud-init).
- Parameterized scripts for fast re-provisioning and teardown; artifacts versioned in Git.

**Security Stack**
- Collection & DFIR: Velociraptor (hunt/triage), GRR, CAINE; packet capture for replay.
- Detection: Wazuh (SIEM/IDS), Falco (runtime detection) on Linux nodes.
- Adversary simulation: Caldera/Atomic Red Team scenarios to validate detections.

**Outcomes**
- Spin-up from bare metal to fully instrumented lab in <60 minutes.
- Repeatable DFIR exercises (collection → timeline → containment playbooks).
- Evidence packs (PCAP, triage ZIPs, KAPE-style collections) for reports and training.

---

### 2) Incident Response Plan + Playbooks (evidence-driven, tool-backed)
**Goal:** Practical IR plan aligned with NIST 800-61r2 and SOC/engineering reality; backed by runnable playbooks in the lab.

**Scope**
- Preparation: comms matrix, roles/RACI, decision trees (escalation, contain/isolate, notify).
- Identification: alert triage rubric, severity matrix, false-positive gates.
- Containment/Eradication/Recovery: OS-specific containment steps, golden image/path-to-green, post-restoration validation checks.
- Post-Incident: lessons-learned loop, detection/gap tickets, control owners and due dates.

**Playbooks (selected)**
- Ransomware on Windows workstation (isolate, snapshot, VSS check, triage artifacts, IR disk imaging).
- Suspicious AWS access keys (key revocation, IMDSv2 & SCP checks, GuardDuty triage, log scoping).
- Malicious GitHub OAuth app / PAT abuse (token revocation, org audit log queries, repo forensics).
- Web service compromise (WAF/edge rules, container image roll-back, secrets rotation, SBOM diff).

**Artifacts & Evidence**
- Triage checklists and commands per platform (Velociraptor/GRR hunts, acquisition profiles).
- Report templates with chain-of-custody fields; executive summary + technical appendix.
- Mapped residual-risk items to NIST CSF functions and owners.

**Outcomes**
- Mean time to triage reduced via pre-approved steps and tooling.
- Consistent, defensible reporting with preserved evidence and decision logs.

---

### 3) DevSecOps Pipeline: GitHub Actions → SBOM/Scan → ArgoCD GitOps
**Goal:** Shift-left security with attestations and continuous delivery to Kubernetes (k3s/ArgoCD).

**Pipeline (per service)**
1. **Build & SBOM**
   - Container build on GitHub Actions.
   - Generate SBOM with **Syft** (SPDX or CycloneDX).
2. **Vulnerability & Policy**
   - **Grype** scan on image + SBOM; fail on policy (CVSS/severity allowlist, OS/app split).
   - Optional trivy as a secondary signal; SARIF uploaded to code scanning.
3. **Provenance & Signing**
   - Build provenance/attestation (SLSA-style) with GitHub OIDC → cosign keyless signing.
   - Push signed image to registry; attach SBOM as an OCI artifact.
4. **GitOps Promotion**
   - Update Helm chart or Kustomize manifests in the “environment” repo.
   - **ArgoCD** auto-syncs to k3s cluster; health checks gate rollout (readiness/liveness).
5. **Runtime & Feedback**
   - Falco rules for runtime anomalies; Wazuh/Elastic for logs.
   - Image policy admission can enforce “signed + no critical vulns + SBOM present”.

**Compliance & Reporting**
- Evidence bundle: SBOM (Syft), scan results (Grype), attestation JSON, signed digest, pipeline logs.
- Release notes enumerate fixed CVEs, new risks, and transient allowlists with expiry.

**Outcomes**
- Reproducible releases with cryptographic provenance and SBOM attached.
- Measurable reduction in criticals at build time; drift minimized via GitOps.
- Auditable CI/CD trail suitable for GRC artifacts (maps cleanly to NIST CSF “Protect/Detect/Respond”).

---

→ [Blog](/blog/) | [Digital Badges](/badges/)
