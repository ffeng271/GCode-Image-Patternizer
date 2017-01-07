#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys;
import cgi;
import time;
import os;

arguments = cgi.FieldStorage();



print 'Content-Type: text/html\n\n'

if "svgData" in arguments:
	svgData = arguments["svgData"].value;
else:
	svgData = 'None';

if "method" in arguments:
	method = str(arguments["method"].value);
else:
	method = 'unknown';


filename = "../svg/" + method + "-" + time.strftime("%Y%m%d-%H%M%S") + ".svg";


svgData = svgData.replace("&lt;", "<");
svgData = svgData.replace("&gt;", ">");


with open(filename, "w+") as fh:
	os.chmod(filename, 0o777)
	fh.write(svgData)
	fh.close();  