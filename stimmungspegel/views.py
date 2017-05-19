import json
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseNotAllowed, Http404
from stimmungspegel import models
from stimmungspegel import serializers

@csrf_exempt
def get_locations(request):
    """
    Gibt eine Liste von 'Location'-Objeckten zurück. Aufruf über Ajax (POST)

    Die Auswahl kann über Parameter eingegrenzt werden:
        * Längengrad, Breitengrad und Suchradius ('lat', 'lon' und 'radius')
        * Maximale Anzahl der zurückgegeben Objekte ('count')

    @return Array von Locations als JSON,
            HTTP405 (Method not allowed) bei falschem Aufruf
    """
    if request.is_ajax() and request.method == 'POST':
        data = request.POST
        if all(key in data for key in ('lat', 'lon', 'radius')):
            lat = float(data['lat'])
            lon = float(data['lon'])
            radius = float(data['radius'])
            ret = []
            # FIXME: Die performance der folgenden drei Zeilen wird sooo scheiße sein...
            for location in models.Location.objects.all():
                if location.distance_to(lat, lon) <= radius:
                    ret.append(location)
        else:
            ret = models.Location.objects.all()
        if 'count' in data:
            ret = ret[:int(data['count'])]
        ser = serializers.LocationSerializer(ret, many=True)
        return JsonResponse(ser.data, safe=False)
    raise HttpResponseNotAllowed(['POST'])

@csrf_exempt
def rate(request, location_id):
    if request.method == 'POST':
        location = get_object_or_404(models.Location, id=location_id)
        rating = models.Rating()
        rating.location = location
        rating.value = int(request.POST['rating'])
        rating.save()
        return JsonResponse({'location_id': location_id, 'new_rating': location.rating})
    return HttpResponseNotAllowed(['POST'])

def get_ratings(request, location_id):
    ratings = models.Rating.objects.filter(location_id=location_id).order_by('-date')
    ser = serializers.RatingSerializer(ratings, many=True)
    return JsonResponse(ser.data, safe=False)
