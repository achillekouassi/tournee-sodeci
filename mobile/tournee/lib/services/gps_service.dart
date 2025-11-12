import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';

class GpsService {
  static Future<Position?> getCurrentPosition() async {
    // Demander la permission
    final status = await Permission.location.request();
    
    if (!status.isGranted) {
      return null;
    }

    // Vérifier si le GPS est activé
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return null;
    }

    // Obtenir la position
    return await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
  }
}