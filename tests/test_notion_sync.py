#!/usr/bin/env python3
"""Unit and Integration Tests for Notion Synchronizer (scripts/notion_sync.py)."""

import hashlib
import json
import os
import shutil
import tempfile
import unittest
from unittest.mock import MagicMock, patch
from pathlib import Path

# Add scripts directory to path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from notion_sync import (
    clean_database_id,
    slugify,
    NotionSyncClient,
)


class TestNotionSyncUtils(unittest.TestCase):

  def test_clean_database_id(self):
    # Plain 32-char hex
    self.assertEqual(
        clean_database_id("a1b2c3d4e5f60718293a4b5c6d7e8f90"),
        "a1b2c3d4e5f60718293a4b5c6d7e8f90",
    )
    # Hyphenated UUID
    self.assertEqual(
        clean_database_id("a1b2c3d4-e5f6-0718-293a-4b5c6d7e8f90"),
        "a1b2c3d4e5f60718293a4b5c6d7e8f90",
    )
    # Full URL
    self.assertEqual(
        clean_database_id(
            "https://www.notion.so/myworkspace/a1b2c3d4e5f60718293a4b5c6d7e8f90?v=123"
        ),
        "a1b2c3d4e5f60718293a4b5c6d7e8f90",
    )

  def test_slugify(self):
    self.assertEqual(
        slugify("PicoCTF 2024: WebDecode Solution!"), "picoctf-2024-webdecode-solution"
    )
    self.assertEqual(
        slugify("Hack The Box — Nmap Scanning"), "hack-the-box-nmap-scanning"
    )
    self.assertEqual(slugify("   "), "untitled-writeup")


