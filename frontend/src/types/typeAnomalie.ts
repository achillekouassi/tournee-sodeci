import { CategorieAnomalie } from "./categorieAnomalie";
import { SeveriteAnomalie } from "./SeveriteAnomalie";



export interface TypeAnomalieDTO {
  id?: number;                  // optionnel si création
  code: string;
  libelle: string;
  description?: string;
  categorie?: CategorieAnomalie;
  severite?: SeveriteAnomalie;
  necessitePhoto?: boolean;
  bloqueValidation?: boolean;
  necessiteIntervention?: boolean;
  couleurCarte?: string;
  ordreAffichage?: number;
}
