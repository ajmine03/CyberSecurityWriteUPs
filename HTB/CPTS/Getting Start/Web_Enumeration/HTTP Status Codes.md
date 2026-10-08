# HTTP Status Codes

Web enumeration-এর output বুঝতে HTTP status code জানা গুরুত্বপূর্ণ।

এই section-এ বিশেষভাবে তিনটি code দেখানো হয়েছে।

| Code | সহজ অর্থ | Enumeration-এ কী বোঝায় |
|---|---|---|
| `200` | OK / successful | Resource request successful হয়েছে |
| `301` | Redirect | Resource অন্য location-এ redirect করছে |
| `403` | Forbidden | Resource access করতে permission নেই |

## Example

Gobuster output:

```text
/index.php     (Status: 200)
/server-status (Status: 403)
/wordpress     (Status: 301)
```

### `200`

```text
/index.php → 200
```

মানে request সফল হয়েছে।

### `403`

```text
/server-status → 403
```

মানে access forbidden।

### `301`

```text
/wordpress → 301
```

মানে redirect হয়েছে; এটি automatically failure নয়।

> Enumeration-এর সময় `403` বা `301` result-কে simply ignore না করে context অনুযায়ী investigate করা গুরুত্বপূর্ণ।
