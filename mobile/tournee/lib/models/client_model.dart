class ClientModel {
  final int id;
  final String numeroCompteur;
  final String adresse;
  final String nomMatriAZ;
  final int ancienIndex;
  final bool releve;
  final String? casReleve;
  final int? nouvelIndex;
  

  ClientModel({
    required this.id,
    required this.numeroCompteur,
    required this.adresse,
    required this.nomMatriAZ,
    required this.ancienIndex,
    required this.releve,
    this.nouvelIndex,
    this.casReleve,
  });

  factory ClientModel.fromJson(Map<String, dynamic> json) {
    return ClientModel(
      id: json['id'],
      numeroCompteur: json['numeroCompteur'],
      adresse: json['adresse'] ?? '',
      nomMatriAZ: json['nomMatriAZ'] ?? '',
      ancienIndex: json['ancienIndex'] ?? 0,
      releve: json['releve'] ?? false,
      casReleve: json['casReleve'],
      nouvelIndex: json['nouvelIndex'],
    );
  }
}
