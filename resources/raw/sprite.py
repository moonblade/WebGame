#!/usr/bin/python
import os
import shutil
import json

width=21
height=21
temp="../map/temp/"
animationPng="../map/animation.png"
animationJson="../map/animation.json"
shutil.rmtree(temp, ignore_errors=True)
os.mkdir(temp)

jsonData = {}

row = 0
index = 0
def addJson(root, files):
    global row, index
    columns = len(files)
    files = [{
        "file": f,
        "width": width,
        "height": height,
    } for f in files]
    jsonData[root] = {
        "files": files,
        "row": row,
        "columns": columns,
        "index": index,
        "indexEnd": index + columns
    }
    index+=columns
    row+=1

for root, dirs, files in os.walk('.'):
    if (root != "."):
        root = root.replace('./','')
        files = [root + "/" + f for f in files if ".png" in f]
        outfile = temp + root + ".png"
        spacedFiles = " ".join(files)
        command = "convert " + spacedFiles + " +append " + outfile
        os.system(command)
        addJson(root, files)

for root, dirs, files in os.walk(temp):
    files = [temp + f for f in files if ".png" in f]
    spacedFiles = " ".join(files)
    command = "convert " + spacedFiles + " -append " + animationPng
    os.system(command)

json.dump(jsonData, open(animationJson, "w"), indent=4)