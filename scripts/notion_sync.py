#!/usr/bin/env python3
"""Notion-to-GitHub Automatic Writeup Synchronizer for CyberSecurityWriteUPs.

Syncs published writeups from a Notion database into the notion-content/
directory, converts Notion blocks into clean Markdown, downloads expiring
images into local assets, and maintains a clean listing table.
"""

from __future__ import annotations

import argparse
import collections
import hashlib
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple
from urllib.parse import urlparse

try:
  import requests
except ImportError:
  print("Error: 'requests' package is required. Install via: pip install requests")
  sys.exit(1)


NOTION_API_VERSION = "2022-06-28"
NOTION_API_BASE = "https://api.notion.com/v1"


def get_headers(api_key: str) -> Dict[str, str]:
  return {
      "Authorization": f"Bearer {api_key}",
      "Notion-Version": NOTION_API_VERSION,
      "Content-Type": "application/json",
  }


def clean_database_id(raw_id: str) -> str:
  """Normalizes Notion database ID (removes hyphens or handles URL format)."""
  cleaned = raw_id.strip()
  # If a full URL was provided, extract the 32-char hex ID
  match = re.search(r"([a-fA-F0-9]{32})", cleaned)
  if match:
    return match.group(1)
  # Strip hyphens
  cleaned = cleaned.replace("-", "")
  return cleaned


def slugify(text: str) -> str:
  """Converts text into a URL-friendly slug."""
  text = text.lower().strip()
  text = re.sub(r"[^\w\s-]", "", text)
  text = re.sub(r"[\s_-]+", "-", text)
  slug = text.strip("-")
  return slug or "untitled-writeup"


def sanitize_platform_name(name: Optional[str]) -> str:
  """Sanitizes platform name for directory naming while preserving display casing."""
  name = (name or "").strip()
  if not name:
    return "Other"
  name = re.sub(r'[\\/*?:"<>|]', "", name).strip()
  return name or "Other"


