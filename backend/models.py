"""Compatibility exports; new code should import from :mod:`backend.app.models`."""

from .app.models import LoginHistory, Product

__all__ = ["LoginHistory", "Product"]
