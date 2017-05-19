from rest_framework import serializers
from stimmungspegel import models

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Location
        fields = ('name', 'beer_price', 'admission', 'street', 'zipcode',
                  'city', 'position_lat', 'position_lon', 'rating')

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Rating
        fields = ('location_id', 'date', 'value')
