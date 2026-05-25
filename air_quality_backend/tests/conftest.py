import os
import sys
from pathlib import Path

import pytest


@pytest.fixture(scope="session")
def app_module():
    os.environ["SKIP_DB_INIT"] = "1"
    backend_dir = Path(__file__).resolve().parents[1] / "backend"
    sys.path.insert(0, str(backend_dir))
    import app as app_module_ref

    app_module_ref.app.config.update({"TESTING": True})
    return app_module_ref


@pytest.fixture()
def client(app_module):
    return app_module.app.test_client()
