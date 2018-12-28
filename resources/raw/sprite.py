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
maxColumns = 0
firstFiles = []
def correctJson():
    global jsonData
    for key in jsonData:
        jsonData[key]["columns"] = maxColumns
        jsonData[key]["index"] = jsonData[key]["row"] * maxColumns
        jsonData[key]["indexEnd"] = jsonData[key]["row"] * maxColumns + maxColumns - 1

def addJson(root, files):
    global row, maxColumns
    columns = len(files)
    files = [{
        "file": f,
        "width": width,
        "height": height,
    } for f in files]
    jsonData[root] = {
        "files": files,
        "row": row,
        "width": width,
        "height": height,
        "columns": columns,
    }
    if (columns > maxColumns):
        maxColumns = columns
    row+=1

for root, dirs, files in os.walk('.'):
    if (root != "."):
        root = root.replace('./','')
        files = [root + "/" + f for f in files if ".png" in f]
        outfile = temp + root + ".png"
        spacedFiles = " ".join(files)
        command = "convert " + spacedFiles + " +append " + outfile
        firstFiles.append(outfile)
        os.system(command)
        addJson(root, files)

spacedFiles = " ".join(firstFiles)
command = "convert " + spacedFiles + " -append " + animationPng
os.system(command)

correctJson()

json.dump(jsonData, open(animationJson, "w"), indent=4)