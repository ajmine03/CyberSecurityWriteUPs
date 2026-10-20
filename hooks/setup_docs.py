"""MkDocs Pre-build Hook for CyberSecurityWriteUPs.

Ensures that the docs/ directory cleanly mirrors the repository content:
- Auto-discovers platform directories inside notion-content/ (CyLab, THM, HTB, etc.)
- Mirrors each platform folder directly into docs/{platform}/
- Mirrors assets, index.md, and notion-content
- Auto-generates docs/.pages with platform-wise navigation
- Cleans up broken symlinks across all operating systems
"""

import os
import shutil
from pathlib import Path


def _mirror_entity(src: Path, dest: Path, docs_dir: Path):
  if not src.exists():
    return

  if dest.is_symlink():
    try:
      if dest.resolve() == src.resolve():
        return
      dest.unlink()
    except Exception:
      dest.unlink(missing_ok=True)
  elif dest.exists():
    return

  try:
    rel_target = os.path.relpath(src, docs_dir)
    os.symlink(rel_target, dest)
  except (OSError, NotImplementedError):
    if src.is_dir():
      shutil.copytree(src, dest, dirs_exist_ok=True)
    else:
      shutil.copy2(src, dest)


def on_pre_build(config):
  repo_root = Path(config.config_file_path).parent.resolve()
  docs_dir = Path(config['docs_dir']).resolve()
  notion_content_dir = repo_root / 'notion-content'

  docs_dir.mkdir(parents=True, exist_ok=True)

  # 1. Clean up any broken symlinks in docs/
  for item in docs_dir.iterdir():
    if item.is_symlink():
      try:
        if not item.exists():
          item.unlink(missing_ok=True)
      except Exception:
        item.unlink(missing_ok=True)

  # 2. Discover platform directories in notion-content/
  platform_names = []
  if notion_content_dir.exists():
    for item in sorted(notion_content_dir.iterdir()):
      if item.is_dir() and not item.name.startswith('.'):
        platform_names.append(item.name)

  # 3. Mirror platform directories into docs/
  for plat in platform_names:
    src_plat = notion_content_dir / plat
    dest_plat = docs_dir / plat
    _mirror_entity(src_plat, dest_plat, docs_dir)

  # 4. Mirror root entities (index.md, assets)
  targets = ['index.md', 'assets']
  for item_name in targets:
    src = repo_root / item_name
    dest = docs_dir / item_name
    _mirror_entity(src, dest, docs_dir)

  # Clean up legacy docs/notion-content if present
  legacy_nc = docs_dir / 'notion-content'
  if legacy_nc.is_symlink():
    legacy_nc.unlink(missing_ok=True)
  elif legacy_nc.is_dir():
    shutil.rmtree(legacy_nc, ignore_errors=True)

  # 5. Generate root docs/.pages with platform-wise navigation
  pages_nav = ['Home: index.md'] + platform_names + ['...']
  pages_content = 'nav:\n' + ''.join(f'  - {entry}\n' for entry in pages_nav)
  pages_path = docs_dir / '.pages'
  if not pages_path.exists() or pages_path.read_text(
      encoding='utf-8'
  ).strip() != pages_content.strip():
    pages_path.write_text(pages_content, encoding='utf-8')

