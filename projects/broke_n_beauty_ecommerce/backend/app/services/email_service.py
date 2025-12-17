import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Environment, FileSystemLoader
from app.config import settings
import logging
import os

logger = logging.getLogger(__name__)

class EmailService:
    """Service for sending transactional emails via Gmail SMTP"""

    def __init__(self):
        self.smtp_host = settings.SMTP_HOST or "smtp.gmail.com"
        self.smtp_port = settings.SMTP_PORT or 587
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.FROM_EMAIL or settings.SMTP_USERNAME

        # Setup Jinja2 for email templates
        template_dir = os.path.join(os.path.dirname(__file__), "../templates/emails")
        self.template_env = Environment(
            loader=FileSystemLoader(template_dir) if os.path.exists(template_dir) else FileSystemLoader("app/templates/emails")
        )

    async def send_email(self, to_email: str, subject: str, html_body: str, text_body: str = None):
        """Send HTML email with optional text fallback"""
        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.from_email
            message["To"] = to_email

            # Add text version if provided
            if text_body:
                message.attach(MIMEText(text_body, "plain"))

            # Add HTML version
            message.attach(MIMEText(html_body, "html"))

            # Send via Gmail SMTP
            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_username,
                password=self.smtp_password,
                start_tls=True,
            )

            logger.info(f"Email sent successfully to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    async def send_inventory_alert(self, to_email: str, product_name: str, variant_info: str, product_url: str):
        """Send back-in-stock notification"""
        try:
            template = self.template_env.get_template("inventory_alert.html")
            html_body = template.render(
                product_name=product_name,
                variant_info=variant_info,
                product_url=product_url
            )

            subject = f"🎉 {product_name} is Back in Stock!"
            return await self.send_email(to_email, subject, html_body)
        except Exception as e:
            logger.error(f"Failed to send inventory alert: {str(e)}")
            return False

    async def send_tracking_update(self, to_email: str, order_id: int, tracking_number: str,
                                   carrier: str, status: str, tracking_url: str):
        """Send order tracking status update"""
        try:
            template = self.template_env.get_template("tracking_update.html")
            html_body = template.render(
                order_id=order_id,
                tracking_number=tracking_number,
                carrier=carrier,
                status=status,
                tracking_url=tracking_url
            )

            subject = f"Order #{order_id} - Tracking Update: {status}"
            return await self.send_email(to_email, subject, html_body)
        except Exception as e:
            logger.error(f"Failed to send tracking update: {str(e)}")
            return False

email_service = EmailService()
