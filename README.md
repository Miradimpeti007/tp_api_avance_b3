# 🛒 API TP



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
