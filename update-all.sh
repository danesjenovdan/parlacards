#!/bin/bash
for folder1 in [p,ps,s,c]/*/; do
  gulp push-build --path=$folder1;
done
