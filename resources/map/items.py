#!/usr/bin/python
import os
outfile = 'items.png'
files = os.popen('ls ./items | sort -n').read()
files = ["items/" + x for x in files.split('\n') if len(x) > 0]
# files = [files.split('\n')[-1]] + files.split('\n')[:-1]
files = ' '.join(files)
# print(files)
command = 'convert ' + files + ' +append ' + outfile
os.system(command)