# Frontend

Ce dépôt sera ton dépôt côté **Front** pour toute la saison.

Tu peux coder chaque journée dans une branche spécifique pour t'y retrouver (et potentiellement reprendre le code du prof).

## Code fourni

- utilise le [Framework CSS Bulma](https://bulma.io/)
- donc la [documentation de Bulma](https://bulma.io/documentation/columns/) te sera utile :wink:
- il y a un peu de Javascript Vanilla (cliques sur _ajouter une liste_)

## Exercice du jour

Comme tu le sais, oKanban, c'est un peu comme Trello mais _que c'est nous qu'on l'a fait_ :heart_eyes:

Aujourd'hui, on va apprivoiser **jQuery** avec quelques petites intéractions sympas, côté client (navigateur).

### Etape 1 - jQuery

- remplacer le code Javascript _Vanilla_ existant par sa version **jQuery**
- documentation [jQuery](https://api.jquery.com/)

### Etape 2 - Modification du nom

- afficher le formulaire de modification du nom lors du double-clic sur le nom d'une liste

<details><summary>Plan</summary>

- intercepter l'évènement `dblclick` sur le nom des listes
- cacher l'élément lié à l'event (`evt.target` ou `this`)
- récupérer l'élément `<form>` "suivant" avec jQuery
- afficher cet élément

</details>

### Etape 3 - Ajouter le bouton d'ajout avec jQuery

- commenter les lignes HTML correspondant au bouton `Ajouter une liste`
- générer ce bouton en Javascript avec **jQuery** au chargement de la page
- pour créer un élément `<div>` avec jQuery, il faut :
    - écrire `$('<div>')`
    - stocker l'élément dans une variable `var $maDiv = $('<div>');`
    - ajouter un classe si on le souhaite `$maDiv.addClass('toto');`
    - enfin, l'ajouter dans le DOM, dans un élément choisi (ciblé) :
        - 1ère façon : `$('#idDestination').append($maDiv);`
        - 2ème façon : `$maDiv.appendTo('#idDestination');`

<details><summary>Plan</summary>

- dans `app.init`, appeler une nouvelle méthode de app : `addListAddingButton`
- cette méthode contiendra tout le code nécessaire à la création du bouton
- créer chaque élément (avec leurs classes) composant le bouton individuellement, et les stocker dans des variables
- utiliser `append()` ou `appendTo` pour ajouter un élément dans un autre
    - exemple : `$monSpan.appendTo($maDiv)` où `$monSpan` est un élément `<span>` créé en jQuery, et `$maDiv` est un élément `<div>` créé en jQuery
    - donc on n'ajoute rien dans le DOM pour l'instant
- une fois les éléments intégrés dans leur "parent", on peut ajouter l'élément qui contient tous les autres (`<div class="column">`), dans le DOM
- s'il y a une interception d'évènement sur ce bouton "Ajouter une liste", il faut donc que le bouton soit créé avant que l'interception d'évènement ne soit configurée

</details>