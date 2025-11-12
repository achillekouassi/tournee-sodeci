import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/tournee_model.dart';
import '../providers/auth_provider.dart';
import '../providers/tournee_provider.dart';
import '../widgets/client_card.dart';
import 'releve_screen.dart';
import 'add_client_screen.dart';

class TourneeScreen extends StatefulWidget {
  final TourneeModel tournee;

  const TourneeScreen({super.key, required this.tournee});

  @override
  State<TourneeScreen> createState() => _TourneeScreenState();
}

class _TourneeScreenState extends State<TourneeScreen> {
  final _searchController = TextEditingController();
  String _searchTerm = '';
  bool _isInitialized = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _loadClients();
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadClients() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final tourneeProvider = Provider.of<TourneeProvider>(context, listen: false);
    
    await tourneeProvider.fetchClients(
      widget.tournee.id,
      authProvider.user!.token,
    );
    
    if (mounted) {
      setState(() {
        _isInitialized = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final tourneeProvider = Provider.of<TourneeProvider>(context);
    
    final filteredClients = tourneeProvider.clients.where((client) {
      final search = _searchTerm.toLowerCase();
      return client.numeroCompteur.toLowerCase().contains(search) ||
          client.adresse.toLowerCase().contains(search);
    }).toList();

    // Compter les relevés effectués
    final completedCount = filteredClients.where((c) => c.releve).length;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.tournee.code),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadClients,
          ),
        ],
      ),
      body: Column(
        children: [
          Container(
            color: Colors.white,
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Indicateur de progression
                if (_isInitialized && !tourneeProvider.isLoading)
                  Container(
                    padding: const EdgeInsets.all(12),
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E88E5).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.check_circle_outline,
                          color: Color(0xFF1E88E5),
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '$completedCount/${filteredClients.length} relevés effectués',
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF1E88E5),
                          ),
                        ),
                      ],
                    ),
                  ),
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Rechercher un compteur...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                  onChanged: (value) {
                    setState(() => _searchTerm = value);
                  },
                ),
                const SizedBox(height: 12),
                ElevatedButton.icon(
                  onPressed: () async {
                    await Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => AddClientScreen(
                          tourneeId: widget.tournee.id,
                        ),
                      ),
                    );
                    _loadClients();
                  },
                  icon: const Icon(Icons.add),
                  label: const Text('Ajouter compteur non listé'),
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 40),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: !_isInitialized || tourneeProvider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: _loadClients,
                    child: filteredClients.isEmpty
                        ? ListView(
                            children: [
                              SizedBox(
                                height: MediaQuery.of(context).size.height * 0.5,
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.search_off,
                                        size: 64, color: Colors.grey.shade400),
                                    const SizedBox(height: 16),
                                    Text(
                                      'Aucun compteur trouvé',
                                      style: TextStyle(color: Colors.grey.shade600),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          )
                        : ListView.separated(
                            padding: const EdgeInsets.all(16),
                            itemCount: filteredClients.length,
                            separatorBuilder: (_, __) =>
                                const SizedBox(height: 12),
                            itemBuilder: (context, index) {
                              final client = filteredClients[index];
                              return ClientCard(
                                client: client,
                                onTap: () async {
                                  final result = await Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => ReleveScreen(
                                        client: client,
                                        tourneeId: widget.tournee.id,
                                      ),
                                    ),
                                  );
                                  // Recharger après le retour
                                  if (result == true) {
                                    _loadClients();
                                  }
                                },
                              );
                            },
                          ),
                  ),
          ),
        ],
      ),
    );
  }
}