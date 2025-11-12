import 'package:flutter/material.dart';
import '../models/tournee_model.dart';
import '../models/client_model.dart';
import '../services/api_service.dart';

class TourneeProvider extends ChangeNotifier {
  List<TourneeModel> _tournees = [];
  List<ClientModel> _clients = [];
  bool _isLoading = false;
  String? _error;

  List<TourneeModel> get tournees => _tournees;
  List<ClientModel> get clients => _clients;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchTournees(int agentId, String token) async {
    _isLoading = true;
    _error = null;
    
    try {
      final data = await ApiService.getTourneesActives(agentId, token);
      _tournees = (data as List)
          .map((json) => TourneeModel.fromJson(json))
          .toList();
      _error = null;
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _tournees = [];
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchClients(int tourneeId, String token) async {
    _isLoading = true;
    _error = null;

    try {
      final data = await ApiService.getClientsTournee(tourneeId, token);
      _clients = (data as List)
          .map((json) => ClientModel.fromJson(json))
          .toList();
      _error = null;
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _clients = [];
      _isLoading = false;
      notifyListeners();
    }
  }

  // ✅ Mise à jour avec GPS et photo base64
  Future<bool> createReleve({
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
      await ApiService.createReleve(
        clientId: clientId,
        tourneeId: tourneeId,
        nouvelIndex: nouvelIndex,
        casReleve: casReleve,
        agentId: agentId,
        token: token,
        commentaire: commentaire,
        photoBase64: photoBase64,
        latitude: latitude,
        longitude: longitude,
      );
      
      _error = null;
      
      // Recharger la liste des clients pour mettre à jour l'UI
      await fetchClients(tourneeId, token);
      
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}