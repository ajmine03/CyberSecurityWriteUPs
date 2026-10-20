"""MkDocs Pre-build Hook for CyberSecurityWriteUPs.

Ensures that the docs/ directory cleanly mirrors the repository content
(notion-content, index.md, assets, .pages) using relative symlinks
or copies across all operating systems, and removes any broken symlinks.
"""

import os
import shutil
from pathlib import Path


def on_pre_build(config):
  repo_root = Path(config.config_file_path).parent.resolve()
  docs_dir = Path(config['docs_dir']).resolve()

  docs_dir.mkdir(parents=True, exist_ok=True)

  # 1. Clean up any broken symlinks in docs/
  for item in docs_dir.iterdir():
    if item.is_symlink():
      try:
        # If target does not exist, unlink broken symlink
        if not item.exists():
          item.unlink(missing_ok=True)
      except Exception:
        item.unlink(missing_ok=True)

  # 2. List of root entities that comprise the documentation site
  targets = [
      'notion-content',
      'index.md',
      'assets',
      '.pages',
  ]

  for item_name in targets:
    src = repo_root / item_name
    dest = docs_dir / item_name

    if not src.exists():
      continue

    # If dest already exists and points to src, nothing to do
    if dest.is_symlink():
      try:
        if dest.resolve() == src.resolve():
          continue
        dest.unlink()
      except Exception:
        dest.unlink(missing_ok=True)
    elif dest.exists():
      continue

    # Attempt relative symlink first; fall back to copy if symlinks not permitted
    try:
      rel_target = os.path.relpath(src, docs_dir)
      os.symlink(rel_target, dest)
    except (OSError, NotImplementedError):
      if src.is_dir():
        shutil.copytree(src, dest, dirs_exist_ok=True)
      else:
        shutil.copy2(src, dest)
