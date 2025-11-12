import 'package:image_picker/image_picker.dart';
import 'dart:io';

class CameraService {
  static final ImagePicker _picker = ImagePicker();

  static Future<File?> takePicture() async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 70,
        maxWidth: 1024,
        maxHeight: 1024,
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
