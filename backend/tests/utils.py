import secrets
import string
from typing import Any


def generate_random_string(length: int) -> str:
    return "".join(secrets.choice(string.ascii_lowercase) for i in range(length))
