import 'package:image_picker/image_picker.dart';
import 'dart:io';

class CameraService {
  static final ImagePicker _picker = ImagePicker();

  static Future<File?> takePicture() async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 50, // ✅ Réduit à 50% pour limiter la taille
        maxWidth: 800,    // ✅ Réduit la résolution
        maxHeight: 800,   // ✅ Réduit la résolution
      );

      if (photo != null) {
        return File(photo.path);
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}