class TestNotionSyncClient(unittest.TestCase):

  def setUp(self):
    self.temp_dir = tempfile.mkdtemp()
    self.output_dir = Path(self.temp_dir) / "notion-content"
    self.assets_dir = Path(self.temp_dir) / "assets"
    self.client = NotionSyncClient(
        api_key="secret_test_mock_token_123",
        database_id="a1b2c3d4e5f60718293a4b5c6d7e8f90",
        output_dir=self.output_dir,
        assets_dir=self.assets_dir,
        dry_run=False,
    )

  def tearDown(self):
    shutil.rmtree(self.temp_dir, ignore_errors=True)

  @patch("requests.get")
  def test_verify_connection_success(self, mock_get):
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "title": [{"plain_text": "Cyber Security Writeups"}]
    }
    mock_get.return_value = mock_resp

    ok, msg = self.client.verify_connection()
    self.assertTrue(ok)
    self.assertIn("Cyber Security Writeups", msg)

  @patch("requests.get")
  def test_verify_connection_404_troubleshooting_guidance(self, mock_get):
    mock_resp = MagicMock()
    mock_resp.status_code = 404
    mock_get.return_value = mock_resp

    ok, msg = self.client.verify_connection()
    self.assertFalse(ok)
    self.assertIn("HOW TO FIX:", msg)
    self.assertIn("Connections", msg)
    self.assertIn("Add connections", msg)

  @patch("requests.get")
  def test_verify_connection_401_invalid_key(self, mock_get):
    mock_resp = MagicMock()
    mock_resp.status_code = 401
    mock_get.return_value = mock_resp

    ok, msg = self.client.verify_connection()
    self.assertFalse(ok)
    self.assertIn("NOTION_API_KEY", msg)
    self.assertIn("HTTP 401", msg)

  def test_extract_page_metadata(self):
    page_data = {
        "id": "page-uuid-1",
        "created_time": "2026-03-10T12:00:00.000Z",
        "last_edited_time": "2026-03-11T15:30:00.000Z",
        "properties": {
            "Title": {
                "type": "title",
                "title": [{"plain_text": "WebDecode PicoCTF"}],
            },
            "Platform": {
                "type": "select",
                "select": {"name": "picoCTF"},
            },
            "Category": {
                "type": "select",
                "select": {"name": "Web Exploitation"},
            },
            "Difficulty": {
                "type": "select",
                "select": {"name": "Easy"},
            },
            "Slug": {
                "type": "rich_text",
                "rich_text": [{"plain_text": "webdecode-pico"}],
            },
            "Description": {
                "type": "rich_text",
                "rich_text": [{"plain_text": "Base64 payload analysis"}],
            },
        },
    }

    meta = self.client.extract_page_metadata(page_data)
    self.assertEqual(meta["title"], "WebDecode PicoCTF")
    self.assertEqual(meta["slug"], "webdecode-pico")
    self.assertEqual(meta["platform"], "picoCTF")
    self.assertEqual(meta["category"], "Web Exploitation")
    self.assertEqual(meta["difficulty"], "Easy")
    self.assertEqual(meta["description"], "Base64 payload analysis")

  def test_convert_rich_text(self):
    rich_text = [
        {"plain_text": "Normal "},
        {"plain_text": "bold", "annotations": {"bold": True}},
        {"plain_text": " and "},
        {"plain_text": "code", "annotations": {"code": True}},
        {"plain_text": " with "},
        {"plain_text": "link", "href": "https://example.com"},
    ]
    md = self.client._convert_rich_text(rich_text)
    self.assertEqual(md, "Normal **bold** and `code` with [link](https://example.com)")

  def test_convert_blocks_to_markdown(self):
    blocks = [
        {
            "type": "heading_1",
            "heading_1": {"rich_text": [{"plain_text": "Challenge Header"}]},
        },
        {
            "type": "paragraph",
            "paragraph": {"rich_text": [{"plain_text": "This is a solution."}]},
        },
        {
            "type": "code",
            "code": {
                "language": "python",
                "rich_text": [{"plain_text": "print('flag{1337}')"}],
            },
        },
        {
            "type": "callout",
            "callout": {
                "icon": {"emoji": "⚠️"},
                "rich_text": [{"plain_text": "Always test locally first."}],
            },
        },
        {
            "type": "to_do",
            "to_do": {
                "checked": True,
                "rich_text": [{"plain_text": "Inspect cookies"}],
            },
        },
        {
            "type": "divider",
            "divider": {},
        },
    ]

    md = self.client.convert_blocks_to_markdown(blocks, "sample-page")
    self.assertIn("# Challenge Header", md)
    self.assertIn("This is a solution.", md)
    self.assertIn("```python\nprint('flag{1337}')\n```", md)
    self.assertIn('!!! tip "Note ⚠️"', md)
    self.assertIn("Always test locally first.", md)
    self.assertIn("- [x] Inspect cookies", md)
    self.assertIn("---", md)

  @patch("requests.get")
  def test_download_image(self, mock_get):
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.content = b"\x89PNG\r\n\x1a\nFakePngData"
    mock_get.return_value = mock_resp

    image_url = "https://s3.us-west-2.amazonaws.com/notion-secure/test.png?X-Amz-Signature=xyz"
    local_path = self.client.download_image(image_url, "my-writeup")

    self.assertTrue(local_path.startswith("../assets/notion/my-writeup/img_"))
    self.assertTrue(local_path.endswith(".png"))

    # Verify file was written to disk
    downloaded_file = self.assets_dir / "notion" / "my-writeup" / Path(local_path).name
    self.assertTrue(downloaded_file.exists())
    self.assertEqual(downloaded_file.read_bytes(), b"\x89PNG\r\n\x1a\nFakePngData")

  @patch.object(NotionSyncClient, "verify_connection")
  @patch.object(NotionSyncClient, "query_published_pages")
  @patch.object(NotionSyncClient, "get_block_children")
  def test_sync_loop_and_manifest(self, mock_blocks, mock_pages, mock_verify):
    mock_verify.return_value = (True, "OK")
    mock_pages.return_value = [
        {
            "id": "p1",
            "last_edited_time": "2026-03-12T10:00:00Z",
            "properties": {
                "Title": {"type": "title", "title": [{"plain_text": "Based Challenge"}]},
                "Status": {"type": "status", "status": {"name": "Published"}},
                "Difficulty": {"type": "select", "select": {"name": "Medium"}},
                "Platform": {"type": "select", "select": {"name": "picoCTF"}},
                "Category": {"type": "select", "select": {"name": "General Skills"}},
            },
        }
    ]
    mock_blocks.return_value = [
        {
            "type": "paragraph",
            "paragraph": {"rich_text": [{"plain_text": "Convert binary into ASCII."}]},
        }
    ]

    res = self.client.sync()
    self.assertTrue(res["has_changes"])
    self.assertEqual(res["published_count"], 1)

    # Verify writeup markdown file exists
    writeup_file = self.output_dir / "based-challenge.md"
    self.assertTrue(writeup_file.exists())
    content = writeup_file.read_text()
    self.assertIn("title: Based Challenge", content)
    self.assertIn("Convert binary into ASCII.", content)

    # Verify README catalog was generated
    readme_file = self.output_dir / "README.md"
    self.assertTrue(readme_file.exists())
    self.assertIn("Based Challenge", readme_file.read_text())

    # Second sync without edits -> no changes
    res_second = self.client.sync()
    self.assertFalse(res_second["has_changes"])


if __name__ == "__main__":
  unittest.main()
