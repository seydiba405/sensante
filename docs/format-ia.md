# Documentation : Formatage des Données pour l'IA (Module Consultations)

## 1. Introduction

Ce document définit la structure technique des échanges entre l'application **SenSanté** et l'intelligence artificielle (via **Groq**).  
Il sert de contrat d'interface afin de garantir que les diagnostics générés sont exploitables par le système.

---

## 2. Format des données d'entrée (Input)

Les symptômes collectés dans le formulaire de consultation sont stockés sous forme de tableau JSON.

### Structure de la donnée brute

```json
["Fièvre", "Toux", "Maux de tête", "Fatigue"]