class NotionSyncClient:

  def __init__(
      self,
      api_key: str,
      database_id: str,
      output_dir: Path,
      assets_dir: Path,
      dry_run: bool = False,
  ):
    self.api_key = api_key
    self.database_id = clean_database_id(database_id)
    self.output_dir = output_dir.resolve()
    self.assets_dir = assets_dir.resolve()
    self.dry_run = dry_run
    self.headers = get_headers(api_key)
    self.manifest_path = self.output_dir / ".sync_manifest.json"
    self.manifest = self._load_manifest()

    self.files_added: List[str] = []
    self.files_modified: List[str] = []
    self.files_deleted: List[str] = []

  def _load_manifest(self) -> Dict[str, Any]:
    if self.manifest_path.exists():
      try:
        with open(self.manifest_path, "r", encoding="utf-8") as f:
          return json.load(f)
      except Exception:
        pass
    return {}

  def _save_manifest(self) -> None:
    if self.dry_run:
      return
    self.manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with open(self.manifest_path, "w", encoding="utf-8") as f:
      json.dump(self.manifest, f, indent=2, sort_keys=True)

  def _api_request(
      self,
      method: str,
      endpoint: str,
      json_data: Optional[Dict[str, Any]] = None,
      max_retries: int = 5,
  ) -> requests.Response:
    url = f"{NOTION_API_BASE}/{endpoint.lstrip('/')}"
    backoff = 1.0

    for attempt in range(1, max_retries + 1):
      try:
        if method.upper() == "GET":
          resp = requests.get(url, headers=self.headers, timeout=30)
        else:
          resp = requests.post(
              url, headers=self.headers, json=json_data, timeout=30
          )

        # Handle rate limiting (HTTP 429)
        if resp.status_code == 429:
          retry_after = float(resp.headers.get("Retry-After", backoff))
          print(f"Rate limited (429). Retrying after {retry_after:.1f}s...")
          time.sleep(retry_after)
          backoff *= 2
          continue

        return resp
      except requests.RequestException as e:
        if attempt == max_retries:
          raise
        print(f"Request failed ({e}). Retrying in {backoff:.1f}s...")
        time.sleep(backoff)
        backoff *= 2

    raise RuntimeError(f"Exceeded max retries for Notion API call: {endpoint}")

  def verify_connection(self) -> Tuple[bool, Optional[str]]:
    """Verifies access to the Notion database and gives detailed error diagnostics."""
    try:
      resp = self._api_request("GET", f"databases/{self.database_id}")
    except Exception as e:
      return False, f"Network or connection error connecting to Notion API: {e}"

    if resp.status_code == 200:
      data = resp.json()
      title_list = data.get("title", [])
      db_title = (
          "".join(t.get("plain_text", "") for t in title_list)
          or "Untitled Database"
      )
      return (
          True,
          f"Successfully verified access to Notion database: '{db_title}'"
          f" (ID: {self.database_id})",
      )

    elif resp.status_code == 401:
      msg = (
          "Notion API Authentication Failed (HTTP 401):\n"
          "  Your NOTION_API_KEY is invalid, revoked, or formatted incorrectly.\n"
          "  HOW TO FIX:\n"
          "  1. Go to https://www.notion.so/my-integrations\n"
          "  2. Find or create your integration token.\n"
          "  3. Copy the 'Internal Integration Secret'.\n"
          "  4. Update the 'NOTION_API_KEY' secret in GitHub Repository Settings"
          " -> Secrets and variables -> Actions."
      )
      return False, msg

    elif resp.status_code == 404:
      msg = (
          f"Notion Database Not Found or Not Shared (HTTP 404):\n"
          f"  Database ID: {self.database_id}\n"
          "  HOW TO FIX:\n"
          "  1. Open your writeups database page in Notion in your browser.\n"
          "  2. Click the three dots '...' in the top right corner of the page.\n"
          "  3. Scroll down and click 'Connections' (or 'Add connections').\n"
          "  4. Search for your Integration name and select it to grant"
          " access.\n"
          "  5. Also ensure the database ID in your GitHub secrets matches the"
          " 32-character ID in the database URL."
      )
      return False, msg

    elif resp.status_code == 403:
      msg = (
          "Notion API Permission Denied (HTTP 403):\n"
          "  Your integration does not have read permissions for this"
          " database.\n"
          "  HOW TO FIX:\n"
          "  In https://www.notion.so/my-integrations, check your integration"
          " capabilities and ensure 'Read content' is enabled."
      )
      return False, msg

    else:
      return False, f"Notion API returned HTTP {resp.status_code}: {resp.text}"

  def get_database_schema(self) -> Dict[str, Any]:
    resp = self._api_request("GET", f"databases/{self.database_id}")
    if resp.status_code == 200:
      return resp.json().get("properties", {})
    return {}

  def query_published_pages(self) -> List[Dict[str, Any]]:
    """Queries pages from the database, filtering for Status == 'Published'."""
    schema = self.get_database_schema()
    has_status_prop = "Status" in schema
    status_type = (
        schema.get("Status", {}).get("type", "status")
        if has_status_prop
        else None
    )

    query_body: Dict[str, Any] = {}
    if status_type == "status":
      query_body["filter"] = {
          "property": "Status",
          "status": {"equals": "Published"},
      }
    elif status_type == "select":
      query_body["filter"] = {
          "property": "Status",
          "select": {"equals": "Published"},
      }

    pages: List[Dict[str, Any]] = []
    has_more = True
    start_cursor = None

    while has_more:
      payload = dict(query_body)
      if start_cursor:
        payload["start_cursor"] = start_cursor

      resp = self._api_request(
          "POST", f"databases/{self.database_id}/query", json_data=payload
      )
      if resp.status_code != 200:
        # If filter failed (e.g. status property mismatch), fallback to querying all pages
        if "filter" in payload:
          print(
              "Filter failed, falling back to unfiltered query with client-side"
              " filtering..."
          )
          query_body = {}
          continue
        raise RuntimeError(
            f"Failed to query Notion database: {resp.status_code} {resp.text}"
        )

      data = resp.json()
      for page in data.get("results", []):
        # Client-side validation: must have Status == 'Published'
        props = page.get("properties", {})
        status_val = self._extract_status(props)
        if status_val.lower() == "published":
          pages.append(page)

      has_more = data.get("has_more", False)
      start_cursor = data.get("next_cursor")
      time.sleep(0.05)

    return pages

  def _extract_status(self, properties: Dict[str, Any]) -> str:
    status_obj = properties.get("Status") or properties.get("status")
    if not status_obj:
      return ""
    p_type = status_obj.get("type")
    if p_type == "status":
      return (status_obj.get("status") or {}).get("name", "")
    elif p_type == "select":
      return (status_obj.get("select") or {}).get("name", "")
    elif p_type == "rich_text":
      return "".join(
          t.get("plain_text", "") for t in status_obj.get("rich_text", [])
      )
    return ""

  def extract_page_metadata(self, page: Dict[str, Any]) -> Dict[str, Any]:
    props = page.get("properties", {})

    # Extract Title
    title = ""
    for _, prop in props.items():
      if prop.get("type") == "title":
        title = "".join(t.get("plain_text", "") for t in prop.get("title", []))
        break
    if not title:
      title = "Untitled Writeup"

    # Extract Slug (if property provided)
    slug = ""
    slug_prop = props.get("Slug") or props.get("slug")
    if slug_prop:
      p_type = slug_prop.get("type")
      if p_type == "rich_text":
        slug = "".join(
            t.get("plain_text", "") for t in slug_prop.get("rich_text", [])
        ).strip()
      elif p_type == "title":
        slug = "".join(
            t.get("plain_text", "") for t in slug_prop.get("title", [])
        ).strip()

    if not slug:
      slug = slugify(title)

    # Extract Date
    date_val = ""
    date_prop = props.get("Date") or props.get("date")
    if date_prop and date_prop.get("type") == "date":
      date_obj = date_prop.get("date") or {}
      date_val = date_obj.get("start", "")
    if not date_val:
      created_time = page.get("created_time", "")
      date_val = created_time[:10] if created_time else ""

    # Platform (picoCTF, Hack The Box, TryHackMe, etc.)
    platform = ""
    plat_prop = props.get("Platform") or props.get("platform")
    if plat_prop:
      p_type = plat_prop.get("type")
      if p_type == "select":
        platform = (plat_prop.get("select") or {}).get("name", "")
      elif p_type == "multi_select":
        platform = ", ".join(
            s.get("name", "") for s in plat_prop.get("multi_select", [])
        )

    # Category
    category = ""
    cat_prop = props.get("Category") or props.get("category")
    if cat_prop:
      p_type = cat_prop.get("type")
      if p_type == "select":
        category = (cat_prop.get("select") or {}).get("name", "")
      elif p_type == "multi_select":
        category = ", ".join(
            s.get("name", "") for s in cat_prop.get("multi_select", [])
        )

    # Difficulty (Easy, Medium, Hard, etc.)
    difficulty = ""
    diff_prop = props.get("Difficulty") or props.get("difficulty")
    if diff_prop:
      p_type = diff_prop.get("type")
      if p_type == "select":
        difficulty = (diff_prop.get("select") or {}).get("name", "")

    # Description
    desc = ""
    desc_prop = (
        props.get("Description")
        or props.get("description")
        or props.get("Summary")
    )
    if desc_prop and desc_prop.get("type") == "rich_text":
      desc = "".join(
          t.get("plain_text", "") for t in desc_prop.get("rich_text", [])
      ).strip()

    return {
        "id": page.get("id"),
        "title": title,
        "slug": slug,
        "date": date_val,
        "platform": platform or "General",
        "category": category or "Writeup",
        "difficulty": difficulty or "Medium",
        "description": (
            desc or f"Walkthrough and methodology notes for {title}."
        ),
        "last_edited_time": page.get("last_edited_time", ""),
    }

  def get_block_children(self, block_id: str) -> List[Dict[str, Any]]:
    """Retrieves all child blocks for a block or page, with pagination."""
    blocks: List[Dict[str, Any]] = []
    has_more = True
    start_cursor = None

    while has_more:
      endpoint = f"blocks/{block_id}/children?page_size=100"
      if start_cursor:
        endpoint += f"&start_cursor={start_cursor}"

      resp = self._api_request("GET", endpoint)
      if resp.status_code != 200:
        break

      data = resp.json()
      blocks.extend(data.get("results", []))
      has_more = data.get("has_more", False)
      start_cursor = data.get("next_cursor")
      time.sleep(0.04)

    return blocks

  def _convert_rich_text(self, rich_text_list: List[Dict[str, Any]]) -> str:
    """Converts Notion rich text objects into Markdown text with formatting."""
    md_parts = []
    for item in rich_text_list:
      plain = item.get("plain_text", "")
      if not plain:
        continue

      annotations = item.get("annotations", {})
      href = item.get("href")

      text = plain
      if annotations.get("code"):
        text = f"`{text}`"
      if annotations.get("bold"):
        text = f"**{text}**"
      if annotations.get("italic"):
        text = f"*{text}*"
      if annotations.get("strikethrough"):
        text = f"~~{text}~~"
      if annotations.get("underline"):
        text = f"<u>{text}</u>"

      if href:
        text = f"[{text}]({href})"

      md_parts.append(text)

    return "".join(md_parts)

  def download_image(
      self, image_url: str, page_slug: str, caption: str = ""
  ) -> str:
    """Downloads an expiring or external Notion image to local repository assets."""
    if self.dry_run:
      return image_url

    try:
      parsed = urlparse(image_url)
      # Extract extension or fallback to png
      path_suffix = Path(parsed.path).suffix.lower()
      if path_suffix not in [
          ".png",
          ".jpg",
          ".jpeg",
          ".gif",
          ".webp",
          ".svg",
          ".bmp",
      ]:
        path_suffix = ".png"

      # Content-based hash name
      url_hash = hashlib.sha256(image_url.split("?")[0].encode()).hexdigest()[
          :12
      ]
      filename = f"img_{url_hash}{path_suffix}"

      target_dir = self.assets_dir / "notion" / page_slug
      target_dir.mkdir(parents=True, exist_ok=True)
      target_file = target_dir / filename

      # Only download if file does not exist
      if not target_file.exists():
        resp = requests.get(image_url, timeout=30)
        if resp.status_code == 200:
          with open(target_file, "wb") as f:
            f.write(resp.content)
        else:
          return image_url

      # Return relative path from writeup page (notion-content/*.md -> ../assets/notion/...)
      return f"../assets/notion/{page_slug}/{filename}"
    except Exception as e:
      print(f"Warning: Failed to download image {image_url}: {e}")
      return image_url

  def convert_blocks_to_markdown(
      self, blocks: List[Dict[str, Any]], page_slug: str, indent_level: int = 0
  ) -> str:
    """Converts a tree of Notion blocks into GitHub Flavored Markdown."""
    lines: List[str] = []
    prefix = "    " * indent_level

    for block in blocks:
      b_type = block.get("type", "")
      content = block.get(b_type, {})
      has_children = block.get("has_children", False)

      if b_type == "paragraph":
        text = self._convert_rich_text(content.get("rich_text", []))
        lines.append(f"{prefix}{text}\n" if text else "\n")

      elif b_type == "heading_1":
        text = self._convert_rich_text(content.get("rich_text", []))
        lines.append(f"\n{prefix}# {text}\n")

      elif b_type == "heading_2":
        text = self._convert_rich_text(content.get("rich_text", []))
        lines.append(f"\n{prefix}## {text}\n")

      elif b_type == "heading_3":
        text = self._convert_rich_text(content.get("rich_text", []))
        lines.append(f"\n{prefix}### {text}\n")

      elif b_type == "bulleted_list_item":
        text = self._convert_rich_text(content.get("rich_text", []))
        lines.append(f"{prefix}* {text}")
        if has_children:
          children = self.get_block_children(block["id"])
          child_md = self.convert_blocks_to_markdown(
              children, page_slug, indent_level + 1
          )
          lines.append(child_md)

      elif b_type == "numbered_list_item":
        text = self._convert_rich_text(content.get("rich_text", []))
        lines.append(f"{prefix}1. {text}")
        if has_children:
          children = self.get_block_children(block["id"])
          child_md = self.convert_blocks_to_markdown(
              children, page_slug, indent_level + 1
          )
          lines.append(child_md)

      elif b_type == "to_do":
        text = self._convert_rich_text(content.get("rich_text", []))
        checked = "x" if content.get("checked") else " "
        lines.append(f"{prefix}- [{checked}] {text}")

      elif b_type == "toggle":
        text = self._convert_rich_text(content.get("rich_text", []))
        lines.append(f"\n{prefix}??? note \"{text}\"")
        if has_children:
          children = self.get_block_children(block["id"])
          child_md = self.convert_blocks_to_markdown(
              children, page_slug, indent_level + 1
          )
          lines.append(child_md)
        lines.append("")

      elif b_type == "code":
        code_text = "".join(
            t.get("plain_text", "") for t in content.get("rich_text", [])
        )
        lang = content.get("language", "") or "text"
        lines.append(f"\n{prefix}```{lang}\n{code_text}\n{prefix}```\n")

      elif b_type == "quote":
        text = self._convert_rich_text(content.get("rich_text", []))
        lines.append(f"\n{prefix}> {text}\n")

      elif b_type == "callout":
        text = self._convert_rich_text(content.get("rich_text", []))
        icon = (content.get("icon") or {}).get("emoji", "💡")
        lines.append(f'\n{prefix}!!! tip "Note {icon}"\n{prefix}    {text}\n')

      elif b_type == "divider":
        lines.append(f"\n{prefix}---\n")

      elif b_type == "image":
        img_source = content.get("file", {}).get("url") or content.get(
            "external", {}
        ).get("url")
        caption = "".join(
            t.get("plain_text", "") for t in content.get("caption", [])
        )
        if img_source:
          local_path = self.download_image(img_source, page_slug, caption)
          lines.append(f"\n{prefix}![{caption or 'Image'}]({local_path})\n")

      elif b_type == "table":
        # Table rows are child blocks of type table_row
        table_children = self.get_block_children(block["id"])
        if table_children:
          for r_idx, row in enumerate(table_children):
            if row.get("type") == "table_row":
              cells = [
                  self._convert_rich_text(c).replace("|", "\\|")
                  for c in row.get("table_row", {}).get("cells", [])
              ]
              lines.append(f"{prefix}| " + " | ".join(cells) + " |")
              if r_idx == 0:
                lines.append(
                    f"{prefix}| "
                    + " | ".join(["---"] * max(len(cells), 1))
                    + " |"
                )
          lines.append("")

      elif b_type in ["bookmark", "link_preview"]:
        url = content.get("url", "")
        lines.append(f"\n{prefix}[{url}]({url})\n")

      elif b_type == "equation":
        expr = content.get("expression", "")
        lines.append(f"\n{prefix}$$\n{prefix}{expr}\n{prefix}$$\n")

    return "\n".join(lines)

  def build_page_markdown(
      self, meta: Dict[str, Any], body_markdown: str
  ) -> str:
    """Combines YAML frontmatter and body into final document format."""
    diff_badge_class = "medium"
    d_lower = meta["difficulty"].lower()
    if "easy" in d_lower:
      diff_badge_class = "easy"
    elif "hard" in d_lower:
      diff_badge_class = "hard"

    header_block = f"""---
title: {meta['title']}
date: {meta['date']}
platform: {meta['platform']}
category: {meta['category']}
difficulty: {meta['difficulty']}
notion_id: {meta['id']}
---

# {meta['title']}

<div class="article-meta-badges">
  <span class="meta-badge meta-badge--platform"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> {meta['platform']}</span>
  <span class="meta-badge meta-badge--category"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line></svg> {meta['category']}</span>
  <span class="meta-badge meta-badge--difficulty"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg> {meta['difficulty']}</span>
  <span class="meta-badge meta-badge--date"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> {meta['date']}</span>
</div>

{body_markdown.strip()}
"""
    return header_block

  def generate_index_page(self, synced_pages: List[Dict[str, Any]]) -> str:
    """Generates the notion-content/README.md catalog table matching our aesthetic."""
    rows_html = []
    for p in sorted(synced_pages, key=lambda x: x["title"]):
      d_lower = p["difficulty"].lower()
      badge_class = "badge--medium"
      if "easy" in d_lower:
        badge_class = "badge--easy"
      elif "hard" in d_lower:
        badge_class = "badge--hard"

      plat = sanitize_platform_name(p.get("platform"))
      row = f"""  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="{plat}/{p['slug']}/" class="writeup-row__title">{p['title']}</a>
      <p class="writeup-row__desc">{p['description']}</p>
    </div>
    <span class="badge badge--platform">{p['platform']}</span>
    <span class="badge badge--category">{p['category']}</span>
    <span class="badge {badge_class}"><span class="badge-dot"></span>{p['difficulty']}</span>
  </div>"""
      rows_html.append(row)

    if not rows_html:
      rows_html.append("""  <div class="writeup-row">
    <div class="writeup-row__main">
      <span class="writeup-row__title" style="color: var(--terminal-text-muted);">No Published Writeups Yet</span>
      <p class="writeup-row__desc">Mark any writeup as Status = 'Published' in your Notion database to automatically sync it here.</p>
    </div>
    <span class="badge badge--platform">Notion</span>
    <span class="badge badge--category">Sync</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Ready</span>
  </div>""")

    rows_str = "\n\n".join(rows_html)

    return f"""# Notion Writeups

<div class="writeup-listing">
  <div class="writeup-listing__header">
    <span class="writeup-listing__col--title">Writeup / Topic</span>
    <span class="writeup-listing__col--platform">Platform</span>
    <span class="writeup-listing__col--category">Category</span>
    <span class="writeup-listing__col--difficulty">Difficulty</span>
  </div>

{rows_str}
</div>
"""

  def generate_platform_readme(self, platform_name: str, pages: List[Dict[str, Any]]) -> str:
    """Generates the notion-content/{platform}/README.md catalog table."""
    rows_html = []
    for p in sorted(pages, key=lambda x: x["title"]):
      d_lower = p["difficulty"].lower()
      badge_class = "badge--medium"
      if "easy" in d_lower:
        badge_class = "badge--easy"
      elif "hard" in d_lower:
        badge_class = "badge--hard"

      date_str = p.get("date") or ""
      date_badge = f'<span class="badge badge--date">{date_str}</span>' if date_str else ""
      desc_str = p.get("description") or f"{p['category']} challenge on {platform_name}."

      row = f"""  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="{p['slug']}/" class="writeup-row__title">{p['title']}</a>
      <p class="writeup-row__desc">{desc_str}</p>
    </div>
    <span class="badge badge--category">{p['category']}</span>
    <span class="badge {badge_class}"><span class="badge-dot"></span>{p['difficulty']}</span>
    {date_badge}
  </div>"""
      rows_html.append(row)

    if not rows_html:
      rows_html.append(f"""  <div class="writeup-row">
    <div class="writeup-row__main">
      <span class="writeup-row__title" style="color: var(--terminal-text-muted);">No {platform_name} Writeups Yet</span>
      <p class="writeup-row__desc">Published writeups tagged with Platform = '{platform_name}' will appear here.</p>
    </div>
  </div>""")

    rows_str = "\n\n".join(rows_html)

    return f"""# {platform_name} Writeups

<div class="platform-overview-hero">
  <div class="terminal-badge"><span class="terminal-dot"></span> PLATFORM ARCHIVE</div>
  <p class="platform-overview-desc">Comprehensive challenge walkthroughs and methodology documentation for {platform_name} cybersecurity challenges.</p>
</div>

<div class="writeup-listing">
  <div class="writeup-listing__header">
    <span class="writeup-listing__col--title">Challenge</span>
    <span class="writeup-listing__col--category">Category</span>
    <span class="writeup-listing__col--difficulty">Difficulty</span>
    <span class="writeup-listing__col--date">Date</span>
  </div>

{rows_str}
</div>
"""

  def update_homepage_recent_writeups(self, synced_pages: List[Dict[str, Any]]) -> None:
    """Updates the published writeups listing in index.md with latest writeups."""
    index_path = self.output_dir.parent / "index.md"
    if not index_path.exists():
      return

    # Sort pages by date descending, then title
    sorted_pages = sorted(
        synced_pages,
        key=lambda x: (x.get("date") or "", x.get("title") or ""),
        reverse=True,
    )

    rows_html = []
    for p in sorted_pages:
      d_lower = p["difficulty"].lower()
      badge_class = "badge--medium"
      if "easy" in d_lower:
        badge_class = "badge--easy"
      elif "hard" in d_lower:
        badge_class = "badge--hard"

      plat = sanitize_platform_name(p.get("platform"))
      slug = p["slug"]
      desc = p.get("description") or f"{p['category']} challenge solution and methodology walkthrough."

      row = f"""  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="{plat}/{slug}/" class="writeup-row__title">{p['title']}</a>
      <p class="writeup-row__desc">{desc}</p>
    </div>
    <span class="badge badge--platform">{p['platform']}</span>
    <span class="badge badge--category">{p['category']}</span>
    <span class="badge {badge_class}"><span class="badge-dot"></span>{p['difficulty']}</span>
  </div>"""
      rows_html.append(row)

    rows_str = "\n\n".join(rows_html)
    new_block = f"""<!-- RECENT_WRITEUPS_START -->
<div class="writeup-listing">
  <div class="writeup-listing__header">
    <span class="writeup-listing__col--title">Writeup / Topic</span>
    <span class="writeup-listing__col--platform">Platform</span>
    <span class="writeup-listing__col--category">Category</span>
    <span class="writeup-listing__col--difficulty">Difficulty</span>
  </div>

{rows_str}
</div>
<!-- RECENT_WRITEUPS_END -->"""

    content = index_path.read_text(encoding="utf-8")
    if "<!-- RECENT_WRITEUPS_START -->" in content and "<!-- RECENT_WRITEUPS_END -->" in content:
      pattern = r"<!-- RECENT_WRITEUPS_START -->.*?<!-- RECENT_WRITEUPS_END -->"
      updated_content = re.sub(pattern, new_block, content, flags=re.DOTALL)
    elif '<div class="writeup-listing">' in content:
      pattern = r'<div class="writeup-listing">.*?</div>\s*(?=\n---|\Z)'
      updated_content = re.sub(pattern, new_block + "\n", content, flags=re.DOTALL)
    else:
      return

    if updated_content.strip() != content.strip() and not self.dry_run:
      index_path.write_text(updated_content, encoding="utf-8")
      if str(index_path) not in self.files_modified:
        self.files_modified.append(str(index_path))
      print("Updated homepage recent writeups in index.md.")

  def sync(self) -> Dict[str, Any]:
    """Main synchronization execution loop."""
    self.files_added = []
    self.files_modified = []
    self.files_deleted = []

    print("Connecting to Notion API...")
    ok, diag = self.verify_connection()
    if not ok:
      print(f"\n[ERROR] {diag}\n")
      sys.exit(1)

    print(f"[OK] {diag}")
    print("Querying pages with Status = 'Published'...")
    pages = self.query_published_pages()
    print(f"Found {len(pages)} published page(s) in database.")

    self.output_dir.mkdir(parents=True, exist_ok=True)
    self.assets_dir.mkdir(parents=True, exist_ok=True)

    seen_page_ids: Set[str] = set()
    used_slugs: Dict[str, str] = {}
    synced_meta_list: List[Dict[str, Any]] = []

    for page in pages:
      meta = self.extract_page_metadata(page)
      page_id = meta["id"]
      seen_page_ids.add(page_id)

      # Handle slug collisions
      slug = meta["slug"]
      if slug in used_slugs and used_slugs[slug] != page_id:
        slug = f"{slug}-{page_id[:6]}"
        meta["slug"] = slug
      used_slugs[slug] = page_id

      platform_name = sanitize_platform_name(meta.get("platform"))
      platform_dir = self.output_dir / platform_name
      platform_dir.mkdir(parents=True, exist_ok=True)

      target_file = platform_dir / f"{slug}.md"
      rel_target_path = f"{platform_name}/{slug}.md"

      # Check manifest to determine if re-download is needed
      cached = self.manifest.get(page_id)
      cached_path = cached.get("path") if cached else None
      if not cached_path and cached:
        cached_path = f"{cached.get('platform', platform_name)}/{cached.get('slug', slug)}.md"
      cached_file = self.output_dir / cached_path if cached_path else None

      if (
          cached
          and cached.get("last_edited_time") == meta["last_edited_time"]
          and cached_file
          and cached_file.exists()
          and cached.get("slug") == slug
          and cached.get("platform") == platform_name
      ):
        # Page is unchanged
        synced_meta_list.append(meta)
        continue

      # If file moved to another platform, remove old file
      if cached_file and cached_file.exists() and cached_file != target_file and not self.dry_run:
        cached_file.unlink()

      print(f"Syncing: '{meta['title']}' -> notion-content/{platform_name}/{slug}.md")
      blocks = self.get_block_children(page_id)
      body_md = self.convert_blocks_to_markdown(blocks, slug)
      full_md = self.build_page_markdown(meta, body_md)

      if not self.dry_run:
        is_new = not target_file.exists()
        with open(target_file, "w", encoding="utf-8") as f:
          f.write(full_md)

        content_hash = hashlib.sha256(full_md.encode()).hexdigest()
        self.manifest[page_id] = {
            "slug": slug,
            "title": meta["title"],
            "platform": platform_name,
            "path": rel_target_path,
            "last_edited_time": meta["last_edited_time"],
            "hash": content_hash,
            "synced_at": datetime.now(timezone.utc).isoformat(),
        }

        if is_new:
          self.files_added.append(str(target_file))
        else:
          self.files_modified.append(str(target_file))

      synced_meta_list.append(meta)

    # Clean up deleted / unpublished pages
    to_delete = []
    for cached_id, info in list(self.manifest.items()):
      if cached_id not in seen_page_ids:
        cached_path = info.get("path") or f"{info.get('slug')}.md"
        orphan_file = self.output_dir / cached_path
        if orphan_file.exists() and not self.dry_run:
          orphan_file.unlink()
          self.files_deleted.append(str(orphan_file))
          print(f"Removed unpublished writeup: {orphan_file}")
        to_delete.append(cached_id)

    for pid in to_delete:
      del self.manifest[pid]

    # Group by platform
    pages_by_platform: Dict[str, List[Dict[str, Any]]] = collections.defaultdict(list)
    for m in synced_meta_list:
      p_name = sanitize_platform_name(m.get("platform"))
      pages_by_platform[p_name].append(m)

    # Generate README.md and .pages for each platform
    for p_name, p_pages in pages_by_platform.items():
      p_dir = self.output_dir / p_name
      if not self.dry_run:
        p_dir.mkdir(parents=True, exist_ok=True)
        # 1. Platform .pages
        p_pages_file = p_dir / ".pages"
        pages_content = f"title: {p_name}\narrange:\n  - README.md\n  - \"...\"\n"
        if not p_pages_file.exists() or p_pages_file.read_text(encoding="utf-8").strip() != pages_content.strip():
          p_pages_file.write_text(pages_content, encoding="utf-8")

        # 2. Platform README.md
        p_readme = p_dir / "README.md"
        p_readme_content = self.generate_platform_readme(p_name, p_pages)
        if not p_readme.exists() or p_readme.read_text(encoding="utf-8").strip() != p_readme_content.strip():
          p_readme.write_text(p_readme_content, encoding="utf-8")

    # Update homepage recent writeups
    self.update_homepage_recent_writeups(synced_meta_list)

    # Update notion-content/README.md catalog
    readme_path = self.output_dir / "README.md"
    new_readme_content = self.generate_index_page(synced_meta_list)

    readme_changed = True
    is_new_readme = not readme_path.exists()
    if not is_new_readme:
      with open(readme_path, "r", encoding="utf-8") as f:
        if f.read().strip() == new_readme_content.strip():
          readme_changed = False

    if readme_changed and not self.dry_run:
      with open(readme_path, "w", encoding="utf-8") as f:
        f.write(new_readme_content)
      if is_new_readme:
        self.files_added.append(str(readme_path))
      else:
        self.files_modified.append(str(readme_path))

    self._save_manifest()

    total_changes = (
        len(self.files_added)
        + len(self.files_modified)
        + len(self.files_deleted)
    )
    print("\n" + "=" * 50)
    print(
        f"Sync Completed: {len(synced_meta_list)} page(s) currently published."
    )
    print(
        f"Changes: {len(self.files_added)} added, {len(self.files_modified)}"
        f" modified, {len(self.files_deleted)} deleted."
    )
    print("=" * 50 + "\n")

    return {
        "has_changes": total_changes > 0,
        "files_added": self.files_added,
        "files_modified": self.files_modified,
        "files_deleted": self.files_deleted,
        "published_count": len(synced_meta_list),
    }


