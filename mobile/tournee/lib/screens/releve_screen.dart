import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:geolocator/geolocator.dart';
import '../models/client_model.dart';
import '../providers/auth_provider.dart';
import '../providers/tournee_provider.dart';
import '../services/camera_service.dart';
import '../services/gps_service.dart';

class ReleveScreen extends StatefulWidget {
  final ClientModel client;
  final int tourneeId;

  const ReleveScreen({
    super.key,
    required this.client,
    required this.tourneeId,
  });

  @override
  State<ReleveScreen> createState() => _ReleveScreenState();
}

class _ReleveScreenState extends State<ReleveScreen> {
  final _indexController = TextEditingController();
  final _commentaireController = TextEditingController();
  String _casReleve = 'NORMALE';
  File? _photo;
  Position? _position;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _getPosition();
  }

  @override
  void dispose() {
    _indexController.dispose();
    _commentaireController.dispose();
    super.dispose();
  }

  Future<void> _getPosition() async {
    _position = await GpsService.getCurrentPosition();
    setState(() {});
  }

  Future<void> _takePicture() async {
    final photo = await CameraService.takePicture();
    if (photo != null) {
      setState(() => _photo = photo);
    }
  }

  // ✅ Convertir l'image en base64
  Future<String?> _encodeImageToBase64(File imageFile) async {
    try {
      final bytes = await imageFile.readAsBytes();
      return base64Encode(bytes);
    } catch (e) {
      print('Erreur encodage image: $e');
      return null;
    }
  }

  Future<void> _submitReleve() async {
    if (_indexController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Veuillez saisir l\'index'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (_photo == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Veuillez prendre une photo'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // ✅ Vérifier la position GPS
    if (_position == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Position GPS non disponible'),
          backgroundColor: Colors.orange,
        ),
      );
      // On continue quand même mais sans GPS
    }

    setState(() => _isSubmitting = true);

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final tourneeProvider = Provider.of<TourneeProvider>(context, listen: false);

    // ✅ Encoder la photo en base64
    final photoBase64 = await _encodeImageToBase64(_photo!);

    if (photoBase64 == null) {
      if (!mounted) return;
      setState(() => _isSubmitting = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Erreur lors du traitement de la photo'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final success = await tourneeProvider.createReleve(
      clientId: widget.client.id,
      tourneeId: widget.tourneeId,
      nouvelIndex: int.parse(_indexController.text),
      casReleve: _casReleve,
      agentId: authProvider.user!.userId,
      token: authProvider.user!.token,
      commentaire: _commentaireController.text.isEmpty
          ? null
          : _commentaireController.text,
      photoBase64: photoBase64, // ✅ Envoyer la photo en base64
      latitude: _position?.latitude, // ✅ Envoyer les coordonnées GPS
      longitude: _position?.longitude,
    );

    if (!mounted) return;

    setState(() => _isSubmitting = false);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Relevé enregistré avec succès'),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.pop(context, true);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(tourneeProvider.error ?? 'Erreur'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final consommation = _indexController.text.isEmpty
        ? 0
        : int.parse(_indexController.text) - widget.client.ancienIndex;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Relevé compteur'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Informations compteur',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    _InfoRow(
                      label: 'N° Compteur',
                      value: widget.client.numeroCompteur,
                    ),
                    _InfoRow(
                      label: 'Index',
                      value: '${widget.client.nouvelIndex}',
                    ),
                    _InfoRow(
                      label: 'Adresse',
                      value: widget.client.adresse,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Nouvel index *',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _indexController,
                      keyboardType: TextInputType.number,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                      decoration: InputDecoration(
                        hintText: 'Saisir l\'index',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        contentPadding: const EdgeInsets.all(16),
                      ),
                      onChanged: (value) => setState(() {}),
                    ),
              
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Photo compteur *',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    if (_photo == null)
                      InkWell(
                        onTap: _takePicture,
                        child: Container(
                          height: 150,
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: Colors.grey.shade300,
                              width: 2,
                              style: BorderStyle.solid,
                            ),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.camera_alt,
                                    size: 48, color: Colors.grey.shade400),
                                const SizedBox(height: 8),
                                Text(
                                  'Prendre une photo',
                                  style: TextStyle(color: Colors.grey.shade600),
                                ),
                              ],
                            ),
                          ),
                        ),
                      )
                    else
                      Stack(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.file(
                              _photo!,
                              width: double.infinity,
                              height: 200,
                              fit: BoxFit.cover,
                            ),
                          ),
                          Positioned(
                            top: 8,
                            right: 8,
                            child: IconButton(
                              onPressed: () => setState(() => _photo = null),
                              icon: const Icon(Icons.close),
                              style: IconButton.styleFrom(
                                backgroundColor: Colors.red,
                                foregroundColor: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Situation',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: _casReleve,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'NORMALE', child: Text('Normale')),
                        DropdownMenuItem(value: 'COMPTEUR_BLOQUE', child: Text('Compteur bloqué')),
                        DropdownMenuItem(value: 'ABSENCE', child: Text('Absence client')),
                        DropdownMenuItem(value: 'REFUS_ACCES', child: Text('Refus d\'accès')),
                        DropdownMenuItem(value: 'COMPTEUR_CASSE', child: Text('Compteur cassé')),
                        DropdownMenuItem(value: 'BRANCHEMENT_DEPOSE', child: Text('Branchement detruit')),
                        DropdownMenuItem(value: 'COMPTEUR_DEPOSE', child: Text('Compteur deposé')),
                        DropdownMenuItem(value: 'PAS_VUE', child: Text('Pas vue')),

                      ],
                      onChanged: (value) {
                        setState(() => _casReleve = value!);
                      },
                    ),
                  ],
                ),
              ),
            ),
            if (_casReleve != 'NORMALE') ...[
              const SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Commentaire',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _commentaireController,
                        maxLines: 3,
                        decoration: InputDecoration(
                          hintText: 'Précisions sur l\'anomalie...',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
            const SizedBox(height: 16),
            if (_position != null)
              Card(
                color: Colors.green.shade50,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Icon(Icons.location_on, color: Colors.green.shade700),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'GPS: ${_position!.latitude.toStringAsFixed(6)}, ${_position!.longitude.toStringAsFixed(6)}',
                          style: TextStyle(
                            fontSize: 11,
                            color: Colors.green.shade700,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _submitReleve,
                child: _isSubmitting
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Text('Valider le relevé'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade600,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}