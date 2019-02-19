var app = {
  propriete: 'toto',
  init: function () {
    console.log('init');

    // Exemples manipulation des dataset
    // var totoText = $('#addListModal').data('toto');
    // console.log(totoText);
    
    // $('#addListModal').data('toto', 'nouvelle valeur dans toto');

    // totoText = $('#addListModal').data('toto');
    // console.log(totoText);

    // Appel de la méthode se chargeant de créer les listes
    app.loadLists();

    // Interception de l'event double-clic sur les h2
    // $('#lists').find('.panel-heading h2').on('dblclick', app.handleListTitleDblClick);
    // On commente car les listes sont générés en JS et on y attache à chacune cet event

    // Interception de l'event submit sur les formulaires de modification de liste
    // $('#lists').find('.panel-heading form').on('submit', app.handleSubmitListNameForm);
    // On commente car les listes sont générés en JS et on y attache à chacune cet event

    // Interception de l'event submit sur le formulaire d'ajout de liste
    $('#addListModal').find('form').on('submit', app.handleSubmitAddListForm);
    // Interception de l'event submit sur le formulaire d'ajout de card
    $('#addCardModal').find('form').on('submit', app.handleSubmitAddCardForm);
  },
  displayAddListModal: function (evt) {
    app.displayModal('#addListModal');
  },
  hideAddListModal: function() {
    app.hideModal('#addListModal');
  },
  displayAddCardModal: function (evt) {
    app.displayModal('#addCardModal');
  },
  hideAddCardModal: function () {
    app.hideModal('#addCardModal');
  },
  displayModal: function (modalSelector) {
    // Récupration de l'élément Modal
    var $modal = $(modalSelector); // $modal = convention car contient un élément "jQuerysé"
    // modal.classList.add('is-active');
    $modal.addClass('is-active');

    // On met le focus sur le premier input
    $modal.find('input').eq(0).focus();
    // On vide l'input
    $modal.find('input').val('');

    $modal.find('.close').on('click', function () {
      $modal.removeClass('is-active');
    });
  },
  hideModal: function(modalSelector) {
    $(modalSelector).removeClass('is-active');
  },
  generateAddListElement: function () {
    /*
    <div class="column">
          <button class="button is-success" id="addListButton">
              <span class="icon is-small">
                  <i class="fas fa-plus"></i>
              </span>
              &nbsp; Ajouter une liste
          </button>
    </div>
    */
    var $addListElement = $('<div>').addClass('column').append(
      $('<button>').addClass('button is-success').attr('id', 'addListButton').html('&nbsp; Ajouter une liste').prepend(
        $('<span>').addClass('icon is-small').append(
          $('<i>').addClass('fas fa-plus')
        )
      )
    );

    // console.log($addListElement);
    // console.log($addListElement.html());
    return $addListElement;
  },
  handleListTitleDblClick: function(evt) {
    // console.log(evt);
    // evt.target => élément qui a reçu le clic (un enfant de currentTarget par exemple)
    // evt.currentTarget => élément sur lequel nous avons ajouté l'interception de l'évènement

    // On veut d'abord réinitialiser
    // On veut d'abord afficher tous les h2
    $('#lists').find('.panel-heading h2').removeClass('is-hidden');
    // On veut d'abord cacher tous les formulaires affichés, s'il y en a
    $('#lists').find('.panel-heading form').addClass('is-hidden');

    // On va récupérer l'élément h2 sur lequel l'évènement a eu lieu
    var $h2Element = $(evt.currentTarget);
    // On veut cacher le h2
    $h2Element.addClass('is-hidden');


    // On va récupérer le formulaire
    var $formElement = $h2Element.next('form');
    // On veut afficher le form "à côté"
    $formElement.removeClass('is-hidden');
    // On récupère le nom actuel de la liste
    var listName = $h2Element.text();

    // On améliore l'UX
    // On récupère l'input du formulaire
    var $inputElement = $formElement.find('input[name="list-name"]');
    // On modifie son attribut value
    $inputElement.val(listName);
    // On met le curseur dans cet input
    $inputElement.focus();
    // On sélectionne tout le texte dans cet input
    $inputElement.select();
    // La même, mais en 1 ligne
    // $formElement.find('input[name="list-name"]').val(listName).focus().select();
  },
  handleSubmitListNameForm: function(evt) {
    // Je désactive le comportement par défaut
    evt.preventDefault();

    // On récupère le formulaire soumis
    var $formElement = $(evt.currentTarget);

    // On récpère l'élément input dans le formulaire
    // var $inputElement = $formElement.find('input.input');
    var $inputElement = $formElement.find('input[name="list-name"]');

    // On récupère la valeur de cet input
    var inputValue = $inputElement.val().trim();

    // On vérifie que le nouveau nom n'est pas vide
    if (inputValue.length > 0) {
      // On récupère l'élément h2 à côté
      var $h2Element = $formElement.prev('h2');

      // On modifie le contenu de la balise h2
      $h2Element.text(inputValue);

      // On cache le formulaire
      $formElement.addClass('is-hidden');

      // On affiche le h2
      $h2Element.removeClass('is-hidden');
    }
    else {
      alert('Veuillez saisir un nom, svp');
    }
  },
  handleSubmitAddListForm: function(evt) {
    // Je désactive le comportement par défaut
    evt.preventDefault();

    // On récupère le formulaire soumis
    var $formElement = $(evt.currentTarget);

    // On récupère l'input contenant le nom de la liste
    var $inputElement = $formElement.find('input');

    // On récupère la valeur de l'input du formulaire
    var inputValue = $inputElement.val().trim();

    // On change la valeur de l'input par cette valeur après un trim
    $inputElement.val(inputValue);

    // Si le champ input n'est pas vide
    if (inputValue.length > 0) {
      // Requête Ajax vers le endpoint d'ajout d'une liste : "/lists/add"
      $.ajax(
        {
          url: 'http://api.okanban.local/lists/add', // Si api.okanban.local configuré
          // url: 'http://localhost/o-clock-Lunar/S06/S06-E01-backend-benoclock/public/lists/add' // sans le faux domaine
          method: 'POST',
          dataType: 'json',
          data: {
            listName: inputValue
          }
        }
      ).done(function(response) {
        // On vide l'input pour le prochain ajout
        $inputElement.val('');

        // On génère un élément "liste" vide
        var $listElement = app.generateListElement(response.name, response.id);
        console.log($listElement.data());

        // On ajoute la liste au DOM
        // $listElement.appendTo('#lists'); // pas au bon endroit
        $('#addListButton').parent().before($listElement);

        // On ferme le Modal
        app.hideAddListModal();
      }).fail(function() {
        alert('Ajax failed');
      });
    }
    else {
      // On gère magnifiquement l'affichage du message d'erreur
      $inputElement.addClass('is-danger').focus();

      // On récupère le paragraphe help à côté de la div "field"
      var $divFieldElement = $inputElement.parents('.field');

      // On ne veut ajouter le paragraphe help que s'il n'est pas encore créé
      // Si on a cette div
      if ($divFieldElement.find('.help').length > 0) {
        // On va modifier le texte
        $divFieldElement.find('.help').text('Veuillez remplir le champ "Nom"');
      }
      // Sinon, on crée cette div
      else {
        $divFieldElement.append(
          $('<p>').addClass('help is-danger').text('Veuillez remplir le champ "Nom"')
        );
      }

      // On veut supprimer le liseré rouge et le paragraphe d'aide lorsqu'on saisi qqch dans l'input
      $inputElement.on('keypress', function(evt) {
        // On supprime le paragraphe d'aide
        $divFieldElement.find('.help').remove();
        // On retire le liseré rouge
        $inputElement.removeClass('is-danger');
      });
    }
  },
  // créer une méthode generateListElement dans app prenant en paramètre listName
  generateListElement: function(listName, listId) {
    /*
    <div class="column is-one-quarter panel">
      <div class="panel-heading has-background-info">
          <div class="columns">
              <div class="column">
                  <h2 class="has-text-white">Liste vide</h2>

                  <form action="" method="POST" class="is-hidden">
                      <input type="hidden" name="list-id" value="1">
                      <div class="field has-addons">
                          <div class="control">
                              <input type="text" class="input is-small" name="list-name" value="" placeholder="Nom de la liste">
                          </div>
                          <div class="control">
                              <button class="button is-small is-success">Valider</button>
                          </div>
                      </div>
                  </form>
              </div>
  
              <div class="column is-narrow">
                  <a href="#" class="is-pulled-right">
                      <span class="icon is-small has-text-white">
                          <i class="fas fa-plus"></i>
                      </span>
                  </a>
              </div>
          </div>
      </div>
      <div class="panel-block is-block has-background-light">
          
      </div>

    </div>
    */

    var $listElement = $('<div>').addClass('column is-one-quarter panel').data('id', listId);
    // console.log($listElement.data());
    var htmlCodeInMyDiv = "<div class=\"panel-heading has-background-info\"> \
        <div class=\"columns\"> \
            <div class=\"column\"> \
                <h2 class=\"has-text-white\">" + listName + "</h2> \
 \
                <form action=\"\" method=\"POST\" class=\"is-hidden\"> \
                    <input type=\"hidden\" name=\"list-id\" value=\"" + listId + "\"> \
                    <div class=\"field has-addons\"> \
                        <div class=\"control\"> \
                            <input type=\"text\" class=\"input is-small\" name=\"list-name\" value=\"\" placeholder=\"Nom de la liste\"> \
                        </div> \
                        <div class=\"control\"> \
                            <button class=\"button is-small is-success\">Valider</button> \
                        </div> \
                    </div> \
                </form> \
            </div> \
 \
            <div class=\"column is-narrow\"> \
                <a href=\"#\" class=\"is-pulled-right addCardButton\"> \
                    <span class=\"icon is-small has-text-white\"> \
                        <i class=\"fas fa-plus\"></i> \
                    </span> \
                </a> \
            </div> \
        </div> \
    </div> \
    <div class=\"panel-block is-block has-background-light\"> \
         \
    </div>";
    $listElement.html(htmlCodeInMyDiv);
    // console.log($listElement);

    // Je définis un eventListener sur l'event double-click sur le H2
    $listElement.find('.panel-heading h2').on('dblclick', app.handleListTitleDblClick);
    // Je définis un eventListener sur l'event submit sur le form
    $listElement.find('.panel-heading form').on('submit', app.handleSubmitListNameForm);
    // Je définis un eventListener sur l'event 'click' sur le bouton +
    $listElement.find('.addCardButton').on('click', app.handleClickAddCardModal);

    // Sortable (permet de trier les cards dans l'élément ciblé)
    $listElement.find('.panel-block').sortable({
      connectWith: '.panel-block'
    });
    $listElement.find('.panel-block').on('sortstop', app.handleSortUpdateOnCards);

    return $listElement;
  },
  loadLists: function() {
    // Désormais, on charge grâce à un appel ajax
    $.ajax({
      url: 'http://api.okanban.local/lists', // Si api.okanban.local configuré
      // url: 'http://localhost/o-clock-Lunar/S06/S06-E01-backend-benoclock/public/lists' // sans le faux domaine
      method: 'GET',
      dataType: 'json'
    }).done(app.handleDoneOnLoadListsAjax).fail(function () {
      alert('ajax failed');
    });
  },
  handleDoneOnLoadListsAjax: function (response) {
    console.log(response);

    // Je parcours mon tableau lists
    // console.log(lists); // Je vérifie que j'ai bien accès à la variable
    var currentList; // équivalent à currentValue
    var $currentListElement;
    var currentCards;
    var $cardElement;
    for (var currentIndex in response) {
      // $.each(response, function(currentIndex, currentList) { ... });
      currentList = response[currentIndex];
      // console.log(currentList);

      // On génère l'élément pour la liste
      $currentListElement = app.generateListElement(currentList.name, currentList.id);

      // J'appelle une méthode s'occupant de remplir le $currentListElement par les Cards qui correspondent
      app.loadCardsForListId(currentList.id, $currentListElement);

      // On ajoute cet élément dans le DOM
      $currentListElement.appendTo('#lists');
    }

    // J'appelle une métode s'occupant de créer le bouton "ajouter une liste"
    var $addListElement = app.generateAddListElement();
    // ajout de la gestion de l'event click sur le bouton d'ajout de liste
    $addListElement.find('#addListButton').on('click', app.displayAddListModal);
    // J'ajoute maintenant cet élément dans le DOM
    $('#lists').append($addListElement);
    // $addListElement.appendTo('#lists');
  },
  loadCardsForListId: function(listId, $listElement) {
    // Pour chaque cards
    // On fait un appel Ajax sur le endpoint /lists/[id]/cards
    $.ajax({
      url: 'http://api.okanban.local/lists/' + listId + '/cards', // Si api.okanban.local configuré
      // url: 'http://localhost/o-clock-Lunar/S06/S06-E01-backend-benoclock/public/lists/' + listId + '/cards' // sans le faux domaine
      method: 'GET',
      dataType: 'json'
    }).done(function(response) {
      console.log(response);

      var $cardElement;
      $.each(response, function(currentCardIndex, currentCard) {
        // on génère un élément "card"
        $cardElement = app.generateCardElement(currentCard.title, currentCard.id);
        console.log($listElement);
        // On ajoute l'élément "card" dans le DOM de la liste
        $listElement.find('.panel-block').append($cardElement);
      });
    }).fail(function() {
      alert('Ajax failed');
    });
  },
  generateCardElement: function(cardName, cardId) {
    // On récupère l'élément card d'exemple se trouvant dans le code HTML (DOM)
    var $cardModel = $('#cardModel');

    // On crée une copie de cet élément qui nous sert à créer l'élément card des listes
    var $newCardElement = $cardModel.clone();

    // Sur le nouvel élément, je retire ce qui me permettait de le cacher
    $newCardElement.removeClass('is-hidden').removeAttr('id');

    // J'ajoute le titre de la carte
    $newCardElement.find('.card-title').text(cardName);

    // J'ajoute l'info de l'id de ma card
    $newCardElement.data('id', cardId);

    return $newCardElement;
  },
  handleClickAddCardModal: function(evt) {
    // Je récupère l'élément cliqué
    var $clickedElement = $(evt.currentTarget);
    console.log(evt.target); // plus petit élément sur lequel j'ai clické
    console.log(evt.currentTarget); // élément attaché à l'event

    // Je remonte jusqu'à l'éléménet "column" de la liste
    var $panelElement = $clickedElement.parents('.panel');

    console.log($panelElement);
    console.log($panelElement.data());

    // Je récupère la donnée stockée dans le dataset de l'élément
    var listId = $panelElement.data('id'); // lecture
    console.log('plus on list #'+listId);

    // On définit dans quelle liste la card va être ajoutée
    $('#addCardModal').find('form').data('listId', listId); // écriture

    // On affiche la fenêtre modal permettant l'ajout d'une card
    app.displayAddCardModal();
  },
  handleSubmitAddCardForm: function(evt) {
    // Je désactive le comportement par défaut
    evt.preventDefault();

    // Je récupère le formulaire
    var $formElement = $(evt.currentTarget);

    // Je récupère l'élément input du formulaire
    // var $inputElement = $formElement.find('input');

    // Je récupère l'identifiant de la liste
    var listId = $formElement.data('listId'); // lecture

    console.log('form soumis, listId = ' + listId);

    // On recherche la liste correspondant à cet ajout de card
    var $listElement;
    var $currentListElement;
    $('div.panel').each(function() {
      // L'élément courant (dans le parcours de la liste d'élément)
      $currentListElement = $(this); // this => élément courant dans le parcours d'élélements ($('ciblage').each)

      console.log(this);

      // si la liste a l'id de la liste que l'on recherche
      if ($currentListElement.data('id') == listId) {
        $listElement = $currentListElement;
      }
    });

    console.log($listElement);

    // Je récupère toute les données du form
    // Formate les données du formulaire de la même façon que si ce formulaire avait été envoyé sans Ajax
    var formData = $formElement.serialize();
    console.log(formData);

    // Appel ajax pour ajouter la card en BDD
    $.ajax({
      url: 'http://api.okanban.local/lists/' + listId + '/cards/add', // Si api.okanban.local configuré
      // url: 'http://localhost/o-clock-Lunar/S06/S06-E01-backend-benoclock/public/lists/' + listId + '/cards/add' // sans le faux domaine
      method: 'POST',
      dataType: 'json',
      data: formData
    }).done(function (response) {
      console.log(response);

      // Cacher le modal
      app.hideAddCardModal();

      // Générage du cardElement
      var $cardElement = app.generateCardElement(response.title, response.id);
      console.log($cardElement);
      // On ajoute l'élément "card" dans le DOM de la liste
      $listElement.find('.panel-block').append($cardElement);
    }).fail(function () {
      alert('Ajax failed');
    });
  },
  handleSortUpdateOnCards: function(evt, ui) {
    console.log('handleSortUpdateOnCards');
    console.log(ui);

    // Je récupère toutes les listes
    var $currentListElement;
    var listId;
    var $cardElement;
    var currentOrder;
    $('.panel').each(function() {
      // Je jqueryse la liste courante
      $currentListElement = $(this);

      // Je récupère son id
      listId = $currentListElement.data('id');

      // J'utilise une variable pour connaitre la position de la card dans le DOM
      currentOrder = 1;

      // Je parcours les cards à l'intérieur de cette liste
      $currentListElement.find('.panel-block .box').each(function() {
        // Je jqueryse l'élément courant/parcouru
        $cardElement = $(this);

        // Je fais un appel Ajax pour modifier la position de la carte
        $.ajax({
          url: 'http://api.okanban.local/cards/' + $cardElement.data('id') + '/update',
          method: 'POST',
          dataType: 'json',
          data: {
            // On a bien des données à envoyer
            cardName: $cardElement.find('.card-title').text(),
            listOrder: currentOrder,
            listId: listId
          }
        }).done(function(response) {
          console.log(response);
        }).fail(function() {
          console('ajax failed');
        });

        // J'incrémente la position des cards
        currentOrder += 1;
      });
    });
  }
};

// document.addEventListener('DOMContentLoaded', app.init);
$(app.init);