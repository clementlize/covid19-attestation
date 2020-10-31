import {setCookie, getCookie, cookieDataName, cookieEditName, isCookie} from './tools';
import { $, $$, downloadBlob } from './dom-utils'
import pdfBase from '../certificate.pdf'
import { generatePdf } from './pdf-util'

export function homePage () {

  // Cookie d'édition trouvé ET à true
  if(isCookie(cookieEditName) && getCookie(cookieEditName) == "true") {

    var editionHtml = '<p class="textCenter">Remplissez les champs pour compléter votre profil</p><form id="editDataForm"> <div class="form-group"> <label for="input-prenom">Prénom</label> <input class="form-control" id="input-prenom" placeholder="Camille" required> </div><div class="form-group"> <label for="input-nom">Nom</label> <input class="form-control" id="input-nom" placeholder="Dupont" required> </div><div class="form-group"> <label for="input-birthda">Date de naissance</label> <input class="form-control" id="input-birthday" placeholder="01/01/1970" required pattern="^([0][1-9]|[1-2][0-9]|30|31)\/([0][1-9]|10|11|12)\/(19[0-9][0-9]|20[0-1][0-9]|2020)"> </div><div class="form-group"> <label for="input-birthplace">Lieu de naissance</label> <input class="form-control" id="input-birthplace" placeholder="Paris" required> </div><div class="form-group"> <label for="input-address">Adresse</label> <input class="form-control" id="input-address" placeholder="999 avenue de France" required> </div><div class="form-group"> <label for="input-city">Ville</label> <input class="form-control" id="input-city" placeholder="Paris" required> </div><div class="form-group"> <label for="input-postal">Code Postal</label> <input class="form-control" id="input-postal" placeholder="75001" required pattern="\d{5}"> </div><button type="submit" id="btn-submit" class="btn btn-primary">Enregistrer</button></form>';
    document.getElementById("main_container").innerHTML = editionHtml;

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
      }

      console.log(profile);

      setCookie(cookieDataName, JSON.stringify(profile), 60);
      setCookie(cookieEditName, "false", 0);

      location.reload();
      return false;
    });
  }
  // Cookie de données trouvé 
  else if (isCookie(cookieDataName)) {

    var fromCookie = JSON.parse(getCookie(cookieDataName));
    console.log(fromCookie);

    // Remplissage principal
    const mainHtml = '<div id="bienvenue_container"></div><form id="sortieForm" class="marginContainer"> <div class="form-group"> <label for="input-prenom">Date de sortie</label> <input class="form-control" id="input-date" name="input-date" required pattern="\d{4}-\d{2}-\d{2}"> </div><div class="form-group"> <label for="input-nom">Heure de sortie</label> <input class="form-control" id="input-heure" name="input-heure" required pattern="\d{2}:\d{2}"> </div></form><div id="generate_container" class="marginContainer"> <h3 class="text-center" id="generate_text">Générer une attestation</h3> <button type="button" class="btn btn-info main_btn btn-generate" id="btn-generate-travail"> Travail </button> <button type="button" class="btn btn-info main_btn btn-generate" id="btn-generate-achats"> Achats </button> <button type="button" class="btn btn-info main_btn btn-generate" id="btn-generate-soins"> Soins </button> <button type="button" class="btn btn-info main_btn btn-generate" id="btn-generate-personnes"> Personnes vulnérables </button> <button type="button" class="btn btn-info main_btn btn-generate" id="btn-generate-sortie"> Sortie 1h 1km </button></div><p class="text-center marginContainer"><a target="_blank" href="https://media.interieur.gouv.fr/deplacement-covid-19/">Cliquez ici pour consulter le générateur officiel d’attestation</a></p>'
    document.getElementById("main_container").innerHTML = mainHtml;

    // Remplissage secondaire
    const newHtml = '<h3>Bienvenue, '+fromCookie.firstname+'</h3><p id="coordonnees" class="text-muted">'+fromCookie.firstname+' '+fromCookie.lastname+'<br/>'+fromCookie.address+', '+fromCookie.zipcode+' '+fromCookie.city+'<br/>Né(e) le '+fromCookie.birthday+' à '+fromCookie.placeofbirth+'</p><button type="button" class="btn btn-primary main_btn btn-config" id="btn-modif">Modifier les coordonnées</button>'
    document.getElementById("bienvenue_container").innerHTML = newHtml;

    var formValues = document.getElementById("sortieForm").elements;

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

    $("#btn-modif").addEventListener('click', async (event) => {
      event.preventDefault()
    
      goToEditPage();  
    });

    $("#btn-generate-travail").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "travail", fromCookie);
    });

    $("#btn-generate-travail").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "travail", fromCookie);
    });

    $("#btn-generate-achats").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "achats", fromCookie);
    });

    $("#btn-generate-soins").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "sante", fromCookie);
    });

    $("#btn-generate-personnes").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "famille", fromCookie);
    });

    $("#btn-generate-sortie").addEventListener('click', async (event) => {
      event.preventDefault()
    
      generate(formValues[0].value, formValues[1].value, "sport_animaux", fromCookie);
    });

  }
  else {

    var noCookieHtml = '<p class="textCenter"> Aucune donnée n\'est enregistrée pour pour ce navigateur</p><button type="button" class="btn btn-primary main_btn btn-config" id="btn-config"> Configurer votre profil</button>'
    
    document.getElementById("main_container").innerHTML = noCookieHtml;

    $("#btn-config").addEventListener('click', async (event) => {
      event.preventDefault()
    
      goToEditPage();  
    });
  }

  function goToEditPage() {

    setCookie(cookieEditName, "true", 0);
      console.log("data-edit cookie set");

      location.reload();
      return false;
  }
  
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