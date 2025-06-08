# leetlab/Dockerfile
FROM judge0/judge0:1.13.1

COPY judge0.conf /judge0.conf

CMD bash -c "./scripts/workers & ./scripts/server"
