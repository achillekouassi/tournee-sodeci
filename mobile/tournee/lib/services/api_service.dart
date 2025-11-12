import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';

class ApiService {
  static Future<Map<String, dynamic>> login(
      String matricule, String password) async {
    try {
      final response = await http
          .post(
            Uri.parse(AppConfig.authLogin),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'matricule': matricule,
              'password': password,
            }),
          )
          .timeout(AppConfig.timeoutDuration);

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Identifiants incorrects');
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  static Future<List<dynamic>> getTourneesActives(
      int agentId, String token) async {
    try {
      final response = await http
          .get(
            Uri.parse('${AppConfig.tourneesActives}/$agentId/actives'),
            headers: {
              'Authorization': 'Bearer $token',
              'Content-Type': 'application/json',
            },
          )
          .timeout(AppConfig.timeoutDuration);

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Erreur chargement tournées: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Erreur réseau tournées: $e');
    }
  }

  static Future<List<dynamic>> getClientsTournee(
      int tourneeId, String token) async {
    try {
      final response = await http
          .get(
            Uri.parse('${AppConfig.clientsTournee}/$tourneeId/mobile'),
            headers: {
              'Authorization': 'Bearer $token',
              'Content-Type': 'application/json',
            },
          )
          .timeout(AppConfig.timeoutDuration);

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Erreur chargement clients: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Erreur réseau clients: $e');
    }
  }

  // ✅ Mise à jour avec GPS et photo base64
  static Future<void> createReleve({
    required int clientId,
    required int tourneeId,
    required int nouvelIndex,
    required String casReleve,
    required int agentId,
    required String token,
    String? commentaire,
    String? photoBase64, // ✅ Changé de photoUrl à photoBase64
    double? latitude, // ✅ Ajout GPS
    double? longitude, // ✅ Ajout GPS
  }) async {
    try {
      print('🔵 Création relevé pour client $clientId');
      print('🔵 URL: ${AppConfig.createReleve}?agentId=$agentId');
      print('🔵 Données: clientId=$clientId, tourneeId=$tourneeId, nouvelIndex=$nouvelIndex');
      print('🔵 GPS: lat=$latitude, lon=$longitude');
      print('🔵 Photo: ${photoBase64 != null ? "présente (${photoBase64.length} chars)" : "absente"}');
      
      final body = {
        'clientId': clientId,
        'tourneeId': tourneeId,
        'nouvelIndex': nouvelIndex,
        'casReleve': casReleve,
        'commentaire': commentaire,
        'photoBase64': photoBase64, // ✅ Photo en base64
        'latitude': latitude, // ✅ GPS
        'longitude': longitude, // ✅ GPS
      };

      final response = await http
          .post(
            Uri.parse('${AppConfig.createReleve}?agentId=$agentId'),
            headers: {
              'Authorization': 'Bearer $token',
              'Content-Type': 'application/json',
            },
            body: jsonEncode(body),
          )
          .timeout(AppConfig.timeoutDuration);

      print('🟢 Status: ${response.statusCode}');
      print('🟢 Body: ${response.body}');

      if (response.statusCode == 201) {
        print('✅ Relevé créé avec succès');
        return;
      } else {
        print('🔴 Erreur ${response.statusCode}: ${response.body}');
        throw Exception('Erreur création relevé: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('🔴 Exception: $e');
      throw Exception('Erreur création relevé: $e');
    }
  }

  static Future<void> createClientNonListe({
    required String numeroCompteur,
    required String adresse,
    required int tourneeId,
    required String token,
    String? nomMatriAZ,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse(AppConfig.createClientNonListe),
            headers: {
              'Authorization': 'Bearer $token',
              'Content-Type': 'application/json',
            },
            body: jsonEncode({
              'numeroCompteur': numeroCompteur,
              'adresse': adresse,
              'tourneeId': tourneeId,
              'nomMatriAZ': nomMatriAZ,
            }),
          )
          .timeout(AppConfig.timeoutDuration);

      if (response.statusCode != 201) {
        throw Exception('Erreur ajout client: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Erreur ajout client: $e');
    }
  }
}