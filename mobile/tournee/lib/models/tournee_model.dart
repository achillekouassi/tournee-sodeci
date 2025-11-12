class TourneeModel {
  final int id;
  final String code;
  final String zone;
  final String statut;
  final int totalClients;
  final int clientsReleves;
  final double tauxAvancement;

  TourneeModel({
    required this.id,
    required this.code,
    required this.zone,
    required this.statut,
    required this.totalClients,
    required this.clientsReleves,
    required this.tauxAvancement,
  });

  factory TourneeModel.fromJson(Map<String, dynamic> json) {
    return TourneeModel(
      id: json['id'],
      code: json['code'],
      zone: json['zone'],
      statut: json['statut'],
      totalClients: json['totalClients'],
      clientsReleves: json['clientsReleves'],
      tauxAvancement: (json['tauxAvancement'] ?? 0).toDouble(),
    );
  }
}