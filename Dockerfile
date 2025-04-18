FROM ubuntu:latest
LABEL authors="thepa"

ENTRYPOINT ["top", "-b"]