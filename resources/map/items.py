#!/usr/bin/python
import os
outfile = 'items.png'
files = os.popen('ls -v ~/Downloads/pixil-frame-0\ *.png | sort -n -k2.3').read()
files = files.split('\n')
# files = [files.split('\n')[-1]] + files.split('\n')[:-1]
files = ' '.join(files).replace(" (", "\ (").replace("(", "\(").replace(")", "\)")
# print(files)
command = 'convert ' + files + ' +append ' + outfile
os.system(command)