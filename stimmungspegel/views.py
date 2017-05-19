from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseNotAllowed
from stimmungspegel import models
from stimmungspegel import serializers

def get_locations(request):
    lat = float(request.GET.get('lat', 51.133333))
    lon = float(request.GET.get('lon', 10.416667))
    radius = float(request.GET.get('radius', 1.0))
    ret = []
    for location in models.Location.objects.all():
        if location.distance_to(lat, lon) < radius:
            ret.append(location)
    ser = serializers.LocationSerializer(ret, many=True)
    return JsonResponse(ser.data, safe=False)

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
