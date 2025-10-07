---
layout: page
title: Buffer Overflow Notes
permalink: /notes/security/BufferOverflow
notes_section: Security
notes_category: Buffer Overflow
notes_label: Overview
notes_order: 1
---


# Overview 

A buffer is a temporary data storage area. A program should be written with error checking, if not it will result in weak security. A buffer overflow occurs when input given to the application exceeds allotted memory, input is still accepted by the application, even after exceeding a lot of memory. Input can be received by the application via direct interaction or receiving a data file or remote request by a publicly available service port. This vulnerability can be used to crash the program or to gain shell access.

## How can we prevent buffer overflow?

- The application should not allow any more data to come in once the buffer is full, use boundary protection, constant monitoring of the system.

### High level overview of a buffer overflow attack:
1. Crash the application.
2. Find the applications threshold.
3. Find the bad characters.
4. Remove bad characters from shell code.
5. Find JMPESP value.
6. If JMPESP value is 778BFAAO, write it in reverse along with \x 
	- For example,`\xOa\xaf\xd8\x77`
7. Add \x90 to the payload, \x90 represents EIP pointer so overflow occurs from EIP.

### Steps to conduct a buffer overflow attack:

1. Spiking - Find the vulnerable part of the program.
2. Fuzzing - Adding a bunch of characters to the program and try to break it.
3. Finding the offset - Point where the program crashed.
4. Overwriting the EIP
5. Finding the bad characters
6. Finding the right module
7. Generating the shellcode.

#### Spiking:
- Use netcat to connect to the target machine and the port. Use generic send tcp for spiking. 
- Include these in the spiking script -> s_readline() , s_string("STATS"), s_string_variable("o")
- command: ```generic_send_tcp <ip of the target> <target port> <spike script name>```
- If EIP is overwritten, then it is easy to gain shell.
#### Fuzzing:
- In this step, write a program to connect to the target ip and port and send buffer repeatedly to the target machine and write an exception to print exactly after how many bytes did the program crash. In simple words, it is like testing the limit of the application.
- Finding the offset:
- Use metsploit's pattern creator:-	```<path to the pattern creator> -l <length>```
- While finding the pattern offset, you used immunity debugger to find the EIP value and then used the value to find pattern offset. In real life scenarios or in blackbox testing, the attacker might not have access to Immunity debugger running on a target machine to calculate offset value, he needs EIP value. So, how will the attacker figure out EIP value
- The attacker downloads the same version of the application in his machine and writes an exploit. Then, the attacker uses the same exploit on the target machine.
