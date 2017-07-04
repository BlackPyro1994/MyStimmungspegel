import math
import uuid
import os.path
import geocoder

from django.db import models
from django.urls import reverse


class Location(models.Model):
    type_choices = (('Kneipe', 0), ('Bar', 1), ('Club', 2))

    name = models.CharField(max_length=100)
    type = models.IntegerField(choices=type_choices)
    beer_price = models.CharField(max_length=20)
    admission = models.CharField(max_length=20)
    address = models.CharField(max_length=255, blank=True, null=True)
    zipcode = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    position_lat = models.FloatField(blank=True, null=True)
    position_lon = models.FloatField(blank=True, null=True)

    def set_position(self, lat, lon):
        self.position_lat = lat
        self.position_lon = lon
        self._calc_address()

    def set_address(self, address, zipcode, city):
        self.address = address
        self.zipcode = zipcode
        self.city = city
        self._calc_position()

    def _calc_address(self):
        pos = geocoder.osm([self.lat, self.lon])
        self.address = pos.address
        self.zipcode = pos.zipcode
        self.city = pos.city

    def _calc_position(self):
        pos = geocoder.osm('{}, {} {}'.format(self.address, self.zipcode, self.city))
        self.lat = pos.lat
        self.lon = pos.lng

    def save(self, *args, **kwargs):
        # Vor dem speichern in der DB:
        # Umwandlung Adresse -> GPS-Koordinaten und vice versa
        if not (self.position_lat and self.position_lon):
            self._calc_position()
        elif not (self.address and self.zipcode and self.city):
            self._calc_address()
        super().save(*args, **kwargs)

    def distance_to(self, lat, lon):
        """
        Berechnet die Distanz (in Kilometern) zu der durch 'lat' und 'lon'
        gegebenen Position.

        @param lat  Breitengrad (float)
        @param lon  Längengrad (float)
        @return Distanz in km (float)
        """
        lat_rad = (self.position_lat + lat) / 2 * 0.01745
        dx = 111.3 * math.cos(lat_rad) * (self.position_lon - lon)
        dy = 111.3 * (self.position_lat - lat)
        return math.sqrt(dx**2 + dy**2)

    @property
    def rating(self):
        """
        Berechnet den Durchschnitt aller abgegebenen Bewertungen

        @return Durchschnittliche Bewertung (float), 0 wenn keine Bewertungen vorhanden
        """
        if self.rating_set.count() > 0:
            return sum([r.value for r in self.rating_set.all()]) / self.rating_set.count()
        return 0

    @property
    def last_audio_snippet(self):
        print(self.audiosnippet_set.latest('date'))
        return self.audiosnippet_set.latest('date')

    def get_absolute_url(self):
        return reverse('detail', kwargs={'pk': self.pk})

    def __str__(self):
        return self.name


class Rating(models.Model):
    location = models.ForeignKey(Location)
    value = models.IntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '{} - {} - {}'.format(self.date, self.location.name, self.value)


def path_and_rename(instance, filename):
    ext = os.path.splitext(filename)[-1]
    filename = '{}.{}'.format(uuid.uuid4().hex, ext)
    return os.path.join('audiosnippets', filename)


class AudioSnippet(models.Model):
    location = models.ForeignKey(Location)
    date = models.DateTimeField(auto_now_add=True)
    data = models.FileField(upload_to=path_and_rename)

    def __str__(self):
        return '{} {}'.format(self.date, self.location.name)
