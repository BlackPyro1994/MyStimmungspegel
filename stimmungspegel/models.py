from django.db import models


class Location(models.Model):
    name = models.CharField(max_length=100)
    bierpreis = models.FloatField()
    eintritt = models.FloatField()
    strasse = models.CharField(max_length=255, blank=True, null=True)
    plz = models.CharField(max_length=255, blank=True, null=True)
    ort = models.CharField(max_length=255, blank=True, null=True)
    position_lat = models.FloatField(blank=True, null=True)
    position_lon = models.FloatField(blank=True, null=True)

    @property
    def rating(self):
        return (sum( [r.rating for r in self.ratings] ) / self.ratings.count())

    def __str__(self):
        return self.name


class Rating(models.Model):
    location = models.ForeignKey(Location)
    rating = models.IntegerField(choices=[('1', 1), ('2', 2), ('3', 3), ('4', 4), ('5',5)])
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '{} - {}'.format(self.location.name, self.rating)

class AudioSnippet(models.Model):
    location = models.ForeignKey(Location)
    date = models.DateTimeField(auto_now_add=True)
    data = models.BinaryField()

    def __str__(self):
        return '{} {}'.format(self.date, self.location.name)
