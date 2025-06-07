#!/usr/bin/env python3
"""
Debug script to test all imports from app_real.py
"""

print("🔍 Testing imports...")

try:
    from fastapi import FastAPI, HTTPException
    print("✅ FastAPI imports OK")
except ImportError as e:
    print(f"❌ FastAPI import error: {e}")

try:
    from fastapi.middleware.cors import CORSMiddleware
    print("✅ CORS middleware OK")
except ImportError as e:
    print(f"❌ CORS import error: {e}")

try:
    from fastapi.staticfiles import StaticFiles
    print("✅ StaticFiles OK")
except ImportError as e:
    print(f"❌ StaticFiles import error: {e}")

try:
    from fastapi.responses import FileResponse, JSONResponse
    print("✅ FastAPI responses OK")
except ImportError as e:
    print(f"❌ FastAPI responses import error: {e}")

try:
    from pydantic import BaseModel
    print("✅ Pydantic OK")
except ImportError as e:
    print(f"❌ Pydantic import error: {e}")

try:
    import os
    print("✅ OS module OK")
except ImportError as e:
    print(f"❌ OS import error: {e}")

try:
    import uvicorn
    print("✅ Uvicorn OK")
except ImportError as e:
    print(f"❌ Uvicorn import error: {e}")

try:
    from pathlib import Path
    print("✅ Pathlib OK")
except ImportError as e:
    print(f"❌ Pathlib import error: {e}")

try:
    import httpx
    print("✅ HTTPX OK")
    print(f"   HTTPX version: {httpx.__version__}")
except ImportError as e:
    print(f"❌ HTTPX import error: {e}")

try:
    from typing import Optional
    print("✅ Typing OK")
except ImportError as e:
    print(f"❌ Typing import error: {e}")

print("\n🔍 All import tests completed!")
print("If any imports failed, that's the source of your problem.") 