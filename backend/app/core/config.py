# -*- coding: utf-8 -*-
# @author: xiaobai

import secrets
import warnings
from typing import Annotated, Any, Literal
from pathlib import Path
from pydantic import (
    AnyUrl,
    BeforeValidator,
    HttpUrl,
    PostgresDsn,
    computed_field,
    model_validator,
)
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Self


project_banner = """
     ██     ██           ███████   ████████ ████     ████   ███████  
    ████   ░██          ░██░░░░██ ░██░░░░░ ░██░██   ██░██  ██░░░░░██ 
   ██░░██  ░██          ░██    ░██░██      ░██░░██ ██ ░██ ██     ░░██
  ██  ░░██ ░██   █████  ░██    ░██░███████ ░██ ░░███  ░██░██      ░██
 ██████████░██  ░░░░░   ░██    ░██░██░░░░  ░██  ░░█   ░██░██      ░██
░██░░░░░░██░██          ░██    ██ ░██      ░██   ░    ░██░░██     ██ 
░██     ░██░██          ░███████  ░████████░██        ░██ ░░███████  
░░      ░░ ░░           ░░░░░░░   ░░░░░░░░ ░░         ░░   ░░░░░░░   
"""
__version__ = "0.0.0"

project_desc = """
    THIS IS FAST API DEMO
"""


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )
    GLOBAL_ENCODING: str = "utf8"  # 全局编码
    PROJECT_DESC: str = project_desc  # 描述
    PROJECT_BANNER: str = project_banner  # banner
    PROJECT_VERSION: str = __version__  # 版本
    API_STR: str = "/api"
    API_V1_STR: str = "/api/v1"
    STATIC_DIR: str = "static"  # 静态文件目录
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    DOMAIN: str = "localhost"
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    @computed_field  # type: ignore[misc]
    @property
    def server_host(self) -> str:
        # Use HTTPS for anything other than local development
        if self.ENVIRONMENT == "local":
            return f"http://{self.DOMAIN}"
        return f"https://{self.DOMAIN}"

    BACKEND_CORS_ORIGINS: Annotated[list[AnyUrl] | str, BeforeValidator(parse_cors)] = (
        []
    )

    # project
    PROJECT_NAME: str | None = None
    SENTRY_DSN: HttpUrl | None = None
    POSTGRES_SERVER: str | None = None
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str | None = None
    POSTGRES_PASSWORD: str | None = None
    POSTGRES_DB: str = ""

    # DATABASE
    DATABASE_URI: str = (
        "sqlite:///D:/db/ts_yi.db?check_same_thread=False"  # Sqlite(异步)
    )
    ASYNC_DATABASE_URI: str = (
        "sqlite+aiosqlite:///D:/db/ts_yi.db?check_same_thread=False"  # Sqlite(异步)
    )
    # DATABASE_URI: str = Field(..., env="MYSQL_DATABASE_URI")  # MySQL(异步)
    DATABASE_ECHO: bool = (
        True  # 是否打印数据库日志 (可看到创建表、表数据增删改查的信息)
    )

    # logger
    LOGGER_DIR: str = "logs"  # 日志文件夹名
    LOGGER_NAME: str = (
        "ai-demo.log"  # 日志文件名  (时间格式 {time:YYYY-MM-DD_HH-mm-ss}.log)
    )
    LOGGER_LEVEL: str = "DEBUG"  # 日志等级: ['DEBUG' | 'INFO']
    LOGGER_ROTATION: str = (
        "10 MB"  # 日志分片: 按 时间段/文件大小 切分日志. 例如 ["500 MB" | "12:00" | "1 week"]
    )
    LOGGER_RETENTION: str = (
        "7 days"  # 日志保留的时间: 超出将删除最早的日志. 例如 ["1 days"]
    )

    PROJECT_ROOT_DIR: str = Path(__file__).parent.as_posix()

    @computed_field  # type: ignore[misc]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return MultiHostUrl.build(
            scheme="postgresql+psycopg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )

    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    SMTP_PORT: int = 587
    SMTP_HOST: str | None = None
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    # TODO: update type to EmailStr when sqlmodel supports it
    EMAILS_FROM_EMAIL: str | None = None
    EMAILS_FROM_NAME: str | None = None

    @model_validator(mode="after")
    def _set_default_emails_from(self) -> Self:
        if not self.EMAILS_FROM_NAME:
            self.EMAILS_FROM_NAME = self.PROJECT_NAME
        return self

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48

    @computed_field  # type: ignore[misc]
    @property
    def emails_enabled(self) -> bool:
        return bool(self.SMTP_HOST and self.EMAILS_FROM_EMAIL)

    # TODO: update type to EmailStr when sqlmodel supports it
    EMAIL_TEST_USER: str = "test@example.com"
    # TODO: update type to EmailStr when sqlmodel supports it
    FIRST_SUPERUSER: str | None = None
    FIRST_SUPERUSER_PASSWORD: str | None = None
    USERS_OPEN_REGISTRATION: bool = False

    def _check_default_secret(self, var_name: str, value: str | None) -> None:
        if value == "changethis":
            message = (
                f'The value of {var_name} is "changethis", '
                "for security, please change it, at least for deployments."
            )
            if self.ENVIRONMENT == "local":
                warnings.warn(message, stacklevel=1)
            else:
                raise ValueError(message)

    @model_validator(mode="after")
    def _enforce_non_default_secrets(self) -> Self:
        self._check_default_secret("SECRET_KEY", self.SECRET_KEY)
        self._check_default_secret("POSTGRES_PASSWORD", self.POSTGRES_PASSWORD)
        self._check_default_secret(
            "FIRST_SUPERUSER_PASSWORD", self.FIRST_SUPERUSER_PASSWORD
        )

        return self


settings = Settings()
