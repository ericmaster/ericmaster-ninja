# Minimal, self-contained WeasyPrint image for docgen (HTML -> branded PDF).
#
# WeasyPrint is CPython + native Pango/HarfBuzz, so it can't run on the host without
# root apt (or on a Cloudflare Worker at all). This container carries its own deps, so
# `npm run doc:pdf` needs only Docker — no host pollution, no secrets, no cloud.
#
# Build:  docker build -t ericmaster-ninja-docgen-weasyprint -f docgen/weasyprint.Dockerfile docgen
# Run:    docker run --rm -v "$PWD/docgen/out:/data" ericmaster-ninja-docgen-weasyprint /data/in.html /data/out.pdf
FROM python:3.12-slim

# Runtime deps for WeasyPrint's Pango-based text layout + image/font handling.
RUN apt-get update && apt-get install -y --no-install-recommends \
      libpango-1.0-0 libpangoft2-1.0-0 libharfbuzz-subset0 \
      libjpeg62-turbo libopenjp2-7 fonts-dejavu-core fontconfig \
  && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir weasyprint==69.0

# Entrypoint is the weasyprint CLI: `<input.html> <output.pdf>` are the trailing args.
ENTRYPOINT ["weasyprint"]
