#!/usr/bin/python
import os
outfile = 'tile.png'
files = os.popen('ls ./tiles | sort -n').read()
files = ["tiles/" + x for x in files.split('\n') if len(x) > 0]
# files = [files.split('\n')[-1]] + files.split('\n')[:-1]
files = ' '.join(files)
# print(files)
command = 'convert ' + files + ' +append ' + outfile
os.system(command)