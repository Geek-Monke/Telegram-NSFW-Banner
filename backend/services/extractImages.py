import configparser
import os
from telethon import TelegramClient
from telethon.errors import SessionPasswordNeededError
from telethon.tl.functions.messages import GetHistoryRequest
from telethon.tl.types import PeerChannel

from const import TELEGRAM_API_ID, TELEGRAM_API_HASH  # Assuming these are defined in your const.py

# Load configuration
config = configparser.ConfigParser()
config.read("config.ini")
phone = config['Telegram']['phone']
username = config['Telegram']['username']

api_id = TELEGRAM_API_ID  # Replace with your actual API ID
api_hash = TELEGRAM_API_HASH  # Replace with your actual API hash
client = TelegramClient(username, api_id, api_hash)

# Create the output directory for photos
output_directory = os.path.join('..', 'data', 'photos')
os.makedirs(output_directory, exist_ok=True)

async def scrape_photos_from_channel(given_link):
    await client.start()
    print("Client Created")

    # Authorize the user if necessary
    if not await client.is_user_authorized():
        await client.send_code_request(phone)
        try:
            await client.sign_in(phone, input('Enter the code: '))
        except SessionPasswordNeededError:
            await client.sign_in(password=input('Password: '))

    # Resolve the channel entity
    if given_link.isdigit():
        entity = PeerChannel(int(given_link))
    else:
        entity = given_link

    my_channel = await client.get_entity(entity)

    offset_id = 0
    limit = 100
    image_count = 0
    max_images = 6
    offset_date = None  # Initialize offset_date

    while image_count < max_images:
        history = await client(GetHistoryRequest(
            peer=my_channel,
            offset_id=offset_id,
            offset_date=offset_date,  # Pass offset_date
            add_offset=0,
            limit=limit,
            max_id=0,
            min_id=0,
            hash=0
        ))

        if not history.messages:
            break

        for message in history.messages:
            if message.photo and image_count < max_images:
                file_path = os.path.join(output_directory, f'{message.id}.jpg')
                await client.download_media(message.photo, file=file_path)
                image_count += 1
                print(f"Downloaded photo {image_count} to {file_path}")

        offset_id = history.messages[-1].id
        offset_date = history.messages[-1].date  # Update offset_date for the next request

    print(f"Downloaded {image_count} images.")
    
    if image_count == 0:
        print("No images found.")

# Example usage:
# Replace 'your_telegram_link' with the actual Telegram link or channel ID
given_link = 'https://t.me/swapna_bhabi_webseries'

with client:
    client.loop.run_until_complete(scrape_photos_from_channel(given_link))
