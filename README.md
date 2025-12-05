
# 🛒 API Avancée

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![Node](https://img.shields.io/badge/Node.js-v18%2B-green) ![License](https://img.shields.io/badge/license-ISC-lightgrey)

Une API RESTful robuste et évolutive pour une plateforme e-commerce, construite avec **Node.js**, **Express** et **Sequelize**.

Ce projet se distingue par une architecture **MVC** stricte, une sécurité renforcée (Double Token Auth avec rotation) et un moteur de requête puissant pour le filtrage des produits.

---

## 📑 Table des Matières

1. [Fonctionnalités Clés](#-fonctionnalités-clés)
2. [Stack Technique](#-stack-technique)
3. [Guide d'Installation](#-guide-dinstallation)
4. [Documentation de l'API](#-documentation-de-lapi)
    - [Authentification](#authentification)
    - [Gestion des Utilisateurs](#gestion-des-utilisateurs)
    - [Catalogue Produits (Query Builder)](#catalogue-produits-query-builder)
5. [Architecture du Projet](#-architecture-du-projet)

---

## ✨ Fonctionnalités Clés

### 🔐 Sécurité & Authentification (Niveau Industriel)
* **Double Token Strategy** : Utilisation combinée d'un `Access Token` (court terme) et d'un `Refresh Token` (long terme).
* **Token Rotation** : Sécurité maximale grâce au remplacement du Refresh Token à chaque utilisation (détection de vol de session).
* **Révocation (Blacklisting)** : Invalidation immédiate des tokens en base de données lors de la déconnexion.
* **Hashage** : Sécurisation des mots de passe et des tokens via `bcrypt`.

### 📦 Moteur de Recherche Produits
Exposition d'une API flexible permettant au client de construire des vues dynamiques :
* **Filtrage Avancé** : Support des opérateurs logiques (`>`, `<`, `=`, `LIKE`, `IN`, etc.).
* **Pagination & Tri** : Contrôle total sur le volume et l'ordre des données.
* **Projection (Sparse Fieldsets)** : Optimisation de la bande passante en ne demandant que les champs nécessaires.

---

## 🛠 Stack Technique

| Catégorie | Technologie | Rôle |
| :--- | :--- | :--- |
| **Runtime** | Node.js | Environnement d'exécution serveur |
| **Framework** | Express.js (v5) | Routage et Middlewares |
| **Base de Données** | MySQL | Stockage relationnel |
| **ORM** | Sequelize | Abstraction et gestion des modèles BDD |
| **Sécurité** | JWT & Bcrypt | Gestion des sessions stateless et cryptographie |

---

## 🚀 Guide d'Installation

### Prérequis
* Node.js (v18 ou supérieur)
* MySQL Server en cours d'exécution

### 1. Installation
Clonez le dépôt et installez les dépendances :

```bash
git clone [https://github.com/votre-compte/tp_api_avance_b3.git](https://github.com/votre-compte/tp_api_avance_b3.git)
cd tp_api_avance_b3
npm install
````

### 2\. Configuration (.env)

Créez un fichier `.env` à la racine du projet en vous basant sur les variables suivantes :

```ini
# Configuration Base de Données
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=apiavancerdb
DB_USER=root
DB_PASS=votre_mot_de_passe
DB_DIALECT=mysql

# Secrets JWT (Générez des clés longues et aléatoires pour la production)
JWT_ACCESS_SECRET=secret_access_complexe_et_long
JWT_REFRESH_SECRET=secret_refresh_complexe_et_long
```

### 3\. Base de Données

Créez simplement la base de données vide. L'ORM se chargera de créer les tables au démarrage.

```sql
CREATE DATABASE apiavancerdb;
```

### 4\. Démarrage

```bash
# Mode production
npm start

# Le serveur sera accessible sur http://localhost:8080
```

-----

## 📚 Documentation de l'API

### Authentification

Base URL : `/api/auth`

| Méthode | Endpoint | Description | Payload (JSON) |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | Connexion utilisateur | `{ "email": "...", "password": "..." }` |
| `POST` | `/refresh` | Renouveler l'Access Token | `{ "token": "refresh_token", "userId": 1 }` |
| `POST` | `/logout` | Déconnexion (Révocation) | `{ "token": "refresh_token", "userId": 1 }` |

> **Note :** L'endpoint `/refresh` implémente la rotation. Il renvoie une nouvelle paire (Access + Refresh) et invalide l'ancien Refresh Token.

### Gestion des Utilisateurs

Base URL : `/api/users`

| Méthode | Endpoint | Description | Auth Requise |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Création de compte | ❌ Non |
| `GET` | `/:id` | Profil utilisateur | ✅ Oui (Bearer) |

-----

### Catalogue Produits (Query Builder)

Base URL : `/api/products`
**Auth Requise :** ✅ Oui (Header `Authorization: Bearer <token>`)

Cet endpoint permet de filtrer dynamiquement les résultats via des paramètres d'URL (Query Params).

#### 1\. Pagination & Tri

  * **Pagination** : `?page=1&limit=10`
  * **Tri (`sort`)** :
      * Croissant : `?sort=price`
      * Décroissant : `?sort=-price` (ajouter un `-`)
      * Champs supportés : `name`, `price`, `created_at`, `id`.

#### 2\. Projection (`fields`)

Permet de réduire la taille de la réponse en ne sélectionnant que les colonnes utiles.

  * Exemple : `?fields=id,name,stock`

#### 3\. Filtrage Avancé (`filter`)

Syntaxe : `filter[champ][opérateur]=valeur`

| Opérateur | Signification | Exemple d'URL |
| :--- | :--- | :--- |
| `eq` | Égal (`=`) | `filter[price][eq]=100` |
| `ne` | Différent (`!=`) | `filter[category_id][ne]=1` |
| `gt` | Supérieur strict (`>`) | `filter[price][gt]=50` |
| `lt` | Inférieur strict (`<`) | `filter[stock][lt]=5` |
| `like` | Contient (Recherche) | `filter[name][like]=Gaming` |
| `in` | Dans une liste | `filter[id][in]=1,2,3` |

#### 🔥 Exemples de Requêtes Complexes

**Scénario :** Rechercher des produits de la catégorie "Informatique", coûtant plus de 500€, dont le nom contient "Pro", triés par prix croissant.

```http
GET /api/products?filter[category]=Informatique&filter[price][gt]=500&filter[name][like]=Pro&sort=price
```

-----

## 📂 Architecture du Projet

Le projet suit une structure modulaire claire pour faciliter la maintenance.

```plaintext
.
├── config/             # Configuration de la BDD et chargement .env
├── controllers/        # Logique métier (Le "Cerveau" de l'API)
│   ├── AuthController.js
│   ├── ProductController.js
│   └── UserController.js
├── middlewares/        # Intercepteurs HTTP
│   ├── AuthMiddleware.js    # Vérification JWT
│   └── ErrorMiddleware.js   # Gestion globale des erreurs
├── models/             # Définitions des schémas de données (Sequelize)
│   ├── init-models.js       # Centralisation des relations
│   ├── user.js
│   ├── session.js
│   └── ...
├── routes/             # Définitions des endpoints et méthodes HTTP
└── server.js           # Point d'entrée de l'application
```

```

```
