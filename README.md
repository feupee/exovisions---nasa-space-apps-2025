# EXOVISIONS — A World Away Hunting For Exoplanets

> **Um sistema de inteligência artificial baseado na nuvem do Google para identificar potenciais exoplanetas usando dados das missões Kepler, K2 e TESS da NASA.**

---

## Demonstração

- **Site do projeto:** [https://exovisions.earth](https://exovisions.earth)  
- **Vídeo demonstração:** [YouTube](https://www.youtube.com/watch?v=ucWs9z8J9TY)  
- **Repositório do modelo:** [Mateus504R35/Exoplanetas](https://github.com/Mateus504R35/Exoplanetas)

---

## 📋 Resumo

O **EXOVISIONS** é um website que utiliza um sistema de IA desenvolvido do zero no **Google Cloud** para identificar potenciais exoplanetas.  
O modelo processa **curvas de luz** provenientes de dados públicos da NASA e gera uma **pontuação de probabilidade** indicando a chance de um sinal representar um exoplaneta real ou um falso positivo.

Além disso, o sistema calcula propriedades como **temperatura**, **insolação** e **raio planetário**, permitindo a criação de uma **simulação 3D interativa** que compara o exoplaneta detectado com a Terra.

---

## Arquitetura do Modelo

### 1.1 Visão Geral e Objetivos

O objetivo principal é **classificar candidatos como planeta (1) ou falso positivo (0)**.

A abordagem utilizada inclui:
- Treinamento isolado por domínio (**KOI**, **TOI**, **K2**)
- Calibração de probabilidades específica para cada domínio
- Meta-votação cruzada entre domínios para a combinação final dos resultados

#### Fluxo do Modelo

1. **Treinamento/Teste por domínio**  
2. **Votação local e calibração**  
3. **Meta-votação entre domínios**

---

### 1.2 Dados e Features

#### **KOI (Kepler Objects of Interest)**  
**Features:** `koi_period`, `koi_duration`, `koi_depth`, `koi_prad`, `koi_insol`, `koi_teq`  
**Target:** `koi_disposition ∈ {1, 0}`

#### **TOI (TESS Objects of Interest)**  
**Features:** `pl_orbper`, `pl_trandurh`, `pl_trandep`, `pl_rade`, `pl_insol`, `pl_eqt`, `st_teff`, `st_logg`  
**Target:** `tfopwg_disp ∈ {1, 0}`

#### **K2 Planets and Candidates**  
**Features:** `pl_orbper`, `pl_trandur`, `pl_trandep`, `pl_rade`, `pl_insol`, `pl_eqt`, `st_teff`, `st_logg`  
**Target:** `disposition ∈ {1, 0}`

---

## Metodologia de Machine Learning

### Mecanismo Anti-Monopolização

O modelo evita dominância de um único domínio, ajustando pesos por desempenho e tamanho:

\[
b_d = \max(AUROC_d - 0.5, 0) \cdot (n_d)^{\alpha}, \quad \alpha \in [0, 1]
\]

- **Escalonamento de temperatura** para domínios menores:  
  \[
  \beta_d = \alpha(\min(\log(\beta_d)/T_d)), \quad T_d > 1 \text{ (padrão } T=1.5)
  \]

- **Agregação final:**
  - (a) *Weighted soft vote:* \( p_{final} = \Sigma w_d \beta_d \)
  - (b) *Stacking:* Logistic Regression com regularização L2

---

## Boas Práticas Implementadas

- **Calibração por domínio:** regressão isotônica garante comparabilidade entre P(KOI), P(TOI), P(K2).  
- **Balanceamento de classes:** com `class_weight="balanced"` (RF/LR).  
- **Pesos por validação:** Passo 2 usa F1; Passo 3 usa AUROC regularizado.  
- **Threshold ótimo** baseado em F1 por domínio (em vez de 0.5 fixo).  
- **Domínios ausentes:** neutralizados para 0.5 durante inferência para evitar viés.

## Visualização 3D dos Exoplanetas

### 2.0 Tecnologias Frontend

- **React + Tailwind CSS** — interface responsiva e moderna  
- **Simulação 3D -> Three.js** — comparação visual entre Terra e exoplaneta  

### 2.1 Geração de Planetas

- **Componentes:** `Comparacao_Planets.jsx` e `Scene3d.jsx`  
- **Texturas:** geradas via app “Texture for Planets”  
- **Heurística visual:** presença ou ausência de nuvens conforme propriedades planetárias

### 2.2 Transformação de Dados Planetários

Modelo de temperatura de superfície:
\[
T_s = T_{eq}(1 + \tau)^{1/4}
\]

- Planetas maiores (até ~2.5 R⊕) → maior retenção atmosférica → maior efeito estufa  
- Insolação maior → mais umidade e feedbacks → maior efeito estufa (com limite superior)

---

## Infraestrutura Cloud

- **Google Cloud Storage (GCS):** armazenamento dos modelos e artefatos de calibração  
  - Organização por domínio e versão  

- **Vertex AI (REST API):** endpoint de inferência  
  **Fluxo:**
  1. Carrega artefatos do GCS para memória  
  2. Valida domínio e esquema de features  
  3. Pré-processa dados (imputação + padronização)  
  4. Executa predição e calibração  
  5. Aplica meta-votação entre domínios  
  6. Retorna JSON com probabilidades e labels  

- **Idempotência:** entradas idênticas → respostas determinísticas (sem retreinamento).

---

## Uso de Inteligência Artificial

O **ChatGPT** foi utilizado para:
- Estruturar e refinar scripts em Python  
- Auxiliar no pré-processamento, treinamento e avaliação dos modelos  
- Apoiar na criação do website e simulações 3D  
- Gerar documentação e imagens explicativas  

---

## Fontes de Dados

- [NASA Kepler Objects of Interest (KOI)](https://exoplanetarchive.ipac.caltech.edu/docs/Kepler_Objects_of_Interest.html)  
- [TESS Objects of Interest (TOI)](https://exofop.ipac.caltech.edu/tess/)  
- [K2 Planets and Candidates](https://exoplanetarchive.ipac.caltech.edu/docs/K2_planet_candidate_table.html)

---

