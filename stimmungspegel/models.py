from django.db import models


class Location(models.Model):
    name = models.CharField(max_length=100)
    beer_price = models.FloatField()
    admission = models.FloatField()
    street = models.CharField(max_length=255, blank=True, null=True)
    zipcode = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    position_lat = models.FloatField(blank=True, null=True)
    position_lon = models.FloatField(blank=True, null=True)

    @property
    def rating(self):
        return sum( [r.value for r in self.rating_set.all()] ) / self.rating_set.count()

    def __str__(self):
        return self.name


class Rating(models.Model):
    location = models.ForeignKey(Location)
    value = models.IntegerField(choices=[('1', 1), ('2', 2), ('3', 3), ('4', 4), ('5',5)])
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '{} - {} - {}'.format(self.date, self.location.name ,self.value)


class AudioSnippet(models.Model):
    location = models.ForeignKey(Location)
    date = models.DateTimeField(auto_now_add=True)
    data = models.BinaryField()

    def __str__(self):
        return '{} {}'.format(self.date, self.location.name)
