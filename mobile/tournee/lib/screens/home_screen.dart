import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/tournee_provider.dart';
import '../widgets/tournee_card.dart';
import 'tournee_screen.dart';
import 'stats_screen.dart';
import 'profile_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadTournees();
    });
  }

  Future<void> _loadTournees() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final tourneeProvider = Provider.of<TourneeProvider>(context, listen: false);

    if (authProvider.user != null) {
      await tourneeProvider.fetchTournees(
        authProvider.user!.userId,
        authProvider.user!.token,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeContent(onRefresh: _loadTournees),
      const StatsScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Relevé Compteurs'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadTournees,
          ),
        ],
      ),
      body: screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Accueil',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bar_chart),
            label: 'Stats',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}

class HomeContent extends StatelessWidget {
  final Future<void> Function() onRefresh;

  const HomeContent({super.key, required this.onRefresh});

  @override
  Widget build(BuildContext context) {
    final tourneeProvider = Provider.of<TourneeProvider>(context);

    return RefreshIndicator(
      onRefresh: onRefresh,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // --- Statistiques ---
            Row(
              children: [
                Expanded(
                  child: _StatCard(
                    title: 'Tournées',
                    value: '${tourneeProvider.tournees.length}',
                    icon: Icons.route_outlined,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _StatCard(
                    title: 'Relevés',
                    value: '${_getTotalReleves(tourneeProvider.tournees)}',
                    icon: Icons.check_circle_outline,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // --- Liste des tournées ---
            const Text(
              'Mes tournées actives',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Color(0xFF212121),
              ),
            ),
            const SizedBox(height: 12),

            if (tourneeProvider.isLoading)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(32),
                  child: CircularProgressIndicator(),
                ),
              )
            else if (tourneeProvider.error != null)
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    children: [
                      const Icon(Icons.error_outline, 
                        size: 64, 
                        color: Colors.red,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Erreur: ${tourneeProvider.error}',
                        style: const TextStyle(color: Colors.red),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: onRefresh,
                        child: const Text('Réessayer'),
                      ),
                    ],
                  ),
                ),
              )
            else if (tourneeProvider.tournees.isEmpty)
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    children: [
                      Icon(Icons.inbox, size: 64, color: Colors.grey.shade400),
                      const SizedBox(height: 16),
                      Text(
                        'Aucune tournée assignée',
                        style: TextStyle(color: Colors.grey.shade600),
                      ),
                    ],
                  ),
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: tourneeProvider.tournees.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final tournee = tourneeProvider.tournees[index];
                  return TourneeCard(
                    tournee: tournee,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => TourneeScreen(tournee: tournee),
                        ),
                      );
                    },
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  int _getTotalReleves(List<dynamic> tournees) {
    int total = 0;
    for (var t in tournees) {
      try {
        if (t is Map && t.containsKey('releves')) {
          final releves = t['releves'];
          if (releves is List) {
            total += releves.length;
          }
        } else {
          final releves = (t as dynamic).releves;
          if (releves is List) {
            total += releves.length;
          }
        }
      } catch (e) {
        // Ignorer les erreurs
      }
    }
    return total;
  }
}

// --- Widget pour les cartes de statistiques ---
class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;

  const _StatCard({
    required this.title,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(
              icon,
              color: const Color(0xFF1E88E5),
              size: 26,
            ),
            const SizedBox(height: 12),
            Text(
              value,
              style: const TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w600,
                color: Color(0xFF212121),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// --- Fonction pour compter le nombre total de relevés ---
int _getTotalReleves(List<dynamic> tournees) {
  int total = 0;
  for (var t in tournees) {
    try {
      if (t is Map && t.containsKey('releves')) {
        final releves = t['releves'];
        if (releves is List) {
          total += releves.length;
        }
      } else {
        final releves = (t as dynamic).releves;
        if (releves is List) {
          total += releves.length;
        }
      }
    } catch (e) {
      // Ignorer les erreurs
    }
  }
  return total;
}