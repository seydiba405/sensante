# Plan IA - Intégration Groq

## 1. Création du compte
Nous avons créé un compte sur Groq via https://console.groq.com afin d'accéder aux modèles d'intelligence artificielle.

## 2. Récupération de la clé API
Une clé API a été générée depuis le tableau de bord Groq.
Cette clé permet d’authentifier les requêtes vers l’API.

⚠️ La clé API est stockée de manière sécurisée (non versionnée dans GitHub).

## 3. Test de l’API avec curl

Commande utilisée :

```bash
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -d '{
    "model": "llama3-8b-8192",
    "messages": [
      {
        "role": "user",
        "content": "Test de l'API Groq"
      }
    ]
  }'
