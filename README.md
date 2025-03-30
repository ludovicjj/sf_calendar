# Calendar

## Project
- php : ```>=8.2```
- symfony : ```7.2.*```
- Doctrine: ```^3```
- postgres : ```16-alpine```
- React : ```18.0```
- tailwindcss: ```^3.4.17```

## Processus d'authentification à double facteur (2FA)

Analyse et modification de la librarie [scheb/2fa](https://github.com/scheb/2fa) de Christian Sheb.
Le code utilise astucieusement les events déclenché pendant tout le procédé d'authentification et appliqué sa propre logique :
- Création d'un token custom
- redirection
- prise en charge de la validation du code

## Étapes du processus

### 1. Connexion utilisateur via le formulaire de login

- Utilisation du `FormLoginAuthenticator` standard
- L'utilisateur fournit email et mot de passe

### 2. Création du token TwoFactorToken

- Déclenchement de l'événement `AuthenticationTokenCreatedEvent`
  - Écouteur: `AuthenticationTokenCreatedEvent::class => 'onAuthenticationTokenCreated'`
- Création d'un token personnalisé qui conserve le token créé pendant le formulaire de login
- Utilisation de `AuthenticationContextFactoryInterface` pour la création du contexte
- Utilisation de `twoFactorProviderInitiator` pour la création du `TwoFactorToken`

### 3. Redirection vers la page 2FA

- Déclenchement de l'événement `onKernelException`
  - Écouteur: `KernelEvents::EXCEPTION => 'onKernelException'`
- Interception de l'exception levée par la redirection du formulaire de login
- Tests effectués:
  - Assertion du token
  - Présence de l'attribut `FLAG_2FA_COMPLETE` (voir étape 5)
  - Correspondance du nom du firewall
- Sauvegarde du chemin cible (`TargetPathTrait`)
  - L'authenticateur définit le chemin cible vers lequel l'utilisateur doit être redirigé après l'authentification
- Redirection vers la page de 2FA
- Utilisation du Voter `IS_AUTHENTICATED_2FA_IN_PROGRESS`

### 4. Choix de la méthode 2FA

- En fonction du choix fait par l'utilisateur, exécution d'une action via un événement
- Utilisation de `TwoFactorAuthenticationSubscriber`
  - Écouteur: `TwoFactorEvent::EMAIL => 'onEmailAuthenticated'`


### 5. Formulaire de validation du code

- Utilisation de l'authenticateur `TwoFactorAuthenticator`
- Création du passport avec le code comme credential (`TwoFactorCodeCredentials`)
- Déclenchement de l'événement `onCheckPassport`
  - Écouteur: `CheckPassportEvent::class => 'onCheckPassport'`
  - Validation du code (système de provider)
- Gestion des cas:
  - **Si le code est invalide**:
    - Levée de l'exception `TwoFactorCodeException` (qui étend `BadCredentialsException`)
    - Redirection vers la page d'envoi du code
    - Affichage du message d'erreur (`BadCredentialsException::messageKey`)
  - **Si le code est valide**:
    - Déballage du token `PostAuthenticationToken`
    - Marquage du token avec un attribut pour ne pas retourner à l'étape 2
    - Redirection vers le chemin cible ou la page d'accueil du dashboard

## Utils

Dump Env container :
```yaml
symfony console debug:container --env-vars
```

Dumping routes :
```yaml
symfony console debug:router
```

Check requirements : 
```yaml
symfony console check:requirements
```

Clear symfony cache :
```yaml
symfony console cache:clear
```