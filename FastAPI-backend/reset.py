import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from fastapi import HTTPException, status
from dotenv import load_dotenv

load_dotenv("sendgrid.env")

def send_reset_link(email: str, link: str):
    template_id = 'd-b037dba28586478aab1cf7fb503e1a42'
    
    message = Mail(
        from_email='ezcommerce.reset@gmail.com',
        to_emails=f'{email}')

    message.template_id = template_id
    message.dynamic_template_data = {
        'reset_link': link
    }
    try:
        key = os.getenv("SENDGRID_API_KEY")
        sg = SendGridAPIClient(f"{key}")
        response = sg.send(message)
        return response.status_code
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))