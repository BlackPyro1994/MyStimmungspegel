#!/usr/bin/env python3
#-*- coding: utf-8 -*-
"""
Kleines Script, dass erst die Datenbank löscht und sie dann mit Locations
aus der Datei 'testdata.csv' füllt. Zu jeder Location werden 10 zufällige
Ratings generiert.
"""
import csv
import datetime
import glob
import os
import random

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stimmungspegel_site.settings')
django.setup()

from django.conf import settings
from django.db import IntegrityError

from stimmungspegel.models import Location
from stimmungspegel.models import Rating
from stimmungspegel.models import AudioSnippet


if __name__ == '__main__':
    # clean the db
    print('cleaning the database...', end='', flush=True)
    AudioSnippet.objects.all().delete()
    Rating.objects.all().delete()
    Location.objects.all().delete()
    print(' done.')

    # clean media directory
    media_dir = settings.MEDIA_ROOT or None
    if media_dir:
        print('cleaning MEDIA_ROOT...', end='', flush=True)
        for path in glob.glob(os.path.join(os.path.abspath(media_dir), 'audiosnippets/*')):
            os.unlink(path)
        print(' done.')

    # create locations
    print('creating locations and ratings...', end='', flush=True)
    with open('testdata.csv', newline='\n') as f:
        csvreader = csv.DictReader(f)
        cnt = 0
        for row in csvreader:
            location = Location()
            location.name = row['name']
            location.address = row['address']
            location.zipcode = row['zipcode']
            location.city = row['city']
            location.type = int(row['type'])
            location.admission = row['admission']
            location.beer_price = row['beer_price']
            try:
                location.save()
                cnt += 1
            except IntegrityError:
                continue
            for i in range(10):
                rating = Rating(location=location)
                rating.value = random.randint(1, 5)
                rating.save()
    print(' done.')
    print('{} locations with ratings were added'.format(cnt))
