# tp_api_avance_b3

````markdown
# API E-Commerce Avancée (Node.js / Express / Sequelize)

Cette API RESTful implémente un backend complet pour une plateforme e-commerce. Elle se distingue par une gestion avancée des requêtes produits (filtrage complexe, pagination, projection) et une authentification sécurisée par double token (JWT Access & Refresh) avec rotation.

## 🛠 Technologies

* **Runtime** : Node.js
* **Framework** : Express.js (v5)
* **Base de données** : MySQL
* **ORM** : Sequelize & Sequelize-CLI
* **Sécurité** : Bcrypt (Hashage), JSON Web Token (JWT)
* **Architecture** : MVC (Modèle-Vue-Contrôleur)

## ✨ Fonctionnalités Principales

### 🔐 Authentification & Sécurité
* **Inscription & Connexion** : Gestion des utilisateurs avec mots de passe hashés (Bcrypt).
* **Double Token JWT** : Utilisation d'un `accessToken` (durée courte) et d'un `refreshToken` (durée longue).
* **Token Rotation** : Sécurité renforcée lors du rafraîchissement des tokens (invalidation immédiate de l'ancien refresh token).
* **Révocation (Logout)** : Blacklisting des refresh tokens en base de données lors de la déconnexion.
* **Protection des Routes** : Middleware de vérification des tokens Bearer.

### 📦 Catalogue Produits (Query Builder Avancé)
L'endpoint de produits expose un moteur de recherche puissant via les paramètres d'URL :
* **Filtrage par Opérateurs** : Supporte `gt`, `gte`, `lt`, `lte`, `eq`, `ne`, `like`, `in`.
* **Pagination** : Gestion des pages et des limites d'éléments.
* **Tri** : Tri ascendant ou descendant sur plusieurs champs.
* **Projection** : Sélection dynamique des champs à retourner (Sparse Fieldsets).
* **Inclusion** : Chargement des relations (ex: Catégories).

---

## 🚀 Installation et Configuration

### Prérequis
* Node.js (v18+)
* MySQL Server

### 1. Clonage et Installation
```bash
git clone [https://github.com/votre-utilisateur/tp_api_avance_b3.git](https://github.com/votre-utilisateur/tp_api_avance_b3.git)
cd tp_api_avance_b3
npm install
````

### 2\. Configuration d'Environnement

Créez un fichier `.env` à la racine du projet et configurez les variables suivantes :

```env
# Base de données
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=votre_mot_de_passe
DB_NAME=apiavancerdb
DB_PORT=3306
DB_DIALECT=mysql

# Sécurité JWT (Utilisez des chaînes cryptographiques longues et aléatoires)
JWT_ACCESS_SECRET=votre_secret_access_token_tres_securise
JWT_REFRESH_SECRET=votre_secret_refresh_token_tres_securise
```

### 3\. Base de Données

Assurez-vous que la base de données spécifiée (`apiavancerdb`) existe dans votre MySQL. Sequelize synchronisera les tables au démarrage (ou via les migrations si configurées).

### 4\. Démarrage

```bash
# Lancer le serveur
npm start
```

Le serveur sera accessible sur `http://localhost:8080`.

-----

## 📚 Documentation de l'API

### 👤 Utilisateurs (`/api/users`)

| Méthode | Endpoint | Description | Auth Requise |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Créer un nouveau compte utilisateur | ❌ Non |
| `GET` | `/:id` | Récupérer le profil d'un utilisateur | ✅ Oui |

### 🔑 Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Body Requis |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | Connexion | `{ "email": "...", "password": "..." }` |
| `POST` | `/refresh` | Renouveler l'Access Token (Token Rotation) | `{ "token": "refresh_token", "userId": 1 }` |
| `POST` | `/logout` | Déconnexion (Révocation du token) | `{ "token": "refresh_token", "userId": 1 }` |

### 🛒 Produits (`/api/products`)

L'endpoint `GET /api/products` est **protégé** (Auth Requise) et supporte les paramètres avancés suivants :

#### Pagination

  * `?page=1&limit=10`

#### Tri (`sort`)

  * `?sort=price` (Croissant)
  * `?sort=-price` (Décroissant)
  * Champs autorisés : `name`, `price`, `created_at`, `id`.

#### Projection (`fields`)

  * `?fields=id,name,price` (Retourne uniquement ces champs).

#### Filtrage Avancé (`filter`)

La syntaxe est `filter[champ][opérateur]=valeur`.

| Opérateur API | Opérateur SQL (Sequelize) | Exemple d'URL | Description |
| :--- | :--- | :--- | :--- |
| `eq` | `=` | `filter[price][eq]=100` | Prix égal à 100 |
| `gt` | `>` | `filter[price][gt]=50` | Prix strictement supérieur à 50 |
| `lt` | `<` | `filter[price][lt]=200` | Prix strictement inférieur à 200 |
| `like` | `LIKE %...%` | `filter[name][like]=table` | Nom contenant "table" |
| `in` | `IN (...)` | `filter[id][in]=1,2,5` | ID est 1, 2 ou 5 |
| (standard) | `=` | `filter[category]=Meubles` | Recherche par nom de catégorie |

**Exemple combiné :**
Récupérer les produits de la catégorie "Informatique", dont le prix est supérieur à 500€, triés par nom :

```http
GET /api/products?filter[category]=Informatique&filter[price][gt]=500&sort=name
```

-----

## 📂 Structure du Projet

```
tp_api_avance_b3/
├── config/              # Configuration DB & Environnement
├── controllers/         # Logique métier (Auth, Produits, Users)
├── middlewares/         # Middlewares (Auth, Erreurs, Validation)
├── models/              # Définitions des tables Sequelize (User, Session, Product...)
├── routes/              # Définition des endpoints API
├── server.js            # Point d'entrée de l'application
├── .env                 # Variables d'environnement (non versionné)
└── package.json         # Dépendances et scripts
```

```
```
