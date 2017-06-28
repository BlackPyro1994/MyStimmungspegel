from django.db import models
import math
import geocoder


class Location(models.Model):
    kind_choices = (('Kneipe', 0), ('Bar', 1), ('Club', 2))

    name = models.CharField(max_length=100)
    kind = models.IntegerField(choices=kind_choices)
    beer_price = models.FloatField()
    admission = models.FloatField()
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
        pos = geocoder.osm([self.position_lat, self.position_lon])
        self.address = pos.address
        self.zipcode = pos.zipcode
        self.city = pos.city

    def _calc_position(self):
        pos = geocoder.osm('{}, {} {}'.format(self.address, self.zipcode, self.city))
        self.position_lat = pos.lat
        self.position_lon = pos.lng

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
        l = (self.position_lat + lat) / 2 * 0.01745
        dx = 111.3 * math.cos(l) * (self.position_lon - lon)
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

    def __str__(self):
        return self.name


class Rating(models.Model):
    location = models.ForeignKey(Location)
    value = models.IntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '{} - {} - {}'.format(self.date, self.location.name, self.value)


class AudioSnippet(models.Model):
    location = models.ForeignKey(Location)
    date = models.DateTimeField(auto_now_add=True)
    data = models.FileField(upload_to='audiosnippets/')

    def __str__(self):
        return '{} {}'.format(self.date, self.location.name)
