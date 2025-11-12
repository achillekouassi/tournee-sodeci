import 'package:flutter/material.dart';
import '../models/client_model.dart';

class ClientCard extends StatelessWidget {
  final ClientModel client;
  final VoidCallback onTap;

  const ClientCard({
    super.key,
    required this.client,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bool hasNouvelIndex = client.nouvelIndex != null;

    // Couleurs
    final Color bleu = const Color(0xFF1E88E5);
    final Color vert = Colors.green;

    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              // Icône de validation
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: hasNouvelIndex
                      ? vert.withOpacity(0.1)
                      : bleu.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  hasNouvelIndex ? Icons.check_circle : Icons.radio_button_unchecked,
                  color: hasNouvelIndex ? vert : bleu,
                  size: 24,
                ),
              ),
              const SizedBox(width: 14),
              // Infos client
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Numéro compteur
                    Text(
                      client.numeroCompteur,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF212121),
                      ),
                    ),
                    const SizedBox(height: 4),
                    // Adresse
                    Text(
                      client.adresse,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    // Index
                    Text(
                      'Index: ${client.nouvelIndex ?? "Non relevé"}',
                      style: TextStyle(
                        fontSize: 11,
                        color: hasNouvelIndex ? vert : bleu,
                        fontWeight: hasNouvelIndex ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                  ],
                ),
              ),
              // Flèche
              Icon(
                Icons.chevron_right,
                color: Colors.grey.shade300,
                size: 24,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
