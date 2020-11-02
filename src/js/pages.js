import {setCookie, getCookie, cookieDataName, cookieEditName, isCookie} from './tools';
import { $, $$, downloadBlob } from './dom-utils'
import pdfBase from '../certificate.pdf'
import { generatePdf } from './pdf-util'

export function homePage () {

  // Cookie d'édition trouvé ET à true
  if(isCookie(cookieEditName) && getCookie(cookieEditName) == "true") {

    // Filling main content with the "edit profile" form
    var editionHtml = '<p class="textCenter">Remplissez les champs pour compléter votre profil</p><form id="editDataForm"> <div class="form-group"> <label for="input-prenom">Prénom</label> <input class="form-control" id="input-prenom" placeholder="Camille" required> </div><div class="form-group"> <label for="input-nom">Nom</label> <input class="form-control" id="input-nom" placeholder="Dupont" required> </div><div class="form-group"> <label for="input-birthda">Date de naissance</label> <input class="form-control" id="input-birthday" placeholder="01/01/1970" required pattern="^([0][1-9]|[1-2][0-9]|30|31)\/([0][1-9]|10|11|12)\/(19[0-9][0-9]|20[0-1][0-9]|2020)"> </div><div class="form-group"> <label for="input-birthplace">Lieu de naissance</label> <input class="form-control" id="input-birthplace" placeholder="Paris" required> </div><div class="form-group"> <label for="input-address">Adresse</label> <input class="form-control" id="input-address" placeholder="999 avenue de France" required> </div><div class="form-group"> <label for="input-city">Ville</label> <input class="form-control" id="input-city" placeholder="Paris" required> </div><div class="form-group"> <label for="input-postal">Code Postal</label> <input class="form-control" id="input-postal" placeholder="75001" required pattern="\d{5}"> </div><button type="submit" id="btn-submit" class="btn btn-primary">Enregistrer</button></form>';
    document.getElementById("main_container").innerHTML = editionHtml;

    // Submit action -> update or create the cookie user-data
    $("#btn-submit").addEventListener('click', async (event) => {
      event.preventDefault();

      var formValues = document.getElementById("editDataForm").elements;

      var profile = {
        "address": formValues[4].value,
        "birthday": formValues[2].value,
        "city": formValues[5].value,
        "datesortie": "",
        "firstname": formValues[0].value,
        "heuresortie": "",
        "lastname": formValues[1].value,
        "ox-achats": "achats",
        "ox-convocation": "convocation",
        "ox-enfants": "enfants",
        "ox-famille": "famille",
        "ox-handicap": "handicap",
        "ox-missions": "missions",
        "ox-sante": "sante",
        "ox-sport_animaux": "sport_animaux",
        "ox-travail": "travail",
        "placeofbirth": formValues[3].value,
        "zipcode": formValues[6].value
      };

      // Setting user-data cookie
      setCookie(cookieDataName, JSON.stringify(profile), 60);
      // Exiting "edit profile"
      setCookie(cookieEditName, "false", 0);

      // Refresh
      location.reload();
      return false;
    });
  }
  // Cookie de données trouvé : écran principal
  else if (isCookie(cookieDataName)) {

    // Récupération du cookie user-data sous forme de Json
    var fromCookie = JSON.parse(getCookie(cookieDataName));

    // Remplissage principal
    const mainHtml = '<div id="bienvenue_container"></div><form id="sortieForm" class="marginContainer"> <div class="form-group"> <label for="input-prenom">Date de sortie</label> <input class="form-control" id="input-date" name="input-date" required pattern="\d{4}-\d{2}-\d{2}"> </div><div class="form-group"> <label for="input-nom">Heure de sortie</label> <input class="form-control" id="input-heure" name="input-heure" required pattern="\d{2}:\d{2}"> </div></form><div id="generate_container" class="marginContainer"> <h3 class="text-center" id="generate_text">Générer une attestation</h3> <button type="button" class="btn btn-info main_btn btn-generate" id="btn-generate-sortie"> Sortie 1h 1km </button> <button type="button" class="btn btn-info main_btn btn-generate" id="btn-generate-achats"> Achats </button> <button type="button" class="btn btn-info main_btn btn-generate" id="btn-generate-travail"> Travail </button> <button type="button" class="btn btn-info main_btn btn-generate" id="btn-generate-soins"> Soins </button> <button type="button" class="btn btn-info main_btn btn-generate" id="btn-generate-personnes"> Famille, personnes vulnérables </button> <button type="button" class="btn btn-info main_btn btn-generate" id="btn-generate-enfants"> Enfants et école </button> <button type="button" class="btn btn-info main_btn btn-generate" id="btn-generate-handicap"> Handicap </button> <button type="button" class="btn btn-info main_btn btn-generate" id="btn-generate-missions"> Missions int. gén. </button> <button type="button" class="btn btn-info main_btn btn-generate" id="btn-generate-convocation"> Convocation </button></div><p class="text-center marginContainer"><a target="_blank" href="https://media.interieur.gouv.fr/deplacement-covid-19/">Cliquez ici pour consulter le générateur officiel d’attestation</a></p>'
    document.getElementById("main_container").innerHTML = mainHtml;

    // Remplissage secondaire
    const newHtml = '<h3>Bienvenue, '+fromCookie.firstname+'</h3><p id="coordonnees" class="text-muted">'+fromCookie.firstname+' '+fromCookie.lastname+'<br/>'+fromCookie.address+', '+fromCookie.zipcode+' '+fromCookie.city+'<br/>Né(e) le '+fromCookie.birthday+' à '+fromCookie.placeofbirth+'</p><button type="button" class="btn btn-primary main_btn btn-config" id="btn-modif">Modifier les coordonnées</button>'
    document.getElementById("bienvenue_container").innerHTML = newHtml;

    var formValues = document.getElementById("sortieForm").elements;

    // Remplissage automatique des champs "date de sortie" et "heure de sortie"
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hours = String(today.getHours()).padStart(2, '0');
    var minutes = String(today.getMinutes()).padStart(2, '0');
    for (var i=0; i<formValues.length; i++) {

      if (formValues[i].name == "input-date") {
        formValues[i].value = dd+"/"+mm+"/"+yyyy;
      }
      else if (formValues[i].name == "input-heure") {
        formValues[i].value = hours+":"+minutes;
      }
    }

    // Actions des boutons de génération

    $("#btn-modif").addEventListener('click', async (event) => {
      event.preventDefault()
    
      goToEditPage();  
    });

    $("#btn-generate-sortie").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "sport_animaux", fromCookie);
    });

    $("#btn-generate-achats").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "achats", fromCookie);
    });

    $("#btn-generate-travail").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "travail", fromCookie);
    });

    $("#btn-generate-soins").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "sante", fromCookie);
    });

    $("#btn-generate-personnes").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "famille", fromCookie);
    });

    $("#btn-generate-enfants").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "enfants", fromCookie);
    });

    $("#btn-generate-handicap").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "handicap", fromCookie);
    });

    $("#btn-generate-missions").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "missions", fromCookie);
    });

    $("#btn-generate-convocation").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "convocation", fromCookie);
    });

  }
  // Aucun cookie, on accueille l'utilisateur
  else {

    // Remplissage de la page
    var noCookieHtml = '<p class="textCenter"> Bienvenue. Ce service vous permet de remplir les attestations de déplacement plus rapidement. <br><br>Pour démarrer, configurez votre profil :</p><button type="button" class="btn btn-primary main_btn btn-config" id="btn-config"> Configurer votre profil</button>'
    document.getElementById("main_container").innerHTML = noCookieHtml;

    $("#btn-config").addEventListener('click', async (event) => {
      event.preventDefault()
    
      goToEditPage();  
    });
  }

  // Setting "edit" cookie to show "edit profile" page
  function goToEditPage() {

    setCookie(cookieEditName, "true", 0);

    // Refresh
    location.reload();
    return false;
  }
  
  // Generates the pdf
  async function generate(date, heure, raison, profile) {

    console.log(profile);

    profile.datesortie = date;
    profile.heuresortie = heure;

    const pdfBlob = await generatePdf(profile, raison, pdfBase)

    const creationInstant = new Date()
    const creationDate = creationInstant.toLocaleDateString('fr-CA')
    const creationHour = creationInstant
      .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      .replace(':', '-')

    downloadBlob(pdfBlob, `attestation-${creationDate}_${creationHour}.pdf`);
  }
}