# mwm

- file storage
- make params available via (req,params)
- Role and permission management UI | Org Level, Super Level
- Ai Response Streaming
- /blog
- /pages

- mwm
- /identity @mwm/identity
- /cms @mwm/cms
- /crm @mwm/crm
- /ecom @mwm/ecom

- I want to build a framework
- main identity + cms + crm

```
bunx --bun prisma migrate dev --name init
bunx --bun prisma generate

bunx prisma db seed
bunx prisma migrate deploy
```

```
statics
middleware

storage
email
password reset
login with Google
```

### Guidance

- 1-3 fields Dialog
- 3-8 fields Sheet
- Wizard or 8+ fields separate page

```
system roles

admin
org_admin
guest
```
