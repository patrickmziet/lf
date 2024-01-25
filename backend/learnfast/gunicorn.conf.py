from dotenv import load_dotenv
from decouple import config as conf
from pathlib import Path
#from common.utils import get_env_var
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / 'learnfast' / '.env')

#load_dotenv()

wsgi_app = "learnfast.wsgi"
PORT = conf("PORT")
bind = f"0.0.0.0:{PORT}"