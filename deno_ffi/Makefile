default:	libeth.so

sendeth.o:	sendeth.c sendeth.h
	gcc -c -fPIC -o $@ sendeth.c

libeth.so:	sendeth.o
	gcc -shared -W -o $@ $?
