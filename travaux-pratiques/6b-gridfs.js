// wget -O /tmp/son.mp3 "http://lasonotheque.org/telecharger.php?format=mp3&id=0827"

mongofiles -d sons list

// cd /tmp/

mongofiles -d sons put son.mp3

mongofiles -d sons search mp3

// cd 

mongofiles -d sons get son.mp3

mongofiles -d sons delete son.mp3
