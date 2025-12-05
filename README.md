
# RESTful API 


## 🏗 Architecture du Projet


### Flux de Données (Data Flow)
1. **Request** : Le client envoie une requête HTTP.
2. **Server** : `server.js` initialise l'application et les middlewares globaux.
3. **Router** : `routes/` dirige la requête vers le bon endpoint.
4. **Middleware** : `middlewares/` intercepte la requête pour la sécurité (Auth) ou la validation.
5. **Controller** : `controllers/` exécute la logique métier.
6. **Model** : `models/` interagit avec la base de données via Sequelize.
7. **Response** : Le serveur renvoie une réponse JSON standardisée.

### Arborescence
```plaintext
/
├── config/             # Configuration BDD & Variables d'env
├── controllers/        # Logique métier (Auth, Produits, Users)
├── middlewares/        # Sécurité (JWT) & Gestion des erreurs
├── models/             # Modèles de données (Sequelize) & Relations
├── routes/             # Définitions des endpoints API
└── server.js           # Point d'entrée
````

-----

## 💾 Base de Données (Schéma Relationnel)

### Description des Entités

1.  **Users** : Gestion des comptes avec mots de passe hachés (Bcrypt) et rôles.
2.  **Sessions** : Stockage sécurisé des *Refresh Tokens* pour gérer la rotation et la révocation (Logout).
3.  **Products** : Catalogue principal avec gestion des stocks et prix.
4.  **Categories** : Classification des produits.

-----

## 📖 Documentation API Complète

### Conventions

  * **Base URL** : `http://localhost:8080/api`
  * **Format de réponse** : JSON
  * **Authentification** : `Authorization: Bearer <access_token>` (pour les routes protégées).

-----

### 1\. Authentification (`/auth`)

Ce module gère le cycle de vie des sessions via une stratégie de **Double Token** avec rotation.

#### 🟢 Connexion

**POST** `/auth/login`
Authentifie l'utilisateur et délivre la paire de tokens initiaux.

  * **Body Requis :**
    ```json
    {
      "email": "john.doe@example.com",
      "password": "secretpassword"
    }
    ```
  * **Réponse (200 OK) :**
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1Ni...", // Valide 15 min
      "refreshToken": "eyJhbGciOiJIUzI1Ni..." // Valide 7 jours
    }
    ```

#### 🔄 Rafraîchissement (Token Rotation)

**POST** `/auth/refresh`
Échange un Refresh Token valide contre une nouvelle paire de tokens. **L'ancien Refresh Token est immédiatement invalidé (blacklisté) pour empêcher le vol de session.**

  * **Body Requis :**
    ```json
    {
      "token": "votre_refresh_token_actuel",
      "userId": 1
    }
    ```

#### 🔴 Déconnexion

**POST** `/auth/logout`
Révoque définitivement le Refresh Token en base de données.

  * **Body Requis :**
    ```json
    {
      "token": "votre_refresh_token_a_revoquer",
      "userId": 1
    }
    ```

-----

### 2\. Gestion Utilisateurs (`/users`)

#### Création de compte

**POST** `/users`

  * **Body :** `{ "email": "...", "password": "...", "role": "user" }`
  * **Code :** `201 Created`

#### Profil Utilisateur

**GET** `/users/:id`

  * **Auth :** Requise (Bearer Token)
  * **Réponse :** Retourne l'objet utilisateur (sans le mot de passe).

-----

### 3\. Catalogue Produits (`/products`)

**GET** `/products`

  * **Auth :** Requise (Bearer Token)

Cet endpoint expose un **moteur de requête (Query Builder)** permettant de filtrer, trier et paginer les données directement via l'URL.

#### A. Pagination

Contrôlez le volume de données retournées.

  * `page` : Numéro de la page (défaut : 1).
  * `limit` : Nombre d'éléments par page.

> `GET /products?page=2&limit=25`

#### B. Tri (`sort`)

Définissez l'ordre d'affichage. Ajoutez un préfixe `-` pour un tri décroissant (DESC).

  * Champs supportés : `name`, `price`, `created_at`, `id`.

> `GET /products?sort=-price` (Du plus cher au moins cher)
> `GET /products?sort=name` (Ordre alphabétique)

#### C. Projection (`fields`)

Optimisez la bande passante en ne demandant que les colonnes nécessaires (séparées par des virgules).

> `GET /products?fields=id,name,stock`

#### D. Filtrage Avancé (`filter`)

L'API utilise une syntaxe de filtrage structurée : `filter[champ][opérateur]=valeur`.

| Opérateur API | Équivalent SQL | Description | Exemple Usage |
| :--- | :--- | :--- | :--- |
| `eq` | `=` | Égalité stricte | `filter[price][eq]=100` |
| `ne` | `!=` | Différent de | `filter[stock][ne]=0` |
| `gt` | `>` | Strictement supérieur | `filter[price][gt]=500` |
| `gte` | `>=` | Supérieur ou égal | `filter[price][gte]=10` |
| `lt` | `<` | Strictement inférieur | `filter[price][lt]=1000` |
| `lte` | `<=` | Inférieur ou égal | `filter[stock][lte]=5` |
| `like` | `LIKE %...%` | Recherche textuelle partielle | `filter[name][like]=Gaming` |
| `in` | `IN (...)` | Présent dans une liste | `filter[id][in]=1,2,5` |

**Filtre Spécial :**

  * `filter[category]=NomCategorie` : Filtre directement par le nom de la catégorie associée.

-----

### 🧪 Exemples de Requêtes Complexes

**Scénario 1 : Recherche Client**
*"Je cherche un ordinateur (Catégorie 'Informatique'), dont le nom contient 'Pro', avec un prix supérieur à 800€, trié par prix croissant."*

```http
GET /api/products?filter[category]=Informatique&filter[name][like]=Pro&filter[price][gt]=800&sort=price
```

**Scénario 2 : Gestion des Stocks (Admin)**
*"Affiche-moi les 50 produits dont le stock est inférieur à 10 unités (alerte rupture), et ne renvoie que l'ID, le Nom et le Stock."*

```http
GET /api/products?filter[stock][lt]=10&limit=50&fields=id,name,stock
```

-----

## 🚦 Codes de Statut HTTP

L'API utilise les codes HTTP standards pour indiquer le succès ou l'échec d'une requête.

| Code | Signification | Contexte |
| :--- | :--- | :--- |
| **200** | OK | Requête traitée avec succès. |
| **201** | Created | Ressource créée (ex: Inscription). |
| **400** | Bad Request | Erreur de validation ou syntaxe (ex: filtre invalide). |
| **401** | Unauthorized | Token manquant ou invalide. |
| **403** | Forbidden | Token expiré (Nécessite un refresh). |
| **404** | Not Found | Ressource introuvable. |
| **500** | Internal Server Error | Erreur critique côté serveur / BDD. |

-----

## 🚀 Guide de Démarrage Rapide

1.  **Cloner & Installer**

    ```bash
    git clone <url-repo>
    npm install
    ```

2.  **Configuration**
    Créez un fichier `.env` à la racine (voir modèle ci-dessous).

3.  **Lancer**

    ```bash
    npm start
    ```

    L'API est accessible sur `http://localhost:8080`.

<!-- end list -->

```ini
# Exemple de fichier .env requis
DB_HOST=127.0.0.1
DB_NAME=apiavancerdb
DB_USER=root
DB_PASS=votre_password
JWT_ACCESS_SECRET=votre_cle_secrete_longue
JWT_REFRESH_SECRET=votre_cle_secrete_longue_et_differente
```

```
```
