#!/usr/bin/env python3
import json
from app.db import get_engine, init_dev_sqlite, test_connection


def main() -> None:
    engine = get_engine()
    init_dev_sqlite(engine)
    result = test_connection(engine)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
