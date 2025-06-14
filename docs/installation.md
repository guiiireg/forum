# Guide d'Installation

## Prérequis

### Installation de WSL (Windows Subsystem for Linux)

1. Ouvrir PowerShell en tant qu'administrateur et exécuter :
```powershell
wsl --install
```

2. Redémarrer votre ordinateur

3. Après le redémarrage, WSL s'installera automatiquement et vous demandera de créer un nom d'utilisateur et un mot de passe pour votre distribution Linux

4. Vérifier l'installation :
```powershell
wsl --list --verbose
```

### Installation de Docker

#### Sur Windows
1. Télécharger Docker Desktop depuis [le site officiel](https://www.docker.com/products/docker-desktop)
2. Installer Docker Desktop
3. Lors de l'installation, cocher l'option "Use WSL 2 instead of Hyper-V"
4. Redémarrer votre ordinateur
5. Vérifier l'installation :
```powershell
docker --version
docker compose version
```

#### Sur Ubuntu (WSL)
1. Mettre à jour les paquets :
```bash
sudo apt update && sudo apt upgrade
```

2. Installer les prérequis :
```bash
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
```

3. Ajouter la clé GPG officielle de Docker :
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

4. Ajouter le dépôt Docker :
```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

5. Installer Docker :
```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

6. Ajouter votre utilisateur au groupe docker :
```bash
sudo usermod -aG docker $USER
```

7. Redémarrer WSL ou votre session :
```bash
wsl --shutdown
```

8. Vérifier l'installation :
```bash
docker --version
docker compose version
```

## Installation du Projet

1. Cloner le repository
```bash
git clone https://github.com/guiiireg/forum.git
```

2. Installer les dépendances
```bash
npm install
```

## Démarrage du Projet

### Avec Docker (Recommandé)

1. Se placer dans le répertoire du projet
```bash
cd forum
```

2. Lancer les conteneurs
```bash
docker compose down && docker compose build && docker compose up -d
```

Cette commande va :
- Arrêter les conteneurs existants (`down`)
- Reconstruire les images (`build`)
- Démarrer les conteneurs en arrière-plan (`up -d`)

3. Vérifier que les conteneurs sont en cours d'exécution
```bash
docker compose ps
```

4. Accéder au forum
Ouvrir votre navigateur et aller à `http://localhost:3000`

### Commandes Docker utiles

- Voir les logs des conteneurs :
```bash
docker compose logs -f
```

- Arrêter les conteneurs :
```bash
docker compose down
```

- Reconstruire et redémarrer les conteneurs :
```bash
docker compose up -d --build
```

- Voir l'utilisation des ressources :
```bash
docker stats
```

### Sans Docker

1. Démarrer le serveur
```bash
node server/js/startServer.js
```

2. Accéder au forum
Ouvrir votre navigateur et aller à `http://localhost:3000`

## Dépendances Principales
- express: ^5.1.0
- sqlite3: ^5.1.7
- dotenv: ^16.5.0

[Retour au README principal](../README.md) 