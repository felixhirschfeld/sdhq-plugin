import asyncio
import json
import ssl
import urllib.request
from json import JSONDecodeError
from urllib.error import HTTPError, URLError

import decky

POSTS_URL = "https://steamdeckhq.com/wp-json/wp/v2/posts?per_page=3"
SETTINGS_URL = (
    "https://steamdeckhq.com/wp-json/wp/v2/game-reviews/"
    "?meta_key=steam_app_id&meta_value={appid}"
)
REVIEWS_URL = "https://steamdeckhq.com/wp-json/wp/v2/game-reviews/?per_page=3"
STORE_TABS_URL = "http://localhost:8080/json"
USER_AGENT = "SteamDeckHQDeckyPlugin/1.0"


def _request_json(url: str):
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    context = ssl.create_default_context() if url.startswith("https://") else None

    with urllib.request.urlopen(request, context=context, timeout=10) as response:
        return json.load(response)


def _extract_app_id(url: str) -> str | None:
    if "/library/app/" in url:
        return url.split("/library/app/")[1].split("/")[0]

    if "store.steampowered.com/app/" in url:
        return url.split("/app/")[1].split("?")[0].split("/")[0]

    return None


class Plugin:
    async def _main(self):
        decky.logger.info("Steam Deck HQ plugin loaded")

    async def _unload(self):
        decky.logger.info("Steam Deck HQ plugin unloaded")

    async def _fetch_json(self, url: str):
        try:
            return await asyncio.to_thread(_request_json, url)
        except (HTTPError, URLError, TimeoutError, JSONDecodeError) as err:
            decky.logger.error(f"Request failed for {url}: {err}")
            return None
        except Exception as err:
            decky.logger.error(
                f"Unexpected error while requesting {url}: {err}", exc_info=True
            )
            return None

    async def get_news(self):
        posts = await self._fetch_json(POSTS_URL)
        return posts if isinstance(posts, list) else []

    async def get_latest_reviews(self):
        reviews = await self._fetch_json(REVIEWS_URL)
        return reviews if isinstance(reviews, list) else []

    async def get_review_for_app(self, app_id: str):
        if not app_id:
            return None

        reviews = await self._fetch_json(SETTINGS_URL.format(appid=app_id))
        if isinstance(reviews, list) and reviews:
            return reviews[0]

        return None

    async def get_store_app_id(self):
        tabs = await self._fetch_json(STORE_TABS_URL)
        if not isinstance(tabs, list):
            return None

        for tab in tabs:
            if not isinstance(tab, dict):
                continue

            url = tab.get("url")
            if not isinstance(url, str):
                continue

            app_id = _extract_app_id(url)
            if app_id:
                return app_id

        return None
