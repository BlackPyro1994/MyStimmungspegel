from rest_framework import serializers
from stimmungspegel import models


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Location
        fields = ('id', 'name', 'beer_price', 'admission', 'address', 'zipcode',
                  'city', 'position_lat', 'position_lon', 'rating', 'type')


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Rating
        fields = ('id', 'location_id', 'date', 'value')
