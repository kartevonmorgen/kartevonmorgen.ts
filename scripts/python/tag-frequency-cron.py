import os
import sys
import argparse
import asyncio
import aioschedule as schedule
import urls
import grequests
import time

from loguru import logger
from typing import NamedTuple, List, Optional, Generator
from dotenv import dotenv_values
from math import ceil
from pathlib import PurePath, Path
from sqlalchemy import String, Integer, Column
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker

LIMIT_OF_TAGS = 1000
DEFAULT_LAST_N_TAGS = 200
DB_CHUNK_SIZE = 200

parser = argparse.ArgumentParser()
parser.add_argument(
    '--fetch-all-on-start',
    action='store_true'
)
parser.add_argument(
    '--interval-for-all-tags',
    '--ia',
    type=int,
    default=60,
    help="interval of fetching all tags in seconds"
)
parser.add_argument(
    '--interval-for-least-used-tags',
    '--iln',
    type=int,
    default=60,
    help="interval of fetching least used tags in seconds"
)
parser.add_argument(
    '--n-least-used-tags',
    '--n',
    type=int,
    default=DEFAULT_LAST_N_TAGS,
)
parser.add_argument(
    '--dev',
    action='store_true'
)
parser.add_argument(
    '--sync-once',
    action='store_true'
)
parser.add_argument(
    '--log-level',
    choices=[
        'critical',
        'error',
        'warning',
        'success',
        'info',
        'debug',
        'trace'
    ],
    default='info'
)
args = parser.parse_args()

default_config = dotenv_values('../../.env')
customized_config = {
    'DB_NAME': 'kartevonmorgen.sqlite'
}
if Path('../../.env.production').exists():
    customized_config = dotenv_values('../../.env.production')

if args.dev:
    customized_config = dotenv_values('../../.env.development')

config = {
    **default_config,
    **customized_config,
    **os.environ
}

DB_PATH = PurePath('../../db').joinpath(config['DB_NAME'])

logger.remove()
logger.add(sys.stdout, level=args.log_level.upper())

# initialize database engine and base class
engine = create_async_engine(f"sqlite+aiosqlite:///{DB_PATH}")
async_session: Optional[AsyncSession] = None
Base = declarative_base()


class TagFrequencyDTO(NamedTuple):
    tag: str
    frequency: int


class TagFrequency(Base):
    __tablename__ = 'tag_frequency'

    tag = Column(String, primary_key=True)
    frequency = Column(Integer)


def request_exception_handler(_request, exception):
    raise exception


def count_tags() -> int:
    logger.debug("counting tags")
    tag_count_url = f"{config['NEXT_PUBLIC_BASICS_API']}/{urls.COUNT_TAGS}"
    request = grequests.get(tag_count_url)
    responses = grequests.map((request,), exception_handler=request_exception_handler)
    response = responses[0]

    number_of_tags = response.json()
    logger.debug(f"total number of tags: {number_of_tags}")

    return number_of_tags


def fetch_tags_frequencies(number_of_tags: int, base_offset: int = 0) -> List[TagFrequencyDTO]:
    try:
        logger.info(f"start fetching tag frequencies: {number_of_tags}, offset: {base_offset}")

        number_of_required_iterations: int = ceil(number_of_tags / LIMIT_OF_TAGS)
        most_popular_tags_url = f"{config['NEXT_PUBLIC_BASICS_API']}{urls.MOST_POPULAR_TAGS}"

        tag_frequency_urls = []
        for i in range(number_of_required_iterations):
            url = f"{most_popular_tags_url}?limit={LIMIT_OF_TAGS}&offset={i * LIMIT_OF_TAGS + base_offset}"
            tag_frequency_urls.append(url)

        requests = (grequests.get(tag_frequency_url) for tag_frequency_url in tag_frequency_urls)
        responses = grequests.map(requests, exception_handler=request_exception_handler)

        aggregated_responses: List[TagFrequencyDTO] = []
        for response in responses:
            aggregated_responses.extend(
                map(
                    lambda tag_frequency_list: TagFrequencyDTO(*tag_frequency_list),
                    response.json()
                )
            )

        logger.success(f"fetching tags frequencies completed: {number_of_tags}")
        logger.trace(f"aggregated responses: {aggregated_responses}")

    except Exception as e:
        logger.error(f"api failed: {e}")
        return []

    return aggregated_responses


def fetch_all_tags_frequencies():
    number_of_tags = count_tags()

    return fetch_tags_frequencies(number_of_tags)


def chunk_tags_frequencies(tag_frequencies: List[TagFrequencyDTO]) -> Generator[List[TagFrequencyDTO], None, None]:
    for i in range(len(tag_frequencies) // DB_CHUNK_SIZE):
        start = i * DB_CHUNK_SIZE
        end = start + DB_CHUNK_SIZE

        yield tag_frequencies[start:end]


async def update_or_insert_tags_frequencies(tag_frequencies: List[TagFrequencyDTO]):
    logger.info("start upserting tags frequencies")

    total_number_of_chunks: int = len(tag_frequencies) // DB_CHUNK_SIZE

    try:
        async with async_session() as session:

            chunk_seq_number: int = 1
            for chunk_to_upsert in chunk_tags_frequencies(tag_frequencies):
                logger.debug(f"upserting chunk: #{chunk_seq_number}")
                logger.trace(f"chunk #{chunk_seq_number}: {chunk_to_upsert}")

                merges: List[asyncio.Future] = []
                async with session.begin():
                    for tag_frequency in chunk_to_upsert:
                        merge = session.merge(
                            TagFrequency(tag=tag_frequency.tag, frequency=tag_frequency.frequency)
                        )
                        merges.append(merge)

                await asyncio.gather(*merges)
                await session.commit()

                logger.debug(f"upserting chunk completed: #{chunk_seq_number}/{total_number_of_chunks}")

                chunk_seq_number += 1

        logger.success("upserting tags frequencies completed")

    except Exception as e:
        logger.error(f"DB failed: {e}")


async def fetch_and_store_all_tags_frequencies():
    logger.info("start fetching and upserting all tags frequencies")

    tags_frequencies = fetch_all_tags_frequencies()
    await update_or_insert_tags_frequencies(tags_frequencies)


async def fetch_and_store_last_n_tags_frequencies():
    logger.info(f"start fetching and upserting last {args.n_least_used_tags} tags frequencies")

    number_of_tags = count_tags()
    offset = max(0, number_of_tags - args.n_least_used_tags)
    tags_frequencies = fetch_tags_frequencies(number_of_tags, offset)
    await update_or_insert_tags_frequencies(tags_frequencies)


async def initialize_db():
    global async_session

    logger.info(f"initializing db: {DB_PATH}")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    logger.success("DB initialized")


async def async_main():
    await initialize_db()

    if args.fetch_all_on_start:
        await fetch_and_store_all_tags_frequencies()

    if args.sync_once:
        return

    schedule \
        .every(args.interval_for_all_tags) \
        .seconds \
        .do(fetch_and_store_all_tags_frequencies)

    schedule \
        .every(args.interval_for_least_used_tags) \
        .seconds \
        .do(fetch_and_store_last_n_tags_frequencies)

    while True:
        await schedule.run_pending()
        time.sleep(1)


if __name__ == '__main__':
    try:
        asyncio.run(async_main())
    except KeyboardInterrupt:
        logger.success("stopping because of keyboard interrupt")