def main():
  parser = argparse.ArgumentParser(
      description="Sync published writeups from Notion into GitHub repository."
  )
  parser.add_argument(
      "--check-connection",
      action="store_true",
      help="Only verify Notion database access and exit without syncing.",
  )
  parser.add_argument(
      "--dry-run",
      action="store_true",
      help="Query Notion and log changes without writing files to disk.",
  )
  parser.add_argument(
      "--output-dir",
      type=Path,
      default=Path("notion-content"),
      help="Output directory for synced writeup Markdown files.",
  )
  parser.add_argument(
      "--assets-dir",
      type=Path,
      default=Path("assets"),
      help="Assets directory for downloaded images.",
  )

  args = parser.parse_args()

  api_key = os.environ.get("NOTION_API_KEY", "").strip()
  database_id = os.environ.get("NOTION_DATABASE_ID", "").strip()

  if not api_key or not database_id:
    print("[ERROR] Missing required Notion environment variables.")
    print("  NOTION_API_KEY is not set.") if not api_key else None
    print("  NOTION_DATABASE_ID is not set.") if not database_id else None
    print("\nIn GitHub Actions, configure secrets:")
    print("  - NOTION_API_KEY: Internal Integration Secret from Notion")
    print("  - NOTION_DATABASE_ID: 32-character ID from Notion database URL")
    sys.exit(1)

  client = NotionSyncClient(
      api_key=api_key,
      database_id=database_id,
      output_dir=args.output_dir,
      assets_dir=args.assets_dir,
      dry_run=args.dry_run,
  )

  if args.check_connection:
    ok, msg = client.verify_connection()
    if ok:
      print(f"[OK] {msg}")
      sys.exit(0)
    else:
      print(f"[FAIL] {msg}")
      sys.exit(1)

  results = client.sync()

  # Output for GitHub Actions step outputs if running in CI
  github_output = os.environ.get("GITHUB_OUTPUT")
  if github_output and os.path.exists(github_output):
    with open(github_output, "a", encoding="utf-8") as f:
      f.write(f"has_changes={'true' if results['has_changes'] else 'false'}\n")
      f.write(f"published_count={results['published_count']}\n")


if __name__ == "__main__":
  main()
