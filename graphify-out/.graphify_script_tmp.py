from graphify.export import to_html
from graphify.build import build_from_json
from graphify.cluster import cluster
from pathlib import Path
import json

extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text(encoding='utf-8'))
labels = json.loads(Path('graphify-out/.graphify_labels.json').read_text(encoding='utf-8'))
labels = {int(k): v for k, v in labels.items()}

G = build_from_json(extraction)
communities = cluster(G)
to_html(G, communities, 'graphify-out/graph.html', community_labels=labels)
print('HTML generated')
