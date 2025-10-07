
---
layout: page
title: Linux Permissions
permalink: /notes/general/Linux-Permissions
notes_section: Security
notes_category: General
notes_label: Linux Permissions
notes_order: 1
---

---
| **Octal digit** | **Permission(s) granted**                     | **Symbolic**  |
| --------------- | --------------------------------------------- | ------------- |
| 0               | None                                          | `[u/g/o]-rwx` |
| 1               | Execute permission only                       | `[u/g/o]=x`   |
| 2               | Write permission only                         | `[u/g/o]=w`   |
| 3               | Write and execute permissions only: 2 + 1 = 3 | `[u/g/o]=wx`  |
| 4               | Read permission only                          | `[u/g/o]=r`   |
| 5               | Read and execute permissions only: 4 + 1 = 5  | `[u/g/o]=rx`  |
| 6               | Read and write permissions only: 4 + 2 = 6    | `[u/g/o]=rw`  |
| 7               | All permissions: 4 + 2 + 1 = 7                | `[u/g/o]=rwx` |
---
