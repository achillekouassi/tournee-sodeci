class AppConfig {
  static const String baseUrl = 'http://192.168.1.111:8080/api';
  static const String authLogin = '$baseUrl/auth/login';
  static const String tourneesActives = '$baseUrl/tournees/agent';
  static const String clientsTournee = '$baseUrl/clients/tournee';
  static const String createReleve = '$baseUrl/releves';
  static const String createClientNonListe = '$baseUrl/clients/non-liste';
  
  static const Duration timeoutDuration = Duration(seconds: 30);
}