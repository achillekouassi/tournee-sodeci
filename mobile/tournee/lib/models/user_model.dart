class UserModel {
  final int userId;
  final String nom;
  final String email;
  final String matricule;
  final String role;
  final String token;

  UserModel({
    required this.userId,
    required this.nom,
    required this.email,
    required this.matricule,
    required this.role,
    required this.token,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      userId: json['userId'],
      nom: json['nom'],
      email: json['email'],
      matricule: json['matricule'],
      role: json['role'],
      token: json['token'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'nom': nom,
      'email': email,
      'matricule': matricule,
      'role': role,
      'token': token,
    };
  }
}