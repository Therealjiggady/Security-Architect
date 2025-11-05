import os, datetime
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

# Support verifying existing bcrypt hashes and hash new passwords with Argon2
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET", "dev_only_secret_change_me")  # set env var in prod!
JWT_ALG = "HS256"
JWT_EXPIRE_SECONDS = 60 * 60  # 1 hour

# Admin role constant for role-based access control
ADMIN_ROLE = "superuser"

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(sub: str) -> str:
    now = datetime.datetime.utcnow()
    payload = {"sub": sub, "iat": now, "exp": now + datetime.timedelta(seconds=JWT_EXPIRE_SECONDS)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def require_auth(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        return payload["sub"]  # email
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")


def require_admin_auth(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(lambda: None)  # Will be properly injected when used
) -> tuple[str, 'User']:
    """
    Require admin authentication for protected routes.
    Returns tuple of (email, user) if user is admin, raises HTTPException otherwise.
    """
    from app.db import get_db
    from app.models import User
    
    # Get database session properly
    if db is None:
        raise HTTPException(status_code=500, detail="Database session not available")
    
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Check if user has admin role
    if not hasattr(user, 'role') or user.role != ADMIN_ROLE:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return email, user