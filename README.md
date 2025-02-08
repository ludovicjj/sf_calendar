# Calendar

## Project
- php : ```>=8.2```
- symfony : ```7.2.*```
- Doctrine: ```^3```
- postgres : ```16-alpine```

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