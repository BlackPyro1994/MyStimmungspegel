import math

MIN_LAT = math.radians(-90.0)
MAX_LAT = math.radians(90.0)
MIN_LON = math.radians(-180.0)
MAX_LON = math.radians(180.0)


def bounding_coordinates(lat, lon, distance):
    """
    Berechnung zweier Refernezpunkte die ein Rechteck ergeben,
    dass ungefähr einem Kreis mit Suchradius entspricht.

    siehe: http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
    """
    if distance <= 0:
        raise ValueError('radius must be greater than zero')
    dist_radians = distance / 6371.0
    lat_radians = math.radians(lat)
    lon_radians = math.radians(lon)

    minLat = lat_radians - dist_radians
    maxLat = lat_radians + dist_radians

    if minLat > MIN_LAT and maxLat < MAX_LAT:
        deltaLon = math.asin(math.sin(dist_radians) / math.cos(lat_radians))
        minLon = lon_radians - deltaLon
        if minLon < MIN_LON:
            minLon += 2 * math.pi
        maxLon = lon_radians + deltaLon
        if maxLon > MAX_LON:
            maxLon -= 2 * math.pi
    else:
        minLat = max(minLat, MIN_LAT)
        maxLat = min(maxLat, MAX_LAT)
        minLon = MIN_LON
        maxLon = MAX_LON
    return (
        math.degrees(minLat), math.degrees(minLon),
        math.degrees(maxLat), math.degrees(maxLon)
    )
