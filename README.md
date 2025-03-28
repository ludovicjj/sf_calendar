# Calendar

## Project
- php : ```>=8.2```
- symfony : ```7.2.*```
- Doctrine: ```^3```
- postgres : ```16-alpine```
- React : ```18.0```
- tailwindcss: ```^3.4.17```

## 2FA
1. User se log via le formulaire de login (email/password)
- FormLoginAuthenticator standard
2. Creation du token TwoFactorToken
- Event AuthenticationTokenCreatedEvent (AuthenticationTokenCreatedEvent::class => 'onAuthenticationTokenCreated')
- Création du token custom conservant le token créer pendant le formulaire de login
- AuthenticationContextFactoryInterface -> creation du context
- twoFactorProviderInitiator -> creation du TwoFactorToken
3. Redirection vers les page 2FA
- Event onKernelException (KernelEvents::EXCEPTION => 'onKernelException')
- intercepte l'exception lever par la redirection du formulaire de login
- test d'assertion du token
- test la presence de l'attribut FLAG_2FA_COMPLETE (voir etape5)
- test de correspondance du firewall name
- sauvegarde du target path (TargetPathTrait, authenticator: Sets the target path the user should be redirected to after authentication.)
- event dispatcher (vois a quoi il sert)
- redirection vers la page de 2fa
- Voter IS_AUTHENTICATED_2FA_IN_PROGRESS

4. Choix de la methode de 2FA
- En fonction du choix faire par le user j'effectue une action via un event
- TwoFactorAuthenticationSubscriber (TwoFactorEvent::EMAIL => 'onEmailAuthenticated')


5. Formulaire de validation du code
- Authenticator (TwoFactorAuthenticator)
- Création du passport avec le code comme credential (TwoFactorCodeCredentials)
- Event onCheckPassport (CheckPassportEvent::class => 'onCheckPassport') validation du code (faire le systeme de provider)
- Si le code est invalide leve TwoFactorCodeException (extends de BadCredentialsException)
  - redirect vers la page d'envoie du code
  - Affiche message d'erreur (BadCredentialsException::messageKey)
- Si le code est valide
  - unwarp the PostAuthenticationToken  token
  - flag le token (attribute) pour ne pas retourner a l'etape 2
  - redirect vers target path ou la page d'acceuil du dashboard

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